"use client"

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { Plus, GripVertical, Trash2, Edit2, FileText, Video, HelpCircle } from 'lucide-react'
import { Database } from '@/types/database.types'
import { LessonContentEditor } from './LessonContentEditor'

type Module = Database['public']['Tables']['modules']['Row'] & {
    lessons: Database['public']['Tables']['lessons']['Row'][]
}

export function CurriculumEditor({ courseId }: { courseId: string }) {
    const [modules, setModules] = useState<Module[]>([])
    const [loading, setLoading] = useState(true)
    const [newModuleTitle, setNewModuleTitle] = useState('')
    const [isAddingModule, setIsAddingModule] = useState(false)

    // Simplified Lesson Adding State
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
    const [newLessonTitle, setNewLessonTitle] = useState('')

    // Editor State
    const [editingLesson, setEditingLesson] = useState<any | null>(null)

    useEffect(() => {
        fetchCurriculum()
    }, [])

    const fetchCurriculum = async () => {
        try {
            const data = await apiClient(`/api/courses/${courseId}/modules`)
            setModules(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddModule = async () => {
        if (!newModuleTitle.trim()) return
        try {
            const newModule = await apiClient(`/api/courses/${courseId}/modules`, {
                method: 'POST',
                body: JSON.stringify({ title: newModuleTitle })
            })
            setModules([...modules, { ...newModule, lessons: [] }])
            setNewModuleTitle('')
            setIsAddingModule(false)
        } catch (error) {
            alert('Failed to create module')
        }
    }

    const handleDeleteModule = async (id: string) => {
        if (!confirm('Delete module and all lessons?')) return
        try {
            await apiClient(`/api/modules/${id}`, { method: 'DELETE' })
            setModules(modules.filter(m => m.id !== id))
        } catch (error) {
            alert('Failed to delete module')
        }
    }

    const handleAddLesson = async (moduleId: string) => {
        if (!newLessonTitle.trim()) return
        try {
            const newLesson = await apiClient(`/api/modules/${moduleId}/lessons`, {
                method: 'POST',
                body: JSON.stringify({ title: newLessonTitle, type: 'text' })
            })

            setModules(modules.map(m => {
                if (m.id === moduleId) {
                    return { ...m, lessons: [...(m.lessons || []), newLesson] }
                }
                return m
            }))

            setNewLessonTitle('')
            setActiveModuleId(null)
        } catch (error) {
            alert('Failed to create lesson')
        }
    }

    const handleDeleteLesson = async (lessonId: string, moduleId: string) => {
        if (!confirm('Delete lesson?')) return
        try {
            await apiClient(`/api/lessons/${lessonId}`, { method: 'DELETE' })
            setModules(modules.map(m => {
                if (m.id === moduleId) {
                    return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
                }
                return m
            }))
        } catch (error) {
            alert('Failed to delete lesson')
        }
    }

    const handleUpdateLesson = (updatedLesson: any) => {
        setModules(modules.map(m => ({
            ...m,
            lessons: m.lessons.map(l => l.id === updatedLesson.id ? updatedLesson : l)
        })))
    }

    if (loading) return <div>Loading curriculum...</div>

    return (
        <div className="space-y-6">
            {/* Modal */}
            {editingLesson && (
                <LessonContentEditor
                    lesson={editingLesson}
                    onClose={() => setEditingLesson(null)}
                    onUpdate={handleUpdateLesson}
                />
            )}

            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Curriculum</h3>
                <button
                    onClick={() => setIsAddingModule(true)}
                    className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Module
                </button>
            </div>

            {/* Add Module Input */}
            {isAddingModule && (
                <div className="flex gap-2 mb-4 p-4 bg-gray-50 rounded-md">
                    <input
                        type="text"
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                        placeholder="Module Title (e.g. Getting Started)"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <button
                        onClick={handleAddModule}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => setIsAddingModule(false)}
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Modules List */}
            <div className="space-y-4">
                {modules.map((module) => (
                    <div key={module.id} className="border rounded-lg bg-white overflow-hidden">
                        {/* Module Header */}
                        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
                            <div className="flex items-center">
                                <GripVertical className="h-5 w-5 text-gray-400 mr-2 cursor-move" />
                                <span className="font-medium text-gray-900">{module.title}</span>
                                <span className="ml-2 text-xs text-gray-500">({module.lessons?.length || 0} lessons)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => handleDeleteModule(module.id)} className="text-gray-400 hover:text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Lessons List */}
                        <div className="p-4 space-y-2">
                            {module.lessons?.map((lesson) => (
                                <div key={lesson.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 group">
                                    <div className="flex items-center ml-6 cursor-pointer" onClick={() => setEditingLesson(lesson)}>
                                        {lesson.type === 'video' ? <Video className="h-4 w-4 text-blue-500 mr-2" /> :
                                            lesson.type === 'quiz' ? <HelpCircle className="h-4 w-4 text-purple-500 mr-2" /> :
                                                <FileText className="h-4 w-4 text-gray-500 mr-2" />}
                                        <span className="text-sm text-gray-700 group-hover:text-indigo-600">{lesson.title}</span>
                                        <span className="ml-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100">Edit Content</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => setEditingLesson(lesson)} className="text-gray-400 hover:text-indigo-500">
                                            <Edit2 className="h-3 w-3" />
                                        </button>
                                        <button onClick={() => handleDeleteLesson(lesson.id, module.id)} className="text-gray-400 hover:text-red-500">
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Add Lesson Input */}
                            {activeModuleId === module.id ? (
                                <div className="flex gap-2 ml-6 mt-2">
                                    <input
                                        type="text"
                                        value={newLessonTitle}
                                        onChange={(e) => setNewLessonTitle(e.target.value)}
                                        placeholder="Lesson Title"
                                        className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs sm:leading-6"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleAddLesson(module.id);
                                            if (e.key === 'Escape') setActiveModuleId(null);
                                        }}
                                    />
                                    <button onClick={() => handleAddLesson(module.id)} className="text-xs bg-indigo-600 text-white px-2 rounded">Add</button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => { setActiveModuleId(module.id); setNewLessonTitle('') }}
                                    className="ml-6 mt-2 flex items-center text-sm text-gray-500 hover:text-indigo-600"
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add Lesson
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
