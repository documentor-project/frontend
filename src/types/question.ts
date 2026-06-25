export const DIFFICULTY_LABEL: Record<QuestionDifficulty, string> = {
  BEGINNER: '입문',
  BASIC: '기본',
  ADVANCED: '심화',
};

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  CONCEPT: '개념',
  COMPARISON: '비교',
  PRACTICAL: '실무',
  TROUBLESHOOTING: '트러블슈팅',
};

export type QuestionDifficulty = 'BEGINNER' | 'BASIC' | 'ADVANCED';

export type QuestionField =
  | 'CS'
  | 'SPRING'
  | 'JPA'
  | 'REDIS'
  | 'DATABASE'
  | 'NETWORK'
  | 'OS'
  | 'OTHER';

export type QuestionType = 'CONCEPT' | 'COMPARISON' | 'PRACTICAL' | 'TROUBLESHOOTING';

export type GenerationStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export const QUESTION_COUNTS = [5, 10, 15, 20, 30] as const;
export type QuestionCount = (typeof QUESTION_COUNTS)[number];

export const DIFFICULTY_OPTIONS: { value: QuestionDifficulty; label: string }[] = [
  { value: 'BEGINNER', label: '입문' },
  { value: 'BASIC', label: '기본' },
  { value: 'ADVANCED', label: '심화' },
];

export const FIELD_OPTIONS: { value: QuestionField; label: string }[] = [
  { value: 'CS', label: 'CS' },
  { value: 'SPRING', label: 'Spring' },
  { value: 'JPA', label: 'JPA' },
  { value: 'REDIS', label: 'Redis' },
  { value: 'DATABASE', label: '데이터베이스' },
  { value: 'NETWORK', label: '네트워크' },
  { value: 'OS', label: 'OS' },
  { value: 'OTHER', label: '기타' },
];

export const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: 'CONCEPT', label: '개념' },
  { value: 'COMPARISON', label: '비교' },
  { value: 'PRACTICAL', label: '실무' },
  { value: 'TROUBLESHOOTING', label: '트러블슈팅' },
];

export type CreateQuestionGenerationRequest = {
  questionCount: number;
  difficulty: QuestionDifficulty;
  field: QuestionField;
  includeFollowUp: boolean;
  questionTypes: QuestionType[];
};

export type CreateQuestionGenerationResponse = {
  generationId: number;
  documentId: number;
  status: GenerationStatus;
  requestedQuestionCount: number;
  createdAt: string;
};

export type QuestionSetSummary = {
  questionSetId: number;
  title: string;
  documentId: number;
  documentTitle: string;
  questionCount: number;
  difficulty: QuestionDifficulty;
  createdAt: string;
};

export type QuestionSetListResponse = {
  content: QuestionSetSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type QuestionSource = {
  documentId: number;
  documentTitle?: string; // 질문 세트 상세 응답의 source에는 포함되지 않음 (세트 최상위 documentTitle 사용)
  page: number;
  chunkIndex: number;
  snippet: string;
};

export type FollowUpQuestion = {
  followUpQuestionId: number;
  content: string;
};

export type QuestionDetailItem = {
  questionId: number;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  content: string;
  source: QuestionSource;
  followUps: FollowUpQuestion[];
  createdAt: string;
};

export type QuestionSetDetail = {
  questionSetId: number;
  title: string;
  documentId: number;
  documentTitle: string;
  difficulty: QuestionDifficulty;
  questions: QuestionDetailItem[];
  createdAt: string;
};

export type CreateShareLinkRequest = {
  expiresAt: string;
};

export type CreateShareLinkResponse = {
  shareId: number;
  shareToken: string;
  shareUrl: string;
  expiresAt: string;
  createdAt: string;
};

export type QuestionGenerationStatusResponse = {
  generationId: number;
  documentId: number;
  status: GenerationStatus;
  progress: number;
  createdQuestionCount: number;
  skippedQuestionCount: number;
  skipReason: string | null;
  questionSetId: number | null; // 완료 전엔 null
  createdAt: string;
  completedAt: string | null;
};
