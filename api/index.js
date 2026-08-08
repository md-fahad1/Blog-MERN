// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import userRoutes from "./routes/user.route.js";
// import fbRoutes from "./routes/fb.route.js";
// import authRoutes from "./routes/auth.route.js";
// import postRoutes from "./routes/post.route.js";
// import commentRoutes from "./routes/comment.route.js";
// import travelRoutes from "./routes/travel.route.js";
// import uploadRoutes from "./routes/upload.route.js";
// import cookieParser from "cookie-parser";
// import path from "path";

// dotenv.config();

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDb is connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// const __dirname = path.resolve();

// const app = express();

// app.use(express.json());
// app.use(cookieParser());

// app.listen(3000, () => {
//   console.log("Server is running on port 3000!");
// });

// app.use("/api/user", userRoutes);
// app.use("/api/fb", fbRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/post", postRoutes);
// app.use("/api/comment", commentRoutes);
// app.use("/api/travel", travelRoutes);
// app.use("/api/upload", uploadRoutes);

// app.use(express.static(path.join(__dirname, "/client/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
// });

// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal Server Error";
//   res.status(statusCode).json({
//     success: false,
//     statusCode,
//     message,
//   });
// });

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./routes/user.route.js";
import fbRoutes from "./routes/fb.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import travelRoutes from "./routes/travel.route.js";
import uploadRoutes from "./routes/upload.route.js";

dotenv.config();

const app = express();

/* =========================
   CORS
========================= */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://blog-mern-bay.vercel.app",
    ],
    credentials: true,
  })
);

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================
   DATABASE
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

/* =========================
   API ROUTES
========================= */

app.use("/api/user", userRoutes);
app.use("/api/fb", fbRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/travel", travelRoutes);
app.use("/api/upload", uploadRoutes);

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Blog MERN API is running",
  });
});

/* =========================
   404 API HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "API route not found",
  });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(err);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});