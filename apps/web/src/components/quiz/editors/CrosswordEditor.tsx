"use client"

import { Plus, Trash2 } from 'lucide-react'
import { CrosswordQuestion } from '@/types/quiz'

interface CrosswordEditorProps {
    question: CrosswordQuestion
    onChange: (updates: Partial<CrosswordQuestion>) => void
}

export function CrosswordEditor({ question, onChange }: CrosswordEditorProps) {
    const clues = question.clues || []

    const addClue = () => {
        const newClue = {
            number: clues.length + 1,
            direction: 'across' as const,
            clue: '',
            answer: '',
            row: 0,
            col: 0
        }
        onChange({ clues: [...clues, newClue] })
    }

    const removeClue = (index: number) => {
        const newClues = clues.filter((_, i) => i !== index)
        // Renumber clues
        const renumbered = newClues.map((c, i) => ({ ...c, number: i + 1 }))
        onChange({ clues: renumbered })
    }

    const updateClue = (index: number, updates: Partial<typeof clues[0]>) => {
        const newClues = [...clues]
        newClues[index] = { ...newClues[index], ...updates }
        if (updates.answer) {
            newClues[index].answer = updates.answer.toUpperCase()
        }
        onChange({ clues: newClues })
    }

    const renderGrid = () => {
        const { rows, cols } = question.gridSize || { rows: 10, cols: 10 }
        const grid: (string | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null))
        const numbers: (number | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null))

        // Place clues on grid
        clues.forEach(clue => {
            const { answer, row, col, direction, number } = clue
            if (!answer) return

            // Mark starting number
            if (!numbers[row]?.[col]) {
                numbers[row][col] = number
            }

            // Place letters
            for (let i = 0; i < answer.length; i++) {
                const r = direction === 'across' ? row : row + i
                const c = direction === 'across' ? col + i : col
                if (r < rows && c < cols) {
                    grid[r][c] = answer[i]
                }
            }
        })

        return { grid, numbers }
    }

    const { grid, numbers } = renderGrid()

    return (
        <div className="space-y-4">
            {/* Grid Size */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rows</label>
                    <input
                        type="number"
                        min={5}
                        max={20}
                        value={question.gridSize?.rows || 10}
                        onChange={(e) => onChange({
                            gridSize: { ...question.gridSize, rows: parseInt(e.target.value) || 10, cols: question.gridSize?.cols || 10 }
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
                    <input
                        type="number"
                        min={5}
                        max={20}
                        value={question.gridSize?.cols || 10}
                        onChange={(e) => onChange({
                            gridSize: { ...question.gridSize, rows: question.gridSize?.rows || 10, cols: parseInt(e.target.value) || 10 }
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            {/* Clues */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Clues</label>
                    <button
                        type="button"
                        onClick={addClue}
                        className="text-sm text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Clue
                    </button>
                </div>

                <div className="space-y-3">
                    {clues.map((clue, index) => (
                        <div key={index} className="border rounded-lg p-3 bg-gray-50 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">
                                    {clue.number}. {clue.direction === 'across' ? 'Across' : 'Down'}
                                </span>
                                <button
                                    onClick={() => removeClue(index)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <select
                                    value={clue.direction}
                                    onChange={(e) => updateClue(index, { direction: e.target.value as 'across' | 'down' })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="across">Across</option>
                                    <option value="down">Down</option>
                                </select>
                                <input
                                    type="text"
                                    value={clue.answer}
                                    onChange={(e) => updateClue(index, { answer: e.target.value })}
                                    placeholder="Answer"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm uppercase"
                                />
                            </div>

                            <input
                                type="text"
                                value={clue.clue}
                                onChange={(e) => updateClue(index, { clue: e.target.value })}
                                placeholder="Clue text..."
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />

                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    min={0}
                                    value={clue.row}
                                    onChange={(e) => updateClue(index, { row: parseInt(e.target.value) || 0 })}
                                    placeholder="Row"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <input
                                    type="number"
                                    min={0}
                                    value={clue.col}
                                    onChange={(e) => updateClue(index, { col: parseInt(e.target.value) || 0 })}
                                    placeholder="Column"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Grid Preview */}
            {clues.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grid Preview</label>
                    <div className="inline-block border-2 border-gray-300 rounded overflow-hidden">
                        {grid.map((row, r) => (
                            <div key={r} className="flex">
                                {row.map((cell, c) => (
                                    <div
                                        key={c}
                                        className={`relative w-8 h-8 border border-gray-200 flex items-center justify-center text-xs font-mono ${cell ? 'bg-white' : 'bg-gray-900'
                                            }`}
                                    >
                                        {numbers[r][c] && (
                                            <span className="absolute top-0 left-0 text-[8px] text-gray-500 font-bold">
                                                {numbers[r][c]}
                                            </span>
                                        )}
                                        {cell && <span className="text-gray-400">{cell}</span>}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
