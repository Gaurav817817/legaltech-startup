import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-12">
          Have questions about Amiquz? We're here to help you navigate the platform and find the right legal professional.
        </p>

        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 text-blue-600">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Direct Support</h3>
              <p className="text-gray-600 mb-2">Speak directly with our team lead.</p>
              <p className="text-lg font-bold text-blue-600">Gaurav Singh</p>
              <p className="text-gray-900 font-medium">7355279620</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 text-blue-600">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Email Us</h3>
              <p className="text-gray-600 mb-2">For general inquiries and support.</p>
              <p className="text-gray-900 font-medium">support@lexconnect.com</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 text-blue-600">
              <MapPin className="w-6 h-6" />
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
