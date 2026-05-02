import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const SEED_TOKEN = 'amiquz-seed-2024';

// 60 fully distinct lawyers — 12 per city, one per practice area
const LAWYERS: {
  first: string; last: string; city: string; areas: string[];
  title: string; exp: string; fee: number; rating: number;
}[] = [
  // ── DELHI (12) ──────────────────────────────────────────────────────────────
  { first: 'Arjun',     last: 'Sharma',        city: 'Delhi',      areas: ['Criminal Law'],          title: 'Senior Advocate',        exp: '10+',  fee: 3000, rating: 4.7 },
  { first: 'Priya',     last: 'Kapoor',        city: 'Delhi',      areas: ['Corporate Law'],         title: 'Corporate Counsel',      exp: '5-10', fee: 4000, rating: 4.5 },
  { first: 'Rohit',     last: 'Malhotra',      city: 'Delhi',      areas: ['Civil Litigation'],      title: 'Advocate',               exp: '5-10', fee: 2500, rating: 4.3 },
  { first: 'Sunita',    last: 'Agarwal',       city: 'Delhi',      areas: ['Family Law'],            title: 'Family Law Specialist',  exp: '5-10', fee: 2000, rating: 4.6 },
  { first: 'Vikram',    last: 'Chadha',        city: 'Delhi',      areas: ['Intellectual Property'], title: 'IP Attorney',            exp: '3-5',  fee: 5000, rating: 4.4 },
  { first: 'Meera',     last: 'Khanna',        city: 'Delhi',      areas: ['Real Estate'],           title: 'Property Lawyer',        exp: '5-10', fee: 2500, rating: 4.2 },
  { first: 'Aditya',    last: 'Bhatia',        city: 'Delhi',      areas: ['Employment Law'],        title: 'Labour Law Expert',      exp: '3-5',  fee: 2000, rating: 4.5 },
  { first: 'Kavita',    last: 'Saxena',        city: 'Delhi',      areas: ['Tax Law'],               title: 'Tax Consultant',         exp: '10+',  fee: 3500, rating: 4.8 },
  { first: 'Sandeep',   last: 'Grover',        city: 'Delhi',      areas: ['Immigration'],           title: 'Immigration Advocate',   exp: '5-10', fee: 3000, rating: 4.3 },
  { first: 'Deepa',     last: 'Tandon',        city: 'Delhi',      areas: ['Banking & Finance'],     title: 'Banking Law Specialist', exp: '10+',  fee: 4000, rating: 4.6 },
  { first: 'Rajesh',    last: 'Sood',          city: 'Delhi',      areas: ['Consumer Rights'],       title: 'Consumer Rights Expert', exp: '3-5',  fee: 1500, rating: 4.1 },
  { first: 'Ananya',    last: 'Chopra',        city: 'Delhi',      areas: ['Cyber Law'],             title: 'Cyber Law Specialist',   exp: '3-5',  fee: 3500, rating: 4.4 },

  // ── MUMBAI (12) ─────────────────────────────────────────────────────────────
  { first: 'Sanjay',    last: 'Mehta',         city: 'Mumbai',     areas: ['Criminal Law'],          title: 'Criminal Defence Advocate', exp: '10+',  fee: 3500, rating: 4.6 },
  { first: 'Pooja',     last: 'Desai',         city: 'Mumbai',     areas: ['Corporate Law'],         title: 'M&A Counsel',            exp: '5-10', fee: 5000, rating: 4.5 },
  { first: 'Nikhil',    last: 'Shah',          city: 'Mumbai',     areas: ['Civil Litigation'],      title: 'Advocate',               exp: '3-5',  fee: 2000, rating: 4.2 },
  { first: 'Rekha',     last: 'Patil',         city: 'Mumbai',     areas: ['Family Law'],            title: 'Family Court Specialist', exp: '5-10', fee: 2500, rating: 4.7 },
  { first: 'Amit',      last: 'Joshi',         city: 'Mumbai',     areas: ['Intellectual Property'], title: 'Patent Attorney',        exp: '5-10', fee: 4500, rating: 4.3 },
  { first: 'Nandini',   last: 'Kulkarni',      city: 'Mumbai',     areas: ['Real Estate'],           title: 'RERA Specialist',        exp: '3-5',  fee: 3000, rating: 4.4 },
  { first: 'Vivek',     last: 'Thakur',        city: 'Mumbai',     areas: ['Employment Law'],        title: 'Labour Advocate',        exp: '10+',  fee: 2500, rating: 4.6 },
  { first: 'Sheela',    last: 'Naik',          city: 'Mumbai',     areas: ['Tax Law'],               title: 'GST & Tax Expert',       exp: '10+',  fee: 4000, rating: 4.8 },
  { first: 'Rajan',     last: 'Shetty',        city: 'Mumbai',     areas: ['Immigration'],           title: 'Visa & Immigration Counsel', exp: '5-10', fee: 3000, rating: 4.2 },
  { first: 'Alpa',      last: 'Vora',          city: 'Mumbai',     areas: ['Banking & Finance'],     title: 'SARFAESI Specialist',    exp: '10+',  fee: 4500, rating: 4.7 },
  { first: 'Prakash',   last: 'Pawar',         city: 'Mumbai',     areas: ['Consumer Rights'],       title: 'Consumer Forum Expert',  exp: '3-5',  fee: 1500, rating: 4.0 },
  { first: 'Shreya',    last: 'Bhatt',         city: 'Mumbai',     areas: ['Cyber Law'],             title: 'IT Law Specialist',      exp: '3-5',  fee: 3500, rating: 4.5 },

  // ── BANGALORE (12) ──────────────────────────────────────────────────────────
  { first: 'Kiran',     last: 'Reddy',         city: 'Bangalore',  areas: ['Criminal Law'],          title: 'Criminal Advocate',      exp: '5-10', fee: 2500, rating: 4.4 },
  { first: 'Sowmya',    last: 'Iyengar',       city: 'Bangalore',  areas: ['Corporate Law'],         title: 'Startup & Corp Counsel', exp: '3-5',  fee: 4000, rating: 4.3 },
  { first: 'Ravi',      last: 'Krishnamurthy', city: 'Bangalore',  areas: ['Civil Litigation'],      title: 'Senior Advocate',        exp: '10+',  fee: 3000, rating: 4.6 },
  { first: 'Lakshmi',   last: 'Gowda',         city: 'Bangalore',  areas: ['Family Law'],            title: 'Family Law Expert',      exp: '5-10', fee: 2000, rating: 4.5 },
  { first: 'Suresh',    last: 'Hegde',         city: 'Bangalore',  areas: ['Intellectual Property'], title: 'IP & Tech Lawyer',       exp: '5-10', fee: 5000, rating: 4.6 },
  { first: 'Divya',     last: 'Menon',         city: 'Bangalore',  areas: ['Real Estate'],           title: 'Property Law Specialist', exp: '3-5', fee: 2500, rating: 4.1 },
  { first: 'Prasad',    last: 'Narayanan',     city: 'Bangalore',  areas: ['Employment Law'],        title: 'HR & Labour Counsel',    exp: '5-10', fee: 2500, rating: 4.4 },
  { first: 'Usha',      last: 'Ramesh',        city: 'Bangalore',  areas: ['Tax Law'],               title: 'Direct Tax Specialist',  exp: '10+',  fee: 3500, rating: 4.7 },
  { first: 'Venkat',    last: 'Subramaniam',   city: 'Bangalore',  areas: ['Immigration'],           title: 'Immigration Consultant', exp: '5-10', fee: 3000, rating: 4.3 },
  { first: 'Anitha',    last: 'Bhat',          city: 'Bangalore',  areas: ['Banking & Finance'],     title: 'Insolvency Practitioner', exp: '10+', fee: 4000, rating: 4.5 },
  { first: 'Mohan',     last: 'Srinivas',      city: 'Bangalore',  areas: ['Consumer Rights'],       title: 'Consumer Advocate',      exp: '3-5',  fee: 1500, rating: 4.2 },
  { first: 'Preethi',   last: 'Rao',           city: 'Bangalore',  areas: ['Cyber Law'],             title: 'Cyber & Data Law Expert', exp: '3-5', fee: 4000, rating: 4.6 },

  // ── LUCKNOW (12) ────────────────────────────────────────────────────────────
  { first: 'Devendra',  last: 'Mishra',        city: 'Lucknow',    areas: ['Criminal Law'],          title: 'Criminal Advocate',      exp: '10+',  fee: 2500, rating: 4.5 },
  { first: 'Nisha',     last: 'Tripathi',      city: 'Lucknow',    areas: ['Corporate Law'],         title: 'Corporate Lawyer',       exp: '3-5',  fee: 3000, rating: 4.2 },
  { first: 'Sushil',    last: 'Pandey',        city: 'Lucknow',    areas: ['Civil Litigation'],      title: 'Civil Court Advocate',   exp: '10+',  fee: 2000, rating: 4.3 },
  { first: 'Preeti',    last: 'Awasthi',       city: 'Lucknow',    areas: ['Family Law'],            title: 'Family & Matrimonial Lawyer', exp: '5-10', fee: 1800, rating: 4.6 },
  { first: 'Ashok',     last: 'Srivastava',    city: 'Lucknow',    areas: ['Intellectual Property'], title: 'IP Counsel',             exp: '5-10', fee: 4000, rating: 4.3 },
  { first: 'Ritu',      last: 'Shukla',        city: 'Lucknow',    areas: ['Real Estate'],           title: 'Property Advocate',      exp: '3-5',  fee: 2000, rating: 4.1 },
  { first: 'Manoj',     last: 'Tiwari',        city: 'Lucknow',    areas: ['Employment Law'],        title: 'Labour Law Practitioner', exp: '5-10', fee: 1800, rating: 4.4 },
  { first: 'Vandana',   last: 'Dixit',         city: 'Lucknow',    areas: ['Tax Law'],               title: 'Tax & GST Consultant',   exp: '10+',  fee: 3000, rating: 4.7 },
  { first: 'Hemant',    last: 'Bajpai',        city: 'Lucknow',    areas: ['Immigration'],           title: 'Immigration Advocate',   exp: '3-5',  fee: 2500, rating: 4.1 },
  { first: 'Archana',   last: 'Verma',         city: 'Lucknow',    areas: ['Banking & Finance'],     title: 'Loan & Recovery Lawyer', exp: '5-10', fee: 2500, rating: 4.4 },
  { first: 'Girish',    last: 'Dwivedi',       city: 'Lucknow',    areas: ['Consumer Rights'],       title: 'Consumer Forum Advocate', exp: '3-5', fee: 1200, rating: 4.0 },
  { first: 'Swati',     last: 'Gupta',         city: 'Lucknow',    areas: ['Cyber Law'],             title: 'Cyber Crime Specialist', exp: '3-5',  fee: 3000, rating: 4.3 },

  // ── CHANDIGARH (12) ─────────────────────────────────────────────────────────
  { first: 'Harpreet',  last: 'Singh',         city: 'Chandigarh', areas: ['Criminal Law'],          title: 'Criminal Defence Advocate', exp: '10+',  fee: 2500, rating: 4.6 },
  { first: 'Manpreet',  last: 'Kaur',          city: 'Chandigarh', areas: ['Corporate Law'],         title: 'Corporate Counsel',      exp: '5-10', fee: 3500, rating: 4.4 },
  { first: 'Gurpreet',  last: 'Dhaliwal',      city: 'Chandigarh', areas: ['Civil Litigation'],      title: 'High Court Advocate',    exp: '10+',  fee: 2500, rating: 4.5 },
  { first: 'Simran',    last: 'Arora',         city: 'Chandigarh', areas: ['Family Law'],            title: 'Family Law Specialist',  exp: '3-5',  fee: 2000, rating: 4.5 },
  { first: 'Parminder', last: 'Gill',          city: 'Chandigarh', areas: ['Intellectual Property'], title: 'IP Attorney',            exp: '5-10', fee: 4000, rating: 4.3 },
  { first: 'Navneet',   last: 'Cheema',        city: 'Chandigarh', areas: ['Real Estate'],           title: 'Property Lawyer',        exp: '3-5',  fee: 2000, rating: 4.2 },
  { first: 'Balwinder', last: 'Sandhu',        city: 'Chandigarh', areas: ['Employment Law'],        title: 'Labour & HR Advocate',   exp: '5-10', fee: 2000, rating: 4.4 },
  { first: 'Jasmine',   last: 'Bajwa',         city: 'Chandigarh', areas: ['Tax Law'],               title: 'Tax Law Specialist',     exp: '5-10', fee: 3000, rating: 4.6 },
  { first: 'Ravinder',  last: 'Anand',         city: 'Chandigarh', areas: ['Immigration'],           title: 'Immigration Counsel',    exp: '3-5',  fee: 2500, rating: 4.2 },
  { first: 'Kamaljit',  last: 'Bhinder',       city: 'Chandigarh', areas: ['Banking & Finance'],     title: 'Banking Law Expert',     exp: '10+',  fee: 3500, rating: 4.5 },
  { first: 'Tejinder',  last: 'Randhawa',      city: 'Chandigarh', areas: ['Consumer Rights'],       title: 'Consumer Rights Expert', exp: '3-5',  fee: 1500, rating: 4.1 },
  { first: 'Amrit',     last: 'Bains',         city: 'Chandigarh', areas: ['Cyber Law'],             title: 'Cyber & IT Law Expert',  exp: '3-5',  fee: 3000, rating: 4.3 },
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

  // ── Step 1: wipe existing test lawyers ──────────────────────────────────────
  const { data: existingUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const testUsers = (existingUsers?.users ?? []).filter(u => u.email?.endsWith('.test@amiquz.com'));

  for (const u of testUsers) {
    await supabase.from('lawyer_profiles').delete().eq('id', u.id);
    await supabase.auth.admin.deleteUser(u.id);
  }

  // ── Step 2: create 60 fresh lawyers ─────────────────────────────────────────
  const results: { email: string; status: string }[] = [];

  for (const l of LAWYERS) {
    const email = `${l.first.toLowerCase()}.${l.last.toLowerCase()}.${l.city.toLowerCase()}.test@amiquz.com`;

    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email,
      password: 'TestLawyer@2024',
      email_confirm: true,
      user_metadata: { first_name: l.first, last_name: l.last, role: 'lawyer', is_test: true },
    });

    if (authErr) {
      results.push({ email, status: `auth error: ${authErr.message}` });
      continue;
    }

    const about = `I specialise in ${l.areas.join(' and ')} with ${l.exp} years of experience practising in ${l.city}. Clients choose me for clear communication, fair fees, and strong results.`;

    const { error: profileErr } = await supabase.from('lawyer_profiles').upsert({
      id: authData.user.id,
      first_name: l.first,
      last_name: l.last,
      title: l.title,
      location: l.city,
      practice_areas: l.areas,
      about,
      consultation_fee: `₹${l.fee}/hr`,
      fee_60min: String(l.fee),
      rating: l.rating,
      reviews: Math.floor(Math.random() * 40) + 10,
      approved: true,
      practitioner_type: 'Individual Practitioner',
      bar_council_state: BAR_COUNCIL[l.city],
      years_experience: l.exp,
      work_mode: 'Both',
      languages: ['English', 'Hindi'],
      courts: ['District Court', 'High Court'],
      services: ['Legal Consultation', 'Document Drafting', 'Case Representation'],
      client_types: ['Individuals', 'Startups'],
    });

    results.push({ email, status: profileErr ? `profile error: ${profileErr.message}` : 'created' });
  }

  const created = results.filter(r => r.status === 'created').length;
  const errors  = results.filter(r => r.status.includes('error')).length;
  const wiped   = testUsers.length;

  return NextResponse.json({ summary: { wiped, created, errors, total: results.length }, results });
}
