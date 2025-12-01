// UPDATED: src/components/layout/Header.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ShoppingCart, Heart, LogOut, LayoutDashboard, Settings, Package, Repeat, Activity, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UniversalSearch } from '@/components/search/UniversalSearch';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WalletButton } from '@/components/wallet/WalletButton';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useSidebar } from '@/hooks/useSidebar'; // Import sidebar hook
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ModeToggle } from './ThemeToggle';


export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { itemCount } = useCart();
  const { toggle: toggleSidebar } = useSidebar(); // Use sidebar hook

  const navLinks = [
    { label: 'Explore', href: '/explore' },
    { label: 'Collections', href: '/collections' },
    { label: 'Stats', href: '/stats' },
    { label: 'Mint', href: '/mint' },
    { label: 'FAQ', href: '/faq' },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const getUserInitial = () => {
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center gap-2">
            {/* Global Sidebar Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
            >
              <PanelLeft className="w-5 h-5" />
            </Button>
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex flex-col items-start">
                <span className="text-2xl font-serif font-bold text-foreground italic tracking-tight">
                  ByteBucks
                </span>
                <span className="text-xs text-muted-foreground -mt-1">
                  v1.02.02
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors link-underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <UniversalSearch />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Wishlist */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hidden sm:flex"
              onClick={() => navigate('/wishlist')}
            >
              <Heart className="w-5 h-5" />
            </Button>

            {/* Cart */}
            <CartDrawer>
              <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
              </Button>
            </CartDrawer>

            {/* Notifications */}
            <div className="hidden sm:flex">
              <NotificationBell />
            </div>

            {/* Connect Wallet */}
            <div className="hidden md:flex">
              <WalletButton />
            </div>

            {/* Profile / Sign In */}
            {!loading && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                      <Avatar className="w-8 h-8 ring-1 ring-border">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {getUserInitial()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 glass-strong">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Collector</p>
                    </div>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/wishlist')} className="cursor-pointer">
                      <Heart className="w-4 h-4 mr-2" />
                      My Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/orders')} className="cursor-pointer">
                      <Package className="w-4 h-4 mr-2" />
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/transactions')} className="cursor-pointer">
                      <Repeat className="w-4 h-4 mr-2" />
                      Transactions
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/activity')} className="cursor-pointer">
                      <Activity className="w-4 h-4 mr-2" />
                      Activity Feed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="elegant" 
                  size="sm" 
                  className="hidden sm:flex rounded-full"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
              )
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        {/* Other mobile sections remain unchanged */}
      </div>
    </header>
  );
}
