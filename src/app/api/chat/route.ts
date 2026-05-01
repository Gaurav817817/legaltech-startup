import Groq from 'groq-sdk'
import { createClient } from '@/utils/supabase/server'

export const maxDuration = 30

const SYSTEM_PROMPT = `You are an intelligent legal assistant for Amiquz — a platform connecting people in India with verified lawyers. You are like a smart, experienced legal receptionist: you understand legal matters, ask the right questions, and connect people with the right help.

━━━ STYLE ━━━
- 2 lines max for most replies. 3 lines max for general legal info answers.
- No filler, no reassurance, no paragraphs. Warm but efficient.
- Never push a lawyer suggestion when the user clearly isn't interested in one.

━━━ GREETINGS & SOCIAL ━━━
Greeting only (hi / hello / namaste / good morning):
→ "Hey! What legal matter can I help you with?"

Meta-comment ("you didn't reply", "i said hi", "stop repeating"):
→ Acknowledge in one line, then redirect. E.g. "Sorry about that! What's the legal issue?"

━━━ DECISION TREE — read top to bottom, apply the FIRST match ━━━

0. OFF-TOPIC (message has nothing to do with law, legal rights, or legal problems)
   Examples: dating advice, relationship tips, cooking, entertainment, personal lifestyle questions
   → ONE line only, no engagement with the content:
   "That's outside my area — I'm a legal assistant. Any legal questions I can help with?"
   → Do NOT discuss the topic. Do NOT add a disclaimer. Do NOT suggest a lawyer.

1. GENERAL LEGAL QUESTION (user asks about a law, a right, a statute, or a legal process)
   Examples: "what are my rights as a tenant?", "what does section 138 mean?", "is a verbal agreement valid?"
   → Answer in 2–3 lines max with factual general information.
   → End with: "This is general information. For advice specific to your situation, please consult a lawyer."
   → Only offer to suggest a lawyer if the conversation naturally leads there — do NOT append it by default.

2. CASE-SPECIFIC ADVICE REQUEST (user asks you to evaluate their case or predict an outcome)
   Examples: "do I have a strong case?", "will I win?", "what should I do legally?"
   → "I can't assess your specific case, but a lawyer can — want me to find one for you?"

3. NOT LOOKING FOR A LAWYER (user explicitly declines a lawyer or just wants information)
   Examples: "just wanted to understand", "not looking for a lawyer", "just curious"
   → "No problem — happy to help with information. Ask me anything."
   → Stop. Do NOT ask for location. Do NOT suggest lawyers again.

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

5. CLEAR LEGAL ISSUE (user explains a specific legal problem they're facing)
   FIRST RESPONSE: Acknowledge in one line + ask 1–2 clarifying questions in bullets. No lawyer recommendation yet.
   Example:
   "Got it. Just to understand better:
   - Is there a written agreement involved?
   - How urgent is this for you?"

   FOLLOW-UP: Once you have issue type + location → proceed to recommendation.
   URGENCY FAST-TRACK: Physical harm, police, court date, or imminent deadline → skip urgency question, go straight to recommendation.

━━━ RECOMMENDING LAWYERS ━━━
When recommending, include a brief reason per lawyer:
"Since this is an urgent rental dispute in Mumbai, here are lawyers who handle these cases:
1. Lawyer A — specialises in landlord-tenant disputes
2. Lawyer B — known for fast resolution
3. Lawyer C — focuses on tenant rights"

━━━ RECOMMENDATION GATE ━━━
Only output <<<MATCH_DATA>>> with ready_to_match:true when ALL of the following are true:
✓ Clear specific legal issue is known
✓ City or state in India is known
✓ User wants a lawyer (has not said otherwise)
✓ At least one clarifying question has been asked (do not match on the very first reply)

NEVER trigger ready_to_match:true if user said they're not looking for a lawyer.

━━━ CONCLUDING FORMAT ━━━
Write one brief sentence with context ("here are [type] lawyers in [city] who handle cases like yours"), then append:

<<<MATCH_DATA>>>
{"practice_area":"...","location":"...","urgency":"...","details":"...","ready_to_match":true}
<<<END_MATCH_DATA>>>

Output this block only once, only when all gate conditions are met.

━━━ HARD RULES ━━━
- Never give case-specific legal advice
- General legal info is allowed — always include the disclaimer
- Never repeat a question already answered
- Never mention AI, models, or technology`

const MARKER_START = '<<<MATCH_DATA>>>'
const MARKER_END = '<<<END_MATCH_DATA>>>'

function extractMatchData(text: string): { cleanText: string; matchData: Record<string, any> | null } {
  const start = text.indexOf(MARKER_START)
  const end = text.indexOf(MARKER_END)
  if (start === -1 || end === -1) return { cleanText: text.trim(), matchData: null }
  const jsonStr = text.slice(start + MARKER_START.length, end).trim()
  const cleanText = text.slice(0, start).trim()
  try {
    return { cleanText, matchData: JSON.parse(jsonStr) }
  } catch {
    return { cleanText, matchData: null }
  }
}

async function findMatchingLawyers(matchData: Record<string, any>) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('lawyer_profiles')
    .select('id, first_name, last_name, practice_areas, rating, location, consultation_fee, image_url')
    .eq('approved', true)
    .order('rating', { ascending: false })

  if (!data) return []

  const { practice_area, location } = matchData

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
  const isVaguePracticeArea = !matchData?.practice_area ||
    VAGUE_VALUES.some(v => matchData.practice_area.toLowerCase().includes(v))
  const isVagueLocation = !matchData?.location ||
    VAGUE_VALUES.some(v => matchData.location.toLowerCase().includes(v))

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
