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
    // If no account found, send them to signup with a clear message
    if (error.message.toLowerCase().includes('invalid login') || 
        error.message.toLowerCase().includes('no user found') ||
        error.message.toLowerCase().includes('invalid credentials')) {
      redirect('/signup?error=' + encodeURIComponent('No account found with this email. Please sign up first.'))
    }
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  // Fix null role on login
  const role = data.user?.user_metadata?.role
  if (!role) {
    await supabase.auth.updateUser({ data: { role: 'client' } })
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
