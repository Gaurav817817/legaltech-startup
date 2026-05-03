'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendEnquiryNotification, sendEnquiryConfirmation } from '@/lib/resend'

export async function submitEnquiry(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'You must be signed in to send an enquiry.' }
  }

  const lawyerId    = formData.get('lawyer_id') as string
  const lawyerName  = formData.get('lawyer_name') as string
  const clientName  = formData.get('client_name') as string
  const clientPhone = formData.get('client_phone') as string
  const clientEmail = formData.get('client_email') as string
  const issueDescription = formData.get('issue_description') as string

  const { data, error } = await supabase
    .from('consultation_requests')
    .insert({
      client_id:     user.id,
      lawyer_id:     lawyerId,
      client_name:   clientName,
      client_phone:  clientPhone,
      client_email:  clientEmail || null,
      issue_summary: issueDescription,
    })
    .select('id')
    .single()

  if (error) {
    return { success: false, message: 'Failed to send enquiry. Please try again.' }
  }

  // Emails — fire and forget, never block the user response
  try {
    const admin = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    const { data: { user: lawyerUser } } = await admin.auth.admin.getUserById(lawyerId)

    await Promise.allSettled([
      lawyerUser?.email
        ? sendEnquiryNotification({
            lawyerEmail: lawyerUser.email,
            lawyerName:  lawyerName || 'there',
            lawyerId,
            clientName,
            clientPhone,
            clientEmail: clientEmail || null,
            issueDescription,
          })
        : Promise.resolve(),
      user.email
        ? sendEnquiryConfirmation({
            clientEmail: user.email,
            clientName,
            lawyerName: lawyerName || 'the lawyer',
            issueDescription,
          })
        : Promise.resolve(),
    ])
  } catch (err) {
    console.error('Enquiry emails failed (non-blocking):', err)
  }

  return { success: true, message: 'Enquiry sent!', requestId: data.id }
}
