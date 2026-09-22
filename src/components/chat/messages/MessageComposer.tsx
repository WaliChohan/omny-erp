'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useChatStore } from '@/context/ChatContext';
import EmojiPicker from '@/components/chat/shared/EmojiPicker';
import MentionPopover, { MentionSuggestion } from '@/components/chat/shared/MentionPopover';
import {
  Send,
  Paperclip,
  SmilePlus,
  Bold,
  Italic,
  Code,
  List,
  X,
} from 'lucide-react';

interface MessageComposerProps {
  channelId: string;
  threadOf?: string;
  placeholder?: string;
}

export default function MessageComposer({ channelId, threadOf, placeholder }: MessageComposerProps) {
  const { sendMessage, setTyping } = useChatStore();
  const [content, setContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentionPopover, setShowMentionPopover] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-resize textarea
  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    adjustHeight();

    // Typing indicator
    setTyping(channelId, true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setTyping(channelId, false), 2000);

    // @mention detection
    const cursor = e.target.selectionStart;
    const textBefore = val.slice(0, cursor);
    const atMatch = /@(\w*)$/.exec(textBefore);
    if (atMatch) {
      setMentionQuery(atMatch[1]);
      setShowMentionPopover(true);
    } else {
      setShowMentionPopover(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') {
      setShowMentionPopover(false);
      setShowEmojiPicker(false);
    }
  };

  const handleSend = () => {
    if (!content.trim() && pendingFiles.length === 0) return;
    sendMessage(channelId, content.trim(), threadOf);
    setContent('');
    setPendingFiles([]);
    setTyping(channelId, false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleMentionSelect = (suggestion: MentionSuggestion) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const cursor = ta.selectionStart;
    const textBefore = content.slice(0, cursor);
    const textAfter = content.slice(cursor);
    const atIdx = textBefore.lastIndexOf('@');
    const mentionToken = `@[${suggestion.label}](${suggestion.type}:${suggestion.id})`;
    const newContent = textBefore.slice(0, atIdx) + mentionToken + ' ' + textAfter;
    setContent(newContent);
    setShowMentionPopover(false);
    setTimeout(() => {
      ta.focus();
      const newCursor = atIdx + mentionToken.length + 1;
      ta.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  const insertFormat = (prefix: string, suffix: string = prefix, placeholder = 'text') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const newContent = content.slice(0, start) + prefix + selected + suffix + content.slice(end);
    setContent(newContent);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setPendingFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    e.target.value = '';
  };

  const defaultPlaceholder = placeholder ??
    (threadOf ? 'Reply in thread…' : 'Message the channel… (Enter to send, Shift+Enter for new line)');

  return (
    <div className="px-4 pb-4 shrink-0">
      {/* Pending attachments */}
      {pendingFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 p-2 bg-[#111714] rounded-xl border border-[#1b2620]">
          {pendingFiles.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 bg-[#1b2820] px-2.5 py-1 rounded-lg text-xs text-[#9ca3af]"
            >
              <Paperclip className="w-3 h-3 text-[#2dd4bf]" />
              <span className="max-w-[120px] truncate">{f.name}</span>
              <button
                onClick={() => setPendingFiles((prev) => prev.filter((_, j) => j !== i))}
                className="text-[#6b7280] hover:text-white ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Composer card */}
      <div className="bg-[#111714] border border-[#1e2d24] rounded-xl focus-within:border-[#2dd4bf]/50 transition-colors overflow-hidden">
        {/* Formatting toolbar */}
        <div className="flex items-center gap-0.5 px-3 pt-2 pb-1 border-b border-[#1a2620]">
          {[
            { icon: Bold, label: 'Bold', action: () => insertFormat('**') },
            { icon: Italic, label: 'Italic', action: () => insertFormat('_') },
            { icon: Code, label: 'Code', action: () => insertFormat('`') },
            { icon: List, label: 'List', action: () => insertFormat('• ', '') },
          ].map(({ icon: Icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              title={label}
              className="p-1 rounded text-[#6b7280] hover:text-white hover:bg-[#1a2620] transition-colors"
            >
              <Icon className="w-3 h-3" />
            </button>
          ))}
        </div>

        {/* Textarea */}
        <div className="relative px-3 pt-2">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={defaultPlaceholder}
            rows={1}
            maxLength={4000}
            className="w-full bg-transparent text-[#f3f4f6] text-xs leading-relaxed placeholder-[#6b7280] resize-none outline-none min-h-[36px]"
          />

          {/* Mention Popover */}
          {showMentionPopover && (
            <MentionPopover
              query={mentionQuery}
              onSelect={handleMentionSelect}
              onClose={() => setShowMentionPopover(false)}
            />
          )}

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <EmojiPicker
              onSelect={(emoji) => {
                setContent((prev) => prev + emoji);
                setShowEmojiPicker(false);
                textareaRef.current?.focus();
              }}
              onClose={() => setShowEmojiPicker(false)}
            />
          )}
        </div>

        {/* Bottom action bar */}
        <div className="flex items-center justify-between px-3 pt-1 pb-2">
          <div className="flex items-center gap-1">
            {/* Attachment */}
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Attach file"
              className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1a2620] transition-colors"
            >
              <Paperclip className="w-3.5 h-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* Emoji */}
            <button
              onClick={() => setShowEmojiPicker((v) => !v)}
              title="Add emoji"
              className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#fbbf24] hover:bg-[#1a2620] transition-colors"
            >
              <SmilePlus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Char count (shows when > 2000) */}
            {content.length > 2000 && (
              <span
                className={`text-[10px] font-mono ${
                  content.length > 3800 ? 'text-[#f43f5e]' : 'text-[#9ca3af]'
                }`}
              >
                {4000 - content.length}
              </span>
            )}

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!content.trim() && pendingFiles.length === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                content.trim() || pendingFiles.length > 0
                  ? 'bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] shadow-md shadow-[#2dd4bf]/20 hover:scale-105'
                  : 'bg-[#1b2820] text-[#4b5563] cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              {threadOf ? 'Reply' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
