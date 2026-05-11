"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Loader2, FileText, Sparkles, Layout } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toBase64 } from '@/lib/chatHelpers';

// Modular Components
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage, Message } from '@/components/chat/ChatMessage';
import { ArtifactPanel } from '@/components/chat/panel';

export default function InteractiveChat() {
  const params = useParams();
  const sessionId = params.id as string;

  const [inputText, setInputText] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); 
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [queryMode, setQueryMode] = useState<'stakeholder' | 'General' | 'image' | 'document'>('General');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [projectName, setProjectName] = useState<string>("Initializing...");
  
  // Artifact Panel State
  const [activeArtifact, setActiveArtifact] = useState<{id: string, content: any, type: string} | null>(null);
  const [isArtifactEditing, setIsArtifactEditing] = useState(false);
  const [artifactDraft, setArtifactDraft] = useState('');
  const [isArtifactSaving, setIsArtifactSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const N8N_CHAT_WEBHOOK = "http://localhost:5678/webhook/query-requirements";
  const N8N_FEEDBACK_WEBHOOK = "http://localhost:5678/webhook/log-feedback";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveArtifact(null); 
      if ((e.metaKey || e.ctrlKey) && e.key === 's' && isArtifactEditing) { e.preventDefault(); handleSaveArtifact(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isArtifactEditing, artifactDraft]);

  // --- FETCH HISTORY UPDATED TO LOAD ATTACHMENTS ---
  useEffect(() => {
    const fetchHistory = async () => {
      if (!sessionId) return;
      setIsLoadingHistory(true);
      try {
        const { data: projData } = await supabase.from('projects').select('name').eq('id', sessionId).single();
        if (projData) setProjectName(projData.name);
        
        const { data, error } = await supabase.from('chat_history').select('id, message, session_id').eq('session_id', sessionId).order('id', { ascending: true }); 
        if (error) throw error;

        if (data && data.length > 0) {
          const historicalMessages: Message[] = data.map((row: any) => {
            const msgData = row.message;
            const isUser = msgData.type === 'human' || msgData.role === 'user';
            let type: 'text' | 'document' | 'image' | 'mermaid' | 'markdown' = 'text';
            if (msgData.kwargs?.is_artifact) type = 'document';
            else if (msgData.kwargs?.image_url) type = 'image';
            else if (msgData.kwargs?.mermaid_code) type = 'mermaid';
            
            return {
              id: `db-${row.id}`, sender: isUser ? 'user' : 'assistant', type: type,
              content: type === 'document' ? { name: msgData.kwargs?.artifact_name || "Generated Document", raw: msgData.content } 
                : type === 'image' ? { url: msgData.kwargs.image_url } 
                : type === 'mermaid' ? { mermaid_code: msgData.kwargs.mermaid_code }
                : msgData.content,
              timestamp: msgData.timestamp || new Date().toISOString(),
              isPinned: msgData.kwargs?.isPinned || false,
              attachment: msgData.kwargs?.attachment || undefined // Restore attachment from DB
            };
          });
          setMessages(historicalMessages);
        } else {
          setMessages([{ id: `init-${Date.now()}`, sender: 'assistant', type: 'text', content: "Business Analyst AI is Active. How shall we proceed?", timestamp: new Date().toISOString() }]);
        }
      } catch (err) { console.error("Failed to load history:", err); } 
      finally { setIsLoadingHistory(false); }
    };
    fetchHistory();
  }, [sessionId]);

  useEffect(() => {
    if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages, isThinking]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files && e.dataTransfer.files.length > 0) setSelectedFile(e.dataTransfer.files[0]); };

  const handleLogFeedback = (messageId: string, type: 'up' | 'down', reason?: string): void => {
    (async () => {
      try { await fetch(N8N_FEEDBACK_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messageId, feedbackType: type, toolType: reason, sessionId }) }); } catch (error) { console.error("Feedback error", error); }
    })();
  };

  const togglePin = (messageId: string) => { setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isPinned: !m.isPinned } : m)); };
  const handleRegenerate = async (messageId: string) => { const aiMsgIndex = messages.findIndex(m => m.id === messageId); if (aiMsgIndex === -1) return; let lastUserMsgIndex = aiMsgIndex - 1; while (lastUserMsgIndex >= 0 && messages[lastUserMsgIndex].sender !== 'user') lastUserMsgIndex--; if (lastUserMsgIndex >= 0) { const lastUserMsg = messages[lastUserMsgIndex]; setMessages(messages.slice(0, aiMsgIndex)); await handleSendMessage(lastUserMsg.content, undefined, true); } };

  const handleSaveArtifact = async () => {
    if (!activeArtifact) return;
    setIsArtifactSaving(true);
    try {
      setMessages(prev => prev.map(m => {
        if (m.id === activeArtifact.id) {
          const newContent = activeArtifact.type === 'document' ? { ...m.content, raw: artifactDraft } : artifactDraft;
          return { ...m, content: newContent };
        }
        return m;
      }));
      setActiveArtifact(prev => prev ? { ...prev, content: prev.type === 'document' ? { ...prev.content, raw: artifactDraft } : artifactDraft } : null);
      
      if (activeArtifact.id.startsWith('db-')) {
        const dbId = activeArtifact.id.replace('db-', '');
        const { data } = await supabase.from('chat_history').select('message').eq('id', dbId).single();
        if (data) {
          const updatedMessage = { ...data.message };
          updatedMessage.content = artifactDraft;
          await supabase.from('chat_history').update({ message: updatedMessage }).eq('id', dbId);
        }
      }
      setIsArtifactEditing(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (err) { console.error("Failed to save artifact:", err); } 
    finally { setIsArtifactSaving(false); }
  };

  const handleStopExecution = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); 
      setIsThinking(false);
    }
  };

  // --- SEND MESSAGE UPDATED TO CAPTURE ATTACHMENT ---
  const handleSendMessage = async (contentStr: string, toolType?: string, skipUserMessageUI = false) => {
    const queryContent = contentStr || inputText || (selectedFile ? "Analyze attached artifact." : "");
    if (!queryContent && !selectedFile) return;
    if (isThinking) return;

    // Capture file metadata for the UI
    const fileMeta = selectedFile ? { name: selectedFile.name, type: selectedFile.type } : undefined;

    const userMsg: Message = { 
      id: `msg-${Date.now()}`, 
      sender: 'user', 
      type: 'text', 
      content: queryContent, 
      timestamp: new Date().toISOString(),
      attachment: fileMeta // Attach to React State
    };

    if (!skipUserMessageUI) {
      setMessages(prev => [...prev, userMsg]);
      await supabase.from('chat_history').insert([{ 
        session_id: sessionId, 
        message: { 
          type: 'human', 
          content: userMsg.content, 
          timestamp: new Date().toISOString(),
          kwargs: { attachment: fileMeta } // Save to Supabase DB so it persists
        } 
      }]);
    }
    
    setInputText(''); 
    setIsThinking(true);
    
    // Process file for the webhook
    const fileToUpload = selectedFile;
    setSelectedFile(null); 

    abortControllerRef.current = new AbortController();

    try {
      const formData = new FormData();
      formData.append('query', queryContent);
      formData.append('sessionId', sessionId);
      formData.append('mode', toolType || queryMode);
      
      if (fileToUpload) {
        formData.append('file', fileToUpload); 
      }

      const response = await fetch(N8N_CHAT_WEBHOOK, { 
        method: 'POST', 
        signal: abortControllerRef.current.signal, 
        body: formData 
      });

      if (!response.ok) throw new Error("Connection Failure");
      const data = await response.json();
      
      const aiResponse: Message = {
        id: `msg-${Date.now()}`, sender: 'assistant', type: (data.type || 'text') as any, 
        content: data.type === 'document' ? { name: data.content?.name || "Requirement_Spec.md", raw: data.content?.raw } : data.type === 'image' ? { url: data.content?.url, name: data.content?.name } : data.type === 'mermaid' ? { mermaid_code: data.content?.mermaid_code } : data.answer,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      await supabase.from('chat_history').insert([{ session_id: sessionId, message: { type: 'ai', content: data.type === 'document' ? data.content?.raw : (data.answer || ""), timestamp: new Date().toISOString(), kwargs: { image_url: data.type === 'image' ? data.content?.url : undefined, is_artifact: data.type === 'document', artifact_name: data.content?.name, mermaid_code: data.type === 'mermaid' ? data.content?.mermaid_code : undefined } } }]);
    
    } catch (error: any) { 
      if (error.name === 'AbortError') {
        console.log("Execution halted by user.");
      } else {
        setMessages(prev => [...prev, { id: `err-${Date.now()}`, sender: 'assistant', type: 'error', content: "Neural Link Disrupted. Check n8n status.", timestamp: new Date().toISOString() }]); 
      }
    } finally { 
      setIsThinking(false); 
      abortControllerRef.current = null; 
    }
  };

  const quickPrompts = [
    { title: "Draft FRS", desc: "Generate Functional Requirements.", icon: <FileText size={16}/> },
    { title: "User Stories", desc: "Map Jira stories with BDD criteria.", icon: <Layout size={16}/> },
    { title: "System Flow", desc: "Visualize architecture with Mermaid.", icon: <Sparkles size={16}/> }
  ];

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="flex flex-col h-screen bg-[#050505] text-white font-sans overflow-hidden" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        
        <div className="flex flex-1 overflow-hidden relative p-3 gap-3">
          <AnimatePresence>
            {isDragging && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-blue-600/10 backdrop-blur-md m-4 rounded-3xl border border-blue-500/30">
                <div className="flex flex-col items-center gap-4 text-blue-500">
                  <UploadCloud size={64} className="animate-bounce drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                  <span className="text-2xl font-black tracking-widest uppercase italic">Drop Artifact to Ingest</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SIDEBAR */}
          {isSidebarOpen && <ChatSidebar />}
          
          {/* Main Content Workspace */}
          <main className="relative flex flex-1 h-full transition-all duration-700 ease-in-out">
            
            {/* FULL WIDTH CHAT PANEL */}
            <div className="flex flex-col h-full w-full rounded-2xl bg-[#0f0f0f] shadow-2xl relative border border-white/5 overflow-hidden">
              
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar">
                {isLoadingHistory ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50"><Loader2 className="animate-spin text-blue-500" size={24} /></div>
                ) : messages.length <= 1 ? (
                  <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto space-y-8 text-center animate-in fade-in zoom-in duration-1000">
                    <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-4 transform -rotate-6 border border-blue-400/30"><Sparkles className="text-white" size={40} /></div>
                    <h2 className="text-4xl font-black tracking-tighter text-gray-100 italic uppercase">BIWIZE CO-PILOT</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-10">
                      {quickPrompts.map((prompt, i) => (
                        <button key={i} onClick={() => handleSendMessage(prompt.title)} className="flex flex-col items-start p-5 bg-[#141414] border border-white/5 rounded-2xl transition-all text-left shadow-sm hover:border-blue-500/30 hover:shadow-2xl group">
                          <div className="p-3 bg-blue-900/20 text-blue-400 rounded-xl mb-4 group-hover:scale-110 transition-transform">{prompt.icon}</div>
                          <h3 className="font-bold text-sm mb-1 text-gray-200">{prompt.title}</h3>
                          <p className="text-[11px] text-gray-500 leading-tight">{prompt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 pb-6">
                    {messages.map((msg) => (
                      <ChatMessage 
                        key={msg.id} message={msg} onLogFeedback={handleLogFeedback}  onRegenerate={handleRegenerate} onPinToggle={togglePin}
                        onOpenArtifact={(content, type) => { 
                          setActiveArtifact({ id: msg.id, content, type }); 
                          setArtifactDraft(type === 'code' ? content : (content.raw || content));
                          setIsArtifactEditing(false);
                        }}
                      />
                    ))}
                    {isThinking && (
                      <div className="flex items-start gap-4 mb-10 animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center shrink-0 mt-1 border border-white/5"><div className="w-2 h-2 bg-blue-500/50 rotate-45 rounded-sm" /></div>
                        <div className="flex flex-col items-start w-full max-w-[75%]">
                          <div className="px-5 py-4 rounded-2xl bg-[#141414] shadow-2xl rounded-tl-none border border-gray-800/50"><div className="flex flex-col gap-3 w-40"><div className="h-2.5 bg-gray-800/60 rounded-full w-3/4" /><div className="h-2.5 bg-gray-800/60 rounded-full w-full" /></div></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-[#141414] border-t border-gray-800/60 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <ChatInput 
                  onSendMessage={(text: string) => handleSendMessage(text)} 
                  isSending={isThinking} 
                  onStop={handleStopExecution} 
                  selectedFile={selectedFile}
                  onFileSelect={(file: File | null) => setSelectedFile(file)}
                />
              </div>
            </div>

            {/* FULLSCREEN OVERLAY COMPONENT */}
            <ArtifactPanel 
              activeArtifact={activeArtifact}
              onClose={() => setActiveArtifact(null)}
              isEditing={isArtifactEditing}
              setIsEditing={setIsArtifactEditing}
              draft={artifactDraft}
              setDraft={setArtifactDraft}
              onSave={handleSaveArtifact}
              isSaving={isArtifactSaving}
              showSuccess={showSaveSuccess}
            />

          </main>
        </div>
      </div>
    </div>
  );
}