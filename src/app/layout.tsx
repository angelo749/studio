import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '700']
});

export const metadata: Metadata = {
  title: 'Story Weaver',
  description: 'Generate unique children\'s stories with AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
