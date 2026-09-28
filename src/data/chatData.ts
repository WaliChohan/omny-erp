// ─────────────────────────────────────────────────────────────────────────────
// OmnySync ERP Chat — Data Layer (Types + Mock Data)
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ────────────────────────────────────────────────────────────────────

export type ChannelType = 'public' | 'private' | 'dm';

export interface ChatUser {
  id: string;
  name: string;
  initials: string;
  avatarColor: string; // hex
  role: string;
  department: string;
  isOnline: boolean;
  isCurrentUser?: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  type: ChannelType;
  members: string[]; // user ids
  createdBy: string;
  createdAt: string;
  isArchived: boolean;
  // For DMs
  dmUserId?: string; // the other person's user id
}

export interface ERPMention {
  type: 'user' | 'channel' | 'invoice' | 'project' | 'task' | 'client';
  id: string;
  label: string;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileType: string; // MIME
  fileSize: number; // bytes
  fileUrl: string; // base64 or URL
  isImage: boolean;
}

export interface MessageReaction {
  emoji: string;
  userIds: string[];
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  content: string; // may contain markdown + @mention tokens
  threadOf?: string; // parent message id if this is a thread reply
  threadCount?: number; // # of replies on a parent
  isPinned: boolean;
  isEdited: boolean;
  reactions: MessageReaction[];
  attachments: MessageAttachment[];
  erpMentions: ERPMention[];
  createdAt: string; // ISO
  updatedAt: string;
}

// For BroadcastChannel sync events
export type ChatBroadcastEvent =
  | { type: 'NEW_MESSAGE'; message: ChatMessage }
  | { type: 'REACTION_UPDATE'; messageId: string; reactions: MessageReaction[] }
  | { type: 'TYPING'; channelId: string; userId: string; isTyping: boolean }
  | { type: 'PIN_MESSAGE'; messageId: string; isPinned: boolean }
  | { type: 'EDIT_MESSAGE'; messageId: string; content: string }
  | { type: 'DELETE_MESSAGE'; messageId: string };

// ── Mock Users ────────────────────────────────────────────────────────────────

export const CHAT_USERS: ChatUser[] = [
  {
    id: 'user-wali',
    name: 'Wali Chohan',
    initials: 'WC',
    avatarColor: '#d97706',
    role: 'CEO & Founder',
    department: 'Executive',
    isOnline: true,
    isCurrentUser: true,
  },
  {
    id: 'user-ahmed',
    name: 'Ahmed Raza',
    initials: 'AR',
    avatarColor: '#2dd4bf',
    role: 'Finance Manager',
    department: 'Finance',
    isOnline: true,
  },
  {
    id: 'user-sarah',
    name: 'Sarah Khan',
    initials: 'SK',
    avatarColor: '#a855f7',
    role: 'Sales Lead',
    department: 'Sales',
    isOnline: true,
  },
  {
    id: 'user-omar',
    name: 'Omar Farooq',
    initials: 'OF',
    avatarColor: '#f43f5e',
    role: 'Dev Engineer',
    department: 'Engineering',
    isOnline: false,
  },
  {
    id: 'user-zara',
    name: 'Zara Malik',
    initials: 'ZM',
    avatarColor: '#38bdf8',
    role: 'HR Manager',
    department: 'HR',
    isOnline: true,
  },
  {
    id: 'user-bilal',
    name: 'Bilal Sheikh',
    initials: 'BS',
    avatarColor: '#fbbf24',
    role: 'Operations Lead',
    department: 'Operations',
    isOnline: false,
  },
];

export const CURRENT_USER = CHAT_USERS.find((u) => u.isCurrentUser)!;

// ── Mock Channels ─────────────────────────────────────────────────────────────

