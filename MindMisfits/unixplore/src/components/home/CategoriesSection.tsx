'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Code, Palette, Heart, Trophy, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const categories = [
    {
        name: 'Technical',
        slug: 'technical',
        icon: Code,
        color: 'from-blue-500 to-cyan-500',
        description: 'Coding, robotics, AI, and innovation',
        colSpan: 'md:col-span-2',
    },
    {
        name: 'Cultural',
        slug: 'cultural',
        icon: Palette,
        color: 'from-purple-500 to-pink-500',
        description: 'Dance, music, art, and theatre',
        colSpan: 'md:col-span-1',
    },
    {
        name: 'Social',
        slug: 'social',
        icon: Heart,
        color: 'from-green-500 to-emerald-500',
        description: 'Community service and social impact',
        colSpan: 'md:col-span-1',
    },
    {
        name: 'Sports',
        slug: 'sports',
        icon: Trophy,
        color: 'from-orange-500 to-amber-500',
        description: 'Athletics, fitness, and competition',
        colSpan: 'md:col-span-1',
    },
    {
        name: 'Media',
        slug: 'media',
        icon: Camera,
        color: 'from-red-500 to-rose-500',
        description: 'Photography, videography, and content',
        colSpan: 'md:col-span-1', // Changed to span 1 to fit grid better or adjust as needed
    },
];

export function CategoriesSection() {
    return (
        <section id="categories" className="py-24 md:py-32 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background pointer-events-none" />

            <div className="container-custom relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        Explore by Category
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Dive into a world of opportunities. Browse clubs across different categories and find your passion.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px]">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <Link href={`/colleges?category=${category.slug}`} key={category.slug} className={cn("group relative overflow-hidden rounded-3xl", category.colSpan || "md:col-span-1")}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="h-full w-full"
                                >
                                    <div className={cn(
                                        "absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-500",
                                        category.color
                                    )} />
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl" />

                                    <div className="relative h-full p-8 flex flex-col justify-between z-10">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br text-white shadow-lg",
                                            category.color
                                        )}>
                                            <Icon className="h-6 w-6" />
                                        </div>

                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                                {category.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
