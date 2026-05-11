'use client';

import React, { useState } from 'react';
import { 
  Cpu, Zap, ArrowUpRight, Globe, Search, 
  Users, ArrowRight, Database, BrainCircuit, Network, Microscope, ShieldCheck, FileText, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Note: Ensure you import your actual Navbar and Footer paths correctly
import Navbar from '@/components/General/navbar';
import Footer from '@/components/General/footer';

// ─── Reusable Animated Components ───────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="flex items-center gap-3 mb-8 justify-center lg:justify-start"
    >
      <div className="h-[1px] w-8 bg-blue-500/50" />
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
        {children}
      </span>
    </motion.div>
  );
}

// ─── Scene Overlay (Cinematic Noise & Grid) ───────────────────────────────
function SceneOverlay() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none z-10" aria-hidden>
        <filter id="noise-about">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-about)" />
      </svg>
    </>
  );
}

// ─── Component 1: Tech Stack Scroller ─────────────────────────────────────
function TechScroller() {
  const partners = ["Llama-3", "ChromaDB", "Docker", "n8n", "React", "Python", "Next.js", "Agentic RAG"];
  return (
    <div className="py-10 border-y border-white/[0.05] bg-black/50 overflow-hidden relative z-20 backdrop-blur-md">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030305] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030305] to-transparent z-10" />
      <div className="flex gap-16 animate-marquee whitespace-nowrap">
        {[...partners, ...partners, ...partners].map((p, i) => (
          <span key={i} className="text-slate-600 text-lg font-bold tracking-widest uppercase hover:text-blue-500 transition-colors cursor-default">
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Component 2: Animated Accordion Values ────────────────────────────────
function ValuesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const values = [
    { title: "Deterministic Accuracy", desc: "Hallucinations are unacceptable in requirement engineering. Our system grounds every insight directly in your source artifacts." },
    { title: "Absolute Sovereignty", desc: "Privacy by Design (PbD) isn't an afterthought. BIWIZE is engineered to run entirely on local infrastructure with zero telemetry." },
    { title: "Agentic Autonomy", desc: "We move beyond simple search. Our AI utilizes Tree-of-Thoughts reasoning to iteratively check its own logic before finalizing a requirement." }
  ];

  return (
    <section className="py-32 px-6 border-t border-white/[0.05] relative z-20">
       <div className="max-w-4xl mx-auto">
          <SectionLabel>Our Philosophy</SectionLabel>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-12 tracking-tight text-white leading-tight"
          >
            Built on Principles, <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Driven by Logic.</span>
          </motion.h2>
          
          <div className="space-y-4">
            {values.map((v, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className={`group rounded-3xl border transition-all duration-500 overflow-hidden ${
                    isOpen ? 'bg-blue-900/10 border-blue-500/30 shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)]' : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]'
                  } backdrop-blur-sm`}
                >
                  <button 
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex justify-between items-center p-6 md:p-8 outline-none"
                  >
                    <span className={`text-xl font-bold tracking-tight transition-colors ${isOpen ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                      {v.title}
                    </span>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-blue-500/20 text-blue-400 rotate-180' : 'bg-white/5 text-slate-500 group-hover:bg-white/10'}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 md:px-8 pb-8 text-slate-400 leading-relaxed font-light border-t border-white/[0.05] pt-6">
                          {v.desc}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
       </div>
    </section>
  );
}

// ─── Main About Page Component ─────────────────────────────────────────────
export default function AboutPage() {
  const steps = [
    { title: "Data Ingestion", desc: "Aggregating multi-modal signals from meeting transcripts, legacy docs, and Slack threads." },
    { title: "Neural Synthesis", desc: "Cross-referencing intent using VADER sentiment analysis and high-dimensional vector embeddings." },
    { title: "Logic Verification", desc: "Generating traceable SRS documentation autonomously via multi-hop reasoning loops." }
  ];

  return (
    <div className="bg-[#030305] text-white min-h-screen selection:bg-blue-500/30 relative font-sans">
      <SceneOverlay />
      
      {/* Top Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* ─── Hero / Origin Section ─── */}
      <section className="relative pt-44 md:pt-56 pb-32 px-6 overflow-hidden z-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/15 blur-[150px] rounded-full -z-10 pointer-events-none" />
        
        <div className="max-w-[1000px] mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
              <Globe className="w-3.5 h-3.5" />
              Built in Colombo
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-10 leading-[1.05]">
              The Future of Scoping is <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 drop-shadow-sm">
                Autonomous.
              </span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-2xl max-w-3xl leading-relaxed font-light mb-12">
              BIWIZE was founded on a singular premise: requirement ambiguity is the silent killer of the software industry. We use <span className="text-white font-medium">Local-First Agentic RAG</span> to eliminate it entirely.
            </p>
          </motion.div>
        </div>
      </section>

      <TechScroller />

      {/* ─── Founder's Vision Section ─── */}
      <section className="py-32 px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            
            {/* Visual Node */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-5 relative"
            >
              <div className="aspect-[4/5] bg-[#0A0A0C] rounded-[2.5rem] overflow-hidden border border-white/10 group relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {/* Abstract Data Flow Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f615_1px,transparent_1px),linear-gradient(to_bottom,#3b82f615_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                {/* Glowing Orb */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                
                {/* Floating Elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border border-blue-500/30 rounded-full animate-[spin_10s_linear_infinite] flex items-center justify-center">
                    <div className="w-24 h-24 border border-emerald-500/30 rounded-full animate-[spin_7s_linear_infinite_reverse]" />
                  </div>
                  <BrainCircuit className="absolute w-10 h-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                </div>
              </div>

              {/* Quote Card */}
              <div className="absolute -bottom-8 -right-4 md:-right-8 p-6 md:p-8 bg-blue-600/90 backdrop-blur-xl rounded-3xl border border-blue-400/30 shadow-2xl z-20 max-w-[280px]">
                <blockquote className="text-sm font-medium leading-relaxed text-white">
                  "We aren't building a documentation tool; we're building a trajectory engine for the next generation of SDLCs."
                </blockquote>
              </div>
            </motion.div>
            
            {/* Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7 mt-12 lg:mt-0"
            >
              <SectionLabel>The Problem</SectionLabel>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight text-white leading-tight">
                Redefining the <br /> Requirement <span className="text-slate-500 italic font-medium">Phase.</span>
              </h2>
              <div className="space-y-6 text-slate-400 text-lg leading-relaxed font-light">
                <p>
                  For decades, requirements gathering was entirely reliant on human memory and scattered communications. You waited for meetings, you misinterpreted emails, and scope creep ravaged your timeline.
                </p>
                <p>
                  BIWIZE changes the dynamic from <span className="text-white font-medium">reactive transcription</span> to <span className="text-white font-medium">predictive intelligence</span>.
                </p>
                <p>
                  Our architecture leverages highly quantized, local Large Language Models to identify "Hidden Requirements"—unstated edge cases and technical constraints extracted through semantic pattern recognition before a single line of code is written.
                </p>
                <button className="flex items-center gap-3 text-blue-400 font-bold text-xs uppercase tracking-widest mt-8 hover:gap-5 transition-all group">
                  Read our technical manifesto 
                  <ArrowRight className="w-4 h-4 group-hover:text-white transition-colors" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Process / The Technology ─── */}
      <section className="py-32 px-6 relative z-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-600/10 blur-[150px] rounded-full -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 flex flex-col items-center">
            <SectionLabel>The Architecture</SectionLabel>
            <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">The Neural Advantage</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] border border-white/10 rounded-[2.5rem] overflow-hidden bg-white/10 backdrop-blur-xl shadow-2xl">
            {steps.map((step, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                key={i} 
                className="p-10 md:p-12 bg-[#0A0A0C] hover:bg-[#0F0F13] transition-colors group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full translate-x-16 -translate-y-16 group-hover:bg-blue-500/10 transition-colors" />
                <div className="text-6xl font-black text-white/[0.03] mb-8 group-hover:text-blue-500/10 transition-colors pointer-events-none">
                  0{i+1}
                </div>
                <h4 className="text-xl font-bold mb-4 text-white">{step.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed font-light">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ValuesSection />

      {/* ─── Stats Bento Grid ─── */}
      <section className="pb-32 px-6 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
          
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 lg:col-span-3 p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] flex flex-col justify-between group overflow-hidden relative shadow-2xl"
          >
            <ShieldCheck className="absolute -right-8 -bottom-8 w-64 h-64 text-white/10 group-hover:rotate-12 transition-transform duration-1000" />
            <h5 className="text-white/80 uppercase text-[10px] font-black tracking-[0.3em] mb-12">Data Sovereignty</h5>
            <div className="relative z-10">
              <div className="text-6xl font-extrabold text-white mb-3">100%</div>
              <p className="text-blue-100 text-sm font-medium">Local execution. Zero external telemetry.</p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 lg:col-span-3 p-10 bg-[#0A0A0C] border border-white/10 rounded-[2.5rem] flex flex-col justify-between shadow-2xl hover:border-white/20 transition-colors"
          >
            <Search className="w-10 h-10 text-emerald-400 mb-12" />
            <div>
              <div className="text-5xl font-extrabold text-white mb-3">42.9%</div>
              <p className="text-slate-400 text-sm font-light">Unstated requirement mitigation rate.</p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 lg:col-span-2 p-10 bg-[#0A0A0C] border border-white/10 rounded-[2.5rem] flex items-center justify-between shadow-2xl hover:border-white/20 transition-colors"
          >
            <div>
               <div className="text-4xl font-extrabold text-white mb-2">4 <span className="text-xl font-medium text-slate-500">Hrs</span></div>
               <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Analysis Cycle</p>
            </div>
            <Zap className="w-8 h-8 text-blue-500" />
          </motion.div>

          {/* Card 4 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 lg:col-span-4 p-10 bg-gradient-to-br from-[#121214] to-[#0A0A0C] rounded-[2.5rem] border border-white/10 flex items-center justify-between overflow-hidden relative shadow-2xl"
          >
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(16,185,129,0.08),transparent)] pointer-events-none" />
             <div className="relative z-10 max-w-[280px]">
                <div className="text-2xl font-bold text-white mb-2 tracking-tight">Open Source Core</div>
                <p className="text-slate-400 text-sm font-light leading-relaxed">Built entirely on robust containerized tools like n8n, Ollama, and ChromaDB.</p>
             </div>
             <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4">
               <Database className="w-32 h-32 text-white/5" />
             </div>
          </motion.div>

        </div>
      </section>

      {/* ─── Final CTA Section ─── */}
      <section className="py-32 px-6 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto p-12 md:p-20 rounded-[3rem] bg-gradient-to-b from-[#0A0A0C] to-[#030305] border border-white/10 text-center relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 tracking-tighter text-white leading-tight">
            Ready to engineer <br /> requirements autonomously?
          </h2>
          <Link href="/auth">
            <button className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto mt-10">
              <span className="relative z-10">Initiate Local Node</span>
              <ArrowUpRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </section>

      <div className="relative z-50">
        <Footer />
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}