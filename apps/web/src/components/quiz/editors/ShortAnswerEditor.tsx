import { Plus, Trash2, X } from 'lucide-react'
import { ShortAnswerQuestion } from '@/types/quiz'

interface ShortAnswerEditorProps {
    question: ShortAnswerQuestion
    onChange: (updates: Partial<ShortAnswerQuestion>) => void
}

export function ShortAnswerEditor({ question, onChange }: ShortAnswerEditorProps) {
    const addAnswer = () => {
        onChange({ correctAnswers: [...(question.correctAnswers || []), ''] })
    }

    const removeAnswer = (index: number) => {
        const newAnswers = [...(question.correctAnswers || [])]
        newAnswers.splice(index, 1)
        onChange({ correctAnswers: newAnswers })
    }

    const updateAnswer = (index: number, val: string) => {
        const newAnswers = [...(question.correctAnswers || [])]
        newAnswers[index] = val
        onChange({ correctAnswers: newAnswers })
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-500">
                Enter acceptable answers. The student's input will be matched against these.
            </p>

            <div className="flex items-center gap-4 mb-2">
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={question.caseSensitive}
                        onChange={(e) => onChange({ caseSensitive: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Case Sensitive</span>
                </label>
            </div>

            <div className="space-y-2">
                {(question.correctAnswers || []).map((ans, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={ans}
                            onChange={(e) => updateAnswer(index, e.target.value)}
                            placeholder={`Acceptable Answer ${index + 1}`}
                            className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <button onClick={() => removeAnswer(index)} className="text-gray-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addAnswer}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
            >
                <Plus className="w-4 h-4 mr-1" /> Add Accepted Answer
            </button>
        </div>
    )
}
