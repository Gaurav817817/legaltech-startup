import { Star, MapPin, CheckCircle, Clock, Calendar } from 'lucide-react';
import BookingWidget from '@/components/booking/BookingWidget';
import EnquiryForm from '@/components/EnquiryForm';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export default async function LawyerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const supabase = await createClient();
  const { data: lawyer, error } = await supabase
    .from('lawyer_profiles')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !lawyer) {
    notFound();
  }

  // Transform db format to match BookingWidget expectations
  const widgetLawyerData = {
    id: lawyer.id,
    name: `${lawyer.first_name} ${lawyer.last_name}`,
    consultationFee: lawyer.consultation_fee,
    rating: lawyer.rating,
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Header Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6">
              <img src={lawyer.image_url} alt={lawyer.first_name} className="w-32 h-32 rounded-full object-cover shadow-sm mx-auto md:mx-0" />
              <div className="flex-1 text-center md:text-left">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                      {lawyer.first_name} {lawyer.last_name}
                      <CheckCircle className="w-6 h-6 text-primary-600" />
                    </h1>
                    <p className="text-gray-600 mt-1">{lawyer.title}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                  {lawyer.practice_areas?.map((area: string) => (
                    <span key={area} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                      {area}
                    </span>
                  ))}
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 text-gray-600 text-sm justify-center md:justify-start">
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {lawyer.location}</span>
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> Verified Professional</span>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About {lawyer.first_name}</h2>
              <p className="text-gray-600 leading-relaxed">{lawyer.about}</p>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                    {lawyer.education?.map((edu: string) => <li key={edu}>{edu}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Languages</h3>
                  <p className="text-gray-600 text-sm">{lawyer.languages?.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar (Right) */}
          <div className="lg:col-span-1 space-y-4">
            <BookingWidget lawyer={widgetLawyerData} />
            <EnquiryForm
              lawyerId={lawyer.id}
              lawyerName={lawyer.first_name}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}
