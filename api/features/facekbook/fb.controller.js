import Fb from "./fb.model.js";
import { errorHandler } from "../../utils/error.js";

// Create a new Fb entry
export const createFb = async (req, res, next) => {
  try {
    const { image, fbUrl } = req.body;

    if (!image || !fbUrl) {
      return next(errorHandler(400, "Image URL and fbUrl are required"));
    }

    const newFb = new Fb({ image, fbUrl });
    await newFb.save();

    res.status(201).json(newFb);
  } catch (error) {
    next(error);
  }
};

// Get all Fb entries
export const getFbs = async (req, res, next) => {
  try {
    const fbs = await Fb.find({});
    res.status(200).json(fbs);
  } catch (error) {
    next(error);
  }
};

// Get a single Fb entry by ID
export const getFbById = async (req, res, next) => {
  try {
    const fb = await Fb.findById(req.params.id);
    if (!fb) return next(errorHandler(404, "FB post not found"));
    res.status(200).json(fb);
  } catch (error) {
    next(error);
  }
};

// Update a Fb entry by ID
export const updateFb = async (req, res, next) => {
  try {
    const { image, fbUrl } = req.body;
    if (!image || !fbUrl) {
      return next(errorHandler(400, "Image URL and fbUrl are required"));
    }

    const updatedFb = await Fb.findByIdAndUpdate(
      req.params.id,
      { image, fbUrl },
      { new: true, runValidators: true }
    );

    if (!updatedFb) return next(errorHandler(404, "FB post not found"));

    res.status(200).json(updatedFb);
  } catch (error) {
    next(error);
  }
};

// Delete a Fb entry by ID
export const deleteFb = async (req, res, next) => {
  try {
    const deletedFb = await Fb.findByIdAndDelete(req.params.id);
    if (!deletedFb) return next(errorHandler(404, "FB post not found"));
    res.status(200).json({ message: "FB post deleted successfully" });
  } catch (error) {
    next(error);
  }
};
