import axios from 'axios'
import NodeCache from 'node-cache'
import dotenv from 'dotenv'

dotenv.config()

const cache = new NodeCache({ stdTTL: 3600 }) // Cache for 1 hour

interface MistralRequest {
  model: string
  messages: Array<{
    role: string
    content: string
  }>
  max_tokens: number
  temperature: number
}

interface MistralResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions'
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY

if (!MISTRAL_API_KEY) {
  console.warn('⚠️  MISTRAL_API_KEY not found in environment variables')
}

const tonePrompts: Record<string, string> = {
  formal: 'Transform this text to have a formal, professional tone suitable for business communication:',
  casual: 'Transform this text to have a casual, conversational tone:',
  friendly: 'Transform this text to have a warm, friendly, and approachable tone:',
  academic: 'Transform this text to have an academic, scholarly tone suitable for research or educational content:',
  creative: 'Transform this text to have a creative, imaginative, and expressive tone:',
  technical: 'Transform this text to have a technical, precise, and detailed tone:',
  persuasive: 'Transform this text to have a persuasive, convincing, and compelling tone:',
  humorous: 'Transform this text to have a witty, entertaining, and humorous tone:',
  empathetic: 'Transform this text to have an understanding, caring, and empathetic tone:'
}

export async function transformTone(text: string, tone: string): Promise<string> {
  if (!MISTRAL_API_KEY) {
    throw new Error('Mistral API key not configured')
  }

  // Check cache first
  const cacheKey = `${text}:${tone}`
  const cachedResult = cache.get<string>(cacheKey)
  if (cachedResult) {
    return cachedResult
  }

  const prompt = tonePrompts[tone]
  if (!prompt) {
    throw new Error(`Invalid tone: ${tone}`)
  }

  const requestBody: MistralRequest = {
    model: 'mistral-small-latest',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that transforms text to different tones while preserving the core meaning and content.'
      },
      {
        role: 'user',
        content: `${prompt}\n\nText: "${text}"\n\nPlease provide only the transformed text without any additional explanations or formatting.`
      }
    ],
    max_tokens: 2000,
    temperature: 0.7
  }

  try {
    const response = await axios.post<MistralResponse>(
      MISTRAL_API_URL,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    )

    const transformedText = response.data.choices[0]?.message?.content?.trim()
    
    if (!transformedText) {
      throw new Error('No response from Mistral AI')
    }

    // Cache the result
    cache.set(cacheKey, transformedText)

    return transformedText
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid Mistral API key')
      }
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.')
      }
      if (error.response?.status === 400) {
        throw new Error('Invalid request to Mistral AI')
      }
      throw new Error(`Mistral API error: ${error.message}`)
    }
    throw error
  }
}
