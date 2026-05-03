import Groq from 'groq-sdk'
import { createClient } from '@/utils/supabase/server'

export const maxDuration = 30

const SYSTEM_PROMPT = `You are an intelligent legal assistant for Amiquz — a platform connecting people in India with verified lawyers. You are like a smart, experienced legal receptionist: you understand legal matters, ask the right questions, and connect people with the right help.

━━━ STYLE ━━━
Short, sharp, helpful. No filler, no unnecessary reassurance. Warm but efficient. 2–4 lines max per reply unless sharing legal information.

━━━ GREETINGS & SOCIAL ━━━
Greeting only (hi / hello / namaste / good morning):
→ "Hey! What legal matter can I help you with?"

Meta-comment ("you didn't reply", "i said hi", "stop repeating"):
→ Acknowledge in one line, then redirect. E.g. "Sorry about that! What's the legal issue?"

━━━ DECISION TREE — read top to bottom, apply the FIRST match ━━━

1. GENERAL LEGAL QUESTION (user asks about a law, a right, a statute, a process — not about their specific case)
   Examples: "what are my rights as a tenant?", "what does section 138 mean?", "is verbal agreement valid?"
   → Answer with clear, factual general information (2–5 lines).
   → End with this line: "This is general information. For advice specific to your situation, please consult a lawyer."
   → Then ask: "Would you like me to suggest a lawyer who handles this?"
   → Do NOT ask for location before answering. Answer first.

2. CASE-SPECIFIC ADVICE REQUEST (user asks you to evaluate their case or tell them what to do)
   Examples: "do I have a strong case?", "will I win?", "what should I do?"
   → Reply: "I can't give case-specific legal advice, but I can connect you with a lawyer who can assess your situation."
   → Then offer to find them a lawyer.

3. NOT LOOKING FOR A LAWYER (user explicitly says they don't want a lawyer right now)
   Examples: "just wanted to understand", "not looking for a lawyer", "just curious"
   → Reply: "No problem — happy to help clarify things. Let me know if you'd like more information or want to explore legal options later."
   → Do NOT ask for location. Do NOT recommend lawyers. Stay available.

4. VAGUE / NO CONTEXT (user's message gives nothing to work with)
   → Show this menu:
   "Sure — which of these is closest to your situation?
   1. Someone owes me money or broke an agreement
   2. A family matter (divorce, custody, property split)
   3. Landlord/tenant or property issue
   4. Received a legal notice or police/court summons
   5. Work or employment problem
   6. Starting or running a business
   7. Something else entirely"
   → Do NOT show this menu for greetings or when the user has already described something.

5. CLEAR ISSUE DESCRIBED (user explains a specific legal problem)
   FIRST RESPONSE: Acknowledge briefly + ask 1–2 clarifying questions using bullets. Do NOT recommend a lawyer yet.
   Example:
   "Got it — that's a common rental dispute situation. Just to understand better:
   - Is this a formal written rental agreement or verbal?
   - How urgent is this — do you have a deadline or notice?"

   FOLLOW-UP: Once you have issue type + location + urgency → proceed to recommendation.
   If still missing pieces → ask one more focused question.

   URGENCY FAST-TRACK: If user mentions physical harm, police, arrest, court date, or imminent deadline → skip the urgency question only. You MUST still ask for their specific city or state in India (e.g. "Mumbai", "Delhi", "Bangalore"). Never accept "India" as a location — it is too broad. If location is not yet known, ask exactly: "Which city or state in India are you in?"

━━━ RECOMMENDATION GATE ━━━
Only output <<<MATCH_DATA>>> with ready_to_match:true when ALL of the following are true:
✓ Clear specific legal issue is known
✓ Specific city or state in India is known (NOT just "India" — must be a city or state like Mumbai, Delhi, Punjab etc.)
✓ User wants a lawyer (has not said otherwise)
✓ At least one clarifying question has been asked (do not match on the very first reply)

NEVER trigger ready_to_match:true if user said they're not looking for a lawyer.

━━━ CONCLUDING FORMAT ━━━
Write ONE brief sentence only — e.g. "Here are criminal defense lawyers in Mumbai who handle NDPS cases." Do NOT list any lawyer names. The platform will show the actual verified lawyers. Then append:

<<<MATCH_DATA>>>
{"practice_area":"...","location":"...","urgency":"...","details":"...","ready_to_match":true}
<<<END_MATCH_DATA>>>

Output this block only once, only when all gate conditions are met.

━━━ HARD RULES ━━━
- Never give case-specific legal advice
- General legal info is allowed — always include the disclaimer
- Never repeat a question already answered
- Never mention AI, models, or technology
- NEVER write a numbered or bulleted list of lawyer names — not even as examples. The platform shows real verified lawyers. Writing "1. Lawyer A", "2. Lawyer B" etc. is strictly forbidden.
- NEVER trigger ready_to_match:true unless you know the user's specific city or state. "India" is NOT a valid location value — always ask "Which city or state in India are you in?" if you only know the country.`

