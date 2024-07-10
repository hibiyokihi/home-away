import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar/Navbar';
import Providers from './providers';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HomeAway',
  description: 'Feel at home, away from home',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        {/* suppress..を書いとかないと、Warningが発生する */}
        <body className={inter.className}>
          <Providers>
            {/* Toaster等、他にもProviderが必要なライブラリを使う場合、Providerの中にThemeProviderやToasterを入れる */}
            <Navbar />
            <main className="container py-10">{children}</main>
            {/* Navbarにもcontainerクラスが付いてるから、width, margin, paddingがmainコンテンツと統一される */}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
