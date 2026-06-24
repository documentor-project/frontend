export const QUERY_KEYS = {
  PROFILE: ['profile'] as const,
  NOTIFICATION_SETTINGS: ['notification-settings'] as const,
  QUESTION_SETS: ['question-sets'] as const,
  QUESTION_SET_DETAIL: (questionSetId: number) => ['question-sets', questionSetId] as const,
  QUESTION_GENERATION_STATUS: (generationId: number) =>
    ['question-generations', generationId] as const,
  DOCUMENT_DETAIL: (documentId: number) => ['document', documentId] as const,
} as const;
