import Link from "next/link";
import { login } from "./actions";
import { Scale } from "lucide-react";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-700 rounded-md flex items-center justify-center shadow-lg">
            <Scale className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-600">
          New to Amiquz?{" "}
          <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-500">
            Create a free account →
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl sm:rounded-2xl border border-gray-100">
          {params?.error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {params.error}
            </div>
          )}

          <form className="space-y-5" action={login}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email address</label>
              <input id="email" name="email" type="email" required autoComplete="email"
                className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-gray-900" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <input id="password" name="password" type="password" required autoComplete="current-password"
                className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-gray-900" />
            </div>

            <button type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              Sign In
            </button>
          </form>

          <div className="mt-5 border-t border-gray-100 pt-5 text-center">
            <p className="text-xs text-gray-400">Are you a lawyer?{" "}
              <Link href="/signup" className="text-blue-600 font-semibold hover:underline">Sign up as a lawyer →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
