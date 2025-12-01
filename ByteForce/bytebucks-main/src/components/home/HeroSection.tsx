import { ArrowRight, TrendingUp, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { marketStats } from '@/data/mockData';
import { Link } from 'react-router-dom';

export function HeroSection() {
  const stats = [
    {
      label: 'Total Volume',
      value: `$${(marketStats.totalVolume / 1000000).toFixed(1)}M`,
      icon: TrendingUp,
      change: '+24.5%',
    },
    {
      label: 'NFTs Created',
      value: `${(marketStats.totalNFTs / 1000000).toFixed(2)}M`,
      icon: Zap,
      change: '+12.3%',
    },
    {
      label: 'Active Users',
      value: `${(marketStats.totalUsers / 1000).toFixed(0)}K`,
      icon: Users,
      change: '+18.7%',
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px]" />
      
      {/* Vertical line accent */}
      <div className="absolute right-1/3 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden lg:block" />

      <div className="container mx-auto px-4 relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8 max-w-2xl">
            {/* Category tag */}
            <div 
              className="inline-flex items-center gap-2 animate-fade-up"
              style={{ animationDelay: '0ms' }}
            >
              <span className="tag-pill">[Blockchain]</span>
              <span className="text-muted-foreground text-sm">—</span>
              <span className="text-muted-foreground text-sm">2 min read time</span>
            </div>

            {/* Headline */}
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] tracking-tight animate-fade-up"
              style={{ animationDelay: '100ms' }}
            >
              Discover & Collect{' '}
              <span className="italic text-primary">Extraordinary</span>{' '}
              Digital Art
            </h1>

            {/* Subtitle */}
            <p 
              className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-up"
              style={{ animationDelay: '200ms' }}
            >
              The premier NFT marketplace for discerning collectors. 
              Explore curated digital masterpieces across{' '}
              <span className="text-foreground">Ethereum</span>,{' '}
              <span className="text-foreground">Solana</span>,{' '}
              <span className="text-foreground">Polygon</span> &{' '}
              <span className="text-foreground">Bitcoin</span>.
            </p>

            {/* CTAs */}
            <div 
              className="flex flex-col sm:flex-row items-start gap-4 pt-4 animate-fade-up"
              style={{ animationDelay: '300ms' }}
            >
              <Link to="/explore">
                <Button variant="elegant" size="xl" className="group rounded-full">
                  Explore Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/create">
                <Button variant="elegant-outline" size="xl" className="rounded-full">
                  Start Creating
                </Button>
              </Link>
            </div>

            {/* Author/Creator attribution style element */}
            <div 
              className="flex items-center gap-4 pt-8 animate-fade-up"
              style={{ animationDelay: '400ms' }}
            >
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border-2 border-background"
                  />
                ))}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trusted by</p>
                <p className="font-medium">10,000+ Collectors Worldwide</p>
              </div>
            </div>
          </div>

          {/* Right side - Decorative 3D-like element */}
          <div 
            className="hidden lg:flex justify-center items-center animate-fade-up"
            style={{ animationDelay: '300ms' }}
          >
            <div className="relative">
              {/* Stacked cards effect */}
              <div className="absolute -top-8 -left-8 w-64 h-80 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 blur-sm transform rotate-6" />
              <div className="absolute -top-4 -left-4 w-64 h-80 rounded-2xl bg-card border border-border transform rotate-3" />
              <div className="relative w-64 h-80 rounded-2xl bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="relative z-10 text-center p-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-primary/20 flex items-center justify-center">
                    <span className="text-4xl font-serif font-bold text-primary">B</span>
                  </div>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest">Featured</p>
                  <p className="font-serif text-lg font-semibold mt-1">ByteBucks Collection</p>
                </div>
              </div>
              
              {/* Floating accent elements */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-xl bg-primary/20 animate-float" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 -right-12 w-16 h-16 rounded-lg bg-secondary/20 animate-float" style={{ animationDelay: '2s' }} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-24 mt-8 border-t border-border animate-fade-up"
          style={{ animationDelay: '500ms' }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="stats-card group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-success text-sm font-medium px-2 py-1 rounded-md bg-success/10">
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
