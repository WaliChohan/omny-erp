'use client';

import React, { useState, useRef } from 'react';
import { ChatMessage } from '@/data/chatData';
import { useChatStore } from '@/context/ChatContext';
import UserAvatar from '@/components/chat/shared/UserAvatar';
import AttachmentPreview from '@/components/chat/shared/AttachmentPreview';
import EmojiPicker from '@/components/chat/shared/EmojiPicker';
import { SmilePlus, MessageSquare, Pin, PinOff, Pencil, Trash2, Check, X, FileText, Briefcase, CheckSquare, Hash, User } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  isThreadParent?: boolean;
  compact?: boolean; // for thread replies — no thread button
}

// ── Markdown-lite renderer ────────────────────────────────────────────────────
function renderContent(text: string): React.ReactNode[] {
  // Split by code blocks first
  const codeBlockRegex = /```([\s\S]*?)```/g;
  const parts: React.ReactNode[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Text before code block
    if (match.index > lastIdx) {
      parts.push(...renderInline(text.slice(lastIdx, match.index), parts.length));
    }
    // Code block
    parts.push(
      <pre
        key={`code-${match.index}`}
        className="my-2 bg-[#0a0f0d] border border-[#1b2620] rounded-lg px-3 py-2.5 text-[11px] font-mono text-[#2dd4bf] overflow-x-auto whitespace-pre-wrap"
      >
        {match[1].trim()}
      </pre>
    );
    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < text.length) {
    parts.push(...renderInline(text.slice(lastIdx), parts.length + 100));
  }

  return parts;
}

