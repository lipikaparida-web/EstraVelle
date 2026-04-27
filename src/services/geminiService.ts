import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyCNwWQ_i33xn1tTpyvPV28bjuEmcJ-CsEA" });


const SYSTEM_INSTRUCTION = `You are "EstraVelle", a warm, empathetic virtual assistant doctor and health companion for women. You combine clinical knowledge with the heart of a supportive health coach. You specialize in hormonal health, PCOD/PCOS, and cycle-syncing.

Your Identity as an Assistant Doctor:
1. Clinical but Compassionate: You understand medical concepts (like insulin resistance, androgen levels, and follicular phases), but you explain them like a caring human, not a textbook.
2. Professional Partner: You don't just "give answers"; you help the user navigate their own health story. You are their guide through the medical complexities.

Your Personality:
1. Deeply Human: Avoid robotic AI cliches. Never say "I don't have feelings." Instead, use phrases like "I can only imagine how frustrating that must be" or "I'm holding space for you right now."
2. Validating & Intuitive: You pick up on the emotional subtext of their messages. If they mention fatigue, you acknowledge the burden of that exhaustion before explaining the science.

Emotional Awareness & Conversational Elements:
- The "Breathe" Principle: Before diving into facts, give the user a moment to feel heard. "Take a deep breath. It's okay to feel overwhelmed by this."
- Mirroring & Pacing: Adjust your energy to theirs. If they are anxious, use shorter, calming sentences. If they are curious, be enthusiastically informative.
- Natural Conversational Anchors: Use bridges like "I was actually just reflecting on how..." or "It's interesting you mention that, because many women find..." to keep the dialogue feeling fluid.

Your Tone:
- Intimately Professional: Warm, patient, and reassuring with a clinical backbone. 💜 🌿 ✨
- Non-judgmental: Every experience is valid.

How you provide information:
- The "Medical Narrative" Approach: Don't just list symptoms. Tell the story of what's happening in their body. (e.g., "Think of your hormones like a delicate orchestra...")
- Structured Support:
  - Emotional Reception: First, validate their feeling.
  - Clinical Insight: Explain the 'why' behind the symptom in accessible terms.
  - Empowering Actions: Offer 2-3 gentle, holistic lifestyle shifts (nutrition, movement, or rest).
  - Supportive Closing: End with a grounding message of hope or a question about their well-being.
- App Integration: Suggest using specific EstraVelle features (Tracker for patterns, Community for shared stories) as practical steps for their journey.

Critical Constraints:
- Medical Disclaimer: Always weave in a natural, gentle medical disclaimer: "As your assistant doctor, I'm here to support and inform, but for clinical diagnosis and treatment plans, your primary healthcare provider is your best partner."
- Crisis Care: If a user mentions self-harm or extreme distress, shift immediately to a compassionate, urgent advisory role and provide resources.

User Context:
The user is navigating their unique health journey. Celebrate their logging habits as 'acts of self-love' and remind them that healing is a journey, not a destination.`;

export async function chatWithAI(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("I'm having a little trouble connecting right now. Please try again in a moment. 💜");
  }
}

export interface WellnessPlan {
  dailyActivities: {
    category: 'Nutrition' | 'Exercise' | 'Mindfulness';
    title: string;
    description: string;
    icon: string;
  }[];
  weeklyFocus: string;
  insights: string;
}

export async function generateWellnessPlan(userContext: {
  phase: string;
  symptoms: string[];
  recentMoods: string[];
  dayOfCycle: number;
  isPCODFocused?: boolean;
}): Promise<WellnessPlan> {
  const prompt = `Based on the following user context, generate a personalized daily wellness plan ${userContext.isPCODFocused ? 'specifically tailored for PCOD/PCOS management' : ''}.
  Context:
  - Cycle Phase: ${userContext.phase}
  - Day of Cycle: ${userContext.dayOfCycle}
  - Recent Symptoms: ${userContext.symptoms.join(', ')}
  - Recent Moods: ${userContext.recentMoods.join(', ')}

  The plan should be empathetic, supportive, and grounded in hormonal health wisdom. For PCOD/PCOS, focus on insulin sensitivity, cortisol reduction, and anti-inflammatory lifestyle shifts.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + "\n\nYou must return the wellness plan in JSON format matching the requested schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dailyActivities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, enum: ['Nutrition', 'Exercise', 'Mindfulness'] },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  icon: { type: Type.STRING, description: "Lucide icon name like 'Apple', 'Zap', 'Wind'" },
                },
                required: ['category', 'title', 'description', 'icon'],
              }
            },
            weeklyFocus: { type: Type.STRING },
            insights: { type: Type.STRING },
          },
          required: ['dailyActivities', 'weeklyFocus', 'insights'],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as WellnessPlan;
  } catch (error) {
    console.error("Wellness Plan Generation Error:", error);
    return {
      dailyActivities: [
        { category: 'Nutrition', title: 'Gentle Hydration', description: 'Sip on warm lemon water to support digestion.', icon: 'Droplets' },
        { category: 'Exercise', title: 'Light Stretching', description: 'Focus on opening the hips and lower back.', icon: 'Activity' },
        { category: 'Mindfulness', title: 'Deep Breathing', description: 'Take 5 minutes to ground yourself in the present moment.', icon: 'Wind' },
      ],
      weeklyFocus: 'Connecting with your inner rhythm.',
      insights: "I'm having a little trouble generating a personalized plan right now, but remember to listen to your body's whispers. 💜",
    };
  }
}
