'use client';
import Link from "next/link";
import { Scale, User, Briefcase } from "lucide-react";
import { signup } from "./actions";
import { useState, use } from "react";

export default function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = use(searchParams);
  const [accountType, setAccountType] = useState('client');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-md flex items-center justify-center shadow-lg">
            <Scale className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Join LexConnect
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          {params?.error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {params.error}
            </div>
          )}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">How do you want to use LexConnect?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label 
                className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none transition-all ${accountType === 'client' ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50/30' : 'bg-white border-gray-200 hover:border-blue-300'}`}
                onClick={() => setAccountType('client')}
              >
                <input type="radio" name="account-type" value="client" className="sr-only" checked={accountType === 'client'} readOnly />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className={`flex items-center gap-2 text-sm font-bold ${accountType === 'client' ? 'text-blue-700' : 'text-gray-900'}`}>
                      <User className={`w-5 h-5 ${accountType === 'client' ? 'text-blue-600' : 'text-gray-400'}`} />
                      I am a Client
                    </span>
                    <span className="mt-1 flex items-center text-sm text-gray-500">
                      Looking to find a lawyer and book consultations.
                    </span>
                  </span>
                </span>
              </label>

              <label 
                className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none transition-all ${accountType === 'lawyer' ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50/30' : 'bg-white border-gray-200 hover:border-blue-300'}`}
                onClick={() => setAccountType('lawyer')}
              >
                <input type="radio" name="account-type" value="lawyer" className="sr-only" checked={accountType === 'lawyer'} readOnly />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className={`flex items-center gap-2 text-sm font-bold ${accountType === 'lawyer' ? 'text-blue-700' : 'text-gray-900'}`}>
                      <Briefcase className={`w-5 h-5 ${accountType === 'lawyer' ? 'text-blue-600' : 'text-gray-400'}`} />
                      I am a Lawyer
                    </span>
                    <span className="mt-1 flex items-center text-sm text-gray-500">
                      Looking to offer legal services and get leads.
                    </span>
                  </span>
                </span>
              </label>
            </div>
          </div>

          <form className="space-y-6" action={signup}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                <div className="mt-1">
                  <input id="first-name" name="first-name" type="text" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
                </div>
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                <div className="mt-1">
                  <input id="last-name" name="last-name" type="text" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input id="email" name="email" type="email" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input id="password" name="password" type="password" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
              </div>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
