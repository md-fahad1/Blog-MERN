import express from "express";
import {
  createTravel,
  getTravels,
  deleteTravel,
  updateTravel,
} from "../controllers/travel.controller.js";

const router = express.Router();

router.post("/create", createTravel); // create travel
router.get("/gettravels", getTravels); // get all travels
router.delete("/deletetravel/:travelId", deleteTravel); // delete travel
router.put("/updatetravel/:travelId", updateTravel); // update travel

export default router;
