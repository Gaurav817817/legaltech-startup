'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendEnquiryNotification } from '@/lib/resend'

export async function submitEnquiry(formData: FormData) {
  const supabase = await createClient()

  const lawyerId = formData.get('lawyer_id') as string
  const lawyerName = formData.get('lawyer_name') as string
  const clientName = formData.get('client_name') as string
  const clientPhone = formData.get('client_phone') as string
  const clientEmail = formData.get('client_email') as string
  const issueDescription = formData.get('issue_description') as string

  const { error } = await supabase.from('enquiries').insert({
    lawyer_id: lawyerId,
    client_name: clientName,
    client_phone: clientPhone,
    client_email: clientEmail || null,
    issue_description: issueDescription,
  })

  if (error) {
    return { success: false, message: 'Failed to send enquiry. Please try again.' }
  }

  // Email the lawyer — fire and forget, never block the user response
  try {
    const admin = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    const { data: { user } } = await admin.auth.admin.getUserById(lawyerId)
    if (user?.email) {
      await sendEnquiryNotification({
        lawyerEmail: user.email,
        lawyerName: lawyerName || 'there',
        lawyerId,
        clientName,
        clientPhone,
        clientEmail: clientEmail || null,
        issueDescription,
      })
    }
  } catch (err) {
    console.error('Enquiry email failed (non-blocking):', err)
  }

  return { success: true, message: 'Enquiry sent! The lawyer will contact you soon.' }
}
