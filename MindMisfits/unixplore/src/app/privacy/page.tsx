import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
    title: 'Privacy Policy',
    description: 'Privacy policy for UniXplore platform',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="container-custom max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

                <div className="space-y-6 prose prose-slate max-w-none">
                    <Card>
                        <CardHeader>
                            <CardTitle>Our Commitment to Privacy</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                UniXplore is committed to protecting your privacy. This policy explains how we collect,
                                use, and protect your information.
                            </p>
                            <p className="mt-2 font-semibold">
                                We do not use cookies or tracking technologies for public users.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Information We Collect</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>For Public Users:</strong></p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>No personal information is collected</li>
                                <li>No cookies or tracking</li>
                                <li>Anonymous page views may be logged for analytics</li>
                            </ul>
                            <p className="mt-4"><strong>For College/Club Admins:</strong></p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Email address (for authentication)</li>
                                <li>College/Club information (publicly displayed)</li>
                                <li>Login timestamps</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>How We Use Your Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>To provide and maintain the service</li>
                                <li>To authenticate admin users</li>
                                <li>To display college and club information publicly</li>
                                <li>To improve our service</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Data Security</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>We implement security measures to protect your data:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Passwords are hashed using bcrypt</li>
                                <li>Secure HTTPS connections</li>
                                <li>JWT-based authentication for admins</li>
                                <li>Regular security updates</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>GDPR Compliance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>For users in the European Union, you have the right to:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Access your personal data</li>
                                <li>Request correction of your data</li>
                                <li>Request deletion of your data</li>
                                <li>Object to processing of your data</li>
                            </ul>
                            <p className="mt-2">
                                Contact us through our <Link href="/contact" className="text-primary hover:underline">contact page</Link> to exercise these rights.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Third-Party Services</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                UniXplore does not share your data with third-party services for advertising or tracking purposes.
                                We may use third-party services for hosting and infrastructure only.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Changes to This Policy</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                We may update this privacy policy from time to time. We will notify users of any material changes
                                by posting the new policy on this page.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Us</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                If you have questions about this privacy policy, please{' '}
                                <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-sm text-muted-foreground">Last updated: November 2025</p>
                </div>
            </div>
        </div>
    );
}
