import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, Edit2, Eye, Save, CheckCircle2, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const MARKDOWN_STYLES = `
  prose prose-sm md:prose-base max-w-none w-full text-gray-300
  prose-headings:text-gray-100 prose-headings:font-black
  prose-h1:text-3xl lg:prose-h1:text-4xl prose-h1:pb-6 prose-h1:mb-10 prose-h1:uppercase prose-h1:tracking-tighter prose-h1:border-b prose-h1:border-gray-800
  prose-h2:mt-10 prose-h2:mb-5 prose-h2:text-2xl prose-h2:pl-4 prose-h2:border-l-4 prose-h2:border-blue-500
  prose-p:leading-[1.8] prose-p:mb-6
  prose-table:table-auto prose-table:w-full prose-table:border-collapse prose-table:mb-10 prose-table:border prose-table:border-gray-800
  prose-thead:bg-[#161616]
  prose-th:p-3.5 prose-th:text-gray-400 prose-th:text-left prose-th:font-semibold prose-th:uppercase prose-th:text-[11px] prose-th:tracking-wider prose-th:border-b prose-th:border-gray-800
  prose-td:p-3.5 prose-td:align-top prose-td:text-sm prose-td:border-b prose-td:border-gray-800/50
  [&>table>tbody>tr:nth-child(even)]:bg-[#161616]/30
  prose-strong:text-white prose-strong:font-bold
  prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-400 prose-blockquote:bg-blue-900/10 prose-blockquote:py-4 prose-blockquote:border-l-4 prose-blockquote:border-blue-500
`;

interface ArtifactPanelProps {
  activeArtifact: { id: string; content: any; type: string } | null;
  onClose: () => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  draft: string;
  setDraft: (draft: string) => void;
  onSave: () => void;
  isSaving: boolean;
  showSuccess: boolean;
}

export function ArtifactPanel({
  activeArtifact,
  onClose,
  isEditing,
  setIsEditing,
  draft,
  setDraft,
  onSave,
  isSaving,
  showSuccess
}: ArtifactPanelProps) {
  
  if (!activeArtifact) return null;

  const originalContent = activeArtifact.type === 'code' ? activeArtifact.content : (activeArtifact.content.raw || activeArtifact.content);
  const hasChanges = draft !== originalContent;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.98, y: 20 }} 
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="absolute inset-0 z-50 flex flex-col bg-[#050505] rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-gray-800 overflow-hidden"
      >
        {/* PANEL HEADER */}
        <div className="flex-none flex items-center justify-between p-3 bg-[#0f0f0f] sticky top-0 z-30 border-b border-gray-800/80">
          <div className="flex items-center gap-3 px-2 min-w-0">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg shrink-0">
              <FileText size={16} />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 block leading-none mb-1">Fullscreen Canvas</span>
              <span className="text-sm font-semibold text-gray-200 truncate block">
                {activeArtifact.type === 'document' ? activeArtifact.content.name || 'Document' : 'Architecture Model'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            {activeArtifact.type !== 'mermaid' && (
              <div className="flex items-center bg-[#161616] p-1 rounded-lg border border-gray-800">
                <button onClick={() => setIsEditing(false)} className={`flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-semibold rounded-md transition-all ${!isEditing ? 'bg-[#252525] text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>
                  <Eye size={12} /> Preview
                </button>
                <button onClick={() => setIsEditing(true)} className={`flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-semibold rounded-md transition-all ${isEditing ? 'bg-[#252525] text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>
                  <Edit2 size={12} /> Live Edit
                </button>
              </div>
            )}

            <AnimatePresence>
              {isEditing && hasChanges && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  onClick={onSave} disabled={isSaving} 
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-blue-500/20"
                >
                  {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save
                </motion.button>
              )}
              {showSuccess && !isEditing && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold uppercase tracking-wider rounded-lg border border-emerald-500/20"><CheckCircle2 size={12} /> Saved</motion.div>
              )}
            </AnimatePresence>

            <div className="w-px h-6 bg-gray-800 mx-1 hidden sm:block" />

            <button onClick={onClose} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-all ml-1">
              <X size={18} />
            </button>
          </div>
        </div>
        
        {/* PANEL BODY */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex justify-center items-start bg-[#050505] custom-scrollbar shadow-inner">
          {isEditing ? (
            // LIVE SPLIT-PANE EDITOR
            <div className="w-full h-full flex flex-col md:flex-row gap-4">
              <div className="flex-1 bg-[#0f0f0f] border border-gray-800/80 rounded-xl overflow-hidden flex flex-col shadow-2xl">
                <div className="px-4 py-2.5 bg-[#161616] border-b border-gray-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Edit2 size={12}/> Markdown Source</span>
                </div>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  spellCheck={false}
                  className="w-full flex-1 bg-transparent text-gray-300 font-mono text-[13px] p-6 outline-none resize-none custom-scrollbar leading-[1.8]"
                />
              </div>

              <div className="flex-1 bg-[#0f0f0f] border border-gray-800/80 rounded-xl overflow-hidden hidden md:flex flex-col shadow-2xl">
                <div className="px-4 py-2.5 bg-[#161616] border-b border-gray-800 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2"><Eye size={12}/> Live Preview</span>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  <div className={MARKDOWN_STYLES}>
                    <ReactMarkdown children={draft} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // FULL PREVIEW
            <div className="w-full max-w-5xl bg-[#0f0f0f] shadow-2xl border border-gray-800/80 rounded-xl min-h-full p-8 md:p-14">
              {activeArtifact.type === 'code' ? (
                <pre className="text-[13px] font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">{activeArtifact.content}</pre>
              ) : (
                <div className={MARKDOWN_STYLES}>
                  <ReactMarkdown children={originalContent} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} />
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}