'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Server, 
  FileKey, 
  Network, 
  Globe, 
  XCircle, 
  CheckCircle2, 
  Activity 
} from 'lucide-react';

function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent pointer-events-none z-20"
      animate={{ top: ['-2px', '100%'] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
    />
  );
}

export default function PrivacyManifesto() {
  const manifestoPoints = [
    {
      icon: Network,
      title: "Hardened Air-Gap",
      desc: "Zero telemetry. Our engine is hard-coded to refuse all external network calls, ensuring your prompts never touch the public web."
    },
    {
      icon: Server,
      title: "Local-First Vector Ops",
      desc: "All RAG operations run via an on-prem ChromaDB instance. Your Knowledge Graph is built and stored exclusively on your encrypted hardware."
    },
    {
      icon: FileKey,
      title: "Model Sovereignty",
      desc: "Run Llama-3 or Mistral locally. You own the weights and the inference. No API keys, no usage tracking, and no 'training on your data'."
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.4 }
    }
  };

  const lineVariants: Variants = {
    hidden: { opacity: 0, x: -10, filter: 'blur(4px)' },
    visible: { 
      opacity: 1, 
      x: 0, 
      filter: 'blur(0px)', 
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <section id="security" className="py-32 bg-[#030305] relative overflow-hidden font-sans selection:bg-emerald-500/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      <svg className="absolute inset-0 w-full h-full opacity-[0.02] pointer-events-none z-10" aria-hidden>
        <filter id="noise-privacy">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-privacy)" />
      </svg>

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-900/10 blur-[120px] rounded-full" 
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1300px] mx-auto px-6 relative z-20">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              Privacy by Design (PbD)
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Intelligence in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                Total Isolation.
              </span>
            </h2>

            <p className="text-lg text-slate-400 mb-12 leading-relaxed font-light max-w-xl">
              We take a radical stance on requirements data: <strong className="text-white font-medium">If it's on the cloud, it's a liability.</strong> BIWIZE turns your local environment into an impenetrable fortress for stakeholder intelligence.
            </p>

            <div className="space-y-4">
              {manifestoPoints.map((point, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ x: 8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group flex gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#0A0A0C] border border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-all duration-300 shadow-lg">
                    <point.icon className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold tracking-tight mb-1.5 group-hover:text-emerald-50 transition-colors">{point.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-light">{point.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-[540px]"
          >
            <div className="absolute inset-0 bg-emerald-500/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />
            
            <div className="relative rounded-2xl bg-[#0A0A0C]/90 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden ring-1 ring-white/5">
              
              <ScanLine />

              <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-[#121214]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                  <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  Sovereign Core Monitor
                </div>
                <div className="w-10" />
              </div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-7 font-mono text-[13px] text-slate-300 space-y-5 min-h-[340px] relative z-10"
              >
                <motion.div variants={lineVariants} className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold mt-0.5">❯</span>
                  <div>
                    <span className="text-white font-bold">init</span> biwize-sovereign-engine <span className="text-emerald-400">--air-gapped</span>
                    <div className="text-slate-500 mt-1.5 text-[11px] uppercase tracking-widest">Booting local inference core...</div>
                  </div>
                </motion.div>
                
                <motion.div variants={lineVariants} className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 py-2 border-y border-white/[0.05] bg-blue-500/[0.02] -mx-7 px-7">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300 italic text-xs">Intercepting outbound requests...</span>
                  </div>
                  
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 text-slate-400">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span>TCP: api.openai.com:443</span>
                    </div>
                    <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-bold tracking-widest">BLOCKED</span>
                  </div>

                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 text-slate-400">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span>TCP: telemetry.biwize.io:443</span>
                    </div>
                    <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-bold tracking-widest">BLOCKED</span>
                  </div>
                </motion.div>

                <motion.div variants={lineVariants} className="pt-3 space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Inference: <span className="text-emerald-50 font-semibold">Llama-3-70B (FP16)</span> attached.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Vector Store: <span className="text-emerald-50 font-semibold">local-chroma-db</span> mounted.</span>
                  </div>
                </motion.div>

                <motion.div variants={lineVariants} className="flex items-center gap-2 pt-4 border-t border-white/[0.05]">
                  <span className="text-emerald-400 font-bold">System running securely.</span>
                  <motion.div 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                    className="w-2.5 h-4 bg-emerald-400"
                  />
                </motion.div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20, x: 20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, duration: 0.6, type: "spring", bounce: 0.4 }}
              className="absolute -bottom-8 -right-4 md:-bottom-10 md:-right-8 bg-[#0a0a0c]/90 backdrop-blur-xl border border-white/10 p-4 pr-6 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] flex items-center gap-4 z-30 group cursor-default"
            >
              <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/30 group-hover:bg-emerald-500/20 transition-colors">
                <Lock className="w-5 h-5 text-emerald-400" />
                <div className="absolute inset-0 rounded-full border border-emerald-400/50 animate-ping opacity-20" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5 font-bold">Security Grade</span>
                <span className="text-sm font-black text-white tracking-tight">VPC COMPLIANT</span>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
