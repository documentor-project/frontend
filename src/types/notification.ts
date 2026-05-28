export type NotificationSettings = {
  email: string;
  dailyQuestionCount: number;
  sendTime: string;
  enabled: boolean;
};

export type UpdateNotificationSettingsRequest = NotificationSettings;

export type VerifyEmailRequest = {
  email: string;
};
