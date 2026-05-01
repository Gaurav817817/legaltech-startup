import Groq from 'groq-sdk'
import { createClient } from '@/utils/supabase/server'

export const maxDuration = 30

const SYSTEM_PROMPT = `You are the AI legal assistant for Amiquz, a platform that connects people with verified lawyers in India.

Your job is to understand the user's legal problem through short focused questions, then signal when you have enough information to find the right lawyers.

STRICT RULES — follow every one of these exactly:
- Ask only ONE question at a time
- Keep each question to 1–2 lines maximum
- Never give legal advice or any legal opinion
- Never repeat a question the user has already answered
- Ask a maximum of 5 follow-up questions before concluding
- Keep a calm, conversational, and empathetic tone throughout
- Never mention the name of any AI model, company, or technology powering you

INFORMATION TO COLLECT (do this naturally through conversation):
1. Type of legal issue (e.g. property dispute, divorce, criminal defence, corporate/startup, consumer complaint, labour dispute)
2. City or state where the issue is based
3. Urgency level (e.g. court date coming up, police notice received, no immediate deadline)
4. Specific details that help narrow the right lawyer match

WHEN TO CONCLUDE — once you have all 4 fields above, or after 5 follow-up questions (whichever comes first):
Write a warm 2–3 sentence closing message (statements only — NO questions, NO question marks). Tell the user you have enough to find the right lawyers. Stop there.

Immediately after the closing message, on a new line, append EXACTLY this block:

<<<MATCH_DATA>>>
{"practice_area":"...","location":"...","urgency":"...","details":"...","ready_to_match":true}
<<<END_MATCH_DATA>>>

CRITICAL rules for the concluding turn:
- The closing message must contain ZERO questions and ZERO question marks
- Do NOT ask for any more information in this turn
- Output the <<<MATCH_DATA>>> block only once, only in the concluding turn
- Use your best inference for any field the user did not explicitly state`

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

  let lawyers = null
  if (matchData?.ready_to_match) {
    lawyers = await findMatchingLawyers(matchData)
  }

  return Response.json({
    reply: cleanText,
    ready_to_match: matchData?.ready_to_match ?? false,
    lawyers,
  })
}
