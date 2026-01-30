'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import { User } from '@/lib/types'

export async function getUsers(): Promise<User[]> {
    const supabase = await createClient()
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('full_name', { ascending: true })

    if (error) {
        throw new Error(error.message)
    }

    return data || []
}

export async function getUserById(id: string): Promise<User | null> {
    const supabase = await createClient()
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        throw new Error('Unauthorized')
    }

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        return null
    }

    return data
}

export async function getEmployees(): Promise<User[]> {
    const supabase = await createClient()
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'employee')
        .order('full_name', { ascending: true })

    if (error) {
        throw new Error(error.message)
    }

    return data || []
}
