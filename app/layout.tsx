// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar'; // Import the Navbar

const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({
  weight: ['400', '700'], // The font weights you want to use
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins', // A CSS variable to link with Tailwind
});
export const metadata: Metadata = {
  title: 'IdeaHub',
  description: 'A collaborative hub for sharing and growing ideas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <Navbar /> {/* Add the Navbar here */}
        <main>{children}</main>
      </body>
    </html>
  );
}