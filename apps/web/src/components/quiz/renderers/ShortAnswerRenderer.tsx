
interface ShortAnswerRendererProps {
    value: string
    onChange: (val: string) => void
}

export function ShortAnswerRenderer({ value, onChange }: ShortAnswerRendererProps) {
    return (
        <div>
            <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Type your answer here..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-3"
            />
        </div>
    )
}
