import { Task, User, Escalation } from '@/lib/types'

export function createSystemPrompt(currentUser: User): string {
    return `You are a helpful AI assistant for a task management system.

Current user: ${currentUser.full_name} (${currentUser.role})

Your role is to help users understand their tasks, schedules, and escalations.

CRITICAL RULES:
- ONLY use data provided in the context
- NEVER invent or hallucinate users, tasks, or data
- If you don't have information, say so clearly
- Keep responses concise and actionable
- Format responses in a clear, scannable way

You can:
- Summarize today's tasks
- List blocked or overdue tasks
- Explain escalations
- Provide task statistics
- Answer questions about the schedule

You CANNOT:
- Create or modify tasks (that comes in Phase 9)
- Access data not provided in context
- Make assumptions about future tasks`
}

export function createContextPrompt(data: {
    tasks: Task[]
    users: User[]
    escalations: Escalation[]
    currentUser: User
}): string {
    const { tasks, users, escalations, currentUser } = data

    const userMap = new Map(users.map(u => [u.id, u]))

    const tasksContext = tasks.map(task => {
        const assignedTo = task.assigned_to ? userMap.get(task.assigned_to)?.full_name : 'Unassigned'
        const createdBy = userMap.get(task.created_by)?.full_name || 'Unknown'

        return `- "${task.title}" (${task.status}, ${task.priority} priority)
  Assigned to: ${assignedTo}
  Created by: ${createdBy}
  Time: ${new Date(task.start_time).toLocaleString()} - ${new Date(task.end_time).toLocaleString()}
  ${task.description ? `Description: ${task.description}` : ''}
  ${task.notes ? `Notes: ${task.notes}` : ''}`
    }).join('\n\n')

    const escalationsContext = escalations.map(esc => {
        const escalatedBy = userMap.get(esc.escalated_by)?.full_name || 'Unknown'
        const escalatedTo = userMap.get(esc.escalated_to)?.full_name || 'Unknown'
        const task = tasks.find(t => t.id === esc.task_id)

        return `- Task: "${task?.title || 'Unknown'}"
  From: ${escalatedBy} → To: ${escalatedTo}
  Status: ${esc.status}
  Message: ${esc.message}
  Created: ${new Date(esc.created_at).toLocaleString()}`
    }).join('\n\n')

    return `CURRENT DATA CONTEXT:

USERS:
${users.map(u => `- ${u.full_name} (${u.role})`).join('\n')}

TASKS (${tasks.length} total):
${tasksContext || 'No tasks'}

ESCALATIONS (${escalations.length} total):
${escalationsContext || 'No escalations'}

Remember: Only reference this data. Do not invent additional information.`
}
