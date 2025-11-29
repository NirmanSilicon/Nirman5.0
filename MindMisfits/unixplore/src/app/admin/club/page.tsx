'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, LogOut, Users, RefreshCw } from 'lucide-react';

interface Stats {
    announcement_count: number;
    active_registrations: number;
    total_views: number;
}

export default function ClubAdminPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);
    const [error, setError] = useState('');
    const [adminData, setAdminData] = useState<any>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('club_token');
        if (token) {
            setIsLoggedIn(true);
            fetchStats();
        }
    }, []);

    const fetchStats = async () => {
        setStatsLoading(true);
        try {
            const token = localStorage.getItem('club_token');
            const response = await fetch('/api/admin/club/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success) {
                setStats(data.data);
                // If we have admin data in the response, update it. 
                // Currently stats API might not return full admin profile, but we can assume token is valid.
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
            const response = await fetch('/api/auth/club/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('club_token', data.data.token);
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
        localStorage.removeItem('club_token');
        setIsLoggedIn(false);
        setAdminData(null);
        setStats(null);
        setCredentials({ email: '', password: '' });
    };

    const handleUpdateDetails = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const token = localStorage.getItem('club_token');
            const response = await fetch('/api/admin/club/details', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast({ title: "Success", description: "Club details updated successfully" });
            } else {
                toast({ title: "Error", description: "Failed to update details", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Network error", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handlePostAnnouncement = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const token = localStorage.getItem('club_token');
            const response = await fetch('/api/admin/club/announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(Object.fromEntries(formData)),
            });

            if (response.ok) {
                toast({ title: "Success", description: "Announcement posted" });
                fetchStats();
                (e.target as HTMLFormElement).reset();
            } else {
                toast({ title: "Error", description: "Failed to post announcement", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Network error", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleAddRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const token = localStorage.getItem('club_token');
            const response = await fetch('/api/admin/club/registrations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(Object.fromEntries(formData)),
            });

            if (response.ok) {
                toast({ title: "Success", description: "Registration link added" });
                fetchStats();
                (e.target as HTMLFormElement).reset();
            } else {
                toast({ title: "Error", description: "Failed to add registration", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Network error", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            approved: { variant: 'default', label: 'Approved' },
            pending: { variant: 'secondary', label: 'Pending Approval' },
            rejected: { variant: 'destructive', label: 'Rejected' },
        };
        const config = variants[status] || variants.pending;
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen py-12">
                <div className="container-custom max-w-md">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Club Admin</CardTitle>
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
                                        placeholder="admin@example.com"
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
                                    <a href="/register/club" className="text-primary hover:underline">
                                        Register Club
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
                        <h1 className="text-3xl font-bold mb-2">Club Admin Dashboard</h1>
                        {adminData && (
                            <>
                                <p className="text-muted-foreground mb-2">{adminData.clubName}</p>
                                {adminData.clubStatus && getStatusBadge(adminData.clubStatus)}
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

                {adminData?.clubStatus === 'pending' && (
                    <Card className="mb-8 border-yellow-200 bg-yellow-50">
                        <CardContent className="pt-6">
                            <p className="text-sm">
                                <strong>Pending Approval:</strong> Your club registration is awaiting approval from your college admin.
                                You&apos;ll be able to access all dashboard features once approved.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {adminData?.clubStatus === 'rejected' && (
                    <Card className="mb-8 border-destructive bg-destructive/10">
                        <CardContent className="pt-6">
                            <p className="text-sm text-destructive">
                                <strong>Registration Rejected:</strong> Your club registration was not approved.
                                Please contact your college admin for more information.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {(!adminData?.clubStatus || adminData?.clubStatus === 'approved') && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Announcements</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold">{stats?.announcement_count ?? '-'}</p>
                                    <p className="text-sm text-muted-foreground mt-1">Published</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Registrations</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold">{stats?.active_registrations ?? '-'}</p>
                                    <p className="text-sm text-muted-foreground mt-1">Active</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Page Views</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold">{stats?.total_views ?? '-'}</p>
                                    <p className="text-sm text-muted-foreground mt-1">Total views</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Dashboard Features</CardTitle>
                                <CardDescription>Manage your club content</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Edit Details Dialog */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                                <h3 className="font-semibold mb-2">Edit Club Details</h3>
                                                <p className="text-sm text-muted-foreground mb-3">
                                                    Update description, contact info, and social links
                                                </p>
                                                <Button variant="outline" size="sm">Edit Details</Button>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>Edit Club Details</DialogTitle>
                                                <DialogDescription>Update your club&apos;s public information</DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleUpdateDetails} className="space-y-4 mt-4">
                                                <div>
                                                    <label className="text-sm font-medium mb-1.5 block">Description</label>
                                                    <Textarea
                                                        name="description"
                                                        placeholder="About your club..."
                                                        className="min-h-[100px]"
                                                        defaultValue={adminData?.description}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium mb-1.5 block">Email</label>
                                                        <Input name="email" type="email" defaultValue={adminData?.email} />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1.5 block">Phone</label>
                                                        <Input name="phone" type="tel" defaultValue={adminData?.phone} />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium mb-1.5 block">Website</label>
                                                        <Input name="website" type="url" placeholder="https://" defaultValue={adminData?.website} />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1.5 block">Instagram</label>
                                                        <Input name="instagram" placeholder="@username" defaultValue={adminData?.instagram} />
                                                    </div>
                                                </div>
                                                <Button type="submit" className="w-full" disabled={loading}>
                                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                                                </Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>

                                    {/* New Announcement Dialog */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                                <h3 className="font-semibold mb-2">Post Announcement</h3>
                                                <p className="text-sm text-muted-foreground mb-3">
                                                    Create and publish announcements for your club members
                                                </p>
                                                <Button variant="outline" size="sm">New Announcement</Button>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>New Announcement</DialogTitle>
                                                <DialogDescription>Post an update for your club members</DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handlePostAnnouncement} className="space-y-4 mt-4">
                                                <div>
                                                    <label className="text-sm font-medium mb-1.5 block">Title</label>
                                                    <Input name="title" required placeholder="Announcement Title" />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium mb-1.5 block">Content</label>
                                                    <Textarea
                                                        name="content"
                                                        required
                                                        placeholder="Write your announcement here..."
                                                        className="min-h-[150px]"
                                                    />
                                                </div>
                                                <Button type="submit" className="w-full" disabled={loading}>
                                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Post Announcement'}
                                                </Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Add Registration Dialog */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                                <h3 className="font-semibold mb-2">Manage Registrations</h3>
                                                <p className="text-sm text-muted-foreground mb-3">
                                                    Add registration links and manage recruitment drives
                                                </p>
                                                <Button variant="outline" size="sm">Add Registration</Button>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add Registration Link</DialogTitle>
                                                <DialogDescription>Create a new registration event</DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleAddRegistration} className="space-y-4 mt-4">
                                                <div>
                                                    <label className="text-sm font-medium mb-1.5 block">Event Title</label>
                                                    <Input name="title" required placeholder="e.g. Winter Recruitment 2024" />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium mb-1.5 block">Registration Link</label>
                                                    <Input name="link" type="url" required placeholder="https://forms.google.com/..." />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium mb-1.5 block">Deadline (Optional)</label>
                                                    <Input name="deadline" type="datetime-local" />
                                                </div>
                                                <Button type="submit" className="w-full" disabled={loading}>
                                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Registration'}
                                                </Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}
