import React, { useState, useEffect } from "react";
import { Plus, Trash2, Search, FileText, X, ArrowLeft, Tag, Calendar } from "lucide-react";
import { Note } from "../types";

const INITIAL_NOTES: Note[] = [
  {
    id: "init-1",
    title: "ESP32 SPI Sleep Nodes Optimization",
    category: "Embedded Systems",
    content: "Working on custom low-level SPI drivers to hook up low-voltage RF transceiver arrays to ESP32 microcontrollers. Configured deep-sleep sleep cycles utilizing the ULP (Ultra Low Power) co-processor to handle interrupt wakeups, dropping quiescent current draw down to 14.2 microamps. This extends field deployability from months to years on basic LiPo cells.",
    createdAt: "May 25, 2026",
  },
  {
    id: "init-2",
    title: "GELU Activation Approximations for Microcontrollers",
    category: "AI & ML",
    content: "Evaluating neural network forward-propagation inside limited ARM Cortex-M architecture. While GELU (Gaussian Error Linear Unit) offers superior convergence and structural smooth transitions, its transcendental equations are too intensive for tiny FPUs. Implementing look-up tables (LUT) and minimax polynomial approximations to compute x * Sigmoid(1.702 * x) in under 4 clock cycles.",
    createdAt: "May 20, 2026",
  },
  {
    id: "init-3",
    title: "Vector Control in Induction Motors (Simulation)",
    category: "Electronics",
    content: "Writing a Python script simulating Field-Oriented Control (FOC) for variable speed ac motors. FOC decouples the stator flux and torque currents to treat standard induction motors with high dynamic performance similar to DC machines. Studying parameter tracking of rotor time constants to prevent magnetic flux misalignment.",
    createdAt: "May 12, 2026",
  },
];

interface MyNotesProps {
  onClose: () => void;
}

export default function MyNotes({ onClose }: MyNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
  // Note inputs
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Note["category"]>("Electronics");
  const [content, setContent] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("om_portfolio_notes");
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        setNotes(INITIAL_NOTES);
      }
    } else {
      setNotes(INITIAL_NOTES);
    }
  }, []);

  const saveNotes = (updated: Note[]) => {
    setNotes(updated);
    localStorage.setItem("om_portfolio_notes", JSON.stringify(updated));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: title.trim(),
      category,
      content: content.trim(),
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    const updated = [newNote, ...notes];
    saveNotes(updated);

    // reset forms
    setTitle("");
    setContent("");
    setShowAddForm(false);
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    saveNotes(updated);
  };

  const categories = ["All", "Electronics", "AI & ML", "Embedded Systems", "Personal"];

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || n.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-[120] bg-on-background/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-[2rem] border border-outline/10 shadow-2xl flex flex-col overflow-hidden relative animate-fade-in text-on-background">
        
        {/* Banner Top */}
        <div className="bg-primary p-6 text-white flex justify-between items-center">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
              <FileText className="w-3.5 h-3.5" />
              DIGITAL SKETCHBOOK
            </div>
            <h3 className="font-display text-2.5xl font-extrabold tracking-tight">Om's Engineering Logbook</h3>
            <p className="text-white/80 text-xs font-body">Thoughts on signal processing, math, circuits, and machine mechanics.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
            aria-label="Close notes"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left search & catalog controls */}
          <div className="w-full md:w-80 border-r border-outline/10 bg-surface-container-low p-5 flex flex-col gap-4">
            
            {/* Search inputs */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-outline" />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-outline/20 text-xs focus:outline-none focus:border-primary text-on-surface"
              />
            </div>

            {/* Category tabs */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-outline uppercase font-bold tracking-wider px-2 mb-2">
                CATALOG CATEGORIES
              </div>
              <div className="flex flex-wrap md:flex-col gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-2 rounded-xl text-left text-xs font-mono transition-all flex items-center justify-between w-full ${
                      activeCategory === cat
                        ? "bg-primary/15 text-primary font-bold"
                        : "text-on-surface-variant hover:bg-outline/5"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[9px] bg-slate-200 text-on-surface-variant px-1.5 py-0.5 rounded">
                      {cat === "All"
                        ? notes.length
                        : notes.filter((n) => n.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add note CTA button */}
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-auto bg-primary text-white py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all shadow hover:bg-primary-container flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Conceptual Note
            </button>
            
          </div>

          {/* Right listing / editor container */}
          <div className="flex-1 p-6 overflow-y-auto bg-surface-container-lowest">
            
            {showAddForm ? (
              // Add form Editor
              <form onSubmit={handleAddNote} className="space-y-4 animate-fade-in max-w-lg mx-auto">
                <div className="flex justify-between items-center border-b border-outline/10 pb-2 mb-4">
                  <h4 className="font-display font-bold text-lg text-primary flex items-center gap-1.5">
                    Create New Note Entry
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-xs text-outline hover:text-primary flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Logbook
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-outline block">Concept Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Fourier Transform for Edge Audio Filters"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] rounded-xl border border-outline/25 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-outline block">Tech Specialty</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Note["category"])}
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] rounded-xl border border-outline/25 text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="AI & ML">AI & ML</option>
                    <option value="Embedded Systems">Embedded Systems</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-outline block">Analytical Details / Equations</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Type details, technical parameters, or architectural observations..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] rounded-xl border border-outline/25 text-sm focus:outline-none focus:border-primary font-mono"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-white rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all shadow hover:bg-primary-container"
                >
                  Confirm Entry
                </button>
              </form>
            ) : (
              // Notes Grid Lists
              <div className="space-y-4">
                {filteredNotes.length === 0 ? (
                  <div className="text-center py-12 text-outline">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-outline/30" />
                    <p className="text-sm font-body">No engineering logs matched selection.</p>
                    <p className="text-xs mt-1">Try toggling other filter parameters or craft a new note.</p>
                  </div>
                ) : (
                  filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      className="group p-5 bg-white border border-outline/10 hover:border-primary/20 rounded-2xl hover:shadow-lg transition-all"
                    >
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div className="space-y-1">
                          <h4 className="font-display font-extrabold text-on-surface text-base group-hover:text-primary transition-colors">
                            {note.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-primary/10 text-primary rounded-full">
                              <Tag className="w-2.5 h-2.5" />
                              {note.category}
                            </span>
                            <span className="text-outline flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5" />
                              {note.createdAt}
                            </span>
                          </div>
                        </div>
                        
                        {/* Delete action button */}
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1.5 text-outline hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Delete note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-on-surface-variant text-xs leading-relaxed font-mono whitespace-pre-wrap mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {note.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

        </div>

        {/* Footer info lockups */}
        <div className="bg-[#f8f9fa] border-t border-outline/10 p-4 text-center text-[10px] font-mono text-outline">
          💡 Data saved directly on your local sandbox storage. Recruiter analytics is isolated and safe.
        </div>

      </div>
    </div>
  );
}
