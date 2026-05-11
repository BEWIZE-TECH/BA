"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Clock, 
  Hash, 
  Plus, 
  Activity, 
  TerminalSquare, 
  PanelLeftClose, 
  PanelLeftOpen,
  LayoutDashboard,
  Power,
  Hexagon,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  name: string;
  created_at: string;
}

interface GroupedProjects {
  today: Project[];
  previous7Days: Project[];
  older: Project[];
}

export function ChatSidebar() {
  const params = useParams();
  const router = useRouter();
  const currentSessionId = params.id as string;
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name, created_at')
          .order('created_at', { ascending: false })
          .limit(25);

        if (error) throw error;
        if (data) setProjects(data);
      } catch (error) {
        console.error("Failed to fetch recent projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentProjects();
  }, []);

  const groupedProjects = useMemo<GroupedProjects>(() => {
    const groups: GroupedProjects = { today: [], previous7Days: [], older: [] };
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = todayStart - 7 * 24 * 60 * 60 * 1000;

    projects.forEach(project => {
      const projectDate = new Date(project.created_at).getTime();
      if (projectDate >= todayStart) {
        groups.today.push(project);
      } else if (projectDate >= sevenDaysAgo) {
        groups.previous7Days.push(project);
      } else {
        groups.older.push(project);
      }
    });

    return groups;
  }, [projects]);

  const handleNewChat = () => {
    router.push('/UploadDocument/[id]'); 
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await supabase.auth.signOut();

      router.push('/auth');
    } catch (error) {
      console.error("Error signing out:", error);
      setIsDisconnecting(false);
    }
  };

  const renderProjectList = (list: Project[], label: string) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-8">
        <h3 className="px-4 mb-3 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
          {label} <div className="h-px flex-1 bg-gradient-to-r from-gray-800 to-transparent"></div>
        </h3>
        <ul className="space-y-1 px-2">
          {list.map((project) => {
            const isActive = currentSessionId === project.id;
            return (
              <li key={project.id}>
                <Link href={`/chat/${project.id}`} className="block focus:outline-none">
                  <button 
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-300 group relative overflow-hidden ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-600/20 to-transparent border-l-2 border-blue-500 text-blue-300 shadow-[inset_10px_0_20px_rgba(59,130,246,0.05)]' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 hover:translate-x-1 border-l-2 border-transparent'
                    }`}
                  >
                    <span className="truncate font-medium relative z-10 text-[13px]">{project.name}</span>
                    {isActive && <ChevronRight size={14} className="text-blue-500 opacity-50 relative z-10" />}
                  </button>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all shadow-xl group"
          title="Open Workspace Panel"
        >
          <PanelLeftOpen size={18} className="group-hover:scale-105 transition-transform" />
        </button>
      )}

      <aside 
        className={`hidden md:flex flex-col shrink-0 border-r border-white/5 bg-black/20 backdrop-blur-3xl z-10 transition-all duration-500 ease-in-out overflow-hidden relative ${
          isOpen ? 'w-72 shadow-[20px_0_50px_rgba(0,0,0,0.5)]' : 'w-0 border-r-0 opacity-0'
        }`}
      >
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-0 w-full h-64 bg-blue-500/5 blur-[80px] pointer-events-none" />

        <div className="w-72 flex flex-col h-full relative z-10">
          
          {/* Header */}
          <div className="h-16 px-5 border-b border-white/5 flex items-center justify-between shrink-0 bg-gradient-to-b from-white/[0.02] to-transparent">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 -ml-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                title="Close Workspace Panel"
              >
                <PanelLeftClose size={18} />
              </button>
              <h2 className="text-[13px] font-black text-gray-200 tracking-[0.1em] uppercase flex items-center gap-2">
                Workspace
              </h2>
            </div>
            
            <button 
              onClick={handleNewChat} 
              className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-300 group"
              title="Initialize New Node"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Top Navigation */}
          <div className="p-4 shrink-0">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-gray-300 bg-white/[0.03] border border-white/5 hover:bg-white/10 hover:border-white/10 hover:text-white transition-all shadow-sm group"
            >
              <div className="p-1.5 rounded-md bg-gray-800/50 group-hover:bg-blue-500/20 transition-colors">
                <LayoutDashboard size={16} className="text-gray-400 group-hover:text-blue-400" />
              </div>
              Dashboard
            </Link>
          </div>

          {/* Project History */}
          <nav className="flex-1 overflow-y-auto py-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-800/50 hover:[&::-webkit-scrollbar-thumb]:bg-gray-700/50 [&::-webkit-scrollbar-thumb]:rounded-full transition-colors">
            {isLoading ? (
              <div className="space-y-3 px-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-full h-10 bg-white/5 rounded-xl animate-pulse flex items-center px-3 gap-3">
                    <div className="w-4 h-4 bg-white/10 rounded-md"></div>
                    <div className="h-2 bg-white/10 rounded-full w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-4 opacity-40">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest"> Empty</p>
              </div>
            ) : (
              <div className="mt-2">
                {renderProjectList(groupedProjects.today, "Today's Logs")}
                {renderProjectList(groupedProjects.previous7Days, "Last 7 Days")}
                {renderProjectList(groupedProjects.older, "Last Month and Older")}
              </div>
            )}
          </nav>

          {/* Footer Status & Disconnect */}
          <div className="p-4 border-t border-white/5 bg-black/20 shrink-0 mt-auto flex flex-col gap-3 relative overflow-hidden">
            {/* System Status */}
            <div className="flex items-center justify-between text-xs font-semibold text-gray-400 bg-[#111] px-4 py-3 rounded-xl border border-white/5 shadow-inner">
              <span className="flex items-center gap-2 tracking-wide">
                <Activity size={14} className="text-gray-500" />
                Chat
              </span>
              <span className="flex items-center gap-2 text-emerald-400 tracking-wider uppercase text-[10px] font-black">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Active
              </span>
            </div>

            {/* Neural Disconnect Button */}
            <button 
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 text-[11px] font-black uppercase tracking-[0.2em] group"
            >
              {isDisconnecting ? (
                <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div> Disconnecting...</span>
              ) : (
                <>
                  <Power size={14} className="group-hover:animate-pulse" />
                  Disconnect
                </>
              )}
            </button>
          </div>

        </div>
      </aside>
    </>
  );
}