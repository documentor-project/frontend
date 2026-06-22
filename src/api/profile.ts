import instance from '@/api/instance';
import type { ProfileData, UpdateNicknameRequest, UpdateNicknameResponse } from '@/types/profile';

export const getProfile = async (): Promise<ProfileData> => {
  const { data } = await instance.get<ProfileData>('/api/users/me');
  return data;
};

export const updateNickname = async (
  body: UpdateNicknameRequest,
): Promise<UpdateNicknameResponse> => {
  const { data } = await instance.patch<UpdateNicknameResponse>('/api/users/me', body);
  return data;
};

export const deleteAccount = async (): Promise<void> => {
  await instance.delete('/api/users/me');
};
