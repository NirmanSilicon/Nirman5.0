"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { User, LogOut, X, UserCircle } from "lucide-react"
import Image from "next/image"

interface MobileMenuProps {
  isMobileMenuOpen: boolean
  closeMobileMenu: () => void
}

const MobileMenu = ({ isMobileMenuOpen, closeMobileMenu }: MobileMenuProps) => {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
      closeMobileMenu()
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    closeMobileMenu()
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    closeMobileMenu();
  }

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden" 
          onClick={closeMobileMenu} 
        />
      )}

      {/* Mobile Sliding Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-background/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden border-l border-border ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link href="/" onClick={closeMobileMenu}>
              <div className="flex items-center">
                <div className="relative w-8 h-8 mr-2">
                  <Image
                    src="/logo.jpg" 
                    alt="upyogi Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <h1 className="text-xl font-bold text-primary font-[family-name:var(--font-playfair)]">
                  upyogi
                </h1>
              </div>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={closeMobileMenu} 
              className="text-foreground hover:bg-accent"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Navigation Links */}
            <div className="px-4 py-6 space-y-4">
              <Link
                href="/"
                className="block text-lg font-medium text-foreground hover:text-primary py-2 transition-colors"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <button
                onClick={() => scrollToSection('treatments')}
                className="block text-lg font-medium text-foreground hover:text-primary py-2 transition-colors text-left w-full"
              >
                Treatments
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="block text-lg font-medium text-foreground hover:text-primary py-2 transition-colors text-left w-full"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('success-stories')}
                className="block text-lg font-medium text-foreground hover:text-primary py-2 transition-colors text-left w-full"
              >
                Success Stories
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block text-lg font-medium text-foreground hover:text-primary py-2 transition-colors text-left w-full"
              >
                Contact
              </button>
            </div>

            {/* Auth Section */}
            <div className="px-4 py-4 border-t border-border">
              {user ? (
                <>
                  <div className="flex flex-col space-y-3 mb-4">
                    <Button 
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleNavigation('/dashboard')}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleNavigation('/myprofile')}
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      My Profile
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    Welcome back, {user.displayName || user.email}!
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => handleNavigation('/login')}
                  >
                    Login
                  </Button>
                  <Button 
                    className="w-full"
                    onClick={() => handleNavigation('/register')}
                  >
                    Sign Up
                  </Button>
                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => handleNavigation('/login')}
                  >
                    Book Consultation
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-center text-sm text-muted-foreground">
              <p>Need help? Contact us</p>
              <p className="font-semibold text-primary">info@upyogi.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileMenu