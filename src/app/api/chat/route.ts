import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `You are a helpful legal intake assistant for LegalLink. 
Your job is to:
1. Briefly understand the user's legal problem.
2. Provide general, non-advisory legal context.
3. Once you understand their issue (practice area and location if possible), IMMEDIATELY call the 'recommendLawyers' tool to show them relevant lawyers. Do not ask too many follow-up questions if you have enough to make a recommendation.`,
    messages,
    tools: {
      recommendLawyers: tool({
        description: 'Recommend lawyers to the user based on their legal issue and location.',
        parameters: z.object({
          practiceArea: z.string().describe('The legal practice area, e.g., Family Law, Corporate, Criminal Defense'),
          location: z.string().optional().describe('The user\'s city or state if mentioned'),
          reasoning: z.string().describe('A brief sentence explaining why these types of lawyers are being recommended.'),
        }),
        execute: async ({ practiceArea, location, reasoning }) => {
          
          const supabase = await createClient();
          
          // Fetch real data from Supabase
          // In a real app, we would use `.contains('practice_areas', [practiceArea])`
          // but for MVP we fetch top rated or random and let frontend handle it, or just limit to 3.
          const { data, error } = await supabase
            .from('lawyer_profiles')
            .select('id, first_name, last_name, practice_areas, rating, image_url')
            .limit(3);

          if (error) {
            console.error("AI Tool Supabase Error:", error);
          }

          // Format results to match what the chat UI expects
          const results = data?.map(l => ({
            id: l.id,
            name: `${l.first_name} ${l.last_name}`,
            practiceAreas: l.practice_areas,
            rating: l.rating,
            image: l.image_url
          })) || [];

          return {
            practiceArea,
            location,
            reasoning,
            results
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
