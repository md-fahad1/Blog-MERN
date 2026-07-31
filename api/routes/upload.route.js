import express from "express";
import upload from "../utils/cloudinaryStorage.js";

const router = express.Router();

router.post("/", (req, res) => {
  upload.array("images", 10)(req, res, (err) => {
    if (err) {
      console.error("UPLOAD ERROR:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    try {
      const imageUrls = req.files.map((file) => file.path);

      res.status(200).json({
        success: true,
        images: imageUrls,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
});

export default router;