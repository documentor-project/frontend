export type DocumentCategory =
  | 'backend'
  | 'frontend'
  | 'infra'
  | 'algorithm'
  | 'database'
  | 'other';

export const DOCUMENT_CATEGORIES: { value: DocumentCategory; label: string }[] = [
  { value: 'backend', label: '백엔드' },
  { value: 'frontend', label: '프론트엔드' },
  { value: 'infra', label: '인프라/DevOps' },
  { value: 'algorithm', label: '알고리즘/자료구조' },
  { value: 'database', label: '데이터베이스' },
  { value: 'other', label: '기타' },
];

export const ACCEPTED_EXTENSIONS = ['.pdf', '.md', '.txt'] as const;

export type UploadDocumentRequest = {
  file: File;
  title: string;
  category: DocumentCategory;
};

export type UploadDocumentResponse = {
  documentId: number;
  title: string;
  status: 'analyzing' | 'done';
};
