import express from "express";
import { generateRoadmap, getRoadmaps, deleteRoadmap } from "../controllers/roadmapController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, generateRoadmap);
router.get("/", auth, getRoadmaps);
router.delete("/:id", auth, deleteRoadmap);

export default router;
