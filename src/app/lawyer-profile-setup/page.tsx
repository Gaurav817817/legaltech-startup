'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { CheckCircle, ChevronRight, ChevronLeft, User, MapPin, Briefcase, Star, DollarSign, Globe, Phone, Save } from 'lucide-react'

const BAR_COUNCIL_STATES = [
  'Bar Council of India', 'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Gujarat', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra & Goa', 'Orissa',
  'Punjab & Haryana', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal'
]

const COURTS = ['Supreme Court of India', 'High Court', 'District Court', 'Consumer Court', 'Family Court', 'Labour Court', 'Tribunal']

const PRIMARY_AREAS = [
  'Criminal Law', 'Corporate Law', 'Civil Litigation', 'Family Law',
  'Intellectual Property', 'Real Estate', 'Employment Law', 'Tax Law',
  'Immigration', 'Banking & Finance', 'Consumer Rights', 'Cyber Law', 'Other'
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
const SERVICE_TYPES = ['Legal Consultation', 'Document Drafting', 'Case Representation', 'Legal Notice', 'Contract Review', 'Due Diligence']
const CLIENT_TYPES = ['Individuals', 'Startups', 'Corporates', 'Government', 'NGOs']

const STEPS = [
  { label: 'Identity', icon: User, fields: ['practitioner_type', 'phone'] },
  { label: 'Location', icon: MapPin, fields: ['location'] },
  { label: 'Practice', icon: Briefcase, fields: ['primary_areas'] },
  { label: 'Experience', icon: Star, fields: [] },
  { label: 'Pricing', icon: DollarSign, fields: ['fee_60min'] },
]

const FIELD_LABELS: Record<string, string> = {
  practitioner_type: 'Practitioner Type',
  phone: 'Phone Number',
  location: 'Primary City',
  primary_areas: 'Primary Practice Areas',
  fee_60min: 'Hourly Consultation Fee',
  other_practice_area: 'Other Practice Area',
}

const EMPTY_FORM = {
  title: '', practitioner_type: '', firm_name: '', years_experience: '',
  bar_enrollment: '', bar_council_state: '', phone: '',
  location: '', courts: [] as string[], work_mode: '', availability: [] as string[],
  primary_areas: [] as string[], sub_areas: [] as string[], languages: [] as string[],
  other_practice_area: '',
  cases_handled: '', client_types: [] as string[], notable_cases: '',
  success_rate: '', bio_specializes: '', bio_handled: '', bio_why: '',
  fee_15min: '', fee_30min: '', fee_60min: '', services: [] as string[],
}

const STORAGE_KEY = 'amiquz_lawyer_form_draft'

export default function LawyerProfileSetup() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const [errorField, setErrorField] = useState('')
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [isEditing, setIsEditing] = useState(false)
  const [draftRestored, setDraftRestored] = useState(false)
  const [autoSavedAt, setAutoSavedAt] = useState<string>('')
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({})

  // Pre-fill form: first try Supabase profile, then localStorage draft
  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setPageLoading(false); return }

      const { data: profile } = await supabase
        .from('lawyer_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setIsEditing(true)
        setForm({
          title: profile.title || '',
          practitioner_type: profile.practitioner_type || '',
          firm_name: profile.firm_name || '',
          years_experience: profile.years_experience || '',
          bar_enrollment: profile.education?.[0]?.replace('Bar Enrollment: ', '') || '',
          bar_council_state: profile.bar_council_state || '',
          phone: profile.phone || '',
          location: profile.location || '',
          courts: profile.courts || [],
          work_mode: profile.work_mode || '',
          availability: profile.availability || [],
          primary_areas: (profile.practice_areas || []).filter((a: string) => PRIMARY_AREAS.includes(a)),
          sub_areas: (profile.practice_areas || []).filter((a: string) => !PRIMARY_AREAS.includes(a)),
          languages: profile.languages || [],
          other_practice_area: profile.other_practice_area || '',
          cases_handled: profile.cases_handled || '',
          client_types: profile.client_types || [],
          notable_cases: profile.notable_cases || '',
          success_rate: profile.success_rate || '',
          bio_specializes: '', bio_handled: '', bio_why: '',
          fee_15min: profile.fee_15min || '',
          fee_30min: profile.fee_30min || '',
          fee_60min: profile.fee_60min || '',
          services: profile.services || [],
        })
        setPageLoading(false)
        return
      }

      // No profile yet — check for draft
      const draft = localStorage.getItem(STORAGE_KEY)
      if (draft) {
        try {
          const parsed = JSON.parse(draft)
          setForm(parsed.form)
          setStep(parsed.step || 0)
          setDraftRestored(true)
        } catch {}
      }
      setPageLoading(false)
    }
    loadProfile()
  }, [])

  // Auto-save to localStorage on every change (only for new lawyers, not editing)
  useEffect(() => {
    if (pageLoading || isEditing) return
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, step }))
      setAutoSavedAt(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
    }, 800)
    return () => clearTimeout(timer)
  }, [form, step, pageLoading, isEditing])

  const set = (key: string, val: any) => setForm(prev => ({ ...prev, [key]: val }))
  const toggleArr = (key: string, val: string) => {
    setForm(prev => {
      const arr = prev[key as keyof typeof prev] as string[]
      return { ...prev, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] }
    })
  }

  const next = () => { setError(''); setErrorField(''); setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const back = () => { setError(''); setErrorField(''); setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const validate = () => {
    if (step === 0) {
      if (!form.practitioner_type) return { field: 'practitioner_type', msg: 'Please select your practitioner type' }
      if (!form.phone) return { field: 'phone', msg: 'Phone number is required' }
      if (!/^[6-9]\d{9}$/.test(form.phone)) return { field: 'phone', msg: 'Enter a valid 10-digit Indian mobile number' }
    }
    if (step === 1 && !form.location) return { field: 'location', msg: 'Please enter your city' }
    if (step === 2) {
      if (form.primary_areas.length === 0) return { field: 'primary_areas', msg: 'Select at least one practice area' }
      if (form.primary_areas.includes('Other') && !form.other_practice_area) {
        return { field: 'other_practice_area', msg: 'Please specify your "Other" practice area' }
      }
    }
    if (step === 4 && !form.fee_60min) return { field: 'fee_60min', msg: 'Hourly consultation fee is required' }
    return null
  }

  const handleNext = () => {
    const err = validate()
    if (err) {
      setError(err.msg)
      setErrorField(err.field)
      // Scroll to and focus the field
      setTimeout(() => {
        const el = fieldRefs.current[err.field]
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          if ('focus' in el && typeof (el as any).focus === 'function') (el as any).focus()
        }
      }, 100)
      return
    }
    next()
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) { setError(err.msg); setErrorField(err.field); return }
    
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not logged in'); setLoading(false); return }

    const bio = [
      form.bio_specializes && `I specialize in ${form.bio_specializes}.`,
      form.bio_handled && `I have handled ${form.bio_handled}.`,
      form.bio_why && `Clients choose me because ${form.bio_why}.`,
    ].filter(Boolean).join(' ')

    const allAreas = [...form.primary_areas.filter(a => a !== 'Other'), ...form.sub_areas]
    if (form.primary_areas.includes('Other') && form.other_practice_area) {
      allAreas.push(form.other_practice_area)
    }

    const { error: err2 } = await supabase.from('lawyer_profiles').upsert({
      id: user.id,
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || '',
      title: form.title,
      location: form.location,
      about: bio || null,
      consultation_fee: form.fee_60min ? `₹${form.fee_60min}/hr` : '',
      practice_areas: allAreas,
      languages: form.languages,
      education: [form.bar_enrollment ? `Bar Enrollment: ${form.bar_enrollment}` : ''].filter(Boolean),
      // Only set these on initial creation — never overwrite on edit
      ...(!isEditing && { rating: 0, reviews: 0, approved: false }),
      practitioner_type: form.practitioner_type,
      firm_name: form.firm_name,
      years_experience: form.years_experience,
      bar_council_state: form.bar_council_state,
      phone: form.phone,
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
      other_practice_area: form.other_practice_area,
    })

    if (err2) { setError('Failed to save: ' + err2.message); setLoading(false); return }
    
    // Clear draft from localStorage
    localStorage.removeItem(STORAGE_KEY)
    setSuccess(true)
  }

  const errorClass = (fieldName: string) => 
    errorField === fieldName ? 'ring-2 ring-red-400 border-red-400' : ''

  if (pageLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  )

  // ─── SUCCESS PAGE — proper next steps ────────────────────────────────────
  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
          <CheckCircle className="w-9 h-9 text-green-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">{isEditing ? 'Profile Updated! 🎉' : 'Welcome to Amiquz! 🎉'}</h2>
        <p className="text-gray-500 mt-2">
          {isEditing 
            ? 'Your changes have been saved. Clients will now see your updated profile.'
            : 'Your application has been submitted successfully.'}
        </p>

        {!isEditing && (
          <div className="text-left bg-blue-50 border border-blue-100 rounded-xl p-5 mt-6">
            <h3 className="font-bold text-blue-900 mb-3">What happens next?</h3>
            <ol className="space-y-3 text-sm text-blue-800">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">1</span>
                <span><strong>We review your profile</strong> within 24–48 hours. Our team verifies your Bar Council details.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">2</span>
                <span><strong>You'll get a verified badge</strong> and your profile will appear in client search results.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">3</span>
                <span><strong>Clients will start finding you</strong> via search and our AI assistant. We'll notify you of every enquiry by email and SMS.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">4</span>
                <span><strong>You can update your profile</strong> anytime from your dashboard.</span>
              </li>
            </ol>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button onClick={() => router.push('/dashboard')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl">
            Go to Dashboard
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Questions? Email us at <a href="mailto:founders@amiquz.com" className="text-blue-600 hover:underline">founders@amiquz.com</a>
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">
            {isEditing ? 'Update Your Profile' : 'Complete Your Lawyer Profile'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEditing 
              ? 'Your existing details are pre-filled — only update what needs changing.' 
              : 'Profiles with full details get 3x more client enquiries · You can edit anytime later'}
          </p>
        </div>

        {/* Draft restored notice */}
        {draftRestored && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-sm text-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4 shrink-0" />
            <span>We restored your draft from where you left off. <button onClick={() => { setForm(EMPTY_FORM); setStep(0); localStorage.removeItem(STORAGE_KEY); setDraftRestored(false); }} className="underline font-medium">Start fresh</button></span>
          </div>
        )}

        {/* Mobile step indicator */}
        <div className="sm:hidden mb-4 text-center text-xs font-semibold text-gray-500">
          Step {step + 1} of {STEPS.length} — <span className="text-blue-600">{STEPS[step].label}</span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center justify-between mb-6 px-2">
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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6 flex items-start gap-2">
              <span className="shrink-0">⚠️</span>
              <div>
                <p className="font-semibold">{errorField ? FIELD_LABELS[errorField] : 'Validation Error'}</p>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* STEP 1 — Identity */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><User className="w-5 h-5 text-blue-500" /> Identity & Verification</h2>
              
              <div>
                <label className="label">Title / Designation</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Senior Advocate, Partner" className="input" />
              </div>

              <div>
                <label className="label">Practitioner Type <span className="text-red-500">*</span></label>
                <select 
                  ref={el => { fieldRefs.current['practitioner_type'] = el }}
                  value={form.practitioner_type} 
                  onChange={e => set('practitioner_type', e.target.value)} 
                  className={`input ${errorClass('practitioner_type')}`}>
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
                <label className="label flex items-center gap-1"><Phone className="w-4 h-4 text-blue-500" /> Phone Number <span className="text-red-500">*</span></label>
               <div className="flex gap-2 items-stretch">
  <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 flex items-center text-gray-600 font-medium text-sm shrink-0">+91</div>
  <input 
    ref={el => { fieldRefs.current['phone'] = el }}
    type="tel"
    value={form.phone}
                    onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className={`input flex-1 ${errorClass('phone')}`} />
                </div>
                <p className="text-xs text-gray-400 mt-1">Clients won't see this. We use it to notify you of enquiries via SMS/WhatsApp.</p>
              </div>

              <div>
                <label className="label">Years of Experience</label>
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

          {/* STEP 2 — Location */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-500" /> Location & Availability</h2>
              <div>
                <label className="label">Primary City <span className="text-red-500">*</span></label>
                <input 
                  ref={el => { fieldRefs.current['location'] = el }}
                  value={form.location} 
                  onChange={e => set('location', e.target.value)} 
                  placeholder="e.g. Bengaluru, Karnataka" 
                  className={`input ${errorClass('location')}`} />
              </div>
              <div>
                <label className="label">Courts You Practice In</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {COURTS.map(c => (
                    <button key={c} type="button" onClick={() => toggleArr('courts', c)}
                      className={`chip ${form.courts.includes(c) ? 'chip-active' : 'chip-inactive'}`}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Work Mode</label>
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
                      className={`chip ${form.availability.includes(a) ? 'chip-active' : 'chip-inactive'}`}>{a}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Practice Areas */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Briefcase className="w-5 h-5 text-blue-500" /> Practice Areas</h2>
              <div ref={el => { fieldRefs.current['primary_areas'] = el }}>
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
                      className={`chip ${form.primary_areas.includes(a) ? 'chip-active' : 'chip-inactive'}`}>{a}</button>
                  ))}
                </div>
              </div>

              {form.primary_areas.includes('Other') && (
                <div>
                  <label className="label">Specify your "Other" practice area <span className="text-red-500">*</span></label>
                  <input
                    ref={el => { fieldRefs.current['other_practice_area'] = el }}
                    value={form.other_practice_area}
                    onChange={e => set('other_practice_area', e.target.value)}
                    placeholder="e.g. Aviation Law, Sports Law, Maritime Law"
                    className={`input ${errorClass('other_practice_area')}`} />
                </div>
              )}

              {form.primary_areas.filter(a => a !== 'Other').length > 0 && (
                <div>
                  <label className="label">Sub-specializations</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {form.primary_areas.flatMap(a => SUB_AREAS[a] || []).map(sub => (
                      <button key={sub} type="button" onClick={() => toggleArr('sub_areas', sub)}
                        className={`chip text-xs ${form.sub_areas.includes(sub) ? 'chip-active' : 'chip-inactive'}`}>{sub}</button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="label flex items-center gap-1"><Globe className="w-4 h-4 text-blue-500" /> Languages</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {LANGUAGES.map(l => (
                    <button key={l} type="button" onClick={() => toggleArr('languages', l)}
                      className={`chip ${form.languages.includes(l) ? 'chip-active' : 'chip-inactive'}`}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — Experience */}
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
                      className={`chip ${form.client_types.includes(c) ? 'chip-active' : 'chip-inactive'}`}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Notable Cases / Achievements <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea rows={3} value={form.notable_cases} onChange={e => set('notable_cases', e.target.value)}
                  placeholder="e.g. Successfully represented client in High Court..." className="input resize-none" />
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-blue-800">Your Profile Bio</p>
                <div>
                  <label className="text-xs text-blue-700 font-medium">I specialize in…</label>
                  <input value={form.bio_specializes} onChange={e => set('bio_specializes', e.target.value)}
                    placeholder="e.g. criminal defence and bail matters in Delhi courts" className="input mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-blue-700 font-medium">I have handled…</label>
                  <input value={form.bio_handled} onChange={e => set('bio_handled', e.target.value)}
                    placeholder="e.g. 200+ cases across district and high courts" className="input mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-blue-700 font-medium">Clients choose me because…</label>
                  <input value={form.bio_why} onChange={e => set('bio_why', e.target.value)}
                    placeholder="e.g. I am responsive, transparent about fees, and fight hard" className="input mt-1 text-sm" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 — Pricing */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><DollarSign className="w-5 h-5 text-blue-500" /> Pricing & Services</h2>
              
              <div ref={el => { fieldRefs.current['fee_60min'] = el }}>
                <label className="label">Hourly Consultation Fee (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                  <input 
                    type="number" 
                    value={form.fee_60min}
                    onChange={e => set('fee_60min', e.target.value)} 
                    placeholder="2000"
                    className={`input pl-8 ${errorClass('fee_60min')}`} />
                </div>
                <p className="text-xs text-gray-400 mt-1">This is what most clients see and book</p>
              </div>

              <div>
                <label className="label">Other duration fees <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {[['fee_15min', '15 min'], ['fee_30min', '30 min']].map(([key, label]) => (
                    <div key={key}>
                      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                        <input type="number" value={form[key as keyof typeof form] as string}
                          onChange={e => set(key, e.target.value)} placeholder="0" className="input pl-7" />
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
                      <input type="checkbox" checked={form.services.includes(s)} onChange={() => toggleArr('services', s)} className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-700 font-medium">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                🎉 Almost done! After submission your profile will be reviewed within 24–48 hours.
              </div>
            </div>
          )}

          {/* Navigation */}
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
                {loading ? 'Saving...' : isEditing ? 'Update Profile →' : 'Submit Profile →'}
              </button>
            )}
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-2">
          {autoSavedAt && !isEditing && (
            <><Save className="w-3 h-3" /> Draft auto-saved at {autoSavedAt} · </>
          )}
          Step {step + 1} of {STEPS.length}
        </div>
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
