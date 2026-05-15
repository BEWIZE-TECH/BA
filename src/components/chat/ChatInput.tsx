"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Plus, Send, X, Mic, FileText, Square } from "lucide-react";
import { AnimatePresence } from "framer-motion";

type ClassValue = string | number | boolean | null | undefined;
function cn(...inputs: ClassValue[]): string { return inputs.filter(Boolean).join(" "); }

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & { showArrow?: boolean }>(({ className, sideOffset = 4, showArrow = false, ...props }, ref) => ( <TooltipPrimitive.Portal><TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} className={cn("relative z-50 max-w-[280px] rounded-lg bg-[#1a1a1a] text-gray-200 border border-white/10 px-3 py-1.5 text-xs font-medium animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 shadow-xl", className)} {...props}>{props.children}{showArrow && <TooltipPrimitive.Arrow className="-my-px fill-[#1a1a1a]" />}</TooltipPrimitive.Content></TooltipPrimitive.Portal>));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStop?: () => void;
  isSending: boolean;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
}

export function ChatInput({ onSendMessage, onStop, isSending, selectedFile, onFileSelect }: ChatInputProps) {
  const internalTextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState("");

  React.useLayoutEffect(() => { 
    const textarea = internalTextareaRef.current; 
    if (textarea) { 
      textarea.style.height = "auto"; 
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`; 
      if (!isSending) textarea.focus();
    } 
  }, [value, isSending]); 

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value);
  const handlePlusClick = () => fileInputRef.current?.click();
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    const file = event.target.files?.[0]; 
    if (file) {
      onFileSelect(file); 
    }
    event.target.value = "";
  };
  
  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => { 
    e.stopPropagation(); 
    onFileSelect(null); 
    if(fileInputRef.current) fileInputRef.current.value = ""; 
  };

  const handleSend = () => {
    if (!value.trim() && !selectedFile) return;
    
    let finalMessage = value.trim();
    if (selectedFile && !finalMessage) {
      finalMessage = `Please analyze the attached document: ${selectedFile.name}`;
    }

    onSendMessage(finalMessage);
    setValue("");
 
    
    if (internalTextareaRef.current) internalTextareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isSending) handleSend();
    }
  };

  const hasValue = value.trim().length > 0 || selectedFile !== null;

  return (
    <div className="max-w-4xl w-full mx-auto p-2 relative z-20">
      <div className={cn(
        "flex flex-col rounded-2xl p-1.5 shadow-2xl transition-all duration-300 border backdrop-blur-xl",
        "bg-[#0f0f0f] border-white/10 hover:border-white/20 focus-within:border-blue-500/50",
        isSending ? "border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)] bg-[#111]" : ""
      )}>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.txt,.csv,image/*" />
        
        <AnimatePresence>
          {selectedFile && (
            <div className="relative group flex items-center gap-2.5 mx-3 mt-2 px-3 py-2 bg-white/5 w-fit rounded-xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 hover:border-blue-500/30 transition-colors">
              <div className="p-1.5 bg-blue-500/20 rounded-lg"><FileText className="h-3.5 w-3.5 text-blue-400" /></div>
              <span className="text-[12px] font-medium text-gray-300 truncate max-w-[200px]">{selectedFile.name}</span>
              <button onClick={handleRemoveFile} className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 border border-gray-600 text-gray-300 hover:bg-red-500 hover:border-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all shadow-xl"> 
                <X className="h-3 w-3" /> 
              </button> 
            </div>
          )}
        </AnimatePresence>

        <textarea 
          ref={internalTextareaRef} rows={1} value={value} onChange={handleInputChange} onKeyDown={handleKeyDown} disabled={isSending}
          placeholder={isSending ? "Processing..." : "Message BIWIZE Core..."} 
          className="custom-scrollbar w-full resize-none border-0 bg-transparent py-3 px-4 text-sm text-gray-200 placeholder:text-gray-600 focus:ring-0 focus-visible:outline-none min-h-[48px] disabled:opacity-50 font-sans leading-relaxed" 
        />

        <div className="px-2 pb-1.5 pt-0 flex justify-between items-center">
          <TooltipProvider delayDuration={50}>
            <div className="flex items-center gap-1">
              <Tooltip> 
                <TooltipTrigger asChild>
                  <button type="button" onClick={handlePlusClick} disabled={isSending} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:text-gray-200 transition-colors hover:bg-white/10 disabled:opacity-50">
                    <Plus className="h-5 w-5" />
                  </button>
                </TooltipTrigger> 
                <TooltipContent side="top" showArrow={true}><p>Attach Context Artifact</p></TooltipContent> 
              </Tooltip>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:text-gray-300 transition-colors hover:bg-white/5 disabled:opacity-50">
                    <Mic className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" showArrow={true}><p>Voice Dictation</p></TooltipContent>
              </Tooltip>

              {isSending ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" onClick={onStop} className="flex h-8 w-8 items-center justify-center rounded-lg transition-all focus-visible:outline-none bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                      <Square className="h-3.5 w-3.5 fill-current" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" showArrow={true}><p>Halt Execution</p></TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" onClick={handleSend} disabled={!hasValue} className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] disabled:bg-white/5 disabled:text-gray-600">
                      <Send className="h-4 w-4 ml-0.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" showArrow={true}><p>Transmit query</p></TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}