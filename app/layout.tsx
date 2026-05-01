import type { Metadata, Viewport } from "next";
import "./globals.css";
import { basePath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ParQ — Never circle Pavia again",
  description: "AI-powered parking intelligence for the University of Miami.",
  manifest: `${basePath}/manifest.webmanifest`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ParQ",
  },
  icons: {
    icon: `${basePath}/icon.svg`,
    apple: `${basePath}/apple-touch-icon.png`,
  },
};

export const viewport: Viewport = {
  themeColor: "#6B2FB3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        <div className="mx-auto min-h-dvh w-full max-w-[440px] bg-[var(--color-bg)] relative">
          {children}
        </div>
      </body>
    </html>
  );
}
