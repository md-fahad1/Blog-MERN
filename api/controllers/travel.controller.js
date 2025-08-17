import Travel from "../models/travel.model.js";
import { errorHandler } from "../utils/error.js";

// CREATE travel post (no auth)
// CREATE travel post (auth required for admin)
export const createTravel = async (req, res, next) => {
  try {
    if (
      !req.user.isAdmin ||
      !req.body.title ||
      !req.body.description ||
      !req.body.location ||
      !req.body.tripDate
    ) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    const newTravel = new Travel({
      ...req.body,
      slug,
      userId: req.user.id,
      images: Array.isArray(req.body.images)
        ? req.body.images
        : [req.body.images],
    });

    const savedTravel = await newTravel.save();
    res.status(201).json(savedTravel);
  } catch (error) {
    next(error);
  }
};

// GET all travels
export const getTravels = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const travels = await Travel.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.travelId && { _id: req.query.travelId }),
      ...(req.query.location && {
        location: { $regex: req.query.location, $options: "i" },
      }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { description: { $regex: req.query.searchTerm, $options: "i" } },
          { location: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalTravels = await Travel.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthTravels = await Travel.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      travels,
      totalTravels,
      lastMonthTravels,
    });
  } catch (error) {
    next(error);
  }
};
// controllers/travel.controller.js
export const getTravel = async (req, res, next) => {
  try {
    const travel = await Travel.findById(req.params.travelId);
    if (!travel) {
      return res.status(404).json({ message: "Travel post not found" });
    }
    res.status(200).json({ travel });
  } catch (error) {
    next(error);
  }
};

// DELETE travel (no auth)
export const deleteTravel = async (req, res, next) => {
  try {
    await Travel.findByIdAndDelete(req.params.travelId);
    res.status(200).json({ message: "Travel post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// UPDATE travel (no auth)
// UPDATE travel
export const updateTravel = async (req, res, next) => {
  try {
    const updatedTravel = await Travel.findByIdAndUpdate(
      req.params.travelId,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          images: Array.isArray(req.body.images)
            ? req.body.images
            : [req.body.images], // Make sure it's array
          location: req.body.location,
          tripDate: req.body.tripDate,
          tags: req.body.tags,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedTravel);
  } catch (error) {
    next(error);
  }
};
