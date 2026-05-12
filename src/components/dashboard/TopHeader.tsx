'use client';

import { useState } from 'react';
import { Search, User, Settings, LogOut } from 'lucide-react';

interface TopHeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  // --- NEW PROPS ADDED ---
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TopHeader({ isDarkMode, toggleTheme, searchQuery, onSearchChange }: TopHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log(`Searching Knowledge Base for: "${searchQuery}"...`);
    }
  };

  const navigateTo = (path: string) => {
    console.log(`Navigating to: ${path}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 flex items-center justify-between px-6 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 transition-all">
      
      {/* Search Section */}
      <div className="flex-1 max-w-md">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search documentation or requirements..."
            // --- UPDATED TO USE PROPS ---
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-10 pr-12 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-blue-500/50 dark:focus:border-blue-400/30 rounded-lg text-sm transition-all outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-500"
          />
        </form>
      </div>

      {/* Action Items */}
      <div className="flex items-center gap-3">
        <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1" />

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-transparent hover:border-gray-200 dark:hover:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group"
          >
            <div className="hidden md:flex flex-col items-end text-[11px] leading-tight mr-1">
              <span className="font-semibold text-gray-900 dark:text-white">Business Analyst</span>
              <span className="text-gray-500 dark:text-gray-400">BIWIZE </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform ring-2 ring-transparent group-hover:ring-blue-500/20">
              <User size={18} />
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-1">
              <button 
                onClick={() => { navigateTo('/Settings'); setIsUserMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
                <button 
                onClick={() => { navigateTo('/auth'); setIsUserMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border-t border-gray-100 dark:border-white/5"
                >
                <LogOut size={16} />
                <span>Sign Out</span>
                </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}