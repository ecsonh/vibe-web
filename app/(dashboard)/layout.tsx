import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Mock user for testing - auth disabled
    const user = {
        id: 'mock-user-1',
        email: 'manager@test.com',
        full_name: 'Test Manager',
        role: 'manager' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

    // const user = await getCurrentUser()
    // if (!user) {
    //   redirect('/login')
    // }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                Task Manager
                            </h1>
                            <div className="ml-10 flex items-baseline space-x-4">
                                <a
                                    href="/schedule"
                                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Schedule
                                </a>
                                <a
                                    href="/analytics"
                                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Analytics
                                </a>
                                {user.role === 'manager' && (
                                    <a
                                        href="/escalations"
                                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Escalations
                                    </a>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {user.full_name}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {user.role}
                            </span>
                            <span className="text-sm text-gray-400">
                                (Demo Mode)
                            </span>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    )
}
