import { motion } from "framer-motion";
import { Target, Map, TrendingUp, Cpu, Smile, Zap } from "lucide-react";
import AmbientBackground from "./AmbientBackground";

const About = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="bg-black min-h-screen text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
            <AmbientBackground />

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">

                {/* Hero Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-center mb-24"
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-6">
                        About SkillVize
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        We are on a mission to democratize career growth by providing
                        <span className="text-white font-semibold"> AI-driven insights</span> and
                        <span className="text-white font-semibold"> actionable roadmaps</span> for everyone.
                    </p>
                </motion.div>

                {/* Mission Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="grid md:grid-cols-2 gap-12 items-center mb-32"
                >
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Target className="w-8 h-8 text-indigo-400" />
                            <h2 className="text-3xl font-bold text-white">Our Mission</h2>
                        </div>
                        <p className="text-slate-300 text-lg leading-loose">
                            In a rapidly evolving tech landscape, knowing <strong>what</strong> to learn is just as important as learning it. SkillVize bridges the gap between your current resume and your dream job.
                        </p>
                        <p className="text-slate-300 text-lg leading-loose">
                            We believe that every developer deserves a clear path to success, free from the noise of information overload.
                        </p>
                    </div>
                    <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800/50 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 aspect-square border border-slate-700/50">
                                <Smile className="w-8 h-8 text-yellow-400" />
                                <span className="font-semibold text-sm">User First</span>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 aspect-square border border-slate-700/50">
                                <Zap className="w-8 h-8 text-blue-400" />
                                <span className="font-semibold text-sm">Fast & Smart</span>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 aspect-square border border-slate-700/50 col-span-2">
                                <TrendingUp className="w-8 h-8 text-green-400" />
                                <span className="font-semibold text-sm">Constant Growth</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Features Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="mb-20"
                >
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What We Do</h2>
                        <div className="w-20 h-1 bg-indigo-500 mx-auto rounded-full" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Cpu className="w-8 h-8 text-cyan-400" />}
                            title="Resume Analysis"
                            description="Our AI engine scans your resume to identify skill gaps and provides instant feedback on where you stand in the market."
                        />
                        <FeatureCard
                            icon={<Map className="w-8 h-8 text-purple-400" />}
                            title="Smart Roadmaps"
                            description="Get personalized, step-by-step learning paths tailored to your specific goals and missing skills."
                        />
                        <FeatureCard
                            icon={<TrendingUp className="w-8 h-8 text-emerald-400" />}
                            title="Curated Resources"
                            description="Don't waste time searching. We provide the best YouTube videos, Coursera courses, and documentation for every step."
                        />
                    </div>
                </motion.div>

                {/* Footer Quote */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center py-20 border-t border-slate-800/50"
                >
                    <p className="text-2xl text-slate-500 font-light italic">
                        "The only way to do great work is to love what you do."
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

// Helper Component for Feature Cards
const FeatureCard = ({ icon, title, description }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
            className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/30 transition duration-300 hover:bg-slate-900/60 group"
        >
            <div className="bg-slate-800/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300 border border-slate-700/50">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
                {description}
            </p>
        </motion.div>
    );
};

export default About;
