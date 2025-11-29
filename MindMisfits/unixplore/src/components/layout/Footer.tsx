import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-black text-white py-20 border-t border-white/10">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold tracking-tighter">UNIXPLORE</h2>
                        <p className="text-gray-400 max-w-xs">
                            Empowering students to discover, connect, and thrive in their campus communities.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-12 sm:gap-24">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Platform</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/find-college" className="hover:text-white transition-colors">Find College</Link></li>
                                <li><Link href="/register-college" className="hover:text-white transition-colors">Register College</Link></li>
                                <li><Link href="/admin/login" className="hover:text-white transition-colors">Admin Login</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Legal</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>© 2024 UniXplore. All rights reserved.</p>
                    <p>Designed for Excellence.</p>
                </div>
            </div>
        </footer>
    );
}
