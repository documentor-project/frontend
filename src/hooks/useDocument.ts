import { useMutation, useQuery } from '@tanstack/react-query';
import { getDocumentDetail, uploadDocument } from '@/api/document';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { DOCUMENT_STATUS_POLL_INTERVAL_MS } from '@/constants/document';
import type { UploadDocumentRequest } from '@/types/document';

export const useUploadDocument = () =>
  useMutation({
    mutationFn: (body: UploadDocumentRequest) => uploadDocument(body),
  });

// 문서 분석이 끝날 때까지(status === 'READY' | 'FAILED') 상태를 폴링한다.
export const useDocumentStatus = (documentId: number | null) =>
  useQuery({
    queryKey: QUERY_KEYS.DOCUMENT_DETAIL(documentId ?? 0),
    queryFn: () => getDocumentDetail(documentId as number),
    enabled: documentId !== null,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'READY' || status === 'FAILED' ? false : DOCUMENT_STATUS_POLL_INTERVAL_MS;
    },
  });
