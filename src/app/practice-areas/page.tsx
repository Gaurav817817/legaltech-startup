import { Scale, Users, Shield, Briefcase, Building2, Car, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PracticeAreasPage() {
  const areas = [
    { name: 'Corporate Law', icon: Building2, desc: 'Business formation, mergers, acquisitions, and corporate governance.', color: 'from-blue-50 to-indigo-50 border-blue-100', icon_color: 'text-blue-600' },
    { name: 'Family Law', icon: Users, desc: 'Divorce, child custody, adoption, and family dispute resolution.', color: 'from-pink-50 to-rose-50 border-pink-100', icon_color: 'text-pink-600' },
    { name: 'Criminal Defense', icon: Shield, desc: 'DUI, drug charges, white-collar crimes, and criminal appeals.', color: 'from-red-50 to-orange-50 border-red-100', icon_color: 'text-red-600' },
    { name: 'Employment Law', icon: Briefcase, desc: 'Workplace discrimination, wrongful termination, and worker rights.', color: 'from-green-50 to-emerald-50 border-green-100', icon_color: 'text-green-600' },
    { name: 'Civil Litigation', icon: Scale, desc: 'Dispute resolution, breach of contract, and personal injury claims.', color: 'from-amber-50 to-yellow-50 border-amber-100', icon_color: 'text-amber-600' },
    { name: 'Auto Accidents', icon: Car, desc: 'Traffic collisions, insurance claims, and injury compensation.', color: 'from-purple-50 to-violet-50 border-purple-100', icon_color: 'text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] text-white py-20 px-4 text-center overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 text-sm text-blue-100">
            <Sparkles className="w-4 h-4 text-amber-400" /> 50+ practice areas covered
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            Our <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">Practice Areas</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Find specialized legal expertise for your specific situation across a wide range of legal domains.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area, idx) => {
            const Icon = area.icon;
            return (
              <div key={idx} className={`bg-gradient-to-br ${area.color} rounded-2xl p-8 border hover:shadow-lg transition-all hover:-translate-y-1 group`}>
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Icon className={`w-7 h-7 ${area.icon_color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{area.name}</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{area.desc}</p>
                <Link href="/search" className={`${area.icon_color} font-semibold hover:underline flex items-center gap-1 text-sm`}>
                  Find a Lawyer <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-20 relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] rounded-3xl p-12 text-center text-white overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          <h2 className="text-3xl font-extrabold mb-4">Not sure what kind of lawyer you need?</h2>
          <p className="text-blue-200 mb-8 max-w-xl mx-auto text-lg">
            Describe your situation to our AI assistant, and we'll automatically match you with the right legal specialist.
          </p>
          <Link href="/intake" className="inline-block bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold hover:from-amber-300 hover:to-yellow-300 transition-all shadow-lg shadow-amber-500/30">
            Try AI Intake Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