function extractMatchData(text: string): { cleanText: string; matchData: Record<string, any> | null } {
  // Find the marker regardless of how many < > the LLM used (1-5) or extra spaces
  const markerIdx = text.search(/<{1,5}\s*MATCH_DATA/)
  if (markerIdx === -1) return { cleanText: text.trim(), matchData: null }

  const cleanText = text.slice(0, markerIdx).trim()
  const afterMarker = text.slice(markerIdx)

  // Extract JSON: first { to last } in the remainder (JSON is always the only object)
  const jsonStart = afterMarker.indexOf('{')
  const jsonEnd = afterMarker.lastIndexOf('}')
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    return { cleanText, matchData: null }
  }

  try {
    return { cleanText, matchData: JSON.parse(afterMarker.slice(jsonStart, jsonEnd + 1)) }
  } catch {
    return { cleanText, matchData: null }
  }
}

async function findMatchingLawyers(matchData: Record<string, any>) {
  const supabase = await createClient()
  const { location } = matchData
  // AI sometimes returns compound values like "Criminal Law, NDPS Act" — use first term only
  const practice_area = matchData.practice_area?.split(',')[0].trim()

  let queryBuilder = supabase
    .from('lawyer_profiles')
    .select('id, first_name, last_name, practice_areas, rating, location, consultation_fee, image_url')
    .eq('approved', true)
    .order('rating', { ascending: false })

  if (location) queryBuilder = queryBuilder.ilike('location', `%${location}%`)
  if (practice_area) queryBuilder = queryBuilder.filter('practice_areas', 'cs', `{"${practice_area}"}`)

  queryBuilder = queryBuilder.limit(20)

  const { data } = await queryBuilder

  if (!data) return []

  return data
    .map((lawyer: any) => {
      let score = lawyer.rating || 0
      if (location) {
        const loc = location.toLowerCase()
        if (lawyer.location?.toLowerCase().includes(loc)) score += 5
      }
      if (practice_area) {
        const pa = practice_area.toLowerCase()
        const areas: string[] = lawyer.practice_areas?.map((a: string) => a.toLowerCase()) ?? []
        if (areas.some((a) => a.includes(pa) || pa.includes(a))) score += 10
      }
      return {
        id: lawyer.id,
        name: `${lawyer.first_name} ${lawyer.last_name}`,
        practiceAreas: lawyer.practice_areas,
        rating: lawyer.rating,
        location: lawyer.location,
        fee: lawyer.consultation_fee,
        image: lawyer.image_url,
        score,
      }
    })
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 5)
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m: any) => ({
        role: m.role === 'model' ? 'assistant' : m.role,
        content: m.content,
      })),
    ],
  })

  const rawText = completion.choices[0].message.content ?? ''
  let { cleanText, matchData } = extractMatchData(rawText)

  // Strip fake numbered lawyer lists: "1. Name — role" or "1. Name - role"
  // The dash-after-name pattern only appears in fake lawyer lists, not in the options menu
  cleanText = cleanText.replace(/^\d+\.\s+.+\s[—–-]\s.+(\n|$)/gm, '').trim()

  // Guard: if the model still snuck a question into the closing message, strip it
  if (matchData?.ready_to_match && cleanText.includes('?')) {
    cleanText = cleanText
      .split(/(?<=[.!?])\s+/)
      .filter(s => !s.includes('?'))
      .join(' ')
      .trim()
  }

  // Server-side guard: don't show lawyers if the AI produced a match with no real data
  const VAGUE_VALUES = ['unknown', 'unclear', 'not specified', 'none', 'general', 'various', "don't know", 'unspecified']
  const COUNTRY_LEVEL = ['india'] // city/state required, country alone is too broad
  const isVaguePracticeArea = !matchData?.practice_area ||
    VAGUE_VALUES.some(v => matchData.practice_area.toLowerCase().includes(v))
  const locationLower = matchData?.location?.toLowerCase() ?? ''
  const isVagueLocation = !matchData?.location ||
    VAGUE_VALUES.some(v => locationLower.includes(v)) ||
    COUNTRY_LEVEL.some(c => locationLower.trim() === c)

  let lawyers = null
  if (matchData?.ready_to_match && !isVaguePracticeArea && !isVagueLocation) {
    lawyers = await findMatchingLawyers(matchData)
  }

  return Response.json({
    reply: cleanText,
    ready_to_match: matchData?.ready_to_match ?? false,
    lawyers,
  })
}
