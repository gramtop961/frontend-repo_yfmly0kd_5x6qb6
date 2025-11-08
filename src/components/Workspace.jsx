import React, { useEffect, useRef, useState } from 'react';
import { Settings, History, HelpCircle, Mic, Pause, Square } from 'lucide-react';
import Starfield from './Starfield';
import ReflectionPanel from './ReflectionPanel';
import HelpPanel from './HelpPanel';

export default function Workspace() {
  const [listening, setListening] = useState(false);
  const [simMode, setSimMode] = useState(true);
  const [rulesOnly, setRulesOnly] = useState(false);
  const [cpuThrottle, setCpuThrottle] = useState(0.6);
  const [audioOnly, setAudioOnly] = useState(false);
  const [hudCue, setHudCue] = useState(null);
  const [showReflection, setShowReflection] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [medianLatency, setMedianLatency] = useState(320);
  const [talkRatio, setTalkRatio] = useState(0.62);
  const [acceptPct, setAcceptPct] = useState(0.74);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const cueTimerRef = useRef(null);

  useEffect(() => {
    if (!audioOnly) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(s => {
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      }).catch(() => setAudioOnly(true));
    }
  }, [audioOnly]);

  useEffect(() => {
    if (!listening) return;
    cueTimerRef.current = setInterval(() => {
      const cues = ['Slow slightly', 'Lower volume', 'Turn toward camera'];
      const c = cues[Math.floor(Math.random() * cues.length)];
      setHudCue({ id: Date.now(), text: c });
      if (simMode) {
        setMedianLatency(v => Math.max(180, Math.min(600, v + (Math.random() - 0.5) * 30)));
        setTalkRatio(v => Math.max(0.3, Math.min(0.8, v + (Math.random() - 0.5) * 0.02)));
      }
    }, 3500);
    return () => clearInterval(cueTimerRef.current);
  }, [listening, simMode]);

  const toggleRecord = () => setListening(v => !v);
  const handleStop = () => { setListening(false); setShowReflection(true); };

  return (
    <div className="relative min-h-screen bg-[#0A0E1A] text-[#E5EAF0] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E1A] via-[#0B132B] to-[#0A0E1A]" />
      <Starfield />

      <TopBar onHelp={() => setShowHelp(v=>!v)} />

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-6 pb-24 grid grid-cols-[220px_1fr_280px] gap-6">
        <LeftControls
          listening={listening}
          simMode={simMode}
          setSimMode={setSimMode}
          cpuThrottle={cpuThrottle}
          setCpuThrottle={setCpuThrottle}
          audioOnly={audioOnly}
          setAudioOnly={setAudioOnly}
          rulesOnly={rulesOnly}
          setRulesOnly={setRulesOnly}
          onRecord={toggleRecord}
          onPause={() => setListening(false)}
          onStop={handleStop}
        />

        <CenterStage
          listening={listening}
          audioOnly={audioOnly}
          videoRef={videoRef}
          hudCue={hudCue}
        />

        <RightMetrics
          medianLatency={medianLatency}
          talkRatio={talkRatio}
          acceptPct={acceptPct}
          setAcceptPct={setAcceptPct}
        />
      </main>

      <ReflectionPanel open={showReflection} onClose={() => setShowReflection(false)} />
      <HelpPanel open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}

function TopBar({ onHelp }) {
  return (
    <div className="relative z-10 w-full px-6 py-3 flex items-center justify-between">
      <div className="text-sm tracking-wide text-[#C9D3E0]">Empathy Mirror</div>
      <div className="flex items-center gap-3 text-[#C9D3E0]">
        <button className="p-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10" aria-label="Settings"><Settings size={16} /></button>
        <button className="p-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10" aria-label="Session History"><History size={16} /></button>
        <button onClick={onHelp} className="p-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10" aria-label="Help"><HelpCircle size={16} /></button>
      </div>
    </div>
  );
}

