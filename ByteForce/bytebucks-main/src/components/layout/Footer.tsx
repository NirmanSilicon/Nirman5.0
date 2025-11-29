import { Link } from 'react-router-dom';
import { Twitter, Github, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const footerLinks = {
  marketplace: [
    { label: 'Explore', href: '/explore' },
    { label: 'Collections', href: '/collections' },
    { label: 'Stats', href: '/stats' },
    { label: 'Create', href: '/create' },
  ],
  resources: [
    { label: 'Help Center', href: '/help' },
    { label: 'Blog', href: '/blog' },
    { label: 'Newsletter', href: '/newsletter' },
    { label: 'API', href: '/api' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Cookies', href: '/cookies' },
  ],
};

const socials = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: MessageCircle, href: 'https://discord.com', label: 'Discord' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Send, href: 'https://t.me', label: 'Telegram' },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        {/* Newsletter Section */}
        <div className="glass rounded-xl p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-2">Stay in the loop</h3>
            <p className="text-muted-foreground">
              Get the latest drops, exclusive offers, and market insights
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 md:w-72 bg-muted/50 border border-border rounded-lg px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
            />
            <Button variant="elegant" className="rounded-lg">Subscribe</Button>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-serif font-bold italic">ByteBucks</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              The premier NFT marketplace for digital creators and collectors.
            </p>
            <div className="flex gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="font-serif font-semibold mb-5 text-foreground">Marketplace</h4>
            <ul className="space-y-3">
              {footerLinks.marketplace.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-serif font-semibold mb-5 text-foreground">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-serif font-semibold mb-5 text-foreground">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif font-semibold mb-5 text-foreground">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ByteBucks. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Supported chains:</span>
            <div className="flex gap-2">
              {[
                { name: 'Ethereum', color: '#627EEA' },
                { name: 'Polygon', color: '#8247E5' },
                { name: 'Solana', color: '#14F195' },
                { name: 'Bitcoin', color: '#F7931A' },
              ].map((chain) => (
                <div
                  key={chain.name}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-medium"
                  style={{ backgroundColor: `${chain.color}15`, color: chain.color }}
                  title={chain.name}
                >
                  {chain.name[0]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
