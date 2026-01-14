import { UnscrambleQuestion } from '@/types/quiz'

interface UnscrambleEditorProps {
    question: UnscrambleQuestion
    onChange: (updates: Partial<UnscrambleQuestion>) => void
}

export function UnscrambleEditor({ question, onChange }: UnscrambleEditorProps) {
    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-500">
                Enter the correct word or sentence. It will be scrambled for students.
            </p>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
                <select
                    value={question.mode || 'letters'}
                    onChange={(e) => onChange({ mode: e.target.value as 'letters' | 'sentence' })}
                    className="w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="letters">Scramble Letters (Word)</option>
                    <option value="sentence">Scramble Words (Sentence)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct {question.mode === 'sentence' ? 'Sentence' : 'Word'}
                </label>
                <input
                    type="text"
                    value={question.correctSequence || ''}
                    onChange={(e) => onChange({ correctSequence: e.target.value })}
                    placeholder={question.mode === 'sentence' ? 'The quick brown fox' : 'SCRAMBLE'}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
        </div>
    )
}
