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
  const role = (formData.get('account-type') as string) || 'client'

  // Check if user already exists before signing up
  const { data: existingUser } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', email)
    .single()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName, role }
    }
  })

  if (error) {
    redirect('/login?error=' + encodeURIComponent('You already have an account. Please login instead.'))
  }

  // Supabase returns a user with identities=[] if email already registered
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    redirect('/login?error=' + encodeURIComponent('You already have an account. Please login instead.'))
  }

  revalidatePath('/', 'layout')

  if (role === 'lawyer') {
    redirect('/lawyer-profile-setup')
  } else {
    redirect('/dashboard')
  }
}
