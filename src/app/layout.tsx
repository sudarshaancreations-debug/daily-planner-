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
  metadataBase: new URL("https://nimora-ai.vercel.app"),
  title: "NIMORA — Your Day. Intelligently Organized.",
  description:
    "Executive AI Daily Planner with hands-free voice scheduling, focus time-blocking, stakeholder CRM, and calendar sync.",
  applicationName: "NIMORA",
  authors: [{ name: "NIMORA Technologies" }],
  generator: "Next.js",
  keywords: [
    "AI Daily Planner",
    "Voice Assistant",
    "Time Blocking",
    "Executive Productivity",
    "Smart Calendar",
    "NIMORA",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NIMORA",
  },
  openGraph: {
    title: "NIMORA — Your Day. Intelligently Organized.",
    description:
      "Executive AI Daily Planner with hands-free voice scheduling, focus time-blocking, stakeholder CRM, and calendar sync.",
    url: "https://nimora-ai.vercel.app",
    siteName: "NIMORA AI Daily Planner",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1024,
        height: 500,
        alt: "NIMORA AI Daily Planner — Executive Interface",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NIMORA — Your Day. Intelligently Organized.",
    description:
      "Executive AI Daily Planner with hands-free voice scheduling, focus time-blocking, and calendar sync.",
    images: ["/og-image.jpg"],
    creator: "@nimora_app",
  },
  robots: {
    index: true,
    follow: true,
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
