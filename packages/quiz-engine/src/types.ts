export type SubjectKey = 'physics' | 'chemistry' | 'math' | 'computing' | 'pioneers';

export interface QuizQuestionData {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface QuizQuestion extends QuizQuestionData {
  id: string;
  subject: SubjectKey;
  conceptId: string;
  displayName: string;
  prerequisites: string[];
  gradeLevels: number[];
  estimatedTimeMinutes: number;
  commonMisconceptions: string[];
  tags: string[];
}

export interface QuizState {
  subject: SubjectKey;
  currentIndex: number;
  score: number;
  answered: boolean;
  questions: QuizQuestion[];
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  totalQuestions: number;
  title: string;
  message: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
}

export const SUBJECT_LABELS: Record<SubjectKey, string> = {
  physics: 'Physics',
  chemistry: 'Chemistry',
  math: 'Mathematics',
  computing: 'Computing',
  pioneers: 'Pioneers',
};

export const SUBJECT_ICONS: Record<SubjectKey, string> = {
  physics: '\u269B\uFE0F',
  chemistry: '\uD83E\uDDCA',
  math: '\uD83D\uDCD0',
  computing: '\uD83D\uDCBB',
  pioneers: '\uD83E\uDDEC',
};

export function getResultMetadata(percentage: number, score: number, maxScore: number): QuizResult {
  const totalQuestions = maxScore / 10;
  let title: string;
  let message: string;

  if (percentage === 100) {
    title = 'STEM Genius Master! \uD83C\uDF1F';
    message = 'Outstanding! Perfect score across all questions.';
  } else if (percentage >= 70) {
    title = 'STEM Scholar! \uD83C\uDF93';
    message = 'Impressive knowledge of core STEM concepts.';
  } else {
    title = 'Great Attempt! \uD83D\uDE80';
    message = 'Keep learning and practicing STEM concepts every day.';
  }

  return { score, total: maxScore, percentage, totalQuestions, title, message };
}
