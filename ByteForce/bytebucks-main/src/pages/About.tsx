// NEW: src/pages/About.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Gem, Users, Scale, AlertTriangle } from "lucide-react";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-4">About ByteBucks</h1>
            <p className="text-xl text-center text-muted-foreground mb-12">
              Your premier destination for digital collectibles and unique NFTs.
            </p>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-primary" />
                    <span>Who We Are</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>
                    ByteBucks is a cutting-edge NFT marketplace designed for creators, collectors, and crypto enthusiasts. We provide a seamless and secure platform to discover, trade, and interact with a diverse world of digital assets. Our mission is to empower creators and provide collectors with a trusted environment to grow their digital portfolios.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Gem className="w-6 h-6 text-primary" />
                    <span>What We Do</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4">
                  <p>
                    Our platform facilitates wallet-based NFT trading, allowing you to buy, sell, and auction digital items with ease. We believe in true ownership, which is why you always retain control of your assets in your personal crypto wallet. Key features include:
                  </p>
                  <ul className="list-disc list-inside pl-4 space-y-2">
                    <li>A vast and diverse marketplace of NFTs from various creators.</li>
                    <li>Secure and transparent transactions on the blockchain.</li>
                    <li>Tools for creators to mint and manage their collections.</li>
                    <li>Community features to engage with fellow collectors and artists.</li>
                    <li>A rewards program for active members of our community.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Scale className="w-6 h-6 text-primary" />
                    <span>Licenses & Copyright</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4">
                  <p>
                    The media, artwork, and content associated with NFTs on our platform are created and owned by individual users or collection owners. ByteBucks does not claim any ownership over user-uploaded content, except where explicitly stated.
                  </p>
                  <p>
                    Users are responsible for ensuring that the NFTs they list or trade do not infringe on any third-party intellectual property rights, including copyrights and trademarks. All platform branding, UI designs, and proprietary code are protected under applicable copyright and intellectual property laws.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-primary" />
                    <span>Reporting & Moderation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>
                    To maintain a safe and respectful marketplace, we provide tools to report potentially infringing or inappropriate content. If you suspect an NFT is violating intellectual property rights (such as a DMCA takedown request) or our terms of service, please use the "Report NFT" feature on the asset's page or contact our support team directly. Reported items are reviewed by our team and may be removed or have their visibility restricted based on our policies.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                    <span>Disclaimer</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>
                    The value of NFTs and other crypto assets is volatile and can go down as well as up. Trading digital assets involves significant risk. ByteBucks does not provide financial, legal, or investment advice. We encourage all users to conduct their own research (DYOR) before buying, selling, or trading any assets on our platform. Your financial decisions are your own.
                  </p>
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

export default AboutPage;
