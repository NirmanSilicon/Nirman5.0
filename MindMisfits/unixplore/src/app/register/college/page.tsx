'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function CollegeRegistrationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [collegeId, setCollegeId] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        city: '',
        state: '',
        officialWebsite: '',
        officialEmail: '',
        adminEmail: '',
        adminPassword: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/college/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setCollegeId(data.data.collegeId);
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
                                <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
                                <p className="text-muted-foreground mb-6">
                                    Your college has been registered successfully.
                                </p>
                                <div className="bg-muted p-4 rounded-lg mb-6">
                                    <p className="text-sm text-muted-foreground mb-2">Your College ID:</p>
                                    <code className="text-2xl font-mono font-bold">{collegeId}</code>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Save this ID - you&apos;ll need it for future reference
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href="/admin/college">
                                    <Button size="lg">Go to Dashboard</Button>
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
                        <CardTitle className="text-3xl">Register Your College</CardTitle>
                        <CardDescription>
                            Fill in the details to register your college on UniXplore
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
                                        College/University Name *
                                    </label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Siksha &apos;O&apos; Anusandhan University"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Location *
                                    </label>
                                    <Input
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g., Bhubaneswar, Odisha"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">City</label>
                                        <Input
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            placeholder="e.g., Bhubaneswar"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">State</label>
                                        <Input
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            placeholder="e.g., Odisha"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Official Website
                                    </label>
                                    <Input
                                        type="url"
                                        value={formData.officialWebsite}
                                        onChange={(e) => setFormData({ ...formData, officialWebsite: e.target.value })}
                                        placeholder="https://www.example.edu"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Official College Email *
                                    </label>
                                    <Input
                                        required
                                        type="email"
                                        value={formData.officialEmail}
                                        onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                                        placeholder="info@college.edu"
                                    />
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="font-semibold mb-4">Admin Account</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Admin Email *
                                            </label>
                                            <Input
                                                required
                                                type="email"
                                                value={formData.adminEmail}
                                                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                                                placeholder="admin@college.edu"
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
                                        Registering...
                                    </>
                                ) : (
                                    'Register College'
                                )}
                            </Button>

                            <p className="text-sm text-center text-muted-foreground">
                                Already registered?{' '}
                                <Link href="/admin/college" className="text-primary hover:underline">
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
