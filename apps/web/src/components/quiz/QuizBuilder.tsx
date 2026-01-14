"use client"

import { useState } from 'react'
import { Plus, Trash2, GripVertical, Settings } from 'lucide-react'
import { QuizContent, Question, QuestionType } from '@/types/quiz'
import { v4 as uuidv4 } from 'uuid'
import { MCQEditor } from './editors/MCQEditor'
import { ShortAnswerEditor } from './editors/ShortAnswerEditor'
import { EssayEditor } from './editors/EssayEditor'
import { MatchingEditor } from './editors/MatchingEditor'
import { OrderingEditor } from './editors/OrderingEditor'
import { SortingEditor } from './editors/SortingEditor'
import { UnscrambleEditor } from './editors/UnscrambleEditor'
import { FillBlankEditor } from './editors/FillBlankEditor'
import { WordSearchEditor } from './editors/WordSearchEditor'
import { CrosswordEditor } from './editors/CrosswordEditor'

interface QuizBuilderProps {
    initialContent: string | null
    onChange: (content: string) => void
}

const DEFAULT_SETTINGS = {
    passingScorePercentage: 70,
    shuffleQuestions: false,
    showResultsImmediately: true
}

export function QuizBuilder({ initialContent, onChange }: QuizBuilderProps) {
    const [quiz, setQuiz] = useState<QuizContent>(() => {
        if (!initialContent) return { questions: [], settings: DEFAULT_SETTINGS }
        try {
            return JSON.parse(initialContent)
        } catch {
            return { questions: [], settings: DEFAULT_SETTINGS }
        }
    })

    const updateQuiz = (newQuiz: QuizContent) => {
        setQuiz(newQuiz)
        onChange(JSON.stringify(newQuiz))
    }

    const addQuestion = (type: QuestionType) => {
        const newQuestion: any = {
            id: uuidv4(),
            type,
            prompt: 'New Question',
            points: 10,
        }

        // Initialize specific data based on type
        if (type === 'mcq' || type === 'true_false') {
            newQuestion.options = [{ id: uuidv4(), text: 'Option 1', isCorrect: false }]
            newQuestion.allowMultiple = false
        } else if (type === 'short_answer') {
            newQuestion.correctAnswers = []
            newQuestion.caseSensitive = false
        } else if (type === 'essay') {
            newQuestion.minWords = undefined
        } else if (type === 'matching') {
            newQuestion.pairs = []
        } else if (type === 'ordering') {
            newQuestion.items = []
        } else if (type === 'sorting') {
            newQuestion.categories = []
            newQuestion.items = []
        } else if (type === 'unscramble') {
            newQuestion.mode = 'letters'
            newQuestion.correctSequence = ''
        } else if (type === 'fill_blank') {
            newQuestion.template = ''
            newQuestion.answers = []
            newQuestion.caseSensitive = false
        } else if (type === 'word_search') {
            newQuestion.words = []
            newQuestion.gridSize = 10
            newQuestion.grid = []
        } else if (type === 'crossword') {
            newQuestion.clues = []
            newQuestion.gridSize = { rows: 10, cols: 10 }
        }

        updateQuiz({
            ...quiz,
            questions: [...quiz.questions, newQuestion]
        })
    }

    const removeQuestion = (id: string) => {
        updateQuiz({
            ...quiz,
            questions: quiz.questions.filter(q => q.id !== id)
        })
    }

    const updateQuestion = (id: string, updates: Partial<Question>) => {
        updateQuiz({
            ...quiz,
            questions: quiz.questions.map(q => q.id === id ? { ...q, ...updates } as Question : q)
        })
    }

    return (
        <div className="space-y-8">
            {/* Header / Settings */}
            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Quiz Structure</h3>
                <div className="text-sm text-gray-500">
                    {quiz.questions.length} Questions | Total Points: {quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0)}
                </div>
            </div>

            {/* Question List */}
            <div className="space-y-6">
                {quiz.questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg bg-white shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">
                                    {question.type.replace('_', ' ')}
                                </span>
                                <span className="text-gray-500 text-sm">Question {index + 1}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    className="w-16 h-8 text-sm border-gray-300 rounded"
                                    value={question.points}
                                    onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 0 })}
                                    placeholder="Pts"
                                />
                                <button onClick={() => removeQuestion(question.id)} className="text-red-500 hover:text-red-700 p-1">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Common Prompt */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Question Prompt</label>
                                <textarea
                                    className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
                                    rows={2}
                                    value={question.prompt}
                                    onChange={(e) => updateQuestion(question.id, { prompt: e.target.value })}
                                />
                            </div>

                            {/* Specific Editors */}
                            {question.type === 'mcq' && (
                                <MCQEditor
                                    question={question as any}
                                    onChange={(updates) => updateQuestion(question.id, updates)}
                                />
                            )}
                            {question.type === 'short_answer' && (
                                <ShortAnswerEditor
                                    question={question as any}
                                    onChange={(updates) => updateQuestion(question.id, updates)}
                                />
                            )}
                            {question.type === 'essay' && (
                                <EssayEditor
                                    question={question as any}
                                    onChange={(updates) => updateQuestion(question.id, updates)}
                                />
                            )}
                            {question.type === 'matching' && (
                                <MatchingEditor
                                    question={question as any}
                                    onChange={(updates) => updateQuestion(question.id, updates)}
                                />
                            )}
                            {question.type === 'ordering' && (
                                <OrderingEditor
                                    question={question as any}
                                    onChange={(updates) => updateQuestion(question.id, updates)}
                                />
                            )}
                            {question.type === 'sorting' && (
                                <SortingEditor
                                    question={question as any}
                                    onChange={(updates) => updateQuestion(question.id, updates)}
                                />
                            )}
                            {question.type === 'unscramble' && (
                                <UnscrambleEditor
                                    question={question as any}
                                    onChange={(updates) => updateQuestion(question.id, updates)}
                                />
                            )}
                            {question.type === 'fill_blank' && (
                                <FillBlankEditor
                                    question={question as any}
                                    onChange={(updates) => updateQuestion(question.id, updates)}
                                />
                            )}
                            {question.type === 'word_search' && (
                                <WordSearchEditor
                                    question={question as any}
                                    onChange={(updates) => updateQuestion(question.id, updates)}
                                />
                            )}
                            {question.type === 'crossword' && (
                                <CrosswordEditor
                                    question={question as any}
                                    onChange={(updates) => updateQuestion(question.id, updates)}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Button */}
            <div className="flex flex-wrap gap-2 pt-4">
                <MenuButton label="Multiple Choice" onClick={() => addQuestion('mcq')} />
                <MenuButton label="True/False" onClick={() => addQuestion('true_false')} />
                <MenuButton label="Short Answer" onClick={() => addQuestion('short_answer')} />
                <MenuButton label="Essay" onClick={() => addQuestion('essay')} />
                <MenuButton label="Ordering" onClick={() => addQuestion('ordering')} />
                <MenuButton label="Matching" onClick={() => addQuestion('matching')} />
                <MenuButton label="Fill Blank" onClick={() => addQuestion('fill_blank')} />
                <MenuButton label="Word Search" onClick={() => addQuestion('word_search')} />
                <MenuButton label="Crossword" onClick={() => addQuestion('crossword')} />
            </div>
        </div>
    )
}

function MenuButton({ label, onClick }: { label: string, onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
            <Plus className="-ml-0.5 mr-2 h-4 w-4" />
            {label}
        </button>
    )
}
