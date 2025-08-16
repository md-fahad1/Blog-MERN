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

export default function CreateTravelPost() {
  const dateRef = useRef(null);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({ tags: [] });
  const [publishError, setPublishError] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const navigate = useNavigate();

  // ---------------- Image Upload ----------------
  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image");
      return;
    }
    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      () => {
        setImageUploadError("Image upload failed");
        setImageUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUploadProgress(null);
          setImageUploadError(null);
          setFormData({ ...formData, image: downloadURL });
        });
      }
    );
  };

  // ---------------- Submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
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

  // ---------------- Tags ----------------
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

  // ---------------- Location Autocomplete ----------------
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
          {/* Title */}
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

          {/* Location & Date */}
          <div className="flex flex-col md:flex-row w-full relative gap-4">
            <div className="flex flex-col w-full md:w-1/2">
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Location
              </label>

              {/* Input wrapper */}
              <div className="relative w-full">
                <TextInput
                  type="text"
                  placeholder="City, Area"
                  required
                  value={formData.location || ""}
                  onChange={handleLocationChange}
                  className="w-full"
                />

                {/* Suggestions */}
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

                      const checkIns =
                        (
                          Math.floor(Math.random() * 1000) + 50
                        ).toLocaleString() + " check-ins";

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
                            <span className="text-gray-400 text-xs">
                              {checkIns}
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

          {/* Tags */}
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

          {/* Image Upload */}
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex items-center justify-between">
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              size="sm"
              onClick={handleUploadImage}
              disabled={imageUploadProgress}
            >
              {imageUploadProgress ? (
                <div className="w-14 h-14">
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}%`}
                  />
                </div>
              ) : (
                "Upload"
              )}
            </Button>
          </div>

          {imageUploadError && (
            <Alert color="failure">{imageUploadError}</Alert>
          )}

          {formData.image && (
            <div className="flex justify-center">
              <img
                src={formData.image}
                alt="upload"
                className="rounded-xl shadow-md w-full max-h-72 object-cover"
              />
            </div>
          )}

          {/* Description */}
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

          {/* Submit */}
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

// import { Alert, Button, FileInput, TextInput } from "flowbite-react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from "firebase/storage";
// import { app } from "../firebase";
// import { useRef, useState } from "react";
// import { CircularProgressbar } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import { useNavigate } from "react-router-dom";

// export default function CreateTravelPost() {
//   const dateRef = useRef(null);
//   const [file, setFile] = useState(null);
//   const [imageUploadProgress, setImageUploadProgress] = useState(null);
//   const [imageUploadError, setImageUploadError] = useState(null);
//   const [formData, setFormData] = useState({ tags: [] });
//   const [publishError, setPublishError] = useState(null);
//   const [tagInput, setTagInput] = useState("");
//   const navigate = useNavigate();

//   // Handle Image Upload
//   const handleUploadImage = async () => {
//     if (!file) {
//       setImageUploadError("Please select an image");
//       return;
//     }
//     setImageUploadError(null);
//     const storage = getStorage(app);
//     const fileName = new Date().getTime() + "-" + file.name;
//     const storageRef = ref(storage, fileName);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const progress =
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         setImageUploadProgress(progress.toFixed(0));
//       },
//       () => {
//         setImageUploadError("Image upload failed");
//         setImageUploadProgress(null);
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//           setImageUploadProgress(null);
//           setImageUploadError(null);
//           setFormData({ ...formData, image: downloadURL });
//         });
//       }
//     );
//   };

//   // Handle Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("/api/travel/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         setPublishError(data.message);
//         return;
//       }
//       navigate("/");
//     } catch (error) {
//       setPublishError("Something went wrong");
//     }
//   };

//   // Add Tag
//   const handleAddTag = () => {
//     if (tagInput.trim() === "") return;
//     if (formData.tags.includes(tagInput.trim())) return; // prevent duplicate
//     const newTags = [...formData.tags, tagInput.trim()];
//     setFormData({ ...formData, tags: newTags });
//     setTagInput("");
//   };

//   // Remove Tag
//   const handleRemoveTag = (tagToRemove) => {
//     const newTags = formData.tags.filter((tag) => tag !== tagToRemove);
//     setFormData({ ...formData, tags: newTags });
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-50 px-3">
//       <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-3xl">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-3">
//           <h1 className="text-2xl font-bold text-gray-800">
//             ✈️ Create Travel Post
//           </h1>
//         </div>

//         {/* Form */}
//         <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
//           {/* Title */}
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-600">
//               Title
//             </label>
//             <TextInput
//               type="text"
//               placeholder="Enter trip title"
//               required
//               onChange={(e) =>
//                 setFormData({ ...formData, title: e.target.value })
//               }
//             />
//           </div>

//           {/* Location */}
//           <div className="flex flex-row w-full gap-4">
//             {/* Location */}
//             <div className="flex flex-col w-1/2">
//               <label className="block mb-2 text-sm font-medium text-gray-600">
//                 Location
//               </label>
//               <TextInput
//                 type="text"
//                 placeholder="City, Country"
//                 required
//                 onChange={(e) =>
//                   setFormData({ ...formData, location: e.target.value })
//                 }
//               />
//             </div>

//             {/* Trip Date */}
//             <div className="flex flex-col w-1/2">
//               <label className="block mb-2 text-sm font-medium text-gray-600">
//                 Trip Date
//               </label>
//               <TextInput
//                 type="date"
//                 required
//                 ref={dateRef}
//                 onClick={() => dateRef.current?.showPicker()} // triggers date picker
//                 onChange={(e) =>
//                   setFormData({ ...formData, tripDate: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           {/* Tags with Add Button */}
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-600">
//               Tags
//             </label>
//             <div className="flex gap-2">
//               <TextInput
//                 type="text"
//                 placeholder="Add a tag..."
//                 value={tagInput}
//                 onChange={(e) => setTagInput(e.target.value)}
//               />
//               <Button
//                 type="button"
//                 gradientDuoTone="greenToBlue"
//                 onClick={handleAddTag}
//               >
//                 Add
//               </Button>
//             </div>
//             {/* Show tags */}
//             <div className="flex flex-wrap gap-2 mt-3">
//               {formData.tags.map((tag, idx) => (
//                 <span
//                   key={idx}
//                   className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
//                 >
//                   {tag}
//                   <button
//                     type="button"
//                     className="ml-2 text-red-500 hover:text-red-700"
//                     onClick={() => handleRemoveTag(tag)}
//                   >
//                     ✕
//                   </button>
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Image Upload */}
//           <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex items-center justify-between">
//             <FileInput
//               type="file"
//               accept="image/*"
//               onChange={(e) => setFile(e.target.files[0])}
//             />
//             <Button
//               type="button"
//               gradientDuoTone="purpleToBlue"
//               size="sm"
//               onClick={handleUploadImage}
//               disabled={imageUploadProgress}
//             >
//               {imageUploadProgress ? (
//                 <div className="w-14 h-14">
//                   <CircularProgressbar
//                     value={imageUploadProgress}
//                     text={`${imageUploadProgress || 0}%`}
//                   />
//                 </div>
//               ) : (
//                 "Upload"
//               )}
//             </Button>
//           </div>

//           {imageUploadError && (
//             <Alert color="failure">{imageUploadError}</Alert>
//           )}

//           {formData.image && (
//             <div className="flex justify-center">
//               <img
//                 src={formData.image}
//                 alt="upload"
//                 className="rounded-xl shadow-md w-full max-h-72 object-cover"
//               />
//             </div>
//           )}

//           {/* Description */}
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-600">
//               Description
//             </label>
//             <div className="border rounded-xl overflow-hidden">
//               <ReactQuill
//                 theme="snow"
//                 placeholder="Write something about your trip..."
//                 className="h-64"
//                 required
//                 onChange={(value) =>
//                   setFormData({ ...formData, description: value })
//                 }
//               />
//             </div>
//           </div>

//           {/* Submit */}
//           <Button
//             type="submit"
//             gradientDuoTone="purpleToPink"
//             className="rounded-xl py-2"
//           >
//             🚀 Publish
//           </Button>

//           {publishError && (
//             <Alert className="mt-3" color="failure">
//               {publishError}
//             </Alert>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }
