import instance from '@/api/instance';
import type {
  NotificationSettings,
  UpdateNotificationSettingsRequest,
  VerifyEmailRequest,
} from '@/types/notification';

export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  const { data } = await instance.get<NotificationSettings>('/notifications/settings');
  return data;
};

export const updateNotificationSettings = async (
  body: UpdateNotificationSettingsRequest,
): Promise<NotificationSettings> => {
  const { data } = await instance.patch<NotificationSettings>('/notifications/settings', body);
  return data;
};

export const verifyEmail = async (body: VerifyEmailRequest): Promise<void> => {
  await instance.post('/notifications/email/verify', body);
};
