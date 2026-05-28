export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  DOCUMENT_UPLOAD: '/documents/upload',
  QUESTION_SETTINGS: '/questions/settings/:documentId',
  QUESTION_LIST: '/questions',
  NOTIFICATION_SETTINGS: '/notifications/settings',
} as const;

export const buildQuestionSettingsPath = (documentId: number) =>
  `/questions/settings/${documentId}`;
