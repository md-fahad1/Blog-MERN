import express from "express";
import { verifyToken } from "../middleware/verifyUser.js";
import {
  create,
  deletepost,
  getposts,
  updatepost,
  likePost,
} from "../features/post/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getposts", getposts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);
router.put("/likePost/:postId", likePost);

export default router;
