import instance from '@/api/instance';
import type {
  NotificationSettings,
  UpdateNotificationSettingsRequest,
  VerifyEmailRequest,
} from '@/types/notification';

export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  const { data } = await instance.get<NotificationSettings>('/api/notification-settings/me');
  return data;
};

export const updateNotificationSettings = async (
  body: UpdateNotificationSettingsRequest,
): Promise<NotificationSettings> => {
  const { data } = await instance.put<NotificationSettings>('/api/notification-settings/me', body);
  return data;
};

export const verifyEmail = async (body: VerifyEmailRequest): Promise<void> => {
  await instance.post('/notifications/email/verify', body);
};
