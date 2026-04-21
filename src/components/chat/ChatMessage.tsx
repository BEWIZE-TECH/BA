import React, { useEffect, useRef, useState } from 'react';
import { User, CheckCircle2, FileText, AlertTriangle, Download, Share2, ThumbsUp, ThumbsDown, ExternalLink, Loader2 } from 'lucide-react';
import mermaid from 'mermaid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'monospace',
  themeVariables: {
    primaryColor: '#2563eb',
    primaryTextColor: '#fff',
    lineColor: '#4b5563',
  }
});

function BiwizeLogo() {
  return (
    <div className="relative h-11 w-11 flex items-center justify-center group/logo">
      <div className="absolute inset-0 bg-black-500/10 rounded-full blur-xl group-hover/logo:bg-black 500/20 transition-colors duration-500" />
      <div className="absolute inset-0 animate-[spin_8s_linear_infinite] opacity-20 group-hover/logo:opacity-40 transition-opacity">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-blue-400 fill-none stroke-[2]">
          <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
        </svg>
      </div>
      <div className="absolute h-7 w-7 border border-blue-400/50 rotate-45 animate-[spin_4s_linear_infinite_reverse] group-hover/logo:border-white transition-colors duration-500" />
      <div className="absolute h-7 w-7 border border-blue-500/50 -rotate-12 group-hover/logo:rotate-12 transition-transform duration-700" />
      <div className="relative h-3 w-3 bg-white rounded-[2px] shadow-[0_0_15px_rgba(255,255,255,0.8)]">
        <div className="absolute inset-0 bg-white rounded-[1px] animate-ping opacity-50" />
      </div>
    </div>
  );
}

const InlineFeedbackButtons = ({ messageId, onFeedback }: { messageId: string, onFeedback: (id: string, type: 'up' | 'down') => void }) => {
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);

  const handleVote = (type: 'up' | 'down') => {
    setVoted(type);
    onFeedback(messageId, type);
  };

  return (
    <div className="flex items-center gap-2 mt-2 opacity-60 hover:opacity-100 transition-opacity">
      <button 
        onClick={() => handleVote('up')}
        className={`p-1.5 rounded-md border transition-all ${voted === 'up' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-gray-800 text-gray-500 hover:border-gray-600'}`}
      >
        <ThumbsUp size={12} />
      </button>
      <button 
        onClick={() => handleVote('down')}
        className={`p-1.5 rounded-md border transition-all ${voted === 'down' ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-gray-800 text-gray-500 hover:border-gray-600'}`}
      >
        <ThumbsDown size={12} />
      </button>
    </div>
  );
};

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  type: 'text' | 'document' | 'image' | 'error' | 'mermaid' | 'markdown';
  content: any;
  timestamp?: string;
}

interface ChatMessageProps {
  message: Message;
  onLogFeedback?: (messageId: string, type: 'up' | 'down', toolType: string) => void;
  isDarkMode?: boolean;
}
const MermaidRenderer = ({ chart }: { chart: string }) => {
  const [imgUrl, setImgUrl] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (chart) {
      try {
        const payload = JSON.stringify({ 
          code: chart, 
          mermaid: { theme: "dark" } 
        });
        const base64Code = btoa(unescape(encodeURIComponent(payload)));

        setImgUrl(`https://mermaid.ink/img/${base64Code}`);
        setError(false);
      } catch (err) {
        console.error("Failed to encode Mermaid chart:", err);
        setError(true);
      }
    }
  }, [chart]);
  if (error) {
    return (
      <div className="bg-[#111] p-4 rounded-xl border border-red-500/30 w-full min-w-[300px]">
        <p className="text-red-400 text-xs font-bold mb-3 flex items-center gap-2">
          <AlertTriangle size={14} /> AI Syntax Error
        </p>
        <div className="bg-black p-3 rounded-lg overflow-x-auto">
          <pre className="text-gray-400 text-[10px] font-mono leading-relaxed whitespace-pre-wrap">
            {chart}
          </pre>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-xl overflow-hidden border border-gray-800 bg-[#0a0a0a] group relative flex justify-center w-full">
      {imgUrl ? (
        <>
          <img 
            src={imgUrl} 
            alt="Generated Architecture" 
            className="max-w-full h-auto transition-opacity cursor-zoom-in" 
            onClick={() => window.open(imgUrl, '_blank')} 
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <a href={imgUrl} download="BIWIZE_Flowchart.png" className="p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg hover:bg-blue-600 transition-colors">
              <Download size={14} className="text-white" />
            </a>
          </div>
        </>
      ) : (
        <div className="p-8 flex flex-col items-center justify-center gap-3 text-gray-500">
           <Loader2 className="animate-spin" size={24} />
           <span className="text-xs uppercase tracking-widest font-light">Rendering Image...</span>
        </div>
      )}
    </div>
  );
};

const MarkdownRenderer = ({ source }: { source: string }) => {
  return (
    <div className="prose prose-invert max-w-full text-sm leading-relaxed">
      <ReactMarkdown
        children={source}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ node, ...props }: any) => (
            <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline" />
          ),
          code: ({ inline, className, children, ...props }: any) => {
            if (inline) return <code className="px-1 rounded bg-gray-800/40" {...props}>{children}</code>;
            return (
              <pre className="bg-[#0b0b0b] rounded-md p-3 overflow-x-auto text-xs"><code className={className} {...props}>{children}</code></pre>
            );
          }
        }}
      />
    </div>
  );
};

