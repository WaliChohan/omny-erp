'use client';

import React, { useState } from 'react';
import SideDrawer from '@/components/ui/SideDrawer';
import { Sparkles, Send, Bot } from 'lucide-react';

interface AskAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AskAIModal({ isOpen, onClose }: AskAIModalProps) {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: 'Hello! I am your Omnysync AI Copilot. Ask me anything about your financial profit margins, customer satisfaction CSAT (4.7/5), chart of accounts balances, project progress, or Google Drive synced documents.',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userText = prompt;
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = '';
      const q = userText.toLowerCase();
      if (q.includes('revenue') || q.includes('profit')) {
        aiResponse =
          'Total revenue stands at $120,873 (+17% MoM). Operating profit margins are currently $8,132 (+12% vs last year). June was your highest profit month at $72,000.';
      } else if (q.includes('risk') || q.includes('student') || q.includes('team')) {
        aiResponse =
          'You currently have 5 records requiring attention: 2 critical (Ethan Brooks stalled 10 days, Zara Mitchell declining engagement), and 1 high-risk warning (Arafat Nayeem).';
      } else if (q.includes('ledger') || q.includes('balance') || q.includes('account')) {
        aiResponse =
          'Your Double-Entry General Ledger is currently balanced with zero discrepancy. Operating cash account has $64,500 and available wallet balance is $8,405.00.';
      } else {
        aiResponse = `Analyzing Omnysync data for "${userText}": All ERP modules, Google Drive cloud backups, and double-entry postings are operating normally. Let me know if you would like me to draft an SOW or financial summary report.`;
      }

      setMessages((prev) => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#6366f1]/20 text-[#818cf8] flex items-center justify-center border border-[#6366f1]/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Omnysync AI Assistant</h3>
            <p className="text-[11px] text-[#9ca3af]">Autonomous operational & financial intelligence</p>
          </div>
        </div>
      }
      footer={
        <div className="w-full space-y-2">
          {/* Quick query chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            <button
              type="button"
              onClick={() => setPrompt('Summarize our revenue and profit margins')}
              className="px-2.5 py-1 rounded-full bg-[#16211a] border border-[#213328] text-[#9ca3af] hover:text-white hover:border-[#2dd4bf] whitespace-nowrap transition-colors"
            >
              Profit margins summary
            </button>
            <button
              type="button"
              onClick={() => setPrompt('Who are the records at risk?')}
              className="px-2.5 py-1 rounded-full bg-[#16211a] border border-[#213328] text-[#9ca3af] hover:text-white hover:border-[#2dd4bf] whitespace-nowrap transition-colors"
            >
              At-risk alerts
            </button>
            <button
              type="button"
              onClick={() => setPrompt('Check General Ledger double-entry balance')}
              className="px-2.5 py-1 rounded-full bg-[#16211a] border border-[#213328] text-[#9ca3af] hover:text-white hover:border-[#2dd4bf] whitespace-nowrap transition-colors"
            >
              General ledger balance
            </button>
          </div>

          {/* Prompt Input */}
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask AI anything about your ERP..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] font-bold text-xs flex items-center gap-1 shadow-md shadow-[#2dd4bf]/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      }
    >
      {/* Message feed */}
      <div className="space-y-3 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#2dd4bf] text-[#052e24] font-semibold'
                  : 'bg-[#141d18] border border-[#23352a] text-[#e5e7eb]'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#141d18] border border-[#23352a] rounded-xl px-3 py-2 text-xs text-[#2dd4bf] animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>
    </SideDrawer>
  );
}
