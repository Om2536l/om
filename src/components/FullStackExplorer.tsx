import React, { useState } from "react";
import { X, Terminal, FileCode, Cpu, Lightbulb, Play, Layers } from "lucide-react";

interface CodeSnippet {
  id: string;
  name: string;
  language: string;
  category: "Firmware" | "AI Script" | "Circuit Analytics";
  code: string;
  explanation: string;
}

const LABS_DATA: CodeSnippet[] = [
  {
    id: "snip-1",
    name: "esp32_adc_oversampling.c",
    language: "C",
    category: "Firmware",
    explanation: "Implementing low-noise oversampling algorithms on ESP32 to increase ADC resolution from 12 bits to 14 bits without analog filtering hardware, maximizing signal clarity.",
    code: `#include "esp_adc_cal.h"
#include "esp_log.h"

#define ADC_OVERSAMPLE_SHIFT 4 // 16 samples = +2 bits resolution
#define SAMPLE_COUNT (1 << ADC_OVERSAMPLE_SHIFT)

uint32_t acquire_oversampled_signal() {
    uint32_t raw_accumulator = 0;
    
    // Low-level high-speed timing loop
    for (int i = 0; i < SAMPLE_COUNT; i++) {
        int raw_val = adc1_get_raw(ADC1_CHANNEL_6);
        raw_accumulator += raw_val;
        ets_delay_us(10); // Quiescent circuit settling time
    }
    
    // Scale accumulate signals back down to 14 bits
    uint32_t oversampled = raw_accumulator >> (ADC_OVERSAMPLE_SHIFT - 2); 
    ESP_LOGD("HW_ADC", "Oversample accumulation completed: Raw: %u, Scaled: %u", 
             raw_accumulator, oversampled);
             
    return oversampled;
}`
  },
  {
    id: "snip-2",
    name: "tiny_neural_network.py",
    language: "Python",
    category: "AI Script",
    explanation: "A custom feedforward layers blueprint initialized to deploy custom regression classification directly on low-resource ARM MCUs.",
    code: `import torch
import torch.nn as nn

class MCUEdgeClassifier(nn.Module):
    def __init__(self, input_nodes=2, hidden_nodes=4, output_nodes=1):
        super(MCUEdgeClassifier, self).__init__()
        # Meticulous low-parameter linear layers
        self.fc1 = nn.Linear(input_nodes, hidden_nodes, bias=True)
        self.activation = nn.ReLU()
        self.fc2 = nn.Linear(hidden_nodes, output_nodes, bias=True)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        # Forward pass optimized for linear mapping
        x1 = self.fc1(x)
        x1_act = self.activation(x1)
        out = self.fc2(x1_act)
        return self.sigmoid(out)

# Extract binary floating weight matrices for STM32 deployment
model = MCUEdgeClassifier()
weights = model.fc1.weight.data.numpy()
biases = model.fc1.bias.data.numpy()
print(f"FC1 Sync Weights Extracted:\\n {weights}")`
  },
  {
    id: "snip-3",
    name: "induction_motor_foc_sim.py",
    language: "Python",
    category: "Circuit Analytics",
    explanation: "Simulating speed tracking on dynamic load fluctuations inside field oriented ac machines, preventing magnetic saturation of motor coils.",
    code: `import numpy as np

def simulate_rotor_flux_alignment(isd_current, isq_current, R_rotor, L_rotor, theta_e):
    """
    Simulating stator control values conversion from dq-axis to alpha-beta axes.
    Helps isolate torque-producing current and flux-producing current.
    """
    # Park Transform matrix representation
    park_inv = np.array([
        [np.cos(theta_e), -np.sin(theta_e)],
        [np.sin(theta_e),  np.cos(theta_e)]
    ])
    
    currents_dq = np.array([isd_current, isq_current])
    currents_alphabeta = np.dot(park_inv, currents_dq)
    
    slip_speed_rads = (R_rotor / L_rotor) * (isq_current / (isd_current + 1e-9))
    return currents_alphabeta, slip_speed_rads`
  }
];

interface FullStackExplorerProps {
  onClose: () => void;
}

