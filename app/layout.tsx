import type { Metadata } from 'next';
import { Geist, Geist_Mono, Limelight } from 'next/font/google';
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

const limeLight = Limelight({
  variable: '--font-limelight',
  subsets: ['latin'],
  preload: true,
  weight: '400',
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
        className={`${geistSans.variable} ${geistMono.variable} ${limeLight.variable} antialiased min-h-[100vh] mb-1`}
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
