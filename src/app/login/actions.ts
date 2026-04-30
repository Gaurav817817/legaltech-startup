'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  // If role is missing, default to client and patch it
  const role = data.user?.user_metadata?.role
  if (!role) {
    await supabase.auth.updateUser({
      data: { role: 'client' }
    })
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
