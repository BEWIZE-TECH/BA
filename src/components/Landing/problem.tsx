'use client';

import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { motion, useMotionValue, useTransform, animate, type Transition } from 'framer-motion';

// ─── Utilities ────────────────────────────────────────────────────────────────
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 1800;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(eased * value);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  const precision = value % 1 === 0 ? 0 : 1;
  return <>{prefix}{display.toFixed(precision)}{suffix}</>;
}

// ─── Spline loader ────────────────────────────────────────────────────────────
const Spline = lazy(() => import('@splinetool/react-spline'));

function RobotScene({ scene }: { scene: string }) {
  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin" />
      </div>
    }>
      <Spline scene={scene} className="w-full h-full" />
    </Suspense>
  );
}

// ─── Noise texture overlay ────────────────────────────────────────────────────
function NoiseOverlay() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.025] pointer-events-none z-[1]" aria-hidden>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

// ─── Ambient grid lines ───────────────────────────────────────────────────────
function GridLines() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
      {/* Vertical lines */}
      {[20, 40, 60, 80].map(p => (
        <div key={p} className="absolute top-0 bottom-0 w-px bg-white/[0.03]" style={{ left: `${p}%` }} />
      ))}
      {/* Horizontal lines */}
      {[25, 50, 75].map(p => (
        <div key={p} className="absolute left-0 right-0 h-px bg-white/[0.03]" style={{ top: `${p}%` }} />
      ))}
      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_40%,#050505_100%)]" />
    </div>
  );
}

// ─── Scan line effect ─────────────────────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent pointer-events-none z-20"
      animate={{ top: ['-2px', '100%'] }}
      transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
    />
  );
}

// ─── Stat chip ─────────────────────────────────────────────────────────────────
function StatChip({ value, suffix, prefix, label, color = 'white', delay = 0 }: {
  value: number; suffix?: string; prefix?: string; label: string;
  color?: 'white' | 'red' | 'blue'; delay?: number;
}) {
  const colorMap = {
    white: 'text-white',
    red: 'text-red-400',
    blue: 'text-blue-400',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as any }}
      className="flex flex-col gap-1"
    >
      <div className={cn('text-[40px] font-semibold leading-none tracking-tight tabular-nums', colorMap[color])}>
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-medium">{label}</div>
    </motion.div>
  );
}

// ─── Coverage bar ─────────────────────────────────────────────────────────────
function CoverageBar({ pct, color, delay = 0 }: { pct: number; color: 'muted' | 'blue'; delay?: number }) {
  if (color === 'muted') {
    return (
      <div className="relative h-[5px] bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] as any, delay }}
          className="h-full bg-slate-600 rounded-l-full"
        />
        {/* missing zone */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 1.4 }}
          className="absolute top-0 bottom-0 right-0 bg-[repeating-linear-gradient(60deg,transparent,transparent_3px,rgba(239,68,68,0.12)_3px,rgba(239,68,68,0.12)_6px)]"
          style={{ left: `${pct}%` }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-red-500/60" />
        </motion.div>
      </div>
    );
  }
  return (
    <div className="relative h-[5px] bg-white/[0.06] rounded-full overflow-hidden p-px">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] as any, delay }}
        className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 rounded-full relative overflow-hidden"
      >
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
        />
      </motion.div>
    </div>
  );
}

