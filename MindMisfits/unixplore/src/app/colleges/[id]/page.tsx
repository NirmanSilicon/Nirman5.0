'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ClubCard } from '@/components/cards/ClubCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, Loader2, ArrowLeft } from 'lucide-react';
import { getCategoryColor } from '@/lib/utils';

interface Club {
    id: number;
    name: string;
    description: string;
    category_name: string;
    category_slug: string;
}

interface College {
    id: number;
    college_id: string;
    name: string;
    location: string;
    city: string;
    state: string;
    official_website: string;
    official_email: string;
    clubs: Club[];
}

export default function CollegePage() {
    const params = useParams();
    const [college, setCollege] = useState<College | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        fetchCollege();
    }, [params.id]);

    const fetchCollege = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/colleges/${params.id}`);
            const data = await response.json();

            if (data.success) {
                setCollege(data.data);
            }
        } catch (error) {
            console.error('Error fetching college:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!college) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">College not found</h1>
                    <Link href="/colleges">
                        <Button>Back to Colleges</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const categories = Array.from(new Set(college.clubs.map(club => club.category_slug)));
    const filteredClubs = selectedCategory === 'all'
        ? college.clubs
        : college.clubs.filter(club => club.category_slug === selectedCategory);

    return (
        <div className="min-h-screen py-12">
            <div className="container-custom">
                {/* Back Button */}
                <Link href="/colleges" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Colleges
                </Link>

                {/* College Header */}
                <div className="mb-12">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{college.name}</h1>
                            <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                <MapPin className="h-4 w-4" />
                                <span>{college.location}</span>
                            </div>
                        </div>
                        <code className="px-3 py-1.5 bg-muted rounded-lg text-sm font-mono">
                            {college.college_id}
                        </code>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {college.official_website && (
                            <a
                                href={college.official_website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-primary hover:underline"
                            >
                                Official Website
                                <ExternalLink className="ml-1 h-3.5 w-3.5" />
                            </a>
                        )}
                        <span className="text-sm text-muted-foreground">
                            {college.clubs.length} {college.clubs.length === 1 ? 'Club' : 'Clubs'}
                        </span>
                    </div>
                </div>

                {/* Category Filters */}
                {categories.length > 0 && (
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedCategory('all')}
                            >
                                All Clubs
                            </Button>
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                    className="capitalize"
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Clubs Grid */}
                {filteredClubs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClubs.map((club) => (
                            <ClubCard
                                key={club.id}
                                id={club.id}
                                name={club.name}
                                description={club.description}
                                categoryName={club.category_name}
                                categorySlug={club.category_slug}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-lg text-muted-foreground">
                            No clubs found in this category
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
