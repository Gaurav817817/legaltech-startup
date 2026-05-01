import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// One-time seed route for test lawyer data.
// Protected by a static token — hit it once, then this file gets deleted.
const SEED_TOKEN = 'amiquz-seed-2024';

const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Lucknow', 'Chandigarh'];

const LAWYER_TEMPLATES = [
  { first: 'Arjun',   last: 'Sharma',   areas: ['Criminal Law'],          title: 'Senior Advocate',        exp: '10+',  fee: 3000, rating: 4.7 },
  { first: 'Priya',   last: 'Mehta',    areas: ['Corporate Law'],         title: 'Corporate Counsel',      exp: '5-10', fee: 4000, rating: 4.5 },
  { first: 'Rohit',   last: 'Verma',    areas: ['Civil Litigation'],      title: 'Advocate',               exp: '5-10', fee: 2500, rating: 4.3 },
  { first: 'Sunita',  last: 'Gupta',    areas: ['Family Law'],            title: 'Family Law Specialist',  exp: '5-10', fee: 2000, rating: 4.6 },
  { first: 'Vikram',  last: 'Singh',    areas: ['Intellectual Property'], title: 'IP Attorney',            exp: '3-5',  fee: 5000, rating: 4.4 },
  { first: 'Meera',   last: 'Nair',     areas: ['Real Estate'],           title: 'Property Lawyer',        exp: '5-10', fee: 2500, rating: 4.2 },
  { first: 'Aditya',  last: 'Kumar',    areas: ['Employment Law'],        title: 'Labour Law Expert',      exp: '3-5',  fee: 2000, rating: 4.5 },
  { first: 'Kavita',  last: 'Rao',      areas: ['Tax Law'],               title: 'Tax Consultant',         exp: '10+',  fee: 3500, rating: 4.8 },
  { first: 'Sandeep', last: 'Joshi',    areas: ['Immigration'],           title: 'Immigration Advocate',   exp: '5-10', fee: 3000, rating: 4.3 },
  { first: 'Deepa',   last: 'Iyer',     areas: ['Banking & Finance'],     title: 'Banking Law Specialist', exp: '10+',  fee: 4000, rating: 4.6 },
  { first: 'Rajesh',  last: 'Pandey',   areas: ['Consumer Rights'],       title: 'Consumer Rights Expert', exp: '3-5',  fee: 1500, rating: 4.1 },
  { first: 'Ananya',  last: 'Krishnan', areas: ['Cyber Law'],             title: 'Cyber Law Specialist',   exp: '3-5',  fee: 3500, rating: 4.4 },
];

const BAR_COUNCIL: Record<string, string> = {
  Delhi: 'Delhi',
  Mumbai: 'Maharashtra & Goa',
  Bangalore: 'Karnataka',
  Lucknow: 'Uttar Pradesh',
  Chandigarh: 'Punjab & Haryana',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('token') !== SEED_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const results: { email: string; status: string }[] = [];

  for (const city of CITIES) {
    for (const tmpl of LAWYER_TEMPLATES) {
      const email = `${tmpl.first.toLowerCase()}.${tmpl.last.toLowerCase()}.${city.toLowerCase()}.test@amiquz.com`;

      // Create auth user
      const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
        email,
        password: 'TestLawyer@2024',
        email_confirm: true,
        user_metadata: {
          first_name: tmpl.first,
          last_name: tmpl.last,
          role: 'lawyer',
          is_test: true,
        },
      });

      if (authErr) {
        const alreadyExists = authErr.message?.toLowerCase().includes('already') || (authErr as any).code === 'email_exists';
        results.push({ email, status: alreadyExists ? 'skipped (exists)' : `auth error: ${authErr.message}` });
        continue;
      }

      const userId = authData.user.id;
      const about = `I specialise in ${tmpl.areas.join(' and ')} with ${tmpl.exp} years of experience practising in ${city}. Clients choose me for clear communication, fair fees, and strong results.`;

      const { error: profileErr } = await supabase.from('lawyer_profiles').upsert({
        id: userId,
        first_name: tmpl.first,
        last_name: tmpl.last,
        title: tmpl.title,
        location: city,
        practice_areas: tmpl.areas,
        about,
        consultation_fee: `₹${tmpl.fee}/hr`,
        fee_60min: String(tmpl.fee),
        rating: tmpl.rating,
        reviews: Math.floor(Math.random() * 40) + 10,
        approved: true,
        practitioner_type: 'Individual Practitioner',
        bar_council_state: BAR_COUNCIL[city],
        years_experience: tmpl.exp,
        work_mode: 'Both',
        languages: ['English', 'Hindi'],
        courts: ['District Court', 'High Court'],
        services: ['Legal Consultation', 'Document Drafting', 'Case Representation'],
        client_types: ['Individuals', 'Startups'],
      });

      results.push({ email, status: profileErr ? `profile error: ${profileErr.message}` : 'created' });
    }
  }

  const created = results.filter(r => r.status === 'created').length;
  const skipped = results.filter(r => r.status.startsWith('skipped')).length;
  const errors  = results.filter(r => r.status.includes('error')).length;

  return NextResponse.json({
    summary: { created, skipped, errors, total: results.length },
    cleanup_query: "DELETE FROM lawyer_profiles WHERE id IN (SELECT id FROM auth.users WHERE email ILIKE '%.test@amiquz.com'); -- then delete from auth.users too",
    results,
  });
}
