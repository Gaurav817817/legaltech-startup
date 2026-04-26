import Link from 'next/link';
import { BookOpen, FileText, Scale, ShieldCheck } from 'lucide-react';

export default function LegalResourcesPage() {
  const resources = [
    {
      title: "Understanding Business Incorporation",
      description: "Learn the differences between LLCs, S-Corps, and C-Corps to make the best choice for your startup.",
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      category: "Corporate Law"
    },
    {
      title: "The Ultimate Guide to Estate Planning",
      description: "Everything you need to know about wills, trusts, and protecting your family's future.",
      icon: <FileText className="w-6 h-6 text-green-600" />,
      category: "Family Law"
    },
    {
      title: "Navigating Employment Contracts",
      description: "Key clauses to look out for before signing your next big job offer or executive agreement.",
      icon: <Scale className="w-6 h-6 text-purple-600" />,
      category: "Employment Law"
    },
    {
      title: "Protecting Your Intellectual Property",
      description: "A beginner's guide to trademarks, copyrights, and patents for creators and inventors.",
      icon: <ShieldCheck className="w-6 h-6 text-orange-600" />,
      category: "IP Law"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Legal Resources & Guides</h1>
          <p className="text-lg text-gray-600">
            Free, expert-written guides to help you understand your rights and prepare for your legal journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.map((resource, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                {resource.icon}
              </div>
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 block">{resource.category}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{resource.description}</p>
                <button className="text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors">
                  Read Article &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-blue-900 rounded-3xl p-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Need personalized legal advice?</h2>
          <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
            Our AI assistant can analyze your specific situation and connect you with a verified attorney who specializes in your exact needs.
          </p>
          <Link href="/intake" className="bg-white text-blue-900 font-bold px-8 py-3.5 rounded-full hover:bg-gray-100 transition-colors inline-block">
            Chat with AI Assistant
          </Link>
        </div>

      </div>
    </div>
  );
}
