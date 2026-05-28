export type ProfileData = {
  nickname: string;
  email: string;
  uploadedDocumentCount: number;
  generatedQuestionCount: number;
  sharedQuestionCount: number;
};

export type UpdateNicknameRequest = {
  nickname: string;
};

export type UpdateNicknameResponse = {
  nickname: string;
};
