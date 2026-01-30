'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import { Escalation } from '@/lib/types'
import { revalidatePath } from 'next/cache'
import { updateTask } from './tasks'

export async function getEscalations(): Promise<Escalation[]> {
    const supabase = await createClient()
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const { data, error } = await supabase
        .from('escalations')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        throw new Error(error.message)
    }

    return data || []
}

export async function getOpenEscalations(): Promise<Escalation[]> {
    const supabase = await createClient()
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const { data, error } = await supabase
        .from('escalations')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })

    if (error) {
        throw new Error(error.message)
    }

    return data || []
}

export async function createEscalation(
    taskId: string,
    escalatedTo: string,
    message: string
): Promise<Escalation> {
    const supabase = await createClient()
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const { data, error } = await supabase
        .from('escalations')
        .insert({
            task_id: taskId,
            escalated_by: user.id,
            escalated_to: escalatedTo,
            message,
            status: 'open',
        })
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    await updateTask(taskId, { status: 'blocked' })

    revalidatePath('/schedule')
    revalidatePath('/escalations')

    return data
}

export async function resolveEscalation(
    escalationId: string
): Promise<Escalation> {
    const supabase = await createClient()
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    if (user.role !== 'manager') {
        throw new Error('Only managers can resolve escalations')
    }

    const { data, error } = await supabase
        .from('escalations')
        .update({
            status: 'resolved',
            resolved_by: user.id,
            resolved_at: new Date().toISOString(),
        })
        .eq('id', escalationId)
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/escalations')

    return data
}
