import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { site } from "@/lib/env";

import "./globals.css";

const description = site.description;

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: `${site.name} | The easiest Firebase API`,
  description,
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: site.name,
    description,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(
        geistSans.variable,
        geistMono.variable,
        dmSans.variable,
        "font-sans antialiased",
      )}
    >
      <body className="overflow-x-clip">{children}</body>
    </html>
  );
}
