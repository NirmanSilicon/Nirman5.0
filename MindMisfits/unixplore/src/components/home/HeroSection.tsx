'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
            </div>

            <div className="container relative z-10 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-6 backdrop-blur-md">
                        The Future of Campus Discovery
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40"
                >
                    UNIXPLORE
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
                >
                    Discover colleges, explore clubs, and connect with the vibrant campus life.
                    Your journey to finding the perfect community starts here.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                >
                    <Link href="/find-college">
                        <Button size="lg" variant="premium" className="group">
                            Find Your College
                            <Search className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                        </Button>
                    </Link>
                    <Link href="/register-college">
                        <Button size="lg" variant="outline" className="group">
                            Register College
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent" />
            </motion.div>
        </section>
    );
}
