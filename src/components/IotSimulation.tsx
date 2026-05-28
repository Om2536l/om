import React, { useState, useEffect } from "react";
import { Cpu, Power, RefreshCw, Layers, ShieldCheck } from "lucide-react";

export default function IotSimulation() {
  const [voltage, setVoltage] = useState(230); // 220V - 240V
  const [current, setCurrent] = useState(1.42); // Amps
  const [status, setStatus] = useState<"ONLINE" | "STANDBY" | "OFFLINE">("ONLINE");
  const [freq, setFreq] = useState(50.0); // 49.5Hz - 50.5Hz
  const [waveSeconds, setWaveSeconds] = useState(0);

  useEffect(() => {
    let frame: number;
    const animateWave = () => {
      setWaveSeconds((prev) => (prev + 0.08) % (Math.PI * 2));
      frame = requestAnimationFrame(animateWave);
    };
    if (status === "ONLINE") {
      frame = requestAnimationFrame(animateWave);
    }
    return () => cancelAnimationFrame(frame);
  }, [status]);

  // Derive dynamic wattage
  const wattage = status === "ONLINE" ? Number((voltage * current).toFixed(1)) : status === "STANDBY" ? 4.2 : 0;

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-outline/10 shadow-lg relative overflow-hidden h-full flex flex-col justify-between group">
      
      {/* Absolute SVG grid for a circuit track background */}
      <div className="absolute right-0 bottom-0 opacity-[0.06] pointer-events-none -mr-16 -mb-16">
        <svg width="240" height="240" viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-primary" strokeWidth="1.5">
          <circle cx="50" cy="50" r="40" />
          <line x1="10" y1="50" x2="90" y2="50" />
          <line x1="50" y1="10" x2="50" y2="90" />
          <rect x="40" y="40" width="20" height="20" rx="3" fill="none" />
        </svg>
      </div>

      <div className="space-y-4 relative z-10 w-full">
        {/* Top telemetry state tags */}
        <div className="flex justify-between items-center">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Cpu className="w-6 h-6 animate-pulse-slow" />
          </div>

          <div className="flex gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-tight border ${
              status === "ONLINE"
                ? "bg-green-50 text-green-700 border-green-200"
                : status === "STANDBY"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status === "ONLINE" ? "bg-green-500 animate-pulse" : status === "STANDBY" ? "bg-amber-500" : "bg-red-500"}`} />
              {status}
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-display font-extrabold text-[#191c1d] text-2xl group-hover:text-primary transition-colors">
            Internet of Things (Edge Lab)
          </h3>
          <p className="text-on-surface-variant font-body text-xs mt-1 max-w-sm">
            Simulate an active ESP32 grid nodes monitoring energy fluctuations on high-frequency AC circuits.
          </p>
        </div>

        {/* Waves simulation screen */}
        <div className="bg-[#0b0c16] rounded-xl p-3 h-20 relative overflow-hidden border border-white/5 flex items-center justify-center">
          {status === "OFFLINE" ? (
            <div className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-widest animate-pulse">
              [SYSTEM SHUTDOWN - OFFLINE]
            </div>
          ) : (
            <svg className="w-full h-full" viewBox="0 0 300 60">
              <path
                fill="none"
                stroke={status === "ONLINE" ? "#5b5ee1" : "#d9dadb"}
                strokeWidth="2"
                d={Array.from({ length: 150 })
                  .map((_, i) => {
                    const x = (i / 149) * 300;
                    // Compute amplitude scaled by status and frequency
                    const mult = status === "ONLINE" ? (voltage - 180) / 40 : 0.15;
                    const y = 30 + Math.sin(i * 0.13 + waveSeconds * (freq / 50)) * 18 * mult;
                    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                  })
                  .join(" ")}
              />
            </svg>
          )}

          {/* Spark telemetry overlays */}
          {status === "ONLINE" && (
            <div className="absolute top-2 right-2 text-[8px] font-mono text-green-400">
              {freq.toFixed(1)} Hz F_IN
            </div>
          )}
        </div>

        {/* Telemetry settings sliders */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-outline block">Bus Voltage ({voltage}V)</label>
            <input
              type="range"
              min="200"
              max="245"
              step="1"
              disabled={status === "OFFLINE"}
              value={voltage}
              onChange={(e) => setVoltage(parseInt(e.target.value))}
              className="w-full accent-primary cursor-pointer disabled:opacity-30"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-outline block">Grid Freq ({freq.toFixed(1)}Hz)</label>
            <input
              type="range"
              min="48.5"
              max="51.5"
              step="0.1"
              disabled={status === "OFFLINE"}
              value={freq}
              onChange={(e) => setFreq(parseFloat(e.target.value))}
              className="w-full accent-primary cursor-pointer disabled:opacity-30"
            />
          </div>
        </div>
      </div>

      {/* Footer statistics gauges */}
      <div className="border-t border-outline/10 pt-4 mt-4 flex items-center justify-between font-mono text-xs text-on-surface">
        <div className="flex flex-col">
          <span className="text-[9px] text-outline uppercase">Active Load</span>
          <strong className="text-primary text-sm font-extrabold">{wattage} Watts</strong>
        </div>

        {/* Control utility options */}
        <div className="flex gap-1">
          {(["ONLINE", "STANDBY", "OFFLINE"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`p-1.5 rounded-lg border text-[9px] font-bold uppercase transition-all ${
                status === s
                  ? "bg-primary text-white border-primary"
                  : "bg-surface-container-low text-on-surface-variant border-outline/10 hover:bg-outline/10"
              }`}
            >
              <Power className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
