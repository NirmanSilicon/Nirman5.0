'use client';

import { SearchBar } from '@/components/search/SearchBar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, Star, Users } from 'lucide-react';

export default function FindCollegePage() {
    const popularColleges = [
        { id: 'CLG-000001', name: 'SOA/ITER', clubs: 21, category: 'Engineering' },
        { id: 'CLG-000002', name: 'Silicon Institute', clubs: 15, category: 'Technology' },
    ];

    const categories = [
        { name: 'Technical', icon: '💻', count: 45 },
        { name: 'Cultural', icon: '🎭', count: 32 },
        { name: 'Sports', icon: '⚽', count: 28 },
        { name: 'Social', icon: '🤝', count: 19 },
    ];

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            {/* Hero Section */}
            <div className="relative mb-16 container mx-auto max-w-4xl">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl rounded-full -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-purple-400 mb-6"
                    >
                        <Star className="h-4 w-4" />
                        <span>Discover 2000+ Clubs Across Universities</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        Find Your
                        <span className="block text-gradient-purple">College</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Search by college code or name to explore clubs, events, and opportunities.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <div className="mb-12">
                    <SearchBar />
                </div>
            </div>

            {/* Categories Section */}
            <div className="container mx-auto max-w-6xl mb-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Browse by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="glass-card p-6 rounded-2xl text-center cursor-pointer group hover:bg-white/10 transition-all duration-300"
                            >
                                <div className="text-4xl mb-3">{category.icon}</div>
                                <h3 className="font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-gray-500">{category.count} clubs</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Popular Colleges */}
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="h-5 w-5 text-purple-400" />
                        <h2 className="text-2xl font-bold text-white">Popular Colleges</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {popularColleges.map((college, index) => (
                            <motion.div
                                key={college.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                            >
                                <Link href={`/college/${college.id}`}>
                                    <div className="glass-card p-6 rounded-2xl group hover:bg-white/10 transition-all duration-300 cursor-pointer">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30">
                                                    <Building2 className="h-6 w-6 text-purple-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-xl text-white group-hover:text-purple-400 transition-colors">
                                                        {college.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">{college.id}</p>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                                                {college.category}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                <span>{college.clubs} Active Clubs</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                            <span className="text-xs text-gray-500 uppercase tracking-wider">View Clubs</span>
                                            <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                                                <span className="text-white text-sm">→</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
