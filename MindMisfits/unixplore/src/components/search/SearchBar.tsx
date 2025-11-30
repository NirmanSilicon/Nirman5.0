'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Check if it looks like a college ID (starts with CLG-)
            if (searchQuery.toUpperCase().startsWith('CLG-')) {
                // If it's a full ID format, we can use ID param, but for partials, let's use search
                // Actually, the backend search param handles both name and ID via ILIKE, 
                // so we can just use search for everything unless we want strict ID lookup.
                // Let's use search for everything to be safe and flexible.
                router.push(`/colleges?search=${encodeURIComponent(searchQuery)}`);
            } else {
                router.push(`/colleges?search=${encodeURIComponent(searchQuery)}`);
            }
        }
    };

    return (
        <motion.form
            onSubmit={handleSearch}
            className="w-full max-w-2xl mx-auto relative"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            <div className={`relative group transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />

                <div className="relative bg-background/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden flex items-center">
                    <Search className={`ml-4 h-5 w-5 transition-colors ${isFocused ? 'text-primary' : 'text-muted-foreground'}`} />
                    <Input
                        type="text"
                        placeholder="Enter College Code (CLG-XXXXXX) or Search by Name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="border-0 bg-transparent h-14 text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
                        aria-label="Search for colleges"
                    />
                    <Button
                        type="submit"
                        size="lg"
                        className="m-1 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-primary/25 transition-all duration-300"
                    >
                        Search
                    </Button>
                </div>
            </div>
        </motion.form>
    );
}
