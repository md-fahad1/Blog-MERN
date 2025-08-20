import imageCompression from "browser-image-compression";

// Compress until file size < 300KB
export const compressImage = async (file) => {
  let options = {
    maxSizeMB: 0.3, // initial target
    maxWidthOrHeight: 1280,
    useWebWorker: true,
    fileType: "image/webp",
  };

  try {
    let compressedFile = await imageCompression(file, options);

    // loop to ensure size < 300KB
    let quality = 0.8;
    while (compressedFile.size / 1024 > 300 && quality > 0.1) {
      options.maxSizeMB = (compressedFile.size / 1024 / 1024) * quality;
      compressedFile = await imageCompression(file, options);
      quality -= 0.1;
    }

    console.log(
      "Original:",
      (file.size / 1024 / 1024).toFixed(2),
      "MB -> Compressed:",
      (compressedFile.size / 1024).toFixed(2),
      "KB"
    );

    return compressedFile;
  } catch (error) {
    console.error("Image compression failed:", error);
    return file;
  }
};
