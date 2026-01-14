import { useState, useEffect } from 'react'

interface EssayRendererProps {
    value: string
    onChange: (val: string) => void
    minWords?: number
}

export function EssayRenderer({ value, onChange, minWords }: EssayRendererProps) {
    const [wordCount, setWordCount] = useState(0)

    useEffect(() => {
        const words = (value || '').trim().split(/\s+/).filter(w => w.length > 0)
        setWordCount(words.length)
    }, [value])

    return (
        <div className="space-y-2">
            <textarea
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Write your essay here..."
                rows={12}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            />
            <div className="flex justify-between text-xs text-gray-500">
                <span>Word Count: {wordCount}</span>
                {minWords && (
                    <span className={wordCount >= minWords ? 'text-green-600' : 'text-amber-600'}>
                        Minimum: {minWords} words
                    </span>
                )}
            </div>
        </div>
    )
}
