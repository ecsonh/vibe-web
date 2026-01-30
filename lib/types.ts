export type UserRole = 'manager' | 'employee'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  created_at: string
  updated_at: string
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  assigned_to: string | null
  created_by: string
  start_time: string
  end_time: string
  notes: string | null
  created_at: string
  updated_at: string
}

export type EscalationStatus = 'open' | 'resolved'

export interface Escalation {
  id: string
  task_id: string
  escalated_by: string
  escalated_to: string
  message: string
  status: EscalationStatus
  resolved_by: string | null
  resolved_at: string | null
  created_at: string
  updated_at: string
}
