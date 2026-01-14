"use client"

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CrosswordRendererProps {
    clues: {
        number: number
        direction: 'across' | 'down'
        clue: string
        answer: string
        row: number
        col: number
    }[]
    gridSize: { rows: number; cols: number }
    value: Record<string, string>
    onChange: (value: Record<string, string>) => void
}

export function CrosswordRenderer({ clues, gridSize, value = {}, onChange }: CrosswordRendererProps) {
    const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null)
    const [currentDirection, setCurrentDirection] = useState<'across' | 'down'>('across')

    // Build grid structure
    const { grid, numbers } = (() => {
        const { rows, cols } = gridSize
        const grid: boolean[][] = Array(rows).fill(null).map(() => Array(cols).fill(false))
        const numbers: (number | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null))

        clues.forEach(clue => {
            const { answer, row, col, direction, number } = clue
            if (!numbers[row]?.[col]) {
                numbers[row][col] = number
            }

            for (let i = 0; i < answer.length; i++) {
                const r = direction === 'across' ? row : row + i
                const c = direction === 'across' ? col + i : col
                if (r < rows && c < cols) {
                    grid[r][c] = true
                }
            }
        })

        return { grid, numbers }
    })()

    const handleCellClick = (row: number, col: number) => {
        if (!grid[row][col]) return

        // If clicking same cell, toggle direction
        if (focusedCell?.row === row && focusedCell?.col === col) {
            setCurrentDirection(prev => prev === 'across' ? 'down' : 'across')
        } else {
            setFocusedCell({ row, col })
        }
    }

    const handleKeyDown = (row: number, col: number, key: string) => {
        if (key.length === 1 && /[a-zA-Z]/.test(key)) {
            const cellKey = `${row}-${col}`
            onChange({ ...value, [cellKey]: key.toUpperCase() })

            // Move to next cell
            moveToNextCell(row, col)
        } else if (key === 'Backspace') {
            const cellKey = `${row}-${col}`
            onChange({ ...value, [cellKey]: '' })
        } else if (key === 'ArrowRight' || key === 'ArrowLeft' || key === 'ArrowUp' || key === 'ArrowDown') {
            handleArrowKey(row, col, key)
        }
    }

    const moveToNextCell = (row: number, col: number) => {
        const nextRow = currentDirection === 'down' ? row + 1 : row
        const nextCol = currentDirection === 'across' ? col + 1 : col

        if (nextRow < gridSize.rows && nextCol < gridSize.cols && grid[nextRow][nextCol]) {
            setFocusedCell({ row: nextRow, col: nextCol })
        }
    }

    const handleArrowKey = (row: number, col: number, key: string) => {
        let newRow = row
        let newCol = col

        if (key === 'ArrowRight') newCol++
        else if (key === 'ArrowLeft') newCol--
        else if (key === 'ArrowDown') newRow++
        else if (key === 'ArrowUp') newRow--

        if (newRow >= 0 && newRow < gridSize.rows && newCol >= 0 && newCol < gridSize.cols && grid[newRow][newCol]) {
            setFocusedCell({ row: newRow, col: newCol })
        }
    }

    const acrossClues = clues.filter(c => c.direction === 'across')
    const downClues = clues.filter(c => c.direction === 'down')

    return (
        <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Grid */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Crossword Grid</h4>
                    <div className="inline-block border-2 border-gray-300 rounded overflow-hidden">
                        {grid.map((row, r) => (
                            <div key={r} className="flex">
                                {row.map((isActive, c) => {
                                    const cellKey = `${r}-${c}`
                                    const isFocused = focusedCell?.row === r && focusedCell?.col === c
                                    return (
                                        <div
                                            key={c}
                                            onClick={() => handleCellClick(r, c)}
                                            tabIndex={isActive ? 0 : -1}
                                            onKeyDown={(e) => {
                                                e.preventDefault()
                                                if (isActive) handleKeyDown(r, c, e.key)
                                            }}
                                            className={cn(
                                                "relative w-10 h-10 border border-gray-300 flex items-center justify-center text-base font-bold uppercase focus:outline-none",
                                                isActive
                                                    ? isFocused
                                                        ? "bg-yellow-200 cursor-pointer"
                                                        : "bg-white cursor-pointer hover:bg-gray-50"
                                                    : "bg-gray-900"
                                            )}
                                        >
                                            {numbers[r][c] && (
                                                <span className="absolute top-0 left-0 text-[8px] text-gray-600 font-bold p-0.5">
                                                    {numbers[r][c]}
                                                </span>
                                            )}
                                            {isActive && <span className="text-gray-900">{value[cellKey] || ''}</span>}
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Clues */}
                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-2">Across</h4>
                        <div className="space-y-1 text-sm">
                            {acrossClues.map(clue => (
                                <div key={`across-${clue.number}`} className="flex">
                                    <span className="font-bold mr-2">{clue.number}.</span>
                                    <span>{clue.clue}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-2">Down</h4>
                        <div className="space-y-1 text-sm">
                            {downClues.map(clue => (
                                <div key={`down-${clue.number}`} className="flex">
                                    <span className="font-bold mr-2">{clue.number}.</span>
                                    <span>{clue.clue}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <p className="text-xs text-gray-500 italic">
                Click on a cell to start typing. Use arrow keys to navigate, or click the same cell to change direction.
            </p>
        </div>
    )
}
