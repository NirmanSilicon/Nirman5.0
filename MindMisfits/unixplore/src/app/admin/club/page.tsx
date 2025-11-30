'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Users, LogOut, LayoutDashboard, Megaphone, Calendar, Settings, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";

export default function ClubAdminPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);
    const [error, setError] = useState('');
    const [adminData, setAdminData] = useState<any>(null);

    const [credentials, setCredentials] = useState({
        clubId: '',
        password: '',
    });

    const [stats, setStats] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        const token = localStorage.getItem("club_token");
        if (token) {
            setIsLoggedIn(true);
            fetchStats();
            fetchProfile();
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("club_token");
            const res = await fetch("/api/admin/club/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) setAdminData(data.data);
        } catch (err) {}
    };

    const fetchStats = async () => {
        setStatsLoading(true);
        try {
            const token = localStorage.getItem("club_token");
            const res = await fetch("/api/admin/club/stats", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (data.success) {
                setStats(data.data);
            } else if (res.status === 401) {
                handleLogout();
            }
        } catch (error) {
            console.error(error);
        }
        setStatsLoading(false);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch("/api/auth/club/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem("club_token", data.data.token);
                setAdminData(data.data.club);
                setIsLoggedIn(true);
                fetchStats();
            } else {
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("Network error. Try again.");
        }
        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("club_token");
        setIsLoggedIn(false);
        setAdminData(null);
        setStats(null);
        setCredentials({ clubId: "", password: "" });
    };

    /* ===========================
       LOGIN SCREEN
       =========================== */
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-900/20 to-black" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full relative z-10">

                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                                <Users className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-white">Club Admin Login</CardTitle>
                            <CardDescription>Use your Club ID and admin password</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                {error && (
                                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Club ID</label>
                                    <Input
                                        required
                                        value={credentials.clubId}
                                        onChange={(e) => setCredentials({ ...credentials, clubId: e.target.value })}
                                        placeholder="CLB-123456"
                                        className="bg-white/5 border-white/10 focus:border-primary"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Password</label>
                                    <Input
                                        required
                                        type="password"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="bg-white/5 border-white/10 focus:border-primary"
                                    />
                                </div>

                                <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90" disabled={loading}>
                                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</> : "Login to Dashboard"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    /* ===========================
       DASHBOARD AFTER LOGIN
       =========================== */
    return (
        <div className="min-h-screen bg-background flex">

            {/* Sidebar */}
            <div className="w-64 bg-card border-r border-white/10 hidden md:flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-bold text-white">UniXplore</h2>
                            <p className="text-xs text-muted-foreground">Club Admin</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 py-6 px-4 space-y-2">
                    <Button variant={activeTab === "dashboard" ? "secondary" : "ghost"} className="w-full justify-start"
                        onClick={() => setActiveTab("dashboard")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                    </Button>

                    <Button variant={activeTab === "announcements" ? "secondary" : "ghost"} className="w-full justify-start"
                        onClick={() => setActiveTab("announcements")}>
                        <Megaphone className="mr-2 h-4 w-4" /> Announcements
                    </Button>

                    <Button variant={activeTab === "registrations" ? "secondary" : "ghost"} className="w-full justify-start"
                        onClick={() => setActiveTab("registrations")}>
                        <Calendar className="mr-2 h-4 w-4" /> Registrations
                    </Button>

                    <Button variant={activeTab === "settings" ? "secondary" : "ghost"} className="w-full justify-start"
                        onClick={() => setActiveTab("settings")}>
                        <Settings className="mr-2 h-4 w-4" /> Settings
                    </Button>
                </div>

                <div className="p-4 border-t border-white/10">
                    <Button variant="outline" className="w-full border-white/10 hover:bg-destructive/10 hover:text-destructive"
                        onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 border-b border-white/10 bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
                    <h1 className="text-xl font-semibold text-white">
                        {activeTab === "dashboard" && "Dashboard Overview"}
                        {activeTab === "announcements" && "Announcements"}
                        {activeTab === "registrations" && "Registrations"}
                        {activeTab === "settings" && "Club Settings"}
                    </h1>

                    <Button variant="outline" size="icon" onClick={fetchStats} className="border-white/10" disabled={statsLoading}>
                        <RefreshCw className={`h-4 w-4 ${statsLoading ? "animate-spin" : ""}`} />
                    </Button>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    {activeTab === "dashboard" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                            {/* CLUB NAME */}
                            <h1 className="text-4xl font-bold text-white">{adminData?.name}</h1>

                            {/* CLUB DESCRIPTION */}
                            <Card className="border-white/10 bg-card/50">
                                <CardHeader>
                                    <CardTitle>About the Club</CardTitle>
                                    <CardDescription>Your club overview</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-300 leading-relaxed">
                                        {adminData?.description || "No description provided"}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                                    <CardHeader><CardTitle className="text-sm">Announcements</CardTitle></CardHeader>
                                    <CardContent><div className="text-4xl font-bold">{stats?.announcement_count ?? '-'}</div></CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                                    <CardHeader><CardTitle className="text-sm">Active Registrations</CardTitle></CardHeader>
                                    <CardContent><div className="text-4xl font-bold">{stats?.active_registrations ?? '-'}</div></CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                                    <CardHeader><CardTitle className="text-sm">Total Views</CardTitle></CardHeader>
                                    <CardContent><div className="text-4xl font-bold">{stats?.total_views ?? '-'}</div></CardContent>
                                </Card>
                            </div>

                        </motion.div>
                    )}

                    {/* Other Tabs Placeholder */}
                    {activeTab !== "dashboard" && (
                        <div className="text-white text-center py-20">🚧 Coming Soon</div>
                    )}
                </main>
            </div>
        </div>
    );
}
