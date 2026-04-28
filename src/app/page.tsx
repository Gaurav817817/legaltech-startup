'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Briefcase, MapPin, DollarSign, BookOpen, Globe, User, CheckCircle } from 'lucide-react'

const PRACTICE_AREA_OPTIONS = [
  'Corporate Law', 'Family Law', 'Criminal Defense', 'Intellectual Property',
  'Real Estate', 'Employment Law', 'Tax Law', 'Immigration', 'Civil Litigation',
  'Startups & Tech', 'Divorce', 'Consumer Rights', 'Banking & Finance', 'Other'
]

const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi', 'Malayalam']

export default function LawyerProfileSetup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    title: '',
    location: '',
    about: '',
    consultation_fee: '',
    practice_areas: [] as string[],
    languages: [] as string[],
    education: '',
  })

  const toggleItem = (field: 'practice_areas' | 'languages', value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (form.practice_areas.length === 0) {
      setError('Please select at least one practice area.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in.')
      setLoading(false)
      return
    }

    const { error: upsertError } = await supabase
      .from('lawyer_profiles')
      .upsert({
        id: user.id,
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        title: form.title,
        location: form.location,
        about: form.about,
        consultation_fee: form.consultation_fee,
        practice_areas: form.practice_areas,
        languages: form.languages,
        education: form.education ? [form.education] : [],
        rating: 0,
        reviews: 0,
      })

    if (upsertError) {
      setError('Failed to save profile: ' + upsertError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Profile Saved!</h2>
          <p className="text-gray-500 mt-2">You're now visible to clients. Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Complete Your Lawyer Profile</h1>
          <p className="text-gray-500 mt-2">This is how clients will find and contact you on Amiquz.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Title / Designation */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <User className="inline w-4 h-4 mr-1 text-blue-500" />
              Your Title / Designation
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Partner at XYZ Law Firm"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <MapPin className="inline w-4 h-4 mr-1 text-blue-500" />
              City / Location
            </label>
            <input
              type="text"
              placeholder="e.g. Bengaluru, Karnataka"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Consultation Fee */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <DollarSign className="inline w-4 h-4 mr-1 text-blue-500" />
              Consultation Fee
            </label>
            <input
              type="text"
              placeholder="e.g. ₹2000 / hr  or  ₹500 / 30 min"
              value={form.consultation_fee}
              onChange={e => setForm({ ...form, consultation_fee: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* About */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <BookOpen className="inline w-4 h-4 mr-1 text-blue-500" />
              About You
            </label>
            <textarea
              rows={4}
              placeholder="Briefly describe your experience, specialization, and what clients can expect..."
              value={form.about}
              onChange={e => setForm({ ...form, about: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Education / Bar Enrollment
            </label>
            <input
              type="text"
              placeholder="e.g. LLB, National Law School Bengaluru"
              value={form.education}
              onChange={e => setForm({ ...form, education: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Practice Areas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Briefcase className="inline w-4 h-4 mr-1 text-blue-500" />
              Practice Areas <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PRACTICE_AREA_OPTIONS.map(area => (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleItem('practice_areas', area)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    form.practice_areas.includes(area)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Globe className="inline w-4 h-4 mr-1 text-blue-500" />
              Languages You Work In
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleItem('languages', lang)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    form.languages.includes(lang)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl transition-colors shadow-md"
          >
            {loading ? 'Saving Profile...' : 'Save & Go to Dashboard →'}
          </button>
        </form>
      </div>
    </div>
  )
}
