'use client'

import { Task, User } from '@/lib/types'
import { format } from 'date-fns'
import { useEffect } from 'react'

interface TaskDetailModalProps {
    task: Task
    users: User[]
    currentUser: User
    onClose: () => void
    onDelete: (id: string) => void
    onUpdate: (id: string, updates: Partial<Task>) => void
}

export default function TaskDetailModal({
    task,
    users,
    currentUser,
    onClose,
    onDelete,
    onUpdate,
}: TaskDetailModalProps) {
    const assignedUser = users.find((u) => u.id === task.assigned_to)

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [onClose])

    const toggleCompletion = () => {
        const newStatus = task.status === 'completed' ? 'in_progress' : 'completed'
        onUpdate(task.id, { status: newStatus })
    }

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this task?')) {
            onDelete(task.id)
            onClose()
        }
    }

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        blocked: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    }

    const priorityColors = {
        low: 'text-gray-600 dark:text-gray-400',
        medium: 'text-blue-600 dark:text-blue-400',
        high: 'text-orange-600 dark:text-orange-400',
        urgent: 'text-red-600 dark:text-red-400',
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {task.title}
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                                {task.status.replace('_', ' ')}
                            </span>
                            <span className={`text-sm font-medium ${priorityColors[task.priority]}`}>
                                {task.priority.toUpperCase()} Priority
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </h3>
                        <p className="text-gray-900 dark:text-white">
                            {task.description || 'No description provided'}
                        </p>
                    </div>

                    {/* Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Start Time
                            </h3>
                            <p className="text-gray-900 dark:text-white">
                                {format(new Date(task.start_time), 'MMM d, yyyy h:mm a')}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                End Time
                            </h3>
                            <p className="text-gray-900 dark:text-white">
                                {format(new Date(task.end_time), 'MMM d, yyyy h:mm a')}
                            </p>
                        </div>
                    </div>

                    {/* Assigned To */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Assigned To
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                {assignedUser?.full_name.charAt(0) || '?'}
                            </div>
                            <span className="text-gray-900 dark:text-white">
                                {assignedUser?.full_name || 'Unknown'}
                            </span>
                        </div>
                    </div>

                    {/* Notes */}
                    {task.notes && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Notes
                            </h3>
                            <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                {task.notes}
                            </p>
                        </div>
                    )}

                    {/* Completion Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                Mark as Completed
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Toggle task completion status
                            </p>
                        </div>
                        <button
                            onClick={toggleCompletion}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${task.status === 'completed' ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${task.status === 'completed' ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                        Delete Task
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
