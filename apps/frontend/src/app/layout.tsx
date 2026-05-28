import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Warsaw Salon Explorer',
  description: 'Explore salons in Warsaw',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
