'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2, CheckCircle2, Building2, MapPin, Globe, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

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
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full"
                >
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardContent className="pt-12 pb-12 text-center space-y-6">
                            <div className="flex justify-center">
                                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce">
                                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-2 text-white">Registration Successful!</h2>
                                <p className="text-muted-foreground mb-6">
                                    Your college has been registered successfully.
                                </p>
                                <div className="bg-black/40 p-6 rounded-2xl border border-white/10 mb-6">
                                    <p className="text-sm text-muted-foreground mb-2">Your College ID:</p>
                                    <code className="text-3xl font-mono font-bold text-primary tracking-wider">{collegeId}</code>
                                    <p className="text-xs text-muted-foreground mt-3">
                                        Save this ID - you'll need it for future reference
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href="/admin/college" className="w-full">
                                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90">Go to Dashboard</Button>
                                </Link>
                                <Link href="/" className="w-full">
                                    <Button size="lg" variant="outline" className="w-full border-white/10 hover:bg-white/5">Back to Home</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-900/20 to-black z-0" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 z-0" />

                <div className="relative z-10 p-12 text-center space-y-6 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-5xl font-bold text-white mb-4">Join the Network</h1>
                        <p className="text-xl text-gray-400">
                            Register your institution to unlock a world of opportunities for your students.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-2 gap-4 mt-12"
                    >
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <h3 className="text-2xl font-bold text-white">50+</h3>
                            <p className="text-sm text-gray-400">Colleges</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <h3 className="text-2xl font-bold text-white">1000+</h3>
                            <p className="text-sm text-gray-400">Clubs</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 bg-background flex flex-col">
                <div className="p-6">
                    <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-white">Register College</h2>
                            <p className="text-muted-foreground mt-2">Enter your institution details to get started.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">College Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Siksha 'O' Anusandhan University"
                                            className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">City</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                placeholder="Bhubaneswar"
                                                className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">State</label>
                                        <Input
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            placeholder="Odisha"
                                            className="bg-white/5 border-white/10 focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Official Website</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="url"
                                            value={formData.officialWebsite}
                                            onChange={(e) => setFormData({ ...formData, officialWebsite: e.target.value })}
                                            placeholder="https://www.example.edu"
                                            className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Official Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            required
                                            type="email"
                                            value={formData.officialEmail}
                                            onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                                            placeholder="info@college.edu"
                                            className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <h3 className="font-semibold mb-4 text-white">Admin Account</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Admin Email</label>
                                            <Input
                                                required
                                                type="email"
                                                value={formData.adminEmail}
                                                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                                                placeholder="admin@college.edu"
                                                className="bg-white/5 border-white/10 focus:border-primary"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    required
                                                    type="password"
                                                    value={formData.adminPassword}
                                                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                                                    placeholder="••••••••"
                                                    minLength={8}
                                                    className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg bg-primary hover:bg-primary/90" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Registering...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>

                            <p className="text-sm text-center text-muted-foreground">
                                Already registered?{' '}
                                <Link href="/admin/college" className="text-primary hover:underline font-medium">
                                    Login to Dashboard
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