export const INITIAL_CHANNELS: ChatChannel[] = [
  {
    id: 'ch-general',
    name: 'agency-ops',
    description: 'OMNYSYNC agency ops — clients, delivery, and blockers',
    type: 'public',
    members: CHAT_USERS.map((u) => u.id),
    createdBy: 'user-wali',
    createdAt: '2025-01-01T00:00:00Z',
    isArchived: false,
  },
  {
    id: 'ch-finance',
    name: 'billing',
    description: 'Quotes, invoices, payments, and retainers (agency billing)',
    type: 'public',
    members: ['user-wali', 'user-ahmed'],
    createdBy: 'user-wali',
    createdAt: '2025-01-02T00:00:00Z',
    isArchived: false,
  },
  {
    id: 'ch-sales',
    name: 'pipeline',
    description: 'CRM pipeline — HVAC & home-services leads and deals',
    type: 'public',
    members: ['user-wali', 'user-sarah'],
    createdBy: 'user-sarah',
    createdAt: '2025-01-02T00:00:00Z',
    isArchived: false,
  },
  {
    id: 'ch-dev',
    name: 'delivery',
    description: 'Project delivery — websites, software, SEO, and apps',
    type: 'private',
    members: ['user-wali', 'user-omar'],
    createdBy: 'user-omar',
    createdAt: '2025-01-03T00:00:00Z',
    isArchived: false,
  },
  {
    id: 'ch-hr',
    name: 'clients',
    description: 'Client account notes — CoolAir, ComfortZone, Apex, and more',
    type: 'private',
    members: ['user-wali', 'user-zara'],
    createdBy: 'user-zara',
    createdAt: '2025-01-03T00:00:00Z',
    isArchived: false,
  },
  // DMs
  {
    id: 'dm-ahmed',
    name: 'Ahmed Raza',
    description: '',
    type: 'dm',
    members: ['user-wali', 'user-ahmed'],
    createdBy: 'user-wali',
    createdAt: '2025-01-05T00:00:00Z',
    isArchived: false,
    dmUserId: 'user-ahmed',
  },
  {
    id: 'dm-sarah',
    name: 'Sarah Khan',
    description: '',
    type: 'dm',
    members: ['user-wali', 'user-sarah'],
    createdBy: 'user-wali',
    createdAt: '2025-01-05T00:00:00Z',
    isArchived: false,
    dmUserId: 'user-sarah',
  },
  {
    id: 'dm-zara',
    name: 'Zara Malik',
    description: '',
    type: 'dm',
    members: ['user-wali', 'user-zara'],
    createdBy: 'user-wali',
    createdAt: '2025-01-06T00:00:00Z',
    isArchived: false,
    dmUserId: 'user-zara',
  },
];

// ── Seed Messages ──────────────────────────────────────────────────────────────

const now = new Date();
const ts = (minutesAgo: number) =>
  new Date(now.getTime() - minutesAgo * 60 * 1000).toISOString();

