'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Cpu, 
  HardDrive, 
  Server, 
  HelpCircle,
  Activity
} from 'lucide-react';

const FAQs = [
  {
    question: "What hardware do I need to run BIWIZE locally?",
    answer: "BIWIZE utilizes highly quantized GGUF models. For optimal throughput, we recommend 16GB+ RAM and an NVIDIA GPU (6GB+ VRAM). On Apple Silicon, M1/M2/M3 chips utilize Unified Memory for near-instant inference."
  },
  {
    question: "Is data isolation cryptographically guaranteed?",
    answer: "Our Docker orchestration hard-disables external network drivers. The application binding is strictly restricted to 127.0.0.1. No telemetry or 'phone home' scripts exist anywhere in the core engine."
  },
  {
    question: "Can I swap the LLM for my own GGUF model?",
    answer: "Yes. The Sovereign Engine is fundamentally model-agnostic. Simply mount your model to the /core/models directory. It natively supports Llama-3, Mistral, and custom fine-tuned enterprise models."
  },
  {
    question: "How does the 'Agentic' reasoning differ from RAG?",
    answer: "Standard RAG relies on a single linear search pass. Our Agentic Core performs recursive verification: it retrieves data, analyzes it for logic gaps, and autonomously re-queries the vector store if the initial proof is insufficient."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 bg-[#030305] relative overflow-hidden font-sans">
      
      {/* ─── Background FX & Grid ─── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      <svg className="absolute inset-0 w-full h-full opacity-[0.02] pointer-events-none z-10" aria-hidden>
        <filter id="noise-faq">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-faq)" />
      </svg>

      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none z-0" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.12, 0.08] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none z-0" 
      />
      
      <div className="max-w-7xl mx-auto px-6 relative z-20">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">
          
          {/* ─── Left Column: Headers & Specs ─── */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                <HelpCircle className="w-3.5 h-3.5" />
                Technical FAQ
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                Deployment <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  Specifications.
                </span>
              </h2>
              <p className="text-slate-400 font-light text-lg leading-relaxed">
                Clear, uncompromising answers for mission-critical environment deployments.
              </p>
            </div>

            {/* System Requirements Card */}
            <div className="p-1 rounded-3xl bg-gradient-to-b from-white/[0.08] to-transparent shadow-2xl">
              <div className="bg-[#0a0a0c]/90 backdrop-blur-xl rounded-[23px] p-8 border border-white/[0.05] relative overflow-hidden">
                
                {/* Card Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/[0.05]">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Sys. Requirements</h3>
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Optimized</span>
                  </div>
                </div>

                {/* Specs List */}
                <div className="space-y-8">
                  <div className="flex items-start gap-5 group">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Cpu className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Recommended Processor</p>
                      <p className="text-sm font-medium text-slate-200">8-Core (Apple Silicon or Intel i7+)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5 group">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Server className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Neural Memory (RAM/VRAM)</p>
                      <p className="text-sm font-medium text-slate-200">16GB RAM / 8GB VRAM Minimum</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5 group">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <HardDrive className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Local Storage Allocation</p>
                      <p className="text-sm font-medium text-slate-200">20GB NVMe (Model + Vector DB)</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* ─── Right Column: Accordion ─── */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center space-y-4"
          >
            {FAQs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              
              return (
                <div 
                  key={idx} 
                  className={`group overflow-hidden rounded-2xl border transition-all duration-500 ${
                    isOpen 
                      ? 'bg-blue-900/10 border-blue-500/30 shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)]' 
                      : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10'
                  } backdrop-blur-sm`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none"
                  >
                    <span className={`text-lg md:text-xl font-medium tracking-tight transition-colors duration-300 ${
                      isOpen ? 'text-white' : 'text-slate-300 group-hover:text-white'
                    }`}>
                      {faq.question}
                    </span>
                    <div className={`ml-6 shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                      isOpen ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-white'
                    }`}>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-500 ease-[0.22,1,0.36,1] ${
                        isOpen ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="px-6 md:px-8 pb-8">
                          <div className="w-full h-px bg-gradient-to-r from-blue-500/20 to-transparent mb-6" />
                          <motion.p 
                            initial={{ y: -10 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="text-slate-400 leading-relaxed font-light text-base"
                          >
                            {faq.answer}
                          </motion.p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}