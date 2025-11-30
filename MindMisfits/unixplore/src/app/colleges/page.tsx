'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { CollegeCard } from '@/components/cards/CollegeCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, MapPin, Building2, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface College {
    id: number;
    college_id: string;
    name: string;
    location: string;
    city: string;
    state: string;
    club_count: number;
    clubs: { id: number; name: string; category: string }[];
}

export default function CollegesPage() {
    const searchParams = useSearchParams();
    const [colleges, setColleges] = useState<College[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || searchParams.get('id') || '');
    const [cityFilter, setCityFilter] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const fetchColleges = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            const search = searchParams.get('search');
            const id = searchParams.get('id');

            if (id) params.append('id', id);
            else if (search) params.append('search', search);
            if (cityFilter) params.append('city', cityFilter);
            if (stateFilter) params.append('state', stateFilter);

            const response = await fetch(`/api/colleges?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                console.log('Fetched colleges:', data.data);
                setColleges(data.data);
            }
        } catch (error) {
            console.error('Error fetching colleges:', error);
        } finally {
            setLoading(false);
        }
    }, [searchParams, cityFilter, stateFilter]);

    useEffect(() => {
        fetchColleges();
    }, [fetchColleges]);

    const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    // If user enters a College ID → send ?id=CLG-XXXXXX
    if (searchQuery.toUpperCase().startsWith("CLG-")) {
        params.append("id", searchQuery.toUpperCase());
    } 
    // Otherwise → name search
    else if (searchQuery.trim() !== "") {
        params.append("search", searchQuery);
    }

    // Push URL
    window.history.pushState({}, "", `/colleges?${params.toString()}`);

    // Refetch
    fetchColleges();
};


    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-50" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] opacity-50" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            </div>

            <div className="container-custom relative z-10 py-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16 max-w-2xl mx-auto"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                        Discover Colleges
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed">
                        Explore institutions, find communities, and connect with student bodies across the country.
                    </p>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-4xl mx-auto mb-16"
                >
                    <div className="p-1 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                        <div className="bg-black/40 rounded-xl p-4">
                            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Search by name or College ID (CLG-XXXXXX)..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-lg"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className={`h-12 px-6 border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white ${showFilters ? 'bg-white/10 text-white border-primary/50' : ''}`}
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filters
                                </Button>
                                <Button type="submit" className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-105">
                                    Search
                                </Button>
                            </form>

                            {/* Expandable Filters */}
                            <motion.div
                                initial={false}
                                animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-4 mt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <Input
                                            type="text"
                                            placeholder="Filter by city..."
                                            value={cityFilter}
                                            onChange={(e) => setCityFilter(e.target.value)}
                                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <Input
                                            type="text"
                                            placeholder="Filter by state..."
                                            value={stateFilter}
                                            onChange={(e) => setStateFilter(e.target.value)}
                                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex justify-end">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={fetchColleges}
                                            className="bg-white/10 hover:bg-white/20 text-white"
                                        >
                                            Apply Filters
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Results */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        <p className="text-gray-400">Searching for colleges...</p>
                    </div>
                ) : colleges.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-8 px-2">
                            <p className="text-gray-400">
                                Found <span className="text-white font-semibold">{colleges.length}</span> {colleges.length === 1 ? 'college' : 'colleges'}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {colleges.map((college, index) => (
                                <motion.div
                                    key={college.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    <CollegeCard
                                        id={college.id}
                                        collegeId={college.college_id}
                                        name={college.name}
                                        location={college.location}
                                        clubCount={college.club_count}
                                        clubs={college.clubs}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm max-w-2xl mx-auto"
                    >
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="h-8 w-8 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No colleges found</h3>
                        <p className="text-gray-400 max-w-sm mx-auto">
                            We couldn't find any colleges matching your search. Try adjusting your filters or search terms.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
