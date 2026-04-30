'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { CheckCircle, ChevronRight, ChevronLeft, User, MapPin, Briefcase, Star, DollarSign, Globe, Camera, Upload } from 'lucide-react'

// ─── Data ───────────────────────────────────────────────────────────────────

const BAR_COUNCIL_STATES = [
  'Bar Council of India', 'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Gujarat', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra & Goa', 'Orissa',
  'Punjab & Haryana', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal'
]

const COURTS = [
  'Supreme Court of India', 'High Court', 'District Court',
  'Consumer Court', 'Family Court', 'Labour Court', 'Tribunal'
]

const PRIMARY_AREAS = [
  'Criminal Law', 'Corporate Law', 'Civil Litigation', 'Family Law',
  'Intellectual Property', 'Real Estate', 'Employment Law', 'Tax Law',
  'Immigration', 'Banking & Finance', 'Consumer Rights', 'Cyber Law'
]

const SUB_AREAS: Record<string, string[]> = {
  'Criminal Law': ['Bail Matters', 'White Collar Crimes', 'NDPS Cases', 'Cyber Crime', 'Murder / IPC', 'Domestic Violence'],
  'Corporate Law': ['M&A', 'Contracts', 'Startup Advisory', 'Compliance', 'Company Formation', 'Shareholder Disputes'],
  'Civil Litigation': ['Property Disputes', 'Injunctions', 'Recovery Suits', 'Declaratory Suits'],
  'Family Law': ['Divorce', 'Child Custody', 'Domestic Violence', 'Maintenance', 'Adoption'],
  'Intellectual Property': ['Patents', 'Trademarks', 'Copyright', 'Trade Secrets'],
  'Real Estate': ['Property Purchase', 'Tenancy Disputes', 'RERA Matters', 'Land Acquisition'],
  'Employment Law': ['Wrongful Termination', 'Labour Disputes', 'PF/ESIC', 'Sexual Harassment'],
  'Tax Law': ['Income Tax', 'GST', 'Customs', 'Tax Planning'],
  'Immigration': ['Visa', 'OCI/PIO', 'Naturalization', 'Work Permits'],
  'Banking & Finance': ['Loan Recovery', 'Cheque Bounce', 'Insolvency', 'SARFAESI'],
  'Consumer Rights': ['Consumer Forum', 'E-commerce Disputes', 'Insurance Claims'],
  'Cyber Law': ['Data Breach', 'Online Fraud', 'IT Act Offences', 'Social Media Disputes'],
}

const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi', 'Malayalam', 'Odia', 'Urdu']

const SERVICE_TYPES = [
  'Legal Consultation', 'Document Drafting', 'Case Representation',
  'Legal Notice', 'Contract Review', 'Due Diligence'
]

const CLIENT_TYPES = ['Individuals', 'Startups', 'Corporates', 'Government', 'NGOs']

