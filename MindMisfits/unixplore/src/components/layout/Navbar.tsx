'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Navbar() {
    const pathname = usePathname();

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4"
        >
            <div className="glass rounded-full px-8 py-4 flex items-center gap-12 shadow-2xl shadow-black/20">
                <Link href="/" className="text-2xl font-bold tracking-tighter hover:scale-105 transition-transform">
                    UNI<span className="text-gray-400">XPLORE</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {[
                        { name: 'Home', href: '/' },
                        { name: 'Find College', href: '/find-college' },
                        { name: 'Register', href: '/register-college' },
                    ].map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium tracking-wide transition-colors hover:text-white",
                                pathname === link.href ? "text-white" : "text-gray-400"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <Link href="/admin/login">
                    <Button variant="ghost" size="sm" className="rounded-full hover:bg-white/10 text-gray-300">
                        Admin
                    </Button>
                </Link>
            </div>
        </motion.nav>
    );
}
