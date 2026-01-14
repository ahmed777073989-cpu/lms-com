export type QuestionType =
    | 'mcq'
    | 'fill_blank'
    | 'matching'
    | 'ordering'
    | 'true_false'
    | 'short_answer'
    | 'essay'
    | 'sorting' // Group items into categories
    | 'unscramble' // Unscramble letters/words
    | 'word_search'
    | 'crossword';

export interface BaseQuestion {
    id: string;
    type: QuestionType;
    prompt: string;
    points: number;
    mediaUrl?: string; // Optional image/audio
}

export interface MCQQuestion extends BaseQuestion {
    type: 'mcq' | 'true_false';
    options: { id: string; text: string; isCorrect: boolean }[];
    allowMultiple: boolean;
}

export interface ShortAnswerQuestion extends BaseQuestion {
    type: 'short_answer';
    correctAnswers: string[]; // List of acceptable answers
    caseSensitive: boolean;
}

export interface EssayQuestion extends BaseQuestion {
    type: 'essay';
    minWords?: number;
}

export interface MatchingQuestion extends BaseQuestion {
    type: 'matching';
    pairs: { left: string; right: string }[]; // e.g., "Apple" -> "Red"
}

export interface OrderingQuestion extends BaseQuestion {
    type: 'ordering';
    items: { id: string; text: string }[]; // Correct order
}

export interface SortingQuestion extends BaseQuestion {
    type: 'sorting';
    categories: { id: string; name: string }[];
    items: { id: string; text: string; categoryId: string }[];
}

export interface UnscrambleQuestion extends BaseQuestion {
    type: 'unscramble';
    mode: 'letters' | 'sentence';
    correctSequence: string; // The final word or sentence
}

export interface FillBlankQuestion extends BaseQuestion {
    type: 'fill_blank';
    template: string; // Text with {{blank}} markers
    answers: string[][]; // Array of acceptable answers for each blank
    caseSensitive: boolean;
}

export interface WordSearchQuestion extends BaseQuestion {
    type: 'word_search';
    words: string[]; // Words to find
    gridSize: number; // e.g., 10 for 10x10
    grid: string[][]; // Pre-generated grid
}

export interface CrosswordQuestion extends BaseQuestion {
    type: 'crossword';
    clues: {
        number: number;
        direction: 'across' | 'down';
        clue: string;
        answer: string;
        row: number;
        col: number;
    }[];
    gridSize: { rows: number; cols: number };
}

// Union Type
export type Question =
    | MCQQuestion
    | ShortAnswerQuestion
    | EssayQuestion
    | MatchingQuestion
    | OrderingQuestion
    | SortingQuestion
    | UnscrambleQuestion
    | FillBlankQuestion
    | WordSearchQuestion
    | CrosswordQuestion;

export interface QuizSettings {
    timeLimitSeconds?: number;
    passingScorePercentage: number;
    shuffleQuestions: boolean;
    showResultsImmediately: boolean;
}

export interface QuizContent {
    questions: Question[];
    settings: QuizSettings;
}
