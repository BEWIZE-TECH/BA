'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  BrainCircuit, 
  ShieldCheck, 
  Network, 
  Cpu, 
  Activity,
  FileBox,
  Fingerprint
} from 'lucide-react';

export function SolutionArchitecture() {
  const nodes = [
    {
      id: "01",
      title: "Local Ingestion",
      desc: "Multi-modal parsing of stakeholder artifacts without leaving the host.",
      icon: FileBox,
      color: "from-blue-500 to-cyan-400",
      status: "Zero-Telemetry",
      tech: ["n8n Pipelines", "Local OCR", "Audio Transcripts"]
    },
    {
      id: "02",
      title: "Knowledge Mapping",
      desc: "High-dimensional vector embedding and semantic relationship extraction.",
      icon: Database,
      color: "from-indigo-500 to-blue-500",
      status: "Index Active",
      tech: ["ChromaDB", "Semantic Search", "Knowledge Graph"]
    },
    {
      id: "03",
      title: "Agentic Reasoning",
      desc: "Autonomous reasoning loops cross-referencing constraints and edge-cases.",
      icon: BrainCircuit,
      color: "from-violet-500 to-fuchsia-500",
      status: "Multi-Hop Live",
      tech: ["Ollama / Llama-3", "Tree-of-Thoughts", "Context Window"]
    },
    {
      id: "04",
      title: "Synthesis & Fidelity",
      desc: "Drafting traceable SRS documentation and stakeholder sentiment analysis.",
      icon: ShieldCheck,
      color: "from-emerald-500 to-teal-400",
      status: "Validation Pass",
      tech: ["VADER Sentiment", "Traceability Matrix", "Logic Sync"]
    }
  ];

  return (
    <section className="py-32 bg-[#030305] relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Network className="w-3.5 h-3.5" />
            System Architecture
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight"
          >
            Autonomous <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Reasoning</span> Pipeline
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-400 max-w-3xl text-lg font-light leading-relaxed"
          >
            Standard RAG retrieves text. <strong className="text-white font-medium">BIWIZE thinks.</strong> Our engine autonomously parses, connects, and validates every requirement against your local technical architecture.
          </motion.p>
        </div>

        <div className="relative">
          <div className="absolute top-[120px] left-[10%] right-[10%] h-[2px] hidden lg:block z-0">
            <div className="absolute inset-0 border-t-2 border-dashed border-white/10" />
            <motion.div
              className="absolute top-[-1px] left-0 w-32 h-[4px] bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-[2px]"
              animate={{ x: ["-100%", "500%", "900%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            />
            <motion.div
              className="absolute top-0 left-0 w-16 h-[2px] bg-white"
              animate={{ x: ["-100%", "1000%", "1800%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
            {nodes.map((node, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative group"
              >
                <div className="h-full bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 transition-all duration-500 hover:bg-[#0f0f13] hover:border-white/[0.15] hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] overflow-hidden flex flex-col">
                  <div className="absolute -right-4 -top-8 text-[120px] font-black text-white/[0.02] pointer-events-none select-none group-hover:text-blue-500/[0.03] transition-colors duration-500">
                    {node.id}
                  </div>

                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${node.color} p-[1px] shadow-lg`}>
                      <div className="w-full h-full bg-[#050505] rounded-[15px] flex items-center justify-center">
                        <node.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.05]">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{node.status}</span>
                    </div>
                  </div>

                  <div className="relative z-10 flex-grow">
                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                      {node.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6 font-light">
                      {node.desc}
                    </p>
                  </div>

                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Cpu className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Engine Stack</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {node.tech.map((t, i) => (
                        <span 
                          key={i} 
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-300 bg-white/[0.04] border border-white/[0.06] rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {idx !== nodes.length - 1 && (
                  <div className="lg:hidden flex justify-center py-4">
                    <div className="w-px h-8 bg-gradient-to-b from-blue-500/50 to-transparent" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
