'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Database, 
  Container, 
  Workflow, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Box 
} from 'lucide-react';

export default function TechStackTicker() {
  const techs = [
    { name: "Docker", icon: Container },
    { name: "Redis", icon: Database },
    { name: "Python", icon: Code2 },
    { name: "n8n", icon: Workflow },
    { name: "Llama-3", icon: Cpu }, 
    { name: "LangChain", icon: Layers },
    { name: "PostgreSQL", icon: Box },
    { name: "Ollama", icon: ShieldCheck },
  ];

  const duplicatedTechs = [...techs, ...techs];

  return (
    <div className="py-32 bg-[#050505] relative overflow-hidden ">
  
      <div className="absolute top-2 left-1/2 -translate-x-1/2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold">
          Powering Sovereign Intelligence
        </span>
      </div>
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" />
      <div className="flex mt-4">
        <motion.div 
          className="flex gap-16 whitespace-nowrap items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            ease: "linear", 
            duration: 25, 
            repeat: Infinity 
          }}
        >
          {duplicatedTechs.map((t, i) => (
            <div 
              key={i} 
              className="flex items-center gap-4 group cursor-default"
            >
              <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-500/5 transition-all duration-300">
                <t.icon className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </div>
              <span className="text-sm font-semibold tracking-wide text-slate-500 group-hover:text-slate-200 transition-colors">
                {t.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}