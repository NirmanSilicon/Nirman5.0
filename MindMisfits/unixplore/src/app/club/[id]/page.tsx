'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Calendar, Megaphone, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface Club {
    id: number;
    name: string;
    description: string;
    about: string;
    email: string;
    slug: string;
}

export default function ClubPage() {
    const params = useParams();
    const [club, setClub] = useState<Club | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'about' | 'register' | 'announcements'>('about');

    useEffect(() => {
        if (params.id) {
            fetchClubData(params.id as string);
        }
    }, [params.id]);

    const fetchClubData = async (id: string) => {
        try {
            const response = await fetch(`/api/clubs/${id}`);
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
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-white" />
            </div>
        );
    }

    if (!club) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white">
                <h1 className="text-2xl font-bold mb-4">Club not found</h1>
                <Link href="/find-college" className="text-purple-400 hover:underline">
                    Go back to search
                </Link>
            </div>
        );
    }

    const shortName = club.name.includes(' - ') ? club.name.split(' - ')[0] : club.name;

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                <Link href={`/college/CLG-SOAITER`} className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to College
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar / Header Info */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
                        >
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-4xl font-bold text-white mb-6 shadow-lg shadow-purple-500/20">
                                {shortName.substring(0, 2).toUpperCase()}
                            </div>

                            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                                {shortName}
                            </h1>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0">
                                    Technical
                                </Badge>
                                <Badge variant="outline" className="text-gray-400 border-white/10">
                                    Active
                                </Badge>
                            </div>

                            <p className="text-gray-400 leading-relaxed mb-8">
                                {club.description}
                            </p>

                            <Button className="w-full" size="lg" variant="premium">
                                Join Club
                            </Button>
                        </motion.div>

                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-400">
                                    <Mail className="h-4 w-4 mr-3" />
                                    <span>{club.email || 'contact@club.com'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-8">
                        {/* Tabs */}
                        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                            {['about', 'register', 'announcements'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab
                                            ? 'bg-white text-black'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="min-h-[400px]"
                            >
                                {activeTab === 'about' && (
                                    <div className="prose prose-invert max-w-none">
                                        <h2 className="text-3xl font-bold text-white mb-6">About Us</h2>
                                        <div className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                                            {club.about || club.description}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'register' && (
                                    <div className="space-y-6">
                                        <h2 className="text-3xl font-bold text-white mb-6">Open Registrations</h2>
                                        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-1">Core Team Recruitment 2025</h3>
                                                    <p className="text-purple-300 text-sm">Deadline: Dec 31, 2024</p>
                                                </div>
                                                <Badge className="bg-purple-500 text-white border-0">Open</Badge>
                                            </div>
                                            <p className="text-gray-400 mb-6">
                                                We are looking for passionate individuals to join our core team.
                                                Roles available in Tech, Design, and Management.
                                            </p>
                                            <Button>Apply Now</Button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'announcements' && (
                                    <div className="space-y-6">
                                        <h2 className="text-3xl font-bold text-white mb-6">Latest Updates</h2>
                                        {[1, 2].map((i) => (
                                            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Megaphone className="h-4 w-4 text-yellow-500" />
                                                    <span className="text-sm text-gray-500">2 days ago</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2">Upcoming Hackathon Workshop</h3>
                                                <p className="text-gray-400">
                                                    Join us this weekend for a hands-on workshop on full-stack development.
                                                    Open to all years!
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
