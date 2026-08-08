import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase"; // make sure firebase is configured

const CreateFb = () => {
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fbUrl, setFbUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!imageFile) {
      setMessage("Please select an image file");
      return;
    }

    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      (error) => {
        console.error(error);
        setMessage("Image upload failed!");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageFile(null);
        setUploadProgress(0);
        // Save the URL in state
        setMessage("Image uploaded successfully!");
        // send the downloadURL + fbUrl to backend
        await saveToBackend(downloadURL);
      }
    );
  };

  const saveToBackend = async (downloadURL) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/fb/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: downloadURL, fbUrl }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setMessage("Saved successfully!");
      setFbUrl("");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while saving to backend");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !fbUrl) {
      setMessage("Please provide both image and Facebook URL");
      return;
    }
    await handleUpload();
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-200">
        Add Facebook Photo
      </h2>

      {message && (
        <div className="mb-4 text-center text-sm text-green-600 dark:text-green-400">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-600 dark:text-gray-300">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
          />
          {uploadProgress > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              Uploading: {uploadProgress}%
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1 text-gray-600 dark:text-gray-300">
            Facebook URL
          </label>
          <input
            type="text"
            value={fbUrl}
            onChange={(e) => setFbUrl(e.target.value)}
            placeholder="Enter Facebook URL"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-md transition-colors"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default CreateFb;
