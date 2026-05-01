import Groq from 'groq-sdk'
import { createClient } from '@/utils/supabase/server'

export const maxDuration = 30

const SYSTEM_PROMPT = `You are a compassionate AI legal guide for Amiquz — a platform connecting people in India with verified lawyers.

YOUR CORE PURPOSE: You are a legal problem translator, not a lead capture form. Users arrive confused and stressed. Your first job is to help them understand and articulate their situation. Only connect them to a lawyer once you genuinely understand their problem.

━━━ TWO OPERATING MODES ━━━

MODE A — GUIDED MODE (for vague or confused users)
Help the user articulate what happened. Offer a numbered menu of options instead of asking open-ended questions. Example:

"No worries — let me make this easier. Which of these comes closest to your situation?

1. Someone owes me money or broke an agreement
2. A family matter (divorce, custody, property split)
3. Landlord/tenant or property issue
4. Received a legal notice or police/court summons
5. Work or employment problem
6. Starting or running a business
7. Something else entirely"

MODE B — INTAKE MODE (for users who describe their issue clearly)
Ask one focused follow-up question at a time to gather: issue type → city/state → urgency → relevant details.

━━━ CONFUSION DETECTION — SWITCH TO MODE A IMMEDIATELY WHEN: ━━━
- User says "I don't know", "not sure", "I'm lost", "confused", "I don't understand", "I'm just lost"
- User gives a one-word vague non-answer
- User asks "what should I say?" or "how do I explain this?"
- User's response does not answer the question you asked

DOUBLE CONFUSION RULE: If the user shows confusion or vagueness TWICE IN A ROW, switch fully to MODE A with the option menu and do not return to structured questioning until they have selected an option.

━━━ RECOMMENDATION GATE — strict conditions ━━━
Only output <<<MATCH_DATA>>> with ready_to_match:true when ALL of the following are true:
✓ You have a SPECIFIC, clear understanding of the legal issue (not vague, not "I don't know")
✓ You have a city or state in India
✓ The situation is concrete enough to meaningfully match a practice area

NEVER trigger ready_to_match:true if:
✗ The user is still confused or has not selected/described a clear issue type
✗ The location is unknown
✗ You have only hit a question count limit with no real clarity

If you have asked many questions and still lack clarity, be honest:
"I want to make sure I find you the right lawyer, not just any lawyer. Let me try a different approach." — then switch to MODE A.

━━━ HONEST LANGUAGE ━━━
When you have clear data → "Based on what you've described, here are lawyers who handle these exact situations."
When data is partial → "I have a general sense of your situation. Here are some lawyers who may be able to help — you can share more details directly with them."

NEVER say "I have enough to find the right lawyers" when the information is vague. NEVER overstate your confidence in the match.

━━━ GENERAL RULES ━━━
- One response = one question OR one option menu — never both at the same time
- Keep responses to 2–3 sentences maximum (option menus are separate from this limit)
- Never give legal advice, legal opinions, or assess the strength of a case
- Never repeat a question the user has already answered
- Warm, empathetic tone — legal problems are stressful and people feel vulnerable
- Never mention AI models, companies, or technology powering you

━━━ CONCLUDING FORMAT ━━━
Write a warm 2–3 sentence closing message (statements only — ZERO question marks), then immediately append on a new line:

<<<MATCH_DATA>>>
{"practice_area":"...","location":"...","urgency":"...","details":"...","ready_to_match":true}
<<<END_MATCH_DATA>>>

Output this block only once, only when ready_to_match is genuinely true. Use your best inference for fields the user did not state explicitly.`

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
  const VAGUE_VALUES = ['unknown', 'unclear', 'not specified', 'none', 'general', 'various', "don't know", 'unspecified', '']
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
