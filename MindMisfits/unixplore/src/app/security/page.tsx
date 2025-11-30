import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Key, AlertTriangle } from 'lucide-react';

export const metadata = {
    title: 'Security Policy',
    description: 'Security policy and practices for UniXplore platform',
};

export default function SecurityPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="container-custom max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Security Policy</h1>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Shield className="h-6 w-6 text-primary" />
                                <CardTitle>Our Security Commitment</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>
                                UniXplore takes security seriously. We implement industry-standard security practices
                                to protect your data and ensure the integrity of our platform.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Lock className="h-6 w-6 text-primary" />
                                <CardTitle>Data Protection</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span><strong>Password Hashing:</strong> All passwords are hashed using bcrypt with a salt rounds of 12</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span><strong>HTTPS Only:</strong> All connections are encrypted using TLS/SSL</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span><strong>Secure Headers:</strong> We implement security headers including X-Frame-Options, X-Content-Type-Options, and CSP</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span><strong>SQL Injection Protection:</strong> All database queries use parameterized statements</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Key className="h-6 w-6 text-primary" />
                                <CardTitle>Authentication & Authorization</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span><strong>JWT Tokens:</strong> Secure JSON Web Tokens for admin authentication with 7-day expiration</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span><strong>Role-Based Access:</strong> Strict separation between college and club admin permissions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span><strong>Password Requirements:</strong> Minimum 8 characters for all admin accounts</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="h-6 w-6 text-primary" />
                                <CardTitle>Reporting Security Issues</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">
                                If you discover a security vulnerability, please report it responsibly:
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>Do not publicly disclose the issue until it has been addressed</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>Contact us through our <Link href="/contact" className="text-primary hover:underline">contact page</Link></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>Provide detailed information about the vulnerability</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>We will respond within 48 hours and work to address the issue promptly</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Security Best Practices for Admins</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>Use a strong, unique password for your admin account</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>Never share your admin credentials with others</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>Log out when using shared or public computers</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>Report any suspicious activity immediately</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Regular Security Updates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                We regularly update our dependencies and infrastructure to patch security vulnerabilities.
                                Our codebase follows security best practices and undergoes regular security reviews.
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
