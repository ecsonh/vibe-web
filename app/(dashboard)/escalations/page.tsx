import EmptyState from '@/components/EmptyState'

export default async function EscalationsPage() {
    // Mock data for testing - showing empty state
    const escalations: any[] = []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Escalations
                </h1>
                <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                        {escalations.length} Open
                    </span>
                </div>
            </div>

            <EmptyState
                icon="escalations"
                title="No open escalations"
                description="All tasks are running smoothly. Escalations will appear here when employees need help."
            />
        </div>
    )
}
