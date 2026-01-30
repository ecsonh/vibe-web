import { User, Task } from '@/lib/types'

export function canCreateTask(user: User): boolean {
    return user.role === 'manager'
}

export function canEditTask(user: User, task: Task): boolean {
    if (user.role === 'manager') {
        return true
    }
    return task.assigned_to === user.id
}

export function canDeleteTask(user: User): boolean {
    return user.role === 'manager'
}

export function canAssignTask(user: User): boolean {
    return user.role === 'manager'
}

export function canViewAllTasks(user: User): boolean {
    return user.role === 'manager'
}
