'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'founders@amiquz.com'

export async function setLawyerApproval(id: string, approved: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('lawyer_profiles')
    .update({ approved })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin')
  revalidatePath('/search')
}

export async function deleteLawyer(id: string) {
  // Verify caller is admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) throw new Error('Unauthorized')

  // Service role client — needed to delete from auth.users
  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Delete profile first (FK child), then auth user (FK parent)
  const { error: profileErr } = await admin.from('lawyer_profiles').delete().eq('id', id)
  if (profileErr) throw new Error(profileErr.message)

  const { error: authErr } = await admin.auth.admin.deleteUser(id)
  if (authErr) throw new Error(authErr.message)

  revalidatePath('/admin')
  revalidatePath('/search')
}
