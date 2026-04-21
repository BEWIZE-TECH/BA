'use client';

import { useState } from 'react';
import { Zap, Shield, Terminal, Globe, X, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const actions = [
  { name: 'FAST DEPLOY', icon: Zap, color: 'text-yellow-500', border: 'border-yellow-500/30', bgHover: 'hover:bg-yellow-500/10' },
  { name: 'SECURITY SCAN', icon: Shield, color: 'text-emerald-500', border: 'border-emerald-500/30', bgHover: 'hover:bg-emerald-500/10' },
  { name: 'OPEN CONSOLE', icon: Terminal, color: 'text-purple-500', border: 'border-purple-500/30', bgHover: 'hover:bg-purple-500/10' },
  { name: 'EDGE SYNC', icon: Globe, color: 'text-blue-500', border: 'border-blue-500/30', bgHover: 'hover:bg-blue-500/10' },
];

interface ActionMenuProps {
  isOpen: boolean;
  toggle: () => void;
}

export function ActionMenu({ isOpen, toggle }: ActionMenuProps) {
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  const handleActionClick = (actionName: string) => {
    switch (actionName) {
      case 'FAST DEPLOY':
        setIsModalOpen(true);
        break;
      case 'SECURITY SCAN':
        router.push('/dashboard/security');
        break;
      case 'OPEN CONSOLE':
        router.push('/dashboard/console');
        break;
      case 'EDGE SYNC':
        router.push('/dashboard/sync');
        break;
      default:
        console.warn('Unknown action route');
    }
    toggle();
  };

  const handleDeployConfirm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!projectName.trim()) return;

    setIsDeploying(true);
    console.log(`[System]: Deploying node: ${projectName}...`);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('projects')
          .insert([{ 
            name: projectName, 
            user_id: user.id 
          }])
          .select()
          .single();

        if (!error && data) {
          setIsModalOpen(false);
          setProjectName('');
          router.push(`/UploadDocument/${data.id}`);
        } else {
          console.error("Failed to deploy node:", error);
        }
      }
    } catch (err) {
      console.error("Deployment exception:", err);
    } finally {
      setIsDeploying(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProjectName('');
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-4 z-40">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col gap-3 mb-2"
            >
              {actions.map((action, index) => (
                <motion.button
                  key={action.name}
                  onClick={() => handleActionClick(action.name)} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 px-6 py-3.5 bg-[#0f0f0f]/95 backdrop-blur-md border ${action.border} rounded-xl ${action.bgHover} transition-colors group shadow-2xl`}
                >
                  <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 group-hover:text-gray-200 transition-colors">
                    {action.name}
                  </span>
                  <action.icon size={16} className={action.color} />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={toggle}
          className={`p-4 rounded-2xl transition-all duration-300 shadow-xl border flex items-center justify-center ${
            isOpen 
              ? 'bg-[#1a0f0f] border-red-500/50 text-red-500 hover:bg-red-500/10' 
              : 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
          }`}
        >
          <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
            {isOpen ? <X size={24} /> : <Plus size={24} />}
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121212] border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-800 bg-[#0a0a0a]">
                <h3 className="text-lg font-medium text-gray-200 flex items-center gap-2">
                  <Zap size={18} className="text-yellow-500" />
                  Initialize Neural Node
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-mono">Set parameters for new deployment</p>
              </div>

              <form onSubmit={handleDeployConfirm} className="p-6">
                <div className="mb-6">
                  <label htmlFor="projectName" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Project Designation
                  </label>
                  <input
                    id="projectName"
                    type="text"
                    autoFocus
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Alpha Sec RAG"
                    className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                    disabled={isDeploying}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isDeploying}
                    className="px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isDeploying || !projectName.trim()}
                    className="px-6 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                  >
                    {isDeploying ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Allocating...
                      </>
                    ) : (
                      'Deploy Node'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
