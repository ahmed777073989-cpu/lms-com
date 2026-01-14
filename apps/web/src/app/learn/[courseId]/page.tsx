"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiClient } from '@/lib/api'
import { LessonViewer } from '@/components/player/LessonViewer'
import { Database } from '@/types/database.types'
import { CheckCircle, Circle, Menu, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

type Module = Database['public']['Tables']['modules']['Row'] & {
    lessons: Database['public']['Tables']['lessons']['Row'][]
}

export default function CoursePlayerPage() {
    const params = useParams()
    const router = useRouter()
    const courseId = params.courseId as string

    const [modules, setModules] = useState<Module[]>([])
    const [progress, setProgress] = useState<Record<string, any>>({})
    const [activeLesson, setActiveLesson] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)
    const [enrolling, setEnrolling] = useState(true)

    useEffect(() => {
        initPlayer()
    }, [courseId])

    const initPlayer = async () => {
        try {
            // 1. Enroll / Check Enrollment
            await apiClient(`/api/courses/${courseId}/enroll`, { method: 'POST' })
            setEnrolling(false)

            // 2. Fetch Curriculum
            const curriculum = await apiClient(`/api/courses/${courseId}/modules`)
            setModules(curriculum)

            // 3. Fetch Progress
            const prog = await apiClient(`/api/courses/${courseId}/progress`)
            setProgress(prog)

            // 4. Set Initial Lesson (First one found)
            if (curriculum.length > 0 && curriculum[0].lessons.length > 0) {
                setActiveLesson(curriculum[0].lessons[0])
            }
        } catch (error) {
            console.error('Failed to init player', error)
            // Redirect if fails (e.g. not authorized)
            // router.push('/dashboard')
        } finally {
            setLoading(false)
        }
    }

    const handleLessonComplete = (status: boolean) => {
        if (!activeLesson) return
        setProgress(prev => ({
            ...prev,
            [activeLesson.id]: { is_completed: status }
        }))
    }

    if (loading || enrolling) {
        return <div className="flex h-screen items-center justify-center">Loading your classroom...</div>
    }

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <div className="w-80 flex-col border-r bg-gray-50 overflow-y-auto hidden md:flex">
                <div className="p-4 border-b flex items-center">
                    <Link href="/dashboard/student" className="text-sm text-gray-500 hover:text-gray-900 flex items-center">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Dashboard
                    </Link>
                </div>
                <div className="flex-1 p-4 space-y-6">
                    {modules.map(module => (
                        <div key={module.id}>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{module.title}</h4>
                            <div className="space-y-1">
                                {module.lessons?.map(lesson => {
                                    const isDone = progress[lesson.id]?.is_completed
                                    const isActive = activeLesson?.id === lesson.id
                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => setActiveLesson(lesson)}
                                            className={cn(
                                                "w-full flex items-center text-left py-2 px-3 rounded-md text-sm transition-colors",
                                                isActive
                                                    ? "bg-indigo-50 text-indigo-700 font-medium"
                                                    : "text-gray-700 hover:bg-gray-100"
                                            )}
                                        >
                                            <span className="mr-3 text-gray-400">
                                                {isDone ? (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Circle className="w-4 h-4" />
                                                )}
                                            </span>
                                            {lesson.title}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-12">
                    {activeLesson ? (
                        <LessonViewer
                            key={activeLesson.id}
                            lesson={activeLesson}
                            isCompleted={!!progress[activeLesson.id]?.is_completed}
                            onComplete={handleLessonComplete}
                        />
                    ) : (
                        <div className="text-center text-gray-500 mt-20">
                            Select a lesson to start learning.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
