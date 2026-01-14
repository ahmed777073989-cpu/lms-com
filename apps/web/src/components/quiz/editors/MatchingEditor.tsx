import { Plus, X } from 'lucide-react'
import { MatchingQuestion } from '@/types/quiz'
import { v4 as uuidv4 } from 'uuid'

interface MatchingEditorProps {
    question: MatchingQuestion
    onChange: (updates: Partial<MatchingQuestion>) => void
}

export function MatchingEditor({ question, onChange }: MatchingEditorProps) {
    const addPair = () => {
        onChange({ pairs: [...(question.pairs || []), { left: '', right: '' }] })
    }

    const removePair = (index: number) => {
        const newPairs = [...(question.pairs || [])]
        newPairs.splice(index, 1)
        onChange({ pairs: newPairs })
    }

    const updatePair = (index: number, side: 'left' | 'right', value: string) => {
        const newPairs = [...(question.pairs || [])]
        newPairs[index] = { ...newPairs[index], [side]: value }
        onChange({ pairs: newPairs })
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-500">
                Create pairs for students to match. The right side will be shuffled for students.
            </p>

            <div className="space-y-2">
                {(question.pairs || []).map((pair, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={pair.left}
                            onChange={(e) => updatePair(index, 'left', e.target.value)}
                            placeholder="Left item"
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <span className="text-gray-400">→</span>
                        <input
                            type="text"
                            value={pair.right}
                            onChange={(e) => updatePair(index, 'right', e.target.value)}
                            placeholder="Right item"
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <button onClick={() => removePair(index)} className="text-gray-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addPair}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
            >
                <Plus className="w-4 h-4 mr-1" /> Add Pair
            </button>
        </div>
    )
}
