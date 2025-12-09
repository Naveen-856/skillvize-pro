import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import analyzeRoutes from "./routes/analyze.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// REGISTER ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/analyze", analyzeRoutes);

app.get("/", (req, res) => res.send("API Working"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
