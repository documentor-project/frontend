import { useMutation } from '@tanstack/react-query';
import { uploadDocument } from '@/api/document';
import type { UploadDocumentRequest } from '@/types/document';

export const useUploadDocument = () =>
  useMutation({
    mutationFn: (body: UploadDocumentRequest) => uploadDocument(body),
  });
