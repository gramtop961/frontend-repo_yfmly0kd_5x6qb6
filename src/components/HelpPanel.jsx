import React from 'react';

export default function HelpPanel({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40">
      <aside className="w-full sm:w-[420px] h-full bg-[#0B132B]/95 backdrop-blur border-l border-white/10 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-[#C9D3E0]">Help & transparency</div>
          <button onClick={onClose} className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10">Close</button>
        </div>
        <div className="text-xs text-[#AEB9C6] space-y-3">
          <p>All processing runs locally on your laptop. No media leaves your device.</p>
          <p>Components used for coaching:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>FastAPI for local HTTP endpoints and orchestration</li>
            <li>onnxruntime for on-device inference (optional)</li>
            <li>MediaPipe for face landmarks and gaze proxies</li>
            <li>librosa for audio features like RMS and tempo proxies</li>
          </ul>
          <p>Rules-only mode provides deterministic cues without ML if advanced models are unavailable.</p>
          <p>Calibration collects a short baseline to set your personal green-zones.</p>
        </div>
      </aside>
    </div>
  );
}
