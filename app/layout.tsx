import type React from "react";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { NavBar } from "@/components/navbar";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ThinkCircle - AI-Powered Study Groups",
  description:
    "Dynamic AI-powered platform for forming and participating in optimized study groups",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} antialiased`}
    >
      <body suppressHydrationWarning className="font-sans theme-cobalt-apricot">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <NavBar />
            <main>{children}</main>
            <Toaster richColors />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
