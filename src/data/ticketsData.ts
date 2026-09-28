import { SupportTicket } from '@/data/portalData';

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-401',
    clientId: 'cli-1',
    ticketNumber: 'TKT-2026-401',
    title: 'Booking calendar not syncing technician availability',
    description: 'CoolAir Pros reports Saturday slots still showing as open after mark-busy.',
    category: 'Technical',
    priority: 'High',
    status: 'In Progress',
    createdAt: '2026-09-26 09:14',
    updatedAt: '2026-09-27 16:40',
    messages: [
      {
        id: 'tm-1',
        sender: 'James Porter',
        isClient: true,
        text: 'Saturday availability is wrong after yesterday deploy.',
        timestamp: '2026-09-26 09:14',
      },
      {
        id: 'tm-2',
        sender: 'Elena Rostova',
        isClient: false,
        text: 'Reproduced — patching calendar cache. ETA tomorrow AM.',
        timestamp: '2026-09-26 11:02',
      },
    ],
  },
  {
    id: 'tkt-402',
    clientId: 'cli-3',
    ticketNumber: 'TKT-2026-402',
    title: 'Need branded PDF of latest SEO report',
    description: 'Please upload September SEO report to the portal files tab.',
    category: 'Billing',
    priority: 'Medium',
    status: 'Open',
    createdAt: '2026-09-27 14:20',
    updatedAt: '2026-09-27 14:20',
    messages: [
      {
        id: 'tm-3',
        sender: 'Derek Hale',
        isClient: true,
        text: 'Can you drop the Sep report in Files?',
        timestamp: '2026-09-27 14:20',
      },
    ],
  },
];
