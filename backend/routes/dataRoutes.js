import express from "express";
import { metricsToDB, getDetections } from "../controllers/dataControllers.js";

const router = express.Router();

router.post("/create", metricsToDB)
router.get("/detections", getDetections)

export default router;