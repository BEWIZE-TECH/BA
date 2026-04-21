'use client';

import React, { useEffect, useState, Suspense, lazy } from 'react';
import { motion, type Transition } from 'framer-motion';
import { AlertTriangle, ArrowRight, ShieldAlert, Zap, Target, Activity } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AnimatedNumber: React.FC<{ value: number | string; prefix?: string; suffix?: string }> = ({ value, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState<number>(0);
  
  useEffect(() => {
    let start = 0;
    const end = typeof value === 'number' ? value : parseFloat(String(value));
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = window.setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        window.clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => window.clearInterval(timer);
  }, [value]);

  const endValue = typeof value === 'number' ? value : parseFloat(String(value));
  const precision = endValue % 1 === 0 ? 0 : 1;

  return <span>{prefix}{count.toFixed(precision)}{suffix}</span>;
};

const Spline = lazy(() => import('@splinetool/react-spline'));

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  return (
    <Suspense
      fallback={
        <div className={cn("w-full h-full flex items-center justify-center bg-[#050505] text-white", className)}>
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path>
          </svg>
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}


function InteractiveRobotHero() { 
  const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";
  const springTransition: Transition = { type: "spring", stiffness: 100, damping: 20 };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#050505]  flex items-center">

      <InteractiveRobotSpline
        scene={ROBOT_SCENE_URL}
        className="absolute inset-0 z-0" 
      />
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-24 xl:px-32 pointer-events-none py-24 md:py-32">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 w-full">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="flex flex-col text-left text-white drop-shadow-lg pointer-events-auto w-full max-w-[600px] xl:max-w-[700px]"
          >
            
            <motion.h2 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} transition={springTransition} className="text-4xl md:text-5xl lg:text-[56px] font-medium text-white mb-6 leading-[1.1] tracking-tight">
              The <span className="text-slate-500 italic font-light">Invisible Cost</span> of <br />
              Requirement Ambiguity.
            </motion.h2>
            
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} transition={springTransition} className="text-[17px] text-[#9CA3AF] mb-10 leading-relaxed font-light">
              Traditional scoping relies on human memory and static docs. But 
              <strong className="text-white font-medium"> 42.9% of project failure </strong> 
              stems from requirements that were never explicitly stated—hiding in plain sight within 
              stakeholder interviews and messy Slack threads.
            </motion.p>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} transition={springTransition} className="grid grid-cols-2 gap-8 mb-12 py-8 border-y border-white/[0.08]">
              <div>
                <div className="text-4xl font-semibold text-white tracking-tight mb-1">
                  <AnimatedNumber value={39} suffix="%" />
                </div>
                <div className="text-[11px] text-slate-500 uppercase tracking-widest font-medium">Project Attrition Rate</div>
              </div>
              <div>
                <div className="text-4xl font-semibold text-red-400 tracking-tight mb-1 drop-shadow-[0_0_15px_rgba(248,113,113,0.3)]">
                  <AnimatedNumber value={2.4} prefix="+$" suffix="M" />
                </div>
                <div className="text-[11px] text-slate-500 uppercase tracking-widest font-medium">Avg. Annual Scope Creep</div>
              </div>
            </motion.div>

            <motion.button variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="group flex items-center gap-3 text-white font-medium text-sm w-fit transition-all hover:text-blue-400">
              <span className="border-b border-white/20 pb-0.5 group-hover:border-blue-500/50 transition-colors">
                Read the 2026 Industry Report
              </span>
              <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-blue-500/10 transition-colors">
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ...springTransition }}
            className="relative group w-full max-w-[460px] shrink-0 pointer-events-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500/10 via-transparent to-blue-500/10 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000" />
            
            <div className="relative bg-[#0A0A0A]/90 backdrop-blur-xl p-8 rounded-[2rem] border border-white/[0.08] shadow-2xl overflow-hidden">
              <motion.div 
                animate={{ y: ["-10%", "200%"] }} 
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }} 
                className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none border-b border-white/[0.05]"
              />
              <div className="flex justify-between items-center mb-10 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-white/5 rounded-md border border-white/10">
                    <Target className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">Requirement Fidelity</span>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                  <Activity className="w-3 h-3" /> LIVE AUDIT
                </div>
              </div>
              <div className="mb-10 relative z-10">
                <div className="flex justify-between items-end mb-3">
                  <label className="text-[13px] font-medium text-slate-300">Legacy Manual Discovery</label>
                  <span className="text-[11px] text-red-400 font-mono tracking-wider">61.0% COVERAGE</span>
                </div>
                <div className="relative h-4 bg-white/[0.03] rounded-full overflow-hidden border border-white/5 flex">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: "61%" }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    className="h-full bg-slate-700 rounded-l-full relative overflow-hidden" 
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
                    className="flex-1 h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(239,68,68,0.1)_5px,rgba(239,68,68,0.1)_10px)] relative"
                  >
                    <div className="absolute inset-y-0 left-0 w-1 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                  </motion.div>
                </div>
                <div className="flex items-start gap-2 mt-4">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500/70 mt-0.5" />
                  <p className="text-[12px] text-slate-500 leading-tight">Missing: Hidden stakeholder intent, edge-case constraints, and undocumented technical debt.</p>
                </div>
              </div>
              <div className="mb-8 relative z-10">
                <div className="flex justify-between items-end mb-3">
                  <label className="text-[13px] font-medium text-white flex items-center gap-2">
                    Biwize Agentic RAG
                    <Zap className="w-3.5 h-3.5 fill-blue-500 text-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                  </label>
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-[11px] text-blue-400 font-mono tracking-wider font-bold">
                    99.2% COVERAGE
                  </motion.span>
                </div>
                <div className="h-4 bg-white/[0.03] rounded-full overflow-hidden p-[2px] border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: "99.2%" }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                    className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-400 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] relative overflow-hidden" 
                  >
                    <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                  </motion.div>
                </div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="mt-4 text-[11px] text-blue-400/80 font-bold tracking-widest uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Requirements Synthesized & Verified
                </motion.p>
              </div>
              <div className="pt-5 border-t border-white/[0.08] relative z-10">
                <div className="flex items-start gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/[0.05]">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-1.5">Neural Verification Active</h4>
                    <p className="text-[12px] text-[#9CA3AF] leading-relaxed">
                      Biwize mitigates human bias by cross-referencing multi-modal inputs against a secure, 100% local compliance vector store.
                    </p>
                  </div>
                </div>
              </div>
              
            </div>
          </motion.div>
        </div>
      </div>
    </div> 
  );
}
export default function CombinedPage() {
  return (
    <main className="min-h-screen bg-[#050505] flex flex-col font-sans">
      <InteractiveRobotHero />
    </main>
  );
}