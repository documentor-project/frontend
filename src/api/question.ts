import instance from '@/api/instance';
import type {
  CreateQuestionGenerationRequest,
  CreateQuestionGenerationResponse,
  QuestionSetListResponse,
  QuestionSetDetail,
  CreateShareLinkRequest,
  CreateShareLinkResponse,
  QuestionGenerationStatusResponse,
} from '@/types/question';

export const getQuestionSetDetail = async (questionSetId: number): Promise<QuestionSetDetail> => {
  const { data } = await instance.get<QuestionSetDetail>(`/api/question-sets/${questionSetId}`);
  return data;
};

export const createShareLink = async (
  questionSetId: number,
  body: CreateShareLinkRequest,
): Promise<CreateShareLinkResponse> => {
  const { data } = await instance.post<CreateShareLinkResponse>(
    `/api/question-sets/${questionSetId}/share-links`,
    body,
  );
  return data;
};

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

export const getQuestionGenerationStatus = async (
  generationId: number,
): Promise<QuestionGenerationStatusResponse> => {
  const { data } = await instance.get<QuestionGenerationStatusResponse>(
    `/api/question-generations/${generationId}`,
  );
  return data;
};
