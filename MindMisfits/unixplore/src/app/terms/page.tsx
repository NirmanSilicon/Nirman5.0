import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
    title: 'Terms & Conditions',
    description: 'Terms and conditions for using UniXplore platform',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="container-custom max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>

                <div className="space-y-6 prose prose-slate max-w-none">
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Acceptance of Terms</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                By accessing and using UniXplore, you accept and agree to be bound by the terms and provision of this agreement.
                                If you do not agree to these terms, please do not use this service.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>2. Use of Service</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>UniXplore is a platform for discovering colleges and their clubs. The service is provided free of charge for public access.</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Public users can browse all content without creating an account</li>
                                <li>College and club administrators must register to manage their content</li>
                                <li>All information provided must be accurate and truthful</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>3. Admin Responsibilities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>College and club administrators agree to:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Provide accurate and up-to-date information</li>
                                <li>Maintain the security of their admin credentials</li>
                                <li>Not misuse the platform or post inappropriate content</li>
                                <li>Comply with all applicable laws and regulations</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>4. Content Ownership</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Colleges and clubs retain ownership of the content they post. By posting content on UniXplore,
                                you grant us a license to display and distribute that content on the platform.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>5. Disclaimer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                UniXplore is provided "as is" without any warranties. We do not guarantee the accuracy,
                                completeness, or reliability of any content on the platform.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>6. Limitation of Liability</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                UniXplore shall not be liable for any indirect, incidental, special, consequential, or punitive damages
                                resulting from your use of or inability to use the service.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>7. Changes to Terms</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                We reserve the right to modify these terms at any time. Continued use of the service after changes
                                constitutes acceptance of the modified terms.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>8. Contact</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                For questions about these terms, please contact us through our{' '}
                                <Link href="/contact" className="text-primary hover:underline">contact page</Link>.
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
