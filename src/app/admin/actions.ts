'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

const ADMIN_EMAIL = 'founders@amiquz.com'

export async function setLawyerApproval(id: string, approved: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('lawyer_profiles')
    .update({ approved })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin')
  revalidatePath('/search')
}
