import { Ollama } from "ollama";
import db from "../database/db.js";

const ollama = new Ollama({ host: "http://127.0.0.1:11434" });

/* ─────────────────────────────
   1️⃣ GENERATE + SAVE ROADMAP
───────────────────────────── */
export const generateRoadmap = async (req, res) => {
  try {
    const { skills } = req.body;
    const userId = req.user.id;

    if (!skills || skills.length === 0) {
      return res.status(400).json({ error: "Skills array required" });
    }

    console.log("Generating roadmap for skills:", skills); // Debug log

    // ─────────────────────────────────────────────────────────────
    // 🛡️ DUPLICATE CHECK: Prevent generating same roadmap twice
    // ─────────────────────────────────────────────────────────────
    const existingStmt = db.prepare(
      "SELECT id, roadmap_json, created_at FROM roadmaps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1"
    );
    const lastRoadmap = existingStmt.get(userId);

    if (lastRoadmap) {
      const timeDiff = (new Date() - new Date(lastRoadmap.created_at)) / 1000; // seconds
      if (timeDiff < 60) { // Check if created in last 60 seconds
        try {
          const lastRoadmapData = JSON.parse(lastRoadmap.roadmap_json);
          // Extract skills from saved roadmap to compare
          const lastSkills = lastRoadmapData.map(r => r.skill).sort();
          const currentSkills = [...skills].sort();

          if (JSON.stringify(lastSkills) === JSON.stringify(currentSkills)) {
            console.log("Returning existing cached roadmap (duplicate request detected)");
            return res.status(200).json(lastRoadmapData);
          }
        } catch (e) {
          console.error("Error checking for duplicate:", e);
        }
      }
    }

    const prompt = `
You must create a learning roadmap for EVERY skill listed below. Do not skip any skills.

Skills to create roadmaps for: ${skills.join(", ")}

IMPORTANT: Generate one roadmap entry for EACH of the ${skills.length} skills listed above.

Return ONLY valid JSON array with NO additional text, explanation, or markdown formatting.

Required format (one object per skill):
[
  {
    "skill": "exact skill name from list",
    "steps": ["step 1", "step 2", "step 3"],
    "youtube_keywords": ["keyword 1", "keyword 2"],
    "coursera_keywords": ["keyword 1", "keyword 2"]
  }
]

Generate the JSON now:
    `;

    const response = await ollama.chat({
      model: "llama3",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    // Extract JSON from response - handle markdown code blocks and extra text
    let content = response.message.content;
    console.log("Raw Ollama Response:", content.substring(0, 500)); // Debug log

    // Remove markdown code block formatting if present
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '');

    // Try to extract JSON array using non-greedy matching
    const match = content.match(/\[\s*\{[\s\S]*?\}\s*\]/);
    if (!match) {
      console.error("No JSON found in response");
      throw new Error("Could not find valid JSON array in LLM response");
    }

    const jsonStr = match[0].trim();
    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (err) {
      console.error("JSON parse error:", err.message);
      console.error("Attempted to parse:", jsonStr);
      throw new Error("Failed to parse Ollama response");
    }

    // Validate that we got roadmaps for all requested skills
    if (parsed.length !== skills.length) {
      console.warn(`Expected ${skills.length} roadmaps but got ${parsed.length}`);
      console.warn("Requested skills:", skills);
      console.warn("Received skills:", parsed.map(p => p.skill));
    }

    const finalRoadmap = parsed.map((item) => ({
      skill: item.skill,
      steps: item.steps,
      youtube: item.youtube_keywords.map(
        (k) => `https://www.youtube.com/results?search_query=${encodeURIComponent(k)}`
      ),
      coursera: item.coursera_keywords.map(
        (k) => `https://www.coursera.org/search?query=${encodeURIComponent(k)}`
      ),
    }));

    const insertRoadmap = db.prepare(
      "INSERT INTO roadmaps (user_id, roadmap_json) VALUES (?, ?)"
    );
    insertRoadmap.run(userId, JSON.stringify(finalRoadmap));

    res.status(200).json(finalRoadmap);
  } catch (err) {
    console.error("Roadmap Error:", err);
    res.status(500).json({ error: "Roadmap generation failed" });
  }
};


/* ─────────────────────────────
   2️⃣ GET USER ROADMAPS
───────────────────────────── */
export const getRoadmaps = async (req, res) => {
  try {
    const userId = req.user.id;

    const stmt = db.prepare(
      "SELECT id, roadmap_json, created_at FROM roadmaps WHERE user_id = ? ORDER BY created_at DESC"
    );
    const rows = stmt.all(userId);

    const formatted = rows.map((row) => ({
      id: row.id,
      created_at: row.created_at,
      roadmap_json: row.roadmap_json,  // Keep as string for frontend to parse
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Roadmap fetch error:", err);
    res.status(500).json({ error: "Failed to fetch roadmaps" });
  }
};


/* ─────────────────────────────
   3️⃣ DELETE A ROADMAP
───────────────────────────── */
export const deleteRoadmap = async (req, res) => {
  try {
    const roadmapId = req.params.id;
    const userId = req.user.id;

    const stmt = db.prepare(
      "DELETE FROM roadmaps WHERE id = ? AND user_id = ?"
    );
    const result = stmt.run(roadmapId, userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    res.status(200).json({ message: "Roadmap deleted successfully" });
  } catch (err) {
    console.error("Roadmap delete error:", err);
    res.status(500).json({ error: "Failed to delete roadmap" });
  }
};
