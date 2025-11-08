import React from 'react';
import { Shield, Activity, Eye } from 'lucide-react';
import StarfieldBackground from './StarfieldBackground';

export default function Landing({ onStart }) {
  const features = [
    { icon: Shield, title: 'Local & Private' },
    { icon: Activity, title: 'Calibrated Coaching' },
    { icon: Eye, title: 'Explainable Cues' },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0A0E1A] to-[#0B132B] text-[#E5EAF0]">
      <StarfieldBackground />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20">
        <header className="mb-16">
          <h1 className="text-center text-3xl md:text-4xl font-semibold tracking-tight">
            Empathy Mirror — a privacy-first, local speaking coach
          </h1>
          <p className="mt-4 text-center text-sm md:text-base text-[#C9D2E3]">
            Local on your laptop: real-time, explainable speaking feedback. No media leaves your device.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 md:p-5 flex items-center gap-3 hover:bg-white/[0.07] transition-colors"
            >
              <div className="p-2 rounded-lg bg-[#1E3A8A]/30 text-[#89CFF0]">
                <f.icon size={18} />
              </div>
              <div className="text-sm md:text-base">{f.title}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={onStart}
            className="px-5 py-2 rounded-lg text-sm md:text-base bg-[#274690] hover:bg-[#1E3A8A] text-[#E5EAF0] border border-white/10 shadow-lg shadow-[#89CFF0]/10 focus:outline-none focus:ring-2 focus:ring-[#89CFF0]/40"
            aria-label="Try Empathy Mirror now"
          >
            Try it now
          </button>
        </div>

        <footer className="mt-20 border-t border-white/10 pt-6 text-xs text-[#B7C2D6]">
          <nav className="flex flex-wrap gap-4 justify-center">
            <a className="hover:text-[#89CFF0]" href="#privacy">Privacy</a>
            <a className="hover:text-[#89CFF0]" href="#how">How It Works</a>
            <a className="hover:text-[#89CFF0]" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
            <a className="hover:text-[#89CFF0]" href="#about">About</a>
          </nav>
        </footer>
      </div>
    </section>
  );
}
