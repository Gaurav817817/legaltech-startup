'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendReminderNotification } from '@/lib/resend'

export async function updateEnquiryStatus(id: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('enquiries')
    .update({ status })
    .eq('id', id)
    .eq('lawyer_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard')
}

export async function sendReminder(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Not authenticated' }

  const requestId = formData.get('request_id') as string

  // Fetch the request — RLS ensures client can only read their own
  const { data: req, error } = await supabase
    .from('consultation_requests')
    .select('id, client_id, lawyer_id, client_name, issue_summary, reminder_sent_at')
    .eq('id', requestId)
    .single()

  if (error || !req) return { success: false, message: 'Request not found' }
  if (req.client_id !== user.id) return { success: false, message: 'Unauthorized' }

  // 24-hour throttle
  if (req.reminder_sent_at) {
    const hoursSince = (Date.now() - new Date(req.reminder_sent_at).getTime()) / 36e5
    if (hoursSince < 24) return { success: false, message: 'Reminder already sent in the last 24 hours' }
  }

  // Update timestamp first so re-renders reflect it immediately
  await supabase
    .from('consultation_requests')
    .update({ reminder_sent_at: new Date().toISOString() })
    .eq('id', requestId)

  // Email lawyer — fire and forget
  try {
    const admin = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    const { data: lawyerProfile } = await supabase
      .from('lawyer_profiles')
      .select('first_name')
      .eq('id', req.lawyer_id)
      .single()

    const { data: { user: lawyerUser } } = await admin.auth.admin.getUserById(req.lawyer_id)
    if (lawyerUser?.email) {
      await sendReminderNotification({
        lawyerEmail: lawyerUser.email,
        lawyerName: lawyerProfile?.first_name || 'there',
        clientName: req.client_name,
        issueDescription: req.issue_summary,
      })
    }
  } catch (err) {
    console.error('Reminder email failed (non-blocking):', err)
  }

  revalidatePath('/dashboard')
  return { success: true }
}
