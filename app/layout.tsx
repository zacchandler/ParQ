import type { Metadata, Viewport } from "next";
import "./globals.css";
import { basePath } from "@/lib/utils";
import { PhoneFrame } from "@/components/PhoneFrame";

export const metadata: Metadata = {
  title: "ParQ — Real-time campus parking",
  description: "AI parking intelligence for college campuses. Find your spot before you park.",
  manifest: `${basePath}/manifest.webmanifest`,
  appleWebApp: { capable: true, statusBarStyle: "default", title: "ParQ" },
  icons: { icon: `${basePath}/icon.svg` },
};

export const viewport: Viewport = {
  themeColor: "#1B0438",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PhoneFrame>{children}</PhoneFrame>
      </body>
    </html>
  );
}
