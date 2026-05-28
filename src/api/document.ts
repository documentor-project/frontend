import instance from '@/api/instance';
import type { UploadDocumentRequest, UploadDocumentResponse } from '@/types/document';

export const uploadDocument = async (
  body: UploadDocumentRequest,
): Promise<UploadDocumentResponse> => {
  const formData = new FormData();
  formData.append('file', body.file);
  formData.append('title', body.title);

  const { data } = await instance.post<UploadDocumentResponse>('/api/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
