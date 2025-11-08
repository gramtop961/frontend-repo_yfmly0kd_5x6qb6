import React, { useEffect, useRef, useState } from 'react';
import { Settings, HelpCircle, History, Mic, MicOff, Pause, Square, Play, Gauge, Cpu, Rocket, Check, X, Camera, CameraOff } from 'lucide-react';
import StarfieldBackground from './StarfieldBackground';
import { motion, AnimatePresence } from 'framer-motion';

function TopBar({ onOpenHelp, onOpenSettings, onOpenHistory }) {
  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-3 text-[#E5EAF0]">
      <div className="text-sm tracking-wide font-medium">Empathy Mirror</div>
      <div className="flex items-center gap-2 text-[#C9D2E3]">
        <button className="p-2 rounded-md hover:bg-white/5" aria-label="Settings" onClick={onOpenSettings}><Settings size={18} /></button>
        <button className="p-2 rounded-md hover:bg-white/5" aria-label="Session History" onClick={onOpenHistory}><History size={18} /></button>
        <button className="p-2 rounded-md hover:bg-white/5" aria-label="Help" onClick={onOpenHelp}><HelpCircle size={18} /></button>
      </div>
    </div>
  );
}

function ConstellationAvatar({ listening }) {
  // simple SVG constellation face that pulses when listening
  return (
    <svg viewBox="0 0 240 180" className="w-40 h-28 opacity-70">
      <g fill="#89CFF0" fillOpacity="0.6" stroke="#89CFF0" strokeOpacity="0.5">
        <circle cx="80" cy="70" r={listening ? 4.5 : 3.5} />
        <circle cx="160" cy="70" r={listening ? 4.5 : 3.5} />
        <circle cx="120" cy="110" r={listening ? 3.8 : 3} />
        <polyline points="80,70 120,110 160,70" fill="none" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

function WebcamFrame({ audioOnly, listening }) {
  return (
    <div className="relative w-[480px] h-[360px] rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md">
      {!audioOnly ? (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          {/* Webcam preview placeholder rectangle; in implementation we'd stream video here */}
          <div className="w-full h-full bg-gradient-to-br from-[#0B132B] to-[#0A0E1A]" />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-36 h-36 rounded-full bg-[#1E3A8A]/30 border border-[#89CFF0]/30"
            animate={{ boxShadow: audioOnly ? ['0 0 0 0 rgba(137,207,240,0.4)', '0 0 0 20px rgba(137,207,240,0)'] : '0 0 0 0 rgba(0,0,0,0)' }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <motion.div animate={{ opacity: listening ? [0.5, 1, 0.5] : 0.5 }} transition={{ duration: 3, repeat: Infinity }}>
          <ConstellationAvatar listening={listening} />
        </motion.div>
      </div>
    </div>
  );
}

function HUDCue({ cue }) {
  return (
    <AnimatePresence>
      {cue && (
        <motion.div
          key={cue.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="px-4 py-2 rounded-lg bg-[#0B132B]/80 border border-white/10 text-[#E5EAF0] text-sm shadow-lg"
        >
          {cue.text}
          <div className="text-[10px] text-[#B7C2D6] mt-0.5">one hint at a time</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ControlsColumn({ state, setState }) {
  const toggle = (key) => setState((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="flex flex-col gap-3 text-[#E5EAF0]">
      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => setState((s) => ({ ...s, running: true, paused: false }))} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#274690] hover:bg-[#1E3A8A] border border-white/10"><Play size={16}/> Record</button>
        <button onClick={() => setState((s) => ({ ...s, paused: !s.paused }))} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"><Pause size={16}/> Pause</button>
        <button onClick={() => setState((s) => ({ ...s, running: false, paused: false, showReflection: true }))} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"><Square size={16}/> Stop</button>
      </div>

      <button onClick={() => setState((s) => ({ ...s, calibrating: true }))} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10">
        <span className="flex items-center gap-2"><Gauge size={16}/> Calibrate (15s)</span>
        <span className="text-[11px] text-[#B7C2D6]">baseline</span>
      </button>

      <div className="rounded-lg p-3 border border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2"><Rocket size={16}/> Simulate Mode</div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={state.simulate} onChange={() => toggle('simulate')} aria-label="Toggle Simulate Mode" />
          <div className="flex items-center gap-1 text-[11px] text-[#B7C2D6]"><Cpu size={14}/> CPU {state.cpu}%</div>
        </div>
      </div>

      <div className="rounded-lg p-3 border border-white/10 bg-white/5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="text-sm">Throttle</div>
          <div className="text-[11px] text-[#B7C2D6]">Stress proxy</div>
        </div>
        <input type="range" min="10" max="100" value={state.cpu} onChange={(e) => setState((s)=> ({...s, cpu: Number(e.target.value)}))} />
      </div>

      <div className="rounded-lg p-3 border border-white/10 bg-white/5 flex flex-col gap-2">
        <label className="flex items-center justify-between cursor-pointer">
          <span>Quick Fallback</span>
          <input type="checkbox" checked={state.fallback} onChange={() => toggle('fallback')} aria-label="Toggle Quick Fallback" />
        </label>
        <div className="text-[11px] text-[#B7C2D6]">audio-only / rules-only</div>
      </div>
    </div>
  );
}

function MetricRow({ label, value, zone, detail }) {
  const good = zone === 'good';
  return (
    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
      <div className="flex items-center justify-between text-[#E5EAF0]">
        <div className="text-sm">{label}</div>
        <div className={`text-sm ${good ? 'text-[#77DD77]' : 'text-[#89CFF0]'}`}>{value}</div>
      </div>
      {detail && <div className="mt-1 text-[11px] text-[#B7C2D6]">{detail}</div>}
      <div className={`mt-2 h-1.5 rounded-full bg-black/20 relative overflow-hidden`}> 
        <div className={`absolute inset-y-0 left-1/4 right-1/4 rounded-full ${good ? 'bg-[#77DD77]/40' : 'bg-[#89CFF0]/30'} blur-sm`}></div>
      </div>
    </div>
  );
}

function RightMetrics({ state, acceptCue, rejectCue }) {
  return (
    <div className="flex flex-col gap-3">
      <MetricRow label="Pace" value={`${state.pace} spm`} zone={state.paceZone} detail="green-zone centered" />
      <MetricRow label="Volume" value={`${state.volume} dB`} zone={state.volumeZone} detail="RMS proxy" />
      <MetricRow label="Gaze" value={`yaw ${state.yaw}° / pitch ${state.pitch}°`} zone={state.gazeZone} detail="roll tracked" />
      <MetricRow label="Tone" value={state.tone} zone={state.tone === 'neutral' ? 'good' : 'warn'} detail="positivity optional" />

      <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-[#E5EAF0]">
        <div className="text-sm mb-2">Cue actions</div>
        <div className="flex items-center gap-2">
          <button onClick={acceptCue} className="px-3 py-1.5 rounded-md bg-[#1E3A8A] border border-white/10 text-xs flex items-center gap-1"><Check size={14}/> Accepted</button>
          <button onClick={rejectCue} className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs flex items-center gap-1"><X size={14}/> Dismiss</button>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-[#E5EAF0] text-sm">
        <div>Median hint latency: <span className="text-[#89CFF0]">{state.latency} ms</span></div>
        <div>Talk ratio: <span className="text-[#89CFF0]">{state.talkRatio}%</span></div>
        <div className="mt-2 h-8 rounded bg-black/20 relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-[#89CFF0]/30" style={{ width: `${state.timelinePct}%` }} />
        </div>
        <div className="text-[11px] text-[#B7C2D6] mt-1">timeline of cue activity</div>
      </div>
    </div>
  );
}

function ReflectionDrawer({ open, onClose, state }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.35 }} className="fixed left-0 right-0 bottom-0 z-30">
          <div className="mx-auto max-w-6xl rounded-t-2xl bg-[#0B132B]/95 backdrop-blur-xl border-t border-white/10 p-6 text-[#E5EAF0]">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm">Session reflection</div>
              <button className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs" onClick={onClose}>Close</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <SummaryCard label="Green-zone %" value={`${state.greenZone}%`} good />
              <SummaryCard label="Median latency" value={`${state.latency} ms`} />
              <SummaryCard label="Cue acceptance" value={`${state.acceptance}%`} good />
              <SummaryCard label="Talk ratio" value={`${state.talkRatio}%`} />
              <SummaryCard label="Saved" value="SQLite ✓" good />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-[11px] text-[#B7C2D6]">Soft metrics visualized with glowing bars</div>
              <button className="px-3 py-1.5 rounded-md bg-[#1E3A8A] border border-white/10 text-xs">Export Text Summary</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SummaryCard({ label, value, good }) {
  return (
    <div className="rounded-xl p-3 bg-white/5 border border-white/10">
      <div className="text-[11px] text-[#B7C2D6]">{label}</div>
      <div className={`mt-1 text-sm ${good ? 'text-[#77DD77]' : 'text-[#E5EAF0]'}`}>{value}</div>
      <div className={`mt-2 h-2 rounded-full ${good ? 'bg-[#77DD77]/30' : 'bg-[#89CFF0]/20'} relative overflow-hidden`}>
        <div className={`absolute inset-y-0 left-0 ${good ? 'bg-[#77DD77]/60' : 'bg-[#89CFF0]/40'}`} style={{ width: '66%' }} />
      </div>
    </div>
  );
}

function SlideOver({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} transition={{ duration: 0.3 }} className="fixed top-0 right-0 bottom-0 w-full max-w-md z-40">
          <div className="h-full bg-[#0B132B]/95 backdrop-blur-xl border-l border-white/10 text-[#E5EAF0] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm">{title}</div>
              <button className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs" onClick={onClose}>Close</button>
            </div>
            <div className="text-xs text-[#C9D2E3]">
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Workspace() {
  const [state, setState] = useState({
    running: false,
    paused: false,
    calibrating: false,
    simulate: true,
    cpu: 55,
    fallback: false,
    audioOnly: false,
    listening: true,
    pace: 138,
    paceZone: 'good',
    volume: -18,
    volumeZone: 'good',
    yaw: 4,
    pitch: -3,
    gazeZone: 'good',
    tone: 'neutral',
    latency: 320,
    talkRatio: 62,
    timelinePct: 40,
    showReflection: false,
  });

  const [cue, setCue] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [countdown, setCountdown] = useState(15);

  // Simulated cues
  useEffect(() => {
    if (!state.running || state.paused) return;
    const i = setInterval(() => {
      const samples = ['Slow slightly', 'Lower volume a notch', 'Turn toward camera briefly'];
      const text = samples[Math.floor(Math.random() * samples.length)];
      setCue({ id: Date.now(), text });
    }, 4000);
    return () => clearInterval(i);
  }, [state.running, state.paused]);

  // Calibration modal countdown
  useEffect(() => {
    if (!state.calibrating) return;
    setCountdown(15);
    const id = setInterval(() => setCountdown((c) => {
      if (c <= 1) { clearInterval(id); setState((s)=> ({...s, calibrating: false})); }
      return Math.max(0, c - 1);
    }), 1000);
    return () => clearInterval(id);
  }, [state.calibrating, setState]);

  const acceptCue = () => {
    setCue(null);
    setState((s) => ({ ...s, acceptance: Math.min(100, (s.acceptance || 64) + 1) }));
  };
  const rejectCue = () => setCue(null);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0A0E1A] to-[#0B132B]">
      <StarfieldBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6 py-4">
        <TopBar onOpenHelp={() => setHelpOpen(true)} onOpenSettings={() => setSettingsOpen(true)} onOpenHistory={() => setHistoryOpen(true)} />

        <div className="mt-4 grid grid-cols-1 md:grid-cols-[240px,1fr,280px] gap-4 items-start">
          <ControlsColumn state={state} setState={setState} />

          <div className="flex flex-col items-center gap-4">
            <WebcamFrame audioOnly={state.audioOnly || state.fallback} listening={state.listening} />
            <div className="h-10 flex items-center justify-center">
              <HUDCue cue={cue} />
            </div>
            <div className="flex items-center gap-2 text-[#B7C2D6] text-xs">
              <Camera size={14}/> <span>Camera</span>
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" checked={!state.audioOnly} onChange={(e)=> setState((s)=> ({...s, audioOnly: !e.target.checked}))} aria-label="Toggle camera"/>
                <span className="text-[11px]">{state.audioOnly ? 'Off' : 'On'}</span>
              </label>
              <span className="mx-2 opacity-40">·</span>
              <Mic size={14}/> <span>Mic</span>
              <span className="text-[11px]">On</span>
            </div>
          </div>

          <RightMetrics state={state} acceptCue={acceptCue} rejectCue={rejectCue} />
        </div>

        <ReflectionDrawer open={state.showReflection} onClose={() => setState((s)=> ({...s, showReflection:false}))} state={{ ...state, greenZone: 72, acceptance: state.acceptance || 64 }} />
      </div>

      <SlideOver open={historyOpen} onClose={() => setHistoryOpen(false)} title="Session History">
        <div className="space-y-2">
          {[1,2,3].map((i)=> (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10">
              <div className="w-14 h-10 rounded bg-gradient-to-br from-[#1E3A8A]/40 to-[#274690]/40" />
              <div>
                <div className="text-[#E5EAF0]">Session {i}</div>
                <div className="text-[11px] text-[#B7C2D6]">metrics and cues</div>
              </div>
              <div className="ml-auto">
                <button className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs" onClick={() => {}}>Open</button>
              </div>
            </div>
          ))}
        </div>
      </SlideOver>

      <SlideOver open={helpOpen} onClose={() => setHelpOpen(false)} title="Help & Transparency">
        <ul className="list-disc pl-5 space-y-1">
          <li>All processing runs locally on your laptop. No media leaves your device.</li>
          <li>Backend components: FastAPI for routing, onnxruntime for on-device models, MediaPipe for face/gaze, librosa for audio features.</li>
          <li>Use Simulate Mode to visualize the interface without a camera or mic.</li>
          <li>Rules-only coaching is available if model control is unavailable.</li>
        </ul>
      </SlideOver>

      <SlideOver open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Settings">
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span>Rules-only coaching</span>
            <input type="checkbox" />
          </label>
          <div className="p-2 rounded bg-white/5 border border-white/10 text-[11px] text-[#B7C2D6]">
            If MCP is unavailable, rules-based hints provide gentle guidance.
          </div>
        </div>
      </SlideOver>

      <AnimatePresence>
        {state.calibrating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="max-w-md w-full rounded-2xl bg-[#0B132B] border border-white/10 p-5 text-[#E5EAF0]">
              <div className="text-sm mb-1">Calibration</div>
              <div className="text-xs text-[#B7C2D6] mb-3">15-second baseline capture — please speak normally.</div>
              <div className="h-24 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <div className="text-3xl font-medium text-[#89CFF0]">{countdown}</div>
              </div>
              <div className="text-[11px] text-[#B7C2D6] mt-2">baseline ranges are estimated for pace, volume, gaze</div>
              <div className="mt-3 flex justify-end">
                <button className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs" onClick={() => setState((s)=> ({...s, calibrating:false}))}>Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
