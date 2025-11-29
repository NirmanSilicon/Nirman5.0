import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare, HelpCircle } from 'lucide-react';

export const metadata = {
    title: 'Contact Us',
    description: 'Get in touch with the UniXplore team',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="container-custom max-w-4xl">
                <h1 className="text-4xl font-bold mb-4">Contact & Support</h1>
                <p className="text-lg text-muted-foreground mb-12">
                    Have questions or need help? We&apos;re here to assist you.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Mail className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg">Email Us</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">For general inquiries:</p>
                            <a href="mailto:support@unixplore.com" className="text-primary hover:underline">
                                support@unixplore.com
                            </a>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <MessageSquare className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg">Admin Support</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">For college/club admins:</p>
                            <a href="mailto:admin@unixplore.com" className="text-primary hover:underline">
                                admin@unixplore.com
                            </a>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <HelpCircle className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg">Security</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">Report security issues:</p>
                            <a href="mailto:security@unixplore.com" className="text-primary hover:underline">
                                security@unixplore.com
                            </a>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Frequently Asked Questions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2">How do I register my college?</h3>
                            <p className="text-sm text-muted-foreground">
                                Visit the College Registration page, fill in your college details, and you&apos;ll receive a unique College ID.
                                You can then log in to your admin dashboard to manage your college information and approve club registrations.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">How do I register my club?</h3>
                            <p className="text-sm text-muted-foreground">
                                Visit the Club Registration page, enter your college&apos;s ID or name, fill in your club details, and submit.
                                Your registration will be pending until your college admin approves it.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Do I need an account to browse colleges and clubs?</h3>
                            <p className="text-sm text-muted-foreground">
                                No! All college and club information is publicly accessible without any login or registration.
                                Only college and club administrators need accounts to manage their content.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">How can I update my club information?</h3>
                            <p className="text-sm text-muted-foreground">
                                Log in to your club admin dashboard using your registered email and password.
                                You can update your About section, Contact information, post Announcements, and manage Registrations.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Is my data secure?</h3>
                            <p className="text-sm text-muted-foreground">
                                Yes! We use industry-standard security practices including password hashing, HTTPS encryption,
                                and secure authentication. Read our <a href="/security" className="text-primary hover:underline">Security Policy</a> for more details.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Do you use cookies or track users?</h3>
                            <p className="text-sm text-muted-foreground">
                                No. UniXplore does not use cookies or tracking technologies for public users.
                                We respect your privacy and don&apos;t collect any personal information from visitors.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-12 text-center">
                    <p className="text-muted-foreground">
                        Can&apos;t find what you&apos;re looking for? Email us at{' '}
                        <a href="mailto:support@unixplore.com" className="text-primary hover:underline">
                            support@unixplore.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
