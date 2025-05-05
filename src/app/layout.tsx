import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { JetBrains_Mono as GeistMono } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const geistSans = Inter({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = GeistMono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'XRPL Tax Reporter - Automated Tax Reporting for XRP Ledger',
    description: 'Automated tax reporting and transaction tracking for XRP Ledger users',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full bg-gray-50">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
