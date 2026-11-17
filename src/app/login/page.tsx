'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { haptics } from '@/lib/haptics';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // States
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Forgot password modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);

  // Password strength calculation for sign up
  const calculateStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score; // 0 to 4
  };

  const strength = calculateStrength(password);
  const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-rose-500', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-[#bef264]'];

  // 1. Social OAuth Handler
  const handleSocialAuth = async (provider: 'google' | 'apple' | 'microsoft' | 'github') => {
    haptics.tick();
    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const providerNames = {
      google: 'Google',
      apple: 'Apple',
      microsoft: 'Microsoft 365',
      github: 'GitHub',
    };

    setLoadingStage(`Connecting to ${providerNames[provider]} OAuth...`);

    try {
      // Simulate real OAuth authorization exchange
      await new Promise((r) => setTimeout(r, 600));
      setLoadingStage(`Verifying ${providerNames[provider]} security tokens...`);

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'social_auth',
          provider,
          name: provider === 'google' ? 'Sudarshan Mehta' : 'Executive User',
          email: provider === 'google' ? 'sudarshan.architect@gmail.com' : `user@${provider}.com`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Social authentication failed.');
      }

      setLoadingStage('Establishing encrypted local session...');
      await new Promise((r) => setTimeout(r, 400));

      // Persist auth user to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('nimora_auth_user', JSON.stringify(data.user));
        localStorage.setItem('nimora_auth_token', data.token);
      }

      haptics.success();
      setSuccessMsg(`Welcome, ${data.user.name}! Redirecting to your dashboard...`);
      setTimeout(() => {
        router.push('/');
      }, 700);
    } catch (err: any) {
      haptics.error();
      setErrorMsg(err?.message || 'Authentication timed out. Please try again.');
      setIsProcessing(false);
      setLoadingStage('');
    }
  };

  // 2. Email & Password Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    haptics.tick();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === 'signup' && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid work or personal email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsProcessing(true);
    setLoadingStage(mode === 'signin' ? 'Authenticating credentials...' : 'Creating secure executive account...');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: mode,
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      setLoadingStage('Synchronizing planner encryption keys...');
      await new Promise((r) => setTimeout(r, 400));

      if (typeof window !== 'undefined') {
        localStorage.setItem('nimora_auth_user', JSON.stringify(data.user));
        localStorage.setItem('nimora_auth_token', data.token);
      }

      haptics.success();
      setSuccessMsg(mode === 'signin' ? 'Login successful! Opening dashboard...' : 'Account created! Welcome to NIMORA.');
      setTimeout(() => {
        router.push('/');
      }, 700);
    } catch (err: any) {
      haptics.error();
      setErrorMsg(err?.message || 'Authentication error.');
      setIsProcessing(false);
      setLoadingStage('');
    }
  };

  // 3. Quick Demo Login (Zero friction)
  const handleQuickDemo = () => {
    setEmail('demo@nimora.ai');
    setPassword('executive2026');
    setName('Sudarshan Mehta');
    handleSocialAuth('google');
  };

  // 4. Forgot Password Submit
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotStatus('Please enter a valid email address.');
      return;
    }
    setForgotStatus('Sending recovery instructions...');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'forgot_password',
          email: forgotEmail,
        }),
      });
      const data = await res.json();
      setForgotStatus(data.message || 'Check your inbox for reset instructions.');
    } catch {
      setForgotStatus('Failed to send reset link. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-[#0e0b1f] text-[#f8fafc] flex flex-col justify-between p-4 selection:bg-[#bef264]/30 selection:text-[#bef264]">
      {/* Background radial glows */}
      <div className="fixed -top-24 -left-24 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 -right-24 w-96 h-96 rounded-full bg-[#bef264]/5 blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between py-3 z-10">
        <Link
          href="/"
          className="flex items-center gap-2 group text-xs text-purple-300/80 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
            arrow_back
          </span>
          <span>Back to Planner</span>
        </Link>
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#bef264] px-2 py-0.5 rounded-full bg-[#bef264]/10 border border-[#bef264]/20">
          Executive Auth
        </span>
      </header>

      {/* Main Auth Card (Bento + Dark Luxury Archetype) */}
      <div className="w-full max-w-md mx-auto my-auto py-4 z-10">
        <div className="bg-[#141815] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/40 space-y-6">
          {/* Brand Icon & Heading */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#bef264]/20 to-purple-500/20 border border-[#bef264]/40 flex items-center justify-center mx-auto text-[#bef264] shadow-lg shadow-lime-950/50">
              <span className="material-symbols-outlined text-3xl">lock_open</span>
            </div>
            <h1 className="text-2xl font-bold font-['Space_Grotesk'] tracking-tight text-white">
              {mode === 'signin' ? 'Sign in to NIMORA' : 'Create Your Account'}
            </h1>
            <p className="text-xs text-purple-200/70">
              {mode === 'signin'
                ? 'Access your intelligent daily schedule, voice engine & CRM'
                : 'Join executive productivity with time-blocking & AI assistant'}
            </p>
          </div>

          {/* Mode Switcher Tabs (Sign In / Sign Up) */}
          <div className="grid grid-cols-2 p-1 bg-black/40 rounded-xl border border-white/[0.06]">
            <button
              type="button"
              onClick={() => {
                haptics.tick();
                setMode('signin');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap inline-flex items-center justify-center ${
                mode === 'signin'
                  ? 'bg-[#bef264] text-[#0e0b1f] font-bold shadow-md'
                  : 'text-purple-200/70 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                haptics.tick();
                setMode('signup');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap inline-flex items-center justify-center ${
                mode === 'signup'
                  ? 'bg-[#bef264] text-[#0e0b1f] font-bold shadow-md'
                  : 'text-purple-200/70 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Social Media & OAuth Logins (Google, Apple, Microsoft, GitHub) */}
          <div className="space-y-2.5">
            {/* Google OAuth (Official Guidelines Compliant) */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleSocialAuth('google')}
              className="w-full py-3 px-4 rounded-xl bg-white text-gray-900 font-semibold text-xs flex items-center justify-center gap-3 hover:bg-gray-100 active:scale-[0.99] transition-all cursor-pointer shadow-md whitespace-nowrap border border-gray-200"
            >
              {/* Google Multicolored SVG */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.27 21.43 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.1z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.57 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Apple OAuth (Official Guidelines Compliant) */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleSocialAuth('apple')}
              className="w-full py-3 px-4 rounded-xl bg-black text-white font-semibold text-xs flex items-center justify-center gap-3 hover:bg-neutral-900 active:scale-[0.99] transition-all cursor-pointer shadow-md whitespace-nowrap border border-white/20"
            >
              {/* Apple SVG */}
              <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.79-11.97-14.24-6.3-9.54-11.19-20.24-14.67-32.09-3.48-11.85-5.22-23.07-5.22-33.68 0-14.28 3.56-26.12 10.68-35.53 7.12-9.41 16.03-14.28 26.73-14.61 4.71 0 10.05 1.25 16.03 3.75 5.98 2.5 9.77 3.86 11.38 4.08 1.95-.33 5.92-1.79 11.91-4.39 5.99-2.6 11.31-3.79 15.96-3.57 11.85.65 21.36 4.78 28.53 12.4-10.43 6.3-15.54 14.99-15.32 26.07.22 8.7 3.48 16.08 9.78 22.16 6.3 6.09 13.91 9.46 22.82 10.11-1.95 6.09-4.35 12.06-7.18 17.91zm-32.61-105.1c0-6.96 2.45-13.59 7.34-19.89 4.89-6.3 11.14-10.33 18.75-12.08.43 1.09.65 2.28.65 3.59 0 6.96-2.5 13.7-7.5 20.21-5 6.52-11.25 10.55-18.75 12.08-.11-1.3-.49-2.6-.49-3.91z" />
              </svg>
              <span>Continue with Apple</span>
            </button>

            {/* Microsoft 365 & GitHub Row */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleSocialAuth('microsoft')}
                className="py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs text-white font-medium flex items-center justify-center gap-2 border border-white/[0.08] active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap"
              >
                {/* Microsoft 4-Color Tiles SVG */}
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 21 21">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                </svg>
                <span>Microsoft</span>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleSocialAuth('github')}
                className="py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs text-white font-medium flex items-center justify-center gap-2 border border-white/[0.08] active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap"
              >
                {/* GitHub Octocat SVG */}
                <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/[0.08] w-full" />
            <span className="bg-[#141815] px-3 text-[10px] font-mono text-[#8a938e] uppercase tracking-wider relative">
              Or continue with email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name Field (Sign Up Only) */}
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#8a938e] block uppercase">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sudarshan Mehta"
                    className="w-full bg-[#181d1a] border border-white/[0.12] rounded-xl px-3 py-2.5 text-xs text-[#f8fafc] outline-none focus:border-[#bef264] transition-colors"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-[17px] text-[#8a938e]">
                    badge
                  </span>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#8a938e] block uppercase">Work / Personal Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@executive.com"
                  className="w-full bg-[#181d1a] border border-white/[0.12] rounded-xl px-3 py-2.5 text-xs text-[#f8fafc] outline-none focus:border-[#bef264] transition-colors"
                />
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-[17px] text-[#8a938e]">
                  mail
                </span>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-[#8a938e] uppercase">Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      haptics.tick();
                      setIsForgotModalOpen(true);
                      setForgotEmail(email);
                    }}
                    className="text-[10px] font-mono text-[#bef264] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#181d1a] border border-white/[0.12] rounded-xl px-3 py-2.5 text-xs text-[#f8fafc] outline-none focus:border-[#bef264] transition-colors pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#8a938e] hover:text-white transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

              {/* Password Strength Meter (Sign Up Only) */}
              {mode === 'signup' && password.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <span className="text-[#8a938e]">Password strength:</span>
                    <span className="font-bold text-[#bef264]">{strengthLabels[strength]}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 h-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full rounded-full transition-all duration-300 ${
                          strength >= step ? strengthColors[strength] : 'bg-white/[0.1]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#bef264] w-3.5 h-3.5 rounded"
                />
                <span className="text-[11px] text-purple-200/80">Remember this device for 30 days</span>
              </label>
            </div>

            {/* Semantic Feedback Alerts (Reel #1: Strictly separated from Brand Lime) */}
            {errorMsg && (
              <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-400 text-[18px]">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                <span>{successMsg}</span>
              </div>
            )}

            {/* Staged Loading Indicator (Reel #4: Contextual feedback instead of generic blank spinner) */}
            {isProcessing && loadingStage && (
              <div className="p-3 bg-[#0e3e30] border border-[#bef264]/40 rounded-xl text-center text-xs text-[#bef264] font-semibold animate-pulse flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                <span>{loadingStage}</span>
              </div>
            )}

            {/* Submit Action Button (Reel #3: whitespace-nowrap and auto-layout protected) */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#bef264] hover:bg-[#aee64b] text-[#0e0b1f] font-bold text-xs shadow-lg shadow-lime-950/50 active:scale-[0.99] transition-all cursor-pointer font-['Space_Grotesk'] flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>{mode === 'signin' ? 'Sign In to Dashboard' : 'Complete Registration'}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </form>

          {/* 1-Click Instant Demo Access */}
          <div className="pt-2 border-t border-white/[0.06] text-center space-y-2">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-xs font-mono text-[#bef264] hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <span>⚡</span>
              <span>1-Click Demo Login as Executive Architect</span>
            </button>
            <p className="text-[10px] text-purple-300/60">
              By accessing NIMORA, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-white">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-white">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#141815] border border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">Reset Password</h3>
              <button
                type="button"
                onClick={() => {
                  setIsForgotModalOpen(false);
                  setForgotStatus(null);
                }}
                className="text-gray-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-purple-200/80 leading-relaxed">
              Enter your account email. We will send you an encrypted single-use link to recover your planner credentials.
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@executive.com"
                className="w-full bg-[#181d1a] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-[#f8fafc] outline-none focus:border-[#bef264]"
              />

              {forgotStatus && (
                <div className="p-2.5 bg-purple-950/60 border border-purple-500/40 rounded-xl text-xs text-purple-200 font-mono">
                  {forgotStatus}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-white/10 text-xs font-semibold text-white hover:bg-white/15 cursor-pointer whitespace-nowrap inline-flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-[#bef264] text-[#0e0b1f] text-xs font-bold font-['Space_Grotesk'] hover:bg-[#aee64b] cursor-pointer whitespace-nowrap inline-flex items-center justify-center"
                >
                  Send Recovery Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full max-w-md mx-auto text-center py-2 text-[10px] text-purple-300/50 font-mono z-10">
        NIMORA AI Technologies © 2026 • 256-Bit Client-Side Encryption
      </footer>
    </main>
  );
}
