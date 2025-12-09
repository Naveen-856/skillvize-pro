import React from 'react';
import Orb from './Orb';
import { useNavigate } from 'react-router-dom';
import AmbientBackground from "./AmbientBackground";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">

      <AmbientBackground />

      <div className="w-full h-[550px] md:h-[650px] relative overflow-hidden">
        <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Skillvize</h1>
          <p className="text-gray-300 mb-8 text-lg">This orb is hiding something, try hovering!</p>
          <div className="flex justify-center gap-7">
            <button className="bg-white text-black hover:bg-gray-700 hover:text-white px-6 py-3 rounded-lg font-medium" onClick={() => navigate("/analysis")}>
              Get Started
            </button>
            <button className="bg-gray-800 hover:bg-white hover:text-black px-6 py-3 rounded-lg font-medium border border-gray-600" onClick={() => navigate("/about")}>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Home;