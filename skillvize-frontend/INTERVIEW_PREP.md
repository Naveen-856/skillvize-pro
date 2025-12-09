# SkillVize - Interview Preparation Guide

This document is designed to help you explain **SkillVize** confidently during technical interviews. It focuses on the "Why", the "How", and the tricky technical questions you might get asked.

---

## 🎤 1. The "Elevator Pitch"
*(Use this when asked: "Tell me about this project")*

> "SkillVize is an AI-powered career platform that bridges the gap between a developer's current resume and their target job. Unlike generic learning sites, it uses **local LLMs (Llama/Mistral via Ollama)** to perform a semantic analysis of the user's resume against a specific job description. It then generates a **personalized, step-by-step roadmap** to fill those skill gaps. I built it using **React** for a premium glassmorphic UI and **Node.js/Express** for the backend, focusing on performance and AI integration."

---

## 🧠 2. Deep Dive: Key Technical Concepts

### **A. Local AI Integration (The "Secret Sauce")**
*   **Concept**: Instead of paying for expensive OpenAI APIs, this project runs LLMs locally.
*   **How it works**: I used **Ollama** as an inference server. My backend sends a structured prompt to `http://localhost:11434/api/generate` and parses the JSON response.
*   **Why?**: Data privacy (resume stays local/on-prem), zero cost, and lower latency for development.

### **B. RAG-Lite (Retrieval Augmented Generation variant)**
*   **Concept**: Providing the LLM with specific context (Resume + Job Desc) so it doesn't hallucinate.
*   **Implementation**: I extract text from PDF/DOCX using `pdf-parse` and feed it directly into the prompt context window.

### **C. Performance & Caching**
*   **Problem**: Generating a roadmap takes time (10-30 seconds). Users might click "Generate" twice or refresh.
*   **Solution**: implemented a **Duplicate Check Mechanism**.
    *   Before calling the AI, the backend checks the database: *Did this user generate a roadmap with these exact skills in the last 60 seconds?*
    *   If **Yes**: Return the cached roadmap from the DB immediately (0ms latency).
    *   If **No**: Call the AI.

---

## ❓ 3. "Questionable Things" (Tricky Interview Questions)

Be prepared to answer these specific questions based on your code:

**Q1: "Why did you choose SQLite? Isn't it just for small apps?"**
> **Answer**: "For this use case, SQLite (via `better-sqlite3`) is perfect. It's serverless, incredibly fast (no network overhead), and allows me to focus on the AI logic rather than database management. Since this is a single-server deployment, the file-based locking is not an issue, and `better-sqlite3` offers synchronous performance that simplifies the async flow of AI generation."

**Q2: "Handling Long AI Requests in Node.js (Single Threaded)?"**
> **Answer**: "Node.js is single-threaded but non-blocking. The request to Ollama is an I/O operation (network fetch). While my server waits for Ollama to reply, the main thread is free to handle other user requests (like navigation or login). I use `async/await` to ensure the UI doesn't freeze."

**Q3: "How do you handle AI 'Hallucinations' (Wrong output)?"**
> **Answer**: "I use **Prompt Engineering**. I explicitly instruct the model to return *only* JSON format and restrict its output scope. On the frontend, I wrap the JSON parsing in `try/catch` blocks. If the model returns malformed data, I can handle it gracefully instead of crashing the app."

**Q4: "Your frontend has a lot of animations (Orbs, Glows). Does this hurt performance?"**
> **Answer**: "I optimized this carefully. The **Orb** is WebGL (runs on GPU), so it doesn't block the main JS thread. The ambient glows are simple CSS/divs with `pointer-events-none`, so they don't affect interactivity. I also use `Framer Motion`'s `layout` prop efficiently to ensure smooth 60fps transitions."

**Q5: "Why storing JWT in LocalStorage?"**
> **Answer**: "For this project scope, it provides a seamless user experience (persistence). In a production banking app, I would use `httpOnly` cookies to prevent XSS attacks, but for a portfolio project, LocalStorage with proper input sanitization is a standard and acceptable trade-off for ease of implementation."

---

## 🌟 4. Keywords to Mention
*   **Local Inference**
*   **Prompt Engineering**
*   **Rate Limiting / Caching**
*   **Component Reusability** (e.g., `AmbientBackground`)
*   **Full Stack Flow** (Frontend <-> API <-> DB <-> AI)
