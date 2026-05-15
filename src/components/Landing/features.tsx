'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  Search, Shield, GitBranch, 
  Terminal, LineChart, Sparkles, ArrowRight, Check, Lock, Server, Cpu, Activity, Zap
} from 'lucide-react';

const inlineStyles = `
.magic-bento-card {
  display: flex;
  position: relative;
  width: 100%;
  border-radius: 1.5rem;
  background: rgba(10, 10, 12, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  
  --glow-x: 50%;
  --glow-y: 50%;
  --glow-intensity: 0;
  --glow-radius: 400px;
}

.magic-bento-card:hover {
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 20px 40px -20px rgba(0,0,0,0.5);
}

.magic-bento-card--border-glow::after {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  background: radial-gradient(
    var(--glow-radius) circle at var(--glow-x) var(--glow-y),
    rgba(var(--card-glow-rgb), calc(var(--glow-intensity) * 0.8)) 0%,
    rgba(var(--card-glow-rgb), calc(var(--glow-intensity) * 0.1)) 50%,
    transparent 100%
  );
  border-radius: inherit;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.3s ease;
  z-index: 50;
}

.particle {
  position: absolute;
  pointer-events: none;
  z-index: 100;
}

.global-spotlight {
  mix-blend-mode: screen;
  will-change: transform, opacity;
  z-index: 200 !important;
  pointer-events: none;
}
`;

const calculateSpotlightValues = (radius: number) => ({ proximity: radius * 0.5, fadeDistance: radius * 0.75 });

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;
  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const GlobalSpotlight = ({ gridRef, spotlightRadius = 400, glowColor = '255, 255, 255' }: any) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!gridRef?.current) return;
    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed; width: ${spotlightRadius * 2}px; height: ${spotlightRadius * 2}px;
      border-radius: 50%; pointer-events: none;
      background: radial-gradient(circle, rgba(${glowColor}, 0.05) 0%, rgba(${glowColor}, 0.01) 50%, transparent 70%);
      opacity: 0; transform: translate(-50%, -50%);
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = gridRef.current.getBoundingClientRect();
      const mouseInside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      const cards = gridRef.current.querySelectorAll('.magic-bento-card');

      if (!mouseInside) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.5 });
        cards.forEach((card: any) => card.style.setProperty('--glow-intensity', '0'));
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach((card: any) => {
        const cardRect = card.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);
        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = effectiveDistance <= proximity ? 1 : effectiveDistance <= fadeDistance ? (fadeDistance - effectiveDistance) / (fadeDistance - proximity) : 0;
        updateCardGlowProperties(card, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.15, ease: "power2.out" });
      const targetOpacity = minDistance <= proximity ? 1 : minDistance <= fadeDistance ? (fadeDistance - minDistance) / (fadeDistance - proximity) : 0;
      gsap.to(spotlightRef.current, { opacity: targetOpacity, duration: 0.3 });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      spotlightRef.current?.remove();
    };
  }, [gridRef, spotlightRadius, glowColor]);

  return null;
};

const MagicContainer = ({ children, className = '', spotlightRadius = 400 }: any) => {
  const gridRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={gridRef} className={`relative ${className}`}>
      <GlobalSpotlight gridRef={gridRef} spotlightRadius={spotlightRadius} glowColor="255, 255, 255" />
      {children}
    </div>
  );
};

