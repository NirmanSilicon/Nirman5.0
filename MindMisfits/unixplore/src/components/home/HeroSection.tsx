'use client';

import { SearchBar } from '@/components/search/SearchBar';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-40 animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container-custom relative z-10">
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default">
                            <Sparkles className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm font-medium text-gray-200">
                                The Future of Student Communities
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.1] mb-6">
                            Club. Create. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
                                Collaborate.
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Discover colleges and their clubs. Find your community, explore opportunities, and connect with like-minded students.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="pt-8 flex flex-col items-center gap-8"
                    >
                        <div className="w-full max-w-lg transform hover:scale-105 transition-transform duration-300">
                            <SearchBar />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Link href="/colleges">
                                <Button size="lg" className="rounded-full h-14 px-8 text-lg bg-white text-black hover:bg-gray-200 font-semibold shadow-lg shadow-white/10 hover:shadow-white/20 transition-all">
                                    Explore Colleges
                                </Button>
                            </Link>
                            <Link href="/register/club">
                                <Button variant="outline" size="lg" className="rounded-full h-14 px-8 text-lg border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm transition-all group">
                                    Register Club
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
