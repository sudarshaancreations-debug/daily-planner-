'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Screen19SubscriptionPlans } from '@/nimora/screens/WidgetAndSettingsScreens';

export default function PaymentsPage() {
  const router = useRouter();

  return (
    <div className="bg-[#121412] text-[#e3e2e0] min-h-screen antialiased selection:bg-[#a1d1bd] selection:text-[#05382a] relative py-6 px-4 max-w-md mx-auto shadow-2xl">
      <Screen19SubscriptionPlans onNavigate={() => router.push('/')} />
    </div>
  );
}
