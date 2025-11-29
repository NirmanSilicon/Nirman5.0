'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

export default function RegisterClubPage() {
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
                        Thank you for registering your club. We will verify your details with the college administration and get back to you.
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
                REGISTER YOUR CLUB
            </h1>

            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-2xl w-full">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="collegeId" className="text-lg font-bold">College ID</Label>
                        <Input id="collegeId" required placeholder="CLG-XXXXXX" className="h-12 rounded-xl" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-lg font-bold">Club Name</Label>
                        <Input id="name" required placeholder="e.g. Robotics Club" className="h-12 rounded-xl" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-lg font-bold">Category</Label>
                        <select id="category" className="w-full h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                            <option value="">Select a category</option>
                            <option value="technical">Technical</option>
                            <option value="cultural">Cultural</option>
                            <option value="sports">Sports</option>
                            <option value="media">Media</option>
                            <option value="social">Social</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-lg font-bold">Club Email</Label>
                        <Input id="email" type="email" required placeholder="club@college.edu" className="h-12 rounded-xl" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-lg font-bold">Description</Label>
                        <Textarea id="description" placeholder="Brief description of the club..." className="min-h-[100px] rounded-xl" />
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
