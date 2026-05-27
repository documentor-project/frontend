import instance from '@/api/instance';
import type { QuestionSettingsForm } from '@/types/question';

export const generateQuestions = (data: QuestionSettingsForm) =>
  instance.post('/questions/generate', data);
