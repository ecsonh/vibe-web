import { createClient } from '@/lib/supabase/server'
import { User, UserRole } from '@/lib/types'

export async function getCurrentUser(): Promise<User | null> {
    const supabase = await createClient()

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

    if (authError || !authUser) {
        return null
    }

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

    if (error || !user) {
        return null
    }

    return user
}

export async function getUserRole(): Promise<UserRole | null> {
    const user = await getCurrentUser()
    return user?.role || null
}

export async function isManager(): Promise<boolean> {
    const role = await getUserRole()
    return role === 'manager'
}

export async function isEmployee(): Promise<boolean> {
    const role = await getUserRole()
    return role === 'employee'
}

export async function requireAuth() {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error('Unauthorized')
    }
    return user
}

export async function requireManager() {
    const user = await requireAuth()
    if (user.role !== 'manager') {
        throw new Error('Manager role required')
    }
    return user
}
