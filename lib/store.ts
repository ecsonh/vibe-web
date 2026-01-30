'use client'

import { create } from 'zustand'
import { Task } from './types'
import { format } from 'date-fns'

interface TaskStore {
    tasks: Task[]
    setTasks: (tasks: Task[]) => void
    addTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void
    updateTask: (id: string, updates: Partial<Task>) => void
    deleteTask: (id: string) => void
    getTasksByDate: (date: string) => Task[]
    getTasksByEmployee: (employeeId: string) => Task[]
}

export const useTaskStore = create<TaskStore>((set, get) => ({
    tasks: [],

    setTasks: (tasks) => set({ tasks }),

    addTask: (taskData) => {
        const newTask: Task = {
            ...taskData,
            id: `task-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        set((state) => ({ tasks: [...state.tasks, newTask] }))
    },

    updateTask: (id, updates) => {
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === id
                    ? { ...task, ...updates, updated_at: new Date().toISOString() }
                    : task
            ),
        }))
    },

    deleteTask: (id) => {
        set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
        }))
    },

    getTasksByDate: (date) => {
        return get().tasks.filter((task) => {
            try {
                // Validate task has start_time
                if (!task.start_time) return false

                // Parse and validate date
                const taskStartDate = new Date(task.start_time)

                // Check if date is valid
                if (isNaN(taskStartDate.getTime())) return false

                const taskDate = format(taskStartDate, 'yyyy-MM-dd')
                return taskDate === date
            } catch (error) {
                // If date parsing fails, exclude this task
                console.warn('Invalid date in task:', task.id, error)
                return false
            }
        })
    },

    getTasksByEmployee: (employeeId) => {
        return get().tasks.filter((task) => {
            try {
                return task.assigned_to === employeeId
            } catch (error) {
                console.warn('Error filtering task by employee:', task?.id, error)
                return false
            }
        })
    },
}))
