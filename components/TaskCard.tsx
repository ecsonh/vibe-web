'use client'

import { Task } from '@/lib/types'
import { format } from 'date-fns'
import clsx from 'clsx'

interface TaskCardProps {
    task: Task
    onClick: () => void
}

const statusColors = {
    pending: 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300',
    in_progress: 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300',
    completed: 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300',
    blocked: 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300',
}

const priorityIcons = {
    low: '○',
    medium: '◐',
    high: '●',
    urgent: '⚠',
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
    return (
        <button
            onClick={onClick}
            aria-label={`View task: ${task.title}`}
            className={clsx(
                'w-full text-left p-2 rounded-lg border-l-4 mb-2 transition-all hover:shadow-md hover:scale-105',
                statusColors[task.status]
            )}
        >
            <div className="flex items-start justify-between mb-1">
                <span className="font-medium text-sm truncate flex-1">
                    {task.title}
                </span>
                <span className="text-xs ml-1" title={task.priority}>
                    {priorityIcons[task.priority]}
                </span>
            </div>
            <div className="text-xs opacity-75">
                {format(new Date(task.start_time), 'h:mm a')} - {format(new Date(task.end_time), 'h:mm a')}
            </div>
            {task.description && (
                <div className="text-xs mt-1 truncate opacity-60">
                    {task.description}
                </div>
            )}
        </button>
    )
}
