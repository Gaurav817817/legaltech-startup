const TICKER_ITEMS = [
  '⚖️  Landmark · K.S. Puttaswamy v. Union of India (2017) — Supreme Court declared Privacy a Fundamental Right under Article 21',
  '📌  India has over 1.7 million enrolled advocates — the second-largest legal community in the world',
  '💡  The Limitation Act, 1963 — most civil suits must be filed within 3 years of the cause of action arising',
  '🏛️  RTI Act, 2005 — any citizen can demand information from a public authority; response due within 30 days',
  '⚖️  Vishaka v. State of Rajasthan (1997) — Supreme Court laid down the first guidelines against workplace sexual harassment',
  '📊  IBC, 2016 — reduced average insolvency resolution time from 4+ years to under 400 days',
  '⚖️  Navtej Singh Johar v. Union of India (2018) — Section 377 struck down; consensual same-sex relations decriminalised',
  '💼  POCSO Act, 2012 — failure to report child sexual abuse is a criminal offence punishable with imprisonment',
]

export default function LegalTicker() {
  const repeated = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div className="bg-blue-50 border-y border-blue-100 overflow-hidden">
      <style>{`
        @keyframes legalTicker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: legalTicker 80s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="flex items-stretch">
        {/* Left label */}
        <div className="shrink-0 flex items-center gap-2.5 bg-blue-600 px-5 py-4 border-r border-blue-200 z-10">
          <span className="text-white text-sm font-bold tracking-wide whitespace-nowrap">⚖ Legal Pulse</span>
        </div>

        {/* Scrolling track */}
        <div className="overflow-hidden flex-1 min-w-0">
          <div className="ticker-track">
            {repeated.map((item, i) => (
              <span
                key={i}
                className="text-sm text-slate-700 whitespace-nowrap px-10 py-4 inline-flex items-center border-r border-blue-100 font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
