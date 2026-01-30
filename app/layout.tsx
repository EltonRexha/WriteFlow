import type { Metadata } from "next";
import { Geist, Geist_Mono, Limelight } from "next/font/google";
import "./globals.css";
import ReactQuery from "../libs/ReactQuery";
import { ToastProvider } from "../components/ToastProvider";
import AuthProvider from "../libs/AuthProvider";
import { ThemeProvider } from "../components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const limeLight = Limelight({
  variable: "--font-limelight",
  subsets: ["latin"],
  preload: true,
  weight: "400",
});

export const metadata: Metadata = {
  title: "WriteFlow",
  description: "WriteFlow write your ideas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${limeLight.variable} antialiased min-h-[100vh] mb-1`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Check if user has manually set a theme
                const manualTheme = localStorage.getItem('theme');
                if (manualTheme) {
                  // User has manual preference - override automatic system
                  document.documentElement.setAttribute('data-theme', manualTheme);
                } else {
                  // No manual theme - let DaisyUI handle automatic switching
                  // Remove any existing data-theme to ensure automatic switching works
                  document.documentElement.removeAttribute('data-theme');
                }
              })();
            `,
          }}
        />
        <AuthProvider>
          <ThemeProvider>
            <ReactQuery>
              <ToastProvider>{children}</ToastProvider>
            </ReactQuery>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
