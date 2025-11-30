'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ClubCard } from '@/components/cards/ClubCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, Loader2, ArrowLeft, Globe, Mail, Building2 } from 'lucide-react';
import { getCategoryColor } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AIFilterPanel } from '@/components/search/AIFilterPanel';

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
    const [aiFilteredKeywords, setAiFilteredKeywords] = useState<string[]>([]);

    useEffect(() => {
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

        fetchCollege();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!college) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4 text-white">College not found</h1>
                    <Link href="/colleges">
                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">Back to Colleges</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const categories = Array.from(new Set(college.clubs.map(club => club.category_slug)));
    const filteredClubs = college.clubs.filter(club => {
        // Category Filter
        const matchesCategory = selectedCategory === 'all' || club.category_slug === selectedCategory;

        // AI Filter
        const matchesAI = aiFilteredKeywords.length === 0 || aiFilteredKeywords.includes(club.category_slug);

        return matchesCategory && matchesAI;
    });

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-40" />
                <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-[100px] opacity-40" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
            </div>

            <div className="container-custom relative z-10 py-12">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link href="/colleges" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Colleges
                    </Link>
                </motion.div>

                {/* College Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
                                    {college.college_id}
                                </Badge>
                                <div className="flex items-center gap-1 text-gray-400 text-sm">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span>{college.location}</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">{college.name}</h1>

                            <div className="flex flex-wrap gap-4 mt-6">
                                {college.official_website && (
                                    <a
                                        href={college.official_website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors"
                                    >
                                        <Globe className="h-4 w-4 text-blue-400" />
                                        Official Website
                                        <ExternalLink className="h-3 w-3 opacity-50" />
                                    </a>
                                )}
                                {college.official_email && (
                                    <a
                                        href={`mailto:${college.official_email}`}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors"
                                    >
                                        <Mail className="h-4 w-4 text-green-400" />
                                        {college.official_email}
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm min-w-[200px] text-center">
                            <p className="text-sm text-gray-400 mb-1">Total Clubs</p>
                            <p className="text-4xl font-bold text-white">{college.clubs.length}</p>
                        </div>
                    </div>
                </motion.div>

                {/* AI Filter Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <AIFilterPanel
                        onFilter={(keywords) => {
                            setAiFilteredKeywords(keywords);
                            setSelectedCategory('all'); // Reset category when using AI
                        }}
                        onReset={() => setAiFilteredKeywords([])}
                    />
                </motion.div>

                {/* Category Filters */}
                {categories.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8"
                    >
                        <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit backdrop-blur-sm">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedCategory('all')}
                                className={`rounded-lg ${selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                All Clubs
                            </Button>
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                    className={`capitalize rounded-lg ${selectedCategory === category ? 'bg-primary text-primary-foreground' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Clubs Grid */}
                {filteredClubs.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredClubs.map((club, index) => (
                            <motion.div
                                key={club.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <ClubCard
                                    id={club.id}
                                    name={club.name}
                                    description={club.description}
                                    categoryName={club.category_name}
                                    categorySlug={club.category_slug}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm"
                    >
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Building2 className="h-8 w-8 text-gray-500" />
                        </div>
                        <p className="text-lg text-gray-400">
                            No clubs found in this category
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
