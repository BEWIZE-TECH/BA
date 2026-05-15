"use client";

import React, { Suspense, lazy } from 'react';
import Link from 'next/link';
import { ArrowRight, Activity, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface HeroSectionProps {
  title?: string;
  description?: string;
}

function SceneOverlay() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-10 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none z-10" style={{
        background: `
          radial-gradient(circle at 50% 50%, transparent 0%, rgba(3,3,5,0.7) 60%, #030305 100%),
          linear-gradient(to bottom, #030305 0%, transparent 10%, transparent 80%, #030305 100%)
        `
      }} />
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none z-20" aria-hidden>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </>
  );
}

function HeroSplineBackground() {
  return (
    <div className="relative w-full h-[100vh] pointer-events-auto overflow-hidden bg-[#030305]">
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-[#030305]">
          <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin shadow-[0_0_30px_rgba(59,130,246,0.3)]" />
        </div>
      }>
        <Spline
          className="w-full h-full scale-110 opacity-80"
          scene="https://prod.spline.design/us3ALejTXl6usHZ7/scene.splinecode"
        />
      </Suspense>
      <SceneOverlay />
    </div>
  );
}
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(12px)' },
  show: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { type: "spring", stiffness: 70, damping: 20 } 
  }
};

function HeroContent({ title, description }: HeroSectionProps) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="text-center text-white px-4 max-w-5xl mx-auto relative z-30 flex flex-col items-center"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.h1 
        variants={itemVariants}
        className="text-5xl sm:text-6xl md:text-8xl lg:text-[6.5rem] font-extrabold pb-4 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 tracking-tighter leading-[1.05] drop-shadow-sm"
      >
        {title || `BIWIZE Intelligence.`}
      </motion.h1>
      
      <motion.p 
        variants={itemVariants}
        className="text-lg md:text-xl lg:text-2xl font-light text-slate-400 max-w-3xl mx-auto px-6 mb-12 leading-relaxed"
      >
        {description || (
          <>
            The first local-first AI platform specifically engineered for <span className="text-white font-medium">IT Business Analysts</span>. Unprecedented reasoning, absolute data sovereignty.
          </>
        )}
      </motion.p>
      
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6">
        
        <Link href="/auth">
          <button className="relative inline-flex h-14 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 group shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] transition-shadow duration-500">
            <span className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#10b981_50%,#3b82f6_100%)] animate-[spin_3s_linear_infinite]" />
            <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-[#030305] px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-colors duration-300 group-hover:bg-[#030305]/80">
              <span className="relative z-10 flex items-center gap-2 text-[15px]">
                Get Started
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-white transition-all" />
              </span>
            </span>
          </button>
        </Link>

      </motion.div>

    </motion.div>
  );
}

export function HeroSection({ title, description }: HeroSectionProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.95]);

  return (
    <div className="relative bg-[#050505] w-full overflow-hidden">
      <div className="relative min-h-[100vh] lg:min-h-[105vh] flex flex-col justify-center">

        <div className="absolute inset-0 z-0">
          <HeroSplineBackground />
        </div>

        <motion.div 
          style={{ y, opacity, scale }}
          className="relative z-10 pointer-events-none w-full"
        >
          <div className="container mx-auto pointer-events-auto">
            <HeroContent title={title} description={description} />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
