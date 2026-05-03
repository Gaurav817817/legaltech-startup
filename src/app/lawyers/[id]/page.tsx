import {
  MapPin, CheckCircle, Scale, Briefcase,
  Calendar, Users, Award, Globe, Clock,
} from 'lucide-react';
import Image from 'next/image';
import { Suspense } from 'react';
import LawyerContactSidebar from '@/components/lawyer/LawyerContactSidebar';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export const revalidate = 300;
export const dynamicParams = true;

async function fetchLawyerHero(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('lawyer_profiles')
    .select('id, first_name, last_name, title, image_url, location, work_mode, rating, years_experience, cases_handled, success_rate, consultation_fee')
    .eq('id', id)
    .single();
  return data;
}

async function fetchLawyerFull(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('lawyer_profiles')
    .select('*')
    .eq('id', id)
    .single();
  return data;
}

async function LawyerBody({ lawyerId }: { lawyerId: string }) {
  const lawyer = await fetchLawyerFull(lawyerId);
  if (!lawyer) return null;

  const name = `${lawyer.first_name} ${lawyer.last_name}`;
  const hasCredentials = lawyer.education?.length > 0 || lawyer.courts?.length > 0 || lawyer.bar_council_state;
  const hasFees = lawyer.fee_15min || lawyer.fee_30min || lawyer.fee_60min;
  const hasServices = lawyer.services?.length > 0;

  const sidebarLawyer = {
    id: lawyer.id,
    name,
    firstName: lawyer.first_name,
    consultationFee: lawyer.consultation_fee,
    rating: lawyer.rating,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

        {/* ── Left: main content ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Quick-info strip */}
          {(lawyer.work_mode || lawyer.availability || lawyer.languages?.length > 0) && (
            <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 flex flex-wrap gap-x-8 gap-y-3">
              {lawyer.work_mode && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Mode</p>
                    <p className="text-gray-800 font-semibold text-xs">{lawyer.work_mode}</p>
                  </div>
                </div>
              )}
              {lawyer.availability && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Availability</p>
                    <p className="text-gray-800 font-semibold text-xs">{lawyer.availability}</p>
                  </div>
                </div>
              )}
              {lawyer.languages?.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Languages</p>
                    <p className="text-gray-800 font-semibold text-xs">{lawyer.languages.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* About */}
          {lawyer.about && (
            <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-7">
              <h2 className="text-base font-bold text-gray-900 mb-3">About {lawyer.first_name}</h2>
              <p className="text-gray-600 leading-relaxed text-sm">{lawyer.about}</p>

              {lawyer.notable_cases && (
                <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <h3 className="font-semibold text-amber-900 text-xs mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                    <Award className="w-3.5 h-3.5" /> Notable Work
                  </h3>
                  <p className="text-amber-800 text-sm leading-relaxed">{lawyer.notable_cases}</p>
                </div>
              )}

              {lawyer.client_types?.length > 0 && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Users className="w-3 h-3" /> Who I Help
                  </p>
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
            <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-7">
              <h2 className="text-base font-bold text-gray-900 mb-4">Areas of Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {lawyer.practice_areas.map((area: string) => (
                  <span
                    key={area}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold border"
                    style={{ background: 'linear-gradient(135deg,#FEF3C7,#FDE68A)', color: '#92400E', borderColor: 'rgba(245,158,11,0.25)' }}
                  >
                    {area}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Services & Fees */}
          {(hasFees || hasServices) && (
            <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-7">
              <h2 className="text-base font-bold text-gray-900 mb-5">Services & Fees</h2>

              {hasFees && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  {lawyer.fee_15min && (
                    <div className="border border-gray-200 rounded-xl p-4 text-center hover:border-amber-300 transition-colors">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">15 min</p>
                      <p className="text-xl font-extrabold text-gray-900">₹{lawyer.fee_15min}</p>
                      <p className="text-[11px] text-gray-400 mt-1">Quick consult</p>
                    </div>
                  )}
                  {lawyer.fee_30min && (
                    <div className="rounded-xl p-4 text-center relative" style={{ background: '#FFFBEB', border: '2px solid #F59E0B' }}>
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full bg-amber-500">
                        Popular
                      </span>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#92400E' }}>30 min</p>
                      <p className="text-xl font-extrabold text-gray-900">₹{lawyer.fee_30min}</p>
                      <p className="text-[11px] mt-1" style={{ color: '#B45309' }}>Deep dive</p>
                    </div>
                  )}
                  {lawyer.fee_60min && (
                    <div className="border border-gray-200 rounded-xl p-4 text-center hover:border-amber-300 transition-colors">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">60 min</p>
                      <p className="text-xl font-extrabold text-gray-900">₹{lawyer.fee_60min}</p>
                      <p className="text-[11px] text-gray-400 mt-1">Full session</p>
                    </div>
                  )}
                </div>
              )}

              {hasServices && (
                <ul className="space-y-2 pt-2 border-t border-gray-100">
                  {lawyer.services.map((s: string) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* Credentials */}
          {hasCredentials && (
            <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-7">
              <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-600" /> Credentials & Courts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(lawyer.education?.length > 0 || lawyer.bar_council_state) && (
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Education & Bar</p>
                    <ul className="space-y-2.5">
                      {lawyer.education?.map((edu: string) => (
                        <li key={edu} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          {edu}
                        </li>
                      ))}
                      {lawyer.bar_council_state && (
                        <li className="flex items-start gap-2.5 text-sm text-gray-700">
                          <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          Bar Council of {lawyer.bar_council_state}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                {lawyer.courts?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Courts Practiced In</p>
                    <ul className="space-y-2.5">
                      {lawyer.courts.map((court: string) => (
                        <li key={court} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <Briefcase className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          {court}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Calendar availability if not already in quick strip */}
          {lawyer.availability && !(lawyer.work_mode || lawyer.languages?.length > 0) && (
            <section className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Availability</p>
                <p className="text-sm text-gray-800 font-semibold mt-0.5">{lawyer.availability}</p>
              </div>
            </section>
          )}
        </div>

        {/* ── Right: unified contact sidebar ── */}
        <div className="lg:col-span-1">
          <LawyerContactSidebar lawyer={sidebarLawyer} />
        </div>

      </div>
    </div>
  );
}

function BodySkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-36 mb-2" />
            <div className="h-3 bg-gray-100 rounded" />
            <div className="h-3 bg-gray-100 rounded w-11/12" />
            <div className="h-3 bg-gray-100 rounded w-4/5" />
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="h-4 bg-gray-200 rounded w-40 mb-4" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-7 w-28 bg-amber-50 rounded-full" />)}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="h-4 bg-gray-200 rounded w-32 mb-5" />
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 text-center space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-12 mx-auto" />
                  <div className="h-5 bg-gray-200 rounded w-16 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-blue-600 to-indigo-700" />
            <div className="p-5 space-y-3">
              <div className="h-10 bg-gray-100 rounded-xl" />
              <div className="h-10 bg-gray-100 rounded-xl" />
              <div className="h-10 bg-gray-100 rounded-xl" />
              <div className="h-20 bg-gray-100 rounded-xl" />
              <div className="h-11 bg-blue-100 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function LawyerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const hero = await fetchLawyerHero(id);
  if (!hero) notFound();

  const name = `${hero.first_name} ${hero.last_name}`;
  const initials = `${hero.first_name?.[0] ?? ''}${hero.last_name?.[0] ?? ''}`;

  const stats = [
    hero.years_experience ? { value: `${hero.years_experience}`, suffix: 'yrs', label: 'Experience' } : null,
    hero.cases_handled    ? { value: `${hero.cases_handled}`,    suffix: '+',   label: 'Cases'      } : null,
    hero.success_rate     ? { value: `${hero.success_rate}`,     suffix: '%',   label: 'Success'    } : null,
    hero.rating > 0       ? { value: `${hero.rating}`,           suffix: '/5',  label: 'Rating'     } : null,
  ].filter(Boolean) as { value: string; suffix: string; label: string }[];

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#312e81] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(white 1px,transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-8">

            {/* Avatar */}
            <div className="relative shrink-0">
              {hero.image_url ? (
                <Image
                  src={hero.image_url}
                  alt={name}
                  width={96}
                  height={96}
                  priority
                  className="w-24 h-24 rounded-2xl object-cover shadow-2xl"
                  style={{ border: '3px solid rgba(245,158,11,0.8)' }}
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl text-3xl font-extrabold text-gray-900"
                  style={{ background: 'linear-gradient(135deg,#FCD34D,#F59E0B)', border: '3px solid rgba(245,158,11,0.8)' }}
                >
                  {initials}
                </div>
              )}
              <div className="absolute -bottom-1.5 -right-1.5 bg-green-500 rounded-full p-1 shadow-lg border-2 border-[#1e3a8a]">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Name + meta */}
            <div className="text-center sm:text-left flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-2">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">Verified Professional</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">{name}</h1>
              {hero.title && <p className="text-blue-200 text-sm mt-1.5">{hero.title}</p>}
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 justify-center sm:justify-start text-xs text-blue-300">
                {hero.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 opacity-70" /> {hero.location}
                  </span>
                )}
                {hero.work_mode && (
                  <span className="bg-white/10 text-white/90 px-2.5 py-0.5 rounded-full font-semibold">{hero.work_mode}</span>
                )}
              </div>
            </div>
          </div>

          {/* Stats bar */}
          {stats.length > 0 && (
            <div
              className="border-t border-white/10 grid divide-x divide-white/10"
              style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="px-4 py-4 text-center">
                  <p className="text-xl sm:text-2xl font-extrabold text-amber-400 leading-none">
                    {stat.value}<span className="text-sm font-semibold text-amber-300/70 ml-0.5">{stat.suffix}</span>
                  </p>
                  <p className="text-[11px] text-blue-300 mt-1 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <Suspense fallback={<BodySkeleton />}>
        <LawyerBody lawyerId={id} />
      </Suspense>

    </div>
  );
}
