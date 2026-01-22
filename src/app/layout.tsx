import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "No More Cry - AI-Powered Baby Comforter",
  description: "Real-time cry detection and AI-generated comforting responses to help soothe your baby",
  keywords: ["baby", "cry detection", "AI", "comfort", "parenting", "TensorFlow.js"],
  authors: [{ name: "No More Cry Team" }],
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "No More Cry",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nomorecry.vercel.app",
    title: "No More Cry - AI-Powered Baby Comforter",
    description: "Real-time cry detection and AI-generated comforting responses",
    siteName: "No More Cry",
  },
  twitter: {
    card: "summary_large_image",
    title: "No More Cry - AI-Powered Baby Comforter",
    description: "Real-time cry detection and AI-generated comforting responses",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
