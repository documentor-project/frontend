export type DocumentStatus = 'UPLOADED' | 'PARSING' | 'EMBEDDING' | 'READY' | 'FAILED';

export type FileType = 'PDF' | 'MD' | 'TXT';

export const ACCEPTED_EXTENSIONS = ['.pdf', '.md', '.txt'] as const;

export type UploadDocumentRequest = {
  file: File;
  title: string;
};

export type UploadDocumentResponse = {
  documentId: number;
  title: string;
  fileName: string;
  fileType: FileType;
  status: DocumentStatus;
  createdAt: string;
};

export type DocumentDetail = {
  documentId: number;
  title: string;
  fileName: string;
  fileType: FileType;
  status: DocumentStatus;
  chunkCount: number;
  createdAt: string;
};
