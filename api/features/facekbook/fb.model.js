import mongoose from "mongoose";
const fbSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    fbUrl: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);
const Fb = mongoose.model("Fb", fbSchema);
export default Fb;
