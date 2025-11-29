'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Check if it's a college ID format
            if (searchQuery.match(/^CLG-[A-Z]+$/i)) {
                router.push(`/college/${searchQuery.toUpperCase()}`);
            } else {
                router.push(`/colleges?search=${encodeURIComponent(searchQuery)}`);
            }
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSearch}
            className="w-full"
        >
            <div className="relative group">
                {/* Glow effect on focus */}
                {isFocused && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-30"
                    />
                )}

                <div className="relative glass-card p-2 rounded-3xl border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="pl-4">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Enter College Code (CLG-SOAITER) or Search by Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-base"
                            aria-label="Search for colleges"
                        />
                        <Button
                            type="submit"
                            size="lg"
                            className="rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick tips */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 flex gap-2 flex-wrap"
            >
                <span className="text-xs text-gray-500">Try:</span>
                {['CLG-SOAITER', 'CLG-SILICON', 'Technical Clubs'].map((tip, index) => (
                    <motion.button
                        key={tip}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        type="button"
                        onClick={() => setSearchQuery(tip)}
                        className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-purple-500/50 transition-all duration-200"
                    >
                        {tip}
                    </motion.button>
                ))}
            </motion.div>
        </motion.form>
    );
}
