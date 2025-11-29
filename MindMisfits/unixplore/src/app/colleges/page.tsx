'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CollegeCard } from '@/components/cards/CollegeCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

interface College {
    id: number;
    college_id: string;
    name: string;
    location: string;
    city: string;
    state: string;
    club_count: number;
}

export default function CollegesPage() {
    const searchParams = useSearchParams();
    const [colleges, setColleges] = useState<College[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || searchParams.get('id') || '');
    const [cityFilter, setCityFilter] = useState('');
    const [stateFilter, setStateFilter] = useState('');

    useEffect(() => {
        fetchColleges();
    }, [searchParams]);

    const fetchColleges = async () => {
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
                setColleges(data.data);
            }
        } catch (error) {
            console.error('Error fetching colleges:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();

        if (searchQuery.match(/^CLG-\d{6}$/i)) {
            params.append('id', searchQuery.toUpperCase());
        } else if (searchQuery) {
            params.append('search', searchQuery);
        }

        window.history.pushState({}, '', `/colleges?${params.toString()}`);
        fetchColleges();
    };

    return (
        <div className="min-h-screen py-12">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Colleges</h1>
                    <p className="text-lg text-muted-foreground">
                        Search for colleges by name or College ID and explore their clubs
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-8 space-y-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by name or College ID (CLG-XXXXXX)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button type="submit">Search</Button>
                    </form>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            type="text"
                            placeholder="Filter by city..."
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                        />
                        <Input
                            type="text"
                            placeholder="Filter by state..."
                            value={stateFilter}
                            onChange={(e) => setStateFilter(e.target.value)}
                        />
                    </div>

                    {(cityFilter || stateFilter) && (
                        <Button
                            variant="outline"
                            onClick={fetchColleges}
                            className="w-full sm:w-auto"
                        >
                            Apply Filters
                        </Button>
                    )}
                </div>

                {/* Results */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : colleges.length > 0 ? (
                    <>
                        <p className="text-sm text-muted-foreground mb-6">
                            Found {colleges.length} {colleges.length === 1 ? 'college' : 'colleges'}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {colleges.map((college) => (
                                <CollegeCard
                                    key={college.id}
                                    id={college.id}
                                    collegeId={college.college_id}
                                    name={college.name}
                                    location={college.location}
                                    clubCount={college.club_count}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-lg text-muted-foreground mb-4">No colleges found</p>
                        <p className="text-sm text-muted-foreground">
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
