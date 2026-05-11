import React, { useEffect, useState, useMemo } from 'react';
import { 
  User, CheckCircle2, FileText, AlertTriangle, Download, 
  ThumbsUp, ThumbsDown, ExternalLink, Loader2, 
  Copy, Check, Clock, RefreshCw, Pin, Maximize2, Terminal, BarChart2
} from 'lucide-react';
import mermaid from 'mermaid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { marked } from 'marked';

mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose', fontFamily: 'monospace', themeVariables: { primaryColor: '#3b82f6', primaryTextColor: '#fff', lineColor: '#4b5563' } });

const copyToClipboard = async (text: string) => { try { await navigator.clipboard.writeText(text); return true; } catch (err) { return false; } };

const handleDownloadImage = async (url: string, filename: string) => {
  try {
    const response = await fetch(url); const blob = await response.blob(); const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = blobUrl; link.download = filename;
    document.body.appendChild(link); link.click(); document.body.removeChild(link); window.URL.revokeObjectURL(blobUrl);
  } catch (error) { window.open(url, '_blank'); }
};

export interface Message { 
  id: string; 
  sender: 'user' | 'assistant'; 
  type: 'text' | 'document' | 'image' | 'error' | 'mermaid' | 'markdown'; 
  content: any; 
  timestamp?: string; 
  isPinned?: boolean; 
  attachment?: { name: string; type: string }; 
}

interface ChatMessageProps { message: Message; onLogFeedback?: (messageId: string, type: 'up' | 'down', reason?: string) => void; onRegenerate?: (messageId: string) => void; onPinToggle?: (messageId: string) => void; onOpenArtifact?: (content: any, type: string) => void; }

