import React from 'react';

export default function ReflectionPanel({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40">
      <div className="w-full md:w-[720px] max-h-[90vh] rounded-2xl overflow-hidden border border-white/10 bg-[#0B132B]/90 backdrop-blur shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="text-sm text-[#C9D3E0]">Session reflection</div>
          <button onClick={onClose} className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10">Close</button>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <SummaryCard label="Green-zone coverage" value="78%" good />
          <SummaryCard label="Median hint latency" value="312 ms" />
          <SummaryCard label="Cue acceptance" value="74%" good />
          <SummaryCard label="Talk ratio" value="62%" />
        </div>
        <div className="px-4 pb-4 flex items-center justify-between">
          <div className="text-xs text-[#94A3B8]">Saved locally (SQLite) • Export available</div>
          <button className="px-3 py-2 rounded-lg bg-[#1E3A8A]/40 border border-[#89CFF0]/30 text-sm">Export Text Summary</button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, good }) {
  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
      <div className="text-xs text-[#AEB9C6] mb-1">{label}</div>
      <div className="text-lg" style={{ color: good ? '#77DD77' : '#E5EAF0' }}>{value}</div>
      <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full" style={{ width: value, background: good ? 'linear-gradient(90deg, rgba(119,221,119,0.6), rgba(137,207,240,0.4))' : 'rgba(137,207,240,0.5)' }} />
      </div>
    </div>
  );
}
