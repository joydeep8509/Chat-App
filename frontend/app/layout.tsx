import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Real-Time Chat',
  description: 'Real-time WebSocket chat hub built with Next.js and Spring Boot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '953413173159-l7k9kfklf5ed2o1nkcvfugueiqmpld7k.apps.googleusercontent.com';

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-br from-emerald-100/70 via-slate-100 to-emerald-100/50 min-h-screen h-[100dvh] flex items-center justify-center p-0 md:p-6 font-sans text-slate-800 antialiased selection:bg-emerald-500/30 overflow-hidden`}
      >
        <GoogleOAuthProvider clientId={googleClientId}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}