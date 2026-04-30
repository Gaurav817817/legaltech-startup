'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function setLawyerApproved(lawyerId: string, approved: boolean) {
  const supabase = await createClient()
  await supabase
    .from('lawyer_profiles')
    .update({ approved })
    .eq('id', lawyerId)
  revalidatePath('/admin')
  revalidatePath('/search')
}
