import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import useToast from '@/hooks/useToast';
import { getProfile, updateNickname, deleteAccount } from '@/api/profile';
import { QUERY_KEYS } from '@/constants/queryKeys';

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: getProfile,
  });

  const updateNicknameMutation = useMutation({
    mutationFn: updateNickname,
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.PROFILE, (prev: typeof profile) =>
        prev ? { ...prev, nickname: data.nickname } : prev,
      );
      setIsEditingNickname(false);
      toast.success('닉네임이 저장되었습니다.');
    },
    onError: () => {
      toast.error('닉네임 저장에 실패했습니다.');
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      toast.success('회원 탈퇴가 완료되었습니다.');
      setIsDeleteModalOpen(false);
    },
    onError: () => {
      toast.error('회원 탈퇴에 실패했습니다.');
    },
  });

  const handleEditClick = () => {
    setNicknameInput(profile?.nickname ?? '');
    setIsEditingNickname(true);
  };

  const handleSave = () => {
    const trimmed = nicknameInput.trim();
    if (!trimmed) {
      toast.error('닉네임을 입력해주세요.');
      return;
    }
    updateNicknameMutation.mutate({ nickname: trimmed });
  };

  const handleDeleteConfirm = () => {
    deleteAccountMutation.mutate();
  };

  const avatarLetter = profile?.nickname?.charAt(0).toUpperCase() ?? '?';

  if (isLoading) {
    return (
      <Layout>
        <div
          className="flex items-center justify-center h-64 text-[length:var(--font-size-base)]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          불러오는 중...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1
          className="text-[length:var(--font-size-2xl)] font-bold mb-8"
          style={{ color: 'var(--color-text)' }}
        >
          내 프로필
        </h1>

        {/* 아바타 + 기본 정보 */}
        <div className="flex items-center gap-5 mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
            }}
          >
            {avatarLetter}
          </div>
          <div>
            <p
              className="text-[length:var(--font-size-lg)] font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              {profile?.nickname}
            </p>
            <p
              className="text-[length:var(--font-size-base)] mt-0.5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {profile?.email}
            </p>
          </div>
        </div>

        {/* 이메일 */}
        <div className="mb-6">
          <Input label="이메일" value={profile?.email ?? ''} disabled readOnly />
        </div>

        {/* 닉네임 */}
        <div className="mb-8">
          <Input
            label="닉네임"
            value={isEditingNickname ? nicknameInput : (profile?.nickname ?? '')}
            disabled={!isEditingNickname}
            readOnly={!isEditingNickname}
            onChange={(e) => setNicknameInput(e.target.value)}
            suffix={
              !isEditingNickname ? (
                <Button variant="outline" size="sm" onClick={handleEditClick}>
                  수정
                </Button>
              ) : undefined
            }
          />
        </div>

        {/* 내 활동 요약 */}
        <div className="mb-8">
          <p
            className="text-[length:var(--font-size-base)] font-semibold mb-3"
            style={{ color: 'var(--color-text)' }}
          >
            내 활동 요약
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              /*백엔드 API 준비 중*/
              { value: '-', label: '업로드한 문서' },
              { value: '-', label: '생성된 질문' },
              { value: '-', label: '공유한 질문' },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center py-6 rounded-[var(--radius-lg)]"
                style={{
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-white)',
                }}
              >
                <span className="text-3xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
                  {value}
                </span>
                <span
                  className="text-[length:var(--font-size-sm)]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 저장하기 */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSave}
          disabled={!isEditingNickname}
          isLoading={updateNicknameMutation.isPending}
          className="mb-8"
        >
          저장하기
        </Button>

        {/* 구분선 */}
        <hr style={{ borderColor: 'var(--color-border)' }} className="mb-6" />

        {/* 위험 구역 */}
        <div>
          <p className="text-[length:var(--font-size-base)] font-semibold text-[#EF4444] mb-3">
            위험 구역
          </p>
          <Button variant="danger" size="sm" onClick={() => setIsDeleteModalOpen(true)}>
            회원 탈퇴
          </Button>
        </div>
      </div>

      {/* 회원 탈퇴 확인 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="회원 탈퇴"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleteAccountMutation.isPending}
            >
              취소
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteConfirm}
              isLoading={deleteAccountMutation.isPending}
            >
              탈퇴하기
            </Button>
          </>
        }
      >
        정말로 탈퇴하시겠어요? 탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.
      </Modal>
    </Layout>
  );
};

export default ProfilePage;
