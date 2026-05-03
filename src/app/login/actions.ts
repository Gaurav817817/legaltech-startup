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
    const msg = error.message.toLowerCase()
    if (msg.includes('email not confirmed') || msg.includes('not confirmed')) {
      redirect('/login?error=' + encodeURIComponent('Please confirm your email first — check your inbox for the link we sent.'))
    }
    redirect('/login?error=' + encodeURIComponent('Wrong email or password. New here? Sign up instead.'))
  }

  // Fix null role
  const role = data.user?.user_metadata?.role
  if (!role) {
    await supabase.auth.updateUser({ data: { role: 'client' } })
  }

  revalidatePath('/', 'layout')
  const next = formData.get('next') as string | null
  redirect(next?.startsWith('/') ? next : '/dashboard')
}
