import { useState, useEffect } from 'react'

interface MatchingRendererProps {
    pairs: { left: string; right: string }[]
    value: Record<string, string> // { leftItem: rightItem }
    onChange: (val: Record<string, string>) => void
}

export function MatchingRenderer({ pairs, value, onChange }: MatchingRendererProps) {
    const [shuffledRight, setShuffledRight] = useState<string[]>([])

    useEffect(() => {
        // Shuffle right items once on mount
        const items = [...pairs.map(p => p.right)]
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]]
        }
        setShuffledRight(items)
    }, [])

    const handleMatch = (leftItem: string, rightItem: string) => {
        onChange({ ...(value || {}), [leftItem]: rightItem })
    }

    if (shuffledRight.length === 0) return <div>Loading...</div>

    return (
        <div className="space-y-3">
            {pairs.map((pair, idx) => (
                <div key={idx} className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded p-3 font-medium">
                        {pair.left}
                    </div>
                    <span className="text-gray-400">→</span>
                    <select
                        value={(value || {})[pair.left] || ''}
                        onChange={(e) => handleMatch(pair.left, e.target.value)}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Select match...</option>
                        {shuffledRight.map((rightItem, ridx) => (
                            <option key={ridx} value={rightItem}>{rightItem}</option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    )
}
