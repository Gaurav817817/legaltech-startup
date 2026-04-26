import { Calendar as CalendarIcon, Clock, FileText, Search } from 'lucide-react';
import Link from 'next/link';

export default function ClientDashboard({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Client Dashboard</h2>
        <Link href="/search" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center">
          <Search className="w-4 h-4 mr-2" /> Find a Lawyer
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">My Upcoming Consultations</h3>
            </div>
            <div className="p-6">
              <div className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center bg-white hover:border-blue-300 transition-colors">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg mr-4 shrink-0">
                    SA
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Sarah J. Adams</p>
                    <p className="text-sm text-gray-600">Corporate Law Consultation</p>
                    <p className="text-sm text-blue-600 flex items-center mt-1 font-medium">
                      <Clock className="w-4 h-4 mr-1" /> Tomorrow, 10:00 AM - 11:00 AM
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">Reschedule</button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Join Call</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">My Cases & Documents</h3>
            </div>
            <div className="p-6 text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No active cases yet.</p>
              <p className="text-sm text-gray-400 mt-1">Once you hire a lawyer, your case files will appear here.</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-6">
             <h3 className="font-semibold text-gray-900 mb-4">Payment History</h3>
             <div className="space-y-4">
               <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                 <div>
                   <p className="font-medium text-gray-900">Consultation Fee</p>
                   <p className="text-gray-500">Oct 10, 2026</p>
                 </div>
                 <span className="font-semibold text-gray-900">$200.00</span>
               </div>
               <button className="text-blue-600 text-sm font-medium w-full text-center hover:underline">View All Invoices</button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
