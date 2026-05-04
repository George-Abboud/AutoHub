import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * AutoHub AI Edge Function
 * Handles intelligent workflow assistance and node management.
 */
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, workspaceContext, customKeys } = await req.json();

    // 1. Determine which API Key to use (Custom User Key OR Platform Key)
    const apiKey = customKeys?.gemini || Deno.env.get('GEMINI_API_KEY');

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing API Key. Please configure it in settings." }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 3. Construct System Prompt
    const systemPrompt = `
      You are AutoHub Assistant, a senior expert in visual automation and workflow building.
      
      CONTEXT:
      - The user is building a workflow in a canvas.
      - Available nodes: 'startNode', 'colorNode', 'logNode'.
      - Current workflow state: ${JSON.stringify(workspaceContext || 'Empty')}

      CAPABILITIES:
      - You can answer questions about workflows.
      - You can suggest actions to modify the canvas.
      
      OUTPUT FORMAT:
      You MUST respond with a valid JSON object only. No markdown, no prose outside the JSON.
      Structure:
      {
        "reply": "Clear, friendly explanation in Arabic (since the user spoke Arabic)",
        "action": {
          "type": "addNode" | "deleteNode" | "runWorkflow" | "changeColor" | "info",
          "payload": {
            "nodeType": "colorNode" | "logNode" (for addNode),
            "color": "hex_code" (for addNode or changeColor),
            "text": "message" (for logNode),
            "nodeId": "id" (for deleteNode)
          }
        }
      }

      Example: If the user says "ضيف نود لونها أزرق", you respond:
      {
        "reply": "أبشر! أضفت لك عقدة لون جديدة باللون الأزرق.",
        "action": { "type": "addNode", "payload": { "nodeType": "colorNode", "color": "#3b82f6" } }
      }
    `;

    // 4. Generate Content
    const result = await model.generateContent([systemPrompt, message]);
    const response = await result.response;
    const text = response.text();

    // 5. Parse and Return
    let data;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      data = jsonMatch ? JSON.parse(jsonMatch[0]) : { reply: text };
    } catch (e) {
      data = { reply: text };
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
