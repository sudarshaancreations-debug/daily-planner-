'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Screen19SubscriptionPlans } from '@/nimora/screens/WidgetAndSettingsScreens';

export default function PaymentsPage() {
  const router = useRouter();

  return (
    <div className="bg-[#0a1120] text-[#f8fafc] min-h-screen antialiased selection:bg-[#38bdf8]/20 selection:text-[#38bdf8] relative py-6 px-4 max-w-md mx-auto shadow-2xl">
      <Screen19SubscriptionPlans onNavigate={() => router.push('/')} />
    </div>
  );
}