// ─── Audit card ───────────────────────────────────────────────────────────────
function AuditCard() {
  const spring: Transition = { type: 'spring', stiffness: 80, damping: 18 };
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] as any }}
      className="relative w-full max-w-[430px] shrink-0"
    >
      {/* Glow halo */}
      <div className="absolute -inset-4 bg-blue-500/5 rounded-[2.5rem] blur-2xl pointer-events-none" />

      <div className="relative bg-[#0C0C0E]/80 backdrop-blur-2xl border border-white/[0.07] rounded-[1.75rem] overflow-hidden shadow-2xl">
        <ScanLine />

        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">Requirement Fidelity</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold tracking-wider">
            <span className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
            LIVE AUDIT
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Legacy row */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-slate-400 font-medium">Legacy Manual Discovery</span>
              <span className="text-[11px] font-mono text-red-400 tracking-wider">61.0%</span>
            </div>
            <CoverageBar pct={61} color="muted" delay={0.6} />
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Missing: hidden stakeholder intent, undocumented technical debt, edge-case constraints.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.04]" />

          {/* Biwize row */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-white font-semibold">Biwize Agentic RAG</span>
                <svg className="w-3.5 h-3.5 text-blue-400 fill-current" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="text-[11px] font-mono text-blue-400 tracking-wider font-bold"
              >
                99.2%
              </motion.span>
            </div>
            <CoverageBar pct={99.2} color="blue" delay={0.9} />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
              className="flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[11px] text-blue-400/80 uppercase tracking-widest font-semibold">Requirements Synthesized & Verified</span>
            </motion.div>
          </div>

          {/* Footer insight */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.6 }}
            className="flex gap-3.5 bg-white/[0.025] border border-white/[0.05] rounded-xl p-4"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-white uppercase tracking-wider mb-1">Neural Verification Active</p>
              <p className="text-[12px] text-slate-500 leading-relaxed">
                Cross-referencing multi-modal inputs against a 100% local compliance vector store.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
const ROBOT_SCENE = 'https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as any } },
};

export default function BiwizeHero() {
  return (
    <main className="min-h-screen bg-[#050505] font-sans antialiased">
      <div className="relative w-full min-h-screen overflow-hidden flex items-center">
        {/* Background layers */}
      
        <NoiseOverlay />

        {/* Ambient color blobs */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none z-0" />

        {/* Spline robot — fills the right half */}
        <div className="absolute inset-0 z-0" aria-hidden>
          <RobotScene scene={ROBOT_SCENE} />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 py-24 pointer-events-none">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 w-full">

            {/* ── Left column ── */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="flex flex-col text-left text-white pointer-events-auto w-full max-w-[580px]"
            >
              {/* Eyebrow */}
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-7">
                <div className="h-px w-8 bg-blue-500/60" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-blue-400/80 font-semibold">2026 Industry Report</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                className="text-[42px] sm:text-[52px] lg:text-[58px] font-medium leading-[1.05] tracking-tight mb-7"
              >
                The{' '}
                <em className="not-italic text-slate-500">invisible cost</em>
                <br />
                of requirement
                <br />
                <span className="text-white">ambiguity.</span>
              </motion.h1>

              {/* Body */}
              <motion.p variants={fadeUp} className="text-[16px] text-slate-400 mb-10 leading-[1.75] max-w-[480px]">
                Traditional scoping relies on human memory and static docs. But{' '}
                <strong className="text-white font-medium">42.9% of project failures</strong> stem from requirements
                that were never explicitly stated—hiding in plain sight within stakeholder interviews and Slack threads.
              </motion.p>

              {/* Stats */}
              <motion.div
                variants={fadeUp}
                className="grid grid-cols-2 gap-8 mb-10 py-8 border-y border-white/[0.07]"
              >
                <StatChip value={39} suffix="%" label="Project Attrition Rate" color="white" delay={0.5} />
                <StatChip value={2.4} prefix="+$" suffix="M" label="Avg. Annual Scope Creep" color="red" delay={0.65} />
              </motion.div>

              {/* CTA */}
              <motion.div variants={fadeUp} className="flex items-center gap-6">
                <button className="group flex items-center gap-2.5 text-[13px] font-semibold text-white bg-white/[0.06] border border-white/10 px-5 py-2.5 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200">
                  Read the Report
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
                <button className="text-[13px] text-slate-500 hover:text-slate-300 transition-colors font-medium underline underline-offset-4 decoration-white/10">
                  Request a Demo
                </button>
              </motion.div>
            </motion.div>

            {/* ── Right column: audit card ── */}
            <AuditCard />
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-10" />
      </div>
    </main>
  );
}