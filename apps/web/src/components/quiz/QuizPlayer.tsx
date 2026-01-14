"use client"

import { useState } from 'react'
import { QuizContent, Question } from '@/types/quiz'
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ShortAnswerRenderer } from './renderers/ShortAnswerRenderer'
import { EssayRenderer } from './renderers/EssayRenderer'
import { MatchingRenderer } from './renderers/MatchingRenderer'
import { OrderingRenderer } from './renderers/OrderingRenderer'
import { SortingRenderer } from './renderers/SortingRenderer'
import { UnscrambleRenderer } from './renderers/UnscrambleRenderer'
import { FillBlankRenderer } from './renderers/FillBlankRenderer'
import { WordSearchRenderer } from './renderers/WordSearchRenderer'
import { CrosswordRenderer } from './renderers/CrosswordRenderer'

interface QuizPlayerProps {
    content: string // JSON
    onComplete: (score: number, passed: boolean) => void
}

export function QuizPlayer({ content, onComplete }: QuizPlayerProps) {
    const [quiz] = useState<QuizContent>(() => {
        try { return JSON.parse(content) }
        catch { return { questions: [], settings: { passingScorePercentage: 70, shuffleQuestions: false, showResultsImmediately: true } } }
    })

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, any>>({})
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [score, setScore] = useState(0)

    const currentQuestion = quiz.questions[currentQuestionIndex]
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1

    const handleAnswer = (val: any) => {
        if (isSubmitted) return
        setAnswers({ ...answers, [currentQuestion.id]: val })
    }

    const calculateScore = () => {
        let earnedPoints = 0
        let totalPoints = 0

        quiz.questions.forEach(q => {
            totalPoints += q.points
            const answer = answers[q.id]
            if (!answer) return

            // Grading Logic
            if (q.type === 'mcq' || q.type === 'true_false') {
                // Single/Multi choice logic
                if (!q.allowMultiple) {
                    const correctOption = q.options.find(o => o.isCorrect)
                    if (correctOption && answer === correctOption.id) {
                        earnedPoints += q.points
                    }
                } else {
                    const correctIds = q.options.filter(o => o.isCorrect).map(o => o.id).sort().join(',')
                    const userIds = (Array.isArray(answer) ? answer : []).sort().join(',')
                    if (correctIds === userIds) earnedPoints += q.points
                }
            } else if (q.type === 'short_answer') {
                const userAnswer = String(answer || '').trim()
                const correctAnswers = q.correctAnswers || []
                const matches = correctAnswers.some((correct: string) => {
                    const normalizedCorrect = q.caseSensitive ? correct : correct.toLowerCase()
                    const normalizedUser = q.caseSensitive ? userAnswer : userAnswer.toLowerCase()
                    return normalizedCorrect === normalizedUser
                })
                if (matches) earnedPoints += q.points
            } else if (q.type === 'matching') {
                const userMatches = answer as Record<string, string>
                const allCorrect = q.pairs.every((pair: any) => userMatches?.[pair.left] === pair.right)
                if (allCorrect) earnedPoints += q.points
            } else if (q.type === 'ordering') {
                const userOrder = answer as string[]
                const correctOrder = q.items.map((item: any) => item.id).join(',')
                const userOrderStr = (userOrder || []).join(',')
                if (correctOrder === userOrderStr) earnedPoints += q.points
            } else if (q.type === 'sorting') {
                const userSorting = answer as Record<string, string>
                const allCorrect = q.items.every((item: any) => userSorting?.[item.id] === item.categoryId)
                if (allCorrect) earnedPoints += q.points
            } else if (q.type === 'unscramble') {
                const userAnswer = String(answer || '').trim()
                const correct = q.correctSequence.trim()
                if (userAnswer.toLowerCase() === correct.toLowerCase()) earnedPoints += q.points
            } else if (q.type === 'fill_blank') {
                const userAnswers = (answer as string[]) || []
                const allCorrect = q.answers.every((acceptableAnswers, idx) => {
                    const userVal = (userAnswers[idx] || '').trim()
                    return acceptableAnswers.some(correct => {
                        const normCorrect = q.caseSensitive ? correct : correct.toLowerCase()
                        const normUser = q.caseSensitive ? userVal : userVal.toLowerCase()
                        return normCorrect === normUser
                    })
                })
                if (allCorrect) earnedPoints += q.points
            } else if (q.type === 'word_search') {
                const found = (answer as string[]) || []
                const allFound = q.words.every(w => found.some(f => f.toLowerCase() === w.toLowerCase()))
                if (allFound) earnedPoints += q.points
            } else if (q.type === 'crossword') {
                const userGrid = (answer as Record<string, string>) || {}
                const allCorrect = q.clues.every(clue => {
                    const chars = clue.answer.toUpperCase().split('')
                    return chars.every((char, i) => {
                        const r = clue.direction === 'across' ? clue.row : clue.row + i
                        const c = clue.direction === 'across' ? clue.col + i : clue.col
                        return userGrid[`${r}-${c}`]?.toUpperCase() === char
                    })
                })
                if (allCorrect) earnedPoints += q.points
            } else {
                // Manual grading needed (Essay, etc.) - no auto-grade
            }
        })

        return { earned: earnedPoints, total: totalPoints }
    }

    const submitQuiz = () => {
        const { earned, total } = calculateScore()
        setScore(earned)
        setIsSubmitted(true)

        const percentage = total === 0 ? 0 : (earned / total) * 100
        const passed = percentage >= quiz.settings.passingScorePercentage
        onComplete(earned, passed)
    }

    const nextQuestion = () => {
        if (isLastQuestion) {
            submitQuiz()
        } else {
            setCurrentQuestionIndex(prev => prev + 1)
        }
    }

    if (!currentQuestion) return <div>Invalid Quiz Data</div>

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border p-8">
            {!isSubmitted ? (
                <>
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="h-2 bg-gray-100 rounded-full">
                            <div
                                className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                                style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium">
                            <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                            <span>{currentQuestion.points} Points</span>
                        </div>
                    </div>

                    {/* Question Prompt */}
                    <div className="mb-8">
                        <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded mb-4 uppercase tracking-wide">
                            {currentQuestion.type.replace('_', ' ')}
                        </span>
                        <h2 className="text-xl font-bold text-gray-900">{currentQuestion.prompt}</h2>
                    </div>

                    {/* Renderer */}
                    <div className="mb-8">
                        {currentQuestion.type === 'mcq' && (
                            <MCQRenderer
                                question={currentQuestion as any}
                                value={answers[currentQuestion.id]}
                                onChange={handleAnswer}
                            />
                        )}
                        {currentQuestion.type === 'short_answer' && (
                            <ShortAnswerRenderer
                                value={answers[currentQuestion.id]}
                                onChange={handleAnswer}
                            />
                        )}
                        {currentQuestion.type === 'essay' && (
                            <EssayRenderer
                                value={answers[currentQuestion.id]}
                                onChange={handleAnswer}
                                minWords={(currentQuestion as any).minWords}
                            />
                        )}
                        {currentQuestion.type === 'matching' && (
                            <MatchingRenderer
                                pairs={(currentQuestion as any).pairs}
                                value={answers[currentQuestion.id]}
                                onChange={handleAnswer}
                            />
                        )}
                        {currentQuestion.type === 'ordering' && (
                            <OrderingRenderer
                                items={(currentQuestion as any).items}
                                value={answers[currentQuestion.id]}
                                onChange={handleAnswer}
                            />
                        )}
                        {currentQuestion.type === 'sorting' && (
                            <SortingRenderer
                                categories={(currentQuestion as any).categories}
                                items={(currentQuestion as any).items}
                                value={answers[currentQuestion.id]}
                                onChange={handleAnswer}
                            />
                        )}
                        {currentQuestion.type === 'unscramble' && (
                            <UnscrambleRenderer
                                mode={(currentQuestion as any).mode}
                                correctSequence={(currentQuestion as any).correctSequence}
                                value={answers[currentQuestion.id]}
                                onChange={handleAnswer}
                            />
                        )}
                        {currentQuestion.type === 'fill_blank' && (
                            <FillBlankRenderer
                                template={(currentQuestion as any).template}
                                value={answers[currentQuestion.id]}
                                onChange={handleAnswer}
                            />
                        )}
                        {currentQuestion.type === 'word_search' && (
                            <WordSearchRenderer
                                words={(currentQuestion as any).words}
                                grid={(currentQuestion as any).grid}
                                value={answers[currentQuestion.id]}
                                onChange={handleAnswer}
                            />
                        )}
                        {currentQuestion.type === 'crossword' && (
                            <CrosswordRenderer
                                clues={(currentQuestion as any).clues}
                                gridSize={(currentQuestion as any).gridSize}
                                value={answers[currentQuestion.id]}
                                onChange={handleAnswer}
                            />
                        )}
                        {(currentQuestion.type !== 'mcq' && currentQuestion.type !== 'short_answer' && currentQuestion.type !== 'essay' && currentQuestion.type !== 'matching' && currentQuestion.type !== 'ordering' && currentQuestion.type !== 'sorting' && currentQuestion.type !== 'unscramble' && currentQuestion.type !== 'fill_blank' && currentQuestion.type !== 'word_search' && currentQuestion.type !== 'crossword') && (
                            <div className="bg-yellow-50 p-4 rounded text-yellow-800 text-sm">
                                No renderer implementation for <strong>{currentQuestion.type}</strong> yet.
                                <br />
                                <button onClick={() => handleAnswer('dummy')} className="underline mt-2">
                                    Click here to mark answered (debug)
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-end">
                        <button
                            onClick={nextQuestion}
                            className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
                        >
                            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center py-12">
                    <div className="mb-6 inline-flex p-4 rounded-full bg-indigo-50">
                        {score / (quiz.questions.reduce((a, b) => a + b.points, 0)) > 0.7
                            ? <CheckCircle className="w-12 h-12 text-green-500" />
                            : <XCircle className="w-12 h-12 text-red-500" />
                        }
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
                    <p className="text-gray-500 mb-8">
                        You scored {score} points.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center text-indigo-600 font-medium hover:underline"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Retake Quiz
                    </button>
                </div>
            )}
        </div>
    )
}

function MCQRenderer({ question, value, onChange }: { question: any, value: any, onChange: (val: any) => void }) {
    const isMulti = question.allowMultiple

    const toggle = (id: string) => {
        if (isMulti) {
            const current = Array.isArray(value) ? value : []
            if (current.includes(id)) onChange(current.filter((c: string) => c !== id))
            else onChange([...current, id])
        } else {
            onChange(id)
        }
    }

    return (
        <div className="space-y-3">
            {question.options.map((opt: any) => {
                const isSelected = isMulti ? value?.includes(opt.id) : value === opt.id
                return (
                    <button
                        key={opt.id}
                        onClick={() => toggle(opt.id)}
                        className={cn(
                            "w-full flex items-center p-4 rounded-lg border-2 text-left transition-all",
                            isSelected
                                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                        )}
                    >
                        <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4",
                            isSelected ? "border-indigo-600" : "border-gray-300"
                        )}>
                            {isSelected && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
                        </div>
                        <span className="font-medium">{opt.text}</span>
                    </button>
                )
            })}
        </div>
    )
}
