'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Users,
    Building2,
    Mail,
    Lock,
    User,
    Tag,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClubRegistrationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [createdClubId, setCreatedClubId] = useState("");

    // STATIC CATEGORIES — FIXED 6
    const categories = [
        { id: 1, name: "Technical" },
        { id: 2, name: "Media" },
        { id: 3, name: "Sports" },
        { id: 4, name: "Innovation" },
        { id: 5, name: "Cultural" },
        { id: 6, name: "Social" },
    ];

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
                setCreatedClubId(data.clubId);   // store clubId for showing
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

    // ------------------------------------------------------------
    //            SUCCESS SCREEN (CLEAN) — NO PENDING MESSAGE
    // ------------------------------------------------------------
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
                                <h2 className="text-3xl font-bold mb-2 text-white">
                                    Registration Successful!
                                </h2>

                                <p className="text-muted-foreground mb-4">
                                    Your club has been registered successfully.
                                </p>

                                <div className="bg-black/40 p-6 rounded-2xl border border-white/10 mb-6 space-y-4">

                                    <p className="text-lg font-semibold text-white">
                                        Your Club ID:
                                    </p>

                                    <p className="text-3xl font-bold text-primary tracking-wide">
                                        {createdClubId}
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        Save this ID — you will need it for login.
                                    </p>

                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href="/admin/club" className="w-full">
                                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                                        Go to Club Login
                                    </Button>
                                </Link>
                                <Link href="/" className="w-full">
                                    <Button size="lg" variant="outline" className="w-full border-white/10 hover:bg-white/5">
                                        Back to Home
                                    </Button>
                                </Link>
                            </div>

                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    // ------------------------------------------------------------
    //                      MAIN REGISTRATION FORM
    // ------------------------------------------------------------
    return (
        <div className="min-h-screen flex flex-col lg:flex-row">

            {/* Left Visual Section */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-bl from-purple-900/20 via-primary/20 to-black z-0" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 z-0" />

                <div className="relative z-10 p-12 text-center space-y-6 max-w-lg">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <h1 className="text-5xl font-bold text-white mb-4">Start a Community</h1>
                        <p className="text-xl text-gray-400">Create a space for students to connect and grow together.</p>
                    </motion.div>
                </div>
            </div>

            {/* Right Form Section */}
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
                            <h2 className="text-3xl font-bold text-white">Register Club</h2>
                            <p className="text-muted-foreground mt-2">Enter your club details to get started.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* ERROR BOX */}
                            {error && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
                                    {error}
                                </motion.div>
                            )}

                            {/* FORM FIELDS */}
                            <div className="space-y-4">

                                {/* Club Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Club Name</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g., Google Developer Group"
                                            className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                                        />
                                    </div>
                                </div>

                                {/* College ID */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">College ID</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            required
                                            value={formData.collegeId}
                                            onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })}
                                            placeholder="CLG-XXXXXX"
                                            className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                                        />
                                    </div>
                                </div>

                                {/* Club Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Club Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="club@college.edu"
                                            className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                                        />
                                    </div>
                                </div>

                                {/* Category (STATIC DROPDOWN) */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Category</label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <select
                                            required
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 pl-10 text-sm"
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id} className="bg-background">
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Description</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Textarea
                                            required
                                            minLength={50}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe your club..."
                                            className="pl-10 bg-white/5 border-white/10 focus:border-primary min-h-[100px]"
                                        />
                                    </div>
                                </div>

                                {/* Admin Details */}
                                <div className="pt-4 border-t border-white/10">
                                    <h3 className="font-semibold mb-4 text-white">Admin Account</h3>

                                    {/* Admin Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Admin Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                required
                                                value={formData.adminName}
                                                onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                                                placeholder="Your full name"
                                                className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    {/* Admin Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Admin Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                required
                                                type="email"
                                                value={formData.adminEmail}
                                                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                                                placeholder="admin@example.com"
                                                className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    {/* Admin Password */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                required
                                                type="password"
                                                minLength={8}
                                                value={formData.adminPassword}
                                                onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                                                placeholder="••••••••"
                                                className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button type="submit" className="w-full h-12 text-lg bg-primary hover:bg-primary/90" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Register Club'
                                )}
                            </Button>

                            <p className="text-sm text-center text-muted-foreground">
                                Already registered?{' '}
                                <Link href="/admin/club" className="text-primary hover:underline font-medium">
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
