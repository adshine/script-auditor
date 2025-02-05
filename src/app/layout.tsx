import type { Metadata } from "next";
import { Inter, Outfit, Nunito } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Script Auditor",
  description: "AI-powered script analysis and improvement tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.className} style={{ margin: 0, padding: 0, height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
