import express from "express";
import {
  createTravel,
  getTravels,
  deleteTravel,
  updateTravel,
  getTravel,
} from "../controllers/travel.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createTravel); // create travel
router.get("/gettravels", getTravels); // get all travels
router.delete("/deletetravel/:travelId", deleteTravel); // delete travel
router.get("/get/:travelId", getTravel);
router.put("/updatetravel/:travelId", updateTravel); // update travel

export default router;
