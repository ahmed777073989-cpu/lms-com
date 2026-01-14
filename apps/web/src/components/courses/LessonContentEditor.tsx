"use client"

import { useState } from 'react'
import { apiClient } from '@/lib/api'
import { Database } from '@/types/database.types'
import { X, Plus, Trash } from 'lucide-react'
import { QuizBuilder } from '../quiz/QuizBuilder'

type Lesson = Database['public']['Tables']['lessons']['Row']

interface LessonContentEditorProps {
    lesson: Lesson
    onClose: () => void
    onUpdate: (updatedLesson: Lesson) => void
}

export function LessonContentEditor({ lesson, onClose, onUpdate }: LessonContentEditorProps) {
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState(lesson.title)
    const [type, setType] = useState<Lesson['type']>(lesson.type || 'text')
    const [content, setContent] = useState(lesson.content || '')
    const [videoUrl, setVideoUrl] = useState(lesson.video_url || '')

    // Quiz State logic (parsed from content if type is quiz)
    // We treat 'content' as a stringified JSON for quizzes
    const initialQuestions = type === 'quiz' && content ? JSON.parse(content) : []
    const [questions, setQuestions] = useState<any[]>(initialQuestions)

    const handleSave = async () => {
        setLoading(true)
        let finalContent = content

        // If quiz, serialize questions to content
        if (type === 'quiz') {
            finalContent = JSON.stringify(questions)
        }

        try {
            const updated = await apiClient(`/api/lessons/${lesson.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title,
                    type,
                    content: finalContent,
                    video_url: videoUrl
                })
            })
            onUpdate(updated)
            onClose()
        } catch (error) {
            alert('Failed to save lesson')
        } finally {
            setLoading(false)
        }
    }

    const addQuestion = () => {
        setQuestions([...questions, {
            id: Date.now(),
            text: '',
            options: [{ id: 1, text: '' }, { id: 2, text: '' }],
            correctOptionId: 1
        }])
    }

    const updateQuestion = (index: number, field: string, value: any) => {
        const newQuestions = [...questions]
        newQuestions[index] = { ...newQuestions[index], [field]: value }
        setQuestions(newQuestions)
    }

    const updateOption = (qIndex: number, oIndex: number, text: string) => {
        const newQuestions = [...questions]
        newQuestions[qIndex].options[oIndex].text = text
        setQuestions(newQuestions)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-lg font-medium">Edit Lesson Content</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Lesson Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Lesson Type</label>
                        <select
                            value={type || 'text'}
                            onChange={(e) => setType(e.target.value as any)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        >
                            <option value="text">Text / Article</option>
                            <option value="video">Video</option>
                            <option value="quiz">Quiz</option>
                        </select>
                    </div>

                    {/* Dynamic Editors based on Type */}
                    {type === 'text' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Content (Markdown)</label>
                            <textarea
                                rows={10}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 font-mono"
                                placeholder="# Lesson Heading..."
                            />
                        </div>
                    )}

                    {type === 'video' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Video URL</label>
                                <input
                                    type="text"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    placeholder="https://youtube.com/..."
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description / Notes</label>
                                <textarea
                                    rows={4}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                />
                            </div>
                        </div>
                    )}

                    {type === 'quiz' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">Questions</span>
                                <button
                                    onClick={addQuestion}
                                    type="button"
                                    className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add Question
                                </button>
                            </div>

                            {questions.map((q, qIndex) => (
                                <div key={q.id} className="border rounded p-4 bg-gray-50 space-y-2">
                                    <input
                                        type="text"
                                        value={q.text}
                                        onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                                        placeholder="Question Text"
                                        className="block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                    />
                                    <div className="pl-4 space-y-2">
                                        {q.options.map((opt: any, oIndex: number) => (
                                            <div key={opt.id} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name={`q-${q.id}`}
                                                    checked={q.correctOptionId === opt.id}
                                                    onChange={() => updateQuestion(qIndex, 'correctOptionId', opt.id)}
                                                />
                                                <input
                                                    type="text"
                                                    value={opt.text}
                                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                    placeholder={`Option ${oIndex + 1}`}
                                                    className="block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs p-1"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    )
}
