import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { CTASection } from '@/components/home/CTASection';
import { FeaturesSection } from '@/components/home/FeaturesSection';

export const metadata: Metadata = {
    title: 'UniXplore - Discover Colleges and Clubs',
    description: 'A centralized platform for discovering colleges and their clubs. Explore technical, cultural, social, sports, and media clubs across universities.',
    openGraph: {
        title: 'UniXplore - Discover Colleges and Clubs',
        description: 'Club. Create. Collaborate. Discover colleges and their clubs.',
        type: 'website',
    },
};

export default function HomePage() {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <CategoriesSection />
            <CTASection />
            <FeaturesSection />
        </div>
    );
}


