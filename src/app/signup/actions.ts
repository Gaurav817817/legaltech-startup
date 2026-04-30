'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('first-name') as string
  const lastName = formData.get('last-name') as string
  const role = formData.get('account-type') as string || 'client'

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        role: role,
      }
    }
  })

  if (error) {
    // If user already exists, send them to login with a clear message
    if (error.message.toLowerCase().includes('already registered') || 
        error.message.toLowerCase().includes('already exists') ||
        error.message.toLowerCase().includes('user already')) {
      redirect('/login?error=' + encodeURIComponent('You already have an account. Please login instead.'))
    }
    redirect('/signup?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')

  if (role === 'lawyer') {
    redirect('/lawyer-profile-setup')
  } else {
    redirect('/dashboard')
  }
}
