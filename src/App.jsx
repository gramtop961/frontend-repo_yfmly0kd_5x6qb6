import React, { useState } from 'react';
import Landing from './components/Landing';
import Workspace from './components/Workspace';

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="min-h-screen font-[Inter]">
      {!started ? (
        <Landing onStart={() => setStarted(true)} />
      ) : (
        <Workspace />
      )}
    </div>
  );
}
