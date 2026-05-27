import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rahul Kumar — Backend Engineer & Competitive Programmer",
  description:
    "Software Engineer II at Google, Play Analytics. IIIT Delhi ECE graduate. Codeforces Expert (peak 1677). Built microservices for 50M+ concurrent users at Jio Platforms.",
  keywords: [
    "Rahul Kumar",
    "Backend Engineer",
    "Competitive Programmer",
    "IIIT Delhi",
    "Codeforces",
    "LeetCode",
    "Software Engineer",
    "DSA",
    "System Design",
  ],
  authors: [{ name: "Rahul Kumar" }],
  verification: {
    google: "7OOJ2GLCvAoHZiTSYV7EKLaXu51IXXZvB5JmNQl5eqU",
  },
  openGraph: {
    title: "Rahul Kumar — Backend Engineer",
    description: "Backend engineer with Codeforces Expert rank. IIIT Delhi.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahul Kumar — Backend Engineer",
    description: "Backend engineer with Codeforces Expert rank. IIIT Delhi.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-[#080808] text-[#f0f0f0] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
