// src/components/chat/ChatWindow.tsx
'use client';

import { useEffect, useRef } from 'react';
import { Message, ChatMessage } from './ChatMessage';


interface ChatWindowProps {
  messages: Message[];
  onLogFeedback: (messageId: string, type: 'up' | 'down', reason?: string) => void;
}

export function ChatWindow({ messages, onLogFeedback }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const N8N_UPLOAD_WEBHOOK = process.env.NEXT_PUBLIC_N8N_LOG_FEEDBACK_WEBHOOK;
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#0f0f0f] relative 
      [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent 
      [&::-webkit-scrollbar-thumb]:bg-gray-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-700 transition-colors">

      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center opacity-70 mt-[-10%]">
          <div className="w-16 h-16 border border-gray-800 rounded-2xl mb-6 flex items-center justify-center rotate-45 shadow-[0_0_30px_rgba(37,99,235,0.05)]">
            <div className="w-6 h-6 bg-gray-800 shadow-[0_0_15px_rgba(255,255,255,0.1)]"></div>
          </div>
          <h2 className="text-3xl font-light text-gray-300">How Can I Help You</h2>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8 pb-4">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              onLogFeedback={onLogFeedback} 
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}