export default function FullStackExplorer({ onClose }: FullStackExplorerProps) {
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet>(LABS_DATA[0]);
  const [copied, setCopied] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [simOutput, setSimOutput] = useState<string | null>(null);

  React.useEffect(() => {
    const handleSetIndex = (e: any) => {
      const idx = (e as CustomEvent).detail;
      if (LABS_DATA[idx]) {
        setSelectedSnippet(LABS_DATA[idx]);
        setSimOutput(null);
      }
    };
    window.addEventListener("set-explorer-index", handleSetIndex);
    return () => window.removeEventListener("set-explorer-index", handleSetIndex);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateNode = () => {
    setExecuting(true);
    setSimOutput("Compiling lab binary...\nLinker flags checked.\nBooting VM execution registers...\n");
    
    setTimeout(() => {
      let output = "";
      if (selectedSnippet.id === "snip-1") {
        output += "[SUCCESS] ADC CALIB_VAL: OK\n";
        output += "Acquired register outputs over 10 epochs:\n";
        for (let i = 0; i < 5; i++) {
          const raw = Math.floor(Math.random() * 200 + 1800);
          output += `Samples batch #${i} accumulation -> Scaled 14-bit resolved: ${raw << 2}\n`;
        }
      } else if (selectedSnippet.id === "snip-2") {
        output += "Initializing PyTorch evaluation context...\n";
        output += "Model weights verified.\n";
        output += "Export code outputs to C header file successful:\n";
        output += `const float FC1_WEIGHTS[4][2] = {\n  {-0.45, 0.12}, {0.84, -0.62}, {-0.11, 0.44}, {0.31, -0.55}\n};\n`;
      } else {
        output += "FOC Speed controller alignment active.\n";
        output += "Calculated dynamic slip frequency:\n";
        output += `Theta_e Angle: PI/3 | Slip speed (W_sl): 1.45 rad/s\nAligned Alpha/Beta currents vector: [1.24A, 0.85A]\n`;
      }
      setSimOutput(prev => prev + output);
      setExecuting(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-on-background/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[2.5rem] border border-outline/10 shadow-2xl flex flex-col overflow-hidden animate-fade-in text-on-background">
        
        {/* Banner */}
        <div className="bg-[#111224] p-6 text-white flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/20 text-primary rounded-xl">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-2.5xl font-extrabold tracking-tight flex items-center gap-1.5">
                Full-Stack Laboratory Explorer
              </h3>
              <p className="text-white/60 text-xs font-body">Browse, review, and simulate Om's hardware-software co-design modules.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Explorer layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left snippets checklist */}
          <div className="w-full lg:w-80 border-r border-outline/10 bg-surface-container-low p-5 space-y-4">
            <div className="text-[10px] font-mono text-outline uppercase font-bold tracking-wider px-1">
              LABORATORY MODULES
            </div>
            <div className="space-y-1">
              {LABS_DATA.map((snip) => (
                <button
                  key={snip.id}
                  onClick={() => {
                    setSelectedSnippet(snip);
                    setSimOutput(null);
                  }}
                  className={`w-full px-4 py-3.5 rounded-2xl text-left transition-all flex flex-col gap-1 ${
                    selectedSnippet.id === snip.id
                      ? "bg-white border-l-4 border-primary shadow-md text-on-surface"
                      : "text-on-surface-variant hover:bg-white/50"
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full self-start">
                    {snip.category}
                  </span>
                  <div className="font-display font-extrabold text-xs flex items-center gap-1 mt-1 text-on-surface">
                    <FileCode className="w-3.5 h-3.5" />
                    {snip.name}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 space-y-2 mt-4">
              <h4 className="font-display font-bold text-xs text-primary flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                Hardware Integration
              </h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                These scripts are optimized for microcontrollers with limited RAM, keeping footprint low but accuracy high.
              </p>
            </div>
          </div>

          {/* Right code and dynamic output panel */}
          <div className="flex-1 flex flex-col p-6 overflow-hidden bg-surface-container-lowest">
            
            {/* Snippet details */}
            <div className="mb-4 space-y-1">
              <h4 className="font-display font-black text-on-surface text-lg">
                Interactive compiler representation: <span className="text-primary font-mono">{selectedSnippet.name}</span>
              </h4>
              <p className="text-on-surface-variant text-xs">
                {selectedSnippet.explanation}
              </p>
            </div>

            {/* Code editor visualization */}
            <div className="flex-1 min-h-[160px] bg-[#0c0d1b] rounded-2xl p-4 overflow-auto border border-white/5 font-mono text-xs max-h-[280px] text-white/90 relative group">
              
              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white/80 px-2.5 py-1 rounded text-[10px] font-sans transition-all z-10"
              >
                {copied ? "Copied!" : "Copy Code"}
              </button>
              
              <pre className="text-left font-mono leading-relaxed whitespace-pre font-medium text-blue-300">
                {selectedSnippet.code}
              </pre>
            </div>

            {/* Simulated Live Console Log compiler action */}
            <div className="mt-4 border-t border-outline/10 pt-4 flex-1 flex flex-col min-h-[140px] max-h-[220px]">
              
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-on-surface">
                  <Terminal className="w-4 h-4 text-primary" />
                  EMULATION CONSOLE RECORD
                </div>
                <button
                  onClick={handleSimulateNode}
                  disabled={executing}
                  className="bg-primary hover:bg-primary-container text-white text-xs px-4 py-1.5 rounded-xl font-mono font-semibold transition-all flex items-center gap-1 shadow-md"
                >
                  <Play className="w-3 h-3" />
                  {executing ? "Processing..." : "Compile & Run Emulation"}
                </button>
              </div>

              <div className="flex-1 bg-black rounded-xl p-3 font-mono text-[11px] overflow-auto text-green-400 border border-white/10 text-left">
                {simOutput ? (
                  <pre className="whitespace-pre-wrap">{simOutput}</pre>
                ) : (
                  <div className="text-white/40 italic flex items-center justify-center h-full">
                    Click "Compile & Run Emulation" to trace processor clock and memory leaks on the simulation node.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
