// NEW: src/pages/Support.tsx
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageCircle } from 'lucide-react';

export default function Support() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Support</h1>
              <p className="mt-4 text-muted-foreground md:text-xl">
                We're here to help. Contact us through any of the channels below.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="text-center">
                    <CardHeader>
                        <Mail className="w-10 h-10 mx-auto text-primary"/>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-xl font-semibold">Email Support</h3>
                        <p className="text-muted-foreground mt-2 mb-4">Best for detailed inquiries.</p>
                        <a href="mailto:support@bytebucks.com" className="font-semibold text-primary">
                            support@bytebucks.com
                        </a>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardHeader>
                        <MessageCircle className="w-10 h-10 mx-auto text-primary"/>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-xl font-semibold">Discord Community</h3>
                        <p className="text-muted-foreground mt-2 mb-4">For general questions and community help.</p>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary">
                            Join our Discord
                        </a>
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
