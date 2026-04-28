import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// ----------------------------------------------------------------
// IMPORTANT: Set your own email below. Only you can access this page.
// ----------------------------------------------------------------
const ADMIN_EMAIL = 'your@email.com' // <-- CHANGE THIS to your email

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/')
  }

  // Fetch all users using the service role isn't available here,
  // so we read from lawyer_profiles + auth metadata trick:
  // We'll show lawyer_profiles for lawyers, and note clients separately.
  const { data: lawyers } = await supabase
    .from('lawyer_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Amiquz Admin Panel</h1>
        <p className="text-gray-500 mt-1">Only visible to you. Manage your platform from here.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Lawyers</p>
          <p className="text-4xl font-bold text-blue-600 mt-1">{lawyers?.length ?? 0}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Platform</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">Amiquz</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">To see all users</p>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            className="text-blue-600 underline text-sm mt-1 block font-medium"
          >
            Open Supabase → Authentication → Users
          </a>
        </div>
      </div>

      {/* Lawyers Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-900 text-lg">Registered Lawyers</h2>
          <span className="text-sm text-gray-500">{lawyers?.length ?? 0} total</span>
        </div>
        {lawyers && lawyers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Practice Areas</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Location</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Fee</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Joined</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lawyers.map((lawyer) => (
                  <tr key={lawyer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {lawyer.first_name} {lawyer.last_name}
                      {lawyer.title && (
                        <p className="text-xs text-gray-400 font-normal">{lawyer.title}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {lawyer.practice_areas?.join(', ') || '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{lawyer.location || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">{lawyer.consultation_fee || '—'}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(lawyer.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`/lawyers/${lawyer.id}`}
                        className="text-blue-600 hover:underline font-medium"
                        target="_blank"
                      >
                        View →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-gray-400">
            <p className="font-medium">No lawyers have completed their profile yet.</p>
            <p className="text-sm mt-1">When a lawyer signs up and fills their profile, they'll appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
