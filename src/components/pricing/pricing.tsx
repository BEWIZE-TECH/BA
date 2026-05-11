'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  CreditCard, 
  ArrowLeft, 
  Loader2, 
  Download, 
  PartyPopper,
  Terminal,
  ShieldCheck,
  Building2,
  Mail,
  Zap
} from 'lucide-react';

// ─── Scene Overlay (Consistency with other components) ───────────────
function SceneOverlay() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none z-10" aria-hidden>
        <filter id="noise-pricing">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-pricing)" />
      </svg>
    </>
  );
}

// ─── Main Pricing Component ──────────────────────────────────────────
export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [view, setView] = useState<'pricing' | 'checkout' | 'contact' | 'success'>('pricing');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', email: '', company: '', card: '', expiry: '', cvc: '' });

  const plans = [
    {
      name: "Sandbox",
      price: 0,
      description: "Cloud evaluation environment.",
      features: ["Shared Inference Engine", "Basic RAG (Max 5 Docs)", "Community Discord", "Standard Latency"],
      cta: "Start Free",
      highlighted: false,
      glow: "blue"
    },
    {
      name: "Sovereign Node",
      price: isAnnual ? 490 : 49, 
      period: isAnnual ? "yr" : "mo",
      description: "100% Local execution for analysts.",
      features: ["Local Llama-3 Inference", "Unlimited Vector RAG", "Air-Gapped Execution", "Priority Email Support"],
      cta: "Initialize Node",
      highlighted: true,
      glow: "emerald"
    },
    {
      name: "Enterprise Grid",
      price: "Custom",
      description: "Fleet orchestration for large teams.",
      features: ["Multi-node VPC Deployment", "Custom Model Fine-Tuning", "SSO / SAML Auth", "Dedicated Architect"],
      cta: "Contact Sales",
      highlighted: false,
      glow: "purple"
    }
  ];

  const handleAction = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    if (plan.name === "Enterprise Grid") {
      setView('contact');
    } else if (plan.name === "Sandbox") {
      // Simulate quick provisioning for free tier
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setView('success');
      }, 1500);
    } else {
      setView('checkout');
    }
  };

  const processForm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setView('success');
    }, 2000);
  };

  // ─── Shared Container for Animation ───
  const ViewContainer = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 w-full max-w-md mx-auto bg-[#0A0A0C]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
    >
      {children}
    </motion.div>
  );

  return (
    <div className="relative bg-[#030305] text-white min-h-screen py-32 px-6 overflow-hidden flex flex-col justify-center font-sans">
      <SceneOverlay />
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none z-0" />

      <AnimatePresence mode="wait">
        
        {/* ─── 1. Pricing Grid View ─── */}
        {view === 'pricing' && (
          <motion.div 
            key="pricing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-[1200px] mx-auto text-center relative z-20 w-full"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest mb-6"
            >
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              Transparent Pricing
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
              Deploy Your Intelligence.
            </h1>
            <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Choose the perfect environment for your requirement engineering. Switch to annual billing and save two months of runtime.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex justify-center mb-16 relative z-30">
              <div className="relative inline-flex items-center bg-white/[0.03] border border-white/10 rounded-full p-1.5 backdrop-blur-md">
                <button
                  className={`relative z-10 px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${!isAnnual ? 'text-black' : 'text-slate-400 hover:text-white'}`}
                  onClick={() => setIsAnnual(false)}
                >
                  Monthly
                </button>
                <button
                  className={`relative z-10 px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${isAnnual ? 'text-black' : 'text-slate-400 hover:text-white'}`}
                  onClick={() => setIsAnnual(true)}
                >
                  Yearly
                </button>
                {/* Animated Background Pill */}
                <motion.div 
                  className="absolute top-1.5 bottom-1.5 w-[110px] bg-white rounded-full z-0 shadow-lg"
                  initial={false}
                  animate={{ left: isAnnual ? 'calc(100% - 110px - 6px)' : '6px' }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end relative z-20">
              {plans.map((plan, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                  key={plan.name} 
                  className={`relative p-10 rounded-[2.5rem] border transition-all duration-500 flex flex-col h-full bg-[#0A0A0C]/80 backdrop-blur-xl
                    ${plan.highlighted 
                      ? 'border-emerald-500/40 scale-105 shadow-[0_0_50px_rgba(16,185,129,0.15)] z-10' 
                      : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                    }
                  `}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                      Recommended
                    </div>
                  )}
                  
                  <div className="text-left mb-8">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-slate-400 text-sm font-light">{plan.description}</p>
                  </div>
                  
                  <div className="text-left mb-10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-extrabold tracking-tighter text-white">
                        {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                      </span>
                      {typeof plan.price === 'number' && (
                        <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                          / {plan.period}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent mb-10" />

                  <ul className="text-left space-y-5 mb-12 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-4 text-sm text-slate-300 font-medium">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center border ${
                          plan.highlighted ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'
                        }`}>
                          <Check className={`w-3 h-3 ${plan.highlighted ? 'text-emerald-400' : 'text-slate-400'}`} />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleAction(plan)}
                    className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${
                      plan.highlighted 
                        ? 'bg-white text-black hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                        : 'bg-white/[0.05] border border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    {isProcessing && selectedPlan?.name === plan.name ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : plan.cta}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── 2. Checkout View (Pro Plan) ─── */}
        {view === 'checkout' && (
          <ViewContainer key="checkout">
            <button 
              onClick={() => setView('pricing')}
              className="flex items-center gap-2 text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Specs
            </button>

            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <Terminal className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Provision Node</h2>
                <p className="text-sm text-slate-400">{selectedPlan.name} • ${selectedPlan.price} USD / {selectedPlan.period}</p>
              </div>
            </div>

            <form onSubmit={processForm} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Payment Method</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  <input 
                    type="text" 
                    placeholder="Card number" 
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 pl-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm font-mono"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="MM / YY" 
                  required
                  className="w-1/2 bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm font-mono" 
                />
                <input 
                  type="text" 
                  placeholder="CVC" 
                  required
                  className="w-1/2 bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm font-mono" 
                />
              </div>
              
              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-emerald-500 text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-70"
              >
                {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : `Pay $${selectedPlan.price}.00`}
              </button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-600 uppercase tracking-widest font-bold pt-2">
                <ShieldCheck className="w-3 h-3" /> Encrypted connection
              </div>
            </form>
          </ViewContainer>
        )}

        {/* ─── 3. Contact View (Enterprise Plan) ─── */}
        {view === 'contact' && (
          <ViewContainer key="contact">
            <button 
              onClick={() => setView('pricing')}
              className="flex items-center gap-2 text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Specs
            </button>

            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
              <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                <Building2 className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Enterprise Architecture</h2>
                <p className="text-sm text-slate-400">Custom deployment & orchestration.</p>
              </div>
            </div>

            <form onSubmit={processForm} className="space-y-5">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input 
                    type="email" 
                    placeholder="Work Email" 
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 pl-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm"
                  />
                </div>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input 
                    type="text" 
                    placeholder="Company Name" 
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 pl-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm"
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-70"
              >
                {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Transmitting...</> : `Request Architecture Review`}
              </button>
            </form>
          </ViewContainer>
        )}

        {/* ─── 4. Success View ─── */}
        {view === 'success' && (
          <ViewContainer key="success">
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <PartyPopper className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                {selectedPlan?.name === "Enterprise Grid" ? "Request Received" : "Node Provisioned!"}
              </h2>
              <p className="text-slate-500 mb-8 uppercase tracking-widest text-[10px] font-bold">
                {selectedPlan?.name === "Enterprise Grid" ? "An architect will contact you shortly." : "Transaction Receipt"}
              </p>
              
              {selectedPlan?.name !== "Enterprise Grid" && (
                <div className="bg-black/50 border border-white/5 rounded-2xl p-6 mb-8 text-left space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Plan</span>
                    <span className="text-white font-bold">{selectedPlan?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Amount</span>
                    <span className="text-white font-bold">${selectedPlan?.price}.00 USD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Transaction ID</span>
                    <span className="text-slate-400 font-mono text-xs">#BWZ-{Math.floor(Math.random() * 1000000)}</span>
                  </div>
                </div>
              )}

              <button 
                onClick={() => setView('pricing')}
                className="w-full py-4 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all mb-4"
              >
                Access Dashboard
              </button>
              
              {selectedPlan?.name !== "Enterprise Grid" && (
                <button className="flex items-center justify-center gap-2 w-full text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">
                  <Download className="w-3 h-3" /> Download Invoice PDF
                </button>
              )}
            </div>
          </ViewContainer>
        )}

      </AnimatePresence>
    </div>
  );
}