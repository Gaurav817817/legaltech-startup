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

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName, role }
    }
  })

  // Show the actual error message — don't assume
  if (error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('user already')) {
      redirect('/login?error=' + encodeURIComponent('You already have an account. Please login instead.'))
    }
    redirect('/signup?error=' + encodeURIComponent(error.message))
  }

  // Supabase returns identities=[] when email already exists (in some configurations)
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    redirect('/login?error=' + encodeURIComponent('You already have an account. Please login instead.'))
  }

  revalidatePath('/', 'layout')
  redirect(`/signup/verify-email?email=${encodeURIComponent(email)}`)
}
