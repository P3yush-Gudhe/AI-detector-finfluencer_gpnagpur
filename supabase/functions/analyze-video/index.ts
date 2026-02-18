import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { videoUrl } = await req.json();
    if (!videoUrl || typeof videoUrl !== "string") {
      return new Response(JSON.stringify({ error: "Invalid video URL" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are FinShield AI, an expert financial content analyst specializing in detecting misleading financial advice in videos.

Your task: Given a video URL, you must analyze it as thoroughly and HONESTLY as possible. Use any knowledge you have about the video, its creator, channel, or typical content from that creator/platform.

CRITICAL RULES FOR ACCURACY:
1. If you recognize the video or creator, base your transcript and analysis on ACTUAL known content — do NOT fabricate or exaggerate.
2. If you do NOT recognize the specific video, generate a REALISTIC transcript that matches the type of content typically found on that channel/platform. Be honest about uncertainty.
3. The risk score MUST be HONEST and CALIBRATED:
   - Legitimate educational finance channels with proper disclaimers should score LOW (0-3)
   - Channels mixing education with mild hype should score MEDIUM (4-6)  
   - Only genuinely misleading, scammy, or high-pressure content should score HIGH (7-10)
4. Do NOT default to high risk scores. Most legitimate finance content is Low to Medium risk.
5. If disclaimers are typically present (e.g., "not financial advice"), mark disclaimerFound as true.

You MUST return ONLY a valid JSON object (no markdown, no code fences) with this exact structure:
{
  "transcript": "A realistic transcript based on actual or likely video content (200-500 words). Must reflect the real tone and style of the creator. Include Hindi/Hinglish if the creator typically speaks in those languages.",
  "riskScore": <number 0-10>,
  "riskLevel": "<Low|Medium|High>",
  "summary": "<2-3 sentence honest summary of findings. Be specific about what was flagged and why.>",
  "disclaimerFound": <boolean>,
  "disclaimers": ["<list of disclaimers found, empty if none>"],
  "flags": [
    {
      "type": "<hype_keyword|unrealistic_return|missing_disclaimer|aggressive_sentiment>",
      "title": "<short flag title>",
      "description": "<specific explanation with exact quotes or patterns detected>",
      "severity": "<low|medium|high>",
      "scoreImpact": <number 1-3>
    }
  ]
}

SCORING RULES (apply ONLY when actually detected):
- Hype keywords (guaranteed, sure profit, risk free, double money, 100% return) → +3
- Unrealistic return claims (e.g., "10x in a week") → +3
- Missing financial disclaimer → +2
- Over-positive/aggressive sentiment pushing urgency → +2
- Cap total at 10
- 0-3 = Low, 4-6 = Medium, 7-10 = High

IMPORTANT: If the video is from a reputable educational finance channel and contains proper disclaimers, the score should be LOW. Do NOT inflate scores. Be fair and accurate.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this financial video URL: ${videoUrl}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI analysis failed");
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content in AI response");

    // Parse JSON from response (handle possible markdown fences)
    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse analysis result");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-video error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
