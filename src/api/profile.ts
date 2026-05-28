import instance from '@/api/instance';
import type { ProfileData, UpdateNicknameRequest, UpdateNicknameResponse } from '@/types/profile';

export const getProfile = async (): Promise<ProfileData> => {
  const { data } = await instance.get<ProfileData>('/profile');
  return data;
};

export const updateNickname = async (
  body: UpdateNicknameRequest,
): Promise<UpdateNicknameResponse> => {
  const { data } = await instance.patch<UpdateNicknameResponse>('/profile', body);
  return data;
};

export const deleteAccount = async (): Promise<void> => {
  await instance.delete('/users/me');
};
