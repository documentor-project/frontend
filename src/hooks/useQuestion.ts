import { useMutation } from '@tanstack/react-query';
import { generateQuestions } from '@/api/question';
import type { QuestionSettingsForm } from '@/types/question';

export const useGenerateQuestions = () =>
  useMutation({
    mutationFn: (data: QuestionSettingsForm) => generateQuestions(data),
  });
