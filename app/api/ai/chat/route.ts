import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getCurrentUser } from '@/lib/auth'
import { getTasks } from '@/app/actions/tasks'
import { getUsers } from '@/app/actions/users'
import { getEscalations } from '@/app/actions/escalations'
import { createSystemPrompt, createContextPrompt } from '@/lib/ai/prompts'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { message } = await request.json()

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        const [tasks, users, escalations] = await Promise.all([
            getTasks(),
            getUsers(),
            getEscalations(),
        ])

        const systemPrompt = createSystemPrompt(user)
        const contextPrompt = createContextPrompt({ tasks, users, escalations, currentUser: user })

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'system', content: contextPrompt },
                { role: 'user', content: message },
            ],
            temperature: 0.7,
            max_tokens: 500,
        })

        const response = completion.choices[0]?.message?.content || 'No response generated'

        return NextResponse.json({ response })
    } catch (error) {
        console.error('AI chat error:', error)
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        )
    }
}
