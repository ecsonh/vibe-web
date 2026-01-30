'use client'

import { Task, User } from '@/lib/types'
import TaskCard from './TaskCard'
import { format, addHours, startOfDay } from 'date-fns'

interface ScheduleGridProps {
    tasks: Task[]
    users: User[]
    selectedDate: string
    currentUser: User
    onTaskClick?: (task: Task) => void
}

export default function ScheduleGrid({
    tasks,
    users,
    selectedDate,
    currentUser,
    onTaskClick,
}: ScheduleGridProps) {
    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const date = startOfDay(new Date(selectedDate))
        return addHours(date, i)
    })

    const displayUsers = currentUser.role === 'manager'
        ? users
        : users.filter(u => u.id === currentUser.id)

    const getTasksForSlot = (userId: string, hour: Date) => {
        return tasks.filter(task => {
            if (task.assigned_to !== userId) return false

            const taskStart = new Date(task.start_time)
            const taskHour = taskStart.getHours()

            return taskHour === hour.getHours()
        })
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="grid grid-cols-[200px_repeat(24,minmax(80px,1fr))] gap-px bg-gray-200 dark:bg-gray-700">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 font-semibold text-gray-700 dark:text-gray-300 sticky left-0 z-10">
                            Employee
                        </div>
                        {timeSlots.map((time) => (
                            <div
                                key={time.toISOString()}
                                className="bg-gray-50 dark:bg-gray-800 p-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                {format(time, 'ha')}
                            </div>
                        ))}

                        {displayUsers.map((user) => (
                            <>
                                <div
                                    key={`user-${user.id}`}
                                    className="bg-white dark:bg-gray-800 p-4 font-medium text-gray-900 dark:text-white sticky left-0 z-10 border-r border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                                            {user.full_name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="truncate">{user.full_name}</span>
                                    </div>
                                </div>
                                {timeSlots.map((time) => {
                                    const slotTasks = getTasksForSlot(user.id, time)
                                    return (
                                        <div
                                            key={`${user.id}-${time.toISOString()}`}
                                            className="bg-white dark:bg-gray-800 p-2 min-h-[80px] hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                                        >
                                            {slotTasks.map((task) => (
                                                <TaskCard
                                                    key={task.id}
                                                    task={task}
                                                    onClick={() => onTaskClick?.(task)}
                                                />
                                            ))}
                                        </div>
                                    )
                                })}
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
