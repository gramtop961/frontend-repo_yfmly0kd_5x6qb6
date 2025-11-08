import React, { useState } from 'react';
import Landing from './components/Landing';
import Workspace from './components/Workspace';
import Starfield from './components/Starfield';

export default function App() {
  const [entered, setEntered] = useState(false);
  return (
    <div className="font-inter relative min-h-screen bg-[#0A0E1A] text-[#E5EAF0] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E1A] via-[#0B132B] to-[#0A0E1A]" />
      <Starfield />
      <div className="relative z-10">
        {!entered ? <Landing onEnter={() => setEntered(true)} /> : <Workspace />}
      </div>
    </div>
  );
}
