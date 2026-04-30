'use client'

import { Briefcase, Users, Clock, CheckCircle, Edit, Eye, Phone, Mail, LogOut } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface Enquiry {
  id: string
  client_name: string
  client_phone: string
  client_email: string | null
  issue_description: string
  status: string
  created_at: string
}

export default function LawyerDashboard({ user, enquiries, isApproved }: { user: any; enquiries: Enquiry[]; isApproved: boolean }) {
  const router = useRouter()
  const firstName = user.user_metadata?.first_name || 'there'

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 overflow-hidden mb-2" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        <div>
          <h2 className="text-2xl font-extrabold text-white">Welcome, {firstName} 👋</h2>
          <p className="text-blue-200 text-sm mt-1">Your lawyer dashboard — manage your profile and enquiries here.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/lawyer-profile-setup" className="bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold hover:from-amber-300 hover:to-yellow-300 flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-all">
            <Edit className="w-4 h-4" /> Edit Profile
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Approval status banner */}
      {isApproved ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800 text-sm">Profile Approved & Live</p>
            <p className="text-green-700 text-xs mt-0.5">Your profile is visible to clients on Amiquz. You'll receive enquiries here as clients reach out.</p>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800 text-sm">Profile Under Review</p>
            <p className="text-yellow-700 text-xs mt-0.5">Your profile is being reviewed by the Amiquz team. You'll receive a verified badge within 24 hours and become visible to clients.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">

          {/* Enquiries */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" /> Client Enquiries
              </h3>
              {enquiries.length > 0 && (
                <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 text-xs font-bold px-2.5 py-0.5 rounded-full">{enquiries.length}</span>
              )}
            </div>
            {enquiries.length === 0 ? (
              <div className="p-10 text-center">
                <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No enquiries yet.</p>
                <p className="text-sm text-gray-400 mt-1">When clients submit a free enquiry from your profile, they'll appear here.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {enquiries.map((enq) => (
                  <li key={enq.id} className="p-5 hover:bg-gray-50">
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-semibold text-gray-900 text-sm">{enq.client_name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        enq.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        enq.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {enq.status === 'new' ? 'New' : enq.status === 'contacted' ? 'Contacted' : 'Converted'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{enq.issue_description}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                      <a href={`tel:${enq.client_phone}`} className="flex items-center gap-1 text-blue-600 hover:underline font-medium">
                        <Phone className="w-3 h-3" /> {enq.client_phone}
                      </a>
                      {enq.client_email && (
                        <a href={`mailto:${enq.client_email}`} className="flex items-center gap-1 text-blue-600 hover:underline font-medium">
                          <Mail className="w-3 h-3" /> {enq.client_email}
                        </a>
                      )}
                      <span className="text-gray-400">
                        {new Date(enq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Upcoming consultations */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-500" /> Upcoming Consultations
              </h3>
            </div>
            <div className="p-10 text-center">
              <Briefcase className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No consultations scheduled yet.</p>
              <p className="text-sm text-gray-400 mt-1">Booked consultations will appear here once clients start booking.</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
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
                <span className="font-medium text-blue-600">Lawyer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-medium text-yellow-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Pending
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4" /> Your Public Profile
            </h3>
            <p className="text-sm text-blue-700 mb-3">See how clients will see your profile once approved.</p>
            <Link href={`/lawyers/${user.id}`} target="_blank"
              className="block text-center bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Preview Profile →
            </Link>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-5">
            <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Get Verified Faster
            </h3>
            <p className="text-sm text-green-700 mb-3">Make sure your profile is 100% complete to get approved quickly.</p>
            <Link href="/lawyer-profile-setup"
              className="block text-center bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Complete Profile →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
