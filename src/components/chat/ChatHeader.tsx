"use client";

import { User, Database, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

interface ChatHeaderProps {
  projectName: string;
}

function BiwizeLogo() {
  return (
    <div className="relative h-8 w-8 flex items-center justify-center group/logo shrink-0">
      <div className="absolute inset-0 bg-blue-600/10 rounded-sm blur-md group-hover/logo:bg-blue-500/20 transition-colors duration-500" />
      <div className="absolute inset-0 opacity-80">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-blue-500 fill-none stroke-[4]">
          <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
        </svg>
      </div>
      <div className="absolute h-3.5 w-3.5 border border-blue-400/50 rotate-45 group-hover/logo:border-blue-400 transition-colors duration-500" />
      <div className="relative h-1 w-1 bg-white rounded-sm shadow-[0_0_10px_rgba(255,255,255,1)]">
        <div className="absolute inset-0 bg-white rounded-sm animate-ping opacity-50" />
      </div>
    </div>
  );
}

export function ChatHeader({ projectName }: ChatHeaderProps) {
  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6 bg-[#050505] border-b border-gray-800 transition-colors z-20 shrink-0 shadow-sm">
      
      <div className="flex items-center gap-6 w-1/3">
        <Link href="/" className="flex items-center gap-3 group/brand min-w-fit">
          <BiwizeLogo />
          <div className="flex flex-col">
            <span className="text-[13px] font-black tracking-[0.25em] text-gray-100 leading-none">
              BIWIZE
            </span>
            <span className="text-[8px] uppercase tracking-[0.3em] text-blue-500 font-bold mt-1">
              Analysis Core
            </span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center h-5 border-l border-gray-800 pl-6">
           <Link href="/dashboard" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-blue-500 transition-colors">
              <LayoutGrid size={12} />
              Workspace
           </Link>
        </div>
      </div>

      <div className="flex items-center justify-center w-1/3">
         <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-gray-800 rounded-md shadow-inner">
            <Database size={12} className="text-blue-500" />
            <span className="text-[11px] font-mono text-gray-300 truncate max-w-[250px]" title={projectName}>
              {projectName || "Initializing Context..."}
            </span>
         </div>
      </div>
      
      <div className="flex items-center justify-end gap-2.5 w-1/3">
        <button 
          className="w-8 h-8 rounded-md bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-600/20 transition-all"
          title="User Profile & Settings"
        >
          <User size={14} />
        </button>
      </div>
    </header>
  );
}