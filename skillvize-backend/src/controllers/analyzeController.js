import { Ollama } from "ollama";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const ollama = new Ollama({ host: "http://127.0.0.1:11434" });

const extractPdfText = async (buffer) => {
  const uint8 = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({ data: uint8 });
  const pdf = await loadingTask.promise;
  let fullText = "";
  for (let p = 1; p <= pdf.numPages; p++) {
    const pageData = await pdf.getPage(p);
    const content = await pageData.getTextContent();
    fullText += content.items.map((i) => i.str).join(" ") + "\n";
  }
  return fullText;
};

export const analyzeResume = async (req, res) => {
  try {
    const { job_description } = req.body;
    const file = req.file;

    if (!file || !job_description) {
      return res.status(400).json({ error: "Resume and Job Description required" });
    }

    const resumeText = await extractPdfText(file.buffer);

    /* 🧠 Strict structured prompt — no hallucination */
    const prompt = `
      Extract ONLY hard skill keywords from the resume.
      Output JSON only: { "skills": [string] }

      RESUME:
      ${resumeText}
    `;

    const extractRes = await ollama.chat({
      model: "llama3",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    });

    // Extract JSON from response - handle markdown code blocks and extra text
    let content = extractRes.message.content;
    console.log("Raw Ollama Response (Analysis):", content.substring(0, 500)); // Debug log

    // Remove markdown code block formatting if present
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '');

    // Try to extract JSON object using non-greedy matching
    const skillsMatch = content.match(/\{\s*"skills"\s*:\s*\[[\s\S]*?\]\s*\}/);

    if (!skillsMatch) {
      console.error("No skills JSON found in response");
      throw new Error("Could not find valid JSON in LLM response");
    }

    let skillsJson;
    try {
      skillsJson = JSON.parse(skillsMatch[0]);
    } catch (err) {
      console.error("JSON parse error:", err.message);
      console.error("Attempted to parse:", skillsMatch[0]);
      throw new Error("Failed to parse Ollama response");
    }
    const resumeSkills = skillsJson.skills.map((s) => s.toLowerCase().trim());

    const jdSkills = job_description
      .split(/,|\n|-/)
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0);

    const matched = jdSkills.filter((skill) =>
      resumeSkills.some((r) => r.includes(skill))
    );

    const missing = jdSkills.filter((s) => !matched.includes(s));
    const score = Math.round((matched.length / jdSkills.length) * 100);

    return res.status(200).json({
      match_score: score,
      matched_skills: matched,
      missing_skills: missing,
      resume_skills: resumeSkills,
    });
  } catch (err) {
    console.error("Analysis error:", err);
    return res.status(500).json({ error: "Failed to analyze resume" });
  }
};
