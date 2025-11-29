'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getCategoryColor, truncate } from '@/lib/utils';

interface ClubCardProps {
    id: number;
    name: string;
    description: string;
    categoryName: string;
    categorySlug: string;
}

export function ClubCard({ id, name, description, categoryName, categorySlug }: ClubCardProps) {
    return (
        <Link href={`/club/${id}`}>
            <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="group h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
                <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <Badge className={`${getCategoryColor(categorySlug)} border-0`}>
                            {categoryName}
                        </Badge>
                        <div className="p-2 rounded-full bg-white/5 text-gray-400 group-hover:bg-white group-hover:text-black transition-colors">
                            <ArrowUpRight className="h-4 w-4" />
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                        {name}
                    </h3>

                    <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {truncate(description, 120)}
                    </p>

                    <div className="mt-auto pt-4 border-t border-white/5">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider group-hover:text-gray-300 transition-colors">
                            View Details
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
