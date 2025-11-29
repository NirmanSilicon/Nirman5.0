'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, ExternalLink, Calendar, Loader2 } from 'lucide-react';
import { getCategoryColor, formatDate } from '@/lib/utils';

interface Announcement {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

interface Registration {
    id: number;
    title: string;
    description: string;
    registration_link: string;
    start_date: string;
    end_date: string;
    status: string;
    created_at: string;
}

interface Club {
    id: number;
    name: string;
    email: string;
    description: string;
    about: string;
    contact_info: any;
    category_name: string;
    category_slug: string;
    college_id: number;
    college_name: string;
    college_code: string;
    announcements: Announcement[];
    registrations: Registration[];
}

export default function ClubPage() {
    const params = useParams();
    const [club, setClub] = useState<Club | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClub();
    }, [params.id]);

    const fetchClub = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/clubs/${params.id}`);
            const data = await response.json();

            if (data.success) {
                setClub(data.data);
            }
        } catch (error) {
            console.error('Error fetching club:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!club) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Club not found</h1>
                    <Link href="/colleges">
                        <Button>Back to Colleges</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="container-custom max-w-5xl">
                {/* Back Button */}
                <Link
                    href={`/colleges/${club.college_id}`}
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to {club.college_name}
                </Link>

                {/* Club Header */}
                <div className="mb-12">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <h1 className="text-3xl md:text-4xl font-bold flex-1">{club.name}</h1>
                        <Badge className={getCategoryColor(club.category_slug)}>
                            {club.category_name}
                        </Badge>
                    </div>
                    <p className="text-lg text-muted-foreground mb-4">{club.description}</p>
                    <Link href={`/colleges/${club.college_id}`} className="text-sm text-primary hover:underline">
                        {club.college_name} ({club.college_code})
                    </Link>
                </div>

                {/* About Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">About</h2>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="rich-text prose prose-slate max-w-none">
                                {club.about ? (
                                    <p className="whitespace-pre-wrap">{club.about}</p>
                                ) : (
                                    <p className="text-muted-foreground">No additional information available.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Contact Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Contact</h2>
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <a href={`mailto:${club.email}`} className="text-primary hover:underline">
                                    {club.email}
                                </a>
                            </div>
                            {club.contact_info && club.contact_info.phone && (
                                <div className="flex items-center gap-3">
                                    <span className="text-muted-foreground">Phone:</span>
                                    <span>{club.contact_info.phone}</span>
                                </div>
                            )}
                            {club.contact_info && club.contact_info.socialLinks && club.contact_info.socialLinks.length > 0 && (
                                <div className="pt-2">
                                    <p className="text-sm font-medium mb-2">Social Links:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {club.contact_info.socialLinks.map((link: any, index: number) => (
                                            <a
                                                key={index}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                            >
                                                {link.platform}
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>

                {/* Registrations Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Registrations</h2>
                    {club.registrations && club.registrations.length > 0 ? (
                        <div className="space-y-4">
                            {club.registrations.map((reg) => (
                                <Card key={reg.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <CardTitle className="text-lg">{reg.title}</CardTitle>
                                            <Badge variant={reg.status === 'open' ? 'default' : 'secondary'}>
                                                {reg.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {reg.description && (
                                            <p className="text-sm text-muted-foreground">{reg.description}</p>
                                        )}
                                        {(reg.start_date || reg.end_date) && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                {reg.start_date && <span>From {formatDate(reg.start_date)}</span>}
                                                {reg.end_date && <span>to {formatDate(reg.end_date)}</span>}
                                            </div>
                                        )}
                                        {reg.registration_link && (
                                            <a href={reg.registration_link} target="_blank" rel="noopener noreferrer">
                                                <Button variant="default" size="sm">
                                                    Register Now
                                                    <ExternalLink className="ml-2 h-4 w-4" />
                                                </Button>
                                            </a>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-muted-foreground">No active registrations at the moment.</p>
                            </CardContent>
                        </Card>
                    )}
                </section>

                {/* Announcements Section */}
                <section>
                    <h2 className="text-2xl font-bold mb-4">Announcements</h2>
                    {club.announcements && club.announcements.length > 0 ? (
                        <div className="space-y-4">
                            {club.announcements.map((announcement) => (
                                <Card key={announcement.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <CardTitle className="text-lg">{announcement.title}</CardTitle>
                                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                                                {formatDate(announcement.created_at)}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div
                                            className="rich-text prose prose-slate max-w-none"
                                            dangerouslySetInnerHTML={{ __html: announcement.content }}
                                        />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-muted-foreground">No announcements yet.</p>
                            </CardContent>
                        </Card>
                    )}
                </section>
            </div>
        </div>
    );
}
