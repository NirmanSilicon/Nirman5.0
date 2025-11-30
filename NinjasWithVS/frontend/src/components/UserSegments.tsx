import { Scale, Briefcase, Building, Users, BookOpen } from 'lucide-react';

export default function UserSegments() {
  const segments = [
    {
      icon: Scale,
      title: 'Judges',
      benefits: [
        'Spend less time on research, more on reasoning',
        'Automated summaries and citation graphs reduce cognitive load and speed up judgment writing',
      ],
      gradient: 'from-amber-500/20 to-amber-500/5',
      border: 'border-amber-500/30',
      iconColor: 'text-amber-400',
    },
    {
      icon: Briefcase,
      title: 'Lawyers',
      benefits: [
        'Win cases with data-driven strategies',
        'Predictive analytics reveal judge tendencies, optimal settlement windows, and litigation risk before filing',
      ],
      gradient: 'from-cyan-500/20 to-cyan-500/5',
      border: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
    },
    {
      icon: Building,
      title: 'Court Administrators',
      benefits: [
        'Real-time delay tracking and bottleneck identification via NJDG integration',
        'Enables proactive case management and resource allocation',
      ],
      gradient: 'from-pink-500/20 to-pink-500/5',
      border: 'border-pink-500/30',
      iconColor: 'text-pink-400',
    },
    {
      icon: Users,
      title: 'Policymakers',
      benefits: [
        'Transparent, bias-focused judicial analytics',
        'Informs evidence-based judicial reforms at national and state levels',
      ],
      gradient: 'from-purple-500/20 to-purple-500/5',
      border: 'border-purple-500/30',
      iconColor: 'text-purple-400',
    },
    {
      icon: BookOpen,
      title: 'Legal Researchers & Academics',
      benefits: [
        'Interactive knowledge graphs and multilingual summaries',
        'Make learning and analyzing Indian law more intuitive and comprehensive',
      ],
      gradient: 'from-green-500/20 to-green-500/5',
      border: 'border-green-500/30',
      iconColor: 'text-green-400',
    },
  ];

  return (
    <section id="for-whom" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Built for the </span>
            <span className="bg-gradient-to-r from-amber-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Entire Justice Ecosystem
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Empowering every stakeholder in the Indian legal system
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {segments.map((segment, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br ${segment.gradient} backdrop-blur-sm border ${segment.border} rounded-xl p-6 hover:shadow-lg hover:shadow-current/10 transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="relative">
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${segment.gradient} border ${segment.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <segment.icon className={`w-7 h-7 ${segment.iconColor}`} />
                </div>

                <h3 className="text-2xl font-semibold text-white mb-4">
                  {segment.title}
                </h3>

                <ul className="space-y-3">
                  {segment.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${segment.iconColor} mt-2`}></div>
                      <span className="text-sm text-gray-400 leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
