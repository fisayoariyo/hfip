// app/layout.tsx
// What a noob should know:
// This is the ROOT layout — it wraps every single page in the app.
// We put the AppProvider (our global state) here so all pages can access it.
// metadata exports set the browser tab title and description.
import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/shared/Navbar";

export const metadata: Metadata = {
  title: "HFIP — Hashmar Farmer Identity Platform",
  description: "Digital identity and onboarding system for Nigerian farmers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        suppressHydrationWarning is needed because we toggle the 'dark' class
        on <html> from JavaScript (localStorage), which causes a mismatch
        between server-rendered HTML and the first client render.
      */}
      <body>
        <AppProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
