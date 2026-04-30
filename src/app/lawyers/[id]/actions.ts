'use server'

import { createClient } from '@/utils/supabase/server'

export async function submitEnquiry(formData: FormData) {
  const supabase = await createClient()

  const lawyerId = formData.get('lawyer_id') as string
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

  return { success: true, message: 'Enquiry sent! The lawyer will contact you soon.' }
}
