import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | NIMORA Daily Planner',
  description: 'Official privacy policy for NIMORA AI Daily Planner and CRM, compliant with Google Play Store and GDPR.',
};

export default function PrivacyPolicyPage() {
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
            Legal &amp; Compliance Notice
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-['Space_Grotesk']">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#9b9f9c] leading-relaxed">
            This Privacy Policy governs how <strong>NIMORA</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Application&rdquo;) collects, uses, maintains, and discloses information collected from users of the NIMORA Android mobile application and web services.
          </p>
        </div>

        {/* Section 1: Types of Data Collected */}
        <section className="space-y-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <span className="text-[#bef264]">1.</span> Information We Collect
          </h2>
          <p className="text-xs text-[#9b9f9c] leading-relaxed">
            To provide autonomous scheduling, voice task extraction, and stakeholder relationship tracking, we collect the following categories of data:
          </p>
          <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc pl-5 leading-relaxed">
            <li>
              <strong>Voice &amp; Audio Data:</strong> When you activate the AI voice assistant (&ldquo;Ask Nova&rdquo;), audio samples are recorded via your device microphone (<code className="text-[#bef264] bg-black/40 px-1 py-0.5 rounded">android.permission.RECORD_AUDIO</code>) solely for speech-to-text processing and immediate task generation. Audio is processed transiently and is never sold.
            </li>
            <li>
              <strong>Task &amp; Calendar Information:</strong> Milestones, agendas, focus blocks, meeting durations, and synced calendar schedules.
            </li>
            <li>
              <strong>Stakeholder Contacts:</strong> Names, company affiliations, phone numbers, and follow-up notes you explicitly save in your private CRM list.
            </li>
            <li>
              <strong>Device &amp; Usage Diagnostics:</strong> Crash diagnostics, operating system version, and anonymous performance telemetry via standard Android Vitals to ensure app stability.
            </li>
            <li>
              <strong>Account &amp; Subscription Credentials:</strong> Your registered email address and Google Play in-app billing tokens for verifying premium access.
            </li>
          </ul>
        </section>

        {/* Section 2: How Data is Used */}
        <section className="space-y-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <span className="text-[#bef264]">2.</span> Purpose of Data Processing
          </h2>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            We process your information exclusively to:
          </p>
          <ul className="text-xs text-[#cbd5e1] space-y-1.5 list-disc pl-5 leading-relaxed">
            <li>Schedule, prioritize, and structure your daily agenda and focus blocks.</li>
            <li>Provide real-time AI conversational task parsing and schedule generation.</li>
            <li>Generate one-tap communication shortcuts (WhatsApp and phone calls) to your saved contacts.</li>
            <li>Authenticate user accounts and manage subscriptions via Google Play Billing.</li>
            <li>Detect, prevent, and troubleshoot performance or security incidents.</li>
          </ul>
        </section>

        {/* Section 3: Third-Party Data Disclosures */}
        <section className="space-y-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <span className="text-[#bef264]">3.</span> Third-Party Service Providers
          </h2>
          <p className="text-xs text-[#9b9f9c] leading-relaxed">
            We do not sell, rent, or trade your personal data. We disclose information only to vetted service providers acting as strict data processors:
          </p>
          <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc pl-5 leading-relaxed">
            <li>
              <strong>Google Play Services:</strong> For processing in-app purchases, subscription management, and core Android lifecycle services.
            </li>
            <li>
              <strong>AI Cloud Processors (Google Cloud / Gemini API):</strong> Audio and text prompt queries are transmitted over encrypted TLS 1.3 connections strictly to process assistant replies and are not used to train global public models without consent.
            </li>
            <li>
              <strong>Vercel Inc.:</strong> Hosting infrastructure and serverless API execution.
            </li>
          </ul>
        </section>

        {/* Section 4: Data Retention & Security */}
        <section className="space-y-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <span className="text-[#bef264]">4.</span> Storage, Encryption &amp; Security
          </h2>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            All user data in transit is encrypted using 256-bit SSL/TLS protocol. On-device local data is stored within the application-sandboxed storage container. Speech audio buffers are cleared immediately following task synthesis.
          </p>
        </section>

        {/* Section 5: Children's Privacy */}
        <section className="space-y-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <span className="text-[#bef264]">5.</span> Children&rsquo;s Privacy
          </h2>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            NIMORA is designed for working professionals and executives and is not directed at children under the age of 13 (or under 16 in the European Economic Area). We do not knowingly collect personal information from children.
          </p>
        </section>

        {/* Section 6: User Rights & Data Deletion */}
        <section className="space-y-3 p-5 rounded-2xl bg-emerald-950/30 border border-[#bef264]/30">
          <h2 className="text-lg font-bold text-[#bef264] font-['Space_Grotesk'] flex items-center gap-2">
            <span>6.</span> Your Privacy Rights &amp; Account Deletion
          </h2>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            You have the absolute right to access, rectify, export, or permanently delete your personal data at any time.
          </p>
          <div className="pt-2">
            <Link
              href="/delete-account"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/50 text-rose-300 text-xs font-mono font-bold transition-all"
            >
              <span>Submit Account &amp; Data Deletion Request</span>
              <span>→</span>
            </Link>
          </div>
          <p className="text-[11px] text-[#9b9f9c] leading-relaxed pt-1">
            You can also instantly wipe all stored schedules and local data by going to <strong>Settings &gt; Delete All Data</strong> directly inside the application.
          </p>
        </section>

        {/* Section 7: Contact Information */}
        <section className="space-y-2 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <span className="text-[#bef264]">7.</span> Contact &amp; Privacy Officer
          </h2>
          <p className="text-xs text-[#9b9f9c] leading-relaxed">
            If you have questions, feedback, or data privacy requests concerning this policy, please reach our team directly at:
          </p>
          <div className="text-xs font-mono text-[#bef264] space-y-1 pt-1">
            <p>Email: <a href="mailto:privacy@nimora-ai.com" className="underline">privacy@nimora-ai.com</a></p>
            <p>App Website: <a href="https://nimora-ai.vercel.app" className="underline">https://nimora-ai.vercel.app</a></p>
          </div>
        </section>

        {/* Footer */}
        <div className="pt-6 border-t border-white/[0.08] text-center text-xs text-[#9b9f9c] font-mono">
          © 2026 NIMORA Technologies. All rights reserved.
        </div>

      </div>
    </div>
  );
}
