import { createPerplexity } from '@ai-sdk/perplexity';
import { streamText, embed } from 'ai';
import { Pool } from '@neondatabase/serverless';
import { openai } from '@ai-sdk/openai';
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

interface KnowledgeRow {
  contents: string;
  similarity: number;
}

// Initialize database connection
const pool = new Pool({
  connectionString: "postgresql://wedding-registry_owner:npg_NBlO2q3EWoxX@ep-yellow-hat-a4dmp4s2-pooler.us-east-1.aws.neon.tech/wedding-registry?sslmode=require"
});

// Initialize Perplexity client
const perplexity = createPerplexity({
  apiKey: process.env.PERPLEXITY_API_KEY ?? '',
});

async function getRelevantContext(query: string): Promise<string> {
  try {
    // Generate embedding for the query using the ai package
    const { embedding: queryEmbedding } = await embed({
      model: openai.embedding('text-embedding-ada-002'),
      value: query,
    });

    // Convert the embedding array to a PostgreSQL-compatible array string
    const pgVector = `[${queryEmbedding.join(',')}]`;

    // Perform vector similarity search
    const result = await pool.query<KnowledgeRow>(
      `SELECT contents, 1 - (vector <=> $1) as similarity 
       FROM documents 
       WHERE 1 - (vector <=> $1) > 0.7 
       ORDER BY similarity DESC 
       LIMIT 3`,
      [pgVector]
    );

    return result.rows.map(row => row.contents).join('\n\n');
  } catch (error) {
    console.error('Error fetching context:', error);
    return '';
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1];

  // Get relevant context from the database
  const context = await getRelevantContext(lastMessage.content);

  const result = streamText({
    model: perplexity('sonar'),
    system: `You are a helpful wedding assistant. Use the following context to answer the user's question. If the context doesn't contain relevant information, use the internet to find the answer.

Context:
${context}`,
    messages,
  });

  return result.toDataStreamResponse();
}