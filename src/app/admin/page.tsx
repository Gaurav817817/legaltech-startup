import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ApprovalButton from './ApprovalButton'
import DeleteButton from './DeleteButton'

const ADMIN_EMAIL = 'founders@amiquz.com'

const PRACTICE_AREAS = [
  'Criminal Law', 'Corporate Law', 'Civil Litigation', 'Family Law',
  'Intellectual Property', 'Real Estate', 'Employment Law', 'Tax Law',
  'Immigration', 'Banking & Finance', 'Consumer Rights', 'Cyber Law',
]

const EXPERIENCE_OPTIONS = [
  { value: '0-2',  label: '0–2 years' },
  { value: '3-5',  label: '3–5 years' },
  { value: '5-10', label: '5–10 years' },
  { value: '10+',  label: '10+ years' },
]

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ loc?: string; area?: string; exp?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) redirect('/')

  const { loc, area, exp } = await searchParams

  // Fetch all for stats (unfiltered), then filtered for tables
  const { data: allLawyers } = await supabase
    .from('lawyer_profiles')
    .select('id, approved')

  let query = supabase
    .from('lawyer_profiles')
    .select('id, first_name, last_name, title, practice_areas, location, consultation_fee, approved, created_at, phone, bar_council_state, years_experience')
    .order('created_at', { ascending: false })

  if (loc)  query = query.ilike('location', `%${loc}%`)
  if (area) query = query.filter('practice_areas', 'cs', `{"${area}"}`)
  if (exp)  query = query.eq('years_experience', exp)

  const { data: lawyers } = await query

  // Distinct locations for the dropdown
  const { data: locationRows } = await supabase
    .from('lawyer_profiles')
    .select('location')
  const locations = [...new Set((locationRows ?? []).map(r => r.location).filter(Boolean))].sort()

  const totalAll   = allLawyers?.length ?? 0
  const pendingAll = allLawyers?.filter(l => !l.approved).length ?? 0
  const approvedAll= allLawyers?.filter(l =>  l.approved).length ?? 0

  const pending  = lawyers?.filter(l => !l.approved) ?? []
  const approved = lawyers?.filter(l =>  l.approved) ?? []

  const isFiltered = !!(loc || area || exp)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Amiquz Admin</h1>
        <p className="text-gray-500 mt-1">Logged in as {user.email}</p>
      </div>

      {/* Stats — always show totals, not filtered counts */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Lawyers</p>
          <p className="text-4xl font-bold text-gray-900 mt-1">{totalAll}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">Pending Review</p>
          <p className="text-4xl font-bold text-amber-600 mt-1">{pendingAll}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-green-700 font-medium uppercase tracking-wide">Approved</p>
          <p className="text-4xl font-bold text-green-600 mt-1">{approvedAll}</p>
        </div>
      </div>

      {/* Filter bar */}
      <form method="GET" action="/admin" className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Location</label>
          <select name="loc" defaultValue={loc ?? ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500">
            <option value="">All cities</option>
            {locations.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Practice Area</label>
          <select name="area" defaultValue={area ?? ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500">
            <option value="">All areas</option>
            {PRACTICE_AREAS.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Experience</label>
          <select name="exp" defaultValue={exp ?? ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500">
            <option value="">All experience</option>
            {EXPERIENCE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
            Apply
          </button>
          {isFiltered && (
            <a href="/admin" className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Clear
            </a>
          )}
        </div>

        {isFiltered && (
          <p className="w-full text-xs text-blue-600 font-medium mt-1">
            Showing {lawyers?.length ?? 0} result{lawyers?.length === 1 ? '' : 's'}
            {loc ? ` in ${loc}` : ''}
            {area ? ` · ${area}` : ''}
            {exp ? ` · ${exp} yrs exp` : ''}
          </p>
        )}
      </form>

      {/* Pending section */}
      <Section title="Pending Review" count={pending.length} accent="amber">
        {pending.length === 0 ? (
          <EmptyState message={isFiltered ? 'No pending lawyers match these filters.' : 'No lawyers pending review.'} />
        ) : (
          <LawyerTable lawyers={pending} />
        )}
      </Section>

      <div className="mt-8" />

      {/* Approved section */}
      <Section title="Approved Lawyers" count={approved.length} accent="green">
        {approved.length === 0 ? (
          <EmptyState message={isFiltered ? 'No approved lawyers match these filters.' : 'No approved lawyers yet.'} />
        ) : (
          <LawyerTable lawyers={approved} />
        )}
      </Section>
    </div>
  )
}

function Section({ title, count, accent, children }: {
  title: string; count: number; accent: 'amber' | 'green'; children: React.ReactNode
}) {
  const colors = { amber: 'border-amber-200 bg-amber-50 text-amber-800', green: 'border-green-200 bg-green-50 text-green-800' }
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className={`px-6 py-4 border-b flex justify-between items-center ${colors[accent]}`}>
        <h2 className="font-bold text-lg">{title}</h2>
        <span className="text-sm font-medium">{count} shown</span>
      </div>
      {children}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-10 text-center text-gray-400">
      <p className="font-medium">{message}</p>
    </div>
  )
}

function LawyerTable({ lawyers }: { lawyers: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="text-left px-6 py-3 font-semibold text-gray-600">Name</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-600">Practice Areas</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-600">Location</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-600">Experience</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-600">Fee</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-600">Joined</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-600">Profile</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-600">Approve</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-600">Delete</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {lawyers.map((lawyer) => (
            <tr key={lawyer.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <p className="font-medium text-gray-900">{lawyer.first_name} {lawyer.last_name}</p>
                {lawyer.title && <p className="text-xs text-gray-400">{lawyer.title}</p>}
                {lawyer.phone && <p className="text-xs text-gray-400">{lawyer.phone}</p>}
              </td>
              <td className="px-6 py-4 max-w-[180px]">
                <div className="flex flex-wrap gap-1">
                  {lawyer.practice_areas?.slice(0, 2).map((a: string) => (
                    <span key={a} className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-0.5">{a}</span>
                  ))}
                  {(lawyer.practice_areas?.length ?? 0) > 2 && (
                    <span className="text-xs text-gray-400">+{lawyer.practice_areas.length - 2}</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600 text-xs">{lawyer.location || '—'}</td>
              <td className="px-6 py-4 text-gray-600 text-xs">
                {lawyer.years_experience ? `${lawyer.years_experience} yrs` : '—'}
                {lawyer.bar_council_state && <p className="text-gray-400">{lawyer.bar_council_state}</p>}
              </td>
              <td className="px-6 py-4 text-gray-600 text-xs">{lawyer.consultation_fee || '—'}</td>
              <td className="px-6 py-4 text-gray-400 text-xs">
                {new Date(lawyer.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </td>
              <td className="px-6 py-4">
                <a href={`/lawyers/${lawyer.id}`} target="_blank" className="text-blue-600 hover:underline font-medium text-xs">View →</a>
              </td>
              <td className="px-6 py-4">
                <ApprovalButton lawyerId={lawyer.id} approved={lawyer.approved ?? false} />
              </td>
              <td className="px-6 py-4">
                <DeleteButton lawyerId={lawyer.id} name={`${lawyer.first_name} ${lawyer.last_name}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
