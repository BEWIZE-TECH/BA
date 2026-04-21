
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Pencil, Trash2, Check, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export function ProjectGrid() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Interaction States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) console.error('Error fetching projects:', error);
        else setProjects(data || []);
      }
      setLoading(false);
    }

    fetchProjects();
  }, []);

  const handleCardClick = (id: string) => {
    if (!editingId && !deletingId) {
      router.push(`/chat/${id}`);
    }
  };

  const startEditing = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation(); 
    setEditingId(project.id);
    setEditName(project.name);
    setDeletingId(null);
  };

  const saveEdit = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!editName.trim()) return;
    
    setIsProcessing(true);
    const { error } = await supabase
      .from('projects')
      .update({ name: editName })
      .eq('id', id);

    if (!error) {
      setProjects(projects.map(p => p.id === id ? { ...p, name: editName } : p));
      setEditingId(null);
    } else {
      console.error("Failed to update name:", error);
    }
    setIsProcessing(false);
  };

  const startDeleting = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    setEditingId(null);
  };

  const confirmDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setIsProcessing(true);
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (!error) {
      setProjects(projects.filter(p => p.id !== id));
      setDeletingId(null);
    } else {
      console.error("Failed to delete project:", error);
    }
    setIsProcessing(false);
  };

  const cancelAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setDeletingId(null);
  };

  if (loading) {
    return <div className="p-6 text-gray-500 animate-pulse font-mono text-sm">Scanning neural nodes...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {projects.length > 0 ? (
        projects.map((project) => (
          <div 
            key={project.id} 
            onClick={() => handleCardClick(project.id)}
            className="relative bg-transparent border border-gray-700 rounded-2xl h-32 p-5 hover:border-blue-500/50 hover:bg-[#1a1a1a] transition-all cursor-pointer group flex flex-col justify-between overflow-hidden"
          >
            {editingId === project.id ? (
              <div className="flex flex-col h-full justify-between" onClick={e => e.stopPropagation()}>
                <input
                  type="text"
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-blue-500/50 text-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-medium"
                  disabled={isProcessing}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={cancelAction} disabled={isProcessing} className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-md transition-colors">
                    <X size={14} />
                  </button>
                  <button onClick={(e) => saveEdit(e, project.id)} disabled={isProcessing} className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded-md transition-colors">
                    {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  </button>
                </div>
              </div>
            ) 
            
            : deletingId === project.id ? (
              <div className="flex flex-col h-full justify-between items-center text-center" onClick={e => e.stopPropagation()}>
                <span className="text-xs text-red-400 font-bold uppercase tracking-widest mt-1">Purge Node?</span>
                <div className="flex justify-center gap-3 w-full">
                  <button onClick={cancelAction} disabled={isProcessing} className="flex-1 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors border border-gray-700">
                    Cancel
                  </button>
                  <button onClick={(e) => confirmDelete(e, project.id)} disabled={isProcessing} className="flex-1 py-1.5 text-xs font-medium bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30 rounded-md transition-colors flex items-center justify-center">
                    {isProcessing ? <Loader2 size={14} className="animate-spin" /> : 'Confirm'}
                  </button>
                </div>
              </div>
            ) 
            
            : (
              <>
                <div className="flex justify-between items-start">
                  <h3 className="text-gray-300 font-medium group-hover:text-blue-400 transition-colors truncate pr-4">
                    {project.name}
                  </h3>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 absolute top-4 right-4">
                    <button 
                      onClick={(e) => startEditing(e, project)} 
                      className="p-1.5 text-gray-500 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-md transition-colors"
                      title="Rename Node"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={(e) => startDeleting(e, project.id)} 
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                      title="Purge Node"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <span className="text-[10px] text-gray-600 font-mono flex items-center justify-between">
                  <span>ID: {project.id.split('-')[0]}</span>
                  <span className="text-emerald-500/70">Online</span>
                </span>
              </>
            )}
          </div>
        ))
      ) : (
        <div className="col-span-full flex flex-col justify-center items-center py-20 opacity-50">
          <div className="w-12 h-12 border border-gray-700 rounded-xl mb-4 flex items-center justify-center text-gray-600 rotate-45">
             <div className="w-4 h-4 bg-gray-700 shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
          </div>
          <p className="text-gray-500 text-sm tracking-widest font-mono uppercase">No active nodes detected</p>
        </div>
      )}
    </div>
  );
}