import Link from 'next/link';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-white/5 bg-black/20 backdrop-blur-lg mt-auto">
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white font-bold text-lg shadow-lg">
                                U
                            </div>
                            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">UniXplore</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            A centralized platform for discovering colleges and their clubs. Join the community and explore your passions.
                        </p>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="font-semibold mb-6 text-white">Explore</h3>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link href="/colleges" className="text-muted-foreground hover:text-white transition-colors">
                                    Find Colleges
                                </Link>
                            </li>
                            <li>
                                <Link href="/#categories" className="text-muted-foreground hover:text-white transition-colors">
                                    Browse Categories
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted-foreground hover:text-white transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* For Admins */}
                    <div>
                        <h3 className="font-semibold mb-6 text-white">For Admins</h3>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link href="/register/college" className="text-muted-foreground hover:text-white transition-colors">
                                    Register College
                                </Link>
                            </li>
                            <li>
                                <Link href="/register/club" className="text-muted-foreground hover:text-white transition-colors">
                                    Register Club
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/college" className="text-muted-foreground hover:text-white transition-colors">
                                    College Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/club" className="text-muted-foreground hover:text-white transition-colors">
                                    Club Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold mb-6 text-white">Legal</h3>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link href="/terms" className="text-muted-foreground hover:text-white transition-colors">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-muted-foreground hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/security" className="text-muted-foreground hover:text-white transition-colors">
                                    Security Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>&copy; {currentYear} UniXplore. All rights reserved.</p>
                    <div className="flex items-center space-x-6">
                        <span className="hover:text-white transition-colors cursor-pointer">Twitter</span>
                        <span className="hover:text-white transition-colors cursor-pointer">LinkedIn</span>
                        <span className="hover:text-white transition-colors cursor-pointer">Instagram</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
