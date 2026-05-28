import React, { useState, useEffect } from "react";
import { 
  Download, 
  FileText, 
  ChevronDown, 
  ArrowRight, 
  Cpu, 
  Brain, 
  Sliders, 
  Globe, 
  Mail, 
  ExternalLink,
  Laptop,
  Github,
  Linkedin,
  MapPin,
  Flame,
  CheckCircle2,
  Terminal,
  Compass
} from "lucide-react";

import NeuralNetworkVisualizer from "./components/NeuralNetworkVisualizer";
import MyNotes from "./components/MyNotes";
import FullStackExplorer from "./components/FullStackExplorer";
import IotSimulation from "./components/IotSimulation";
import AiAssistant from "./components/AiAssistant";

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

export default function App() {
  const [showNotes, setShowNotes] = useState(false);
  const [showExplorer, setShowExplorer] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showCopiedEmail, setShowCopiedEmail] = useState(false);

  // Scroll effect on header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerToast = (message: string, type: Toast["type"] = "success") => {
    const nextToast: Toast = { id: `toast-${Date.now()}`, message, type };
    setToasts((prev) => [...prev, nextToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== nextToast.id));
    }, 4500);
  };

  const handleDownloadResume = () => {
    triggerToast("Compiling Resume LaTeX sources...", "info");
    setTimeout(() => {
      triggerToast("Resumé PDF binary generated. Download initiated!", "success");
      // Simulated browser download trigger
      const link = document.createElement("a");
      link.href = "#";
      link.setAttribute("download", "om_lasure_resume.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText("omlasure2536@gmail.com");
    setShowCopiedEmail(true);
    triggerToast("Contact email copied to your clipboard!", "success");
    setTimeout(() => setShowCopiedEmail(false), 2500);
  };

  return (
    <div className="min-h-screen bg-background text-on-background relative font-body-md overflow-x-hidden selection:bg-primary-container/20 selection:text-primary">
      
      {/* Dynamic Background Hover Glow (CSS based movement is centered behind hero content) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-screen pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 right-[5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-1/2 left-[5%] w-[450px] h-[450px] bg-secondary/15 rounded-full blur-[130px] [animation-delay:2s] animate-pulse-slow" />
      </div>

      {/* Floating dynamic status notifications portal (Toast pipeline) */}
      <div className="fixed top-24 right-6 z-[130] space-y-2 pointer-events-none max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-xl shadow-2xl border text-xs font-mono flex items-center gap-2.5 animate-fade-in pointer-events-auto ${
              toast.type === "success"
                ? "bg-green-950/90 border-green-500 text-green-300"
                : toast.type === "info"
                ? "bg-[#111224]/90 border-primary text-blue-300"
                : "bg-red-950/90 border-red-500 text-red-300"
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 shrink-0 ${toast.type === "success" ? "text-green-400" : "text-blue-400"}`} />
            <div>{toast.message}</div>
          </div>
        ))}
      </div>

      {/* Navigation Bar Header */}
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled 
            ? "bg-white/90 backdrop-blur-xl h-20 border-b border-outline/5 shadow-md" 
            : "bg-transparent h-24"
        }`}
      >
        <nav className="flex justify-between items-center max-w-[1240px] mx-auto px-6 h-full">
          {/* Brand logo */}
          <a href="#home" className="text-2xl font-extrabold tracking-tighter text-primary font-display flex items-center gap-1.5 focus:outline-none">
            OL.
            <span className="inline-block w-1.5 h-1.5 bg-secondary rounded-full" />
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex gap-8 items-center">
            <a href="#home" className="font-mono text-xs uppercase tracking-widest text-primary font-bold hover:text-primary-container transition-all">Home</a>
            <a href="#about" className="font-mono text-xs uppercase tracking-widest text-[#464554] hover:text-primary transition-all">About</a>
            <a href="#interests" className="font-mono text-xs uppercase tracking-widest text-[#464554] hover:text-primary transition-all">Interests</a>
            <a href="#skills" className="font-mono text-xs uppercase tracking-widest text-[#464554] hover:text-primary transition-all">Skills</a>
            <a href="#contact" className="font-mono text-xs uppercase tracking-widest text-[#464554] hover:text-primary transition-all">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            {/* Header Neural Status indicator badge */}
            <a 
              href="#visualizer" 
              className="hidden lg:flex items-center gap-2.5 px-4.5 py-2 bg-slate-100 hover:bg-slate-200 rounded-full border border-slate-200 transition-all text-[11px] font-mono font-bold text-on-surface-variant cursor-pointer"
            >
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
              Neural Network Visualizer
            </a>

            {/* Quick action trigger of code console */}
            <button
              onClick={() => setShowExplorer(true)}
              className="p-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-all"
              title="Open console simulator"
            >
              <Terminal className="w-4.5 h-4.5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Main Container */}
      <main>
        
        {/* Immersive Hero Section */}
        <section 
          id="home" 
          className="relative min-h-[95vh] flex items-center justify-center py-20 overflow-hidden bg-radial-gradient"
          style={{
            background: "radial-gradient(circle at top right, #0a0a2a 0%, #020205 100%)"
          }}
        >
          {/* Subtle star particle triggers representing circuits nodes */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none">
            <div className="absolute top-24 left-1/4 w-1.5 h-1.5 bg-white/20 rounded-full animate-ping" />
            <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-primary/30 rounded-full animate-float" />
            <div className="absolute bottom-24 left-16 w-1 h-1 bg-[#83439e]/20 rounded-full animate-ping" />
          </div>

          <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 w-full mt-10">
            
            {/* Left text lockups */}
            <div className="space-y-8 text-left animate-fade-in">
              
              {/* Pulsing state bar */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-2xl backdrop-blur">
                <span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]" />
                <span className="font-mono text-[11px] text-white/70 uppercase tracking-widest font-bold">
                  Available for Collaboration
                </span>
              </div>

              {/* Massive Name display header */}
              <h1 className="text-display-lg leading-[0.95] text-white tracking-tighter">
                Om <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Lasure
                </span>
              </h1>

              <p className="font-display font-medium text-white/60 text-lg md:text-xl max-w-lg leading-relaxed">
                Electrical Engineering Student &amp; AI Enthusiast building the future at the intersection of hardware and intelligence.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={handleDownloadResume}
                  className="bg-primary text-white font-mono text-xs font-extrabold uppercase tracking-wider px-8 py-4.5 rounded-2xl shadow-xl hover:bg-primary-container hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </button>
                <button
                  onClick={() => setShowNotes(true)}
                  className="glass text-white font-mono text-xs font-extrabold uppercase tracking-wider px-8 py-4.5 rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  My Notes
                </button>
              </div>
            </div>

            {/* Right Headshot card */}
            <div className="flex justify-center lg:justify-end animate-float">
              <div className="relative w-full max-w-[430px] aspect-square group">
                {/* Glowing neon background shadow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-[3rem] blur-2xl opacity-25 group-hover:opacity-45 transition-opacity duration-700" />
                
                {/* Visual Glass Frame */}
                <div className="relative w-full h-full rounded-[3.5rem] overflow-hidden border border-white/15 shadow-2xl">
                  <img
                    alt="Om Lasure photo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s]"
                    src="https://lh3.googleusercontent.com/aida/ADBb0uhYGSBQ2lJAwR2omlQxi0Zfx44TQ5UhdgxNe4f1EViPY8SRADlNPr3jIEWnc_3n8JRFiBu-VrewEnsOP8xAgKutvhIjQ1kd4GZ40zrbjCEv9Wk3CxKn26_A2xp98rFtdaTsUYKJA3vtVkaMVx2AgR5G1bBTsXZQ7D653sfSNNGbSL7agrx7qaLqVSvijJS6hBjlesK7GRONY61x8mcKqGV9-pTyj_E2VaxvVUSWjAFID-L0gwWUP0h6Zg"
                  />
                  {/* Backdrop Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  
                  {/* Detail text descriptors */}
                  <div className="absolute bottom-8 left-8 text-left space-y-1">
                    <p className="font-mono text-white/50 text-[10px] uppercase tracking-widest font-bold">
                      Based in India
                    </p>
                    <p className="font-display font-medium text-white text-xl">
                      Innovation First
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Dynamic Expand / Scroll hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer opacity-30 hover:opacity-100 transition-opacity">
            <a href="#about" aria-label="Scroll trigger down">
              <ChevronDown className="text-white w-8 h-8" />
            </a>
          </div>
        </section>

        {/* Scrolling loop Marquee banner */}
        <section className="py-10 bg-white overflow-hidden border-y border-outline/5 relative z-20">
          <div className="flex select-none gap-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex gap-12 shrink-0 animate-scroll py-2 font-mono uppercase tracking-[0.35em] text-xs font-bold text-on-surface-variant">
              <span>Embedded Systems</span>
              <span className="text-primary">•</span>
              <span>Artificial Intelligence</span>
              <span className="text-primary">•</span>
              <span>Electrical Engineering</span>
              <span className="text-primary">•</span>
              <span>Python Programming</span>
              <span className="text-primary">•</span>
              <span>IoT Innovation</span>
              <span className="text-primary">•</span>
              <span>Circuit Design</span>
              <span className="text-primary">•</span>
            </div>
            {/* Seamless duplicate loop layout */}
            <div className="flex gap-12 shrink-0 animate-scroll py-2 font-mono uppercase tracking-[0.35em] text-xs font-bold text-on-surface-variant">
              <span>Embedded Systems</span>
              <span className="text-primary">•</span>
              <span>Artificial Intelligence</span>
              <span className="text-primary">•</span>
              <span>Electrical Engineering</span>
              <span className="text-primary">•</span>
              <span>Python Programming</span>
              <span className="text-primary">•</span>
              <span>IoT Innovation</span>
              <span className="text-primary">•</span>
              <span>Circuit Design</span>
              <span className="text-primary">•</span>
            </div>
          </div>
        </section>

        {/* About profile section */}
        <section id="about" className="py-24 bg-surface scroll-mt-20">
          <div className="max-w-[1240px] mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <span className="inline-block px-5 py-2 bg-primary/10 text-primary border border-primary/15 rounded-full font-mono text-xs uppercase tracking-widest font-extrabold shadow-sm">
                The Profile
              </span>
              <h2 className="font-display font-bold text-5xl md:text-6xl text-on-surface tracking-tight">
                Constant Evolution.
              </h2>
              <p className="text-on-surface-variant font-body text-base md:text-lg leading-relaxed text-center">
                I am Om Lasure, a first-year Electrical Engineering student passionate about technology, innovation, and improving myself everyday. I enjoy working with circuits, automation, embedded systems, and learning new tools. My goal is to merge classical engineering principles with modern artificial intelligence.
              </p>
              
              <div className="pt-4 flex justify-center">
                <a 
                  href="#interests" 
                  className="inline-flex items-center gap-2 font-mono font-bold text-primary hover:text-primary-container group transition-colors"
                >
                  Explore my journey
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Interests Bento Grid Blocks */}
        <section id="interests" className="py-24 bg-surface-container-low scroll-mt-20">
          <div className="max-w-[1240px] mx-auto px-6">
            <div className="mb-14 space-y-2 text-left">
              <h2 className="font-display font-bold text-5xl text-on-surface tracking-tight">
                Interests
              </h2>
              <p className="text-on-surface-variant text-base">
                Fields where curiosity meets physical and analytical application.
              </p>
            </div>

            {/* Bento Layout grid */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              
              {/* Card 1: Internet of Things custom interactive simulator (Span 4) */}
              <div className="md:col-span-4 h-full">
                <IotSimulation />
              </div>

              {/* Card 2: AI & ML styled custom card (Span 2) */}
              <div className="md:col-span-2 group p-8 rounded-[2.5rem] bg-secondary text-white transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-lg h-full hover:border-[#ebb2ff]/30 border border-transparent">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />
                
                <div className="relative z-15 w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                  <Brain className="w-7 h-7" />
                </div>
                
                <div className="relative z-15 space-y-3 mt-16 text-left">
                  <h3 className="font-display font-extrabold text-2xl">
                    AI &amp; ML
                  </h3>
                  <p className="text-white/80 font-body text-xs leading-relaxed max-w-xs">
                    Synthesizing neural networks and lightweight machine learning models to solve complex computational and physics problems.
                  </p>
                </div>
              </div>

              {/* Card 3: Embedded Systems representation (Span 2) */}
              <div 
                onClick={() => {
                  setSelectedSnippetFromArsenal(0);
                  setShowExplorer(true);
                }}
                className="md:col-span-2 group p-8 rounded-[2.5rem] bg-white border border-outline/10 hover:border-primary/20 hover:shadow-lg transition-all flex flex-col justify-between text-left h-48 cursor-pointer relative"
              >
                <div className="w-12 h-12 bg-[#006331]/10 text-[#006331] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Laptop className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-on-surface text-lg">
                    Embedded Systems
                  </h3>
                  <p className="text-on-surface-variant font-mono text-[10px] uppercase mt-1">Microcontroller Drivers &gt;</p>
                </div>
              </div>

              {/* Card 4: Electrical Machines representer (Span 2) */}
              <div 
                onClick={() => {
                  setSelectedSnippetFromArsenal(2);
                  setShowExplorer(true);
                }}
                className="md:col-span-2 group p-8 rounded-[2.5rem] bg-white border border-outline/10 hover:border-primary/20 hover:shadow-lg transition-all flex flex-col justify-between text-left h-48 cursor-pointer relative"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sliders className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-on-surface text-lg">
                    Electrical Machines
                  </h3>
                  <p className="text-on-surface-variant font-mono text-[10px] uppercase mt-1">Simulations Logs &gt;</p>
                </div>
              </div>

              {/* Card 5: Geopolitics black themed grid option (Span 2) */}
              <div className="md:col-span-2 group p-8 rounded-[2.5rem] bg-on-background text-white hover:shadow-2xl transition-all flex flex-col justify-between text-left h-48 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 font-mono text-[100px] leading-none text-white select-none pointer-events-none translate-y-8 translate-x-4">
                  🌎
                </div>
                <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <Globe className="w-5.5 h-5.5" />
                </div>
                <div className="relative z-10">
                  <h3 className="font-display font-extrabold text-white text-lg">
                    Geopolitics
                  </h3>
                  <p className="text-white/60 text-[10px] font-body mt-1 leading-relaxed">
                    Analyzing tech sovereignty and global supply lines mapping.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Technical Arsenal Skills Blocks */}
        <section id="skills" className="py-24 bg-white scroll-mt-20">
          <div className="max-w-[1240px] mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14">
              <div className="space-y-1 text-left">
                <h2 className="font-display font-bold text-5xl text-on-surface tracking-tight">
                  Technical Arsenal
                </h2>
                <p className="text-on-surface-variant">
                  Precision coding languages and structural tools for modern engineering.
                </p>
              </div>

              <button
                onClick={() => setShowExplorer(true)}
                className="bg-on-background text-white font-mono text-xs font-bold px-7 py-3.5 rounded-full uppercase tracking-wider hover:bg-primary transition-all shadow cursor-pointer text-center"
              >
                Full Stack Explorer
              </button>
            </div>

            {/* Skills checklist grids with dynamic ratio bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* HTML */}
              <div 
                onClick={() => {
                  setSelectedSnippetFromArsenal(0);
                  setShowExplorer(true);
                }}
                className="group p-8 rounded-[2rem] bg-slate-50 border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all cursor-pointer text-center flex flex-col justify-between"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <img
                    alt="HTML logo"
                    className="w-10 h-10 grayscale group-hover:grayscale-0 transition-all"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJOCuQ1DEjrLDOBHVJ5YneOu8v9a41sdebnQeSsKZF3HUporH3FCCRlxbaVZAYYo-rrut-laY21PVPQPkC5Rghcb-xTwfi7lcmBHPKEZ-jTo1O3--birRWa6HIoCPFg6IXJIPJU0oWTHV2jtj3Y0ZGfnJD4_Uzcf6RGIhkD2pMXpo9qRwy341URRs0eQtt2DybHqE27D86CjRdJwMFpm-SlrngPEa1m04DPxHsPj-4FdvgdvzGhRv48lbqzTcPZhzwxRQxCQmAIk0"
                  />
                </div>
                <h4 className="font-display font-extrabold text-on-surface text-xl mb-3">HTML</h4>
                <div className="h-1 bg-slate-200 rounded-full overflow-hidden w-full">
                  <div className="h-full bg-primary w-[85%] transition-all" />
                </div>
              </div>

              {/* CSS */}
              <div 
                onClick={() => {
                  setSelectedSnippetFromArsenal(0);
                  setShowExplorer(true);
                }}
                className="group p-8 rounded-[2rem] bg-slate-50 border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all cursor-pointer text-center flex flex-col justify-between"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <img
                    alt="CSS logo"
                    className="w-10 h-10 grayscale group-hover:grayscale-0 transition-all"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlRcL6Y0ajgURKyaUktDFqlM6u5T_3uketr1A-0hqY5XphsD-XgNhuutk5kVYaH4UNFjYrdrVcNLjVj2t5qNxy2KYJxdG48Elu-wIfMVT5sqlDABuzz6BP-5TQ2T2xiPo1sGGDPEjWfKDyrLmASWDH9Nrqlx5TEGxtS_zCLPlfD7EiOedd5gD9e3HPrMadrqQ7ZjdkGG8x26jNQHxL0ZJM7Z6RVH9GvGd1vaazcUKm6Ha21ka8M5IhusEaWFOqyWtvFnJb8_9PDGc"
                  />
                </div>
                <h4 className="font-display font-extrabold text-on-surface text-xl mb-3">CSS</h4>
                <div className="h-1 bg-slate-200 rounded-full overflow-hidden w-full">
                  <div className="h-full bg-primary w-[75%] transition-all" />
                </div>
              </div>

              {/* Python */}
              <div 
                onClick={() => {
                  setSelectedSnippetFromArsenal(1);
                  setShowExplorer(true);
                }}
                className="group p-8 rounded-[2rem] bg-slate-50 border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all cursor-pointer text-center flex flex-col justify-between"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <img
                    alt="Python logo"
                    className="w-10 h-10 grayscale group-hover:grayscale-0 transition-all"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNaTSdcOgusOEEyffmAIrrzfKfgvLAKjfBw-DRkdiDJcvp3-0HaPsDb56ZA-cmYlfv3Mwdoafp2i1YWZFNM1qIjKNUilPrtvkJ10dX4KqS8n46VTNuJLpOshZdQmq3KYuCPXxStREZAcGjHBxBuIoGY6wkDFC2Ks8UTSKeKCsqk2evRGdZFOpXkPjh9W9S4ETJNDzVaiRJoUQ4BAoz5FODVM7UeaIir9d65zq-qN-G_BMz2lDMpdNmwagdmXgXESRBeWu4xc7vcac"
                  />
                </div>
                <h4 className="font-display font-extrabold text-on-surface text-xl mb-3">Python</h4>
                <div className="h-1 bg-slate-200 rounded-full overflow-hidden w-full">
                  <div className="h-full bg-primary w-[90%] transition-all" />
                </div>
              </div>

              {/* C Prog */}
              <div 
                onClick={() => {
                  setSelectedSnippetFromArsenal(0);
                  setShowExplorer(true);
                }}
                className="group p-8 rounded-[2rem] bg-slate-50 border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all cursor-pointer text-center flex flex-col justify-between"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <img
                    alt="C language logo"
                    className="w-10 h-10 grayscale group-hover:grayscale-0 transition-all"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSMBkrvLJ0tisfIMBkDihhdnqQaxz8UZ41aCKfnVf80J18wuGs7loP5sdxz9ie3AvRAPBSd7x1qupezTZrhFrEkba2IC2lmti4LhYKu2jMIFsiuj16jEIJXI8psQ4VJvsUFnlVU318YyOFMJhvxVklqwB18i224UlgEdHgGJLln4NQe37TJOJHhiAhEsLj3c4o8BwthRAVwrjBUgtOJwUBkSmT5SQK4s9ogr7FMlHiSa0Oo4OhyaX0NcQnq1Tzkzozy4jon2Lnt4k"
                  />
                </div>
                <h4 className="font-display font-extrabold text-on-surface text-xl mb-3">C Prog</h4>
                <div className="h-1 bg-slate-200 rounded-full overflow-hidden w-full">
                  <div className="h-full bg-primary w-[80%] transition-all" />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Neural Network Visualizer Section Section */}
        <section id="visualizer" className="py-24 bg-surface-container-low scroll-mt-20">
          <div className="max-w-[1240px] mx-auto px-6">
            <NeuralNetworkVisualizer />
          </div>
        </section>

        {/* Let's build something mesmerizing Contact section */}
        <section id="contact" className="py-24 bg-white scroll-mt-20">
          <div className="max-w-[1240px] mx-auto px-6">
            <div className="bg-gradient-to-br from-primary to-secondary rounded-[3.5rem] p-10 md:p-20 text-white relative overflow-hidden group shadow-2xl">
              
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-700 select-none">
                <Mail className="w-[320px] h-[320px]" />
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                <div className="space-y-6 text-left">
                  <h2 className="font-display font-extrabold text-4xl md:text-5.5xl leading-[1.05] tracking-tight text-white">
                    Let's build something mesmerizing.
                  </h2>
                  <p className="text-white/70 text-base md:text-lg max-w-sm">
                    Always open to discussions on projects, new academic ideas, or opportunities.
                  </p>
                  
                  {/* Interactive Mailto overlay link */}
                  <div className="pt-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 mb-2 font-bold">
                      Drop a line
                    </p>
                    <button
                      onClick={copyEmailToClipboard}
                      className="text-2xl md:text-3xl font-display font-extrabold border-b-2 border-white/20 hover:border-white transition-all pb-1 hover:scale-101 transform cursor-pointer tracking-tight"
                    >
                      {showCopiedEmail ? "Copied to clipboard! ✓" : "omlasure2536@gmail.com"}
                    </button>
                  </div>
                </div>

                {/* Submitting visual cards linkages */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-end">
                  <a
                    href="mailto:omlasure2536@gmail.com"
                    className="w-16 h-16 glass rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300 shadow-lg text-white group/icon"
                    title="Send Email"
                  >
                    <Mail className="w-6 h-6 group-hover/icon:scale-110 transition-transform" />
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-16 h-16 glass rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300 shadow-lg text-white group/icon"
                    title="GitHub link"
                  >
                    <Github className="w-6 h-6 group-hover/icon:scale-110 transition-transform" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-16 h-16 glass rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300 shadow-lg text-white group/icon"
                    title="LinkedIn link"
                  >
                    <Linkedin className="w-6 h-6 group-hover/icon:scale-110 transition-transform" />
                  </a>
                </div>

              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-16 bg-surface border-t border-outline/5 relative z-10 text-on-surface">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="text-center md:text-left space-y-2">
            <div className="font-display font-extrabold text-2xl text-primary leading-none">
              Om Lasure
            </div>
            <p className="text-on-surface-variant font-mono text-[10px] uppercase tracking-widest leading-none font-bold">
              © 2026 • Intersection of Hardware &amp; AI
            </p>
          </div>

          <div className="flex gap-8 font-mono text-xs uppercase tracking-widest">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-all">LinkedIn</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-all">GitHub</a>
            <a href="https://scholar.google.com" target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-all">Scholar</a>
          </div>

        </div>
      </footer>

      {/* Persistent Sketchbook Notes Overlays */}
      {showNotes && <MyNotes onClose={() => setShowNotes(false)} />}

      {/* Technical Lab Console Overlays */}
      {showExplorer && <FullStackExplorer onClose={() => setShowExplorer(false)} />}

      {/* Bottom Right Floating Core AI Co-pilot dialog bubble */}
      <AiAssistant />

    </div>
  );
}

// Global snippet setter adapter so that details inside visualizer directly open in console dialog
let setSelectedSnippetFromArsenal = (index: number) => {
  window.dispatchEvent(new CustomEvent("set-explorer-index", { detail: index }));
};
