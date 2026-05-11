'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Reused Biwize Logo ──────────────────────────────────────────────────────
function BiwizeLogo() {
  return (
    <div className="relative h-10 w-10 flex items-center justify-center group/logo">
      <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl group-hover/logo:bg-blue-500/30 transition-colors duration-500" />
      <div className="absolute inset-0 animate-[spin_8s_linear_infinite] opacity-20 group-hover/logo:opacity-50 transition-opacity">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-blue-400 fill-none stroke-[2]">
          <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
        </svg>
      </div>
      <div className="absolute h-6 w-6 border border-blue-400/50 rotate-45 animate-[spin_4s_linear_infinite_reverse] group-hover/logo:border-white transition-colors duration-500" />
      <div className="absolute h-6 w-6 border border-blue-500/50 -rotate-12 group-hover/logo:rotate-12 transition-transform duration-700" />
      <div className="relative h-2.5 w-2.5 bg-white rounded-[2px] shadow-[0_0_15px_rgba(255,255,255,0.9)]">
        <div className="absolute inset-0 bg-white rounded-[1px] animate-ping opacity-50" />
      </div>
    </div>
  );
}

// ─── Main Navbar Component ───────────────────────────────────────────────────
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Handle Scroll State
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/About' },
    { name: 'Pricing', href: '/Pricing' },
    { name: 'Services', href: '/Services' }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-center pt-4 sm:pt-6 px-4 pointer-events-none">
     
      {/* ─── Floating Island Container ─── */}
      <motion.div 
        layout
        className={`
          relative w-full max-w-[1200px] flex items-center justify-between px-4 sm:px-6 
          rounded-2xl border transition-colors duration-500 pointer-events-auto
          ${scrolled 
            ? 'h-16 bg-[#0a0a0c]/80 backdrop-blur-2xl border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]' 
            : 'h-20 bg-transparent border-transparent'}
        `}
      >
        
        {/* ─── Brand / Logo ─── */}
        <Link href="/" className="flex items-center gap-3 group/brand min-w-fit z-20">
          <BiwizeLogo />
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-[0.25em] text-white leading-none">
              BIWIZE
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-[2px] w-3 bg-blue-500 rounded-full" />
              <span className="text-[7px] uppercase tracking-[0.3em] text-slate-500 font-bold group-hover/brand:text-blue-400 transition-colors">
                Start Something That Matters
              </span>
            </div>
          </div>
        </Link>

        {/* ─── Desktop Links (with Framer Motion Pill Hover) ─── */}
        <ul className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link, index) => (
            <li 
              key={link.name}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative"
            >
              <Link 
                href={link.href}
                className={`relative px-5 py-2.5 text-[11px] uppercase tracking-[0.25em] font-bold transition-colors duration-300 z-10 flex items-center justify-center
                  ${hoveredIndex === index ? 'text-white' : 'text-slate-400 hover:text-slate-200'}
                `}
              >
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 bg-white/[0.08] rounded-full -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* ─── Right Section (CTA & Mobile Toggle) ─── */}
        <div className="flex items-center gap-4 min-w-fit z-20">
          <Link href="/auth" className="hidden sm:block">
            <button className="group relative px-7 py-2.5 bg-white text-slate-950 text-[11px] font-black uppercase tracking-[0.15em] rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2 overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]">
              <span className="relative z-10 flex items-center gap-1.5">
                Get Started
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
            </button>
          </Link>

          {/* Mobile Hamburger */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ─── Mobile Dropdown Menu (Animated) ─── */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="lg:hidden absolute top-[calc(100%+12px)] right-0 w-full sm:w-80 p-3 rounded-2xl bg-[#0a0a0c]/95 backdrop-blur-3xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col gap-1 origin-top-right"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-white/[0.06] text-slate-400 hover:text-white transition-all group"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest">{link.name}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-400" />
                  </Link>
                </motion.div>
              ))}
              
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2 mx-4" />
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-2 mt-1"
              >
                <Link 
                  href="/auth" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full"
                >
                  <button className="w-full py-3.5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl transition-colors hover:bg-slate-200">
                    Get Started
                  </button>
                </Link>
                <Link 
                  href="/pages/signin" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                >
                  Sign In to Dashboard →
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* Shimmer Animation Keyframes */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `
      }} />
    </nav>
  );
}