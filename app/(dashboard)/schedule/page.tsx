'use client'

import ScheduleGrid from '@/components/ScheduleGrid'
import EmptyState from '@/components/EmptyState'
import TaskDetailModal from '@/components/TaskDetailModal'
import TaskFormModal from '@/components/TaskFormModal'
import AddTaskButton from '@/components/AddTaskButton'
import { format } from 'date-fns'
import { use, useEffect, useState } from 'react'
import { useTaskStore } from '@/lib/store'

export default function SchedulePage({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>
}) {
    const params = use(searchParams)
    const selectedDate = params.date || format(new Date(), 'yyyy-MM-dd')

    // Zustand store
    const { tasks, setTasks, addTask, updateTask, deleteTask, getTasksByDate } = useTaskStore()

    // Modal states
    const [selectedTask, setSelectedTask] = useState<any>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)

    // Mock data
    const user = {
        id: 'mock-user-1',
        email: 'manager@test.com',
        full_name: 'Test Manager',
        role: 'manager' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

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

    // Initialize tasks on mount
    useEffect(() => {
        if (tasks.length === 0) {
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
    }, [tasks.length, selectedDate, setTasks])

    const displayTasks = getTasksByDate(selectedDate)

    // Sync selectedTask with store updates
    useEffect(() => {
        if (selectedTask) {
            const updatedTask = tasks.find(t => t.id === selectedTask.id)
            if (updatedTask && JSON.stringify(updatedTask) !== JSON.stringify(selectedTask)) {
                setSelectedTask(updatedTask)
            }
        }
    }, [tasks, selectedTask])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Schedule
                </h1>
                <div className="flex items-center space-x-4">
                    <input
                        type="date"
                        defaultValue={selectedDate}
                        onChange={(e) => {
                            window.location.href = `/schedule?date=${e.target.value}`
                        }}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            {displayTasks.length === 0 ? (
                <EmptyState
                    title="No tasks scheduled"
                    description="No tasks are scheduled for this date. Click the + button to create a task."
                />
            ) : (
                <ScheduleGrid
                    tasks={displayTasks}
                    users={users}
                    selectedDate={selectedDate}
                    currentUser={user}
                    onTaskClick={setSelectedTask}
                />
            )}

            {/* Add Task Button */}
            <AddTaskButton onClick={() => setShowCreateModal(true)} />

            {/* Task Detail Modal */}
            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    users={users}
                    currentUser={user}
                    onClose={() => setSelectedTask(null)}
                    onDelete={(id) => {
                        deleteTask(id)
                        setSelectedTask(null)
                    }}
                    onUpdate={(id, updates) => {
                        updateTask(id, updates)
                        // Update local selectedTask immediately for UI feedback
                        setSelectedTask({ ...selectedTask, ...updates })
                    }}
                />
            )}

            {/* Task Creation Modal */}
            {showCreateModal && (
                <TaskFormModal
                    users={users}
                    defaultDate={selectedDate}
                    onClose={() => setShowCreateModal(false)}
                    onCreate={addTask}
                />
            )}
        </div>
    )
}
