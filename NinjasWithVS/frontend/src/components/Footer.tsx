import { Scale, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-12 border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-500/5"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Scale className="w-8 h-8 text-amber-400" />
                <div className="absolute inset-0 blur-lg bg-amber-400/30"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                NyayAI
              </span>
            </div>
            <p className="text-gray-400 text-sm italic">
              Justice delayed is justice denied.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-400 text-sm transition-colors duration-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-400 text-sm transition-colors duration-300">
                  Terms of Use
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <p className="text-gray-400 text-sm mb-4">
              <a href="mailto:contact@nyayai.in" className="hover:text-amber-400 transition-colors duration-300">
                contact@nyayai.in
              </a>
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:border-amber-500/30 flex items-center justify-center transition-all duration-300 hover:bg-amber-500/5"
              >
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-amber-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 flex items-center justify-center transition-all duration-300 hover:bg-cyan-500/5"
              >
                <Twitter className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} NyayAI by Team NinjasWithVS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
