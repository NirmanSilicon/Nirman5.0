'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, LogOut, Building2, Check, X, RefreshCw, LayoutDashboard, Users, Settings, FileText, ChevronRight, Search } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Stats {
    approved_clubs: number;
    pending_clubs: number;
    total_views: number;
}

interface PendingClub {
    id: number;
    name: string;
    email: string;
    admin_name: string;
    created_at: string;
}

export default function CollegeAdminPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);
    const [error, setError] = useState('');
    const [adminData, setAdminData] = useState<any>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [pendingClubs, setPendingClubs] = useState<PendingClub[]>([]);
    const [credentials, setCredentials] = useState({
    collegeId: '',
    password: '',
});

    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        const token = localStorage.getItem('college_token');
        if (token) {
            setIsLoggedIn(true);
            fetchStats();
        }
    }, []);

    const fetchStats = async () => {
        setStatsLoading(true);
        try {
            const token = localStorage.getItem('college_token');
            const response = await fetch('/api/admin/college/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success) {
                setStats(data.data.stats);
                setPendingClubs(data.data.pendingClubs);
            } else {
                if (response.status === 401) handleLogout();
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/college/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
    collegeId: credentials.collegeId,
    adminPassword: credentials.password,
}),

            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('college_token', data.data.token);
                setAdminData(data.data.admin);
                setIsLoggedIn(true);
                fetchStats();
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('college_token');
        setIsLoggedIn(false);
        setAdminData(null);
        setStats(null);
        setCredentials({ email: '', password: '' });
    };

    const handleClubAction = async (clubId: number, action: 'approve' | 'reject') => {
        try {
            const token = localStorage.getItem('college_token');
            const response = await fetch('/api/admin/college/approve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ clubId, action }),
            });

            const data = await response.json();
            if (data.success) {
                fetchStats();
                toast({ title: "Success", description: `Club ${action}ed successfully` });
            } else {
                toast({ title: "Error", description: data.error || 'Action failed', variant: "destructive" });
            }
        } catch (error) {
            console.error('Error updating club:', error);
            toast({ title: "Error", description: "Failed to update club status", variant: "destructive" });
        }
    };

    const handleUpdateDetails = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const token = localStorage.getItem('college_token');
            const response = await fetch('/api/admin/college/details', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast({ title: "Success", description: "College details updated successfully" });
            } else {
                toast({ title: "Error", description: "Failed to update details", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Network error", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (!isLoggedIn) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-900/20 to-black z-0" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 z-0" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full relative z-10"
            >
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                            <Building2 className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-white">College Admin Login</CardTitle>
                        <CardDescription>Use your College ID and admin password</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                                    {error}
                                </div>
                            )}

                            {/* COLLEGE ID */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">College ID</label>
                                <Input
                                    required
                                    value={credentials.collegeId}
                                    onChange={(e) => setCredentials({ ...credentials, collegeId: e.target.value })}
                                    placeholder="CLG-123456"
                                    className="bg-white/5 border-white/10 focus:border-primary"
                                />
                            </div>

                            {/* PASSWORD */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Admin Password</label>
                                <Input
                                    required
                                    type="password"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="bg-white/5 border-white/10 focus:border-primary"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-primary hover:bg-primary/90"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    'Login to Dashboard'
                                )}
                            </Button>

                            <p className="text-sm text-center text-muted-foreground">
                                Don&apos;t have an account?{' '}
                                <a href="/register/college" className="text-primary hover:underline font-medium">
                                    Register College
                                </a>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <div className="w-64 bg-card border-r border-white/10 hidden md:flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-bold text-white">UniXplore</h2>
                            <p className="text-xs text-muted-foreground">College Admin</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 py-6 px-4 space-y-2">
                    <Button
                        variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                    </Button>
                    <Button
                        variant={activeTab === 'clubs' ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('clubs')}
                    >
                        <Users className="mr-2 h-4 w-4" />
                        Clubs & Approvals
                    </Button>
                    <Button
                        variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('settings')}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Button>
                </div>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">AD</span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate text-white">Admin</p>
                            <p className="text-xs text-muted-foreground truncate">{adminData?.collegeCode}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full border-white/10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-white/10 bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
                    <h1 className="text-xl font-semibold text-white">
                        {activeTab === 'dashboard' && 'Dashboard Overview'}
                        {activeTab === 'clubs' && 'Manage Clubs'}
                        {activeTab === 'settings' && 'College Settings'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={fetchStats} disabled={statsLoading} className="border-white/10">
                            <RefreshCw className={`h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </header>

                {/* Content Scrollable Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-6xl mx-auto space-y-8">
                        {activeTab === 'dashboard' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium text-blue-400">Total Clubs</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-4xl font-bold text-white">{stats?.approved_clubs ?? '-'}</div>
                                            <p className="text-xs text-muted-foreground mt-1">Active communities</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium text-amber-400">Pending Approvals</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-4xl font-bold text-white">{stats?.pending_clubs ?? '-'}</div>
                                            <p className="text-xs text-muted-foreground mt-1">Requiring action</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium text-purple-400">Total Views</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-4xl font-bold text-white">{stats?.total_views ?? '-'}</div>
                                            <p className="text-xs text-muted-foreground mt-1">Profile engagement</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Recent Activity / Pending Approvals Preview */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <Card className="border-white/10 bg-card/50">
                                        <CardHeader>
                                            <CardTitle>Pending Approvals</CardTitle>
                                            <CardDescription>Recent club registration requests</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {pendingClubs.length > 0 ? (
                                                <div className="space-y-4">
                                                    {pendingClubs.slice(0, 3).map((club) => (
                                                        <div key={club.id} className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-background/50">
                                                            <div>
                                                                <h4 className="font-semibold text-white">{club.name}</h4>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    Applied: {formatDate(club.created_at)}
                                                                </p>
                                                            </div>
                                                            <Button size="sm" onClick={() => setActiveTab('clubs')}>Review</Button>
                                                        </div>
                                                    ))}
                                                    {pendingClubs.length > 3 && (
                                                        <Button variant="ghost" className="w-full text-xs" onClick={() => setActiveTab('clubs')}>
                                                            View all {pendingClubs.length} pending requests
                                                        </Button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-muted-foreground">
                                                    No pending approvals
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card className="border-white/10 bg-card/50">
                                        <CardHeader>
                                            <CardTitle>Quick Actions</CardTitle>
                                            <CardDescription>Manage your college profile</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <Button variant="outline" className="w-full justify-between group border-white/10 hover:bg-white/5" onClick={() => setActiveTab('settings')}>
                                                <span className="flex items-center"><Settings className="mr-2 h-4 w-4 text-muted-foreground" /> Edit College Details</span>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                            <Button variant="outline" className="w-full justify-between group border-white/10 hover:bg-white/5" onClick={() => setActiveTab('clubs')}>
                                                <span className="flex items-center"><Users className="mr-2 h-4 w-4 text-muted-foreground" /> View All Clubs</span>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                            <Button variant="outline" className="w-full justify-between group border-white/10 hover:bg-white/5">
                                                <span className="flex items-center"><FileText className="mr-2 h-4 w-4 text-muted-foreground" /> Download Reports</span>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'clubs' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <Card className="border-white/10 bg-card/50">
                                    <CardHeader>
                                        <CardTitle>Club Approvals</CardTitle>
                                        <CardDescription>Review and manage club registration requests</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {pendingClubs.length > 0 ? (
                                            <div className="space-y-4">
                                                {pendingClubs.map((club) => (
                                                    <div key={club.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-white/10 rounded-xl bg-background/50 gap-4">
                                                        <div>
                                                            <h4 className="text-lg font-semibold text-white">{club.name}</h4>
                                                            <div className="flex flex-col md:flex-row gap-2 md:gap-6 mt-2 text-sm text-muted-foreground">
                                                                <span className="flex items-center"><Users className="h-3 w-3 mr-1" /> Admin: {club.admin_name}</span>
                                                                <span className="flex items-center"><Search className="h-3 w-3 mr-1" /> {club.email}</span>
                                                                <span>Applied: {formatDate(club.created_at)}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <Button
                                                                size="sm"
                                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                                onClick={() => handleClubAction(club.id, 'approve')}
                                                            >
                                                                <Check className="h-4 w-4 mr-1" />
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="border-destructive/50 text-destructive hover:bg-destructive/10"
                                                                onClick={() => handleClubAction(club.id, 'reject')}
                                                            >
                                                                <X className="h-4 w-4 mr-1" />
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                                <Check className="h-12 w-12 mb-4 opacity-20" />
                                                <p>All caught up! No pending approvals.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <Card className="border-white/10 bg-card/50">
                                    <CardHeader>
                                        <CardTitle>College Settings</CardTitle>
                                        <CardDescription>Update your institution's public profile</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleUpdateDetails} className="space-y-6 max-w-2xl">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">College Name</label>
                                                <Input name="name" defaultValue={adminData?.collegeName} className="bg-white/5 border-white/10" />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Location</label>
                                                    <Input name="location" placeholder="City, State" className="bg-white/5 border-white/10" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Website</label>
                                                    <Input name="website" type="url" placeholder="https://" className="bg-white/5 border-white/10" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Description</label>
                                                <Textarea name="description" placeholder="About your college..." className="bg-white/5 border-white/10 min-h-[120px]" />
                                            </div>
                                            <Button type="submit" disabled={loading}>
                                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
