'use client';

import React, { useState } from 'react';
import { 
  Briefcase, TrendingUp, Stethoscope, ArrowRight, CheckCircle2, 
  Lock, Globe, LineChart, ShieldAlert, Zap, Activity, Pill
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Note: Ensure your Navbar and Footer imports point to the correct files in your project
import Navbar from '@/components/General/navbar';
import Footer from '@/components/General/footer';

// ─── Universal Scene Overlay ───────────────────────────────────────────────
function SceneOverlay() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none z-10" aria-hidden>
        <filter id="noise-services">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-services)" />
      </svg>
    </>
  );
}

// ─── Status Badge ──────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: 'active' | 'coming-soon' | 'beta' }) {
  const config = {
    active: { color: "emerald", label: "Live Active", bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
    'coming-soon': { color: "amber", label: "Training", bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
    beta: { color: "blue", label: "Beta", bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" }
  };
  
  const activeConfig = config[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${activeConfig.bg} ${activeConfig.border}`}>
      <div className={`w-1.5 h-1.5 rounded-full bg-${activeConfig.color}-500 ${status !== 'coming-soon' ? 'animate-pulse' : ''}`} />
      <span className={`text-[9px] font-bold uppercase tracking-widest ${activeConfig.text}`}>
        {activeConfig.label}
      </span>
    </div>
  );
}

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('stock');

  const services = {
    business: {
      id: 'business',
      title: "Business Architect AI",
      status: 'coming-soon',
      icon: <Briefcase className="w-5 h-5" />,
      tagline: "The Agentic COO for the Autonomous Enterprise.",
      description: "Moving beyond simple chat, the Business Architect maps market volatility against your internal KPIs to automate strategic pivots.",
      features: ["Auto-Requirement Synthesis", "Market Sentiment Drift Analysis", "Local Compliance Enforcement"],
      theme: { from: "from-amber-500", via: "via-orange-500", to: "to-amber-500", shadow: "shadow-amber-500/20", text: "text-amber-400" }
    },
    stock: {
      id: 'stock',
      title: "Neural Quant Assistant",
      status: 'active',
      icon: <TrendingUp className="w-5 h-5" />,
      tagline: "Institutional-grade Alpha for the Individual.",
      description: "Real-time analysis of global macro trends, dark pool movements, and social sentiment to predict high-probability entry points.",
      features: ["Real-time Volatility Mapping", "Dark Pool Flow Monitoring", "Risk-Adjusted Portfolio Rebalancing"],
      theme: { from: "from-blue-500", via: "via-indigo-500", to: "to-blue-500", shadow: "shadow-blue-500/20", text: "text-blue-400" }
    },
    medical: {
      id: 'medical',
      title: "MedRep Intelligence",
      status: 'active',
      icon: <Stethoscope className="w-5 h-5" />,
      tagline: "Compliance-first Pharmaceutical Guidance.",
      description: "Empowering medical representatives with real-time clinical data, physician preferences, and strict regulatory guardrails.",
      features: ["HIPAA-Compliant Interaction Logs", "Clinical Trial Data Synthesis", "Territory Optimization Engine"],
      theme: { from: "from-emerald-500", via: "via-teal-500", to: "to-emerald-500", shadow: "shadow-emerald-500/20", text: "text-emerald-400" }
    }
  };

  const activeData = services[activeTab as keyof typeof services];

  return (
    <div className="bg-[#030305] text-white min-h-screen selection:bg-blue-500/30 font-sans relative overflow-hidden">
      <SceneOverlay />
      
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* ─── Hero Section ─── */}
      <section className="pt-40 md:pt-48 pb-16 md:pb-24 px-6 relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest mb-6">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            Ecosystem
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-extrabold tracking-tighter mb-6 leading-tight">
            Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600 italic font-medium drop-shadow-sm">Modules.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-light max-w-2xl">
            Specialized Agentic systems designed to outperform human benchmarks in highly complex, compliance-heavy decision environments.
          </p>
        </div>
      </section>

      {/* ─── Service Selection Interface ─── */}
      <section className="px-6 pb-32 relative z-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Framer Motion Tab Switcher */}
          <div className="flex justify-center mb-16">
            <div className="flex flex-wrap md:flex-nowrap justify-center p-1.5 bg-white/[0.02] border border-white/[0.05] rounded-3xl backdrop-blur-xl shadow-2xl">
              {Object.values(services).map((s) => {
                const isActive = activeTab === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveTab(s.id)}
                    className={`relative flex items-center gap-3 px-6 py-4 rounded-[1.25rem] transition-colors duration-300 outline-none ${
                      isActive ? "text-white" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-tab"
                        className="absolute inset-0 bg-white/[0.06] border border-white/10 rounded-[1.25rem] shadow-lg"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${isActive ? 'bg-white/10 text-white' : 'bg-transparent'}`}>
                      {s.icon}
                    </div>
                    <div className="text-left relative z-10 pr-2 hidden sm:block">
                      <div className="text-xs font-bold uppercase tracking-widest mb-0.5">{s.title}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Service Detail View */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center bg-[#0a0a0c]/80 border border-white/10 p-8 md:p-16 rounded-[3rem] backdrop-blur-2xl relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            >
              
              {/* Background ambient glow matching active tab */}
              <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br ${activeData.theme.from} opacity-[0.03] blur-[100px] rounded-full pointer-events-none`} />

              {/* ─── Locked State Overlay (For Business Architect) ─── */}
              {activeData.status === 'coming-soon' && (
                <div className="absolute inset-0 z-30 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#030305]/80 backdrop-blur-md" />
                  <div className="relative bg-[#0A0A0C] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center max-w-md mx-4">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-center justify-center mb-6">
                      <Lock className="w-8 h-8 text-amber-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight mb-3">Model in Training</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                      The Business Architect core is currently undergoing rigorous alignment for enterprise deployment. Estimated launch: Q4 2026.
                    </p>
                    <button className="w-full px-6 py-3.5 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors">
                      Join Waitlist
                    </button>
                  </div>
                </div>
              )}

              {/* ─── Left Column: Content ─── */}
              <div className="relative z-20">
                <div className="mb-8">
                   <StatusBadge status={activeData.status as any} />
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold mb-6 tracking-tight leading-[1.1]">
                  {activeData.title}
                </h2>
                <p className={`text-xl mb-8 font-medium bg-clip-text text-transparent bg-gradient-to-r ${activeData.theme.from} ${activeData.theme.to}`}>
                  {activeData.tagline}
                </p>
                <p className="text-slate-400 text-lg leading-relaxed mb-10 font-light max-w-lg">
                  {activeData.description}
                </p>
                
                <div className="space-y-4 mb-12">
                  {activeData.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-6 h-6 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <span className="text-slate-300 font-medium text-sm">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-8 py-4 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    Deploy Module
                  </button>
                  <button className="px-8 py-4 border border-white/10 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all">
                    View Documentation
                  </button>
                </div>
              </div>

              {/* ─── Right Column: Visual Processing Node ─── */}
              <div className="relative group lg:h-full flex items-center">
                 {/* Intense colored glow */}
                 <div className={`absolute inset-0 bg-gradient-to-tr ${activeData.theme.from} opacity-10 blur-[80px] rounded-full group-hover:opacity-20 transition-opacity duration-700`} />
                 
                 <div className="relative w-full aspect-square max-h-[400px] rounded-[2.5rem] border border-white/10 bg-[#050505]/80 flex flex-col items-center justify-center overflow-hidden shadow-2xl backdrop-blur-md group-hover:border-white/20 transition-colors">
                    
                    {/* Scanning Line */}
                    <motion.div 
                      className={`absolute left-0 right-0 h-px bg-gradient-to-r from-transparent ${activeData.theme.via} to-transparent z-20`}
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                    />
                    
                    {/* Animated Grid Background */}
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 p-4 opacity-[0.15]">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <motion.div 
                          key={i} 
                          animate={{ opacity: [0.1, 0.5, 0.1] }} 
                          transition={{ repeat: Infinity, duration: Math.random() * 3 + 2, delay: i * 0.05 }}
                          className={`w-full h-full rounded-sm bg-gradient-to-br ${activeData.theme.from} ${activeData.theme.to}`} 
                        />
                      ))}
                    </div>

                    {/* Central Icon */}
                    <div className="relative z-10 flex flex-col items-center">
                       <div className={`w-32 h-32 rounded-full border border-white/10 bg-black/50 backdrop-blur-xl flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500`}>
                          <div className={`absolute inset-0 border border-t-transparent rounded-full animate-[spin_4s_linear_infinite] ${activeData.theme.text}`} />
                          {activeTab === 'stock' && <LineChart className={`w-12 h-12 ${activeData.theme.text} drop-shadow-[0_0_15px_currentColor]`} />}
                          {activeTab === 'medical' && <Pill className={`w-12 h-12 ${activeData.theme.text} drop-shadow-[0_0_15px_currentColor]`} />}
                          {activeTab === 'business' && <Globe className={`w-12 h-12 ${activeData.theme.text} drop-shadow-[0_0_15px_currentColor]`} />}
                       </div>
                       
                       {/* Terminal Output snippet */}
                       <div className="bg-black/60 border border-white/5 rounded-lg px-4 py-2 text-[10px] font-mono text-slate-400 flex items-center gap-2 backdrop-blur-md">
                         <Activity className={`w-3 h-3 ${activeData.theme.text} animate-pulse`} />
                         <span>node_{activeTab}_active.sh</span>
                       </div>
                    </div>

                 </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ─── Trust & Comparison Section ─── */}
      <section className="py-24 px-6 border-t border-white/[0.05] bg-gradient-to-b from-[#030305] to-[#0A0A0C] relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center">
          <div className="pt-8 md:pt-0">
            <div className="text-5xl font-black mb-3 text-white">99.9%</div>
            <div className="text-slate-500 text-xs uppercase tracking-[0.2em] font-bold">Uptime Integrity</div>
          </div>
          <div className="pt-8 md:pt-0">
            <div className="text-5xl font-black mb-3 text-white">VPC</div>
            <div className="text-slate-500 text-xs uppercase tracking-[0.2em] font-bold">Network Architecture</div>
          </div>
          <div className="pt-8 md:pt-0">
            <div className="text-5xl font-black mb-3 text-white">&lt; 50ms</div>
            <div className="text-slate-500 text-xs uppercase tracking-[0.2em] font-bold">Agentic Latency</div>
          </div>
        </div>
      </section>

      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}