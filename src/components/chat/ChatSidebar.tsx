"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Clock, Hash, Plus, Activity, TerminalSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  name: string;
}

export function ChatSidebar() {
  const params = useParams();
  const router = useRouter();
  const currentSessionId = params.id as string;
  
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name')
          .order('created_at', { ascending: false })
          .limit(15);

        if (error) throw error;
        
        if (data) {
          setRecentProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch recent projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentProjects();
  }, []);

  return (
    <aside className="w-72 bg-[#050505] hidden md:flex flex-col shrink-0 border-r border-gray-800/40 shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-10">
      
      <div className="p-4 border-b border-gray-800/40 flex items-center justify-between bg-[#0a0a0a]">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
          <Clock size={12} className="text-gray-400" />
          History
        </h2>
        <button 
          onClick={() => router.push('/chat/${id}')} 
          className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-all group"
          title="New Analysis"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 custom-scrollbar">
        {isLoading ? (
          <div className="space-y-2 px-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-full h-10 bg-gray-800/20 rounded-lg animate-pulse flex items-center px-3 gap-3">
                <div className="w-4 h-4 bg-gray-800/40 rounded-sm"></div>
                <div className="h-2 bg-gray-800/40 rounded-full w-24"></div>
              </div>
            ))}
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-3 opacity-40">
            <TerminalSquare size={24} className="text-gray-500" />
            <p className="text-xs text-gray-400 font-mono tracking-wider">No active sessions</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {recentProjects.map((project) => {
              const isActive = currentSessionId === project.id;
              
              return (
                <li key={project.id}>
                  <Link href={`/chat/${project.id}`}>
                    <button 
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative ${
                        isActive 
                          ? 'bg-blue-600/10 text-blue-400 font-medium' 
                          : 'text-gray-400 hover:bg-gray-800/30 hover:text-gray-200'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                      )}
                      
                      <Hash size={14} className={`${isActive ? 'text-blue-500' : 'text-gray-600 group-hover:text-gray-400'} transition-colors shrink-0`} />
                      <span className="truncate tracking-wide">{project.name}</span>
                    </button>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
      <div className="p-4 border-t border-gray-800/40 bg-[#080808] mt-auto">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-gray-500 font-mono bg-gray-900/30 p-2.5 rounded-md border border-gray-800/50">
          <span className="flex items-center gap-1.5">
            <Activity size={12} className="text-gray-600" />
            Local Node
          </span>
          <span className="flex items-center gap-1.5 text-emerald-500/90 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Active
          </span>
        </div>
      </div>
    </aside>
  );
}