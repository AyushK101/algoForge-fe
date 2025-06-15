import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import ReduxProvider from './StoreProvider';
import { ThemeProvider } from "@/components/theme-provider"
import ClientAuthSync from '@/components/ClientAuthSync';
import { SessionProvider } from 'next-auth/react';
import { Providers } from '@/components/Provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AlgoForge',
  description: 'online judge platform',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <Toaster position='top-center' />
        <Providers>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <ClientAuthSync/>
            {children}
          </ReduxProvider>
        </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
