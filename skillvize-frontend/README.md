# SkillVize - Project Summary & Concepts

## 🚀 Project Overview
*SkillVize* is an AI-powered career acceleration platform designed to help users bridge the gap between their current skills and their dream job. It analyzes resumes against job descriptions and generates personalized learning roadmaps.

## 🛠 Technology Stack

### Frontend
- *Framework*: React.js (Vite)
- *Styling*: Tailwind CSS (Utility-first CSS)
- *Animations*: Framer Motion (Page transitions, scroll reveals), OGL (Interactive 3D Orb)
- *Icons*: Lucide React
- *Routing*: React Router DOM

### Backend
- *Runtime*: Node.js & Express.js
- *Database*: SQLite (via better-sqlite3) for storing users and roadmaps.
- *AI Integration*: Ollama (Interacting with local LLMs like Llama 3 or Mistral).
- *File Handling*: Multer (File uploads), PDF-Parse (Text extraction).

## 💡 Key Architectural Concepts

### 1. AI-Driven Analysis (RAG-Lite)
- The core logic involves *Retrieval-Augmented Generation (RAG)* principles.
- *Process*: 
  1. Extract text from uploaded Resume (PDF/DOCX).
  2. Combine with Job Description.
  3. Construct a specific prompt for the LLM to output structured JSON.
  4. Parse LLM response to display "Match Score" and "Missing Skills".

### 2. Dynamic Content Generation
- *Roadmaps* are generated on-the-fly using the LLM based on identified skill gaps.
- To prevent abuse and speed up the user experience, we implemented *Duplicate Prevention*:
  - The backend checks if a roadmap for the same skills was created recently (last 60s) and returns the cached version.

### 3. Modern UI/UX Design Standards
- *Glassmorphism*: Extensive use of backdrop-blur, semi-transparent backgrounds (bg-slate-900/50), and subtle borders to create depth.
- *Ambient Aesthetics*: A centralized AmbientBackground component provides a consistent, glowing atmosphere across all pages (Login, Register, Home, About, Analysis, Roadmap).
- *Interactive Elements*: 
  - The *3D Orb* on the home page reacts to mouse hover, created with WebGL (ogl).
  - *Framer Motion* is used for "staggered" entry animations (e.g., in the About page features grid).

### 4. Secure & Persistent State
- *Authentication*: JWT (JSON Web Token) based persistence. User sessions are managed via localStorage and protected routes (ProtectedRoute, AuthRestrictedRoute).
- *Navigation*: The useNavigate hook manages flow between Analysis -> Roadmap generation seamlessly.