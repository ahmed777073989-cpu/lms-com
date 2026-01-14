import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react'
import { MCQQuestion } from '@/types/quiz'
import { v4 as uuidv4 } from 'uuid'

interface MCQEditorProps {
    question: MCQQuestion
    onChange: (updates: Partial<MCQQuestion>) => void
}

export function MCQEditor({ question, onChange }: MCQEditorProps) {
    const addOption = () => {
        const newOption = { id: uuidv4(), text: '', isCorrect: false }
        onChange({ options: [...question.options, newOption] })
    }

    const removeOption = (id: string) => {
        onChange({ options: question.options.filter(o => o.id !== id) })
    }

    const updateOption = (id: string, text: string) => {
        onChange({
            options: question.options.map(o => o.id === id ? { ...o, text } : o)
        })
    }

    const toggleCorrect = (id: string) => {
        if (question.allowMultiple) {
            onChange({
                options: question.options.map(o => o.id === id ? { ...o, isCorrect: !o.isCorrect } : o)
            })
        } else {
            // Single choice: set this to true, others to false
            onChange({
                options: question.options.map(o => ({ ...o, isCorrect: o.id === id }))
            })
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-4 mb-2">
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={question.allowMultiple}
                        onChange={(e) => onChange({ allowMultiple: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Allow Multiple Answers</span>
                </label>
            </div>

            <div className="space-y-2">
                {question.options.map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                        <button
                            onClick={() => toggleCorrect(option.id)}
                            className={`flex-shrink-0 ${option.isCorrect ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}`}
                        >
                            {option.isCorrect ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </button>
                        <input
                            type="text"
                            value={option.text}
                            onChange={(e) => updateOption(option.id, e.target.value)}
                            placeholder={`Option text...`}
                            className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <button onClick={() => removeOption(option.id)} className="text-gray-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addOption}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
            >
                <Plus className="w-4 h-4 mr-1" /> Add Option
            </button>
        </div>
    )
}
