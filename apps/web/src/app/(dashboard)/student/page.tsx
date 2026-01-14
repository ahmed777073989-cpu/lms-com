export default function StudentDashboard() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">My Courses</h2>
                </div>
                <div className="p-6">
                    <p className="text-gray-500">You are not enrolled in any courses yet.</p>
                    <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                        Browse Courses
                    </button>
                </div>
            </div>
        </div>
    )
}
