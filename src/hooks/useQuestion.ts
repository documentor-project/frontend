import { useMutation } from '@tanstack/react-query';
import { createQuestionGeneration } from '@/api/question';
import type { CreateQuestionGenerationRequest } from '@/types/question';

export const useGenerateQuestions = (documentId: number) =>
  useMutation({
    mutationFn: (body: CreateQuestionGenerationRequest) =>
      createQuestionGeneration(documentId, body),
  });
