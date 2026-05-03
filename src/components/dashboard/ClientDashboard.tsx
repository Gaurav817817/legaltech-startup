import { MessageSquare, Search, ArrowRight, Clock, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import ReminderButton from './ReminderButton'

interface ConsultationRequest {
  id: string
  lawyerId: string
  lawyerName: string
  lawyerTitle: string | null
  issueSummary: string
  status: 'pending' | 'active' | 'closed'
  createdAt: string
  canSendReminder: boolean
}

const STATUS_CONFIG = {
  pending: { label: 'Awaiting Response', icon: Clock,        color: 'text-amber-700 bg-amber-50 border-amber-200' },
  active:  { label: 'Active',            icon: CheckCircle2, color: 'text-green-700 bg-green-50 border-green-200'  },
  closed:  { label: 'Closed',            icon: XCircle,      color: 'text-gray-500 bg-gray-50 border-gray-200'    },
}

export default function ClientDashboard({
  user,
  consultationRequests,
}: {
  user: any
  consultationRequests: ConsultationRequest[]
}) {
  const firstName = user.user_metadata?.first_name || 'there'
  const open = consultationRequests.filter(r => r.status !== 'closed')
  const closed = consultationRequests.filter(r => r.status === 'closed')

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 overflow-hidden">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Welcome, {firstName} 👋</h2>
          <p className="text-blue-200 text-sm mt-1">
            {consultationRequests.length > 0
              ? `You have ${open.length} open enquir${open.length === 1 ? 'y' : 'ies'}.`
              : 'Find a lawyer or manage your consultations here.'}
          </p>
        </div>
        <Link
          href="/search"
          className="bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 px-5 py-2.5 rounded-full text-sm font-bold hover:from-amber-300 hover:to-yellow-300 flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-all shrink-0"
        >
          <Search className="w-4 h-4" /> Find a Lawyer
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* My Enquiries */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500" /> My Enquiries
              </h3>
              {open.length > 0 && (
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
                  {open.length} open
                </span>
              )}
            </div>

            {consultationRequests.length === 0 ? (
              <div className="p-10 text-center">
                <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No enquiries yet.</p>
                <p className="text-sm text-gray-400 mt-1 mb-4">
                  Find a lawyer and send a free enquiry to get started.
                </p>
                <Link href="/intake" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline">
                  Try the AI assistant <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {consultationRequests.map(req => {
                  const cfg = STATUS_CONFIG[req.status]
                  const StatusIcon = cfg.icon
                  return (
                    <div key={req.id} className="px-6 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Link
                              href={`/lawyers/${req.lawyerId}`}
                              className="font-bold text-gray-900 text-sm hover:text-blue-600 transition-colors"
                            >
                              {req.lawyerName}
                            </Link>
                            {req.lawyerTitle && (
                              <span className="text-xs text-gray-400">· {req.lawyerTitle}</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                            {req.issueSummary}
                          </p>
                          <p className="text-xs text-gray-400 mt-1.5">
                            Sent {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                            <StatusIcon className="w-3 h-3" /> {cfg.label}
                          </span>
                          {req.status !== 'closed' && (
                            <ReminderButton requestId={req.id} canSend={req.canSendReminder} />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4 text-sm">Your Account</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span className="font-semibold text-gray-900">
                  {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 shrink-0">Email</span>
                <span className="font-semibold text-gray-900 truncate">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account</span>
                <span className="font-semibold text-blue-600">Client</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
            <h3 className="font-bold text-blue-900 mb-1.5 text-sm">Not sure where to start?</h3>
            <p className="text-sm text-blue-700 mb-4 leading-relaxed">
              Our AI assistant understands your legal issue and finds the right lawyer for you.
            </p>
            <Link
              href="/intake"
              className="block text-center bg-blue-600 text-white text-sm font-bold py-2.5 px-4 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Try AI Legal Assistant →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
