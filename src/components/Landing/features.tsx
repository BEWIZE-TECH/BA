'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  Search, Shield, GitBranch, 
  Terminal, LineChart, Sparkles, ArrowRight, Check, Lock, Server, Cpu, Activity
} from 'lucide-react';
const inlineStyles = `
.magic-bento-card {
  display: flex;
  position: relative;
  width: 100%;
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  
  --glow-x: 50%;
  --glow-y: 50%;
  --glow-intensity: 0;
  --glow-radius: 400px;
}

.magic-bento-card--border-glow::after {
  content: '';
  position: absolute;
  inset: 0;
  padding: 2px;
  background: radial-gradient(
    var(--glow-radius) circle at var(--glow-x) var(--glow-y),
    rgba(var(--card-glow-rgb), calc(var(--glow-intensity) * 0.8)) 0%,
    rgba(var(--card-glow-rgb), calc(var(--glow-intensity) * 0.2)) 40%,
    transparent 70%
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

.particle-container {
  position: relative;
}

.particle::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: rgba(var(--card-glow-rgb), 0.2);
  border-radius: 50%;
  z-index: -1;
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
      background: radial-gradient(circle, rgba(${glowColor}, 0.08) 0%, rgba(${glowColor}, 0.03) 40%, transparent 70%);
      opacity: 0; transform: translate(-50%, -50%);
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = gridRef.current.getBoundingClientRect();
      const mouseInside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      const cards = gridRef.current.querySelectorAll('.magic-bento-card');

      if (!mouseInside) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3 });
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

      gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.1 });
      const targetOpacity = minDistance <= proximity ? 1 : minDistance <= fadeDistance ? (fadeDistance - minDistance) / (fadeDistance - proximity) : 0;
      gsap.to(spotlightRef.current, { opacity: targetOpacity, duration: 0.2 });
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
    
    const createParticle = () => {
      if (!isHovered) return;
      const rect = el.getBoundingClientRect();
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        position: absolute; width: 4px; height: 4px; border-radius: 50%;
        background: rgba(${glowColor}, 1); box-shadow: 0 0 8px rgba(${glowColor}, 0.8);
        left: ${Math.random() * rect.width}px; top: ${Math.random() * rect.height}px;
        pointer-events: none; z-index: 100;
      `;
      el.appendChild(p);
      
      gsap.fromTo(p, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(p, {
        x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100,
        opacity: 0, duration: 2 + Math.random() * 2,
        onComplete: () => p.remove()
      });
    };

    let particleInterval: NodeJS.Timeout;

    const handleMouseEnter = () => {
      isHovered = true;
      particleInterval = setInterval(createParticle, 200);
      if (enableTilt) gsap.to(el, { rotateX: 2, rotateY: 2, duration: 0.3, transformPerspective: 1000 });
    };

    const handleMouseLeave = () => {
      isHovered = false;
      clearInterval(particleInterval);
      gsap.to(el, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.3 });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        gsap.to(el, { rotateX: ((y - centerY) / centerY) * -5, rotateY: ((x - centerX) / centerX) * 5, duration: 0.1 });
      }
      if (enableMagnetism) {
        gsap.to(el, { x: (x - centerX) * 0.03, y: (y - centerY) * 0.03, duration: 0.3 });
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
    <div ref={cardRef} className={`magic-bento-card magic-bento-card--border-glow particle-container ${className}`} style={{ '--card-glow-rgb': glowColor } as React.CSSProperties}>
      {children}
    </div>
  );
};
export default function FeaturesGridBento() {
  const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden font-sans selection:bg-blue-500/30">
      <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-900/20 blur-[150px] rounded-full pointer-events-none" 
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
  
        <MagicContainer className="grid grid-cols-1 lg:grid-cols-12 gap-6">
       
          <MagicCard 
            glowColor="59, 130, 246" 
            className="lg:col-span-7 bg-gradient-to-b from-white/[0.04] to-transparent p-8 md:p-12 group flex flex-col md:flex-row gap-10 items-center shadow-2xl shadow-black"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="flex-1 z-10 relative">
              <motion.div whileHover={{ rotate: 15, scale: 1.1 }} className="mb-6 inline-flex p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]">
                <GitBranch className="w-6 h-6 text-blue-400" />
              </motion.div>
              <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">Agentic Reasoning Loop</h3>
              <p className="text-slate-400 text-[15px] leading-relaxed mb-8 font-light">
                Agents actively reason across multi-modal documents to identify logic conflicts. Every output includes an automated Traceability Matrix linking back to source files.
              </p>
              <button className="flex items-center gap-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all group-hover:border-blue-500/30 group-hover:text-blue-100">
                See the reasoning loop <motion.span group-hover={{ x: 5 }}><ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></motion.span>
              </button>
            </div>

            <div className="flex-1 w-full relative h-[250px] flex items-center justify-center bg-black/40 border border-white/5 rounded-2xl overflow-hidden group-hover:border-blue-500/20 transition-colors">
              <div className="relative z-10 flex flex-col gap-4 w-full px-8 text-[12px] font-mono text-slate-400">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex items-center justify-between bg-white/[0.03] border border-white/10 p-3 rounded-xl relative z-10 backdrop-blur-md">
                   <span className="flex items-center gap-2"><Search className="w-4 h-4 text-slate-300"/> Ingest_Data()</span>
                </motion.div>
                <div className="absolute top-10 left-14 w-px h-16 bg-gradient-to-b from-white/20 to-blue-500/50 -z-0">
                  <motion.div className="w-full h-1/2 bg-blue-400 shadow-[0_0_15px_2px_rgba(59,130,246,0.8)]" animate={{ y: [0, 32, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                </div>
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} animate={{ boxShadow: ['0 0 0px 0px rgba(59,130,246,0)', '0 0 20px 2px rgba(59,130,246,0.4)', '0 0 0px 0px rgba(59,130,246,0)'] }} className="flex items-center justify-between bg-[#05050A] border border-blue-500/40 p-3 rounded-xl ml-6 relative z-10 shadow-2xl">
                  <span className="flex items-center gap-2 text-blue-100"><Sparkles className="w-4 h-4 text-blue-400"/> Cross_Reference_Agents</span>
                </motion.div>
                <div className="absolute top-28 left-20 w-px h-16 bg-gradient-to-b from-blue-500/50 to-emerald-500/50 -z-0">
                   <motion.div className="w-full h-1/2 bg-emerald-400 shadow-[0_0_15px_2px_rgba(16,185,129,0.8)]" animate={{ y: [0, 32, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.75, ease: "linear" }} />
                </div>
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex items-center justify-between bg-emerald-500/[0.03] border border-emerald-500/30 p-3 rounded-xl ml-12 relative z-10 mt-2 backdrop-blur-md">
                  <span className="flex items-center gap-2 text-emerald-100"><Check className="w-4 h-4 text-emerald-400"/> Matrix_Linked</span>
                </motion.div>
              </div>
            </div>
          </MagicCard>
          <MagicCard 
            glowColor="168, 85, 247" 
            className="lg:col-span-5 lg:row-span-2 bg-gradient-to-b from-white/[0.04] to-transparent p-8 md:p-12 flex flex-col shadow-2xl shadow-black group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <motion.div whileHover={{ rotate: 15, scale: 1.1 }} className="mb-6 inline-flex p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 relative z-10 shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)] group-hover:shadow-[0_0_40px_-5px_rgba(168,85,247,0.5)] transition-shadow duration-500">
              <LineChart className="w-6 h-6 text-purple-400" />
            </motion.div>
            
            <div className="z-10 mb-12 relative">
              <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">Predictive Intelligence</h3>
              <p className="text-slate-400 text-[15px] leading-relaxed font-light group-hover:text-slate-300 transition-colors">
                Visualize the delta between current state and target architecture. Extract hidden stakeholder resistance from transcripts automatically.
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-end gap-5 relative z-10 w-full mt-auto">
              <div className="absolute top-[-20px] left-0 w-full h-16 bg-gradient-to-b from-[#0A0A0A] to-transparent z-20 pointer-events-none" />
              
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5, type: "spring", stiffness: 100 }} className="bg-white/[0.08] border border-white/10 rounded-2xl rounded-tr-sm p-4 text-[13px] text-white/90 self-end max-w-[85%] backdrop-blur-md shadow-lg font-medium">
                Analyze Q3 stakeholder interviews for resistance risks.
              </motion.div>
              
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.7, type: "spring", stiffness: 100 }} className="flex items-start gap-4 self-start w-full">
                <div className="w-8 h-8 rounded-full flex-shrink-0 mt-1 shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center relative overflow-hidden bg-black">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute inset-[-4px] bg-[conic-gradient(from_0deg,transparent_70%,#a855f7)] opacity-80" />
                  <div className="absolute inset-[2px] bg-gradient-to-br from-[#1E1626] to-[#100C17] rounded-full flex items-center justify-center border border-purple-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-purple-300 relative z-10" />
                  </div>
                </div>
                
                <div className="bg-[#0D0B12] border border-purple-500/20 rounded-2xl rounded-tl-sm p-5 text-[13px] text-slate-300 leading-relaxed shadow-xl relative overflow-hidden flex-1 group/msg">
                  <motion.div animate={{ y: ["-10%", "300%"], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }} className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_15px_1px_rgba(168,85,247,0.8)] z-20" />
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-[10px] uppercase mb-4 tracking-widest relative z-10">
                    <motion.div animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Activity className="w-3.5 h-3.5" /></motion.div> 
                    Sentiment Engine Active
                  </div>
                  <div className="relative z-10">
                    <p className="mb-4">Hidden resistance detected in Operations regarding the new ERP migration.</p>
                    <motion.div initial={{ opacity: 0, filter: "blur(4px)", y: 5 }} whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }} viewport={{ once: true }} transition={{ delay: 1.4, duration: 0.5 }} className="bg-purple-500/[0.08] border border-purple-500/20 rounded-lg p-3">
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
            className="lg:col-span-7 bg-gradient-to-t from-white/[0.04] to-transparent p-8 md:p-12 flex flex-col-reverse md:flex-row gap-10 items-center shadow-2xl shadow-black group"
          >
             <div className="absolute inset-0 bg-gradient-to-tl from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="flex-1 w-full relative h-[250px] bg-black/60 border border-white/10 rounded-2xl p-5 flex flex-col shadow-inner backdrop-blur-md group-hover:border-emerald-500/20 transition-colors">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-500"/>
                  <span className="text-[10px] font-mono tracking-wider text-slate-400">system_monitor.sh</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                </div>
              </div>

              <div className="space-y-3 flex-1 font-mono text-[11px] overflow-hidden">
                {[ { icon: Lock, label: "NETWORK_EGRESS", status: "SECURE (0 KB/s)", color: "text-emerald-500" }, { icon: Server, label: "LOCAL_INFERENCE", status: "RUNNING [PORT:8080]", color: "text-slate-300" } ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + (i * 0.1) }} className="flex items-center justify-between bg-white/[0.02] p-2.5 rounded border border-white/5 text-slate-400">
                    <span className="flex items-center gap-2"><item.icon className="w-3.5 h-3.5 text-slate-500"/> {item.label}</span>
                    <span className={item.color}>{item.status}</span>
                  </motion.div>
                ))}
                
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between text-[10px] text-slate-500 mb-2">
                    <span className="flex items-center gap-1"><Cpu className="w-3 h-3"/> VRAM ALLOCATION</span>
                    <span>18.4GB / 24GB</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-emerald-500" animate={{ width: ["70%", "78%", "72%", "85%", "75%"] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} />
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="flex-1 z-10 relative">
              <motion.div whileHover={{ rotate: -15, scale: 1.1 }} className="mb-6 inline-flex p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20">
                <Shield className="w-6 h-6 text-emerald-400" />
              </motion.div>
              <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">Sovereign & Air-Gapped</h3>
              <p className="text-slate-400 text-[15px] leading-relaxed mb-6 font-light">
                100% local execution designed for defense environments. Refine models on internal vocabulary without sending a single byte to the cloud.
              </p>
              
              <ul className="space-y-3">
                {['Zero data exfiltration risks', 'Local fine-tuning capabilities', 'Designed for secure networks'].map((item, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + (i * 0.1), ...springTransition }} className="flex items-center gap-3 text-[14px] text-slate-300">
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