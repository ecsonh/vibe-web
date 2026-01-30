'use client'

import { Task, User } from '@/lib/types'

interface EmployeeStatsCardProps {
    user: User
    tasks: Task[]
}

export default function EmployeeStatsCard({ user, tasks }: EmployeeStatsCardProps) {
    // Filter tasks for this user
    const userTasks = tasks.filter(t => t.assigned_to === user.id)

    // Calculate stats
    const totalTasks = userTasks.length
    const completedTasks = userTasks.filter(t => t.status === 'completed').length
    const inProgressTasks = userTasks.filter(t => t.status === 'in_progress').length
    const pendingTasks = userTasks.filter(t => t.status === 'pending').length
    const blockedTasks = userTasks.filter(t => t.status === 'blocked').length

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Calculate total hours
    const totalHours = userTasks.reduce((sum, task) => {
        const start = new Date(task.start_time)
        const end = new Date(task.end_time)
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        return sum + hours
    }, 0)

    const completedHours = userTasks
        .filter(t => t.status === 'completed')
        .reduce((sum, task) => {
            const start = new Date(task.start_time)
            const end = new Date(task.end_time)
            const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
            return sum + hours
        }, 0)

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold">
                    {user.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {user.full_name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
            </div>

            {/* Completion Rate */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Completion Rate
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {completionRate}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all"
                        style={{ width: `${completionRate}%` }}
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {totalTasks}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total Tasks</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {completedTasks}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {totalHours.toFixed(1)}h
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total Hours</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {completedHours.toFixed(1)}h
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Hours Done</div>
                </div>
            </div>

            {/* Status Breakdown */}
            <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Task Breakdown
                </h4>
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-gray-700 dark:text-gray-300">Completed</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{completedTasks}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-gray-700 dark:text-gray-300">In Progress</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{inProgressTasks}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <span className="text-gray-700 dark:text-gray-300">Pending</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{pendingTasks}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-gray-700 dark:text-gray-300">Blocked</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{blockedTasks}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
