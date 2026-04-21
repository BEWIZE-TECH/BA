'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Cpu, HardDrive, ShieldCheck, Zap, Server } from 'lucide-react';

const FAQs = [
  {
    question: "What hardware do I need to run BIWIZE locally?",
    answer: "BIWIZE utilizes quantized GGUF models. For optimal throughput, we recommend 16GB+ RAM and an NVIDIA GPU (6GB+ VRAM). On Apple Silicon, M1/M2/M3 chips utilize Unified Memory for near-instant inference."
  },
  {
    question: "Is data isolation cryptographically guaranteed?",
    answer: "Our Docker orchestration hard-disables external network drivers. The application binding is restricted to 127.0.0.1. No telemetry or 'phone home' scripts exist in the core engine."
  },
  {
    question: "Can I swap the LLM for my own GGUF model?",
    answer: "Yes. The Sovereign Engine is model-agnostic. Simply mount your model to the /core/models directory. Supports Llama-3, Mistral, and custom-tuned enterprise models."
  },
  {
    question: "How does the 'Agentic' reasoning differ from RAG?",
    answer: "Standard RAG is a linear search. Our Agentic Core performs recursive verification: it retrieves, analyzes for logic gaps, and re-queries the vector store if the initial proof is insufficient."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" 
      />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-medium text-white tracking-tight mb-4">
                Deployment <br /><span className="text-slate-500 italic">Specifications</span>
              </h2>
              <p className="text-slate-400 font-light">
                Technical answers for mission-critical deployments.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6 backdrop-blur-sm shadow-xl">
              <div className="flex items-start gap-4">
                <Cpu className="w-5 h-5 text-blue-500 mt-1 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-tighter">Recommended CPU</p>
                  <p className="text-sm text-slate-500">8-Core (Apple Silicon or Intel i7+)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Server className="w-5 h-5 text-purple-500 mt-1 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-tighter">Neural Memory</p>
                  <p className="text-sm text-slate-500">16GB RAM / 8GB VRAM</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <HardDrive className="w-5 h-5 text-emerald-500 mt-1 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-tighter">Storage</p>
                  <p className="text-sm text-slate-500">20GB NVMe (Model + Vector DB)</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {FAQs.map((faq, idx) => (
              <div 
                key={idx} 
                className="group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-sm transition-all duration-300 shadow-lg"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={`text-lg tracking-tight transition-colors duration-300 ${openIndex === idx ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-full transition-colors duration-300 ${openIndex === idx ? 'bg-blue-500/10' : 'bg-transparent group-hover:bg-white/5'}`}>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-blue-400' : 'text-slate-500'}`} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-8 text-slate-400 leading-relaxed font-light border-t border-white/[0.04] pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}