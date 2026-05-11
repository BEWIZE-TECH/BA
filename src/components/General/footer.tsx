'use client';

import React from 'react';
import Link from 'next/link';
import { Disc } from 'lucide-react';

export default function Footer() {
  const topLinks = [
    {
      links: [
        { name: "Careers", badge: "Hiring" },
        { name: "Contact" },
        { name: "Merch" },
        { name: "Join user tests, get a gift" },
        { name: "Events" },
        { name: "Brand Guideline" },
      ]
    },
    {
      links: [
        { name: "Case Studies" },
        { name: "BIWIZE vs Cloud RAG" },
        { name: "Local vs Hosted" },
        { name: "Press" },
        { name: "Legal" },
        { name: "AI benchmark" },
      ]
    },
    {
      links: [
        { name: "Affiliate program" },
        { name: "Become an expert" },
        { name: "Hire an expert" },
        { name: "Tools" },
        { name: "AI agent report" },
      ]
    }
  ];

  const directoryLinks = [
    {
      title: "Popular integrations", 
      links: ["Llama 3 Local", "Mistral Instruct", "Gemma 7B", "Phi-3 Mini", "ChromaDB Core", "Ollama Engine"]
    },
    {
      title: "Trending combinations",
      links: ["Slack to Vector", "PDF to Knowledge", "GitHub and Jira Sync", "Asana to Agent", "Email Triage", "Confluence Sync"]
    },
    {
      title: "Top integration categories",
      links: ["Local Ingestion", "Agentic Reasoning", "Cybersecurity", "Data & Storage", "Validation Logic", "Self-Correction"]
    },
    {
      title: "Trending templates",
      links: ["Creating an API endpoint", "Local AI agent chat", "Scrape and summarize", "Joining different datasets", "Back Up Workflows", "Very quick quickstart"]
    },
    {
      title: "Top guides",
      links: ["Telegram bots", "Open-source chatbot", "Open-source LLM", "VPC Deployment", "Cloud alternatives", "Docker vs Native"]
    }
  ];

  function BiwizeLogo() {
    return (
      <div className="relative h-9 w-9 flex items-center justify-center group/logo shrink-0">
        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl group-hover/logo:bg-blue-500/20 transition-colors duration-500" />
        <div className="absolute inset-0 animate-[spin_8s_linear_infinite] opacity-20 group-hover/logo:opacity-40 transition-opacity">
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-blue-400 fill-none stroke-[2]">
            <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
          </svg>
        </div>
        <div className="absolute h-5 w-5 border border-blue-400/50 rotate-45 animate-[spin_4s_linear_infinite_reverse] group-hover/logo:border-white transition-colors duration-500" />
        <div className="absolute h-5 w-5 border border-blue-500/50 -rotate-12 group-hover/logo:rotate-12 transition-transform duration-700" />
        <div className="relative h-2 w-2 bg-white rounded-[2px] shadow-[0_0_15px_rgba(255,255,255,0.8)]">
          <div className="absolute inset-0 bg-white rounded-[1px] animate-ping opacity-50" />
        </div>
      </div>
    );
  }

  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-24 pb-12 relative overflow-hidden font-sans selection:bg-blue-500/30">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-[20%] w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_4px_1px_rgba(255,255,255,0.5)]" />
        <div className="absolute top-[30%] left-[45%] w-1 h-1 bg-white rounded-full opacity-50" />
        <div className="absolute top-[15%] right-[30%] w-0.5 h-0.5 bg-white rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-24">
          <div className="md:col-span-12 lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 group/brand min-w-fit mb-4">
              <BiwizeLogo />
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-widest text-white leading-none">
                  BIWIZE
                </span>
              </div>
            </Link>

            <p className="text-[#9CA3AF] text-[15px] mb-8 font-light">
              Intelligence without limits.
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Twitter">
                <span className="text-[20px]">🐦</span>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="GitHub">
                <span className="text-[20px]">🐙</span>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Disc size={20} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <span className="text-[20px]">💼</span>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="YouTube">
                <span className="text-[20px]">▶️</span>
              </a>
            </div>
          </div>
          <div className="md:col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 pt-2">
            {topLinks.map((section, idx) => (
              <div key={idx}>
                <ul className="space-y-4 text-[14px]">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx} className="flex items-center">
                      <a href="#" className="text-[#9CA3AF] hover:text-white transition-colors font-light">
                        {link.name}
                      </a>
                      {link.badge && (
                        <span className="ml-3 bg-white text-black text-[11px] font-semibold px-2.5 py-0.5 rounded-full tracking-wide">
                          {link.badge}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-[#1F1B24] pt-16 pb-20 grid grid-cols-2 lg:grid-cols-5 gap-8">
          {directoryLinks.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-white text-[14px] font-medium mb-6">{section.title}</h4>
              <ul className="space-y-4 text-[14px]">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a href="#" className="text-[#9CA3AF] hover:text-white transition-colors font-light">
                      {link}
                    </a>
                  </li>
                ))}
                <li className="pt-2">
                  <a href="#" className="text-[#9CA3AF] hover:text-white transition-colors font-light underline underline-offset-4 decoration-[#3A324B] hover:decoration-white">
                    Show more
                  </a>
                </li>
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[#1F1B24] pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[14px] text-[#9CA3AF] font-light">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2">
            <a href="#" className="hover:text-white transition-colors">Imprint</a>
            <span className="text-[#3A324B]">|</span>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <span className="text-[#3A324B]">|</span>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <span className="text-[#3A324B]">|</span>
            <a href="#" className="hover:text-white transition-colors">Report a vulnerability</a>
          </div>
          
          <div className="flex items-center gap-3">
            <span>© 2026 BIWIZE</span>
            <span className="text-[#3A324B]">|</span>
            <span>All rights reserved.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}