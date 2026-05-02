'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, X } from 'lucide-react'

function MultiDropdown({
  label,
  name,
  options,
  selected,
  onChange,
}: {
  label: string
  name: string
  options: string[]
  selected: string[]
  onChange: (vals: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val])
  }

  return (
    <div className="relative flex-1 min-w-[160px]" ref={ref}>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white hover:border-blue-400 focus:outline-none focus:border-blue-500 transition-colors"
      >
        <span className="truncate">
          {selected.length === 0
            ? `All ${label.toLowerCase()}`
            : selected.length === 1
            ? selected[0]
            : `${selected.length} selected`}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 ml-2 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 min-w-full w-max max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl py-1">
          {options.map(opt => (
            <label
              key={opt}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
                className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FilterBar({
  locations,
  practiceAreas,
  experienceOptions,
  initialLoc,
  initialArea,
  initialExp,
}: {
  locations: string[]
  practiceAreas: string[]
  experienceOptions: { value: string; label: string }[]
  initialLoc: string[]
  initialArea: string[]
  initialExp: string[]
}) {
  const router = useRouter()
  const [selLoc,  setSelLoc]  = useState<string[]>(initialLoc)
  const [selArea, setSelArea] = useState<string[]>(initialArea)
  const [selExp,  setSelExp]  = useState<string[]>(initialExp)

  const isFiltered = selLoc.length > 0 || selArea.length > 0 || selExp.length > 0

  const apply = () => {
    const params = new URLSearchParams()
    selLoc.forEach(v  => params.append('loc',  v))
    selArea.forEach(v => params.append('area', v))
    selExp.forEach(v  => params.append('exp',  v))
    router.push(`/admin?${params.toString()}`)
  }

  const clear = () => {
    setSelLoc([]); setSelArea([]); setSelExp([])
    router.push('/admin')
  }

  const totalSelected = selLoc.length + selArea.length + selExp.length

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex flex-wrap gap-3 items-end">
        <MultiDropdown
          label="Location"
          name="loc"
          options={locations}
          selected={selLoc}
          onChange={setSelLoc}
        />
        <MultiDropdown
          label="Practice Area"
          name="area"
          options={practiceAreas}
          selected={selArea}
          onChange={setSelArea}
        />
        <MultiDropdown
          label="Experience"
          name="exp"
          options={experienceOptions.map(o => o.value)}
          selected={selExp}
          onChange={setSelExp}
        />

        <div className="flex gap-2 pb-0.5">
          <button
            onClick={apply}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Apply{totalSelected > 0 ? ` (${totalSelected})` : ''}
          </button>
          {isFiltered && (
            <button
              onClick={clear}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {isFiltered && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
          {selLoc.map(v => (
            <span key={v} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
              📍 {v}
              <button onClick={() => setSelLoc(selLoc.filter(x => x !== v))} className="hover:text-blue-900"><X className="w-3 h-3" /></button>
            </span>
          ))}
          {selArea.map(v => (
            <span key={v} className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full">
              ⚖️ {v}
              <button onClick={() => setSelArea(selArea.filter(x => x !== v))} className="hover:text-purple-900"><X className="w-3 h-3" /></button>
            </span>
          ))}
          {selExp.map(v => (
            <span key={v} className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
              🕐 {v} yrs
              <button onClick={() => setSelExp(selExp.filter(x => x !== v))} className="hover:text-green-900"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
