'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut, Edit, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
    email: string;
    role: 'college_admin' | 'club_admin';
    entityId: number;
}

export default function AdminDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Fetch user session/profile
        // For now, we assume the login redirect passed some state or we fetch from an API
        // But since we use httpOnly cookies, we need an endpoint to get current user info
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await fetch('/api/auth/me');
            const data = await response.json();
            if (data.success) {
                setUser(data.data);
            } else {
                router.push('/admin/login');
            }
        } catch (error) {
            router.push('/admin/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FFF5E6]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#FFF5E6]">
            {/* Navbar */}
            <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{user.email}</span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </nav>

            <div className="container mx-auto py-8 px-4">
                <h2 className="text-3xl font-bold mb-8">
                    Welcome, {user.role === 'college_admin' ? 'College Admin' : 'Club Admin'}
                </h2>

                {user.role === 'club_admin' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Edit className="h-5 w-5" />
                                Edit Club Details
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Update your club&apos;s description, about section, and contact information.
                            </p>
                            <Button className="w-full">Edit Details</Button>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Manage Announcements
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Post new announcements or manage existing ones.
                            </p>
                            <Button className="w-full">Manage Announcements</Button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-xl font-bold mb-4">College Management</h3>
                        <p className="text-gray-600">
                            Manage clubs and college settings.
                        </p>
                        {/* College admin features */}
                    </div>
                )}
            </div>
        </div>
    );
}
