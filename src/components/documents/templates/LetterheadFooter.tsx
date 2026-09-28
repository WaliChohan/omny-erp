'use client';

import React from 'react';
import { Phone, Mail, Globe } from 'lucide-react';

interface LetterheadFooterProps {
  pageNumber?: number;
  totalPages?: number;
}

export default function LetterheadFooter({
  pageNumber,
  totalPages,
}: LetterheadFooterProps) {
  return (
    <footer className="w-full mt-auto pt-4 px-8 pb-6 bg-white text-[#1e293b] select-none print:pt-2 print:pb-4">
      {/* Horizontal Rule Divider */}
      <div className="w-full border-t border-[#0B132B]/20 mb-4" />

      <div className="flex items-center justify-between text-xs font-semibold text-[#0B132B]">
        {/* Contact Info Items */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 hover:text-[#480CA8] transition-colors">
            <div className="w-5 h-5 rounded-full bg-[#0B132B] text-white flex items-center justify-center shrink-0">
              <Phone className="w-3 h-3" />
            </div>
            <span className="font-bold tracking-tight text-[11px]">+92 333 4444014</span>
          </div>

          <div className="flex items-center gap-2 hover:text-[#480CA8] transition-colors">
            <div className="w-5 h-5 rounded-full bg-[#0B132B] text-white flex items-center justify-center shrink-0">
              <Mail className="w-3 h-3" />
            </div>
            <span className="font-bold tracking-tight text-[11px]">omnysyncc@gmail.com</span>
          </div>

          <div className="flex items-center gap-2 hover:text-[#480CA8] transition-colors">
            <div className="w-5 h-5 rounded-full bg-[#0B132B] text-white flex items-center justify-center shrink-0">
              <Globe className="w-3 h-3" />
            </div>
            <span className="font-bold tracking-tight text-[11px]">www.omnysync.com</span>
          </div>
        </div>

        {/* Dynamic Page Number */}
        {pageNumber && (
          <div className="text-[11px] font-bold text-[#64748b]">
            Page {pageNumber} {totalPages ? `of ${totalPages}` : ''}
          </div>
        )}
      </div>
    </footer>
  );
}
