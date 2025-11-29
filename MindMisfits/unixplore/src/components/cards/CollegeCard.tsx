'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CollegeCardProps {
    id: number;
    collegeId: string;
    name: string;
    location: string;
    clubCount?: number;
}

export function CollegeCard({ id, collegeId, name, location, clubCount }: CollegeCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative h-full rounded-2xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-sm transition-colors hover:bg-white/10"
        >
            <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10">
                        <span className="text-2xl font-bold text-white">
                            {name.charAt(0)}
                        </span>
                    </div>
                    {clubCount !== undefined && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-gray-400">
                            {clubCount} Clubs
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {name}
                </h3>

                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{location}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <code className="text-xs font-mono text-gray-500 bg-black/20 px-2 py-1 rounded">
                        {collegeId}
                    </code>
                    <Link href={`/college/${collegeId}`}>
                        <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 p-0 h-auto font-normal">
                            Explore <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
