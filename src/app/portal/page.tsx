'use client';

import React from 'react';
import ClientPortalView from '@/components/portal/ClientPortalView';
import { useRouter } from 'next/navigation';

export default function PortalStandalonePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0b0f0d]">
      <ClientPortalView onBackToERP={() => router.push('/')} />
    </div>
  );
}
