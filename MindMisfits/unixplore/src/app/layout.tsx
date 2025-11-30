import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";

const outfit = Outfit({
    subsets: ["latin"],
    display: 'swap',
    variable: '--font-outfit',
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    title: {
        default: "UniXplore - Discover Colleges and Clubs",
        template: "%s | UniXplore"
    },
    description: "A centralized platform for discovering colleges and their clubs. Explore technical, cultural, social, sports, and media clubs across universities.",
    keywords: ["colleges", "clubs", "university", "student clubs", "technical clubs", "cultural clubs", "sports clubs"],
    authors: [{ name: "UniXplore" }],
    creator: "UniXplore",
    publisher: "UniXplore",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: '/',
        title: 'UniXplore - Discover Colleges and Clubs',
        description: 'A centralized platform for discovering colleges and their clubs.',
        siteName: 'UniXplore',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'UniXplore - Discover Colleges and Clubs',
        description: 'A centralized platform for discovering colleges and their clubs.',
    },
    verification: {
        google: 'google-site-verification-code',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${outfit.variable} dark`}>
            <body className="min-h-screen flex flex-col antialiased font-sans bg-background text-foreground selection:bg-primary/30">
                <Navbar />
                <main className="flex-1 relative z-10">
                    {children}
                </main>
                <Footer />
                <Toaster />
            </body>
        </html>
    );
}
