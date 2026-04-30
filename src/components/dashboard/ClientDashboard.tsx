import { FileText, Search, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ClientDashboard({ user }: { user: any }) {
  const firstName = user.user_metadata?.first_name || 'there'

  return (
    <div className="space-y-6">
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 overflow-hidden mb-2">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Welcome, {firstName} 👋</h2>
          <p className="text-blue-200 text-sm mt-1">Find a lawyer or manage your consultations here.</p>
        </div>
        <Link href="/search" className="bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 px-5 py-2.5 rounded-full text-sm font-bold hover:from-amber-300 hover:to-yellow-300 flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-all">
          <Search className="w-4 h-4" /> Find a Lawyer
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" /> Upcoming Consultations
              </h3>
            </div>
            <div className="p-10 text-center">
              <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No consultations booked yet.</p>
              <p className="text-sm text-gray-400 mt-1">Once you book a lawyer, your appointments will appear here.</p>
              <Link href="/search" className="mt-4 inline-block text-blue-600 text-sm font-medium hover:underline">
                Browse lawyers →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" /> My Cases & Documents
              </h3>
            </div>
            <div className="p-10 text-center">
              <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No active cases yet.</p>
              <p className="text-sm text-gray-400 mt-1">Once you hire a lawyer, your case files will appear here.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your Account</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-gray-900">
                  {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900 truncate max-w-[150px]">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account type</span>
                <span className="font-medium text-blue-600">Client</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Not sure where to start?</h3>
            <p className="text-sm text-blue-700 mb-4">Our AI assistant can understand your legal issue and recommend the right lawyer for you.</p>
            <Link href="/intake" className="block text-center bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Try AI Legal Assistant →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
