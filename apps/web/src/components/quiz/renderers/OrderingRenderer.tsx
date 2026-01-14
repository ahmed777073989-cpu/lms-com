import { useState, useEffect } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'

interface OrderingRendererProps {
    items: { id: string; text: string }[]
    value: string[] // Array of item IDs in user's order
    onChange: (val: string[]) => void
}

export function OrderingRenderer({ items, value, onChange }: OrderingRendererProps) {
    const [shuffledItems, setShuffledItems] = useState<{ id: string; text: string }[]>([])

    useEffect(() => {
        // Shuffle items once on mount
        const shuffled = [...items]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        setShuffledItems(shuffled)
        // Initialize value with shuffled order
        if (!value || value.length === 0) {
            onChange(shuffled.map(item => item.id))
        }
    }, [])

    const currentOrder = (value || []).map(id => items.find(item => item.id === id)).filter(Boolean) as { id: string; text: string }[]

    const moveUp = (index: number) => {
        if (index === 0) return
        const newOrder = [...value]
            ;[newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]]
        onChange(newOrder)
    }

    const moveDown = (index: number) => {
        if (index === value.length - 1) return
        const newOrder = [...value]
            ;[newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]]
        onChange(newOrder)
    }

    if (currentOrder.length === 0) return <div>Loading...</div>

    return (
        <div className="space-y-2">
            {currentOrder.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2 bg-white border border-gray-200 rounded p-3">
                    <span className="text-gray-500 font-bold text-sm w-6">{index + 1}</span>
                    <span className="flex-1 font-medium">{item.text}</span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => moveUp(index)}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => moveDown(index)}
                            disabled={index === currentOrder.length - 1}
                            className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ArrowDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
