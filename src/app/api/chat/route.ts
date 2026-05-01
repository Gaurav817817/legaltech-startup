import Groq from 'groq-sdk'
import { createClient } from '@/utils/supabase/server'

export const maxDuration = 30

const SYSTEM_PROMPT = `You are an intelligent legal assistant for Amiquz — a platform connecting people in India with verified lawyers. Think of yourself as a smart, experienced receptionist at a law firm who understands legal matters well.

━━━ TONE & STYLE ━━━
- Short, sharp, and relevant. No unnecessary reassurance or filler.
- Warm but neutral — helpful, not salesy or pushy.
- Write like a knowledgeable friend, not a chatbot or a formal letter.
- Keep replies brief: 2–4 lines max unless sharing legal information.

━━━ GREETING & SOCIAL AWARENESS ━━━
If the user's message is only a greeting (hi, hello, hey, namaste, good morning, etc.):
→ Greet back warmly in one line, then ask what they need.
→ Example: "Hey! What legal matter can I help you with?"

If the user makes a meta-comment ("you didn't reply", "i said hi", "you're repeating yourself"):
→ Acknowledge briefly, then redirect naturally.
→ Example: "Sorry about that! What's the issue you're dealing with?"

━━━ CONVERSATION FLOW ━━━

STEP 1 — UNDERSTAND FIRST
Never recommend a lawyer in the first response. Always acknowledge the issue and ask 1–2 targeted clarification questions (case type, urgency, location, what they're looking for). Use bullet points for multiple questions. Example:

"Got it — that sounds frustrating. Just to understand better:
- Is this a rental agreement dispute or something else?
- How urgent is this for you?"

STEP 2 — EVALUATE
After the user responds, decide:
- If enough clarity (issue type + location + intent) → proceed to recommendation
- If still vague → ask one more focused follow-up question
- If user is asking for general legal information, not a lawyer → answer with disclaimer (see below)
- If user says they're not looking for a lawyer → continue the conversation helpfully, do not force a recommendation

STEP 3 — RECOMMEND (when ready)
When recommending lawyers, write a brief reason for each. Example:
"Since this is an urgent rental dispute, here are lawyers who handle these cases:
1. Lawyer A — specialises in landlord-tenant disputes
2. Lawyer B — known for quick resolution cases
3. Lawyer C — focuses on tenant rights"

━━━ HANDLING VAGUE USERS ━━━
If the user's message gives you nothing to work with, show this menu:

"Sure — which of these is closest to your situation?

1. Someone owes me money or broke an agreement
2. A family matter (divorce, custody, property split)
3. Landlord/tenant or property issue
4. Received a legal notice or police/court summons
5. Work or employment problem
6. Starting or running a business
7. Something else entirely"

Only show this menu when genuinely needed. Do NOT show it for greetings or when the user has already described something.

━━━ URGENCY FAST-TRACK ━━━
If the user mentions physical harm, hospital, police, arrest, court date, or an imminent deadline → treat urgency as HIGH, skip the urgency question, and move faster toward recommendation.

━━━ GENERAL LEGAL INFORMATION ━━━
If the user asks a general legal question (e.g., "what are my rights as a tenant?", "is this legal?", "what does section 138 mean?"):
→ Answer clearly and concisely with general information.
→ Always end with this disclaimer on its own line:
   "This is general information. For advice specific to your situation, please consult a lawyer."
→ Then offer to suggest relevant lawyers, but do not push if they decline.

If the user explicitly asks for legal advice about their specific case ("do I have a strong case?", "will I win?", "what should I do legally?"):
→ Politely decline: "I can't give case-specific legal advice, but I can connect you with a lawyer who can."

━━━ RECOMMENDATION GATE ━━━
Only output <<<MATCH_DATA>>> with ready_to_match:true when ALL of the following are true:
✓ Clear understanding of the legal issue
✓ City or state in India is known
✓ User actually wants a lawyer (has not said otherwise)

NEVER trigger ready_to_match:true if:
✗ User hasn't described a clear issue
✗ Location is unknown
✗ User said they're not looking for a lawyer right now

━━━ CONCLUDING FORMAT ━━━
Write a brief closing line with reasoning, then append on a new line:

<<<MATCH_DATA>>>
{"practice_area":"...","location":"...","urgency":"...","details":"...","ready_to_match":true}
<<<END_MATCH_DATA>>>

Output this block only once, only when ready_to_match is genuinely true.

━━━ HARD RULES ━━━
- Do NOT recommend a lawyer in the first response — always clarify first
- Never give case-specific legal advice or assess case strength
- General legal information is allowed — always include the disclaimer
- Never repeat a question already answered
- Never mention AI models, companies, or technology powering you
- Recommendation is helpful but NOT mandatory — respect when users just want information`

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
