import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTASection() {
    return (
        <section className="py-16 md:py-24 bg-muted/50">
            <div className="container-custom">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold">Are you a college or club admin?</h2>
                    <p className="text-lg text-muted-foreground">
                        Register your college or club to reach thousands of students and showcase your community.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register/college">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                Register College
                            </Button>
                        </Link>
                        <Link href="/register/club">
                            <Button size="lg" className="w-full sm:w-auto">
                                Register Club
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