function LeftControls({ listening, simMode, setSimMode, cpuThrottle, setCpuThrottle, audioOnly, setAudioOnly, rulesOnly, setRulesOnly, onRecord, onPause, onStop }) {
  return (
    <aside className="space-y-3">
      <Panel title="Session">
        <div className="flex items-center gap-2">
          <button onClick={onRecord} className={`flex-1 px-3 py-2 rounded-lg border text-sm transition ${listening ? 'bg-[#274690]/40 border-[#89CFF0]/30' : 'bg-[#1E3A8A]/40 border-[#89CFF0]/30'}`}>
            <div className="flex items-center justify-center gap-2"><Mic size={16} /> {listening ? 'Pause' : 'Record'}</div>
          </button>
          <button onClick={onPause} className="px-3 py-2 rounded-lg border text-sm bg-white/5 border-white/10"><Pause size={16} /></button>
          <button onClick={onStop} className="px-3 py-2 rounded-lg border text-sm bg-white/5 border-white/10"><Square size={16} /></button>
        </div>
      </Panel>

      <Panel title="Calibrate">
        <p className="text-xs text-[#AEB9C6] mb-2">15-second baseline capture — please speak normally.</p>
        <button className="w-full px-3 py-2 rounded-lg border text-sm bg-white/5 border-white/10">Start 15s Calibration</button>
      </Panel>

      <Panel title="Simulation & Fallbacks">
        <label className="flex items-center justify-between text-sm">
          <span>Simulated signal</span>
          <input type="checkbox" className="accent-[#89CFF0]" checked={simMode} onChange={e=>setSimMode(e.target.checked)} />
        </label>
        <label className="flex items-center justify-between text-sm mt-2">
          <span>CPU throttle</span>
          <input type="range" min={0.2} max={1} step={0.05} value={cpuThrottle} onChange={e=>setCpuThrottle(parseFloat(e.target.value))} />
        </label>
        <div className="text-xs text-[#AEB9C6] mt-1">CPU stress ~{Math.round((1-cpuThrottle)*100)}% reduction</div>
        <label className="flex items-center justify-between text-sm mt-3">
          <span>Audio-only fallback</span>
          <input type="checkbox" className="accent-[#89CFF0]" checked={audioOnly} onChange={e=>setAudioOnly(e.target.checked)} />
        </label>
        <label className="flex items-center justify-between text-sm mt-2">
          <span>Rules-only coaching</span>
          <input type="checkbox" className="accent-[#89CFF0]" checked={rulesOnly} onChange={e=>setRulesOnly(e.target.checked)} />
        </label>
        <p className="text-[11px] text-[#94A3B8] mt-2">All processing runs locally on your laptop. Rules-only mode provides deterministic guidance if advanced models are unavailable.</p>
      </Panel>
    </aside>
  );
}

function CenterStage({ listening, audioOnly, videoRef, hudCue }) {
  return (
    <section className="relative flex items-center justify-center">
      <div className="relative w-[480px] h-[360px] rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur">
        {!audioOnly ? (
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover opacity-90" />
        ) : (
          <AudioOnlyViz />
        )}
        <ConstellationAvatar active={listening} />
        <HUDCue cue={hudCue} />
      </div>
    </section>
  );
}

function RightMetrics({ medianLatency, talkRatio, acceptPct, setAcceptPct }) {
  return (
    <aside className="space-y-3">
      <Panel title="Live metrics">
        <Metric label="Pace (syll/min)" value={132} min={90} max={170} goodMin={110} goodMax={150} />
        <Metric label="Volume (RMS)" value={-18} min={-40} max={0} goodMin={-24} goodMax={-12} suffix=" dB" />
        <Metric label="Gaze yaw/pitch/roll" value="+4° / -2° / +1°" />
        <Metric label="Tone heuristic" value="neutral" color="#E5EAF0" />
        <div className="flex items-center justify-between text-xs mt-2">
          <span>Median hint latency</span>
          <span className="text-[#89CFF0]">{Math.round(medianLatency)} ms</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span>Talk ratio</span>
          <span className="text-[#89CFF0]">{Math.round(talkRatio*100)}%</span>
        </div>
        <div className="mt-3">
          <div className="text-xs mb-1">Cue acceptance</div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setAcceptPct(p=>Math.min(1, p + 0.02))} className="px-2 py-1 rounded-md bg-[#1E3A8A]/40 border border-[#89CFF0]/30 text-xs">Accepted</button>
            <button onClick={()=>setAcceptPct(p=>Math.max(0, p - 0.02))} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs">Rejected</button>
            <span className="ml-auto text-[#77DD77] text-xs">{Math.round(acceptPct*100)}%</span>
          </div>
        </div>
        <Timeline />
      </Panel>
    </aside>
  );
}

