'use client';

import { useState } from 'react';
import { User, Shield, Settings as SettingsIcon, Key, Bell, Palette, Loader2, Save, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  { id: 'profile', label: 'Operator Profile', icon: User },
  { id: 'preferences', label: 'System Preferences', icon: SettingsIcon },
  { id: 'security', label: 'Security & Access', icon: Shield },
  { id: 'api', label: 'Neural API Links', icon: Key },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-8 font-sans selection:bg-blue-500/30 flex justify-center">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-72 shrink-0">
          <div className="mb-8">
            <h1 className="text-3xl font-light tracking-wide text-gray-200">
              System <span className="text-blue-500 font-semibold">Settings</span>
            </h1>
            <p className="text-gray-500 text-xs mt-2 font-mono tracking-widest uppercase">Configure BIWIZE Parameters</p>
          </div>

          <nav className="flex flex-col gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-200 group text-sm font-medium ${
                  activeTab === tab.id
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-900/40 shadow-[0_0_15px_rgba(37,99,235,0.05)]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#141414] border border-transparent'
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-blue-500' : 'group-hover:text-gray-300'} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="mt-12 pt-6 border-t border-gray-800/80">
            <button className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all group">
              <LogOut size={18} className="group-hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
              Terminate Session
            </button>
          </div>
        </aside>
        <main className="flex-1 bg-[#141414] border border-gray-800/80 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-lg font-medium text-gray-200 mb-1">Operator Profile</h2>
                    <p className="text-xs text-gray-500 font-mono">Manage your personal identification data.</p>
                  </div>
                  
                  <div className="flex items-center gap-6 pb-6 border-b border-gray-800/50">
                    <div className="w-20 h-20 rounded-2xl bg-[#0f0f0f] border border-gray-700 flex items-center justify-center shadow-lg">
                      <User size={32} className="text-gray-500" />
                    </div>
                    <button className="px-4 py-2 bg-[#0f0f0f] border border-gray-700 hover:border-gray-500 text-xs font-medium text-gray-300 rounded-lg transition-colors">
                      Upload Avatar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Designation</label>
                      <input type="text" defaultValue="Admin User" className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Comm Link (Email)</label>
                      <input type="email" defaultValue="admin@biwize.system" className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-colors" disabled />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-lg font-medium text-gray-200 mb-1">System Preferences</h2>
                    <p className="text-xs text-gray-500 font-mono">Customize your interface and notification protocols.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-gray-800 rounded-xl bg-[#0f0f0f]">
                      <div className="flex items-center gap-3">
                        <Palette className="text-blue-400" size={20} />
                        <div>
                          <p className="text-sm font-medium text-gray-200">Terminal Theme</p>
                          <p className="text-xs text-gray-500">Force dark mode or sync with system.</p>
                        </div>
                      </div>
                      <select className="bg-[#141414] border border-gray-700 text-sm text-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500">
                        <option>Dark Protocol</option>
                        <option>Light Protocol</option>
                        <option>System Sync</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-800 rounded-xl bg-[#0f0f0f]">
                      <div className="flex items-center gap-3">
                        <Bell className="text-yellow-400" size={20} />
                        <div>
                          <p className="text-sm font-medium text-gray-200">Neural Alerts</p>
                          <p className="text-xs text-gray-500">Receive notifications on node completion.</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'api' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-lg font-medium text-gray-200 mb-1">Neural API Links</h2>
                    <p className="text-xs text-gray-500 font-mono">Manage external LLM and database connections.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Ollama Local Port</label>
                      <input type="text" defaultValue="http://localhost:11434" className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-colors font-mono" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">ChromaDB Vector Host</label>
                      <input type="text" defaultValue="http://localhost:8000" className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-colors font-mono" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">n8n Orchestration Hook</label>
                      <div className="flex gap-2">
                        <input type="password" defaultValue="************************" className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-colors font-mono" />
                        <button className="px-4 py-2 bg-[#0f0f0f] border border-gray-700 hover:border-gray-500 text-xs font-medium text-gray-300 rounded-xl transition-colors">
                          Reveal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10 pt-6 border-t border-gray-800/80 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-500 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {isSaving ? 'Syncing...' : 'Save Parameters'}
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}