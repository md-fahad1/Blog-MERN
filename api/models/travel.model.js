import mongoose from "mongoose";

const travelSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: true,
    },
    tripDate: {
      type: Date,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Travel = mongoose.model("Travel", travelSchema);
export default Travel;
