import Groq from 'groq-sdk'
import { createClient } from '@/utils/supabase/server'

export const maxDuration = 30

const SYSTEM_PROMPT = `You are an intelligent legal assistant for Amiquz — a platform connecting people in India with verified lawyers. You are like a smart, experienced legal receptionist: you understand legal matters, ask the right questions, and connect people with the right help.

━━━ OUTPUT FORMAT (CRITICAL) ━━━
You MUST always respond with a valid JSON object. No plain text. No markdown. Only JSON.

For normal conversational replies:
{"reply":"your message here","match":null}

When all gate conditions are met and you are ready to show lawyers:
{"reply":"Here are criminal defense lawyers in Delhi who handle theft cases.","match":{"practice_area":"Criminal Law","location":"Delhi","urgency":"high","details":"arrested for theft","ready_to_match":true}}

The "reply" value is shown directly to the user. Keep it clean — no lawyer names, no numbered lists.
The "match" value is null for all conversational replies. Set it to an object only when you are truly ready to match.

━━━ STYLE ━━━
Short, sharp, helpful. No filler, no unnecessary reassurance. Warm but efficient. 2–4 lines max per reply unless sharing legal information.

━━━ GREETINGS & SOCIAL ━━━
Greeting only (hi / hello / namaste / good morning):
→ reply: "Hey! What legal matter can I help you with?"

Meta-comment ("you didn't reply", "i said hi", "stop repeating"):
→ Acknowledge in one line, then redirect.

━━━ DECISION TREE — read top to bottom, apply the FIRST match ━━━

1. GENERAL LEGAL QUESTION (user asks about a law, a right, a statute, a process — not about their specific case)
   → Answer with clear, factual general information (2–5 lines).
   → End reply with: "This is general information. For advice specific to your situation, please consult a lawyer."
   → Then ask: "Would you like me to suggest a lawyer who handles this?"
   → Do NOT ask for location before answering. Answer first.

2. CASE-SPECIFIC ADVICE REQUEST (user asks you to evaluate their case or tell them what to do)
   → Reply: "I can't give case-specific legal advice, but I can connect you with a lawyer who can assess your situation."
   → Then offer to find them a lawyer.

3. NOT LOOKING FOR A LAWYER (user explicitly says they don't want a lawyer right now)
   → Reply: "No problem — happy to help clarify things. Let me know if you'd like more information or want to explore legal options later."
   → Do NOT ask for location. Do NOT recommend lawyers. Stay available.

4. LOCATION OUTSIDE INDIA
   If the user mentions a city or country outside India (e.g. London, Dubai, New York, USA, UK):
   → Reply: "Amiquz currently connects clients with lawyers in India only. Are you looking for legal help within India?"
   → Set match to null. Do NOT trigger ready_to_match.

5. VAGUE / NO CONTEXT (user's message gives nothing to work with)
   → Reply with this menu (use \\n for line breaks in JSON):
   "Sure — which of these is closest to your situation?\\n1. Someone owes me money or broke an agreement\\n2. A family matter (divorce, custody, property split)\\n3. Landlord/tenant or property issue\\n4. Received a legal notice or police/court summons\\n5. Work or employment problem\\n6. Starting or running a business\\n7. Something else entirely"
   → Do NOT show this menu for greetings or when the user has already described something.

6. CLEAR ISSUE DESCRIBED (user explains a specific legal problem)
   FIRST RESPONSE: Acknowledge briefly + ask 1–2 clarifying questions. Do NOT recommend a lawyer yet.

   FOLLOW-UP: Once you have issue type + location + urgency → set match in JSON.
   If still missing pieces → ask one more focused question.

   URGENCY FAST-TRACK: If user mentions physical harm, police, arrest, court date, or imminent deadline → skip the urgency question only. Still MUST ask for their specific city or state if not yet known.

━━━ RECOMMENDATION GATE ━━━
Only set match with ready_to_match:true when ALL of the following are true:
✓ Clear specific legal issue is known
✓ Specific city or state in India is known (NOT just "India" — must be a city like Mumbai, Delhi, Bangalore etc.)
✓ User wants a lawyer (has not said otherwise)
✓ At least one clarifying question has been asked

NEVER set ready_to_match:true if:
- User said they're not looking for a lawyer
- Location is just "India" or unknown — ask "Which city or state in India are you in?" first
- Location is outside India — see rule 4 above

━━━ HARD RULES ━━━
- Never give case-specific legal advice
- General legal info is allowed — always include the disclaimer
- Never repeat a question already answered
- Never mention AI, models, or technology
- The reply field must NEVER contain a numbered list of lawyer names
- Location must be where the incident happened or where the user currently is — NEVER use their hometown or place of origin for matching`

