import instance from '@/api/instance';
import type {
  CreateQuestionGenerationRequest,
  CreateQuestionGenerationResponse,
  QuestionSetListResponse,
} from '@/types/question';

export const createQuestionGeneration = async (
  documentId: number,
  body: CreateQuestionGenerationRequest,
): Promise<CreateQuestionGenerationResponse> => {
  const { data } = await instance.post<CreateQuestionGenerationResponse>(
    `/api/documents/${documentId}/question-generations`,
    body,
  );
  return data;
};

export const getQuestionSets = async (): Promise<QuestionSetListResponse> => {
  const { data } = await instance.get<QuestionSetListResponse>('/api/question-sets');
  return data;
};