const STEPS = [
  { label: 'Identity', icon: User },
  { label: 'Location', icon: MapPin },
  { label: 'Practice', icon: Briefcase },
  { label: 'Experience', icon: Star },
  { label: 'Pricing', icon: DollarSign },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function LawyerProfileSetup() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const photoRef = useRef<HTMLInputElement>(null)
  const [userName, setUserName] = useState({ first: '', last: '' })

  // Load user name on mount
  useState(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserName({
          first: user.user_metadata?.first_name || '',
          last: user.user_metadata?.last_name || '',
        })
      }
    })
  })

  const [form, setForm] = useState({
    // Step 1
    title: '',
    practitioner_type: '',
    firm_name: '',
    years_experience: '',
    bar_enrollment: '',
    bar_council_state: '',
    // Step 2
    location: '',
    courts: [] as string[],
    work_mode: '',
    availability: [] as string[],
    // Step 3
    primary_areas: [] as string[],
    sub_areas: [] as string[],
    languages: [] as string[],
    // Step 4
    cases_handled: '',
    client_types: [] as string[],
    notable_cases: '',
    success_rate: '',
    specialization_years: '',
    // Step 5
    fee_15min: '',
    fee_30min: '',
    fee_60min: '',
    services: [] as string[],
    bio_specializes: '',
    bio_handled: '',
    bio_why: '',
  })

  const set = (key: string, val: any) => setForm(prev => ({ ...prev, [key]: val }))

  const toggleArr = (key: string, val: string) => {
    setForm(prev => {
      const arr = prev[key as keyof typeof prev] as string[]
      return { ...prev, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] }
    })
  }

  const next = () => { setError(''); setStep(s => s + 1) }
  const back = () => { setError(''); setStep(s => s - 1) }

  const validate = () => {
    if (step === 0 && !form.location && !form.practitioner_type) return 'Please fill required fields'
    if (step === 2 && form.primary_areas.length === 0) return 'Select at least one practice area'
    return ''
  }

  const handleNext = () => {
    const err = validate()
    if (err) { setError(err); return }
    next()
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not logged in'); setLoading(false); return }

    // Upload photo if selected
    let image_url = ''
    if (photoFile) {
      const ext = photoFile.name.split('.').pop()
      const path = `${user.id}/profile.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(path, photoFile, { upsert: true })
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('profile-photos').getPublicUrl(path)
        image_url = urlData.publicUrl
      }
    }

    const bio = [
      form.bio_specializes && `I specialize in ${form.bio_specializes}.`,
      form.bio_handled && `I have handled ${form.bio_handled}.`,
      form.bio_why && `Clients choose me because ${form.bio_why}.`,
    ].filter(Boolean).join(' ')

    const { error: err } = await supabase.from('lawyer_profiles').upsert({
      id: user.id,
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || '',
      title: form.title,
      location: form.location,
      about: bio,
      consultation_fee: form.fee_60min ? `₹${form.fee_60min}/hr` : form.fee_30min ? `₹${form.fee_30min}/30min` : '',
      practice_areas: [...form.primary_areas, ...form.sub_areas],
      languages: form.languages,
      education: [form.bar_enrollment ? `Bar Enrollment: ${form.bar_enrollment}` : ''],
      rating: 0,
      reviews: 0,
      approved: false,
      image_url: image_url || null,
      // extended fields stored as JSON in about for now
      practitioner_type: form.practitioner_type,
      firm_name: form.firm_name,
      years_experience: form.years_experience,
      bar_council_state: form.bar_council_state,
      courts: form.courts,
      work_mode: form.work_mode,
      availability: form.availability,
      cases_handled: form.cases_handled,
      client_types: form.client_types,
      notable_cases: form.notable_cases,
      success_rate: form.success_rate,
      services: form.services,
      fee_15min: form.fee_15min,
      fee_30min: form.fee_30min,
      fee_60min: form.fee_60min,
    })

    if (err) { setError('Failed to save: ' + err.message); setLoading(false); return }
    setSuccess(true)
    setTimeout(() => router.push('/dashboard'), 2500)
  }

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Profile Submitted!</h2>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto">Your profile is under review. You'll get a verified badge once approved. Redirecting to dashboard...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">Complete Your Lawyer Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Profiles with full details get 3x more client enquiries</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center justify-between mb-8 px-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    i < step ? 'bg-green-500 text-white' :
                    i === step ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                    'bg-gray-200 text-gray-400'
                  }`}>
                    {i < step ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-blue-600' : 'text-gray-400'}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">

          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">{error}</div>}

          {/* ── STEP 1: Identity ── */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><User className="w-5 h-5 text-blue-500" /> Identity & Verification</h2>

              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-3">
                <div
                  onClick={() => photoRef.current?.click()}
                  className="w-24 h-24 rounded-full border-2 border-dashed border-blue-300 flex items-center justify-center cursor-pointer hover:border-blue-500 overflow-hidden bg-blue-50 transition-colors"
                >
                  {photoPreview
                    ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    : <Camera className="w-8 h-8 text-blue-400" />
                  }
                </div>
                <input
                  ref={photoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setPhotoFile(file)
                      setPhotoPreview(URL.createObjectURL(file))
                    }
                  }}
                />
                <button type="button" onClick={() => photoRef.current?.click()}
                  className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline">
                  <Upload className="w-4 h-4" />
                  {photoPreview ? 'Change photo' : 'Upload profile photo'}
                </button>
                <p className="text-xs text-gray-400">JPG or PNG, max 2MB. Lawyers with photos get more enquiries.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name</label>
                  <input disabled value={userName.first} className="input bg-gray-50 cursor-not-allowed" id="fname" />
                  <p className="text-xs text-gray-400 mt-1">Pulled from your signup</p>
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input disabled value={userName.last} className="input bg-gray-50 cursor-not-allowed" id="lname" />
                </div>
              </div>

              <div>
                <label className="label">Title / Designation <span className="text-red-500">*</span></label>
                <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Senior Advocate, Partner" className="input" />
              </div>

              <div>
                <label className="label">Practitioner Type <span className="text-red-500">*</span></label>
                <select value={form.practitioner_type} onChange={e => set('practitioner_type', e.target.value)} className="input">
                  <option value="">Select type</option>
                  <option value="Individual Practitioner">Individual Practitioner</option>
                  <option value="Law Firm">Part of a Law Firm</option>
                </select>
              </div>

              {form.practitioner_type === 'Law Firm' && (
                <div>
                  <label className="label">Law Firm Name</label>
                  <input value={form.firm_name} onChange={e => set('firm_name', e.target.value)} placeholder="e.g. Sharma & Associates" className="input" />
                </div>
              )}

              <div>
                <label className="label">Years of Experience <span className="text-red-500">*</span></label>
                <select value={form.years_experience} onChange={e => set('years_experience', e.target.value)} className="input">
                  <option value="">Select range</option>
                  <option value="0-2">0–2 years</option>
                  <option value="3-5">3–5 years</option>
                  <option value="5-10">5–10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Bar Council Enrollment No.</label>
                  <input value={form.bar_enrollment} onChange={e => set('bar_enrollment', e.target.value)} placeholder="e.g. D/123/2015" className="input" />
                </div>
                <div>
                  <label className="label">Bar Council State</label>
                  <select value={form.bar_council_state} onChange={e => set('bar_council_state', e.target.value)} className="input">
                    <option value="">Select state</option>
                    {BAR_COUNCIL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Location ── */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-500" /> Location & Availability</h2>

              <div>
                <label className="label">Primary City <span className="text-red-500">*</span></label>
                <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Bengaluru, Karnataka" className="input" required />
              </div>

              <div>
                <label className="label">Courts You Practice In</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {COURTS.map(c => (
                    <button key={c} type="button" onClick={() => toggleArr('courts', c)}
                      className={`chip ${form.courts.includes(c) ? 'chip-active' : 'chip-inactive'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Work Mode <span className="text-red-500">*</span></label>
                <select value={form.work_mode} onChange={e => set('work_mode', e.target.value)} className="input">
                  <option value="">Select mode</option>
                  <option value="Online">Online Consultation Only</option>
                  <option value="In-person">In-person Only</option>
                  <option value="Both">Both Online & In-person</option>
                </select>
              </div>

              <div>
                <label className="label">Availability</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['Weekdays', 'Weekends', 'Mornings', 'Afternoons', 'Evenings'].map(a => (
                    <button key={a} type="button" onClick={() => toggleArr('availability', a)}
                      className={`chip ${form.availability.includes(a) ? 'chip-active' : 'chip-inactive'}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Practice Areas ── */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Briefcase className="w-5 h-5 text-blue-500" /> Practice Areas</h2>

              <div>
                <label className="label">Primary Practice Areas <span className="text-red-500">*</span> <span className="text-gray-400 font-normal">(max 3)</span></label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {PRIMARY_AREAS.map(a => (
                    <button key={a} type="button"
                      onClick={() => {
                        if (form.primary_areas.includes(a)) {
                          set('primary_areas', form.primary_areas.filter(x => x !== a))
                          set('sub_areas', form.sub_areas.filter(s => !SUB_AREAS[a]?.includes(s)))
                        } else if (form.primary_areas.length < 3) {
                          set('primary_areas', [...form.primary_areas, a])
                        }
                      }}
                      className={`chip ${form.primary_areas.includes(a) ? 'chip-active' : 'chip-inactive'}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {form.primary_areas.length > 0 && (
                <div>
                  <label className="label">Sub-specializations</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {form.primary_areas.flatMap(a => SUB_AREAS[a] || []).map(sub => (
                      <button key={sub} type="button" onClick={() => toggleArr('sub_areas', sub)}
                        className={`chip text-xs ${form.sub_areas.includes(sub) ? 'chip-active' : 'chip-inactive'}`}>
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="label flex items-center gap-1"><Globe className="w-4 h-4 text-blue-500" /> Languages</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {LANGUAGES.map(l => (
                    <button key={l} type="button" onClick={() => toggleArr('languages', l)}
                      className={`chip ${form.languages.includes(l) ? 'chip-active' : 'chip-inactive'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Experience ── */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Star className="w-5 h-5 text-blue-500" /> Experience & Proof</h2>

              <div>
                <label className="label">Number of Cases Handled</label>
                <select value={form.cases_handled} onChange={e => set('cases_handled', e.target.value)} className="input">
                  <option value="">Select range</option>
                  <option value="<50">Less than 50</option>
                  <option value="50-200">50–200</option>
                  <option value="200+">200+</option>
                </select>
              </div>

              <div>
                <label className="label">Success Rate (self-declared)</label>
                <select value={form.success_rate} onChange={e => set('success_rate', e.target.value)} className="input">
                  <option value="">Select range</option>
                  <option value="60-70%">60–70%</option>
                  <option value="70-80%">70–80%</option>
                  <option value="80-90%">80–90%</option>
                  <option value="90%+">90%+</option>
                </select>
              </div>

              <div>
                <label className="label">Types of Clients Served</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {CLIENT_TYPES.map(c => (
                    <button key={c} type="button" onClick={() => toggleArr('client_types', c)}
                      className={`chip ${form.client_types.includes(c) ? 'chip-active' : 'chip-inactive'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Notable Cases / Achievements <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea rows={3} value={form.notable_cases} onChange={e => set('notable_cases', e.target.value)}
                  placeholder="e.g. Successfully represented client in High Court against wrongful termination..."
                  className="input resize-none" />
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-blue-800">Your Profile Bio (Guided)</p>
                <div>
                  <label className="text-xs text-blue-700 font-medium">I specialize in…</label>
                  <input value={form.bio_specializes} onChange={e => set('bio_specializes', e.target.value)}
                    placeholder="e.g. criminal defence and bail matters in Delhi courts"
                    className="input mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-blue-700 font-medium">I have handled…</label>
                  <input value={form.bio_handled} onChange={e => set('bio_handled', e.target.value)}
                    placeholder="e.g. 200+ cases across district and high courts"
                    className="input mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-blue-700 font-medium">Clients choose me because…</label>
                  <input value={form.bio_why} onChange={e => set('bio_why', e.target.value)}
                    placeholder="e.g. I am responsive, transparent about fees, and fight hard"
                    className="input mt-1 text-sm" />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 5: Pricing ── */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><DollarSign className="w-5 h-5 text-blue-500" /> Pricing & Services</h2>

              <div>
                <label className="label">Consultation Fees (₹)</label>
                <div className="grid grid-cols-3 gap-3 mt-1">
                  {[['fee_15min', '15 min'], ['fee_30min', '30 min'], ['fee_60min', '60 min']].map(([key, label]) => (
                    <div key={key}>
                      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                        <input type="number" value={form[key as keyof typeof form] as string}
                          onChange={e => set(key, e.target.value)}
                          placeholder="0"
                          className="input pl-7" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Services You Offer</label>
                <div className="flex flex-col gap-2 mt-1">
                  {SERVICE_TYPES.map(s => (
                    <label key={s} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <input type="checkbox" checked={form.services.includes(s)} onChange={() => toggleArr('services', s)}
                        className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-700 font-medium">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                🎉 Almost done! After submission your profile will be reviewed and you'll get a <strong>Verified badge</strong> within 24 hours.
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button type="button" onClick={back}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-colors">
                {loading ? 'Submitting...' : 'Submit Profile →'}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">Step {step + 1} of {STEPS.length} · Your data is safe and secure</p>
      </div>

      <style jsx>{`
        .label { display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem; }
        .input { width: 100%; border: 1px solid #d1d5db; border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; color: #111827; outline: none; transition: all 0.15s; }
        .input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .chip { padding: 0.375rem 0.875rem; border-radius: 9999px; font-size: 0.8125rem; font-weight: 500; border: 1px solid; transition: all 0.15s; }
        .chip-active { background: #2563eb; color: white; border-color: #2563eb; }
        .chip-inactive { background: white; color: #4b5563; border-color: #d1d5db; }
        .chip-inactive:hover { border-color: #93c5fd; }
      `}</style>
    </div>
  )
}
