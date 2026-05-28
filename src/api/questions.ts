import instance from '@/api/instance';
import type { QuestionListResponse, CreateShareLinkResponse } from '@/types/question';

export const getQuestions = async (): Promise<QuestionListResponse> => {
  const { data } = await instance.get<QuestionListResponse>('/questions');
  return data;
};

export const createShareLink = async (): Promise<CreateShareLinkResponse> => {
  const { data } = await instance.post<CreateShareLinkResponse>('/questions/share');
  return data;
};
