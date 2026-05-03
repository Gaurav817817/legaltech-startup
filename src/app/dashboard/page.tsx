import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LawyerDashboard from '@/components/dashboard/LawyerDashboard'
import ClientDashboard from '@/components/dashboard/ClientDashboard'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const role = user.user_metadata?.role || 'client'

  // ── Lawyer ──────────────────────────────────────────────────────────
  if (role === 'lawyer') {
    const { data: profile } = await supabase
      .from('lawyer_profiles')
      .select('id, approved')
      .eq('id', user.id)
      .single()

    if (!profile) redirect('/lawyer-profile-setup')

    const { data: enquiries } = await supabase
      .from('consultation_requests')
      .select('id, client_name, client_phone, client_email, issue_summary, status, created_at')
      .eq('lawyer_id', user.id)
      .order('created_at', { ascending: false })

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full bg-gray-50 min-h-screen">
        <LawyerDashboard user={user} enquiries={enquiries ?? []} isApproved={profile.approved === true} />
      </div>
    )
  }

  // ── Client ───────────────────────────────────────────────────────────
  const { data: requests } = await supabase
    .from('consultation_requests')
    .select('id, lawyer_id, client_name, issue_summary, status, created_at, reminder_sent_at')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch lawyer profiles in one query
  const lawyerIds = [...new Set((requests ?? []).map(r => r.lawyer_id))]
  let lawyerMap: Record<string, { first_name: string; last_name: string; title: string | null }> = {}
  if (lawyerIds.length > 0) {
    const { data: lawyers } = await supabase
      .from('lawyer_profiles')
      .select('id, first_name, last_name, title')
      .in('id', lawyerIds)
    lawyers?.forEach(l => { lawyerMap[l.id] = l })
  }

  const consultationRequests = (requests ?? []).map(r => {
    const lawyer = lawyerMap[r.lawyer_id]
    const reminderSentAt = r.reminder_sent_at ? new Date(r.reminder_sent_at) : null
    const canSendReminder = !reminderSentAt || (Date.now() - reminderSentAt.getTime()) > 24 * 60 * 60 * 1000
    return {
      id: r.id,
      lawyerId: r.lawyer_id,
      lawyerName: lawyer ? `${lawyer.first_name} ${lawyer.last_name}` : 'Unknown Lawyer',
      lawyerTitle: lawyer?.title ?? null,
      issueSummary: r.issue_summary,
      status: r.status as 'pending' | 'active' | 'closed',
      createdAt: r.created_at,
      canSendReminder,
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full bg-gray-50 min-h-screen">
      <ClientDashboard user={user} consultationRequests={consultationRequests} />
    </div>
  )
}
