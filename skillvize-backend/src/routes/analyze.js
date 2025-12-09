import express from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/analyzeController.js";

const upload = multer();
const router = express.Router();

router.post("/", upload.single("resume"), analyzeResume);

export default router;
