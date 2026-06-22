export type ProfileData = {
  nickname: string;
  email: string;
  userId: number;
  createdAt: string;
  // uploadedDocumentCount: number;
  // generatedQuestionCount: number;
  // sharedQuestionCount: number;
};

export type UpdateNicknameRequest = {
  nickname: string;
};

export type UpdateNicknameResponse = {
  nickname: string;
  userId: number;
  email: string;
  updatedAt: string;
};
