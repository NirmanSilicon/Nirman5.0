// UPDATED: src/App.tsx
// UPDATED: src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { config } from '@/config/wallet';
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { WalletProvider } from "@/hooks/useWallet";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AIAssistant } from "@/components/chat/AIAssistant";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Stats from "./pages/Stats";
import NFTDetail from "./pages/NFTDetail";
import Create from "./pages/Create";
import Mint from "./pages/Mint";
import Wishlist from "./pages/Wishlist";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import TransactionHistory from "./pages/TransactionHistory";
import Activity from "./pages/Activity";
import Auth from "./pages/Auth";
import UserProfile from "./pages/UserProfile";
import { FAQPage } from "./pages/FAQ";
import Rewards from "./pages/Rewards";
import Tokens from "./pages/Tokens";
import Swap from "./pages/Swap";
import Drops from "./pages/Drops";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider theme={darkTheme({ accentColor: '#9b87f5', borderRadius: 'medium' })}>
        <AuthProvider>
          <WalletProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Sidebar />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/collections" element={<Collections />} />
                    <Route path="/collection/:slug" element={<CollectionDetail />} />
                    <Route path="/stats" element={<Stats />} />
                    <Route path="/nft/:id" element={<NFTDetail />} />
                    <Route path="/create" element={<ProtectedRoute><Create /></ProtectedRoute>} />
                    <Route path="/mint" element={<ProtectedRoute><Mint /></ProtectedRoute>} />
                    <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                    <Route path="/transactions" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
                    <Route path="/activity" element={<Activity />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/user/:id" element={<UserProfile />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="/tokens" element={<Tokens />} />
                    <Route path="/swap" element={<Swap />} />
                    <Route path="/drops" element={<Drops />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/support" element={<Support />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <AIAssistant />
                </BrowserRouter>
              </TooltipProvider>
            </CartProvider>
          </WalletProvider>
        </AuthProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
