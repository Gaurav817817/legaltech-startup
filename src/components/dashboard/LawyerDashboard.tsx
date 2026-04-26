import { Calendar as CalendarIcon, Briefcase, FileText, CheckCircle, Clock, Users } from 'lucide-react';

export default function LawyerDashboard({ user }: { user: any }) {
  const stats = [
    { label: 'Active Cases', value: '12', icon: Briefcase },
    { label: 'New Inquiries', value: '3', icon: Users },
    { label: 'Upcoming Meetings', value: '5', icon: CalendarIcon },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Lawyer CRM Dashboard</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
          Update Availability
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 flex items-center shadow-sm">
              <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Consultations */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Upcoming Consultations</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {[1, 2].map((i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">John Doe (Corporate Structuring)</p>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Clock className="w-4 h-4 mr-1" /> Tomorrow, 10:00 AM
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 px-3 py-1 rounded">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Cases */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Active Cases</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-gray-400 mr-4" />
                  <div>
                    <p className="font-medium text-gray-900">Smith vs. TechCorp</p>
                    <p className="text-sm text-gray-500">Status: Gathering Evidence</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  In Progress
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
