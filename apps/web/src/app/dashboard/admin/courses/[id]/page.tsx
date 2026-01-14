"use client"

import { useState } from 'react'
import { CurriculumEditor } from '@/components/courses/CurriculumEditor'
import { cn } from '@/lib/utils'

export default function CourseEditorPage({ params }: { params: { id: string } }) {
    const [activeTab, setActiveTab] = useState<'details' | 'curriculum'>('curriculum')

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={cn(
                            activeTab === 'details'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                        )}
                    >
                        Course Details
                    </button>
                    <button
                        onClick={() => setActiveTab('curriculum')}
                        className={cn(
                            activeTab === 'curriculum'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                        )}
                    >
                        Curriculum
                    </button>
                </nav>
            </div>

            {activeTab === 'details' && (
                <div className="bg-white shadow sm:rounded-lg p-6">
                    <p className="text-gray-500">Details form goes here (reuse functionality from creation page)</p>
                </div>
            )}

            {activeTab === 'curriculum' && (
                <CurriculumEditor courseId={params.id} />
            )}
        </div>
    )
}
