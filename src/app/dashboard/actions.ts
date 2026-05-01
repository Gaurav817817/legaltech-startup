'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function updateEnquiryStatus(id: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('enquiries')
    .update({ status })
    .eq('id', id)
    .eq('lawyer_id', user.id) // lawyer can only update their own enquiries

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard')
}
