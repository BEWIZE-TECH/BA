'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Server, FileKey, Network, Globe, XCircle, CheckCircle2, Activity } from 'lucide-react';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.4, delayChildren: 0.5 }
    }
  };

  const lineVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  return (
    <section id="security" className="py-32 bg-[#050505] relative overflow-hidden font-sans selection:bg-emerald-500/30">

      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 80, damping: 12 }}
          className=""
        >
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-medium text-white tracking-tight leading-[1.1]">
            Intelligence <span className="text-slate-500 italic font-light">In Total </span> Isolation.
          </h2>

          <p className="text-[17px] text-slate-400 mb-12 leading-relaxed font-light max-w-xl">
            We take a radical stance on requirements data: <strong className="text-white font-medium">If it's on the cloud, it's a liability.</strong> BIWIZE turns your local environment into a fortress for sensitive stakeholder intelligence.
          </p>

          <div className="space-y-6">
            {manifestoPoints.map((point, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ x: 5 }}
                className="group flex gap-5 p-4 -ml-4 rounded-2xl hover:bg-white/[0.02] transition-all duration-300 border border-transparent hover:border-white/5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center group-hover:border-blue-500/40 group-hover:bg-blue-500/5 transition-all duration-300 shadow-lg">
                  <point.icon className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-white font-medium tracking-tight mb-1">{point.title}</h3>
                  <p className="text-slate-400 text-[14px] leading-relaxed font-light">{point.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-[500px]"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full opacity-60 pointer-events-none" />
            <div className="relative rounded-2xl bg-gradient-to-b from-[#111111] to-[#0A0A0A] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/5">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#161616]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  <Activity className="w-3 h-3 text-blue-500" />
                  Local Node Monitor
                </div>
                <div className="w-10" />
              </div>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-6 font-mono text-[13px] text-slate-300 space-y-5 min-h-[320px]"
              >
                <motion.div variants={lineVariants} className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-0.5">❯</span>
                  <div>
                    <span className="text-white font-semibold">init</span> biwize-sovereign-engine --air-gapped
                    <div className="text-slate-500 mt-1 text-[11px]">Booting local inference core...</div>
                  </div>
                </motion.div>
                <motion.div variants={lineVariants} className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 py-2 border-y border-white/5 bg-white/[0.01] -mx-6 px-6">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300 italic">Intercepting outbound requests...</span>
                  </div>
                  
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-2 text-slate-400 group-hover:text-white transition-colors">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span>TCP: api.openai.com:443</span>
                    </div>
                    <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-bold tracking-wide">BLOCKED</span>
                  </div>

                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-2 text-slate-400 group-hover:text-white transition-colors">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span>TCP: telemetry.biwize.io:443</span>
                    </div>
                    <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-bold tracking-wide">BLOCKED</span>
                  </div>
                </motion.div>
                <motion.div variants={lineVariants} className="pt-2 space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Inference: <span className="text-white">Llama-3-70B (FP16)</span> attached.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Vector Store: <span className="text-white">local-chroma-db</span> mounted.</span>
                  </div>
                </motion.div>
                <motion.div variants={lineVariants} className="flex items-center gap-2 pt-4">
                  <span className="text-blue-500">System running securely.</span>
                  <motion.div 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="w-2 h-4 bg-blue-500"
                  />
                </motion.div>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20, x: 20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
              className="absolute -bottom-8 -right-8 md:-bottom-10 md:-right-10 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 p-4 pr-6 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] flex items-center gap-4 z-20 group cursor-default"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 group-hover:bg-blue-500/20 transition-colors">
                <Lock className="w-4 h-4 text-blue-400" />
                <div className="absolute inset-0 rounded-full border border-blue-400/50 animate-ping opacity-20" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">Security Grade</span>
                <span className="text-sm font-bold text-white tracking-tight">VPC COMPLIANT</span>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
