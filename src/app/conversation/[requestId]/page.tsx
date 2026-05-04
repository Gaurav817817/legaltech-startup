import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ConversationView from '@/components/conversation/ConversationView'

interface Message {
  id: string
  request_id: string
  sender_id: string
  content: string
  created_at: string
}

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ requestId: string }>
}) {
  const { requestId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/conversation/${requestId}`)

  // Fetch the request — includes client and lawyer ids for access check
  const { data: req } = await supabase
    .from('consultation_requests')
    .select('id, client_id, lawyer_id, client_name, issue_summary, status')
    .eq('id', requestId)
    .single()

  if (!req) notFound()

  // Access control: only the client or the lawyer may enter
  const isClient = user.id === req.client_id
  const isLawyer = user.id === req.lawyer_id
  if (!isClient && !isLawyer) redirect('/dashboard')

  // Fetch lawyer display name
  const { data: lawyerProfile } = await supabase
    .from('lawyer_profiles')
    .select('first_name, last_name')
    .eq('id', req.lawyer_id)
    .single()

  const lawyerName = lawyerProfile
    ? `${lawyerProfile.first_name} ${lawyerProfile.last_name}`
    : 'Lawyer'

  // Fetch initial message history
  const { data: initialMessages } = await supabase
    .from('messages')
    .select('id, request_id, sender_id, content, created_at')
    .eq('request_id', requestId)
    .order('created_at', { ascending: true })

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-64px)]">
      <ConversationView
        requestId={requestId}
        currentUserId={user.id}
        isClient={isClient}
        clientName={req.client_name}
        lawyerName={lawyerName}
        lawyerId={req.lawyer_id}
        issueSummary={req.issue_summary}
        requestStatus={req.status}
        initialMessages={(initialMessages ?? []) as Message[]}
      />
    </div>
  )
}
