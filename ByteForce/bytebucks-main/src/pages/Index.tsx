import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedCollectionsCarousel } from '@/components/home/FeaturedCollectionsCarousel';
import { FilterSection } from '@/components/home/FilterSection';
import { DiscoverySection } from '@/components/home/DiscoverySection';
import { RecentlyUploadedNFTs } from '@/components/home/RecentlyUploadedNFTs';
import { StatsSection } from '@/components/home/StatsSection';
import { RewardsSection } from '@/components/home/RewardsSection';
import { SeasonPromoSection } from '@/components/home/SeasonPromoSection';
import { Footer } from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedCollectionsCarousel />
        <RecentlyUploadedNFTs />
        <div className="container mx-auto px-4 py-8">
          <FilterSection />
        </div>
        <DiscoverySection />
        <StatsSection />
        <RewardsSection />
        <SeasonPromoSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
