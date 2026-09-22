'use client';

import React, { useState } from 'react';
import { MessageAttachment } from '@/data/chatData';
import { Download, FileText, Image } from 'lucide-react';

interface AttachmentPreviewProps {
  attachment: MessageAttachment;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AttachmentPreview({ attachment }: AttachmentPreviewProps) {
  const [imgError, setImgError] = useState(false);

  if (attachment.isImage && !imgError) {
    return (
      <div className="mt-2 max-w-xs rounded-xl overflow-hidden border border-[#1e2d24] group relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={attachment.fileUrl}
          alt={attachment.fileName}
          className="w-full h-auto max-h-64 object-cover"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <a
            href={attachment.fileUrl}
            download={attachment.fileName}
            className="p-2 bg-[#121815]/90 rounded-lg text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
        <div className="px-2 py-1 bg-[#0d1310] text-[10px] text-[#9ca3af] flex items-center justify-between">
          <span className="truncate max-w-[180px]">{attachment.fileName}</span>
          <span>{formatBytes(attachment.fileSize)}</span>
        </div>
      </div>
    );
  }

  // Generic file card
  return (
    <div className="mt-2 flex items-center gap-3 bg-[#0f1712] border border-[#1b2620] rounded-xl px-3 py-2.5 max-w-xs group">
      <div className="w-9 h-9 rounded-lg bg-[#1b3028] text-[#2dd4bf] flex items-center justify-center shrink-0">
        {attachment.isImage ? <Image className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-white truncate">{attachment.fileName}</p>
        <p className="text-[10px] text-[#9ca3af]">{formatBytes(attachment.fileSize)}</p>
      </div>
      <a
        href={attachment.fileUrl}
        download={attachment.fileName}
        className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1a2620] opacity-0 group-hover:opacity-100 transition-all"
      >
        <Download className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
