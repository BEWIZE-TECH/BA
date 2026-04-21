"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Plus, FileText, ArrowRight, Loader2, X, Database, CheckCircle2, AlertTriangle } from 'lucide-react';

interface FileData {
  file: File;
  name: string;
  size: string;
}

export default function NewChatPage() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'embedding'>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const N8N_UPLOAD_WEBHOOK = "http://localhost:5678/webhook/ingest-document";

  const onDropzoneClick = () => fileInputRef.current?.click();

  const handleFiles = (incomingFiles: File[]) => {
    const allowedExtensions = ['.pdf', '.json', '.csv', '.txt'];
    const validFiles: File[] = [];
    const rejectedNames: string[] = [];

    incomingFiles.forEach(f => {
      const ext = f.name.slice((Math.max(0, f.name.lastIndexOf(".")) || Infinity)).toLowerCase();
      if (allowedExtensions.includes(ext)) {
        validFiles.push(f);
      } else {
        rejectedNames.push(f.name);
      }
    });

    if (rejectedNames.length > 0) {
      setUploadError(`Rejected: ${rejectedNames.join(', ')}. Only PDF, JSON, CSV, and TXT are accepted.`);
      setTimeout(() => setUploadError(null), 5000);
    }

    const newFiles = validFiles.map(f => ({
      file: f,
      name: f.name,
      size: (f.size / 1024).toFixed(1) + ' KB'
    }));

    setFiles(prev => {
      const existingNames = prev.map(p => p.name);
      const uniqueNewFiles = newFiles.filter(f => !existingNames.includes(f.name));
      return [...prev, ...uniqueNewFiles];
    });
    
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const startAnalysis = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setStatus('uploading');

    try {
      const formData = new FormData();
      files.forEach((fileData) => {
        formData.append('data', fileData.file); 
      });

      formData.append('action', 'ingest_artifacts');
      formData.append('sessionId', 'Sentinel_WS_01');
      formData.append('timestamp', new Date().toISOString());

      const response = await fetch(N8N_UPLOAD_WEBHOOK, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("n8n Ingestion Failed");

      setStatus('embedding');
      
      const newWorkspaceId = "node-" + Math.random().toString(36).substring(2, 11);
      router.push(`/chat/${newWorkspaceId}`);

    } catch (error) {
      console.error("Upload Error:", error);
      alert("Neural Link Failure: n8n ingestion pipeline unreachable.");
    } finally {
      setIsProcessing(false);
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 md:p-12 relative overflow-hidden font-sans selection:bg-blue-500/30">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      
      <header className="mb-12 text-center relative z-10 pt-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#161616] border border-gray-800 mb-6 shadow-lg">
          <Database className="text-blue-500 shadow-blue-500/50" size={20} />
        </div>
        <h1 className="text-3xl md:text-4xl tracking-[0.3em] font-light uppercase text-gray-200">
          Node <span className="text-blue-500 font-semibold">Ingestion</span>
        </h1>
        <p className="text-gray-500 text-xs mt-3 font-mono tracking-widest uppercase">Provide context artifacts for the neural engine</p>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 h-full flex flex-col">
          <input 
            type="file" 
            multiple 
            ref={fileInputRef} 
            accept=".pdf,.json,.csv,.txt"
            className="hidden" 
            onChange={(e) => handleFiles(Array.from(e.target.files || []))} 
          />
          <div 
            onClick={onDropzoneClick}
            onDragOver={handleDragOver} 
            onDragLeave={handleDragLeave}
            onDrop={handleFileDrop}
            className={`flex-1 flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-[2rem] p-12 text-center transition-all duration-300 cursor-pointer ${
              isDragging 
                ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_30px_rgba(37,99,235,0.15)] scale-[1.02]' 
                : 'border-gray-800 bg-[#141414] hover:border-gray-600 hover:bg-[#1a1a1a]'
            }`}
          >
            <motion.div 
              animate={{ y: isDragging ? -10 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-20 h-20 bg-[#0f0f0f] border border-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-xl"
            >
              <Upload className={`transition-colors duration-300 ${isDragging ? 'text-blue-400' : 'text-gray-500'}`} size={32} />
            </motion.div>
            <p className="text-xl font-light text-gray-300 mb-2">
              Drop artifacts here or <span className="text-blue-400 font-medium hover:text-blue-300 transition-colors">browse</span>
            </p>
            <p className="text-xs font-mono text-gray-600 uppercase tracking-wider">
              Supported structures: PDF, TXT, CSV, JSON
            </p>
          </div>

          <AnimatePresence>
            {uploadError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 border border-red-500/30 bg-red-500/10 rounded-xl flex items-start gap-3"
              >
                <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs font-mono text-red-300 leading-relaxed">{uploadError}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-5 flex flex-col bg-[#141414] border border-gray-800/80 rounded-[2rem] p-8 h-[400px] shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] pointer-events-none" />

          <div className="flex items-center justify-between mb-6 z-10 shrink-0">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 flex items-center gap-2">
              <FileText size={14} /> Artifact Queue
            </h2>
            <span className="text-xs font-mono text-gray-500 bg-[#0f0f0f] px-2 py-1 rounded-md border border-gray-800">
              {files.length} Nodes
            </span>
          </div>
     
          <div className="flex-1 overflow-y-auto max-h-[200px] mb-6 pr-2 space-y-3 z-10 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-700 transition-colors">
            <AnimatePresence>
              {files.map((fileData, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={`${fileData.name}-${i}`} 
                  className="flex items-center p-3 border border-gray-800/60 rounded-xl bg-[#0f0f0f] group hover:border-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center mr-3 border border-gray-800 shrink-0">
                     <CheckCircle2 size={14} className="text-emerald-500/70" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-300 truncate pr-4">{fileData.name}</span>
                    <span className="text-[10px] text-gray-600 font-mono">{fileData.size}</span>
                  </div>
                  <button 
                    onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                    className="p-2 bg-transparent hover:bg-red-500/10 rounded-lg transition-colors group-hover:opacity-100 opacity-50 shrink-0"
                  >
                    <X size={14} className="text-gray-500 hover:text-red-400 transition-colors" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {files.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-8">
                <div className="w-10 h-10 border border-gray-700 rounded-xl mb-3 flex items-center justify-center rotate-45">
                   <div className="w-3 h-3 bg-gray-700"></div>
                </div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Queue is empty</p>
              </div>
            )}
          </div>

          <button 
            disabled={files.length === 0 || isProcessing} 
            onClick={startAnalysis}
            className={`relative w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 uppercase tracking-widest text-[10px] font-bold z-10 overflow-hidden shrink-0 ${
              files.length > 0 
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] cursor-pointer' 
                : 'bg-[#0f0f0f] text-gray-600 border border-gray-800 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin text-blue-200" size={16} />
                {status === 'uploading' ? 'Ingesting Artifacts...' : 'Syncing Vector DB...'}
              </>
            ) : (
              <>
                Initialize Link <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}