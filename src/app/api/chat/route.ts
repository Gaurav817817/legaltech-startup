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

4. VAGUE / NO CONTEXT (user's message gives nothing to work with)
   → Reply with this menu (use \\n for line breaks in JSON):
   "Sure — which of these is closest to your situation?\\n1. Someone owes me money or broke an agreement\\n2. A family matter (divorce, custody, property split)\\n3. Landlord/tenant or property issue\\n4. Received a legal notice or police/court summons\\n5. Work or employment problem\\n6. Starting or running a business\\n7. Something else entirely"
   → Do NOT show this menu for greetings or when the user has already described something.

5. CLEAR ISSUE DESCRIBED (user explains a specific legal problem)
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

━━━ HARD RULES ━━━
- Never give case-specific legal advice
- General legal info is allowed — always include the disclaimer
- Never repeat a question already answered
- Never mention AI, models, or technology
- The reply field must NEVER contain a numbered list of lawyer names`

async function findMatchingLawyers(matchData: Record<string, any>) {
  const supabase = await createClient()
  const { location } = matchData
  // Use first term if AI returns compound value like "Criminal Law, NDPS Act"
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
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m: any) => ({
        role: m.role === 'model' ? 'assistant' : m.role,
        content: m.content,
      })),
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

  let lawyers = null
  if (matchData?.ready_to_match && !isVaguePracticeArea && !isVagueLocation) {
    lawyers = await findMatchingLawyers(matchData)
  }

  return Response.json({
    reply,
    ready_to_match: matchData?.ready_to_match ?? false,
    lawyers,
  })
}
