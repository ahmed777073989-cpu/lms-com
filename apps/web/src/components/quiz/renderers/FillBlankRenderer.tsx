"use client"

interface FillBlankRendererProps {
    template: string
    value: string[]
    onChange: (value: string[]) => void
}

export function FillBlankRenderer({ template, value = [], onChange }: FillBlankRendererProps) {
    // Split template by {{blank}} to create parts
    const parts = template.split(/\{\{blank\}\}/g)
    const blankCount = parts.length - 1

    const handleBlankChange = (index: number, newValue: string) => {
        const newAnswers = [...value]
        newAnswers[index] = newValue
        onChange(newAnswers)
    }

    return (
        <div className="space-y-4">
            <div className="text-base leading-relaxed">
                {parts.map((part, index) => (
                    <span key={index}>
                        {part}
                        {index < blankCount && (
                            <input
                                type="text"
                                value={value[index] || ''}
                                onChange={(e) => handleBlankChange(index, e.target.value)}
                                className="inline-block mx-1 px-3 py-1 border-b-2 border-indigo-300 focus:border-indigo-600 focus:outline-none bg-indigo-50 rounded-sm min-w-[120px] text-center"
                                placeholder={`blank ${index + 1}`}
                            />
                        )}
                    </span>
                ))}
            </div>

            {/* Visual summary of filled blanks */}
            <div className="mt-4 text-xs text-gray-500">
                Filled: {value.filter(v => v && v.trim()).length} / {blankCount}
            </div>
        </div>
    )
}