export const SEED_MESSAGES: ChatMessage[] = [
  // ── #general ─────────────────────────────────────────────────────────────
  {
    id: 'msg-001',
    channelId: 'ch-general',
    senderId: 'user-wali',
    content:
      "Good morning team! 👋 Q3 results are in — we hit **$120,873 in total revenue**, up 17% MoM. Incredible work everyone. Let's keep the momentum for Q4.",
    isPinned: true,
    isEdited: false,
    reactions: [
      { emoji: '🎉', userIds: ['user-ahmed', 'user-sarah', 'user-zara'] },
      { emoji: '🔥', userIds: ['user-omar', 'user-bilal'] },
    ],
    attachments: [],
    erpMentions: [],
    threadCount: 3,
    createdAt: ts(120),
    updatedAt: ts(120),
  },
  {
    id: 'msg-002',
    channelId: 'ch-general',
    senderId: 'user-ahmed',
    content:
      'Fantastic numbers! Just finished posting the final **Journal Client JV-2025-031** to the General Ledger. All accounts reconcile with zero discrepancy. 📊',
    isPinned: false,
    isEdited: false,
    reactions: [{ emoji: '✅', userIds: ['user-wali'] }],
    attachments: [],
    erpMentions: [
      { type: 'client', id: 'cli-1', label: 'CoolAir Pros' },
    ],
    createdAt: ts(115),
    updatedAt: ts(115),
  },
  {
    id: 'msg-003',
    channelId: 'ch-general',
    senderId: 'user-sarah',
    content:
      'Sales team closed **3 enterprise deals** this week. Apex Logistics signed the SLA! 🏆 Check the pipeline — we are 82% to target.',
    isPinned: false,
    isEdited: false,
    reactions: [
      { emoji: '💪', userIds: ['user-wali', 'user-ahmed'] },
    ],
    attachments: [],
    erpMentions: [],
    createdAt: ts(110),
    updatedAt: ts(110),
  },
  {
    id: 'msg-004',
    channelId: 'ch-general',
    senderId: 'user-zara',
    content:
      'Reminder: **Town Hall meeting** is scheduled for Friday at 3 PM. All department heads please prepare a 5-min summary. Calendar invite sent. 📅',
    isPinned: false,
    isEdited: false,
    reactions: [{ emoji: '👍', userIds: ['user-wali', 'user-sarah', 'user-omar', 'user-bilal'] }],
    attachments: [],
    erpMentions: [],
    createdAt: ts(90),
    updatedAt: ts(90),
  },
  {
    id: 'msg-005',
    channelId: 'ch-general',
    senderId: 'user-omar',
    content:
      'Pushed the **Drive Sync microservice** to production at 11:00 AM. All contracts and SOWs are now backed up automatically. No more manual uploads! 🚀\n\n```bash\ndeployment: omnysync-drive-sync v2.1.4\nstatus: RUNNING ✓\nfiles synced: 247\n```',
    isPinned: false,
    isEdited: false,
    reactions: [{ emoji: '🚀', userIds: ['user-wali', 'user-ahmed'] }],
    attachments: [],
    erpMentions: [],
    createdAt: ts(60),
    updatedAt: ts(60),
  },
  {
    id: 'msg-006',
    channelId: 'ch-general',
    senderId: 'user-wali',
    content: '@channel — I have pinned the Q3 revenue announcement above. Everyone please make sure to share it with your department. Great work team! 💚',
    isPinned: false,
    isEdited: false,
    reactions: [],
    attachments: [],
    erpMentions: [{ type: 'channel', id: 'ch-general', label: '@channel' }],
    createdAt: ts(20),
    updatedAt: ts(20),
  },

  // ── Thread replies for msg-001 ────────────────────────────────────────────
  {
    id: 'msg-001-t1',
    channelId: 'ch-general',
    senderId: 'user-ahmed',
    content: 'Congrats to the whole team! The Finance module automated reporting saved us ~8 hours this quarter.',
    threadOf: 'msg-001',
    isPinned: false,
    isEdited: false,
    reactions: [],
    attachments: [],
    erpMentions: [],
    createdAt: ts(118),
    updatedAt: ts(118),
  },
  {
    id: 'msg-001-t2',
    channelId: 'ch-general',
    senderId: 'user-sarah',
    content: 'Sales pipeline automation was key. CRM integrations FTW 🎯',
    threadOf: 'msg-001',
    isPinned: false,
    isEdited: false,
    reactions: [{ emoji: '🎯', userIds: ['user-wali'] }],
    attachments: [],
    erpMentions: [],
    createdAt: ts(116),
    updatedAt: ts(116),
  },
  {
    id: 'msg-001-t3',
    channelId: 'ch-general',
    senderId: 'user-wali',
    content: 'Exactly why we built this platform. Onwards to Q4! 🏔️',
    threadOf: 'msg-001',
    isPinned: false,
    isEdited: false,
    reactions: [],
    attachments: [],
    erpMentions: [],
    createdAt: ts(114),
    updatedAt: ts(114),
  },

  // ── #finance ──────────────────────────────────────────────────────────────
  {
    id: 'msg-010',
    channelId: 'ch-finance',
    senderId: 'user-ahmed',
    content:
      'Wali, I need your sign-off on **Invoice INV-2025-088** before EOD. The client is following up for the 3rd time. Total value: **$14,500**.',
    isPinned: false,
    isEdited: false,
    reactions: [],
    attachments: [],
    erpMentions: [
      { type: 'invoice', id: 'INV-2025-088', label: 'INV-2025-088' },
    ],
    createdAt: ts(200),
    updatedAt: ts(200),
  },
  {
    id: 'msg-011',
    channelId: 'ch-finance',
    senderId: 'user-wali',
    content: 'Approved. Just signed off on it in the portal. Please post the **Payment Client PV-2025-088** once you receive the wire transfer. Thanks Ahmed.',
    isPinned: false,
    isEdited: false,
    reactions: [{ emoji: '✅', userIds: ['user-ahmed'] }],
    attachments: [],
    erpMentions: [
      { type: 'client', id: 'cli-2', label: 'HomeComfort HVAC' },
    ],
    createdAt: ts(195),
    updatedAt: ts(195),
  },
  {
    id: 'msg-012',
    channelId: 'ch-finance',
    senderId: 'user-ahmed',
    content:
      'Also attaching the **Q3 Bank Reconciliation summary**. Please review the highlighted discrepancy in Account 1010 — it is $240 off. I think it is a timing difference but need your confirmation.',
    isPinned: false,
    isEdited: false,
    reactions: [],
    attachments: [],
    erpMentions: [],
    threadCount: 0,
    createdAt: ts(180),
    updatedAt: ts(180),
  },
  {
    id: 'msg-013',
    channelId: 'ch-finance',
    senderId: 'user-ahmed',
    content:
      'Reminder: Monthly depreciation **JV-2025-044** is due by end of this week. I have the calculation ready — depreciation on plant machinery is **$3,200**.',
    isPinned: false,
    isEdited: false,
    reactions: [],
    attachments: [],
    erpMentions: [
      { type: 'client', id: 'cli-1', label: 'CoolAir Pros' },
    ],
    createdAt: ts(30),
    updatedAt: ts(30),
  },

  // ── #sales ────────────────────────────────────────────────────────────────
  {
    id: 'msg-020',
    channelId: 'ch-sales',
    senderId: 'user-sarah',
    content:
      '🎉 **DEAL CLOSED!** Apex Logistics signed the 12-month SLA worth **$84,000 ARR**. This is our biggest enterprise contract yet! CC-ing @Wali Chohan for the press release.',
    isPinned: true,
    isEdited: false,
    reactions: [
      { emoji: '🎉', userIds: ['user-wali', 'user-ahmed'] },
      { emoji: '💰', userIds: ['user-wali'] },
    ],
    attachments: [],
    erpMentions: [{ type: 'user', id: 'user-wali', label: 'Wali Chohan' }],
    createdAt: ts(300),
    updatedAt: ts(300),
  },
  {
    id: 'msg-021',
    channelId: 'ch-sales',
    senderId: 'user-wali',
    content:
      'Outstanding work Sarah! Let us schedule an onboarding kickoff for Apex within 2 weeks. I will create a project in the Projects Hub.',
    isPinned: false,
    isEdited: false,
    reactions: [{ emoji: '👏', userIds: ['user-sarah'] }],
    attachments: [],
    erpMentions: [],
    createdAt: ts(295),
    updatedAt: ts(295),
  },
  {
    id: 'msg-022',
    channelId: 'ch-sales',
    senderId: 'user-sarah',
    content:
      'New lead from LinkedIn: **TechCore Solutions** — mid-market, 200 employees, interested in Finance + HR modules. Adding to CRM pipeline. Estimated deal size: $24K.',
    isPinned: false,
    isEdited: false,
    reactions: [],
    attachments: [],
    erpMentions: [],
    createdAt: ts(45),
    updatedAt: ts(45),
  },

  // ── #dev-ops ──────────────────────────────────────────────────────────────
  {
    id: 'msg-030',
    channelId: 'ch-dev',
    senderId: 'user-omar',
    content:
      'Pushing hotfix for the ledger balance display bug. The issue was a floating-point rounding error in the double-entry calculation.\n\n```typescript\n// Before (buggy)\nconst balance = debit - credit;\n\n// After (fixed)\nconst balance = Math.round((debit - credit) * 100) / 100;\n```',
    isPinned: false,
    isEdited: false,
    reactions: [{ emoji: '🛠️', userIds: ['user-wali'] }],
    attachments: [],
    erpMentions: [],
    createdAt: ts(400),
    updatedAt: ts(400),
  },
  {
    id: 'msg-031',
    channelId: 'ch-dev',
    senderId: 'user-wali',
    content: 'Good catch Omar. Make sure to add a unit test for this edge case. Also, when can we ship the **Chat module**? Setting up the timeline now.',
    isPinned: false,
    isEdited: false,
    reactions: [],
    attachments: [],
    erpMentions: [],
    createdAt: ts(390),
    updatedAt: ts(390),
  },
  {
    id: 'msg-032',
    channelId: 'ch-dev',
    senderId: 'user-omar',
    content: 'Chat module is scoped. Architecture review is done. Should be live by end of sprint. 💪',
    isPinned: false,
    isEdited: false,
    reactions: [{ emoji: '🚀', userIds: ['user-wali'] }],
    attachments: [],
    erpMentions: [],
    createdAt: ts(385),
    updatedAt: ts(385),
  },

  // ── DM: Wali ↔ Ahmed ──────────────────────────────────────────────────────
  {
    id: 'msg-dm-a-1',
    channelId: 'dm-ahmed',
    senderId: 'user-ahmed',
    content: 'Hey Wali, quick question — do you want the Q3 Statement of Accounts sent to the board before or after the town hall on Friday?',
    isPinned: false,
    isEdited: false,
    reactions: [],
    attachments: [],
    erpMentions: [],
    createdAt: ts(50),
    updatedAt: ts(50),
  },
  {
    id: 'msg-dm-a-2',
    channelId: 'dm-ahmed',
    senderId: 'user-wali',
    content: 'Before please — send it by Thursday EOD so they have time to review. Thanks Ahmed!',
    isPinned: false,
    isEdited: false,
    reactions: [{ emoji: '✅', userIds: ['user-ahmed'] }],
    attachments: [],
    erpMentions: [],
    createdAt: ts(48),
    updatedAt: ts(48),
  },

  // ── DM: Wali ↔ Sarah ──────────────────────────────────────────────────────
  {
    id: 'msg-dm-s-1',
    channelId: 'dm-sarah',
    senderId: 'user-sarah',
    content: 'Wali — can you review the updated pricing proposal for TechCore? I adjusted the enterprise tier down by 10% to match their budget.',
    isPinned: false,
    isEdited: false,
    reactions: [],
    attachments: [],
    erpMentions: [],
    createdAt: ts(25),
    updatedAt: ts(25),
  },
  {
    id: 'msg-dm-s-2',
    channelId: 'dm-sarah',
    senderId: 'user-wali',
    content: 'Makes sense. Approved. Close this one! 🎯',
    isPinned: false,
    isEdited: false,
    reactions: [],
    attachments: [],
    erpMentions: [],
    createdAt: ts(22),
    updatedAt: ts(22),
  },

  // ── DM: Wali ↔ Zara ──────────────────────────────────────────────────────
  {
    id: 'msg-dm-z-1',
    channelId: 'dm-zara',
    senderId: 'user-zara',
    content: 'Hi Wali, please review the updated HR policy document for remote work. It needs your sign-off before I distribute it to all departments.',
    isPinned: false,
    isEdited: false,
    reactions: [],
    attachments: [],
    erpMentions: [],
    createdAt: ts(80),
    updatedAt: ts(80),
  },
];

