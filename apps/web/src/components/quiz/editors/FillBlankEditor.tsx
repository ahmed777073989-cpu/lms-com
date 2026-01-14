"use client"

import { Plus, Trash2 } from 'lucide-react'
import { FillBlankQuestion } from '@/types/quiz'

interface FillBlankEditorProps {
    question: FillBlankQuestion
    onChange: (updates: Partial<FillBlankQuestion>) => void
}

export function FillBlankEditor({ question, onChange }: FillBlankEditorProps) {
    // Count blanks in template
    const blankCount = (question.template.match(/\{\{blank\}\}/g) || []).length

    // Ensure answers array matches blank count
    const ensureAnswersArray = () => {
        const currentAnswers = question.answers || []
        if (currentAnswers.length !== blankCount) {
            const newAnswers = Array(blankCount).fill(null).map((_, i) => currentAnswers[i] || [''])
            onChange({ answers: newAnswers })
        }
    }

    const updateTemplate = (template: string) => {
        onChange({ template })
        // Will trigger blank count recalculation on next render
    }

    const addAcceptableAnswer = (blankIndex: number) => {
        const newAnswers = [...(question.answers || [])]
        if (!newAnswers[blankIndex]) newAnswers[blankIndex] = []
        newAnswers[blankIndex] = [...newAnswers[blankIndex], '']
        onChange({ answers: newAnswers })
    }

    const removeAcceptableAnswer = (blankIndex: number, answerIndex: number) => {
        const newAnswers = [...(question.answers || [])]
        newAnswers[blankIndex] = newAnswers[blankIndex].filter((_, i) => i !== answerIndex)
        onChange({ answers: newAnswers })
    }

    const updateAcceptableAnswer = (blankIndex: number, answerIndex: number, value: string) => {
        const newAnswers = [...(question.answers || [])]
        newAnswers[blankIndex][answerIndex] = value
        onChange({ answers: newAnswers })
    }

    // Ensure answers array is in sync
    if ((question.answers || []).length !== blankCount) {
        ensureAnswersArray()
    }

    return (
        <div className="space-y-4">
            {/* Template Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template (use <code className="bg-gray-100 px-1 rounded">{'{{blank}}'}</code> for blanks)
                </label>
                <textarea
                    className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
                    rows={3}
                    value={question.template}
                    onChange={(e) => updateTemplate(e.target.value)}
                    placeholder="The capital of France is {{blank}}."
                />
                <p className="mt-1 text-xs text-gray-500">
                    {blankCount} blank{blankCount !== 1 ? 's' : ''} detected
                </p>
            </div>

            {/* Case Sensitive Toggle */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={question.caseSensitive}
                    onChange={(e) => onChange({ caseSensitive: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="text-sm text-gray-700">Case Sensitive</label>
            </div>

            {/* Acceptable Answers for Each Blank */}
            {blankCount > 0 && (
                <div className="space-y-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Acceptable Answers</h4>
                    {Array(blankCount).fill(null).map((_, blankIndex) => (
                        <div key={blankIndex} className="border rounded-lg p-3 bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Blank {blankIndex + 1}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => addAcceptableAnswer(blankIndex)}
                                    className="text-xs text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
                                >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Add Answer
                                </button>
                            </div>
                            <div className="space-y-2">
                                {((question.answers || [])[blankIndex] || ['']).map((answer, answerIndex) => (
                                    <div key={answerIndex} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={answer}
                                            onChange={(e) => updateAcceptableAnswer(blankIndex, answerIndex, e.target.value)}
                                            placeholder="Acceptable answer..."
                                            className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                        {((question.answers || [])[blankIndex] || []).length > 1 && (
                                            <button
                                                onClick={() => removeAcceptableAnswer(blankIndex, answerIndex)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
