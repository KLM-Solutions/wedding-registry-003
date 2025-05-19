// app/api/calculator/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from 'zod';

// Analysis prompt for food image processing
const WEDDING_MENU_ANALYSIS_PROMPT = `So give me a 4 to 5 line analysis of the food in the image and only give the positive things about the food. Don't show it is a positive feedback, just give the analysis.`;

// Initialize Gemini Pro Vision
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// Request validation schema
const requestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
      id: z.string().optional()
    })
  ),
  body: z.object({
    maxTokens: z.number().optional(),
    temperature: z.number().optional()
  }).optional()
});

// Analysis request schema for the parsed content
const analysisRequestSchema = z.object({
  type: z.literal('analysis_request'),
  image: z.string()
});

function extractImageData(base64Url: string) {
  // Remove data URL prefix if present
  const base64Data = base64Url.replace(/^data:image\/\w+;base64,/, '');
  // Convert base64 to uint8array
  return new Uint8Array(Buffer.from(base64Data, 'base64'));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = requestSchema.parse(body);
    
    // Parse the message content
    const lastMessage = validatedData.messages[validatedData.messages.length - 1];
    let parsedContent;
    try {
      parsedContent = JSON.parse(lastMessage.content);
    } catch (error) {
      throw new Error('Invalid JSON in message content');
    }
    
    const analysisRequest = analysisRequestSchema.parse(parsedContent);
    
    const imageData = analysisRequest.image;
    if (!imageData) {
      throw new Error('No image data provided');
    }

    // Extract and prepare the image data
    const imageBytes = extractImageData(imageData);

    // Set up streaming response
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Generate food analysis content with streaming
    const result = await model.generateContentStream({
      contents: [{
        role: "user",
        parts: [
          { text: WEDDING_MENU_ANALYSIS_PROMPT },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: Buffer.from(imageBytes).toString('base64')
            }
          }
        ]
      }]
    });

    // Process the food analysis stream
    (async () => {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            await writer.write(
              encoder.encode(`data: ${JSON.stringify({ content: text, type: 'analysis' })}\n\n`)
            );
          }
        }
        
        await writer.write(encoder.encode('data: [DONE]\n\n'));
        await writer.close();
      } catch (error) {
        console.error('Streaming error:', error);
        await writer.abort(error);
      }
    })();

    // Return the streaming response
    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in POST handler:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        status: 'error',
        message: 'Invalid request format',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Support OPTIONS for CORS preflight
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
