'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, MapPin, Building2, Users } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ClubCard } from '@/components/cards/ClubCard';

interface Club {
    id: number;
    name: string;
    slug: string;
    category_id: number;
    description: string;
    category_name?: string;
    category_slug?: string;
}

interface College {
    id: number;
    name: string;
    location: string;
    city: string;
    state: string;
    clubs: Club[];
}

export default function CollegePage() {
    const params = useParams();
    const [college, setCollege] = useState<College | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchCollegeData(params.id as string);
        }
    }, [params.id]);

    const fetchCollegeData = async (id: string) => {
        try {
            const response = await fetch(`/api/colleges/${id}`);
            const data = await response.json();

            if (data.success) {
                const enrichedClubs = data.data.clubs.map((club: any) => ({
                    ...club,
                    categoryName: club.category_name || 'General',
                    categorySlug: club.category_slug || 'general'
                }));

                setCollege({ ...data.data, clubs: enrichedClubs });
            }
        } catch (error) {
            console.error('Error fetching college:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-white" />
            </div>
        );
    }

    if (!college) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white">
                <h1 className="text-2xl font-bold mb-4">College not found</h1>
                <Link href="/find-college" className="text-purple-400 hover:underline">
                    Go back to search
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            {/* Hero Header */}
            <div className="relative mb-16 container mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl rounded-full -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-6">
                        <Building2 className="h-4 w-4" />
                        <span>{college.city}, {college.state}</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                        {college.name}
                    </h1>

                    <div className="flex justify-center gap-8 text-gray-400">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-purple-400" />
                            <span>{college.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-400" />
                            <span>{college.clubs.length} Active Clubs</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Clubs Grid */}
            <div className="container mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">Campus Clubs</h2>
                    <div className="h-px flex-1 bg-white/10 ml-8" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {college.clubs && college.clubs.length > 0 ? (
                        college.clubs.map((club, index) => (
                            <motion.div
                                key={club.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ClubCard
                                    id={club.id}
                                    name={club.name}
                                    description={club.description || "Join us to explore, create, and innovate together."}
                                    categoryName={(club as any).categoryName}
                                    categorySlug={(club as any).categorySlug}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                            <p className="text-xl text-gray-500">No clubs found for this college yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
