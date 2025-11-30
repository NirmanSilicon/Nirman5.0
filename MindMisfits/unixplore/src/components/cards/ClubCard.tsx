import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, ArrowRight, Users } from 'lucide-react';
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
        <Link href={`/clubs/${id}`} className="block h-full group">
            <Card className="h-full flex flex-col bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                            <Users className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                        </div>
                        <Badge className={`${getCategoryColor(categorySlug)} border-0`}>
                            {categoryName}
                        </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300">
                        {name}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-gray-400 leading-relaxed">
                        {truncate(description, 120)}
                    </CardDescription>
                </CardHeader>

                <CardContent className="mt-auto relative z-10 pt-0">
                    <div className="mt-4">
                        <Button className="w-full bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 hover:border-white transition-all duration-300 group/btn pointer-events-none">
                            View Club
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
