'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Screen19SubscriptionPlans } from '@/nimora/screens/WidgetAndSettingsScreens';

export default function PaymentsPage() {
  const router = useRouter();

  return (
    <div className="bg-[#0e0b1f] text-[#f8fafc] min-h-screen antialiased selection:bg-[#bef264]/30 selection:text-[#bef264] relative py-6 px-4 max-w-md mx-auto shadow-2xl">
      <Screen19SubscriptionPlans onNavigate={() => router.push('/')} />
    </div>
  );
}
