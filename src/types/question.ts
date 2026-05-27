export const QUESTION_COUNTS = [5, 10, 15, 20] as const;
export type QuestionCount = (typeof QUESTION_COUNTS)[number];

export const DIFFICULTY_LEVELS = ['입문', '기본', '심화'] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export const TECH_FIELDS = ['CS', 'Spring', 'JPA', 'Redis', '직접입력'] as const;
export type TechField = (typeof TECH_FIELDS)[number];

export type QuestionSettingsForm = {
  count: QuestionCount;
  difficulty: DifficultyLevel;
  techFields: TechField[];
  includeFollowUp: boolean;
};
