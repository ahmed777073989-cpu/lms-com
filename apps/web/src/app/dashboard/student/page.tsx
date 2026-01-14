import { PlayCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export default function StudentDashboard() {
    const courses = [
        { id: 1, title: 'Introduction to React', progress: 75, nextLesson: 'useEffect Hook', image: 'bg-blue-500' },
        { id: 2, title: 'Advanced TypeScript', progress: 30, nextLesson: 'Generics', image: 'bg-yellow-500' },
        { id: 3, title: 'UI/UX Design Fundamentals', progress: 0, nextLesson: 'Start Course', image: 'bg-purple-500' },
    ]

    return (
        <div className="space-y-6">
            <div className="lg:flex lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Welcome back, Student!
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">Pick up where you left off.</p>
                </div>
            </div>

            <h3 className="text-lg font-medium leading-6 text-gray-900">My Courses</h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <div key={course.id} className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md">
                        <div className={`h-48 w-full ${course.image} flex items-center justify-center`}>
                            {/* Placeholder for Course Image */}
                            <span className="text-white font-bold opacity-50">{course.title} Cover</span>
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                            <div className="flex-1">
                                <h3 className="mt-2 text-xl font-semibold text-gray-900">
                                    {course.title}
                                </h3>
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm font-medium text-gray-900">
                                        <span>Progress</span>
                                        <span>{course.progress}%</span>
                                    </div>
                                    <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                                        <div
                                            className="h-2 rounded-full bg-indigo-600"
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Link
                                href={`/learn/${course.id}`}
                                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                            >
                                {course.progress > 0 ? (
                                    <>
                                        <PlayCircle className="mr-2 h-4 w-4" />
                                        Continue: {course.nextLesson}
                                    </>
                                ) : (
                                    'Start Course'
                                )}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
}
