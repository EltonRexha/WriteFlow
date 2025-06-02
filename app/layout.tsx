import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ReactQuery from '../libs/ReactQuery';
import { ToastProvider } from './components/ToastProvider';
import AuthProvider from '../libs/AuthProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'WriteFlow',
  description: 'WriteFlow write your ideas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100vh] mb-1`}
      >
          <AuthProvider>
            <ReactQuery>
              <ToastProvider>{children}</ToastProvider>
            </ReactQuery>
          </AuthProvider>
      </body>
    </html>
  );
}
