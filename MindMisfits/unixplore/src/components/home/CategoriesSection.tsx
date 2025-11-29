import { Card, CardContent } from '@/components/ui/card';
import { Code, Palette, Heart, Trophy, Camera } from 'lucide-react';

const categories = [
    {
        name: 'Technical',
        slug: 'technical',
        icon: Code,
        color: 'bg-technical/10 text-technical border-technical/20',
        description: 'Coding, robotics, AI, and innovation',
    },
    {
        name: 'Cultural',
        slug: 'cultural',
        icon: Palette,
        color: 'bg-cultural/10 text-cultural border-cultural/20',
        description: 'Dance, music, art, and theatre',
    },
    {
        name: 'Social',
        slug: 'social',
        icon: Heart,
        color: 'bg-social/10 text-social border-social/20',
        description: 'Community service and social impact',
    },
    {
        name: 'Sports',
        slug: 'sports',
        icon: Trophy,
        color: 'bg-sports/10 text-sports border-sports/20',
        description: 'Athletics, fitness, and competition',
    },
    {
        name: 'Media',
        slug: 'media',
        icon: Camera,
        color: 'bg-media/10 text-media border-media/20',
        description: 'Photography, videography, and content',
    },
];

export function CategoriesSection() {
    return (
        <section id="categories" className="py-16 md:py-24">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore by Category</h2>
                    <p className="text-lg text-muted-foreground">
                        Browse clubs across different categories
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Card key={category.slug} className="card-hover">
                                <CardContent className="p-6 text-center space-y-4">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${category.color}`}>
                                        <Icon className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                                        <p className="text-sm text-muted-foreground">{category.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
