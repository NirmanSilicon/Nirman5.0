import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { condition } = await request.json()

    if (!condition) {
      return NextResponse.json({ error: 'Condition is required' }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `You are a medical assistant. Generate a list of 10 relevant yes/no questions to diagnose the condition: "${condition.replace(/-/g, ' ')}". Provide the questions as a numbered list.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const parsedQuestions = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line, index) => {
        // Remove numbering if present
        const questionText = line.replace(/^\d+\.?\s*/, '')
        return { id: index + 1, text: questionText, answer: '' }
      })

    return NextResponse.json({ questions: parsedQuestions })
  } catch (error) {
    console.error('Error generating questions:', error)
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 })
  }
}
