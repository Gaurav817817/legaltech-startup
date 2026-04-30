import Link from 'next/link';
import { BookOpen, FileText, Scale, ShieldCheck, Sparkles } from 'lucide-react';

export default function LegalResourcesPage() {
  const resources = [
    { title: 'Understanding Business Incorporation', description: 'Learn the differences between LLCs, S-Corps, and C-Corps to make the best choice for your startup.', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', category: 'Corporate Law' },
    { title: 'The Ultimate Guide to Estate Planning', description: 'Everything you need to know about wills, trusts, and protecting your family\'s future.', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', category: 'Family Law' },
    { title: 'Navigating Employment Contracts', description: 'Key clauses to look out for before signing your next big job offer or executive agreement.', icon: Scale, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100', category: 'Employment Law' },
    { title: 'Protecting Your Intellectual Property', description: 'A beginner\'s guide to trademarks, copyrights, and patents for creators and inventors.', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100', category: 'IP Law' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] text-white py-20 px-4 text-center overflow-hidden">
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 text-sm text-blue-100">
            <Sparkles className="w-4 h-4 text-amber-400" /> Free expert-written guides
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            Legal <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">Resources</span> & Guides
          </h1>
          <p className="text-lg text-blue-100">
            Free guides to help you understand your rights and prepare for your legal journey.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource, idx) => {
            const Icon = resource.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex gap-6 items-start group">
                <div className={`w-14 h-14 rounded-2xl ${resource.bg} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${resource.color}`} />
                </div>
                <div>
                  <span className={`text-xs font-bold uppercase tracking-wider mb-2 block ${resource.color}`}>{resource.category}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{resource.description}</p>
                  <button className={`${resource.color} font-bold text-sm hover:underline transition-colors`}>
                    Read Article &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-20 relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] rounded-3xl p-12 text-center text-white overflow-hidden">
          <h2 className="text-3xl font-extrabold mb-4">Need personalized legal advice?</h2>
          <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
            Our AI assistant can analyze your specific situation and connect you with a verified attorney who specializes in your exact needs.
          </p>
          <Link href="/intake" className="inline-block bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-full hover:from-amber-300 hover:to-yellow-300 transition-all shadow-lg shadow-amber-500/30">
            Chat with AI Assistant
          </Link>
        </div>
      </div>
    </div>
  );
}
