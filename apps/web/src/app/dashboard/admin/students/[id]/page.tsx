"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiClient } from '@/lib/api'
import { Database } from '@/types/database.types'
import { ArrowLeft, User, Trash2, Plus } from 'lucide-react'

type Profile = Database['public']['Tables']['profiles']['Row']
type Enrollment = Database['public']['Tables']['course_enrollments']['Row'] & {
    courses: { title: string }
}
type Course = Database['public']['Tables']['courses']['Row']

export default function StudentDetailPage() {
    const params = useParams()
    const router = useRouter()
    const studentId = params.id as string

    const [student, setStudent] = useState<Profile | null>(null)
    const [enrollments, setEnrollments] = useState<Enrollment[]>([])
    const [availableCourses, setAvailableCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)
    const [selectedCourseId, setSelectedCourseId] = useState('')

    useEffect(() => {
        fetchData()
    }, [studentId])

    useEffect(() => {
        if (isEnrollModalOpen && availableCourses.length === 0) {
            fetchCourses()
        }
    }, [isEnrollModalOpen])

    const fetchData = async () => {
        setLoading(true)
        try {
            const data = await apiClient(`/api/students/${studentId}`)
            setStudent({ ...data, enrollments: undefined }) // Separate profile
            setEnrollments(data.enrollments)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCourses = async () => {
        try {
            const data = await apiClient('/api/courses')
            // Filter out already enrolled courses
            const enrolledIds = new Set(enrollments.map(e => e.course_id))
            setAvailableCourses(data.filter((c: Course) => !enrolledIds.has(c.id)))
        } catch (error) {
            console.error(error)
        }
    }

    const handleEnroll = async () => {
        if (!selectedCourseId) return

        try {
            await apiClient('/api/admin/enrollments', {
                method: 'POST',
                body: JSON.stringify({
                    studentId,
                    courseId: selectedCourseId
                })
            })
            setIsEnrollModalOpen(false)
            setSelectedCourseId('')
            fetchData() // Refresh list
        } catch (error) {
            console.error(error)
            alert('Failed to enroll student')
        }
    }

    const handleUnenroll = async (enrollmentId: string) => {
        if (!confirm('Are you sure you want to remove this enrollment? Status and progress may be lost.')) return

        try {
            await apiClient(`/api/admin/enrollments/${enrollmentId}`, {
                method: 'DELETE'
            })
            fetchData()
        } catch (error) {
            console.error(error)
            alert('Failed to unenroll')
        }
    }

    if (loading) return <div>Loading...</div>
    if (!student) return <div>Student not found</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <Link href="/dashboard/admin/students" className="mr-4 text-gray-500 hover:text-gray-700">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6 flex items-start space-x-6">
                    <div className="h-20 w-20 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                        {student.avatar_url ? (
                            <img src={student.avatar_url} alt="" className="h-20 w-20 rounded-full" />
                        ) : (
                            <User className="h-10 w-10 text-gray-400" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{student.full_name}</h2>
                        <p className="text-sm text-gray-500">{student.email}</p>
                        <p className="text-xs text-gray-400 mt-1">ID: {student.id}</p>
                        <p className="text-xs text-gray-400">Joined: {new Date(student.created_at || '').toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Enrolled Courses</h3>
                    <button
                        onClick={() => setIsEnrollModalOpen(true)}
                        className="flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Enroll in Course
                    </button>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul role="list" className="divide-y divide-gray-200">
                        {enrollments.length === 0 ? (
                            <li className="px-4 py-4 text-center text-gray-500 text-sm">Not enrolled in any courses.</li>
                        ) : (
                            enrollments.map((enrollment) => (
                                <li key={enrollment.id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-indigo-600 truncate">{enrollment.courses?.title}</p>
                                        <p className="text-xs text-gray-500">Enrolled on: {new Date(enrollment.enrolled_at || '').toLocaleDateString()}</p>
                                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 mt-1">
                                            {enrollment.status}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleUnenroll(enrollment.id)}
                                        className="text-red-600 hover:text-red-900"
                                        title="Revoke Enrollment"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>

            {/* Enroll Modal */}
            {isEnrollModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Enroll in Course</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
                            <select
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                            >
                                <option value="">Select a course...</option>
                                {availableCourses.map(c => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsEnrollModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEnroll}
                                disabled={!selectedCourseId}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
                            >
                                Enroll Student
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
