'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function CTASection() {
    return (
        <section className="py-24 md:py-32 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-3xl opacity-30" />

            <div className="container-custom relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto text-center space-y-8 p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white">
                        Are you a college or club admin?
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Register your college or club to reach thousands of students and showcase your community to the world.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
                        <Link href="/register/college">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full border-white/20 hover:bg-white/10">
                                Register College
                            </Button>
                        </Link>
                        <Link href="/register/club">
                            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-white text-black hover:bg-gray-200">
                                Register Club
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
