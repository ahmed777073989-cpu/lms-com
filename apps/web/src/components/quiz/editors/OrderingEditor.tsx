import { Plus, X, GripVertical } from 'lucide-react'
import { OrderingQuestion } from '@/types/quiz'
import { v4 as uuidv4 } from 'uuid'

interface OrderingEditorProps {
    question: OrderingQuestion
    onChange: (updates: Partial<OrderingQuestion>) => void
}

export function OrderingEditor({ question, onChange }: OrderingEditorProps) {
    const addItem = () => {
        onChange({ items: [...(question.items || []), { id: uuidv4(), text: '' }] })
    }

    const removeItem = (id: string) => {
        onChange({ items: (question.items || []).filter(item => item.id !== id) })
    }

    const updateItem = (id: string, text: string) => {
        onChange({
            items: (question.items || []).map(item =>
                item.id === id ? { ...item, text } : item
            )
        })
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-500">
                Add items in the correct order. Students will see them shuffled and must reorder them.
            </p>

            <div className="space-y-2">
                {(question.items || []).map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm font-medium w-6">{index + 1}.</span>
                        <input
                            type="text"
                            value={item.text}
                            onChange={(e) => updateItem(item.id, e.target.value)}
                            placeholder={`Item ${index + 1}`}
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addItem}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
            >
                <Plus className="w-4 h-4 mr-1" /> Add Item
            </button>
        </div>
    )
}
