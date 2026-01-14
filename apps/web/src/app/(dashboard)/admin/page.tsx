import Link from 'next/link'

export default function AdminDashboard() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="mb-8 flex space-x-4">
                <Link href="/admin/courses" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    Manage Courses
                </Link>
                <Link href="/admin/students" className="px-4 py-2 bg-white border text-gray-700 rounded hover:bg-gray-50">
                    Manage Students
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                    <p className="text-4xl font-bold text-indigo-600 mt-2">1,234</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold text-gray-700">Active Courses</h3>
                    <p className="text-4xl font-bold text-green-600 mt-2">56</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
                    <p className="text-4xl font-bold text-blue-600 mt-2">$45k</p>
                </div>
            </div>
        </div>
    )
}
