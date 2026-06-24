export type NotificationSettings = {
  enabled: boolean;
  email: string;
  sendTime: string;
  questionCount: number;
  questionSetId: number;
  questionSetTitle: string;
  updatedAt: string;
};

export type UpdateNotificationSettingsRequest = {
  enabled: boolean;
  email: string;
  sendTime: string;
  questionCount: number;
  questionSetId: number;
};

export type VerifyEmailRequest = {
  email: string;
};
