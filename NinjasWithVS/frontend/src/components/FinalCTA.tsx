import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function FinalCTA() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    organisation: '',
    challenge: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        role: '',
        organisation: '',
        challenge: '',
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/10 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Bring </span>
            <span className="bg-gradient-to-r from-amber-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              AI
            </span>
            <span className="text-white"> into Your</span>
            <br />
            <span className="text-white">Courtroom and Chambers</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join the early access program and be among the first to transform legal research with AI. Limited pilot slots available.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 lg:p-12 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-cyan-500/5 to-pink-500/10 rounded-2xl"></div>

            <div className="relative">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white placeholder-gray-500 transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-gray-500 transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                      Role *
                    </label>
                    <select
                      id="role"
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-white transition-all duration-300"
                    >
                      <option value="" className="bg-[#0a0e1a]">Select your role</option>
                      <option value="judge" className="bg-[#0a0e1a]">Judge</option>
                      <option value="lawyer" className="bg-[#0a0e1a]">Lawyer</option>
                      <option value="court-admin" className="bg-[#0a0e1a]">Court Administrator</option>
                      <option value="policymaker" className="bg-[#0a0e1a]">Policymaker</option>
                      <option value="legal-researcher" className="bg-[#0a0e1a]">Legal Researcher</option>
                      <option value="other" className="bg-[#0a0e1a]">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="organisation" className="block text-sm font-medium text-gray-300 mb-2">
                      Organisation *
                    </label>
                    <input
                      type="text"
                      id="organisation"
                      name="organisation"
                      required
                      value={formData.organisation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white placeholder-gray-500 transition-all duration-300"
                      placeholder="Your court, firm, or institution"
                    />
                  </div>

                  <div>
                    <label htmlFor="challenge" className="block text-sm font-medium text-gray-300 mb-2">
                      What legal research or case management challenge do you want NyayAI to solve? *
                    </label>
                    <textarea
                      id="challenge"
                      name="challenge"
                      required
                      value={formData.challenge}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-gray-500 transition-all duration-300 resize-none"
                      placeholder="Describe your biggest challenge in legal research or case management..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-4 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Request Early Access
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 mb-6">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Thank You!</h3>
                  <p className="text-gray-300">
                    Your request has been submitted. We'll be in touch soon to discuss your early access to NyayAI.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
