import { useQuery, useMutation } from '@tanstack/react-query';
import { createQuestionGeneration, getQuestionSetDetail, createShareLink } from '@/api/question';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { CreateQuestionGenerationRequest, CreateShareLinkRequest } from '@/types/question';

export const useGenerateQuestions = (documentId: number) =>
  useMutation({
    mutationFn: (body: CreateQuestionGenerationRequest) =>
      createQuestionGeneration(documentId, body),
  });

export const useQuestionSetDetail = (questionSetId: number) =>
  useQuery({
    queryKey: QUERY_KEYS.QUESTION_SET_DETAIL(questionSetId),
    queryFn: () => getQuestionSetDetail(questionSetId),
    enabled: !Number.isNaN(questionSetId),
  });

export const useCreateShareLink = (questionSetId: number) =>
  useMutation({
    mutationFn: (body: CreateShareLinkRequest) => createShareLink(questionSetId, body),
  });
