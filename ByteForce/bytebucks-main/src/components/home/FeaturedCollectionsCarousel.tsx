import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Verified, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Collection {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  banner_url: string | null;
  floor_price: number | null;
  total_volume: number | null;
  unique_owners: number | null;
  is_verified: boolean | null;
  blockchain: string | null;
}

export function FeaturedCollectionsCarousel() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    async function fetchCollections() {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('total_volume', { ascending: false })
        .limit(8);

      if (!error && data) {
        setCollections(data);
      }
      setLoading(false);
    }

    fetchCollections();
  }, []);

  // Mock volume change for demo
  const getVolumeChange = () => (Math.random() * 40 - 10).toFixed(1);

  if (loading) {
    return (
      <section className="py-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 w-64 bg-muted rounded animate-pulse" />
            <div className="h-10 w-24 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[400px] h-64 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="py-16 overflow-hidden relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
              Featured Collections
            </h2>
            <p className="text-muted-foreground">
              Discover the most popular NFT collections
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={scrollPrev}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={scrollNext}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Link to="/collections">
              <Button variant="elegant-outline" size="sm" className="rounded-full ml-2">
                View All
              </Button>
            </Link>
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {collections.map((collection) => {
              const volumeChange = parseFloat(getVolumeChange());
              const isPositive = volumeChange >= 0;

              return (
                <Link
                  key={collection.id}
                  to={`/collections/${collection.slug}`}
                  className="flex-shrink-0 w-[90%] sm:w-[45%] lg:w-[30%] group"
                >
                  <div className="relative h-72 rounded-2xl overflow-hidden glass border border-border/50 hover:border-primary/30 transition-all hover:shadow-elegant">
                    {/* Banner Image */}
                    <div className="absolute inset-0">
                      <img
                        src={collection.banner_url || collection.image_url || '/placeholder.svg'}
                        alt={collection.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    </div>

                    {/* Collection Avatar */}
                    <div className="absolute top-4 left-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-background shadow-lg">
                        <img
                          src={collection.image_url || '/placeholder.svg'}
                          alt={collection.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Blockchain Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                        {collection.blockchain || 'Ethereum'}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-serif font-bold text-foreground truncate">
                          {collection.name}
                        </h3>
                        {collection.is_verified && (
                          <Verified className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Floor</p>
                          <p className="text-foreground font-medium">
                            {collection.floor_price?.toFixed(2) || '0.00'} ETH
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Volume</p>
                          <p className="text-foreground font-medium">
                            {collection.total_volume?.toLocaleString() || '0'} ETH
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">24h Change</p>
                          <p className={cn(
                            "font-medium flex items-center gap-1",
                            isPositive ? "text-success" : "text-destructive"
                          )}>
                            {isPositive ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {isPositive ? '+' : ''}{volumeChange}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-6">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === selectedIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
