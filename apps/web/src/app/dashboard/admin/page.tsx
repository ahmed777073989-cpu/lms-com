import { Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
    const stats = [
        { name: 'Total Users', value: '71,897', icon: Users, change: '12%', changeType: 'increase' },
        { name: 'Total Courses', value: '58', icon: BookOpen, change: '2.1%', changeType: 'increase' },
        { name: 'Total Revenue', value: '$24,500', icon: DollarSign, change: '4.05%', changeType: 'increase' },
        { name: 'Active Students', value: '1,200', icon: TrendingUp, change: '1.2%', changeType: 'decrease' },
    ]

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Admin Overview
            </h2>

            {/* Stats Grid */}
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => {
                    const Icon = item.icon
                    return (
                        <div key={item.name} className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 shadow sm:px-6 sm:pt-6">
                            <dt>
                                <div className="absolute rounded-md bg-indigo-500 p-3">
                                    <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                            </dt>
                            <dd className="ml-16 flex items-baseline pb-1 sm:pb-7">
                                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                                <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                    {/* Mocking positive change */}
                                    <span className="sr-only">Increased by</span>
                                    {item.change}
                                </p>
                            </dd>
                        </div>
                    )
                })}
            </dl>

            {/* Activity / Charts Placeholder */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg bg-white shadow">
                    <div className="p-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Registrations</h3>
                        <div className="mt-4 h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded">
                            <span className="text-gray-400">Chart Placeholder</span>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg bg-white shadow">
                    <div className="p-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Revenue Overview</h3>
                        <div className="mt-4 h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded">
                            <span className="text-gray-400">Chart Placeholder</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
