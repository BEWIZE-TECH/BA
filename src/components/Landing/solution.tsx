'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Database, FileText, BrainCircuit, ShieldCheck, Layers } from 'lucide-react';

export function SolutionArchitecture() {
  const steps = [
    {
      title: "Data Sovereignty",
      desc: "Local Ingestion",
      icon: FileText,
      color: "blue",
      details: "PDFs, Slack, Transcripts",
      isMain: true
    },
    {
      title: "Neural Index",
      desc: "Vector Embedding",
      icon: Database,
      color: "purple",
      details: "On-Prem ChromaDB",
      isMain: true
    },
    {
      title: "Agentic Core",
      desc: "Recursive Reasoning",
      icon: BrainCircuit,
      color: "blue",
      details: "Self-Correction Loop",
      isMain: true
    },
    {
      title: "Validation",
      desc: "Logic Synthesis",
      icon: ShieldCheck,
      color: "emerald",
      details: "Constraint Checking",
      isMain: true
    }
  ];

  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden font-sans selection:bg-blue-500/30">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-6 tracking-tight"
          >
            Agentic <span className="text-slate-500 italic font-light">Reasoning</span> Loop
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 max-w-2xl text-lg font-light leading-relaxed tracking-wide"
          >
            Standard RAG retrieves. BIWIZE <span className="text-white font-medium">thinks</span>. Our engine autonomously cross-references every requirement against your existing technical architecture.
          </motion.p>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4">
          <div className="absolute top-[45%] left-[10%] w-[80%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent hidden md:block -translate-y-1/2 overflow-hidden z-0">
            <motion.div
              className="h-full w-32 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_3px_rgba(59,130,246,0.6)]"
              animate={{ x: ["-100%", "500%"] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
            />
          </div>

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.15, duration: 0.6, ease: "easeOut" }}
              className="relative flex flex-col items-center group z-10"
            >

              <motion.div 
                whileHover={{ y: -5 }}
                className="relative p-[1px] rounded-2xl mb-6 scale-110"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#0A0A0B] border border-blue-500/30 flex flex-col items-center justify-center transition-all duration-500 shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)] group-hover:border-blue-400/60 group-hover:shadow-[0_0_40px_-5px_rgba(59,130,246,0.5)] bg-gradient-to-b from-white/[0.02] to-transparent">
                  
                  <motion.div animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: idx * 0.2 }}>
                    <step.icon className="w-8 h-8 text-blue-400" />
                  </motion.div>
                  
                  <motion.span 
                    className="absolute inset-0 rounded-2xl border border-blue-400/30"
                    animate={{ opacity: [0.5, 0], scale: [1, 1.3] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut", delay: idx * 0.5 }}
                  />
                </div>
              </motion.div>
              <div className="text-center">
                <motion.h3 
                  className="text-sm font-bold uppercase tracking-widest mb-1.5 text-blue-400 group-hover:text-blue-300 transition-colors"
                >
                  {step.title}
                </motion.h3>
                <p className="text-[13px] text-slate-300 font-medium mb-4">{step.desc}</p>
                
                <div className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 font-mono tracking-wide group-hover:border-white/10 transition-colors">
                  {step.details}
                </div>
              </div>
              {idx !== steps.length - 1 && (
                <motion.div 
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="md:hidden mt-8 text-blue-500/50"
                >
                  <Layers className="w-5 h-5" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}