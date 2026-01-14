import { useState, useEffect } from 'react'

interface UnscrambleRendererProps {
    mode: 'letters' | 'sentence'
    correctSequence: string
    value: string
    onChange: (val: string) => void
}

export function UnscrambleRenderer({ mode, correctSequence, value, onChange }: UnscrambleRendererProps) {
    const [scrambled, setScrambled] = useState('')

    useEffect(() => {
        if (!correctSequence) return

        if (mode === 'letters') {
            // Scramble letters
            const letters = correctSequence.split('')
            for (let i = letters.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [letters[i], letters[j]] = [letters[j], letters[i]]
            }
            setScrambled(letters.join(''))
        } else {
            // Scramble words
            const words = correctSequence.split(' ')
            for (let i = words.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [words[i], words[j]] = [words[j], words[i]]
            }
            setScrambled(words.join(' '))
        }
    }, [correctSequence, mode])

    return (
        <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
                <p className="text-xs text-indigo-600 font-medium mb-1 uppercase">Scrambled {mode === 'letters' ? 'Letters' : 'Words'}</p>
                <p className="text-xl font-bold text-indigo-900 tracking-wider">{scrambled}</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Answer
                </label>
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Type the unscrambled answer..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-3"
                />
            </div>
        </div>
    )
}
