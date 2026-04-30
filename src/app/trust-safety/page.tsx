import { ShieldCheck, Lock, Eye, Star } from 'lucide-react';

const sections = [
  { icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200', title: 'Verified Attorneys Only', body: 'Every lawyer on our platform undergoes a rigorous background check. We verify their state bar license, disciplinary history, and professional standing before they can interact with clients.' },
  { icon: Lock, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', title: '256-bit Secure Payments', body: 'All financial transactions, including consultation bookings and retainers, are processed through Razorpay using bank-level 256-bit encryption. We never store your raw credit card data.' },
  { icon: Eye, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200', title: 'Data Privacy & Confidentiality', body: 'Legal matters require strict confidentiality. Our messaging systems and AI Intake chats are securely encrypted and designed to protect your personally identifiable information (PII).' },
  { icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200', title: 'Authentic Reviews', body: 'We operate a closed-loop review system. Only clients who have actually booked and completed a consultation through Amiquz can leave a review, ensuring absolute authenticity.' },
];

export default function TrustSafetyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] text-white py-20 px-4 text-center overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
        <div className="max-w-2xl mx-auto relative z-10">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            Trust &{' '}
            <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">Safety</span>
          </h1>
          <p className="text-lg text-blue-100">
            At Amiquz, your security and trust are our top priorities.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                <div className={`w-12 h-12 ${s.bg} border rounded-xl flex items-center justify-center mb-5`}>
                  <Icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h2>
                <p className="text-gray-600 leading-relaxed text-sm">{s.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
