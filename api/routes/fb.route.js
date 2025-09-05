import express from "express";
import {
  createFb,
  getFbs,
  getFbById,
  updateFb,
  deleteFb,
} from "../controllers/fb.controller.js";

const router = express.Router();

// Create a new Fb entry
router.post("/create", createFb);

// Get all Fb entries
router.get("/all", getFbs);

// Get a single Fb entry by ID
router.get("/:id", getFbById);

// Update a Fb entry by ID
router.put("/update/:id", updateFb);

// Delete a Fb entry by ID
router.delete("/delete/:id", deleteFb);

export default router;
