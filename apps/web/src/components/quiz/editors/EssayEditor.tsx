import { EssayQuestion } from '@/types/quiz'

interface EssayEditorProps {
    question: EssayQuestion
    onChange: (updates: Partial<EssayQuestion>) => void
}

export function EssayEditor({ question, onChange }: EssayEditorProps) {
    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-500">
                Essay questions require manual grading. You can optionally set a minimum word count.
            </p>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Word Count (Optional)
                </label>
                <input
                    type="number"
                    value={question.minWords || ''}
                    onChange={(e) => onChange({ minWords: parseInt(e.target.value) || undefined })}
                    placeholder="Leave empty for no limit"
                    className="w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">Students will see a word counter.</p>
            </div>
        </div>
    )
}
