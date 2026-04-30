import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] text-white py-20 px-4 text-center overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
        <div className="max-w-2xl mx-auto relative z-10">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">Contact</span> Us
          </h1>
          <p className="text-lg text-blue-100">
            Have questions about Amiquz? We're here to help you navigate the platform and find the right legal professional.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 space-y-8">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Direct Support</h3>
              <p className="text-gray-600 mb-2">Speak directly with our team lead.</p>
              <p className="text-lg font-bold text-blue-600">Gaurav Singh</p>
              <p className="text-gray-900 font-medium">7355279620</p>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          <div className="flex items-start gap-5">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Email Us</h3>
              <p className="text-gray-600 mb-2">For general inquiries and support.</p>
              <p className="text-gray-900 font-medium">support@amiquz.com</p>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          <div className="flex items-start gap-5">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-purple-100 border border-indigo-200 rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Office</h3>
              <p className="text-gray-600 mb-2">Amiquz Headquarters</p>
              <p className="text-gray-900 font-medium">123 Legal Avenue<br />New York, NY 10001</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
