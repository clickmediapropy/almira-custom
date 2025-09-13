import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SYSTEM_PROMPT = `Eres Almira, la asistente virtual de Altamira Group, una empresa inmobiliaria líder en Paraguay.

Tu rol es:
- Responder preguntas sobre los proyectos inmobiliarios
- Ayudar a agendar visitas a los showrooms
- Proporcionar información precisa sobre precios, ubicaciones y características
- Ser amable, profesional y orientada a la venta

Usa el contexto proporcionado para responder con precisión. Si no tienes información específica, ofrece agendar una visita para más detalles.`

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, leadId, projectInterest, conversationHistory = [] } = await req.json()

    // Initialize services
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Step 1: Generate embedding for the user's message
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: message,
      }),
    })

    if (!embeddingResponse.ok) {
      throw new Error(`OpenAI Embedding API error: ${await embeddingResponse.text()}`)
    }

    const embeddingData = await embeddingResponse.json()
    const embedding = embeddingData.data[0].embedding

    // Step 2: Search for relevant context
    const { data: searchResults, error: searchError } = await supabase.rpc('match_embeddings', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: 5,
      project_filter: projectInterest || null,
    })

    if (searchError) throw searchError

    // Build context from search results
    const context = searchResults
      .map((r: any) => `[${r.document_title || 'Info'}]\n${r.chunk_text}`)
      .join('\n\n---\n\n')

    // Step 3: Generate response with GPT-4
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'system', content: `Contexto relevante:\n\n${context}` },
      ...conversationHistory.slice(-5), // Include last 5 messages for context
      { role: 'user', content: message },
    ]

    const completionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!completionResponse.ok) {
      throw new Error(`OpenAI Chat API error: ${await completionResponse.text()}`)
    }

    const completionData = await completionResponse.json()
    const aiResponse = completionData.choices[0].message.content

    // Step 4: Log the interaction
    if (leadId) {
      await supabase.from('messages').insert({
        lead_id: leadId,
        direction: 'inbound',
        content: message,
        channel: 'whatsapp',
      })

      await supabase.from('messages').insert({
        lead_id: leadId,
        direction: 'outbound',
        content: aiResponse,
        channel: 'whatsapp',
        metadata: {
          model: 'gpt-4-turbo-preview',
          context_used: searchResults.length,
        },
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        response: aiResponse,
        contextUsed: searchResults.length,
        confidence: searchResults[0]?.similarity || 0,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in chat-with-rag:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})