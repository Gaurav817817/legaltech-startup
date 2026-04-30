import { Scale, Users, Shield, Briefcase, Building2, Car } from 'lucide-react';
import Link from 'next/link';

export default function PracticeAreasPage() {
  const areas = [
    { name: 'Corporate Law', icon: Building2, desc: 'Business formation, mergers, acquisitions, and corporate governance.' },
    { name: 'Family Law', icon: Users, desc: 'Divorce, child custody, adoption, and family dispute resolution.' },
    { name: 'Criminal Defense', icon: Shield, desc: 'DUI, drug charges, white-collar crimes, and criminal appeals.' },
    { name: 'Employment Law', icon: Briefcase, desc: 'Workplace discrimination, wrongful termination, and worker rights.' },
    { name: 'Civil Litigation', icon: Scale, desc: 'Dispute resolution, breach of contract, and personal injury claims.' },
    { name: 'Auto Accidents', icon: Car, desc: 'Traffic collisions, insurance claims, and injury compensation.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Practice Areas</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find specialized legal expertise for your specific situation. Our network of verified lawyers covers a wide range of legal domains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {areas.map((area, idx) => {
            const Icon = area.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{area.name}</h3>
                <p className="text-gray-600 mb-6">{area.desc}</p>
                <Link href="/search" className="text-primary-600 font-semibold hover:text-primary-800 flex items-center gap-1">
                  Find a Lawyer <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-20 bg-primary-900 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Not sure what kind of lawyer you need?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto text-lg">
            Describe your situation to our AI assistant, and we'll automatically match you with the right legal specialist.
          </p>
          <Link href="/intake" className="inline-block bg-white text-primary-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors">
            Try AI Intake Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
