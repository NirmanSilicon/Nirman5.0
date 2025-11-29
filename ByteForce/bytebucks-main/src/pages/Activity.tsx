import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ActivityFeed } from '@/components/social/ActivityFeed';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Activity as ActivityIcon, LogIn } from 'lucide-react';

const Activity = () => {
  const { user } = useAuth();
  const { profile } = useProfile();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
              <ActivityIcon className="h-10 w-10 text-primary" />
              Activity <span className="text-gradient">Feed</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your recent activity across the marketplace
            </p>
          </div>

          {user && profile ? (
            <div className="max-w-3xl mx-auto">
              <ActivityFeed userId={profile.id} maxItems={50} />
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <LogIn className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Sign in to view your activity</h2>
              <p className="text-muted-foreground mb-6">
                Connect your account to see your follows, bids, comments, and transactions.
              </p>
              <Link to="/auth">
                <Button variant="hero" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Activity;
