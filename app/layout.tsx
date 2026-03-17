import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tonechanadventures.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tone Chan's Adventures — Play Free in Browser",
    template: "%s | Tone Chan's Adventures",
  },
  description:
    "A retro Game Boy Advance-inspired action adventure — play the demo free in your browser. Pixel art, anime storytelling, and original music by Tone Chan.",
  keywords: [
    "Tone Chan Adventures", "GBA game", "browser game", "pixel art",
    "indie game", "anime game", "retro game", "play online", "emulator",
    "Game Boy Advance", "streetwear game",
  ],
  authors: [{ name: "Tone Chan Studios" }],
  creator: "Tone Chan Studios",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Tone Chan's Adventures",
    title: "Tone Chan's Adventures — Play Free in Browser",
    description:
      "A retro Game Boy Advance game blending anime, streetwear, and original music. Play the demo now — no download required.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tone Chan's Adventures — Play Free in Browser",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tone Chan's Adventures — Play Free in Browser",
    description: "Retro GBA action-adventure. Play the demo now in your browser.",
    images: ["/images/og-image.png"],
    creator: "@tonechan",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-tc-black text-tc-cream antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
