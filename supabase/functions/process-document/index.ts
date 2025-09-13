import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple text splitter function
function splitTextIntoChunks(text: string, maxChunkSize: number = 800, overlap: number = 100): string[] {
  const chunks: string[] = []
  const sentences = text.split(/[.!?]\s+/)

  let currentChunk = ''
  let currentSize = 0

  for (const sentence of sentences) {
    const sentenceSize = sentence.length

    if (currentSize + sentenceSize > maxChunkSize && currentChunk) {
      chunks.push(currentChunk.trim())
      // Keep overlap
      const words = currentChunk.split(' ')
      const overlapWords = words.slice(-Math.floor(overlap / 5))
      currentChunk = overlapWords.join(' ') + ' ' + sentence
      currentSize = currentChunk.length
    } else {
      currentChunk += (currentChunk ? '. ' : '') + sentence
      currentSize += sentenceSize
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim())
  }

  return chunks
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { documentId, title, content, category, projectId, metadata } = await req.json()

    // Initialize OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Insert or update document
    let finalDocumentId = documentId
    if (!documentId) {
      const { data: doc, error: docError } = await supabase
        .from('knowledge_documents')
        .insert({
          title,
          category,
          project_id: projectId,
          content,
          metadata: metadata || {},
        })
        .select('id')
        .single()

      if (docError) throw docError
      finalDocumentId = doc.id
    }

    // Split document into chunks
    const chunks = splitTextIntoChunks(content, 800, 100)

    // Generate embeddings for each chunk
    const embeddings = []

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]

      // Generate embedding
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: chunk,
        }),
      })

      if (!embeddingResponse.ok) {
        throw new Error(`OpenAI API error: ${await embeddingResponse.text()}`)
      }

      const embeddingData = await embeddingResponse.json()

      embeddings.push({
        document_id: finalDocumentId,
        chunk_index: i,
        chunk_text: chunk,
        embedding: embeddingData.data[0].embedding,
        tokens: embeddingData.usage?.total_tokens || chunk.length / 4,
        metadata: {
          ...metadata,
          chunk_metadata: {
            index: i,
            total_chunks: chunks.length,
          },
        },
      })
    }

    // Delete existing embeddings for this document
    await supabase
      .from('knowledge_embeddings')
      .delete()
      .eq('document_id', finalDocumentId)

    // Insert new embeddings
    const { error: embError } = await supabase
      .from('knowledge_embeddings')
      .insert(embeddings)

    if (embError) throw embError

    return new Response(
      JSON.stringify({
        success: true,
        documentId: finalDocumentId,
        chunks_processed: embeddings.length,
        title,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in process-document:', error)
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