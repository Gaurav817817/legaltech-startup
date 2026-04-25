import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LawyerDashboard from '@/components/dashboard/LawyerDashboard'
import ClientDashboard from '@/components/dashboard/ClientDashboard'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const role = user.user_metadata?.role || 'client'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full bg-gray-50 min-h-screen">
      {role === 'lawyer' ? (
        <LawyerDashboard user={user} />
      ) : (
        <ClientDashboard user={user} />
      )}
    </div>
  )
}