// ── ERP Entity Suggestions (for @mention autocomplete) ──────────────────────

export const ERP_ENTITIES = [
  { type: 'invoice' as const, id: 'INV-2025-0101', label: 'Invoice #INV-2025-0101' },
  { type: 'invoice' as const, id: 'INV-2025-0102', label: 'Invoice #INV-2025-0102' },
  { type: 'client' as const, id: 'cli-1', label: 'Client: CoolAir Pros' },
  { type: 'client' as const, id: 'cli-2', label: 'Client: HomeComfort HVAC' },
  { type: 'project' as const, id: 'proj-1', label: 'Project: CoolAir Website + SEO' },
  { type: 'project' as const, id: 'proj-2', label: 'Project: HomeComfort Booking App' },
  { type: 'task' as const, id: 'task-invoice-followup', label: 'Task: Follow up unpaid invoices' },
];

// ── Common Emoji Set for Picker ───────────────────────────────────────────────

export const EMOJI_SET = [
  '👍','👎','🎉','🔥','❤️','😄','😂','🚀','💪','✅','⚠️','❌',
  '🤔','💡','📊','📈','📉','💰','💼','📌','🔔','⏰','🏆','🎯',
  '✏️','📝','🔍','🛠️','🔧','💻','📱','🌐','⚡','🌟','👀','🙌',
  '🤝','🎊','😎','🤩','😮','🥳','💬','📢','🔒','🔓','📁','🗂️',
];
