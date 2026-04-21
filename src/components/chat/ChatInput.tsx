"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { 
  Plus, Settings2, Send, X, Globe, Pen, Paintbrush, 
  Telescope, Mic, Loader2, FileText, CheckCircle2
} from "lucide-react";

type ClassValue = string | number | boolean | null | undefined;
function cn(...inputs: ClassValue[]): string { return inputs.filter(Boolean).join(" "); }

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & { showArrow?: boolean }>(({ className, sideOffset = 4, showArrow = false, ...props }, ref) => ( <TooltipPrimitive.Portal><TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} className={cn("relative z-50 max-w-[280px] rounded-md bg-[#1a1a1a] text-white border border-gray-800 px-2 py-1 text-xs animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className)} {...props}>{props.children}{showArrow && <TooltipPrimitive.Arrow className="-my-px fill-[#1a1a1a]" />}</TooltipPrimitive.Content></TooltipPrimitive.Portal>));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef<React.ElementRef<typeof PopoverPrimitive.Content>, React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>>(({ className, align = "center", sideOffset = 4, ...props }, ref) => ( <PopoverPrimitive.Portal><PopoverPrimitive.Content ref={ref} align={align} sideOffset={sideOffset} className={cn("z-50 w-64 rounded-xl bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-800 p-2 text-popover-foreground dark:text-white shadow-xl outline-none animate-in data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95", className)} {...props} /></PopoverPrimitive.Portal>));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
const toolsList = [ 
  { id: 'document', name: 'Draft Requirement Doc', shortName: 'Document', icon: Pen }, 
  { id: 'image', name: 'Render Architecture', shortName: 'Diagram', icon: Paintbrush }, 
  { id: 'General', name: 'General Analysis', shortName: 'General', icon: Globe }, 
  { id: 'stakeholder', name: 'Stakeholder View', shortName: 'Stakeholder', icon: Telescope }, 
];

const N8N_UPLOAD_WEBHOOK = "http://localhost:5678/webhook/ingest-document";
interface ChatInputProps {
  onSendMessage: (message: string, toolType?: string) => void;
  isSending: boolean;
}

export function ChatInput({ onSendMessage, isSending }: ChatInputProps) {
  const params = useParams();
  const sessionId = params.id as string;

  const internalTextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const [value, setValue] = React.useState("");
  const [selectedTool, setSelectedTool] = React.useState<string>("General");
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const [isUploading, setIsUploading] = React.useState(false);
  const [attachedFile, setAttachedFile] = React.useState<{name: string, type: string} | null>(null);
  React.useLayoutEffect(() => { 
    const textarea = internalTextareaRef.current; 
    if (textarea) { 
      textarea.style.height = "auto"; 
      const newHeight = Math.min(textarea.scrollHeight, 200); 
      textarea.style.height = `${newHeight}px`; 
    } 
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { setValue(e.target.value); };
  const handlePlusClick = () => { fileInputRef.current?.click(); };
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => { 
    const file = event.target.files?.[0]; 
    if (!file) return;

    setIsUploading(true);
    setAttachedFile(null);

    try {
      const reader = new FileReader(); 
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Data = reader.result;
        const response = await fetch(N8N_UPLOAD_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file_name: file.name,
            file_data: base64Data,
            sessionId: sessionId
          })
        });

        if (response.ok) {
          setAttachedFile({ name: file.name, type: file.type });
        } else {
          console.error("Failed to ingest document to BIWIZE ChromaDB.");
        }
        setIsUploading(false);
      };
    } catch (error) {
      console.error("Error reading file:", error);
      setIsUploading(false);
    } finally {
      event.target.value = "";
    }
  };
  
  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => { 
    e.stopPropagation(); 
    setAttachedFile(null); 
    if(fileInputRef.current) { fileInputRef.current.value = ""; } 
  };

  const handleSend = () => {
    if (!value.trim() && !attachedFile) return;
    let finalMessage = value;
    if (attachedFile && !value.trim()) {
      finalMessage = `Please analyze the document I just uploaded: ${attachedFile.name}`;
    }

    onSendMessage(finalMessage, selectedTool);
    setValue("");
    setAttachedFile(null);
    if (internalTextareaRef.current) {
        internalTextareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasValue = value.trim().length > 0 || attachedFile;
  const activeTool = selectedTool ? toolsList.find(t => t.id === selectedTool) : null;
  const ActiveToolIcon = activeTool?.icon;

  return (
    <div className="max-w-4xl w-full mx-auto p-4 relative z-20">
      <div className={cn(
        "flex flex-col rounded-[28px] p-2 shadow-sm transition-colors bg-white border border-gray-200 dark:bg-[#1a1a1a] dark:border-gray-800 cursor-text",
        (isSending || isUploading) ? "opacity-70 pointer-events-none" : "focus-within:border-blue-500/50"
      )}>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".pdf,.doc,.docx,.txt,.csv,image/*"
        />
        {isUploading && (
          <div className="flex items-center gap-2 mx-3 mt-2 mb-1 px-3 py-1.5 bg-blue-500/10 text-blue-500 w-fit rounded-lg text-xs font-mono">
            <Loader2 className="h-3 w-3 animate-spin" />
            Ingesting to Knowledge Base...
          </div>
        )}

        {attachedFile && !isUploading && (
          <div className="relative group flex items-center gap-2 mx-3 mt-2 mb-1 px-3 py-2 bg-gray-100 dark:bg-[#2a2a2a] w-fit rounded-xl border border-gray-200 dark:border-gray-700">
            {attachedFile.type.startsWith('image/') ? <Paintbrush className="h-4 w-4 text-blue-500" /> : <FileText className="h-4 w-4 text-blue-500" />}
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate max-w-[200px]">{attachedFile.name}</span>
              <span className="text-[9px] text-emerald-500 flex items-center gap-1"><CheckCircle2 className="h-2.5 w-2.5" /> Context Synced</span>
            </div>
            <button onClick={handleRemoveFile} className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"> 
              <X className="h-3 w-3" /> 
            </button> 
          </div>
        )}

        <textarea 
          ref={internalTextareaRef} 
          rows={1} 
          value={value} 
          onChange={handleInputChange} 
          onKeyDown={handleKeyDown}
          disabled={isSending || isUploading}
          placeholder="Message BIWIZE..." 
          className="custom-scrollbar w-full resize-none border-0 bg-transparent p-3 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0 focus-visible:outline-none min-h-[50px] disabled:opacity-50" 
        />

        <div className="mt-1 p-1 pt-0 flex justify-between items-center">
          <TooltipProvider delayDuration={100}>
            <div className="flex items-center gap-2">

              <Tooltip> 
                <TooltipTrigger asChild>
                  <button type="button" onClick={handlePlusClick} disabled={isUploading || isSending} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2a2a] disabled:opacity-50">
                    <Plus className="h-5 w-5" />
                  </button>
                </TooltipTrigger> 
                <TooltipContent side="top" showArrow={true}><p>Ingest Document to Context</p></TooltipContent> 
              </Tooltip>
  
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <button type="button" className="flex h-8 items-center gap-2 rounded-full px-3 py-1 text-sm text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2a2a]">
                        <Settings2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Mode</span>
                      </button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" showArrow={true}><p>Change Agent Mode</p></TooltipContent>
                </Tooltip>
                <PopoverContent side="top" align="start">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold px-2 pb-1">Routing Directives</span>
                    {toolsList.map(tool => ( 
                      <button key={tool.id} onClick={() => { setSelectedTool(tool.id); setIsPopoverOpen(false); }} className={`flex w-full items-center gap-2 rounded-md p-2 text-left text-sm transition-colors ${selectedTool === tool.id ? 'bg-blue-500/10 text-blue-500' : 'hover:bg-gray-100 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-gray-200'}`}> 
                        <tool.icon className="h-4 w-4" /> 
                        <span>{tool.name}</span> 
                      </button> 
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {activeTool && activeTool.id !== 'General' && (
                <>
                  <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
                  <button onClick={() => setSelectedTool("General")} className="flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors">
                    {ActiveToolIcon && <ActiveToolIcon className="h-3.5 w-3.5" />}
                    {activeTool.shortName}
                    <X className="h-3.5 w-3.5 ml-1 opacity-60 hover:opacity-100" />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2a2a]">
                    <Mic className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" showArrow={true}><p>Dictate requirements</p></TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    type="button" 
                    onClick={handleSend}
                    disabled={!hasValue || isSending || isUploading} 
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-200 dark:disabled:bg-[#2a2a2a] disabled:text-gray-400 dark:disabled:text-gray-500 shadow-sm"
                  >
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 ml-0.5" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" showArrow={true}><p>Send to BIWIZE</p></TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
      <div className="text-center mt-2 text-[10px] text-gray-500 font-mono tracking-wide">
        BIWIZE AI Co-Pilot • SHIFT+ENTER for new line
      </div>
    </div>
  );
}