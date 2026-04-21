import { Moon, Sun, User, Database, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface ChatHeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  projectName: string;
}

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


export function ChatHeader({ isDarkMode, toggleTheme, projectName }: ChatHeaderProps) {
  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white dark:bg-[#0a0a0a] border-b border-gray-800/80 dark:border-transparent transition-colors z-20 shrink-0 relative">
      <div className="absolute top-0 left-0 w-32 h-20 bg-blue-900/10 blur-[50px] pointer-events-none" />
      
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

      <div className="bg-[#141414]  flex items-center gap-3 z-50">
        
        <span className="text-sm font-medium text-gray-300 truncate max-w-sm">{projectName}</span>
      </div>
      
      <div className="flex items-center gap-4 z-10">
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#161616] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
        >
          {isDarkMode ? (
            <Sun size={18} className="group-hover:scale-110 transition-transform text-yellow-500" />
          ) : (
            <Moon size={18} className="group-hover:scale-110 transition-transform" />
          )}
        </button>
        <button className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <User size={18} />
        </button>
      </div>
    </header>
  );
}