'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, LogOut, Building2, Check, X, RefreshCw } from 'lucide-react';
import { formatDate } from '@/lib/utils';

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
        email: '',
        password: '',
    });

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
                body: JSON.stringify(credentials),
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
            <div className="min-h-screen py-12">
                <div className="container-custom max-w-md">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Building2 className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">College Admin</CardTitle>
                                    <CardDescription>Login to your dashboard</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                {error && (
                                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Email</label>
                                    <Input
                                        required
                                        type="email"
                                        value={credentials.email}
                                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                        placeholder="admin@college.edu"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Password</label>
                                    <Input
                                        required
                                        type="password"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                        placeholder="Enter your password"
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Logging in...
                                        </>
                                    ) : (
                                        'Login'
                                    )}
                                </Button>

                                <p className="text-sm text-center text-muted-foreground">
                                    Don&apos;t have an account?{' '}
                                    <a href="/register/college" className="text-primary hover:underline">
                                        Register College
                                    </a>
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="container-custom max-w-6xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">College Admin Dashboard</h1>
                        {adminData && (
                            <>
                                <p className="text-muted-foreground">{adminData.collegeName}</p>
                                <code className="text-sm bg-muted px-2 py-1 rounded mt-2 inline-block">
                                    {adminData.collegeCode}
                                </code>
                            </>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={fetchStats} disabled={statsLoading}>
                            <RefreshCw className={`h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Total Clubs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats?.approved_clubs ?? '-'}</p>
                            <p className="text-sm text-muted-foreground mt-1">Approved clubs</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Pending Approvals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats?.pending_clubs ?? '-'}</p>
                            <p className="text-sm text-muted-foreground mt-1">Awaiting review</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Total Views</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats?.total_views ?? '-'}</p>
                            <p className="text-sm text-muted-foreground mt-1">College page views</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pending Club Approvals</CardTitle>
                                <CardDescription>Review and approve new club registrations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pendingClubs.length > 0 ? (
                                    <div className="space-y-4">
                                        {pendingClubs.map((club) => (
                                            <div key={club.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div>
                                                    <h4 className="font-semibold">{club.name}</h4>
                                                    <p className="text-sm text-muted-foreground">{club.email}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Admin: {club.admin_name} • Applied: {formatDate(club.created_at)}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        onClick={() => handleClubAction(club.id, 'approve')}
                                                    >
                                                        <Check className="h-4 w-4 mr-1" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
                                    <div className="text-center py-8 text-muted-foreground">
                                        No pending approvals
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start">
                                            Edit College Details
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit College Details</DialogTitle>
                                            <DialogDescription>Update your college&apos;s public information</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleUpdateDetails} className="space-y-4 mt-4">
                                            <div>
                                                <label className="text-sm font-medium mb-1.5 block">College Name</label>
                                                <Input name="name" defaultValue={adminData?.collegeName} />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-1.5 block">Location</label>
                                                <Input name="location" placeholder="City, State" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-1.5 block">Website</label>
                                                <Input name="website" type="url" placeholder="https://" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-1.5 block">Description</label>
                                                <Textarea name="description" placeholder="About your college..." />
                                            </div>
                                            <Button type="submit" className="w-full" disabled={loading}>
                                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                <Button variant="outline" className="w-full justify-start">
                                    View All Clubs
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    Download Reports
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
