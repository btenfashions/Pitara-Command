import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { NextAuthProvider } from "@/providers/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PITARA COMMAND CENTER",
  description: "Commercial Grade Operations Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="ml-64 flex-1 p-8">
              {children}
            </main>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
