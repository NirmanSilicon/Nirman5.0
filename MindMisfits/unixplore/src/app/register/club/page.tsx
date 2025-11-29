'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
}

export default function ClubRegistrationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        collegeId: '',
        email: '',
        categoryId: '',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
        description: '',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            const data = await response.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/club/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    categoryId: parseInt(formData.categoryId),
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen py-12">
                <div className="container-custom max-w-2xl">
                    <Card>
                        <CardContent className="pt-12 pb-12 text-center space-y-6">
                            <div className="flex justify-center">
                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Registration Submitted!</h2>
                                <p className="text-muted-foreground mb-4">
                                    Your club registration has been submitted successfully.
                                </p>
                                <div className="bg-muted p-4 rounded-lg mb-6">
                                    <p className="text-sm">
                                        Your registration is pending approval from the college admin.
                                        You&apos;ll be able to access your dashboard once approved.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href="/admin/club">
                                    <Button size="lg">Try Login</Button>
                                </Link>
                                <Link href="/">
                                    <Button size="lg" variant="outline">Back to Home</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="container-custom max-w-2xl">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                </Link>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">Register Your Club</CardTitle>
                        <CardDescription>
                            Fill in the details to register your club on UniXplore
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Club Name *
                                    </label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Google Developer Group"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        College ID or Name *
                                    </label>
                                    <Input
                                        required
                                        value={formData.collegeId}
                                        onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })}
                                        placeholder="CLG-XXXXXX or College Name"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Enter your college&apos;s ID (e.g., CLG-100001) or search by name
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Club Email *
                                    </label>
                                    <Input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="club@college.edu"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Category *
                                    </label>
                                    <select
                                        required
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Description *
                                    </label>
                                    <Textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe your club in at least 50 characters..."
                                        rows={4}
                                        minLength={50}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formData.description.length} / 50 minimum characters
                                    </p>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="font-semibold mb-4">Admin Account</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Admin Name *
                                            </label>
                                            <Input
                                                required
                                                value={formData.adminName}
                                                onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                                                placeholder="Your full name"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Admin Email *
                                            </label>
                                            <Input
                                                required
                                                type="email"
                                                value={formData.adminEmail}
                                                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                                                placeholder="admin@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Admin Password *
                                            </label>
                                            <Input
                                                required
                                                type="password"
                                                value={formData.adminPassword}
                                                onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                                                placeholder="Minimum 8 characters"
                                                minLength={8}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Register Club'
                                )}
                            </Button>

                            <p className="text-sm text-center text-muted-foreground">
                                Already registered?{' '}
                                <Link href="/admin/club" className="text-primary hover:underline">
                                    Login to Dashboard
                                </Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