function Panel({ title, children }) {
  return (
    <div className="p-3 rounded-xl bg-white/5 backdrop-blur border border-white/10">
      <div className="text-[13px] mb-2 text-[#C9D3E0]">{title}</div>
      {children}
    </div>
  );
}

function Metric({ label, value, min, max, goodMin, goodMax, suffix = '' , color}) {
  const range = typeof min === 'number' && typeof max === 'number';
  const good = range && typeof goodMin === 'number' && typeof goodMax === 'number';
  const norm = range ? Math.max(0, Math.min(1, (value - min) / (max - min))) : 0;
  const goodStart = range && good ? Math.max(0, Math.min(1, (goodMin - min) / (max - min))) : 0.3;
  const goodEnd = range && good ? Math.max(0, Math.min(1, (goodMax - min) / (max - min))) : 0.7;
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between text-xs mb-1">
        <span>{label}</span>
        <span style={{ color: color || '#89CFF0' }}>{typeof value === 'number' ? value.toString() + suffix : value}</span>
      </div>
      {range && (
        <div className="h-2 rounded-full bg-white/10 overflow-hidden relative">
          <div className="absolute inset-y-0" style={{ left: `${goodStart*100}%`, width: `${(goodEnd-goodStart)*100}%`, background: 'linear-gradient(90deg, rgba(119,221,119,0.25), rgba(137,207,240,0.25))', boxShadow: '0 0 12px rgba(119,221,119,0.25)' }} />
          <div className="h-full bg-[#89CFF0] transition-all" style={{ width: `${norm*100}%` }} />
        </div>
      )}
    </div>
  );
}

function Timeline() {
  return (
    <div className="mt-3">
      <div className="text-xs mb-1">Cue timeline</div>
      <div className="h-8 rounded-lg bg-white/5 border border-white/10 flex items-center px-2 gap-2">
        {[8, 22, 40, 55, 70, 86].map((p, i) => (
          <div key={i} className="w-1 h-4 rounded bg-[#89CFF0]/60" style={{ marginLeft: `${p}%` }} />
        ))}
      </div>
    </div>
  );
}

function HUDCue({ cue }) {
  return (
    <div className={`absolute left-1/2 -translate-x-1/2 bottom-3 transition-all duration-500 ${cue ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="px-3 py-2 rounded-lg bg-[#0B132B]/70 border border-[#89CFF0]/20 text-sm shadow-[0_0_20px_rgba(137,207,240,0.15)]">
        {cue?.text || ' '} 
        <div className="text-[10px] text-[#94A3B8] text-center mt-1">one hint at a time</div>
      </div>
    </div>
  );
}

function ConstellationAvatar({ active }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 360" aria-hidden>
      <g className={`transition-opacity ${active ? 'opacity-90' : 'opacity-60'}`}>
        {[[140,130],[180,120],[240,130],[300,120],[340,130],[220,180],[260,180],[240,220]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={2.2} fill="#89CFF0" className="animate-pulse" style={{ animationDuration: `${2 + (i%3)}s` }} />
        ))}
        {[[140,130,180,120],[180,120,240,130],[240,130,300,120],[300,120,340,130],[220,180,260,180],[240,130,220,180],[240,130,260,180],[260,180,240,220],[220,180,240,220]].map((l,i)=>(
          <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="#89CFF0" strokeOpacity="0.3" />
        ))}
      </g>
    </svg>
  );
}

function AudioOnlyViz() {
  const [t, setT] = useState(0);
  useEffect(()=>{
    const id = setInterval(()=>setT(v=>v+1), 120);
    return ()=>clearInterval(id);
  },[]);
  const bars = new Array(24).fill(0).map((_,i)=> 6 + Math.abs(Math.sin((t+i)*0.3))*20 + Math.random()*6);
  return (
    <div className="w-full h-full flex items-end justify-center gap-1 p-6">
      {bars.map((h,i)=> (
        <div key={i} className="w-2 rounded-full bg-gradient-to-t from-[#1E3A8A] to-[#89CFF0] shadow-[0_0_12px_rgba(137,207,240,0.25)]" style={{ height: `${h}%`, opacity: 0.7 }} />
      ))}
    </div>
  );
}
