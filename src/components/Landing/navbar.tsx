'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';


function BiwizeLogo() {
  return (
    <div className="relative h-11 w-11 flex items-center justify-center group/logo">
      <div className="absolute inset-0 bg-black-500/10 rounded-full blur-xl group-hover/logo:bg-black 500/20 transition-colors duration-500" />
      <div className="absolute inset-0 animate-[spin_8s_linear_infinite] opacity-20 group-hover/logo:opacity-40 transition-opacity">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-blue-400 fill-none stroke-[2]">
          <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
        </svg>
      </div>
      <div className="absolute h-7 w-7 border border-blue-400/50 rotate-45 animate-[spin_4s_linear_infinite_reverse] group-hover/logo:border-white transition-colors duration-500" />
      <div className="absolute h-7 w-7 border border-blue-500/50 -rotate-12 group-hover/logo:rotate-12 transition-transform duration-700" />
      <div className="relative h-3 w-3 bg-white rounded-[2px] shadow-[0_0_15px_rgba(255,255,255,0.8)]">
        <div className="absolute inset-0 bg-white rounded-[1px] animate-ping opacity-50" />
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Agentic RAG', href: '#agentic-rag' },
    { name: 'Privacy', href: '#privacy' },
    { name: 'Roadmap', href: '#roadmap' }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-center pt-6 px-4 pointer-events-none">
     
      <div className={`
        relative w-full max-w-[1400px] flex items-center justify-between px-8 h-20 md:h-16 
        rounded-2xl border transition-all duration-700 pointer-events-auto
        ${scrolled 
          ? 'bg-slate-950/70 backdrop-blur-2xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8)]' 
          : 'bg-transparent border-transparent'}
      `}>
        
        <Link href="/" className="flex items-center gap-4 group/brand min-w-fit">
          <BiwizeLogo />
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-[0.3em] text-white leading-none">
              BIWIZE
            </span>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="h-[2px] w-4 bg-blue-500 rounded-full" />
              <span className="text-[8px] uppercase tracking-[0.4em] text-slate-500 font-bold group-hover/brand:text-blue-400 transition-colors">
                Intelligence Layer
              </span>
            </div>
          </div>
        </Link>

        <ul className="hidden lg:flex items-center gap-14">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link 
                href={link.href}
                className="relative text-[10px] uppercase tracking-[0.25em] font-bold text-slate-400 hover:text-white transition-colors group"
              >
                {link.name}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-6 min-w-fit">
          <Link href="/auth" className="hidden sm:block px-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
            Sign In
          </Link>

          <Link href="/auth">
            <button className="group relative px-8 py-2.5 bg-white text-slate-950 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all active:scale-95 flex items-center gap-2 overflow-hidden">
              <span className="relative z-10">Get Started</span>
              <ArrowUpRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-slate-200/50 opacity-40 group-hover:animate-[shine_0.8s_ease-in-out]" />
            </button>
          </Link>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white bg-white/5 rounded-lg border border-white/10"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-24 right-0 w-full sm:w-72 p-2 rounded-2xl bg-slate-950/95 backdrop-blur-3xl border border-white/10 shadow-2xl flex flex-col gap-1 animate-in fade-in slide-in-from-top-4 duration-300">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-4 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group"
              >
                <span className="text-sm font-bold uppercase tracking-widest">{link.name}</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
            <div className="h-[1px] bg-white/5 my-2 mx-4" />
            <Link 
              href="/pages/signin" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign In to Dashboard →
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}