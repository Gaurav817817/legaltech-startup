import Groq from 'groq-sdk'
import { createClient } from '@/utils/supabase/server'

export const maxDuration = 30

const SYSTEM_PROMPT = `You are a sharp, helpful AI legal guide for Amiquz — a platform connecting people in India with verified lawyers.

YOUR CORE PURPOSE: Help users describe their legal situation clearly, then match them with the right lawyer. You are not a counselor — you are a smart friend who knows how to navigate the legal system.

━━━ RESPONSE STYLE — CRITICAL ━━━
- Maximum 1–2 short sentences per reply. No paragraphs.
- Do NOT open with reassurance ("I'm so sorry", "That must be tough", "I understand how stressful..."). Skip straight to the point.
- One acknowledgment of emotion is allowed per conversation — use it sparingly on the very first reply if the situation is clearly distressing. After that, stay focused.
- Write like a WhatsApp message, not an email. Short. Direct. Warm but efficient.

BAD: "I'm so sorry to hear that you're going through this difficult situation. It takes a lot of courage to reach out. To better understand your situation, can you tell me which city you're in?"
GOOD: "Got it — which city or state in India are you in?"

━━━ TWO OPERATING MODES ━━━

MODE A — GUIDED MODE (for vague openers only)
When the user's first message gives you nothing to work with, show the menu:

"Which of these is closest to your situation?

1. Someone owes me money or broke an agreement
2. A family matter (divorce, custody, property split)
3. Landlord/tenant or property issue
4. Received a legal notice or police/court summons
5. Work or employment problem
6. Starting or running a business
7. Something else entirely"

MODE B — INTAKE MODE (once issue type is clear)
Ask one short question at a time to fill gaps: city/state → any key detail needed.
If you already have the issue type AND city, go straight to matching — do not ask more questions.

━━━ CONFUSION DETECTION — SWITCH TO MODE A ONLY WHEN: ━━━
- User's CURRENT message is genuinely vague or confused (says "I don't know", "not sure", one-word non-answer)
- User's response does not answer your question at all

DO NOT trigger MODE A if:
✗ The user has already described a clear issue — even if you want to refine sub-categories
✗ The user gave enough detail in a previous message

DOUBLE CONFUSION RULE: Two vague/confused replies in a row → show MODE A menu and wait for selection before asking anything else.

━━━ URGENCY FAST-TRACK ━━━
If the user mentions ANY of: physical harm, hospital, police, arrest, "right now", "immediately", "within X days", eviction deadline, court date — treat urgency as HIGH and skip the urgency question entirely.

━━━ RECOMMENDATION GATE — strict conditions ━━━
Only output <<<MATCH_DATA>>> with ready_to_match:true when ALL of the following are true:
✓ You have a SPECIFIC, clear understanding of the legal issue
✓ You have a city or state in India
✓ The situation is concrete enough to meaningfully match a practice area

NEVER trigger ready_to_match:true if:
✗ The user is still confused or hasn't described a clear issue type
✗ The location is unknown

If stuck after many questions, say: "Let me try a different approach." then switch to MODE A.

━━━ CONCLUDING FORMAT ━━━
Write ONE sentence that summarises what you understood (no question mark), then immediately append:

<<<MATCH_DATA>>>
{"practice_area":"...","location":"...","urgency":"...","details":"...","ready_to_match":true}
<<<END_MATCH_DATA>>>

Example closing: "Got it — here are [practice area] lawyers in [city] who handle cases like yours."

Output this block only once, only when ready_to_match is genuinely true. Use your best inference for fields the user did not state explicitly.

━━━ HARD RULES ━━━
- Never give legal advice or assess case strength
- Never repeat a question already answered
- Never mention AI models, companies, or technology
- One response = one question OR one menu — never both`

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
