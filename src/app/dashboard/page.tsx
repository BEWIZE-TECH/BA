'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopHeader } from '@/components/dashboard/TopHeader';
import { SystemHub } from '@/components/dashboard/StatsOverview'; 
import { ProjectGrid } from '@/components/dashboard/ProjectGrid';
import { ActionMenu } from '@/components/dashboard/ActionMenu';

export default function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState<string>('Authenticating...');
  const [totalNodes, setTotalNodes] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // --- NEW: Master Search State ---
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchDashboardState() {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setUserIdentifier('Offline / Unauthenticated');
        return;
      }
      const username = user.email ? user.email.split('@')[0] : 'Admin';
      setUserIdentifier(username);
      
      const { count, error: countError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      if (!countError && count !== null) {
        setTotalNodes(count);
      }
    }
    fetchDashboardState();
  }, []);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-gray-50 dark:bg-[#0f0f0f] text-gray-900 dark:text-white overflow-hidden font-sans selection:bg-blue-500/30 transition-colors duration-300">
        
        <Sidebar />
        
        <div className="flex-1 flex flex-col relative">
          <TopHeader 
            isDarkMode={isDarkMode} 
            toggleTheme={() => setIsDarkMode(!isDarkMode)} 
            // --- NEW: Pass state to TopHeader ---
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <div className="flex-1 flex overflow-hidden">
            <main className="flex-1 overflow-y-auto px-8 pb-8">
              <div className="mt-4 mb-8 bg-white dark:bg-[#161616] rounded-[2rem] border border-gray-200 dark:border-gray-800/60 p-10 flex justify-between items-center relative overflow-hidden transition-colors shadow-sm dark:shadow-none">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-100/50 dark:from-blue-900/10 to-transparent pointer-events-none" />
                
                <div className="z-10">
                  <h1 className="text-4xl font-light text-gray-800 dark:text-gray-300">
                    System <span className="text-blue-600 dark:text-blue-500 font-semibold shadow-blue-500/50 drop-shadow-lg">Initialized.</span>
                  </h1>
                  <p className="text-gray-500 text-xs mt-3 font-mono tracking-wider">
                    Status: <span className={userIdentifier.includes('Offline') ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}>
                      {userIdentifier.includes('Offline') ? 'Offline' : 'Online'}
                    </span> | User: <span className="text-gray-600 dark:text-gray-400">{userIdentifier}</span>
                  </p>
                </div>

                <div className="flex gap-6 z-10">
                  <div className="bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-800 rounded-2xl px-6 py-4 flex flex-col items-center transition-colors">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      Total Nodes
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_4px_rgba(16,185,129,0.8)]"></span>
                    </span>
                    <span className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{totalNodes}</span>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-800 rounded-2xl px-6 py-4 flex flex-col items-center transition-colors">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      Latency
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_4px_rgba(16,185,129,0.8)]"></span>
                    </span>
                    <span className="text-2xl font-semibold text-gray-800 dark:text-gray-200">0.4ms</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wide">
                  {searchQuery ? 'Search Results' : 'Active Projects'}
                </h2>
              </div>

              {/* --- NEW: Pass searchQuery to ProjectGrid --- */}
              <ProjectGrid searchQuery={searchQuery} />
            </main>

            <SystemHub />
          </div>

          <ActionMenu isOpen={isMenuOpen} toggle={() => setIsMenuOpen(!isMenuOpen)} />
        </div>
      </div>
    </div>
  );
}