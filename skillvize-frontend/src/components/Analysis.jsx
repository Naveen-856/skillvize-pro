import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";

import AmbientBackground from "./AmbientBackground";

const Analysis = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0])
      setFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file && !jobDesc.trim()) return alert("Upload Resume & Job Description");
    if (!file) return alert("Please upload Resume (PDF/DOCX)");
    if (!jobDesc.trim()) return alert("Please paste Job Description");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDesc);

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert("Failed to analyze resume. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      <AmbientBackground />

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 max-w-6xl">

        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Skillvize <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Analysis</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Upload your resume and the job description to get an instant match score and a personalized improvement roadmap.
          </p>
        </div>

        {/* Inputs Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">

          {/* Resume */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl px-8 py-10 shadow-2xl min-h-[340px] flex flex-col justify-between">
            <label className="block text-sm font-medium text-slate-300 mb-2">Resume (PDF/DOCX)</label>

            <div
              className={`relative group border-2 border-dashed rounded-2xl p-8 transition-all duration-300 text-center cursor-pointer flex-1 flex items-center justify-center
              ${dragActive
                  ? "border-indigo-500 bg-indigo-500/10"
                  : file
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/50"
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />

              <div className="flex flex-col items-center gap-3">
                {file ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-emerald-400">{file.name}</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <UploadCloud className="w-6 h-6 text-indigo-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-300">
                      <span className="text-indigo-400">Click to upload</span> or drag & drop
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl px-8 py-10 shadow-2xl min-h-[340px] flex flex-col justify-between">
            <label className="block text-sm font-medium text-slate-300 mb-2">Job Description</label>

            <div className="relative flex-1">
              <textarea
                placeholder="Paste the full job description here..."
                className="w-full h-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="flex justify-center mb-14">
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`px-12 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all duration-300
              bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500
              hover:opacity-90 hover:shadow-[0_0_25px_rgba(56,147,255,0.6)]
              active:scale-[0.97] shadow-[0_0_15px_rgba(56,147,255,0.35)]
              ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-center gap-14 mb-12">

              {/* Score Circle */}
              <div className="relative flex-shrink-0">
                <svg width="200" height="200" className="rotate-[-90deg]">
                  <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="12" fill="none" className="text-slate-800" />
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={534}
                    strokeDashoffset={534 - (534 * result.match_score) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient"><stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#22d3ee" /></linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-bold ${getScoreColor(result.match_score)}`}>{result.match_score}%</span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Match</span>
                </div>
              </div>

              {/* Summary */}
              <div className="text-center md:text-left max-w-md">
                <h3 className="text-3xl font-bold text-white mb-2">Analysis Complete</h3>
                <p className="text-slate-300">
                  {result.match_score >= 80
                    ? "Excellent match! Your profile aligns perfectly with the requirements."
                    : "You're off to a good start — improve the missing skills below to boost your job match score."}
                </p>
              </div>
            </div>

            {/* Missing Skills */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-orange-400" />
                <h4 className="text-lg font-semibold text-white">Missing Keywords</h4>
              </div>
              {result.missing_skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.missing_skills.map((skill, idx) => (
                    <span key={idx} className="px-4 py-2 rounded-lg text-sm bg-orange-500/10 border border-orange-500/20 text-orange-300">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-300">No major skills missing. Great job!</span>
                </div>
              )}
            </div>

            {/* CTA */}
            {result.match_score < 80 && (
              <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 mt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h5 className="font-semibold text-white mb-1">Bridge the gap</h5>
                    <p className="text-sm text-slate-400">
                      Generate a tailored learning path to master these missing skills.
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/roadmap", { state: { skills: result.missing_skills } })}
                    className="group flex items-center gap-2 px-6 py-3 bg-white text-slate-950 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
                  >
                    Generate Roadmap
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;
