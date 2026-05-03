'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendApprovalNotification } from '@/lib/resend'

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

  // Notify the lawyer when their profile is approved
  if (approved) {
    try {
      const admin = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      )
      const [{ data: { user: lawyer } }, { data: profile }] = await Promise.all([
        admin.auth.admin.getUserById(id),
        admin.from('lawyer_profiles').select('first_name, last_name').eq('id', id).single(),
      ])
      if (lawyer?.email && profile) {
        await sendApprovalNotification({
          lawyerEmail: lawyer.email,
          lawyerName: `${profile.first_name} ${profile.last_name}`,
          lawyerId: id,
        })
      }
    } catch (err) {
      console.error('Approval email failed (non-blocking):', err)
    }
  }

  revalidatePath('/admin')
  revalidatePath('/search')
}

export async function deleteLawyer(id: string): Promise<{ error: string } | undefined> {
  // Verify caller is admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) return { error: 'Unauthorized' }

  // Service role client — needed to delete from auth.users
  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // 1. Delete enquiries referencing this lawyer (FK child of lawyer_profiles)
  const { error: enquiryErr } = await admin.from('enquiries').delete().eq('lawyer_id', id)
  if (enquiryErr) return { error: `Failed to delete enquiries: ${enquiryErr.message}` }

  // 2. Delete the lawyer profile
  const { error: profileErr } = await admin.from('lawyer_profiles').delete().eq('id', id)
  if (profileErr) return { error: `Failed to delete profile: ${profileErr.message}` }

  // 3. Delete the auth user (ignore "not found" — profile may exist without an auth account)
  const { error: authErr } = await admin.auth.admin.deleteUser(id)
  if (authErr && !authErr.message.toLowerCase().includes('not found')) {
    return { error: `Failed to delete auth user: ${authErr.message}` }
  }

  revalidatePath('/admin')
  revalidatePath('/search')
}
