/**
 * Seed 60 test lawyers into lawyer_profiles.
 * 12 lawyers per city × 5 cities, spread across all 12 practice areas.
 * All emails follow: firstname.lastname.test@amiquz.com
 * All tagged is_test=true for easy identification.
 *
 * Run:  node scripts/seed-test-lawyers.mjs
 * Deps: reads .env.local for NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// ── Load env from .env.local ──────────────────────────────────────────────────
const envPath = new URL('../../../../.env.local', import.meta.url).pathname;
const envFile = readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')]; })
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Config ────────────────────────────────────────────────────────────────────
const TEST_PASSWORD = 'TestLawyer@2024';

const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Lucknow', 'Chandigarh'];

const PRACTICE_AREAS = [
  'Criminal Law',
  'Corporate Law',
  'Civil Litigation',
  'Family Law',
  'Intellectual Property',
  'Real Estate',
  'Employment Law',
  'Tax Law',
  'Immigration',
  'Banking & Finance',
  'Consumer Rights',
  'Cyber Law',
];

// 12 lawyers per city — each has 1-2 primary areas so all 12 areas appear at least once per city
const CITY_LAWYERS = [
  // slot 0–11 → practice area index 0–11 (one each), then cycle
  { first: 'Arjun',     last: 'Sharma',     areas: ['Criminal Law'],            title: 'Senior Advocate',        exp: '10+',   fee: 3000, rating: 4.7 },
  { first: 'Priya',     last: 'Mehta',      areas: ['Corporate Law'],           title: 'Corporate Counsel',      exp: '5-10',  fee: 4000, rating: 4.5 },
  { first: 'Rohit',     last: 'Verma',      areas: ['Civil Litigation'],        title: 'Advocate',               exp: '5-10',  fee: 2500, rating: 4.3 },
  { first: 'Sunita',    last: 'Gupta',      areas: ['Family Law'],              title: 'Family Law Specialist',  exp: '5-10',  fee: 2000, rating: 4.6 },
  { first: 'Vikram',    last: 'Singh',      areas: ['Intellectual Property'],   title: 'IP Attorney',            exp: '3-5',   fee: 5000, rating: 4.4 },
  { first: 'Meera',     last: 'Nair',       areas: ['Real Estate'],             title: 'Property Lawyer',        exp: '5-10',  fee: 2500, rating: 4.2 },
  { first: 'Aditya',    last: 'Kumar',      areas: ['Employment Law'],          title: 'Labour Law Expert',      exp: '3-5',   fee: 2000, rating: 4.5 },
  { first: 'Kavita',    last: 'Rao',        areas: ['Tax Law'],                 title: 'Tax Consultant',         exp: '10+',   fee: 3500, rating: 4.8 },
  { first: 'Sandeep',   last: 'Joshi',      areas: ['Immigration'],             title: 'Immigration Advocate',   exp: '5-10',  fee: 3000, rating: 4.3 },
  { first: 'Deepa',     last: 'Iyer',       areas: ['Banking & Finance'],       title: 'Banking Law Specialist', exp: '10+',   fee: 4000, rating: 4.6 },
  { first: 'Rajesh',    last: 'Pandey',     areas: ['Consumer Rights'],         title: 'Consumer Rights Expert', exp: '3-5',   fee: 1500, rating: 4.1 },
  { first: 'Ananya',    last: 'Krishnan',   areas: ['Cyber Law'],               title: 'Cyber Law Specialist',   exp: '3-5',   fee: 3500, rating: 4.4 },
];

// ── Build full roster ─────────────────────────────────────────────────────────
function buildRoster() {
  const roster = [];
  for (const city of CITIES) {
    for (const template of CITY_LAWYERS) {
      roster.push({ ...template, city });
    }
  }
  return roster;
}

// ── Determine bar council state from city ─────────────────────────────────────
function barCouncil(city) {
  const map = {
    Delhi: 'Delhi',
    Mumbai: 'Maharashtra & Goa',
    Bangalore: 'Karnataka',
    Lucknow: 'Uttar Pradesh',
    Chandigarh: 'Punjab & Haryana',
  };
  return map[city] ?? 'Bar Council of India';
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const roster = buildRoster();
  console.log(`Seeding ${roster.length} test lawyers…\n`);

  let created = 0;
  let skipped = 0;

  for (const lawyer of roster) {
    const email = `${lawyer.first.toLowerCase()}.${lawyer.last.toLowerCase()}.${lawyer.city.toLowerCase()}.test@amiquz.com`;
    const slug  = `${lawyer.first} ${lawyer.last} (${lawyer.city})`;

    // 1. Create auth user
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: {
        first_name: lawyer.first,
        last_name:  lawyer.last,
        role: 'lawyer',
        is_test: true,
      },
    });

    if (authErr) {
      if (authErr.message?.includes('already been registered') || authErr.code === 'email_exists') {
        console.log(`  skip  ${slug} — auth user already exists`);
        skipped++;
        continue;
      }
      console.error(`  ERROR creating auth for ${slug}:`, authErr.message);
      continue;
    }

    const userId = authData.user.id;

    // 2. Insert lawyer_profiles row
    const about = `I specialise in ${lawyer.areas.join(' and ')} with ${lawyer.exp} years of experience practising in ${lawyer.city}. Clients choose me for clear communication, fair fees, and strong results.`;

    const { error: profileErr } = await supabase.from('lawyer_profiles').upsert({
      id:                userId,
      first_name:        lawyer.first,
      last_name:         lawyer.last,
      title:             lawyer.title,
      location:          lawyer.city,
      practice_areas:    lawyer.areas,
      about,
      consultation_fee:  `₹${lawyer.fee}/hr`,
      fee_60min:         String(lawyer.fee),
      rating:            lawyer.rating,
      reviews:           Math.floor(Math.random() * 40) + 10,
      approved:          true,
      is_test:           true,
      practitioner_type: 'Individual Practitioner',
      bar_council_state: barCouncil(lawyer.city),
      years_experience:  lawyer.exp,
      work_mode:         'Both',
      languages:         ['English', 'Hindi'],
      courts:            ['District Court', 'High Court'],
      services:          ['Legal Consultation', 'Document Drafting', 'Case Representation'],
      client_types:      ['Individuals', 'Startups'],
    });

    if (profileErr) {
      // is_test column might not exist yet — retry without it
      if (profileErr.message?.includes('is_test')) {
        const { error: retryErr } = await supabase.from('lawyer_profiles').upsert({
          id:                userId,
          first_name:        lawyer.first,
          last_name:         lawyer.last,
          title:             lawyer.title,
          location:          lawyer.city,
          practice_areas:    lawyer.areas,
          about,
          consultation_fee:  `₹${lawyer.fee}/hr`,
          fee_60min:         String(lawyer.fee),
          rating:            lawyer.rating,
          reviews:           Math.floor(Math.random() * 40) + 10,
          approved:          true,
          practitioner_type: 'Individual Practitioner',
          bar_council_state: barCouncil(lawyer.city),
          years_experience:  lawyer.exp,
          work_mode:         'Both',
          languages:         ['English', 'Hindi'],
          courts:            ['District Court', 'High Court'],
          services:          ['Legal Consultation', 'Document Drafting', 'Case Representation'],
          client_types:      ['Individuals', 'Startups'],
        });
        if (retryErr) {
          console.error(`  ERROR profile for ${slug}:`, retryErr.message);
          continue;
        }
        console.log(`  ✓  ${slug} — ${lawyer.areas.join(', ')} [no is_test col]`);
      } else {
        console.error(`  ERROR profile for ${slug}:`, profileErr.message);
        continue;
      }
    } else {
      console.log(`  ✓  ${slug} — ${lawyer.areas.join(', ')}`);
    }
    created++;
  }

  console.log(`\nDone. ${created} created, ${skipped} skipped (already exist).`);
  console.log(`\nAll test lawyer emails match: *.test@amiquz.com`);
  console.log(`Password for all:              ${TEST_PASSWORD}`);
  console.log(`\nTo wipe test data later:`);
  console.log(`  Delete from lawyer_profiles where id in (`);
  console.log(`    select id from auth.users where email ilike '%.test@amiquz.com'`);
  console.log(`  );`);
  console.log(`  Then delete from auth.users where email ilike '%.test@amiquz.com';`);
}

main().catch(err => { console.error(err); process.exit(1); });
