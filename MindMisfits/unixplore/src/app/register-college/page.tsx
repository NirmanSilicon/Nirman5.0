'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

export default function RegisterCollegePage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#FFF5E6] flex items-center justify-center px-4">
                <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full text-center">
                    <h2 className="text-3xl font-bold mb-4 text-green-600">Registration Submitted!</h2>
                    <p className="text-gray-600 mb-8">
                        Thank you for registering your college. Our team will review your application and contact you shortly at your official email.
                    </p>
                    <Button
                        onClick={() => setSubmitted(false)}
                        className="bg-black text-white hover:bg-gray-800 rounded-full px-8"
                    >
                        Register Another
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF5E6] py-12 px-4 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tight text-black text-center">
                REGISTER YOUR COLLEGE
            </h1>

            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-2xl w-full">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-lg font-bold">College Name</Label>
                        <Input id="name" required placeholder="e.g. Institute of Technical Education..." className="h-12 rounded-xl" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="city" className="text-lg font-bold">City</Label>
                            <Input id="city" required placeholder="e.g. Bhubaneswar" className="h-12 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state" className="text-lg font-bold">State</Label>
                            <Input id="state" required placeholder="e.g. Odisha" className="h-12 rounded-xl" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-lg font-bold">Official Email</Label>
                        <Input id="email" type="email" required placeholder="admin@college.edu" className="h-12 rounded-xl" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="website" className="text-lg font-bold">Website</Label>
                        <Input id="website" type="url" placeholder="https://..." className="h-12 rounded-xl" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-lg font-bold">Additional Details</Label>
                        <Textarea id="description" placeholder="Tell us about your college..." className="min-h-[100px] rounded-xl" />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 text-xl font-bold rounded-full bg-black text-white hover:bg-gray-800 mt-8"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Submit Registration'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