const AdvancedFeedback = ({ messageId, onFeedback }: { messageId: string, onFeedback: (id: string, type: 'up' | 'down', reason?: string) => void }) => {
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);
  const [showReasons, setShowReasons] = useState(false);

  const handleVote = (type: 'up' | 'down') => {
    setVoted(type);
    if (type === 'down') setShowReasons(true);
    else { setShowReasons(false); onFeedback(messageId, 'up'); }
  };

  const handleReason = (reason: string) => { setShowReasons(false); onFeedback(messageId, 'down', reason); };

  return (
    <div className="relative flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/5">
      <button onClick={() => handleVote('up')} className={`p-1.5 rounded-md transition-all ${voted === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}><ThumbsUp size={14} /></button>
      <div className="w-px h-4 bg-white/10" />
      <div className="relative">
        <button onClick={() => handleVote('down')} className={`p-1.5 rounded-md transition-all ${voted === 'down' ? 'bg-red-500/20 text-red-400' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}><ThumbsDown size={14} /></button>
        {showReasons && (
          <div className="absolute bottom-full mb-3 left-0 w-48 bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2">
            <span className="text-[10px] text-gray-500 px-2 py-1 uppercase tracking-wider font-semibold">Flag Issue</span>
            {['Inaccurate Info', 'Formatting Error', 'Too Verbose', 'Other'].map(reason => (
              <button key={reason} onClick={() => handleReason(reason)} className="text-xs text-gray-300 hover:bg-gray-800 hover:text-white px-2 py-2 rounded-lg text-left transition-colors">{reason}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MermaidRenderer = ({ chart, onOpenArtifact }: { chart: string, onOpenArtifact?: (content: string, type: string) => void }) => {
  const [imgUrl, setImgUrl] = useState<string>(''); const [error, setError] = useState<boolean>(false);
  useEffect(() => { if (chart) { try { const payload = JSON.stringify({ code: chart, mermaid: { theme: "dark" } }); setImgUrl(`https://mermaid.ink/img/${btoa(unescape(encodeURIComponent(payload)))}`); setError(false); } catch (err) { setError(true); } } }, [chart]);

  if (error) return (
    <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl w-full">
      <p className="text-red-400 text-sm font-semibold mb-3 flex items-center gap-2"><AlertTriangle size={16} /> AI Syntax Error</p>
      <pre className="text-red-300/70 text-xs font-mono whitespace-pre-wrap bg-black/20 p-3 rounded-lg">{chart}</pre>
    </div>
  );

  return (
    <div className="rounded-2xl overflow-hidden bg-[#0a0a0a] border border-gray-800/60 group relative flex justify-center w-full min-h-[150px] transition-all hover:border-gray-700">
      {imgUrl ? (
        <>
          <img src={imgUrl} alt="Diagram" className="max-w-full h-auto cursor-zoom-in py-4 px-2 bg-white rounded-lg m-4" onClick={() => onOpenArtifact ? onOpenArtifact(`![Architecture Diagram](${imgUrl})`, 'diagram') : window.open(imgUrl, '_blank')} />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button onClick={() => handleDownloadImage(imgUrl, 'BIWIZE_Diagram.png')} className="p-2 bg-[#111] rounded-lg hover:bg-gray-800 border border-gray-700 transition-colors text-white" title="Download PNG"><Download size={14} /></button>
            {onOpenArtifact && <button onClick={() => onOpenArtifact(`![Architecture Diagram](${imgUrl})`, 'diagram')} className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 border border-blue-500/50 transition-colors text-white" title="Expand in Canvas"><Maximize2 size={14} /></button>}
          </div>
        </>
      ) : <div className="p-10 flex flex-col items-center justify-center gap-4 text-gray-500"><Loader2 className="animate-spin text-blue-500" size={24} /></div>}
    </div>
  );
};

// --- FIX: Self-contained local MarkdownRenderer ---
const MarkdownRenderer = ({ source, onOpenArtifact }: { source: string, onOpenArtifact?: (content: string, type: string) => void }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const handleCopyCode = (code: string) => { copyToClipboard(code); setCopiedCode(code); setTimeout(() => setCopiedCode(null), 2000); };
  
  // Scrubber for <thinking> blocks to prevent React crashes
  const cleanSource = source.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '').trim();

  return (
    <div className="prose prose-invert max-w-full text-[14px] leading-relaxed prose-p:mb-3 last:prose-p:mb-0 prose-p:text-current prose-headings:text-current prose-strong:text-current prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-pre:p-0 prose-pre:bg-transparent">
      <ReactMarkdown 
        children={cleanSource} 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeRaw]} 
        components={{
          table: ({ children, ...props }: any) => (<div className="w-full overflow-x-auto custom-scrollbar my-4 rounded-xl border border-white/10 bg-black/20"><table className="w-full text-left border-collapse" {...props}>{children}</table></div>),
          th: ({ children, ...props }: any) => (<th className="bg-black/40 p-3 text-[11px] uppercase tracking-wider font-semibold text-current border-b border-white/10" {...props}>{children}</th>),
          td: ({ children, ...props }: any) => (<td className="p-3 text-[13px] text-current border-b border-white/5 whitespace-normal min-w-[120px]" {...props}>{children}</td>),
          code: ({ inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || ''); 
            const language = match ? match[1] : ''; 
            const codeString = String(children).replace(/\n$/, '');
            if (inline) return <code className="px-1.5 py-0.5 rounded-md bg-white/10 text-current font-mono text-[12px] border border-white/5" {...props}>{children}</code>;
            return (
              <div className="relative group/code mt-3 mb-4 rounded-xl overflow-hidden bg-[#050505] border border-white/10">
                <div className="flex items-center justify-between bg-white/5 px-3 py-1.5 border-b border-white/10">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{language || 'code'}</span>
                  <div className="flex items-center gap-1">
                    {onOpenArtifact && <button onClick={() => onOpenArtifact(codeString, 'code')} className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] text-gray-400 hover:text-white hover:bg-white/10 transition-colors"><Terminal size={12} /> Canvas</button>}
                    <button onClick={() => handleCopyCode(codeString)} className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] text-gray-400 hover:text-white hover:bg-white/10 transition-colors">{copiedCode === codeString ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />} Copy</button>
                  </div>
                </div>
                <pre className="p-4 overflow-x-auto text-[12px] m-0 font-mono text-gray-300 leading-relaxed"><code className={className} {...props}>{children}</code></pre>
              </div>
            );
          }
        }}
      />
    </div>
  );
};

export function ChatMessage({ message, onLogFeedback, onRegenerate, onPinToggle, onOpenArtifact }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopyAll = () => { const textToCopy = typeof message.content === 'string' ? message.content : message.content.mermaid_code || JSON.stringify(message.content); copyToClipboard(textToCopy).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };

  const handleDownloadDoc = async () => {
    const textContent = message.content.raw || message.content;
    const filename = (message.content.name || 'BIWIZE_Document').replace('.md', '') + '.doc';
    const htmlBody = await marked.parse(textContent);
    
    const htmlContent = `<!DOCTYPE html>
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${filename}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.6; color: #000000; padding: 20px; }
          h1 { color: #2F5496; font-size: 20pt; border-bottom: 1px solid #2F5496; padding-bottom: 4px; margin-top: 24pt; }
          h2 { color: #2F5496; font-size: 16pt; margin-top: 18pt; }
          h3 { color: #1F3763; font-size: 14pt; margin-top: 14pt; }
          p { margin-bottom: 10pt; } ul, ol { margin-bottom: 10pt; padding-left: 20pt; }
          table { border-collapse: collapse; width: 100%; margin: 15px 0; font-size: 10pt; }
          th, td { border: 1px solid #A6A6A6; padding: 8px; text-align: left; vertical-align: top; }
          th { background-color: #D9E1F2; font-weight: bold; color: #1F3763; }
          tr:nth-child(even) { background-color: #F2F2F2; }
        </style>
      </head><body>${htmlBody}</body></html>`;
    
    const blob = new Blob(['\uFEFF', htmlContent], { type: 'application/msword;charset=utf-8' }); 
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); 
    a.href = url; 
    a.download = filename; 
    document.body.appendChild(a); 
    a.click(); 
    document.body.removeChild(a); 
    URL.revokeObjectURL(url);
  };

  const wordCount = useMemo(() => { const text = message.content?.raw || message.content || ""; if (typeof text !== 'string') return 0; return text.split(/\s+/).filter(word => word.length > 0).length; }, [message.content]);

  const renderContent = () => {
    switch (message.type) {
      case 'mermaid': return <MermaidRenderer chart={message.content?.mermaid_code || ""} onOpenArtifact={onOpenArtifact} />;
      case 'image': return (
        <div className="rounded-2xl overflow-hidden bg-[#050505] border border-white/5 group relative">
          <img src={message.content?.url} alt="BA Artifact" className="max-w-full h-auto min-h-[200px] object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
            <button onClick={() => handleDownloadImage(message.content?.url, 'BIWIZE_Snapshot.png')} className="p-3 bg-white text-black rounded-full hover:scale-105 transition-transform shadow-xl"><Download size={20} /></button>
            <button onClick={() => window.open(message.content?.url, '_blank')} className="p-3 bg-gray-800 text-white rounded-full hover:scale-105 transition-transform shadow-xl border border-white/10"><ExternalLink size={20} /></button>
          </div>
        </div>
      );
      case 'document': 
        return (
          <div className="flex flex-col gap-3 min-w-[320px] max-w-sm group/doc">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#0f0f0f] border border-gray-800/60 group-hover/doc:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
                <FileText size={22} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <span className="text-sm font-semibold text-gray-100 block truncate mb-1">{message.content?.name || 'Requirement Artifact'}</span>
                <span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                  <BarChart2 size={12}/> {wordCount} words • {Math.max(1, Math.ceil(wordCount/200))} min read
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onOpenArtifact && onOpenArtifact(message.content, 'document')} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs text-white transition-all font-semibold shadow-lg shadow-blue-600/20"><Maximize2 size={14} /> Open Panel</button>
              <button onClick={handleDownloadDoc} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-gray-800 text-xs text-white transition-all font-semibold border border-gray-800"><Download size={14} /> .DOC</button>
            </div>
          </div>
        );
      case 'markdown':
      case 'text': 
        return (
          <div className="flex flex-col">
            {message.attachment && (
              <div className="flex items-center gap-2.5 px-3 py-2 bg-black/20 rounded-xl border border-white/10 w-fit mb-3 shadow-inner">
                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                  <FileText className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <span className="text-[12px] font-medium text-gray-200 truncate max-w-[200px]">
                  {message.attachment.name}
                </span>
              </div>
            )}
            <MarkdownRenderer source={typeof message.content === 'string' ? message.content : String(message.content?.raw || JSON.stringify(message.content))} onOpenArtifact={onOpenArtifact} />
          </div>
        );
      default: return <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono bg-[#050505] border border-gray-800 p-4 rounded-xl">{JSON.stringify(message.content, null, 2)}</pre>;
    }
  };

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''} group/wrap mb-8 relative w-full`}>
      {message.isPinned && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-1 shadow-sm">
          <Pin size={10} className="fill-amber-400" /> Pinned Context
        </div>
      )}

      {!isUser && (
        <div className="w-9 h-9 rounded-full bg-[#0a0a0a] border border-gray-800 flex items-center justify-center shrink-0 mt-1 shadow-sm">
          <div className="w-2.5 h-2.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] rotate-45 rounded-sm" />
        </div>
      )}
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[75%]`}>
        
        <div className={`flex items-center gap-3 mb-2 px-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs font-semibold text-gray-400 tracking-wide">
            {isUser ? 'You' : 'BIWIZE Co-Pilot'}
          </span>
          <span className="text-[11px] text-gray-500 flex items-center gap-1 font-medium">
            <Clock size={10} /> {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
          </span>
          {!isUser && onPinToggle && (
            <button onClick={() => onPinToggle(message.id)} className={`text-[11px] flex items-center gap-1 transition-colors font-medium ${message.isPinned ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300 opacity-0 group-hover/wrap:opacity-100'}`}>
              <Pin size={10} /> {message.isPinned ? 'Unpin' : 'Pin'}
            </button>
          )}
        </div>

        <div className={`relative group/msg px-5 py-4 rounded-3xl ${
          isUser ? 'bg-blue-600 text-white rounded-br-sm shadow-md border border-blue-500/20' : 'bg-[#111111] rounded-bl-sm shadow-sm border border-white/5'
        }`}>
          {/* Action Menu (Floating) */}
          <div className={`absolute -top-3 flex items-center gap-1 opacity-0 group-hover/msg:opacity-100 transition-all duration-200 ${isUser ? '-left-4 -translate-x-full' : '-right-4 translate-x-full'}`}>
            {!isUser && (
              <button onClick={handleCopyAll} className="p-2 text-gray-400 hover:text-white bg-[#1a1a1a] border border-gray-800 rounded-lg hover:bg-gray-800 shadow-xl backdrop-blur-md" title="Copy Response">
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            )}
          </div>
          
          {renderContent()}
        </div>
        
        {/* Footer Actions */}
        {!isUser && message.type !== 'error' && (
          <div className="flex flex-wrap items-center gap-3 mt-3 px-2">
            {onLogFeedback && <AdvancedFeedback messageId={message.id} onFeedback={onLogFeedback} />}
            {onRegenerate && (
              <button onClick={() => onRegenerate(message.id)} className="text-xs text-gray-500 hover:text-blue-400 flex items-center gap-1.5 font-medium transition-colors bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 hover:bg-white/10">
                <RefreshCw size={12} /> Regenerate
              </button>
            )}
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="w-9 h-9 rounded-full bg-[#0a0a0a] border border-gray-800 flex items-center justify-center shrink-0 mt-1 shadow-sm">
          <User size={16} className="text-gray-400" />
        </div>
      )}
    </div>
  );
}