'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import { canCreateTask, canEditTask, canDeleteTask } from '@/lib/permissions'
import { Task, TaskStatus, TaskPriority } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function getTasks(): Promise<Task[]> {
    const supabase = await createClient()
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('start_time', { ascending: true })

    if (error) {
        throw new Error(error.message)
    }

    return data || []
}

export async function getTasksByDate(date: string): Promise<Task[]> {
    const supabase = await createClient()
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString())
        .order('start_time', { ascending: true })

    if (error) {
        throw new Error(error.message)
    }

    return data || []
}

export async function getTaskById(id: string): Promise<Task | null> {
    const supabase = await createClient()
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        return null
    }

    return data
}

export async function createTask(taskData: {
    title: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
    assigned_to?: string
    start_time: string
    end_time: string
    notes?: string
}): Promise<Task> {
    const supabase = await createClient()
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    if (!canCreateTask(user)) {
        throw new Error('Only managers can create tasks')
    }

    const { data, error } = await supabase
        .from('tasks')
        .insert({
            ...taskData,
            created_by: user.id,
            status: taskData.status || 'pending',
            priority: taskData.priority || 'medium',
        })
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/schedule')
    return data
}

export async function updateTask(
    id: string,
    updates: Partial<{
        title: string
        description: string | null
        status: TaskStatus
        priority: TaskPriority
        assigned_to: string | null
        start_time: string
        end_time: string
        notes: string | null
    }>
): Promise<Task> {
    const supabase = await createClient()
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const task = await getTaskById(id)
    if (!task) {
        throw new Error('Task not found')
    }

    if (!canEditTask(user, task)) {
        throw new Error('You do not have permission to edit this task')
    }

    if (user.role === 'employee' && updates.assigned_to !== undefined) {
        delete updates.assigned_to
    }

    const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/schedule')
    return data
}

export async function deleteTask(id: string): Promise<void> {
    const supabase = await createClient()
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    if (!canDeleteTask(user)) {
        throw new Error('Only managers can delete tasks')
    }

    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/schedule')
}

export async function updateTaskStatus(
    id: string,
    status: TaskStatus
): Promise<Task> {
    return updateTask(id, { status })
}

export async function assignTask(
    id: string,
    assignedTo: string | null
): Promise<Task> {
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    if (user.role !== 'manager') {
        throw new Error('Only managers can assign tasks')
    }

    return updateTask(id, { assigned_to: assignedTo })
}
