import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WhiteboardProvider } from '@/context/WhiteboardContext';
import WhiteboardModal from '@/components/whiteboard/WhiteboardModal';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FlowERP - ERP Command Center",
  description: "Web-based Next.js ERP System Command Center Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full bg-[#0b0f0d] text-[#f3f4f6] selection:bg-[#00e676]/20 selection:text-[#00e676]">
        <WhiteboardProvider>
          {children}
          <WhiteboardModal />
        </WhiteboardProvider>
      </body>
    </html>
  );
}
