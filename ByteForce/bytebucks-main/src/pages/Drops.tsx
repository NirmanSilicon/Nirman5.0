// NEW: src/pages/Drops.tsx
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const dropsData = [
  {
    name: 'Cybernetic Dreams',
    artist: 'by GlitchArt',
    date: 'Dec 15, 2025',
    imageUrl: '/public/nfts/cyber-samurai.jpg',
    status: 'Upcoming'
  },
  {
    name: 'Astral Forms',
    artist: 'by SpiralChaos',
    date: 'Dec 20, 2025',
    imageUrl: '/public/nfts/spiral-chaos.jpg',
    status: 'Upcoming'
  },
  {
    name: 'Pixelated Friends',
    artist: 'by CoolApe',
    date: 'Dec 25, 2025',
    imageUrl: '/public/nfts/cool-ape.jpg',
    status: 'Upcoming'
  },
  {
    name: 'Galactic Grids',
    artist: 'by TVHead',
    date: 'Jan 05, 2026',
    imageUrl: '/public/nfts/tv-head.jpg',
    status: 'Upcoming'
  }
];

export default function Drops() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Upcoming Drops</h1>
            <p className="mt-4 text-muted-foreground md:text-xl">
              Be the first to mint from these exclusive new collections.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dropsData.map((drop) => (
              <Card key={drop.name} className="overflow-hidden group">
                <div className="relative aspect-[4/5] overflow-hidden">
                    <img src={drop.imageUrl} alt={drop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-4 right-4">
                        <Badge>{drop.status}</Badge>
                    </div>
                </div>
                <CardContent className="p-4 bg-muted/50">
                  <h3 className="text-lg font-semibold">{drop.name}</h3>
                  <p className="text-sm text-muted-foreground">{drop.artist}</p>
                  <p className="text-sm font-bold text-primary mt-2">{drop.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
