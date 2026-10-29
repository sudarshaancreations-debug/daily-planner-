// impeccable-disable overused-font -- NIMORA brand uses Plus Jakarta Sans & Space Grotesk intentionally
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeToggle } from '@/components/ThemeToggle';
import { AgentationToolbar } from '@/components/AgentationToolbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NIMORA — Your Day. Intelligently Organized.",
  description: "AI-Powered Daily Planning, CRM Follow-ups, and MCP Hub",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NIMORA",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0b1f",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          // impeccable-disable-line overused-font
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0e0b1f] text-[#f8fafc]">
        {children}
        {process.env.NODE_ENV === 'development' && <AgentationToolbar />}
      </body>
    </html>
  );
}
