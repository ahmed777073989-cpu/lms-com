"use client"

import { Plus, Trash2, RefreshCw } from 'lucide-react'
import { WordSearchQuestion } from '@/types/quiz'

interface WordSearchEditorProps {
    question: WordSearchQuestion
    onChange: (updates: Partial<WordSearchQuestion>) => void
}

export function WordSearchEditor({ question, onChange }: WordSearchEditorProps) {
    const addWord = () => {
        onChange({ words: [...(question.words || []), ''] })
    }

    const removeWord = (index: number) => {
        onChange({ words: question.words.filter((_, i) => i !== index) })
    }

    const updateWord = (index: number, value: string) => {
        const newWords = [...question.words]
        newWords[index] = value.toUpperCase()
        onChange({ words: newWords })
    }

    const generateGrid = () => {
        const size = question.gridSize || 10
        const grid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''))
        const words = question.words.filter(w => w.trim().length > 0)

        // Place each word randomly
        words.forEach(word => {
            let placed = false
            let attempts = 0
            const maxAttempts = 100

            while (!placed && attempts < maxAttempts) {
                attempts++
                // Random direction: 0=horizontal, 1=vertical, 2=diagonal
                const direction = Math.floor(Math.random() * 3)
                let row = Math.floor(Math.random() * size)
                let col = Math.floor(Math.random() * size)

                // Check if word fits
                let canPlace = true
                const positions: [number, number][] = []

                for (let i = 0; i < word.length; i++) {
                    let r = row
                    let c = col

                    if (direction === 0) c += i // horizontal
                    else if (direction === 1) r += i // vertical
                    else { r += i; c += i } // diagonal

                    if (r >= size || c >= size || (grid[r][c] !== '' && grid[r][c] !== word[i])) {
                        canPlace = false
                        break
                    }
                    positions.push([r, c])
                }

                if (canPlace) {
                    positions.forEach(([r, c], i) => {
                        grid[r][c] = word[i]
                    })
                    placed = true
                }
            }
        })

        // Fill empty cells with random letters
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (grid[r][c] === '') {
                    grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)]
                }
            }
        }

        onChange({ grid })
    }

    return (
        <div className="space-y-4">
            {/* Grid Size Selector */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grid Size</label>
                <select
                    value={question.gridSize || 10}
                    onChange={(e) => onChange({ gridSize: parseInt(e.target.value) })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value={10}>10x10</option>
                    <option value={15}>15x15</option>
                    <option value={20}>20x20</option>
                </select>
            </div>

            {/* Words List */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Words to Find</label>
                    <button
                        type="button"
                        onClick={addWord}
                        className="text-sm text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Word
                    </button>
                </div>
                <div className="space-y-2">
                    {(question.words || ['']).map((word, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={word}
                                onChange={(e) => updateWord(index, e.target.value)}
                                placeholder="Word..."
                                className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm uppercase"
                            />
                            {question.words.length > 1 && (
                                <button
                                    onClick={() => removeWord(index)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Generate Button */}
            <button
                type="button"
                onClick={generateGrid}
                disabled={!question.words || question.words.filter(w => w.trim()).length === 0}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate Grid
            </button>

            {/* Grid Preview */}
            {question.grid && question.grid.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grid Preview</label>
                    <div className="inline-block border border-gray-300 rounded overflow-hidden">
                        {question.grid.map((row, r) => (
                            <div key={r} className="flex">
                                {row.map((cell, c) => (
                                    <div
                                        key={c}
                                        className="w-6 h-6 border border-gray-200 flex items-center justify-center text-xs font-mono bg-white"
                                    >
                                        {cell}
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
