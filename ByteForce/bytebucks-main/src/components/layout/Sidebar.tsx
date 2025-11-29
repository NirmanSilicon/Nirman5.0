// NEW: src/components/layout/Sidebar.tsx
import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSidebar } from '@/hooks/useSidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { 
    Compass, 
    LayoutGrid, 
    Gift, 
    Coins, 
    Repeat, 
    Zap, 
    Activity, 
    User, 
    Settings 
} from 'lucide-react';

const navItems = [
    { href: '/', label: 'Discover', icon: Compass },
    { href: '/collections', label: 'Collections', icon: LayoutGrid },
    { href: '/rewards', label: 'Rewards', icon: Gift },
    { href: '/tokens', label: 'Tokens', icon: Coins },
    { href: '/swap', label: 'Swap', icon: Repeat },
    { href: '/drops', label: 'Drops', icon: Zap },
    { href: '/activity', label: 'Activity', icon: Activity },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
];

function NavLink({ href, label, icon: Icon, onClick }: (typeof navItems)[0] & { onClick: () => void }) {
    const { pathname } = useLocation();
    const isActive = pathname === href;

    return (
        <Link to={href} onClick={onClick}>
            <Button 
                variant={isActive ? "secondary" : "ghost"} 
                className="w-full justify-start text-base"
            >
                <Icon className="w-5 h-5 mr-4" />
                {label}
            </Button>
        </Link>
    );
}

export function Sidebar() {
    const { isOpen, close } = useSidebar();
    const { pathname } = useLocation();

    useEffect(() => {
        close();
    }, [pathname, close]);

    return (
        <Sheet open={isOpen} onOpenChange={close}>
            <SheetContent side="left" className="w-72 p-4">
                <div className="flex items-center gap-2 mb-8">
                     <Link to="/" className="flex items-center gap-3 group" onClick={close}>
                        <span className="text-2xl font-serif font-bold text-foreground italic tracking-tight">
                            ByteBucks
                        </span>
                    </Link>
                </div>
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <NavLink key={item.href} {...item} onClick={close} />
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
