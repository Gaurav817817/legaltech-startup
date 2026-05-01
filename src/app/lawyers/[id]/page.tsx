import { MapPin, CheckCircle, Scale, Briefcase, Calendar, Users, Award } from 'lucide-react';
import Image from 'next/image';
import BookingWidget from '@/components/booking/BookingWidget';
import EnquiryForm from '@/components/EnquiryForm';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export const revalidate = 300;
export const dynamicParams = true;

export default async function LawyerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const supabase = await createClient();
  const { data: lawyer, error } = await supabase
    .from('lawyer_profiles')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !lawyer) notFound();

  const name = `${lawyer.first_name} ${lawyer.last_name}`;
  const initials = `${lawyer.first_name?.[0] ?? ''}${lawyer.last_name?.[0] ?? ''}`;

  const stats = [
    lawyer.years_experience ? { value: lawyer.years_experience, label: 'Yrs Experience' } : null,
    lawyer.cases_handled    ? { value: lawyer.cases_handled,    label: 'Cases Handled'  } : null,
    lawyer.success_rate     ? { value: lawyer.success_rate,     label: 'Success Rate'   } : null,
    lawyer.rating > 0       ? { value: `⭐ ${lawyer.rating}`,   label: 'Rating'         } : null,
  ].filter(Boolean) as { value: string; label: string }[];

  const widgetLawyerData = {
    id: lawyer.id,
    name,
    consultationFee: lawyer.consultation_fee,
    rating: lawyer.rating,
  };

  const hasCredentials = lawyer.education?.length > 0 || lawyer.courts?.length > 0 || lawyer.bar_council_state;
  const hasFees = lawyer.fee_15min || lawyer.fee_30min || lawyer.fee_60min || lawyer.services?.length > 0;

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── HERO ── */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#312e81] overflow-hidden">
        {/* dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-8">

            {/* Avatar */}
            <div className="relative shrink-0">
              {lawyer.image_url ? (
                <Image
                  src={lawyer.image_url}
                  alt={name}
                  width={96}
                  height={96}
                  priority
                  className="w-24 h-24 rounded-full object-cover shadow-2xl"
                  style={{ border: '3px solid #F59E0B' }}
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl text-3xl font-extrabold text-gray-900"
                  style={{ background: 'linear-gradient(135deg, #FCD34D, #F59E0B)', border: '3px solid #F59E0B' }}
                >
                  {initials}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 shadow-lg border-2 border-white">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            {/* Name + meta */}
            <div className="text-center sm:text-left flex-1 pb-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">{name}</h1>
              {lawyer.title && <p className="text-blue-200 text-base mt-1.5">{lawyer.title}</p>}
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 justify-center sm:justify-start text-sm text-blue-200">
                {lawyer.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 opacity-70" /> {lawyer.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-400" /> Verified Professional
                </span>
                {lawyer.work_mode && (
                  <span className="bg-white/10 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
                    {lawyer.work_mode}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats strip */}
          {stats.length > 0 && (
            <div className="border-t border-white/10 grid divide-x divide-white/10"
              style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="px-4 py-4 text-center">
                  <p className="text-xl sm:text-2xl font-extrabold text-amber-400 leading-none">{stat.value}</p>
                  <p className="text-[11px] text-blue-300 mt-1 uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT (main) ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* About */}
            {lawyer.about && (
              <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">About {lawyer.first_name}</h2>
                <p className="text-gray-700 leading-relaxed text-[15px]">{lawyer.about}</p>

                {lawyer.notable_cases && (
                  <div className="mt-6 p-4 rounded-xl" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                    <h3 className="font-semibold text-amber-900 text-sm mb-1.5 flex items-center gap-1.5">
                      <Award className="w-4 h-4" /> Notable Work
                    </h3>
                    <p className="text-amber-800 text-sm leading-relaxed">{lawyer.notable_cases}</p>
                  </div>
                )}

                {lawyer.client_types?.length > 0 && (
                  <div className="mt-5">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> Who I Help
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {lawyer.client_types.map((c: string) => (
                        <span key={c} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-100">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Expertise */}
            {lawyer.practice_areas?.length > 0 && (
              <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {lawyer.practice_areas.map((area: string) => (
                    <span
                      key={area}
                      className="px-3 py-1.5 rounded-full text-sm font-semibold"
                      style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', color: '#92400E', border: '1px solid rgba(245,158,11,0.2)' }}
                    >
                      {area}
                    </span>
                  ))}
                </div>
                {lawyer.languages?.length > 0 && (
                  <p className="text-sm text-gray-500 mt-4">
                    <span className="font-semibold text-gray-700">Speaks: </span>{lawyer.languages.join(', ')}
                  </p>
                )}
              </section>
            )}

            {/* Services & Fees */}
            {hasFees && (
              <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Services & Fees</h2>

                {(lawyer.fee_15min || lawyer.fee_30min || lawyer.fee_60min) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    {lawyer.fee_15min && (
                      <div className="border border-gray-200 rounded-xl p-4 text-center hover:border-amber-300 transition-colors group">
                        <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">15-min Call</p>
                        <p className="text-2xl font-extrabold text-gray-900">₹{lawyer.fee_15min}</p>
                        <p className="text-xs text-gray-400 mt-1.5">Quick consult</p>
                      </div>
                    )}
                    {lawyer.fee_30min && (
                      <div className="rounded-xl p-4 text-center relative" style={{ background: '#FFFBEB', border: '2px solid #F59E0B' }}>
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-900 px-3 py-0.5 rounded-full" style={{ background: '#F59E0B' }}>
                          Popular
                        </span>
                        <p className="text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: '#92400E' }}>30-min Consult</p>
                        <p className="text-2xl font-extrabold text-gray-900">₹{lawyer.fee_30min}</p>
                        <p className="text-xs mt-1.5" style={{ color: '#B45309' }}>Deep dive</p>
                      </div>
                    )}
                    {lawyer.fee_60min && (
                      <div className="border border-gray-200 rounded-xl p-4 text-center hover:border-amber-300 transition-colors">
                        <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">60-min Session</p>
                        <p className="text-2xl font-extrabold text-gray-900">
                          ₹{lawyer.fee_60min}<span className="text-sm font-normal text-gray-400">/hr</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1.5">Full consultation</p>
                      </div>
                    )}
                  </div>
                )}

                {lawyer.services?.length > 0 && (
                  <ul className="space-y-2">
                    {lawyer.services.map((s: string) => (
                      <li key={s} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {/* Credentials & Courts */}
            {hasCredentials && (
              <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-600" /> Credentials & Courts
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {(lawyer.education?.length > 0 || lawyer.bar_council_state) && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Bar Credentials</h3>
                      <ul className="space-y-2.5">
                        {lawyer.education?.map((edu: string) => (
                          <li key={edu} className="flex items-start gap-2.5 text-sm text-gray-700">
                            <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            {edu}
                          </li>
                        ))}
                        {lawyer.bar_council_state && (
                          <li className="flex items-start gap-2.5 text-sm text-gray-700">
                            <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            Bar Council of {lawyer.bar_council_state}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {lawyer.courts?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Courts Practiced In</h3>
                      <ul className="space-y-2.5">
                        {lawyer.courts.map((court: string) => (
                          <li key={court} className="flex items-start gap-2.5 text-sm text-gray-700">
                            <Briefcase className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                            {court}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Availability */}
            {lawyer.availability && (
              <section className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Availability</p>
                  <p className="text-sm text-gray-800 font-semibold mt-0.5">{lawyer.availability}</p>
                </div>
              </section>
            )}

          </div>

          {/* ── RIGHT (sidebar) ── */}
          <div className="lg:col-span-1 space-y-4">
            <BookingWidget lawyer={widgetLawyerData} />
            <EnquiryForm lawyerId={lawyer.id} lawyerName={lawyer.first_name} />
          </div>

        </div>
      </div>
    </div>
  );
}
