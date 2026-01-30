'use client'

import { useTaskStore } from '@/lib/store'
import EmployeeStatsCard from '@/components/EmployeeStatsCard'
import { useEffect } from 'react'
import { format } from 'date-fns'

export default function AnalyticsPage() {
    const { tasks, setTasks } = useTaskStore()

    const users = [
        {
            id: 'user-1',
            email: 'john@test.com',
            full_name: 'John Doe',
            role: 'employee' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: 'user-2',
            email: 'jane@test.com',
            full_name: 'Jane Smith',
            role: 'employee' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: 'user-3',
            email: 'bob@test.com',
            full_name: 'Bob Johnson',
            role: 'employee' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ]

    // Initialize tasks if empty
    useEffect(() => {
        if (tasks.length === 0) {
            const selectedDate = format(new Date(), 'yyyy-MM-dd')
            const initialTasks = [
                {
                    id: 'task-1',
                    title: 'Morning Team Meeting',
                    description: 'Daily standup and planning',
                    status: 'completed' as const,
                    priority: 'high' as const,
                    assigned_to: 'user-1',
                    created_by: 'mock-user-1',
                    start_time: `${selectedDate}T09:00:00`,
                    end_time: `${selectedDate}T10:00:00`,
                    notes: 'Discuss project timeline',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    id: 'task-2',
                    title: 'Client Presentation',
                    description: 'Present Q1 results to stakeholders',
                    status: 'in_progress' as const,
                    priority: 'urgent' as const,
                    assigned_to: 'user-2',
                    created_by: 'mock-user-1',
                    start_time: `${selectedDate}T11:00:00`,
                    end_time: `${selectedDate}T12:30:00`,
                    notes: 'Prepare slides and demo',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    id: 'task-3',
                    title: 'Code Review',
                    description: 'Review pull requests from team',
                    status: 'pending' as const,
                    priority: 'medium' as const,
                    assigned_to: 'user-1',
                    created_by: 'mock-user-1',
                    start_time: `${selectedDate}T14:00:00`,
                    end_time: `${selectedDate}T15:00:00`,
                    notes: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    id: 'task-4',
                    title: 'Database Optimization',
                    description: 'Optimize slow queries',
                    status: 'blocked' as const,
                    priority: 'high' as const,
                    assigned_to: 'user-3',
                    created_by: 'mock-user-1',
                    start_time: `${selectedDate}T10:00:00`,
                    end_time: `${selectedDate}T12:00:00`,
                    notes: 'Waiting for DBA access',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    id: 'task-5',
                    title: 'Documentation Update',
                    description: 'Update API documentation',
                    status: 'in_progress' as const,
                    priority: 'low' as const,
                    assigned_to: 'user-2',
                    created_by: 'mock-user-1',
                    start_time: `${selectedDate}T15:00:00`,
                    end_time: `${selectedDate}T17:00:00`,
                    notes: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ]
            setTasks(initialTasks)
        }
    }, [tasks.length, setTasks])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Employee Analytics
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Track completion rates and time spent per employee
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <EmployeeStatsCard key={user.id} user={user} tasks={tasks} />
                ))}
            </div>
        </div>
    )
}
