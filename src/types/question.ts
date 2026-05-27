export type DifficultyLevel = '입문' | '기본' | '심화';

export type Question = {
  id: number;
  question: string;
  difficulty: DifficultyLevel;
  techArea: string;
  followUpQuestions: string[];
  sourceFile: string;
};

export type QuestionListResponse = {
  total: number;
  questions: Question[];
};

export type CreateShareLinkResponse = {
  shareUrl: string;
};