function renderInline(text: string, baseKey: number): React.ReactNode[] {
  // Split by lines
  return text.split('\n').flatMap((line, li) => {
    const nodes: React.ReactNode[] = [];
    if (li > 0) nodes.push(<br key={`br-${baseKey}-${li}`} />);

    // Bold **text**
    const boldRe = /\*\*(.*?)\*\*/g;
    // Italic _text_
    const italicRe = /_(.*?)_/g;
    // Inline code `text`
    const inlineCodeRe = /`([^`]+)`/g;
    // ERP mention pills @[label](type:id)
    const mentionRe = /@\[([^\]]+)\]\(([^:)]+):([^)]+)\)/g;

    // Combined regex approach for the line
    const combined = /(\*\*.*?\*\*|_.*?_|`[^`]+`|@\[[^\]]+\]\([^:)]+:[^)]+\))/g;
    let lIdx = 0;
    let lMatch: RegExpExecArray | null;

    while ((lMatch = combined.exec(line)) !== null) {
      // Plain text before match
      if (lMatch.index > lIdx) {
        nodes.push(
          <span key={`t-${baseKey}-${li}-${lIdx}`}>{line.slice(lIdx, lMatch.index)}</span>
        );
      }
      const token = lMatch[0];

      if (token.startsWith('**')) {
        nodes.push(
          <strong key={`b-${baseKey}-${li}-${lMatch.index}`} className="font-bold text-white">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('_')) {
        nodes.push(
          <em key={`i-${baseKey}-${li}-${lMatch.index}`} className="italic">
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith('`')) {
        nodes.push(
          <code
            key={`ic-${baseKey}-${li}-${lMatch.index}`}
            className="bg-[#0f1712] text-[#2dd4bf] border border-[#1b2620] rounded px-1 py-0.5 text-[11px] font-mono"
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith('@[')) {
        mentionRe.lastIndex = 0;
        const m = mentionRe.exec(token);
        if (m) {
          const [, label, type] = m;
          nodes.push(<ERPMentionChip key={`mention-${baseKey}-${li}-${lMatch.index}`} label={label} type={type} />);
        }
      }

      lIdx = lMatch.index + token.length;
    }

    if (lIdx < line.length) {
      nodes.push(<span key={`tail-${baseKey}-${li}`}>{line.slice(lIdx)}</span>);
    }

    return nodes;
  });
}
function ERPMentionChip({ label, type }: { label: string; type: string }) {
  const iconMap: Record<string, React.ElementType> = {
    user: User,
    channel: Hash,
    invoice: FileText,
    client: Briefcase,
    project: Briefcase,
    task: CheckSquare,
  };
  const colorMap: Record<string, string> = {
    user: 'bg-[#2dd4bf]/15 text-[#2dd4bf] border-[#2dd4bf]/30',
    channel: 'bg-[#9ca3af]/15 text-[#9ca3af] border-[#9ca3af]/30',
    invoice: 'bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/30',
    client: 'bg-[#a855f7]/15 text-[#a855f7] border-[#a855f7]/30',
    project: 'bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/30',
    task: 'bg-[#b8ff00]/15 text-[#b8ff00] border-[#b8ff00]/30',
  };
  const Icon = iconMap[type] ?? User;
  const colors = colorMap[type] ?? 'bg-[#2dd4bf]/15 text-[#2dd4bf] border-[#2dd4bf]/30';

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-semibold border ${colors}`}>
      <Icon className="w-2.5 h-2.5" />
      {label}
    </span>
  );
}

// Silence unused import warning
const _italicRe = null;
void _italicRe;
const italicRe = /_.*?_/g;
void italicRe;

// ── Main Component ────────────────────────────────────────────────────────────

export default function MessageBubble({ message, isThreadParent = false, compact = false }: MessageBubbleProps) {
  const {
    currentUser,
    getUserById,
    toggleReaction,
    pinMessage,
    deleteMessage,
    editMessage,
    setThreadMessageId,
  } = useChatStore();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const emojiButtonRef = useRef<HTMLButtonElement | null>(null);

  const sender = getUserById(message.senderId);
  const isMe = message.senderId === currentUser.id;

  const timeStr = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const dateStr = (() => {
    const d = new Date(message.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  })();

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent.trim() !== message.content) {
      editMessage(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  if (!sender) return null;

  return (
    <div
      className={`group flex items-start gap-3 px-4 py-1.5 hover:bg-[#111814] rounded-lg transition-colors ${
        message.isPinned ? 'border-l-2 border-[#fbbf24]/60 bg-[#1a1708]/30' : ''
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0 mt-0.5">
        <UserAvatar user={sender} size="md" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-baseline gap-2 mb-0.5 flex-wrap">
          <span
            className={`text-xs font-bold ${isMe ? 'text-[#d97706]' : 'text-white'}`}
          >
            {sender.name}
          </span>
          {isMe && (
            <span className="text-[10px] bg-[#d97706]/15 text-[#d97706] border border-[#d97706]/30 px-1.5 py-px rounded font-semibold">
              You
            </span>
          )}
          <span className="text-[10px] text-[#6b7280]">{dateStr} at {timeStr}</span>
          {message.isEdited && (
            <span className="text-[10px] text-[#6b7280] italic">(edited)</span>
          )}
          {message.isPinned && (
            <span className="text-[10px] bg-[#fbbf24]/15 text-[#fbbf24] border border-[#fbbf24]/30 px-1.5 py-px rounded font-semibold flex items-center gap-0.5">
              📌 Pinned
            </span>
          )}
        </div>

        {/* Message body */}
        {isEditing ? (
          <div className="mt-1 space-y-2">
            <textarea
              autoFocus
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSaveEdit(); }
                if (e.key === 'Escape') setIsEditing(false);
              }}
              rows={3}
              className="w-full bg-[#16211a] border border-[#2dd4bf] text-white text-xs px-3 py-2 rounded-lg outline-none resize-none"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] text-xs font-bold"
              >
                <Check className="w-3 h-3" /> Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#1a2620] text-[#9ca3af] hover:text-white text-xs"
              >
                <X className="w-3 h-3" /> Cancel
              </button>
              <span className="text-[10px] text-[#6b7280]">Enter to save · Esc to cancel</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-[#e5e7eb] leading-relaxed">
            {renderContent(message.content)}
          </div>
        )}

        {/* Attachments */}
        {message.attachments.map((att) => (
          <AttachmentPreview key={att.id} attachment={att} />
        ))}

        {/* Reactions bar */}
        {message.reactions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mt-1.5">
            {message.reactions.map((r) => {
              const iHaveReacted = r.userIds.includes(currentUser.id);
              return (
                <button
                  key={r.emoji}
                  onClick={() => toggleReaction(message.id, r.emoji)}
                  title={r.userIds.map((id) => getUserById(id)?.name ?? id).join(', ')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all hover:scale-105 ${
                    iHaveReacted
                      ? 'bg-[#2dd4bf]/20 border-[#2dd4bf]/50 text-[#2dd4bf]'
                      : 'bg-[#141e18] border-[#1e2d24] text-[#9ca3af] hover:border-[#2d4035] hover:text-white'
                  }`}
                >
                  <span>{r.emoji}</span>
                  <span className="text-[10px] font-bold">{r.userIds.length}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Thread reply count */}
        {!compact && (message.threadCount ?? 0) > 0 && !isThreadParent && (
          <button
            onClick={() => setThreadMessageId(message.id)}
            className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#2dd4bf] hover:text-[#5de0cd] font-semibold group/thread"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>
              {message.threadCount} {message.threadCount === 1 ? 'reply' : 'replies'}
            </span>
            <span className="text-[#6b7280] group-hover/thread:text-[#9ca3af] font-normal">
              · View thread
            </span>
          </button>
        )}
      </div>

      {/* Hover Action Toolbar */}
      {!isEditing && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-[#121815] border border-[#1e2d24] rounded-xl px-1.5 py-1 shadow-lg shrink-0 mt-0.5">
          {/* React */}
          <div className="relative">
            <button
              ref={emojiButtonRef}
              onClick={() => setShowEmojiPicker((v) => !v)}
              title="Add reaction"
              className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#fbbf24] hover:bg-[#1a2620] transition-colors"
            >
              <SmilePlus className="w-3.5 h-3.5" />
            </button>
            {showEmojiPicker && (
              <EmojiPicker
                onSelect={(emoji) => toggleReaction(message.id, emoji)}
                onClose={() => setShowEmojiPicker(false)}
                anchorRef={emojiButtonRef}
              />
            )}
          </div>

          {/* Thread */}
          {!compact && (
            <button
              onClick={() => setThreadMessageId(message.id)}
              title="Reply in thread"
              className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#2dd4bf] hover:bg-[#1a2620] transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Pin */}
          <button
            onClick={() => pinMessage(message.id, !message.isPinned)}
            title={message.isPinned ? 'Unpin message' : 'Pin message'}
            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#fbbf24] hover:bg-[#1a2620] transition-colors"
          >
            {message.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
          </button>

          {/* Edit (own messages only) */}
          {isMe && (
            <button
              onClick={() => { setEditContent(message.content); setIsEditing(true); }}
              title="Edit message"
              className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1a2620] transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete (own messages only) */}
          {isMe && (
            <button
              onClick={() => deleteMessage(message.id)}
              title="Delete message"
              className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#f43f5e] hover:bg-[#251717] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