const MagicCard = ({ children, className = '', glowColor = '132, 0, 255', enableTilt = true, enableMagnetism = true }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    let isHovered = false;
    let particleInterval: NodeJS.Timeout;
    
    const createParticle = () => {
      if (!isHovered) return;
      const rect = el.getBoundingClientRect();
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        width: 3px; height: 3px; border-radius: 50%;
        background: rgba(${glowColor}, 0.8); box-shadow: 0 0 10px rgba(${glowColor}, 1);
        left: ${Math.random() * rect.width}px; top: ${Math.random() * rect.height}px;
      `;
      el.appendChild(p);
      
      gsap.fromTo(p, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 });
      gsap.to(p, {
        x: (Math.random() - 0.5) * 80, y: (Math.random() - 0.5) * 80,
        opacity: 0, duration: 1.5 + Math.random(),
        ease: "power1.out",
        onComplete: () => p.remove()
      });
    };

    const handleMouseEnter = () => {
      isHovered = true;
      particleInterval = setInterval(createParticle, 300);
      if (enableTilt) gsap.to(el, { rotateX: 1.5, rotateY: 1.5, duration: 0.4, transformPerspective: 1200, ease: "power2.out" });
    };

    const handleMouseLeave = () => {
      isHovered = false;
      clearInterval(particleInterval);
      gsap.to(el, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.5, ease: "power2.out" });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        gsap.to(el, { rotateX: ((y - centerY) / centerY) * -3, rotateY: ((x - centerX) / centerX) * 3, duration: 0.2 });
      }
      if (enableMagnetism) {
        gsap.to(el, { x: (x - centerX) * 0.02, y: (y - centerY) * 0.02, duration: 0.3 });
      }
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(particleInterval);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mousemove', handleMouseMove);
    };
  }, [glowColor, enableTilt, enableMagnetism]);

  return (
    <div ref={cardRef} className={`magic-bento-card magic-bento-card--border-glow ${className}`} style={{ '--card-glow-rgb': glowColor } as React.CSSProperties}>
      {children}
    </div>
  );
};

export default function FeaturesGridBento() {
  return (
    <section className="py-32 bg-[#030305] relative overflow-hidden font-sans selection:bg-blue-500/30">
      <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />
      

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      <svg className="absolute inset-0 w-full h-full opacity-[0.02] pointer-events-none z-10" aria-hidden>
        <filter id="noise-bento">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-bento)" />
      </svg>


      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none z-0" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none z-0" 
      />

      <div className="max-w-[1300px] mx-auto px-6 relative z-20">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] text-slate-300 text-xs font-bold uppercase tracking-widest mb-6">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            Core Capabilities
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Intelligence.</span>
          </h2>
          <p className="text-slate-400 max-w-2xl text-lg font-light leading-relaxed">
            The fundamental features powering BIWIZE's autonomous reasoning engine, designed to eradicate scope creep entirely.
          </p>
        </div>
  
        <MagicContainer className="grid grid-cols-1 lg:grid-cols-12 gap-6">
       
          {/* ─── Card 1: Agentic Reasoning Loop ─── */}
          <MagicCard 
            glowColor="59, 130, 246" 
            className="lg:col-span-7 p-8 md:p-10 group flex flex-col md:flex-row gap-10 items-center shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="flex-1 z-10 relative">
              <div className="mb-6 inline-flex p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]">
                <GitBranch className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Agentic Reasoning Loop</h3>
              <p className="text-slate-400 text-[15px] leading-relaxed mb-8 font-light">
                Agents actively reason across multi-modal documents to identify logic conflicts. Every output includes an automated Traceability Matrix.
              </p>
              <button className="flex items-center gap-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all group-hover:border-blue-500/40 group-hover:text-blue-200">
                Explore the loop <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex-1 w-full relative h-[280px] flex items-center justify-center bg-[#050505]/80 border border-white/[0.08] rounded-2xl overflow-hidden group-hover:border-blue-500/30 transition-colors shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10 flex flex-col w-full px-6 gap-0">
                
                {/* Step 1 */}
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex items-center justify-between bg-white/[0.03] border border-white/10 p-3.5 rounded-xl z-20 backdrop-blur-md">
                   <span className="flex items-center gap-3 text-xs font-mono text-slate-300"><Search className="w-4 h-4 text-slate-400"/> Context_Ingestion()</span>
                </motion.div>
                
                {/* Connecting Line 1 */}
                <div className="w-px h-8 bg-gradient-to-b from-white/10 to-blue-500/50 ml-10 relative z-10">
                  <motion.div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent" animate={{ y: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} />
                </div>
                
                {/* Step 2 */}
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex items-center justify-between bg-blue-500/[0.05] border border-blue-500/40 p-3.5 rounded-xl z-20 shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)] ml-6 backdrop-blur-md">
                  <span className="flex items-center gap-3 text-xs font-mono text-blue-100"><Sparkles className="w-4 h-4 text-blue-400"/> Cross_Reference_Agents</span>
                </motion.div>
                
                {/* Connecting Line 2 */}
                <div className="w-px h-8 bg-gradient-to-b from-blue-500/50 to-emerald-500/50 ml-16 relative z-10">
                   <motion.div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-emerald-400 to-transparent" animate={{ y: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 2, delay: 1, ease: "linear" }} />
                </div>
                
                {/* Step 3 */}
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex items-center justify-between bg-emerald-500/[0.05] border border-emerald-500/30 p-3.5 rounded-xl z-20 ml-12 backdrop-blur-md">
                  <span className="flex items-center gap-3 text-xs font-mono text-emerald-100"><Check className="w-4 h-4 text-emerald-400"/> Matrix_Linked</span>
                </motion.div>
              </div>
            </div>
          </MagicCard>

          {/* ─── Card 2: Predictive Intelligence ─── */}
          <MagicCard 
            glowColor="168, 85, 247" 
            className="lg:col-span-5 lg:row-span-2 p-8 md:p-10 flex flex-col shadow-2xl group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="mb-6 inline-flex p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 relative z-10 shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)] group-hover:shadow-[0_0_40px_-5px_rgba(168,85,247,0.5)] transition-shadow duration-500">
              <LineChart className="w-6 h-6 text-purple-400" />
            </div>
            
            <div className="z-10 mb-10 relative">
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Predictive Intelligence</h3>
              <p className="text-slate-400 text-[15px] leading-relaxed font-light group-hover:text-slate-300 transition-colors">
                Extract hidden stakeholder resistance from transcripts automatically and visualize the delta between current and target states.
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-end gap-5 relative z-10 w-full mt-auto">
              {/* Fade out top of chat */}
              <div className="absolute top-[-40px] left-0 w-full h-24 bg-gradient-to-b from-[#0A0A0C] to-transparent z-20 pointer-events-none" />
              

              <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} className="bg-white/[0.05] border border-white/10 rounded-2xl rounded-tr-sm p-4 text-[13px] text-white/90 self-end max-w-[85%] backdrop-blur-md shadow-lg font-medium">
                Analyze Q3 stakeholder interviews for resistance risks.
              </motion.div>
              

              <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex items-start gap-4 self-start w-full">
                <div className="w-8 h-8 rounded-full flex-shrink-0 mt-1 shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center relative overflow-hidden bg-black border border-purple-500/30">
                  <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_70%,#a855f7)] animate-spin" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-[2px] bg-[#0c0a13] rounded-full flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                </div>
                
                <div className="bg-[#0D0B12]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl rounded-tl-sm p-5 text-[13px] text-slate-300 leading-relaxed shadow-xl relative overflow-hidden flex-1 group/msg">
                  <motion.div animate={{ y: ["-100%", "300%"], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_15px_1px_rgba(168,85,247,0.8)] z-20" />
                  
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-[10px] uppercase mb-4 tracking-widest relative z-10">
                    <Activity className="w-3.5 h-3.5 animate-pulse" /> 
                    Sentiment Engine Active
                  </div>
                  
                  <div className="relative z-10">
                    <p className="mb-4">Hidden resistance detected in Operations regarding the new ERP migration.</p>
                    <motion.div initial={{ opacity: 0, filter: "blur(4px)", y: 5 }} whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 0.5 }} className="bg-purple-500/[0.08] border border-purple-500/20 rounded-xl p-3.5">
                      <div className="flex items-center gap-2 text-purple-300 font-semibold mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" /> Gap Identified
                      </div>
                      <span className="text-slate-400 text-xs font-light">Current architecture lacks required compliance modules.</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </MagicCard>


          <MagicCard 
            glowColor="16, 185, 129" 
            className="lg:col-span-7 p-8 md:p-10 flex flex-col-reverse md:flex-row gap-10 items-center shadow-2xl group"
          >
             <div className="absolute inset-0 bg-gradient-to-tl from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="flex-1 w-full relative h-[280px] bg-[#050505]/90 border border-white/10 rounded-2xl p-5 flex flex-col shadow-2xl backdrop-blur-md group-hover:border-emerald-500/30 transition-colors">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-500"/>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 font-bold">system_monitor.sh</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                </div>
              </div>

              <div className="space-y-4 flex-1 font-mono text-[11px] overflow-hidden">
                {[ 
                  { icon: Lock, label: "NETWORK_EGRESS", status: "SECURE (0 KB/s)", color: "text-emerald-500" }, 
                  { icon: Server, label: "LOCAL_INFERENCE", status: "RUNNING [PORT:8080]", color: "text-slate-300" } 
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (i * 0.1) }} className="flex items-center justify-between bg-white/[0.03] p-3 rounded-lg border border-white/[0.05] text-slate-400">
                    <span className="flex items-center gap-3"><item.icon className="w-3.5 h-3.5 text-slate-500"/> {item.label}</span>
                    <span className={`font-bold tracking-wide ${item.color}`}>{item.status}</span>
                  </motion.div>
                ))}
                
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 pt-5 border-t border-white/10">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-2 font-bold tracking-widest uppercase">
                    <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5"/> VRAM ALLOCATION</span>
                    <span>18.4GB / 24GB</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" animate={{ width: ["70%", "78%", "72%", "85%", "75%"] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} />
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="flex-1 z-10 relative">
              <div className="mb-6 inline-flex p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Sovereign & Air-Gapped</h3>
              <p className="text-slate-400 text-[15px] leading-relaxed mb-6 font-light">
                100% local execution designed for defense environments. Refine models on internal vocabulary without sending a single byte to the cloud.
              </p>
              
              <ul className="space-y-3.5">
                {['Zero data exfiltration risks', 'Local fine-tuning capabilities', 'Designed for secure networks'].map((item, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (i * 0.1), type: "spring" }} className="flex items-center gap-3 text-[14px] text-slate-300 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div> 
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </MagicCard>

        </MagicContainer>
      </div>
    </section>
  );
}