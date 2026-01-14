import { Plus, X } from 'lucide-react'
import { SortingQuestion } from '@/types/quiz'
import { v4 as uuidv4 } from 'uuid'

interface SortingEditorProps {
    question: SortingQuestion
    onChange: (updates: Partial<SortingQuestion>) => void
}

export function SortingEditor({ question, onChange }: SortingEditorProps) {
    const addCategory = () => {
        onChange({ categories: [...(question.categories || []), { id: uuidv4(), name: '' }] })
    }

    const removeCategory = (id: string) => {
        // Also remove items that belong to this category
        onChange({
            categories: (question.categories || []).filter(cat => cat.id !== id),
            items: (question.items || []).filter(item => item.categoryId !== id)
        })
    }

    const updateCategory = (id: string, name: string) => {
        onChange({
            categories: (question.categories || []).map(cat =>
                cat.id === id ? { ...cat, name } : cat
            )
        })
    }

    const addItem = () => {
        const firstCategoryId = question.categories?.[0]?.id || ''
        onChange({ items: [...(question.items || []), { id: uuidv4(), text: '', categoryId: firstCategoryId }] })
    }

    const removeItem = (id: string) => {
        onChange({ items: (question.items || []).filter(item => item.id !== id) })
    }

    const updateItem = (id: string, updates: Partial<{ text: string; categoryId: string }>) => {
        onChange({
            items: (question.items || []).map(item =>
                item.id === id ? { ...item, ...updates } : item
            )
        })
    }

    return (
        <div className="space-y-6">
            {/* Categories */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Categories</label>
                    <button
                        type="button"
                        onClick={addCategory}
                        className="text-xs text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
                    >
                        <Plus className="w-3 h-3 mr-1" /> Add Category
                    </button>
                </div>
                <div className="space-y-2">
                    {(question.categories || []).map((cat) => (
                        <div key={cat.id} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={cat.name}
                                onChange={(e) => updateCategory(cat.id, e.target.value)}
                                placeholder="Category name"
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            <button onClick={() => removeCategory(cat.id)} className="text-gray-400 hover:text-red-500">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Items */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Items to Sort</label>
                    <button
                        type="button"
                        onClick={addItem}
                        className="text-xs text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
                    >
                        <Plus className="w-3 h-3 mr-1" /> Add Item
                    </button>
                </div>
                <div className="space-y-2">
                    {(question.items || []).map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={item.text}
                                onChange={(e) => updateItem(item.id, { text: e.target.value })}
                                placeholder="Item text"
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            <select
                                value={item.categoryId}
                                onChange={(e) => updateItem(item.id, { categoryId: e.target.value })}
                                className="w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Select category</option>
                                {(question.categories || []).map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name || 'Unnamed'}</option>
                                ))}
                            </select>
                            <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
