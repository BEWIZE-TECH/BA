'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Moon, Sun, User } from 'lucide-react';

interface TopHeaderProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export function TopHeader({ isDarkMode, toggleTheme }: TopHeaderProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) console.log(`Searching for "${searchQuery}"...`);
    };

    return (
        <header className="w-380 h-16 flex items-center justify-between px-8 bg-white dark:bg-[#141414] border-l border-gray-800/50 dark:border-transparent transition-colors">
          
            <form onSubmit={handleSearch} className="relative w-48 transition-all">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" size={18} />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search neural nodes..." 
                    className="w-full bg-gray-100 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 text-sm text-gray-800 dark:text-gray-300 rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
            </form>
            
            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
                >
                    {isDarkMode ? (
                        <Sun size={18} className="group-hover:scale-110 transition-transform text-yellow-500" />
                    ) : (
                        <Moon size={18} className="group-hover:scale-110 transition-transform" />
                    )}
                </button>

                <button 
                    onClick={() => router.push('/dashboard/settings')}
                    className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-600/40 transition-colors group"
                >
                    <User size={18} className="group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </header>
    );
}