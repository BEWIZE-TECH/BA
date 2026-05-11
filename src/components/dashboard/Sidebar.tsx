
'use client';

import { LayoutGrid, Activity, Cpu, Settings, Power } from 'lucide-react';
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
const navItems = [
  { name: 'Workspaces', icon: LayoutGrid, href: '/dashboard', active: true }, 
  { name: 'Settings', icon: Settings, href: '/Settings', active: false },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-gray-900 flex flex-col p-5 h-full">
        <div className="flex items-center gap-3 mb-8 px-2">
      <BiwizeLogo />
        <span className="text-lg font-serif font-semibold tracking-wide text-gray-200">BIWIZE</span>
      </div>
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const isActive = item.active; 
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-[#141d2e] text-blue-400 border border-blue-900/40' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-[#141414]'
              }`}
            >
              <item.icon 
                size={18} 
                className={isActive ? 'text-blue-500' : 'group-hover:text-gray-300 transition-colors'} 
              />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <Link
        href="/auth"
        className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all mt-auto group"
      >
        <Power size={18} className="group-hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)] transition-all" />
        <span className="text-sm font-medium">Disconnect</span>
      </Link>
    </aside>
  );
}