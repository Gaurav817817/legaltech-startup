import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ApprovalButton from './ApprovalButton'
import DeleteButton from './DeleteButton'

const ADMIN_EMAIL = 'founders@amiquz.com'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) redirect('/')

  const { data: lawyers } = await supabase
    .from('lawyer_profiles')
    .select('id, first_name, last_name, title, practice_areas, location, consultation_fee, approved, created_at, phone, bar_council_state, years_experience')
    .order('created_at', { ascending: false })

  const pending  = lawyers?.filter(l => !l.approved) ?? []
  const approved = lawyers?.filter(l =>  l.approved) ?? []

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Amiquz Admin</h1>
        <p className="text-gray-500 mt-1">Logged in as {user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Lawyers</p>
          <p className="text-4xl font-bold text-gray-900 mt-1">{lawyers?.length ?? 0}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">Pending Review</p>
          <p className="text-4xl font-bold text-amber-600 mt-1">{pending.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-green-700 font-medium uppercase tracking-wide">Approved</p>
          <p className="text-4xl font-bold text-green-600 mt-1">{approved.length}</p>
        </div>
      </div>

      {/* Pending section */}
      <Section title="Pending Review" count={pending.length} accent="amber">
        {pending.length === 0 ? (
          <EmptyState message="No lawyers pending review." />
        ) : (
          <LawyerTable lawyers={pending} />
        )}
      </Section>

      <div className="mt-8" />

      {/* Approved section */}
      <Section title="Approved Lawyers" count={approved.length} accent="green">
        {approved.length === 0 ? (
          <EmptyState message="No approved lawyers yet." />
        ) : (
          <LawyerTable lawyers={approved} />
        )}
      </Section>
    </div>
  )
}

function Section({ title, count, accent, children }: {
  title: string
  count: number
  accent: 'amber' | 'green'
  children: React.ReactNode
}) {
  const colors = {
    amber: 'border-amber-200 bg-amber-50 text-amber-800',
    green: 'border-green-200 bg-green-50 text-green-800',
  }
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className={`px-6 py-4 border-b flex justify-between items-center ${colors[accent]}`}>
        <h2 className="font-bold text-lg">{title}</h2>
        <span className="text-sm font-medium">{count} total</span>
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
            <th className="text-left px-6 py-3 font-semibold text-gray-600">Action</th>
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
                {new Date(lawyer.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </td>
              <td className="px-6 py-4">
                <a href={`/lawyers/${lawyer.id}`} target="_blank" className="text-blue-600 hover:underline font-medium text-xs">
                  View →
                </a>
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
