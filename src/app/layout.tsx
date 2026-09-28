import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WhiteboardProvider } from '@/context/WhiteboardContext';
import { ChatProvider } from '@/context/ChatContext';
import { DocumentProvider } from '@/context/DocumentContext';
import { FinanceProvider } from '@/context/FinanceContext';
import { AgencyProvider } from '@/context/AgencyContext';
import WhiteboardModal from '@/components/whiteboard/WhiteboardModal';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "OMNYSYNC — Agency ERP",
  description: "OMNYSYNC command center for websites, custom software, SEO, and apps — HVAC & home-services focus.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full bg-[#0b0f0d] text-[#f3f4f6] selection:bg-[#00e676]/20 selection:text-[#00e676]">
        <AgencyProvider>
          <FinanceProvider>
            <DocumentProvider>
              <ChatProvider>
                <WhiteboardProvider>
                  {children}
                  <WhiteboardModal />
                </WhiteboardProvider>
              </ChatProvider>
            </DocumentProvider>
          </FinanceProvider>
        </AgencyProvider>
      </body>
    </html>
  );
}
