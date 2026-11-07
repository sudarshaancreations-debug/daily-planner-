import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | NIMORA Daily Planner',
  description: 'Official terms of service, subscription agreement, and legal disclaimers for NIMORA AI Daily Planner and CRM.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0e0b1f] text-[#f8fafc] px-4 py-12 md:px-8 font-sans selection:bg-[#bef264] selection:text-[#0e0b1f]">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
          <Link
            href="/"
            className="text-xs font-mono text-[#bef264] hover:underline flex items-center gap-1.5"
          >
            ← Back to NIMORA App
          </Link>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#9b9f9c] bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/[0.08]">
            Effective: October 2026
          </span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#bef264]">
            Legal Agreement &amp; Subscription Terms
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-['Space_Grotesk']">
            Terms of Service
          </h1>
          <p className="text-sm text-[#9b9f9c] leading-relaxed">
            Welcome to <strong>NIMORA</strong>. These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User&rdquo;, &ldquo;you&rdquo;) and <strong>NIMORA Technologies</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), governing your access to and use of the NIMORA mobile application on Google Play, web services, and AI scheduling platform.
          </p>
        </div>

        {/* Section 1: Acceptance & Eligibility */}
        <section className="space-y-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <span className="text-[#bef264]">1.</span> Acceptance of Terms &amp; Eligibility
          </h2>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            By downloading, installing, accessing, or using the Application, you agree to be bound by these Terms and our{' '}
            <Link href="/privacy" className="text-[#bef264] underline">
              Privacy Policy
            </Link>
            . If you do not agree to these Terms, you must not use or access the Application.
          </p>
          <p className="text-xs text-[#9b9f9c] leading-relaxed">
            You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to enter into these Terms and utilize NIMORA.
          </p>
        </section>

        {/* Section 2: Service Description & AI Assistant Disclaimer */}
        <section className="space-y-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <span className="text-[#bef264]">2.</span> AI Voice &amp; Scheduling Disclaimer
          </h2>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            NIMORA provides automated task scheduling, voice-driven agenda creation, and stakeholder CRM tools powered by artificial intelligence and on-device natural language processing.
          </p>
          <div className="p-3.5 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-200/90 leading-relaxed space-y-1">
            <strong>Important Assistive Disclaimer:</strong>
            <p className="text-[11px] text-amber-200/80">
              NIMORA is an assistive productivity application. AI-generated focus blocks, voice interpretation of tasks, meeting duration calculations, and reminders are recommendations intended for organizational assistance only. You retain sole responsibility for reviewing, verifying, and managing your own schedule, appointments, meetings, and business commitments. NIMORA is not liable for missed meetings, missed deadlines, scheduling collisions, or calendar synchronization delays.
            </p>
          </div>
        </section>

        {/* Section 3: Subscriptions, Billing & Google Play In-App Purchases */}
        <section className="space-y-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <span className="text-[#bef264]">3.</span> Subscriptions, Billing &amp; Google Play
          </h2>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            NIMORA offers optional premium subscriptions (&ldquo;Executive Membership&rdquo;, &ldquo;Pro&rdquo;) unlocking advanced features, high-frequency calendar sync, and unlimited AI voice parsing:
          </p>
          <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc pl-5 leading-relaxed">
            <li>
              <strong>In-App Billing:</strong> On Android devices, all subscription purchases are processed directly through <strong>Google Play In-App Billing</strong>. Your payment method associated with your Google Account will be charged upon confirmation of purchase.
            </li>
            <li>
              <strong>Automatic Renewal:</strong> Subscriptions automatically renew at the end of each billing cycle (monthly or annually) unless you cancel at least 24 hours prior to the expiration of the current billing cycle.
            </li>
            <li>
              <strong>Price Changes:</strong> We reserve the right to modify subscription fees with reasonable advance notice. Any price adjustments will take effect following the end of your current subscription cycle in accordance with Google Play developer policies.
            </li>
          </ul>
        </section>

        {/* Section 4: Cancellation & Refund Policy */}
        <section className="space-y-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <span className="text-[#bef264]">4.</span> Cancellation &amp; Refund Policy
          </h2>
          <div className="text-xs text-[#cbd5e1] space-y-2 leading-relaxed">
            <p>
              <strong>How to Cancel:</strong> You can manage or cancel your subscription at any time directly through Google Play:
            </p>
            <div className="p-3 bg-black/40 rounded-xl font-mono text-[11px] text-[#bef264] border border-white/10">
              Open Google Play Store ➔ Tap Profile Icon (Top Right) ➔ Payments &amp; Subscriptions ➔ Subscriptions ➔ Select NIMORA ➔ Tap Cancel Subscription.
            </div>
            <p>
              Upon cancellation, your subscription benefits will remain active until the end of your current paid billing period.
            </p>
            <p>
              <strong>Refunds:</strong> All purchases processed via Google Play are subject to the official{' '}
              <a
                href="https://support.google.com/googleplay/answer/2479637"
                target="_blank"
                rel="noreferrer"
                className="text-[#bef264] underline"
              >
                Google Play Refund Policies
              </a>
              . To request a refund, submit your request directly to Google Play within 48 hours of purchase.
            </p>
          </div>
        </section>

        {/* Section 5: Acceptable Use Policy */}
        <section className="space-y-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <span className="text-[#bef264]">5.</span> Acceptable Use
          </h2>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            You agree not to:
          </p>
          <ul className="text-xs text-[#cbd5e1] space-y-1.5 list-disc pl-5 leading-relaxed">
            <li>Reverse engineer, decompile, or attempt to extract the source code or proprietary prompt schemas of NIMORA.</li>
            <li>Use the voice assistant or CRM tools to harass, abuse, spam, or infringe on the privacy or intellectual property rights of any individual.</li>
            <li>Bypass or circumvent any access restrictions, security controls, or subscription verification mechanisms.</li>
            <li>Deploy automated scripts, bots, or scrapers against NIMORA serverless APIs.</li>
          </ul>
        </section>

        {/* Section 6: User Data & Account Deletion */}
        <section className="space-y-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <span className="text-[#bef264]">6.</span> User Data &amp; Account Erasure
          </h2>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            We respect your digital sovereignty. You may permanently delete your account, saved stakeholder CRM records, and all local and cloud data at any time via:
          </p>
          <div className="pt-1 flex flex-wrap gap-3">
            <Link
              href="/delete-account"
              className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold transition-all"
            >
              Public Account Deletion Form →
            </Link>
            <Link
              href="/privacy"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white transition-all"
            >
              Read Privacy Policy →
            </Link>
          </div>
        </section>

        {/* Section 7: Intellectual Property */}
        <section className="space-y-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <span className="text-[#bef264]">7.</span> Intellectual Property Rights
          </h2>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            All rights, title, and interest in and to NIMORA, including the design system, software, trademarks, logos, audio algorithms, and documentation are the exclusive property of <strong>NIMORA Technologies</strong> and its licensors.
          </p>
        </section>

        {/* Section 8: Warranty Disclaimer & Limitation of Liability */}
        <section className="space-y-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <span className="text-[#bef264]">8.</span> Warranty Disclaimer &amp; Limitation of Liability
          </h2>
          <p className="text-xs text-[#9b9f9c] leading-relaxed uppercase">
            NIMORA IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. TO THE MAXIMUM EXTENT PERMITTED BY LAW, NIMORA TECHNOLOGIES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, USE, OR GOODWILL RESULTING FROM YOUR USE OF THE SERVICE.
          </p>
        </section>

        {/* Section 9: Business Identity & Contact */}
        <section className="space-y-2 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <span className="text-[#bef264]">9.</span> Business Identity &amp; Inquiries
          </h2>
          <p className="text-xs text-[#9b9f9c] leading-relaxed">
            For questions or notices regarding these Terms, contact our legal and support team:
          </p>
          <div className="text-xs font-mono text-[#bef264] space-y-1 pt-1">
            <p>Developer: <strong>Sudarshan Mehta / NIMORA Technologies</strong></p>
            <p>Support &amp; Legal: <a href="mailto:legal@nimora-ai.com" className="underline">legal@nimora-ai.com</a></p>
            <p>Production Portal: <a href="https://nimora-ai.vercel.app" className="underline">https://nimora-ai.vercel.app</a></p>
          </div>
        </section>

        {/* Footer */}
        <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#9b9f9c] font-mono">
          <span>© 2026 NIMORA Technologies</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white underline">Privacy Policy</Link>
            <Link href="/delete-account" className="hover:text-white underline">Delete Account</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
