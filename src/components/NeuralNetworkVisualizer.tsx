import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Plus, Minus, Cpu, HelpCircle, Activity, Info, Zap } from "lucide-react";

interface Neuron {
  id: string;
  layer: number;
  val: number;
  bias: number;
}

interface Synapse {
  fromId: string;
  toId: string;
  weight: number;
}

export default function NeuralNetworkVisualizer() {
  const [layers, setLayers] = useState<number[]>([2, 4, 3, 1]); // default nodes per layer
  const [neurons, setNeurons] = useState<Neuron[]>([]);
  const [synapses, setSynapses] = useState<Synapse[]>([]);
  const [activation, setActivation] = useState<"ReLU" | "Sigmoid" | "Tanh">("ReLU");
  const [dataset, setDataset] = useState<"XOR" | "Circle" | "Linear">("XOR");
  const [isPlaying, setIsPlaying] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState<number[]>([0.8, 0.65, 0.52, 0.41, 0.32, 0.25]);
  const [selectedSynapse, setSelectedSynapse] = useState<Synapse | null>(null);
  const [activeSignal, setActiveSignal] = useState<number | null>(null);
  const [hoverNodeInfo, setHoverNodeInfo] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize nodes and connections
  useEffect(() => {
    let newNeurons: Neuron[] = [];
    let newSynapses: Synapse[] = [];

    // Gen neurons
    layers.forEach((count, lIdx) => {
      for (let i = 0; i < count; i++) {
        const id = `n-${lIdx}-${i}`;
        newNeurons.push({
          id,
          layer: lIdx,
          val: Math.random() * 0.8 + 0.1,
          bias: Number((Math.random() * 0.4 - 0.2).toFixed(2)),
        });
      }
    });

    // Gen synapses
    for (let l = 0; l < layers.length - 1; l++) {
      const currentLayer = newNeurons.filter((n) => n.layer === l);
      const nextLayer = newNeurons.filter((n) => n.layer === l + 1);

      currentLayer.forEach((fromN) => {
        nextLayer.forEach((toN) => {
          newSynapses.push({
            fromId: fromN.id,
            toId: toN.id,
            weight: Number((Math.random() * 1.6 - 0.8).toFixed(2)),
          });
        });
      });
    }

    setNeurons(newNeurons);
    setSynapses(newSynapses);
    setSelectedSynapse(null);
  }, [layers]);

  // Handle forward prop simulation and interactive training
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setEpoch((prev) => prev + 1);

        // Simulated weight adjustments (Backprop approximation)
        setSynapses((prevSynapses) =>
          prevSynapses.map((s) => {
            const delta = (Math.random() * 0.05 - 0.025);
            let targetWeight = s.weight + delta;
            if (targetWeight > 1.5) targetWeight = 1.5;
            if (targetWeight < -1.5) targetWeight = -1.5;
            return {
              ...s,
              weight: Number(targetWeight.toFixed(2)),
            };
          })
        );

        // Update activations based on mathematical definitions
        setNeurons((prevNeurons) => {
          return prevNeurons.map((n) => {
            if (n.layer === 0) return n; // inputs constant

            // Compute summation of inputs * weights
            const incomingSynapses = synapses.filter((s) => s.toId === n.id);
            let sum = n.bias;
            incomingSynapses.forEach((s) => {
              const srcN = prevNeurons.find((pn) => pn.id === s.fromId);
              if (srcN) sum += srcN.val * s.weight;
            });

            // Activation transformations
            let activated = sum;
            if (activation === "ReLU") {
              activated = Math.max(0, sum);
            } else if (activation === "Sigmoid") {
              activated = 1 / (1 + Math.exp(-sum));
            } else if (activation === "Tanh") {
              activated = Math.tanh(sum);
            }

            return {
              ...n,
              val: Number(Math.min(Math.max(activated, 0), 1).toFixed(2)),
            };
          });
        });

        // Drop loss over time to simulate converging network
        setLoss((prev) => {
          const currentLoss = prev[prev.length - 1];
          if (currentLoss > 0.02) {
            const decay = currentLoss * (0.01 + Math.random() * 0.015);
            const nextL = Number((currentLoss - decay).toFixed(4));
            return [...prev.slice(-30), nextL];
          }
          return prev;
        });

        // Trigger dynamic glow pulse on lines
        setActiveSignal(Math.floor(Math.random() * layers.length));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, synapses, activation, layers]);

  const handleAddNode = (layerIdx: number) => {
    if (layers[layerIdx] >= 6) return; // Limit to max 6 per layer
    const newLayers = [...layers];
    newLayers[layerIdx]++;
    setLayers(newLayers);
  };

  const handleRemoveNode = (layerIdx: number) => {
    if (layers[layerIdx] <= 1) return; // Limit to min 1
    const newLayers = [...layers];
    newLayers[layerIdx]--;
    setLayers(newLayers);
  };

  const handleReset = () => {
    setEpoch(0);
    setLoss([0.8, 0.65, 0.52, 0.41, 0.32, 0.25]);
    setIsPlaying(false);
    setSelectedSynapse(null);
  };

  return (
    <div className="glass-light p-6 md:p-8 rounded-[2.5rem] border border-outline/10 shadow-2xl bg-white/70 relative overflow-hidden transition-all duration-300">
      
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#4143c7_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />

      {/* Ribbon Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-outline/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono mb-1 font-bold">
            <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
            ONLINE LABS
          </div>
          <h3 className="font-display text-2xl font-bold text-on-surface">
            Tensor-Mesh Visual Simulation (EE-AI Co-Design)
          </h3>
          <p className="text-on-surface-variant text-sm mt-0.5 font-body">
            Simulate a real-time deep neural network and inspect synapse weight coefficients.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md transform hover:-translate-y-0.5 ${
              isPlaying
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-primary text-white hover:bg-primary-container"
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isPlaying ? "animate-pulse" : ""}`} />
            {isPlaying ? "Pause Process" : "Start Live Propagation"}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-on-background/10 hover:bg-on-background/20 text-on-surface rounded-xl transition-all"
            title="Reset simulation parameters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Visual Canvas Sandbox */}
        <div className="lg:col-span-3 flex flex-col bg-[#111224] p-6 rounded-2xl relative min-h-[460px] justify-between border border-white/10 group">
          
          {/* Neon Watermark / Terminal output */}
          <div className="absolute top-4 left-4 font-mono text-[10px] text-white/30 space-y-1 z-10 pointer-events-none">
            <div>CORE: INTEL_VM_COEFFICIENT</div>
            <div>OPTIMIZER: Adam (lr=0.01)</div>
            <div>EPOCHS TRAINED: <span className="text-green-400 font-bold">{epoch}</span></div>
            <div>LOSS INDEX: <span className="text-pink-400 font-bold">{loss[loss.length - 1]}</span></div>
          </div>

          <div className="absolute top-4 right-4 font-mono text-[10px] text-white/30 z-10">
            Activation: <span className="text-primary-container uppercase font-bold">{activation}</span>
          </div>

          {/* Connected Network Graph SVG */}
          <div className="flex-1 w-full relative flex items-center justify-between py-10 px-4 md:px-12" ref={containerRef}>
            
            {/* SVG Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {synapses.map((syn, sIdx) => {
                const srcEl = document.getElementById(syn.fromId);
                const destEl = document.getElementById(syn.toId);
                const rect = containerRef.current?.getBoundingClientRect();

                if (srcEl && destEl && rect) {
                  const srcRect = srcEl.getBoundingClientRect();
                  const destRect = destEl.getBoundingClientRect();

                  const x1 = srcRect.left - rect.left + srcRect.width / 2;
                  const y1 = srcRect.top - rect.top + srcRect.height / 2;
                  const x2 = destRect.left - rect.left + destRect.width / 2;
                  const y2 = destRect.top - rect.top + destRect.height / 2;

                  const strokeColor = syn.weight > 0 ? "rgba(91,94,225,0.6)" : "rgba(226,155,254,0.6)";
                  const strokeWidth = Math.min(Math.max(Math.abs(syn.weight) * 3, 0.5), 6);
                  const isSelected = selectedSynapse?.fromId === syn.fromId && selectedSynapse?.toId === syn.toId;

                  return (
                    <g key={`syn-${sIdx}`}>
                      {/* Interactive Connection Line */}
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isSelected ? "#10b981" : strokeColor}
                        strokeWidth={isSelected ? 4 : strokeWidth}
                        className="cursor-pointer pointer-events-auto hover:stroke-green-400 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSynapse(syn);
                        }}
                      />
                      
                      {/* Animated Signal Burst */}
                      {isPlaying && Math.random() < 0.25 && (
                        <circle r="3.5" fill="#4ade80">
                          <animateMotion
                            dur={`${0.8 + Math.random() * 0.8}s`}
                            repeatCount="indefinite"
                            path={`M ${x1} ${y1} L ${x2} ${y2}`}
                          />
                        </circle>
                      )}
                    </g>
                  );
                }
                return null;
              })}
            </svg>

            {/* Render Nodes Layer by Layer */}
            {layers.map((nodeCount, lIdx) => (
              <div key={`layer-${lIdx}`} className="flex flex-col items-center gap-6 z-10 relative">
                
                {/* Node counter adjustments */}
                <div className="flex flex-col items-center gap-0.5 opacity-60 hover:opacity-100 transition-opacity mb-1">
                  <span className="text-[10px] font-mono text-white/50 uppercase">Layer {lIdx}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleAddNode(lIdx)}
                      className="p-1 text-white bg-white/10 hover:bg-white/25 rounded-md transition-all text-[8px]"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                    <button
                      onClick={() => handleRemoveNode(lIdx)}
                      className="p-1 text-white bg-white/10 hover:bg-white/25 rounded-md transition-all text-[8px]"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                {/* Nodes list */}
                {neurons
                  .filter((n) => n.layer === lIdx)
                  .map((node, nIdx) => {
                    const neuronStateGlow = node.val > 0.5 
                      ? "shadow-[0_0_15px_#5b5ee1] border-[#5b5ee1]" 
                      : "border-white/20";

                    return (
                      <div
                        id={node.id}
                        key={node.id}
                        onMouseEnter={() => setHoverNodeInfo(
                          `Neuron ID: ${node.id}\nBias: ${node.bias}\nValue: ${node.val}\nEquation: a = f(Σ(w*x) + ${node.bias})`
                        )}
                        onMouseLeave={() => setHoverNodeInfo(null)}
                        className={`w-11 h-11 rounded-full flex items-center justify-center bg-[#171932] border-2 cursor-pointer transition-all duration-300 nn-node select-none relative ${neuronStateGlow}`}
                      >
                        <span className="text-[10px] font-mono font-bold text-white/80">
                          {node.val}
                        </span>
                        
                        {/* Hover hint */}
                        {hoverNodeInfo && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 rounded bg-black/90 border border-white/10 text-white font-mono text-[9px] w-40 pointer-events-none z-50 whitespace-pre shadow-2xl">
                            {hoverNodeInfo}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>

          {/* Interactive footer for parameters */}
          <div className="mt-4 border-t border-white/5 pt-3 flex flex-col sm:flex-row justify-between items-center text-xs text-white/60 font-mono gap-2">
            <div>
              💡 <span className="text-white">Tip:</span> Click on any synapse connection line to manually adjust weights!
            </div>
            <div>
              Epoch loss: <span className="text-pink-400 font-bold">{loss[loss.length - 1]}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Sandbox Settings & Controls Sidebar */}
        <div className="space-y-6">
          
          {/* Hyperparameter Configs */}
          <div className="bg-[#111224] p-5 rounded-2xl border border-white/10 text-white space-y-4">
            <h4 className="font-display font-bold text-sm text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Zap className="w-4 h-4 text-green-400" />
              HYPERPARAMETERS
            </h4>
            
            {/* Activation selections */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-white/60 block">Activation Function</label>
              <div className="grid grid-cols-3 gap-1">
                {(["ReLU", "Sigmoid", "Tanh"] as const).map((fn) => (
                  <button
                    key={fn}
                    onClick={() => setActivation(fn)}
                    className={`py-2 text-[10px] font-mono rounded-lg border transition-all ${
                      activation === fn
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                        : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {fn}
                  </button>
                ))}
              </div>
            </div>

            {/* Synthetic Datasets */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-white/60 block">Dataset Signal Profile</label>
              <div className="grid grid-cols-3 gap-1">
                {(["XOR", "Circle", "Linear"] as const).map((ds) => (
                  <button
                    key={ds}
                    onClick={() => setDataset(ds)}
                    className={`py-2 text-[10px] font-mono rounded-lg border transition-all ${
                      dataset === ds
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                        : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {ds}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Interactive Conn Weight Tuner */}
          <div className="p-5 rounded-2xl bg-[#edeeef] border border-outline/10 space-y-3">
            <h4 className="font-display font-extrabold text-[#191c1d] text-sm flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-primary" />
              SYNAPSE INSPECTOR
            </h4>

            {selectedSynapse ? (
              <div className="space-y-3">
                <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-outline/5 font-mono text-on-surface">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Source Node:</span>
                    <strong className="text-primary">{selectedSynapse.fromId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Target Node:</span>
                    <strong className="text-secondary">{selectedSynapse.toId}</strong>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-outline/10 pt-1 mt-1">
                    <span>Weight Coeff:</span>
                    <strong className={selectedSynapse.weight >= 0 ? "text-primary" : "text-secondary"}>
                      {selectedSynapse.weight}
                    </strong>
                  </div>
                </div>

                {/* Manual Weight Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-on-surface-variant">
                    <span>Invert (-1.5)</span>
                    <span>Amplify (+1.5)</span>
                  </div>
                  <input
                    type="range"
                    min="-1.5"
                    max="1.5"
                    step="0.05"
                    value={selectedSynapse.weight}
                    onChange={(e) => {
                      const updatedWeight = parseFloat(e.target.value);
                      setSelectedSynapse({ ...selectedSynapse, weight: updatedWeight });
                      setSynapses(synapses.map(s => 
                        s.fromId === selectedSynapse.fromId && s.toId === selectedSynapse.toId 
                          ? { ...s, weight: updatedWeight }
                          : s
                      ));
                    }}
                    className="w-full accent-primary rounded-lg cursor-pointer"
                  />
                  <div className="text-[10px] text-on-surface-variant text-center block mt-1">
                    Slide to adjust connection coefficients in real-time.
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs p-4 rounded-xl text-center bg-white border border-outline/15 text-on-surface-variant italic">
                <HelpCircle className="w-6 h-6 mx-auto mb-1 text-on-surface-variant/40" />
                No synapse selected. Click on any line line link to tune.
              </div>
            )}
          </div>

          {/* Training Convergence Progress Box */}
          <div className="bg-[#111224] p-5 rounded-2xl border border-white/10 text-white space-y-3">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="font-display font-bold text-xs flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                CONVERGENCE CURVE
              </h4>
              <span className="text-[10px] font-mono bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full">
                Training Loss
              </span>
            </div>

            {/* SVG Loss Curve */}
            <div className="h-24 w-full bg-white/5 rounded-xl p-2 relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  points={loss
                    .map((l, idx) => {
                      const x = (idx / (loss.length - 1)) * 100;
                      const y = 50 - Math.min(Math.max(l * 50, 2), 48); // Scale loss to height
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />
              </svg>
              <div className="absolute bottom-1 right-2 font-mono text-[9px] text-white/50">
                Min Loss: {loss[loss.length - 1]}
              </div>
            </div>
            
            <div className="text-[10px] text-white/50 font-mono flex justify-between">
              <span>Epoch: {epoch}</span>
              <span>Rate: LR=0.01</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