export function ChatMessage({ message, onLogFeedback }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const handleDocumentAction = (action: 'download' | 'view') => {
    const content = typeof message.content === 'string' ? message.content : (message.content.raw || JSON.stringify(message.content));
    
    if (action === 'download') {
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = message.content.name || 'BIWIZE_Requirement.md';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } else {
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${message.content.name || 'BIWIZE Requirement Document'}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
            <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
            <style>
                body { background-color: #f3f4f6; padding: 2rem 1rem; font-family: ui-sans-serif, system-ui, sans-serif; }
                .doc-container { max-width: 850px; margin: 0 auto; background: white; padding: 4rem; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1); }
                /* Ensure tables look good */
                table { width: 100%; border-collapse: collapse; margin-top: 1em; margin-bottom: 1em; }
                th, td { border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left; }
                th { background-color: #f9fafb; }
                /* Print styles so BAs can print to PDF nicely */
                @media print { 
                    body { background: white; padding: 0; } 
                    .doc-container { box-shadow: none; padding: 0; max-width: 100%; } 
                }
            </style>
        </head>
        <body>
            <div class="doc-container">
                <article class="prose prose-slate prose-blue max-w-none" id="content">
                    Loading document...
                </article>
            </div>
            <script>
                // Safely inject and parse the markdown content
                const rawMarkdown = ${JSON.stringify(content)};
                document.getElementById('content').innerHTML = marked.parse(rawMarkdown);
            </script>
        </body>
        </html>
      `;
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
  };

  const renderContent = () => {
    const isLikelyMarkdown = (text: string) => {
      if (!text || typeof text !== 'string') return false;
      const mdIndicators = [/^\s*#/m, /```/, /\[[^\]]+\]\([^\)]+\)/, /\*\w+\*/m, /^\s*-\s+/m, /^\s*\d+\./m, /^>+/m];
      return mdIndicators.some((re) => re.test(text));
    };

    switch (message.type) {
      case 'mermaid':
        return (
          <div className="flex flex-col gap-3 min-w-[300px] md:min-w-[450px]">
            <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1.5 px-1 pb-1">
              <CheckCircle2 size={10} className="text-emerald-500/70" /> Live Logic Render
            </span>
            <MermaidRenderer chart={message.content.mermaid_code} />
          </div>
        );

      case 'image':
        return (
          <div className="flex flex-col gap-3">
            <div className="rounded-xl overflow-hidden border border-gray-800 bg-[#0a0a0a] group relative">
              <img src={message.content.url} alt="Architecture" className="max-w-full h-auto min-h-[150px] transition-opacity cursor-zoom-in" onClick={() => window.open(message.content.url, '_blank')} />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <a href={message.content.url} download className="p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg hover:bg-blue-600">
                  <Download size={14} className="text-white" />
                </a>
              </div>
            </div>
          </div>
        );

      case 'document':
        return (
          <div className="flex flex-col gap-3 min-w-[280px]">
            <div className="flex items-center gap-3 p-4 border border-gray-800 rounded-xl bg-[#0a0a0a]">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-200 block truncate">
                  {message.content.name || 'BIWIZE_Requirement.md'}
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Markdown Artifact</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleDocumentAction('view')}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-gray-800 hover:bg-gray-800 text-xs text-gray-300 transition-colors"
              >
                <ExternalLink size={12} /> Open
              </button>
              <button 
                onClick={() => handleDocumentAction('download')}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs text-white transition-colors"
              >
                <Download size={12} /> Download
              </button>
            </div>
          </div>
        );

      case 'text':
        {
          const textContent = typeof message.content === 'string' ? message.content : String(message.content);
          if (isLikelyMarkdown(textContent)) {
            return <MarkdownRenderer source={textContent} />;
          }
          return <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{textContent}</p>;
        }

      case 'markdown':
        return <MarkdownRenderer source={typeof message.content === 'string' ? message.content : String(message.content)} />;

      default:
        return <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>;
    }
  };

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''} group`}>
      {!isUser && (
        <div className="w-10 h-10 rounded-full border border-gray-800 bg-[#111] flex items-center justify-center shrink-0">
          <div className="w-2.5 h-2.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] rotate-45" />
        </div>
      )}
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-5 py-4 rounded-2xl ${
          isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-[#141414] border border-gray-800 rounded-bl-none shadow-xl'
        } max-w-sm md:max-w-xl`}>
          {renderContent()}
        </div>
        
        {!isUser && message.type !== 'error' && onLogFeedback && (
          <InlineFeedbackButtons 
            messageId={message.id} 
            onFeedback={(id, type) => onLogFeedback?.(id, type, message.type)} 
          />
        )}
      </div>

      {isUser && (
        <div className="w-10 h-10 rounded-full border border-gray-800 bg-[#111] flex items-center justify-center shrink-0">
          <User size={18} className="text-gray-400" />
        </div>
      )}
    </div>
  );
}  