import { useState, useEffect } from 'react'

interface SortingRendererProps {
    categories: { id: string; name: string }[]
    items: { id: string; text: string; categoryId: string }[]
    value: Record<string, string> // { itemId: categoryId }
    onChange: (val: Record<string, string>) => void
}

export function SortingRenderer({ categories, items, value, onChange }: SortingRendererProps) {
    const [shuffledItems, setShuffledItems] = useState<{ id: string; text: string }[]>([])

    useEffect(() => {
        // Shuffle items once on mount
        const shuffled = [...items]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        setShuffledItems(shuffled)
    }, [])

    const handleCategorize = (itemId: string, categoryId: string) => {
        onChange({ ...(value || {}), [itemId]: categoryId })
    }

    if (shuffledItems.length === 0) return <div>Loading...</div>

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">Assign each item to its correct category.</p>

            {shuffledItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded p-3 font-medium">
                        {item.text}
                    </div>
                    <select
                        value={(value || {})[item.id] || ''}
                        onChange={(e) => handleCategorize(item.id, e.target.value)}
                        className="w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Select category...</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    )
}
