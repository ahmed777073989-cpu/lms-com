"use client"

import { useState } from 'react'
import { CheckCircle, Play } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { Database } from '@/types/database.types'
import { QuizPlayer } from '../quiz/QuizPlayer'
import { cn } from '@/lib/utils'
import Markdown from 'react-markdown'

type Lesson = Database['public']['Tables']['lessons']['Row']

interface LessonViewerProps {
    lesson: Lesson
    isCompleted: boolean
    onComplete: (status: boolean) => void
}

export function LessonViewer({ lesson, isCompleted, onComplete }: LessonViewerProps) {
    const [loading, setLoading] = useState(false)

    const toggleComplete = async () => {
        setLoading(true)
        try {
            const newStatus = !isCompleted
            await apiClient(`/api/lessons/${lesson.id}/complete`, {
                method: 'POST',
                body: JSON.stringify({ is_completed: newStatus })
            })
            onComplete(newStatus)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white border rounded-lg shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{lesson.title}</h1>

            <div className="prose prose-indigo max-w-none mb-8">
                {lesson.type === 'video' && lesson.video_url && (
                    <div className="aspect-video bg-black rounded-lg mb-6 flex items-center justify-center text-white">
                        {/* Placeholder for video player logic */}
                        <div className="text-center">
                            <p className="mb-2">Video Player Placeholder</p>
                            <a href={lesson.video_url} target="_blank" rel="noopener noreferrer" className="underline text-indigo-400">
                                {lesson.video_url}
                            </a>
                        </div>
                    </div>
                )}

                {lesson.type === 'text' && lesson.content && (
                    <Markdown>{lesson.content}</Markdown>
                )}

                {lesson.type === 'quiz' && (
                    <QuizPlayer
                        content={lesson.content || '{}'}
                        onComplete={(score, passed) => toggleComplete()}
                    />
                )}
            </div>

            {lesson.type !== 'quiz' && (
                <div className="border-t pt-6 flex justify-end">
                    <button
                        onClick={toggleComplete}
                        disabled={loading}
                        className={cn(
                            "flex items-center px-6 py-3 rounded-md font-medium text-white transition-colors",
                            isCompleted
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-indigo-600 hover:bg-indigo-700",
                            loading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isCompleted ? (
                            <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Completed
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5 mr-2" />
                                Mark as Complete
                            </>
                        )}
                    </button>
                </div>
        </div>
    )
}
