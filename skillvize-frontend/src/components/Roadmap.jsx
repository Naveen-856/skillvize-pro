import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Trash2, ChevronDown, ChevronUp, ExternalLink, Loader2 } from "lucide-react";
import AmbientBackground from "./AmbientBackground";

const Roadmap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [generating, setGenerating] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch stored roadmaps from backend
  const getRoadmaps = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/roadmap", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setRoadmaps(Array.isArray(data) ? data : []);  // bulletproof safety
    } catch (err) {
      console.error("Error fetching roadmaps:", err);
      setRoadmaps([]);
    }
  };

  // Generate roadmap from skills (triggered from Analysis page)
  const generateRoadmap = async (skills) => {
    if (!skills || skills.length === 0) return;

    setGenerating(true);
    try {
      const res = await fetch("http://localhost:5000/api/roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skills }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate roadmap");
      }

      const data = await res.json();
      console.log("Roadmap generated:", data);

      // Refresh the list to show the new roadmap
      await getRoadmaps();
      setOpenIndex(0); // Auto-open the first (newest) roadmap
    } catch (err) {
      console.error("Error generating roadmap:", err);
      alert("Failed to generate roadmap. Make sure Ollama is running.");
    } finally {
      setGenerating(false);
    }
  };

  const dataFetchedRef = React.useRef(false);

  useEffect(() => {
    getRoadmaps();

    // Check if we were redirected from Analysis page with skills to generate
    if (location.state?.skills) {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;

      generateRoadmap(location.state.skills);
      // Clear the state to prevent re-generation on page refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this roadmap?")) return;
    try {
      await fetch(`http://localhost:5000/api/roadmap/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      getRoadmaps(); // refresh list
    } catch (err) {
      console.error("Error deleting roadmap:", err);
    }
  };

  const toggleView = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-24 relative overflow-hidden">
      <AmbientBackground />

      <div className="relative z-10">
        <h1 className="text-4xl font-extrabold text-center mb-14">
          Your <span className="text-indigo-400">Roadmaps</span>
        </h1>

        {/* Generating Indicator */}
        {generating && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-600/20 border border-indigo-500/30 rounded-lg">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
              <span className="text-indigo-300 font-medium">Generating your personalized roadmap...</span>
            </div>
          </div>
        )}

        {roadmaps.length === 0 ? (
          <p className="text-center text-slate-400 text-lg">
            No roadmaps available. Generate one from the <strong>Analysis</strong> page.
          </p>
        ) : (
          <div className="space-y-6 max-w-5xl mx-auto">
            {roadmaps.map((item, index) => {
              // Stored roadmap JSON safe parse
              const roadmapData =
                typeof item.roadmap_json === "string"
                  ? JSON.parse(item.roadmap_json || "[]")
                  : item.roadmap_json || [];

              return (
                <div
                  key={item.id}
                  className="bg-slate-900/70 border border-slate-700 p-6 rounded-2xl shadow-lg"
                >
                  {/* Title & Actions */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold tracking-wide">
                      Roadmap – {roadmapData.map((i) => i.skill).join(", ")}
                    </h2>

                    <div className="flex gap-3">
                      <button
                        className="flex items-center gap-1 text-sm px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
                        onClick={() => toggleView(index)}
                      >
                        {openIndex === index ? "Hide" : "View"}
                        {openIndex === index ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded roadmap view */}
                  {openIndex === index && (
                    <div className="mt-4 border-t border-slate-700 pt-6 space-y-10 animate-in fade-in duration-500">
                      {roadmapData.map((skillItem, i) => (
                        <div key={i} className="space-y-3">
                          <h3 className="text-2xl font-semibold text-cyan-300">
                            {skillItem.skill}
                          </h3>

                          <ul className="list-disc list-inside text-slate-300 space-y-1 ml-2">
                            {skillItem.steps.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ul>

                          {/* Resources */}
                          <div className="mt-3 space-y-2">
                            <p className="text-indigo-400 text-lg font-semibold">
                              Resources
                            </p>

                            <p className="font-medium text-slate-400">YouTube</p>
                            <div className="flex flex-wrap gap-3">
                              {skillItem.youtube.map((yt, j) => (
                                <a
                                  key={j}
                                  href={yt}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm hover:bg-slate-700 flex items-center gap-1 transition"
                                >
                                  Link <ExternalLink className="w-4 h-4" />
                                </a>
                              ))}
                            </div>

                            <p className="font-medium text-slate-400 mt-3">Coursera</p>
                            <div className="flex flex-wrap gap-3">
                              {skillItem.coursera.map((c, j) => (
                                <a
                                  key={j}
                                  href={c}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm hover:bg-slate-700 flex items-center gap-1 transition"
                                >
                                  Link <ExternalLink className="w-4 h-4" />
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Roadmap;
