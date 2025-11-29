import { useState } from "react";
import { Menu, X, Sun, Moon, User, Settings, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { XPBar } from "./XPBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface NavbarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  onNavigate: (view: string) => void;
  currentView: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function Navbar({
  currentXP,
  maxXP,
  level,
  onNavigate,
  currentView,
  isDarkMode,
  toggleDarkMode,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "forges", label: "Forges" },
    { id: "simulators", label: "Simulators" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate("landing")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white">🔥</span>
              </div>
              <span className="text-foreground">Fin-Forge</span>
            </button>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  onClick={() => onNavigate(item.id)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <XPBar currentXP={currentXP} maxXP={maxXP} level={level} />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onNavigate("profile")}>
                  <Trophy className="w-4 h-4 mr-2" />
                  Profile & Achievements
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate("settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <div className="mb-4">
              <XPBar currentXP={currentXP} maxXP={maxXP} level={level} />
            </div>
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
