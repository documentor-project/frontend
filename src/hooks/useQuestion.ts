import { useQuery, useMutation } from '@tanstack/react-query';
import {
  createQuestionGeneration,
  getQuestionSetDetail,
  createShareLink,
  getQuestionGenerationStatus,
} from '@/api/question';
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

export const useQuestionGenerationStatus = (generationId: number | null) =>
  useQuery({
    queryKey: QUERY_KEYS.QUESTION_GENERATION_STATUS(generationId ?? -1),
    queryFn: () => getQuestionGenerationStatus(generationId as number),
    enabled: generationId !== null, // generationId가 없으면 아예 요청 안 보냄
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'COMPLETED' || status === 'FAILED') {
        return false; // 더 이상 polling 안 함
      }
      return 2000; // 2초마다 재요청
    },
  });
