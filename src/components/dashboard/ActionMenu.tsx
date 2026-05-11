'use client';

import { Zap, Shield, Terminal, Globe, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const actions = [
  { name: 'NEW PROJECT', icon: Zap, color: 'text-yellow-500', border: 'border-yellow-500/30', bgHover: 'hover:bg-yellow-500/10' },
];

interface ActionMenuProps {
  isOpen: boolean;
  toggle: () => void;
}

export function ActionMenu({ isOpen, toggle }: ActionMenuProps) {
  const router = useRouter();

  const handleActionClick = (actionName: string) => {
    switch (actionName) {
      case 'NEW PROJECT':
        // Navigates straight to the UploadDoc page
        router.push('/UploadDocument/[id]');
        break;
      default:
        console.warn('Unknown action route');
    }
    toggle();
  };

  return (
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
  );
}