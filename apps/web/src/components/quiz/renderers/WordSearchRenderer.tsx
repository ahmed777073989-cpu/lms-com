"use client"

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface WordSearchRendererProps {
    words: string[]
    grid: string[][]
    value: string[]
    onChange: (value: string[]) => void
}

export function WordSearchRenderer({ words, grid, value = [], onChange }: WordSearchRendererProps) {
    const [selecting, setSelecting] = useState(false)
    const [selectedCells, setSelectedCells] = useState<[number, number][]>([])
    const [foundWords, setFoundWords] = useState<Set<string>>(new Set(value))

    const handleMouseDown = (row: number, col: number) => {
        setSelecting(true)
        setSelectedCells([[row, col]])
    }

    const handleMouseEnter = (row: number, col: number) => {
        if (!selecting) return
        setSelectedCells(prev => [...prev, [row, col]])
    }

    const handleMouseUp = () => {
        if (!selecting) return
        setSelecting(false)

        // Get word from selected cells
        const selectedWord = selectedCells.map(([r, c]) => grid[r][c]).join('')
        const selectedWordReverse = selectedWord.split('').reverse().join('')

        // Check if it matches any word
        const matchedWord = words.find(w =>
            w.toUpperCase() === selectedWord.toUpperCase() ||
            w.toUpperCase() === selectedWordReverse.toUpperCase()
        )

        if (matchedWord && !foundWords.has(matchedWord.toUpperCase())) {
            const newFound = new Set(foundWords)
            newFound.add(matchedWord.toUpperCase())
            setFoundWords(newFound)
            onChange(Array.from(newFound))
        }

        setSelectedCells([])
    }

    const isCellSelected = (row: number, col: number) => {
        return selectedCells.some(([r, c]) => r === row && c === col)
    }

    return (
        <div className="space-y-4">
            {/* Words List */}
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Find these words:</h4>
                <div className="flex flex-wrap gap-2">
                    {words.map((word, idx) => {
                        const isFound = foundWords.has(word.toUpperCase())
                        return (
                            <span
                                key={idx}
                                className={cn(
                                    "px-3 py-1 rounded-full text-sm font-medium transition-all",
                                    isFound
                                        ? "bg-green-100 text-green-700 line-through"
                                        : "bg-gray-100 text-gray-700"
                                )}
                            >
                                {isFound && <Check className="w-3 h-3 inline mr-1" />}
                                {word.toUpperCase()}
                            </span>
                        )
                    })}
                </div>
            </div>

            {/* Grid */}
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Select letters by clicking and dragging
                </h4>
                <div
                    className="inline-block border-2 border-gray-300 rounded overflow-hidden select-none"
                    onMouseLeave={() => {
                        if (selecting) handleMouseUp()
                    }}
                >
                    {grid.map((row, r) => (
                        <div key={r} className="flex">
                            {row.map((cell, c) => (
                                <div
                                    key={c}
                                    onMouseDown={() => handleMouseDown(r, c)}
                                    onMouseEnter={() => handleMouseEnter(r, c)}
                                    onMouseUp={handleMouseUp}
                                    className={cn(
                                        "w-8 h-8 sm:w-10 sm:h-10 border border-gray-200 flex items-center justify-center text-sm sm:text-base font-bold cursor-pointer transition-colors",
                                        isCellSelected(r, c)
                                            ? "bg-indigo-200 text-indigo-900"
                                            : "bg-white hover:bg-gray-50"
                                    )}
                                >
                                    {cell}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Progress */}
            <div className="text-sm text-gray-500">
                Found: {foundWords.size} / {words.length}
            </div>
        </div>
    )
}
