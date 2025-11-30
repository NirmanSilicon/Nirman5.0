import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink, Building2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface CollegeCardProps {
    id: number;
    collegeId: string;
    name: string;
    location: string;
    clubCount?: number;
    clubs?: { id: number; name: string; category: string }[];
}

export function CollegeCard({ id, collegeId, name, location, clubCount, clubs = [] }: CollegeCardProps) {
    return (
        <Link href={`/colleges/${id}`} className="block h-full group">
            <Card className="h-full bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 overflow-hidden relative flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardHeader className="relative z-10 pb-2">
                    <div className="flex items-start justify-between gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-900/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                            <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10">
                            <code className="text-xs font-mono text-primary">{collegeId}</code>
                        </div>
                    </div>
                    <div className="mt-4">
                        <CardTitle className="text-xl font-bold text-white line-clamp-2 group-hover:text-primary transition-colors duration-300">
                            {name}
                        </CardTitle>
                        <CardDescription className="mt-2 flex items-center gap-1.5 text-gray-400">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-500" />
                            <span className="line-clamp-1 text-sm">{location}</span>
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="relative z-10 pt-4 flex-grow flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-black/20 border border-white/5">
                            <span className="text-sm text-gray-400">Active Clubs</span>
                            <span className="text-lg font-bold text-white">{clubCount || 0}</span>
                        </div>

                        {clubs && clubs.length > 0 && (
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Top Clubs</p>
                                <div className="flex flex-wrap gap-2">
                                    {clubs.slice(0, 3).map((club) => (
                                        <Badge
                                            key={club.id}
                                            variant="secondary"
                                            className="bg-primary text-white border-white/5 text-xs font-normal"
                                        >
                                            {club.name}
                                        </Badge>
                                    ))}
                                    {clubs.length > 3 && (
                                        <Badge variant="outline" className="text-xs border-white/10 text-gray-500">
                                            +{clubs.length - 3} more
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <Button className="w-full bg-white text-black hover:bg-gray-200 font-semibold group/btn pointer-events-none mt-auto">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                </CardContent>
            </Card>
        </Link>
    );
}
