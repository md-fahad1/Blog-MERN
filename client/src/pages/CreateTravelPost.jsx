import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useRef, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { compressImage } from "../../utils/imageCompressor";
export default function CreateTravelPost() {
  const dateRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [imageUploadProgress, setImageUploadProgress] = useState({});
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({ tags: [], images: [] });
  const [publishError, setPublishError] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const navigate = useNavigate();

  const handleUploadImages = async () => {
    if (!files.length) {
      setImageUploadError("Please select at least one image");
      return;
    }
    setImageUploadError(null);
    const storage = getStorage(app);
    const uploadedURLs = [];
    for (const file of files) {
      const compressedFile = await compressImage(file);
      const fileName = new Date().getTime() + "-" + compressedFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);
      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageUploadProgress((prev) => ({
              ...prev,
              [file.name]: progress.toFixed(0),
            }));
          },
          (error) => {
            setImageUploadError("Image upload failed");
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            uploadedURLs.push(downloadURL);
            resolve();
          }
        );
      });
    }
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedURLs],
    }));
    setFiles([]);
    setImageUploadProgress({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.images.length) {
      setPublishError("Please upload at least one image");
      return;
    }
    try {
      const res = await fetch("/api/travel/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      navigate("/");
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() === "") return;
    if (formData.tags.includes(tagInput.trim())) return;
    const newTags = [...formData.tags, tagInput.trim()];
    setFormData({ ...formData, tags: newTags });
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = formData.tags.filter((tag) => tag !== tagToRemove);
    setFormData({ ...formData, tags: newTags });
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, location: value });
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const timeout = setTimeout(() => {
      if (value.length > 1) fetchLocationSuggestions(value);
      else setLocationSuggestions([]);
    }, 500);
    setDebounceTimeout(timeout);
  };

  const fetchLocationSuggestions = async (query) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )},Bangladesh&format=json&addressdetails=1`
      );
      const data = await res.json();
      setLocationSuggestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectLocation = (loc) => {
    setFormData({ ...formData, location: loc.display_name });
    setLocationSuggestions([]);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-3">
      <div className="bg-white shadow-xl rounded-2xl p-1 md:p-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          ✈️ Create Travel Post
        </h1>

        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Title
            </label>
            <TextInput
              type="text"
              placeholder="Enter trip title"
              required
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col md:flex-row w-full relative gap-4">
            <div className="flex flex-col w-full md:w-1/2">
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Location
              </label>
              <div className="relative w-full">
                <TextInput
                  type="text"
                  placeholder="City, Area"
                  required
                  value={formData.location || ""}
                  onChange={handleLocationChange}
                  className="w-full"
                />
                {formData.location && locationSuggestions.length > 0 && (
                  <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 z-50 max-h-60 overflow-y-auto rounded-md shadow-md">
                    {locationSuggestions.map((loc) => {
                      const addr = loc.address;
                      const mainTitle =
                        addr.city ||
                        addr.town ||
                        addr.village ||
                        addr.county ||
                        "Unknown";
                      const subTitle = [
                        addr.county || "",
                        addr.state_district || "",
                        addr.state || "",
                        addr.country || "",
                      ]
                        .filter(Boolean)
                        .join(", ");
                      return (
                        <li
                          key={loc.place_id}
                          onClick={() => handleSelectLocation(loc)}
                          className="flex items-start gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                        >
                          <div className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-md">
                            <FaMapMarkerAlt className="text-gray-600 text-lg" />
                          </div>
                          <div className="flex flex-col leading-tight">
                            <span className="font-semibold text-gray-900 text-sm">
                              {mainTitle}
                            </span>
                            <span className="text-gray-600 text-xs">
                              {subTitle}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex flex-col w-full md:w-1/2">
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Trip Date
              </label>
              <TextInput
                type="date"
                required
                ref={dateRef}
                onClick={() => dateRef.current?.showPicker()}
                onChange={(e) =>
                  setFormData({ ...formData, tripDate: e.target.value })
                }
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Tags
            </label>
            <div className="flex gap-2">
              <TextInput
                type="text"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                gradientDuoTone="greenToBlue"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col gap-2">
            <FileInput
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles([...e.target.files])}
            />
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              size="sm"
              onClick={handleUploadImages}
              disabled={Object.keys(imageUploadProgress).length > 0}
            >
              Upload Images
            </Button>
            {Object.keys(imageUploadProgress).length > 0 &&
              files.map((file) => (
                <div key={file.name} className="w-20 h-20">
                  <CircularProgressbar
                    value={imageUploadProgress[file.name] || 0}
                    text={`${imageUploadProgress[file.name] || 0}%`}
                  />
                </div>
              ))}
          </div>

          {imageUploadError && (
            <Alert color="failure">{imageUploadError}</Alert>
          )}

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
              {formData.images.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt={`upload-${idx}`}
                    className="rounded-xl shadow-md w-full h-40 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        images: formData.images.filter((_, i) => i !== idx),
                      })
                    }
                    className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 opacity-80 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Description
            </label>
            <div className="border rounded-xl overflow-hidden">
              <ReactQuill
                theme="snow"
                placeholder="Write something about your trip..."
                className="h-64"
                required
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
              />
            </div>
          </div>

          <Button
            type="submit"
            gradientDuoTone="purpleToPink"
            className="rounded-xl py-2"
          >
            🚀 Publish
          </Button>

          {publishError && (
            <Alert className="mt-3" color="failure">
              {publishError}
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
}
