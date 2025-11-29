// NEW: src/pages/Settings.tsx
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, LifeBuoy, ChevronRight } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Settings</h1>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Manage your account and preferences.
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <Button variant="ghost" className="w-full flex justify-between items-center text-lg p-8" onClick={() => navigate('/profile')}>
                  <div className="flex items-center gap-4">
                    <User className="w-6 h-6 text-primary" />
                    <span>Profile Settings</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" className="w-full flex justify-between items-center text-lg p-8" onClick={() => navigate('/support')}>
                    <div className="flex items-center gap-4">
                        <LifeBuoy className="w-6 h-6 text-primary" />
                        <span>Support</span>
                    </div>
                   <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
