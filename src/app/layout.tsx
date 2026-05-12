import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import QueryProvider from "@/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PITARA COMMAND CENTER",
  description: "Commercial Grade Operations Dashboard",
  manifest: "/manifest.json",
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
          <QueryProvider>
            <div className="flex min-h-screen bg-slate-50">
              <Sidebar />
              <main className="ml-64 flex-1 p-8">
                {children}
              </main>
            </div>
          </QueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
