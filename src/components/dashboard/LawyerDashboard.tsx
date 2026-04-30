import { Briefcase, Users, Clock, CheckCircle, Edit, Eye } from 'lucide-react';
import Link from 'next/link';

export default function LawyerDashboard({ user }: { user: any }) {
  const firstName = user.user_metadata?.first_name || 'there'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome, {firstName} 👋</h2>
          <p className="text-gray-500 text-sm mt-1">Your lawyer dashboard — manage your profile and enquiries here.</p>
        </div>
        <Link href="/lawyer-profile-setup" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 shadow-sm">
          <Edit className="w-4 h-4" /> Edit Profile
        </Link>
      </div>

      {/* Pending approval banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
        <Clock className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-yellow-800 text-sm">Profile Under Review</p>
          <p className="text-yellow-700 text-xs mt-0.5">Your profile is being reviewed by the Amiquz team. You'll receive a verified badge within 24 hours and become visible to clients.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">

          {/* Enquiries */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" /> Client Enquiries
              </h3>
            </div>
            <div className="p-10 text-center">
              <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No enquiries yet.</p>
              <p className="text-sm text-gray-400 mt-1">Once your profile is approved and clients reach out, enquiries will appear here.</p>
            </div>
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