// Summarize old messages using a fast small model so the main model
// gets full context without hitting token limits on long conversations
async function summarizeHistory(groq: Groq, messages: Array<{ role: string; content: string }>): Promise<string> {
  const transcript = messages
    .map(m => `${m.role === 'user' ? 'Client' : 'Assistant'}: ${m.content}`)
    .join('\n')

  const result = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_tokens: 250,
    messages: [
      {
        role: 'system',
        content: 'Summarize this legal intake conversation in 3-5 sentences. Capture: the legal issue, location if mentioned, urgency, key facts already established, and whether the client wants a lawyer. Be factual and concise — this summary replaces the full history.',
      },
      { role: 'user', content: transcript },
    ],
  })

  return result.choices[0].message.content ?? ''
}

const CONTEXT_THRESHOLD = 12 // messages before summarisation kicks in
const RECENT_KEEP = 6        // always send last N messages verbatim

async function buildMessageHistory(groq: Groq, rawMessages: any[]) {
  const mapped = rawMessages.map((m: any) => ({
    role: (m.role === 'model' ? 'assistant' : m.role) as 'user' | 'assistant',
    content: m.content as string,
  }))

  if (mapped.length <= CONTEXT_THRESHOLD) return mapped

  const toSummarize = mapped.slice(0, mapped.length - RECENT_KEEP)
  const recent = mapped.slice(-RECENT_KEEP)

  try {
    const summary = await summarizeHistory(groq, toSummarize)
    return [
      { role: 'user' as const, content: `[Summary of earlier conversation]: ${summary}` },
      { role: 'assistant' as const, content: 'Understood. I have the context from our earlier conversation.' },
      ...recent,
    ]
  } catch {
    // Fallback: just send last CONTEXT_THRESHOLD messages
    return mapped.slice(-CONTEXT_THRESHOLD)
  }
}

async function findMatchingLawyers(matchData: Record<string, any>) {
  const supabase = await createClient()
  const { location } = matchData
  const practice_area = matchData.practice_area?.split(',')[0].trim()

  // Only filter by location at the DB level — exact practice_area array match
  // is too strict (e.g. "Criminal Law" won't match "Criminal Defense").
  // Practice area relevance is handled entirely by the scoring below.
  let queryBuilder = supabase
    .from('lawyer_profiles')
    .select('id, first_name, last_name, practice_areas, rating, location, consultation_fee, image_url')
    .eq('approved', true)
    .order('rating', { ascending: false })

  if (location) queryBuilder = queryBuilder.ilike('location', `%${location}%`)

  queryBuilder = queryBuilder.limit(20)

  const { data } = await queryBuilder
  if (!data) return []

  // Score: rating (0–5) + location match (+5) + practice area match (+10)
  // Min meaningful score = 5 (location match on a 0-rated lawyer).
  // A lawyer with no location match gets rating only (0–5) — filtered out below.
  const MIN_SCORE = 5
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
    .filter((l: any) => l.score >= MIN_SCORE)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 5)
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const history = await buildMessageHistory(groq, messages)

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
    ],
  })

  let reply = ''
  let matchData: Record<string, any> | null = null

  try {
    const parsed = JSON.parse(completion.choices[0].message.content ?? '{}')
    reply = parsed.reply ?? ''
    matchData = parsed.match ?? null
  } catch {
    reply = 'Something went wrong. Please try again.'
  }

  const VAGUE_VALUES = ['unknown', 'unclear', 'not specified', 'none', 'general', 'various', "don't know", 'unspecified']
  const COUNTRY_LEVEL = ['india']
  const isVaguePracticeArea = !matchData?.practice_area ||
    VAGUE_VALUES.some(v => matchData!.practice_area.toLowerCase().includes(v))
  const locationLower = matchData?.location?.toLowerCase() ?? ''
  const isVagueLocation = !matchData?.location ||
    VAGUE_VALUES.some(v => locationLower.includes(v)) ||
    COUNTRY_LEVEL.some(c => locationLower.trim() === c)

  // Don't re-query if lawyers were already shown in this conversation —
  // the AI tends to keep firing ready_to_match on follow-up questions.
  const lawyersAlreadyShown = messages.some(
    (m: any) => m.role === 'model' && typeof m.content === 'string' && m.content.includes('[Lawyers shown:')
  )

  let lawyers = null
  if (matchData?.ready_to_match && !isVaguePracticeArea && !isVagueLocation && !lawyersAlreadyShown) {
    lawyers = await findMatchingLawyers(matchData)
    // If DB returned nothing despite a valid match, the location probably has no coverage
    if (lawyers.length === 0) {
      reply = "I couldn't find verified lawyers for that location yet — Amiquz is expanding coverage across India. Try a nearby major city, or contact us at founders@amiquz.com for a manual referral."
      lawyers = null
    }
  }

  return Response.json({
    reply,
    ready_to_match: matchData?.ready_to_match ?? false,
    lawyers,
  })
}
