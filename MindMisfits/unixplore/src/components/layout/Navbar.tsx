'use client';

import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300",
                scrolled ? "py-4" : "py-6"
            )}
        >
            <div className="container-custom">
                <div className={cn(
                    "flex h-16 items-center justify-between rounded-2xl px-6 transition-all duration-300",
                    scrolled ? "bg-background/60 backdrop-blur-xl border border-white/10 shadow-lg" : "bg-transparent"
                )}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
                            U
                        </div>
                        <span className="font-bold text-xl hidden sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">UniXplore</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink href="/colleges">Find Colleges</NavLink>
                        <NavLink href="/register/college">Register College</NavLink>
                        <NavLink href="/register/club">Register Club</NavLink>

                        <div className="h-4 w-px bg-white/10" />

                        <div className="flex items-center space-x-3">
                            <Link href="/admin/college">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white hover:bg-white/5">
                                    College Admin
                                </Button>
                            </Link>
                            <Link href="/admin/club">
                                <Button size="sm" className="bg-white text-black hover:bg-gray-200 transition-colors font-medium">
                                    Club Admin
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="md:hidden absolute top-full left-0 right-0 p-4 mt-2"
                        >
                            <div className="bg-background/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-3 shadow-2xl">
                                <MobileNavLink href="/colleges" onClick={() => setMobileMenuOpen(false)}>Find Colleges</MobileNavLink>
                                <MobileNavLink href="/register/college" onClick={() => setMobileMenuOpen(false)}>Register College</MobileNavLink>
                                <MobileNavLink href="/register/club" onClick={() => setMobileMenuOpen(false)}>Register Club</MobileNavLink>
                                <div className="border-t border-white/10 pt-3 space-y-2">
                                    <Link href="/admin/college" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
                                            College Admin
                                        </Button>
                                    </Link>
                                    <Link href="/admin/club" onClick={() => setMobileMenuOpen(false)}>
                                        <Button size="sm" className="w-full bg-white text-black hover:bg-gray-200">
                                            Club Admin
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="relative text-sm font-medium text-muted-foreground hover:text-white transition-colors group"
        >
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
        </Link>
    );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            onClick={onClick}
        >
            {children}
        </Link>
    );
}
