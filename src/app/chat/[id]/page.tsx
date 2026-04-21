"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toBase64 } from '@/lib/chatHelpers';

// Modular Components
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage, Message } from '@/components/chat/ChatMessage';

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
  const [projectName, setProjectName] = useState<string>("Initializing Secure Link...");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const N8N_CHAT_WEBHOOK = "http://localhost:5678/webhook/query-requirements";
  const N8N_FEEDBACK_WEBHOOK = "http://localhost:5678/webhook/log-feedback";


  useEffect(() => {
    const fetchHistory = async () => {
      if (!sessionId) return;
      setIsLoadingHistory(true);

      try {
        const { data: projData } = await supabase
          .from('projects')
          .select('name')
          .eq('id', sessionId)
          .single();

        if (projData) setProjectName(projData.name);
        const { data, error } = await supabase
          .from('chat_history')
          .select('id, message, session_id')
          .eq('session_id', sessionId)
          .order('id', { ascending: true }); 

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
              id: `db-${row.id}`, 
              sender: isUser ? 'user' : 'assistant',
              type: type,
              content: type === 'document' 
                ? { name: msgData.kwargs?.artifact_name || "Generated Document", raw: msgData.content } 
                : type === 'image' 
                  ? { url: msgData.kwargs.image_url } 
                  : type === 'mermaid'
                    ? { mermaid_code: msgData.kwargs.mermaid_code }
                    : msgData.content,
              timestamp: msgData.timestamp || new Date().toISOString(),
            };
          });
          setMessages(historicalMessages);
        } else {
          setMessages([{ 
            id: `init-${Date.now()}`,
            sender: 'assistant', 
            type: 'text',
            content: "Business Analyst AI is Active. How shall we proceed?", 
            timestamp: new Date().toISOString(),
          }]);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    
    fetchHistory();
  }, [sessionId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleLogFeedback = async (messageId: string, feedbackType: 'up' | 'down', toolType: string) => {
    try {
      await fetch(N8N_FEEDBACK_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, feedbackType, toolType, sessionId }),
      });
    } catch (error) {
      console.error("Feedback sync failed:", error);
    }
  };

  const handleSendMessage = async (contentStr: string, toolType?: string) => {
    const queryContent = contentStr || inputText || (selectedFile ? "Please analyze this attached document." : "");
    if (!queryContent && !selectedFile) return;
    if (isThinking) return;

    const userMsg: Message = { 
      id: `msg-${Date.now()}`,
      sender: 'user', 
      type: 'text',
      content: queryContent,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    await supabase.from('chat_history').insert([{
      session_id: sessionId,
      message: { 
        type: 'human', 
        content: userMsg.content,
        timestamp: new Date().toISOString()
      }
    }]);

    let base64File = null;
    let fileName = null;
    if (selectedFile) {
      base64File = await toBase64(selectedFile);
      fileName = selectedFile.name;
      setSelectedFile(null);
    }

    try {
      const response = await fetch(N8N_CHAT_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMsg.content,
          sessionId: sessionId, 
          file_data: base64File,
          file_name: fileName,
          mode: toolType || queryMode
        }),
      });

      if (!response.ok) throw new Error("Gateway Timeout");

      const data = await response.json();
      const aiResponse: Message = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        type: (data.type || 'text') as any, 
        content: data.type === 'document' 
          ? { name: data.content?.name || "BIWIZE_Requirement.md", raw: data.content?.raw } 
          : data.type === 'image' 
            ? { url: data.content?.url, name: data.content?.name } 
            : data.type === 'mermaid'
              ? { mermaid_code: data.content?.mermaid_code }
              : data.answer,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      await supabase.from('chat_history').insert([{
        session_id: sessionId,
        message: { 
          type: 'ai', 
          content: data.type === 'document' ? data.content?.raw : (data.answer || ""),
          timestamp: new Date().toISOString(),
          kwargs: { 
            image_url: data.type === 'image' ? data.content?.url : undefined, 
            is_artifact: data.type === 'document',
            artifact_name: data.content?.name || "BIWIZE_Requirement.md",
            mermaid_code: data.type === 'mermaid' ? data.content?.mermaid_code : undefined
          }
        }
      }]);

    } catch (error) {
      setMessages(prev => [...prev, { 
        id: `err-${Date.now()}`, 
        sender: 'assistant', 
        type: 'error', 
        content: "BIWIZE Neural Link interrupted. Check local n8n instance.", 
        timestamp: new Date().toISOString() 
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-[#0f0f0f] text-gray-900 dark:text-white transition-colors duration-300 font-sans" 
           onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        
        <ChatHeader isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} projectName={projectName} />
        
        <div className="flex flex-1 overflow-hidden relative">
          <AnimatePresence>
            {isDragging && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-blue-500/10 backdrop-blur-sm border-2 border-dashed border-blue-500 m-4 rounded-3xl">
                <div className="flex flex-col items-center gap-4 text-blue-500">
                  <UploadCloud size={64} className="animate-bounce" />
                  <span className="text-2xl font-light tracking-widest uppercase">Drop Project Artifact</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isSidebarOpen && <ChatSidebar />}
          
          <div className="flex-1 flex flex-col relative overflow-hidden h-full">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth">
              {isLoadingHistory ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
                  <Loader2 className="animate-spin w-6 h-6" />
                  <p className="text-[10px] uppercase tracking-[0.3em]">Restoring Neural Context</p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} onLogFeedback={handleLogFeedback} />
                  ))}
                  {isThinking && (
                    <div className="flex gap-4 items-center text-slate-500 italic text-sm font-light pl-4">
                      <Loader2 className="animate-spin" size={14} />
                      <span className="tracking-wider">Synthesizing Requirements...</span>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <ChatInput onSendMessage={handleSendMessage} isSending={isThinking} />
          </div>
        </div>
      </div>
    </div>
  );
}