import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Toggle from '@/components/Toggle';
import useToast from '@/hooks/useToast';
import {
  getNotificationSettings,
  updateNotificationSettings,
  verifyEmail,
} from '@/api/notifications';
import { QUERY_KEYS } from '@/constants/queryKeys';

// ---- 상수 ----

const MIN_COUNT = 1;
const MAX_COUNT = 20;
const DEFAULT_SETTINGS = {
  email: '',
  dailyQuestionCount: 5,
  sendTime: '09:00',
  enabled: true,
};

const SEND_TIME_OPTIONS = [
  { value: '06:00', label: '오전 6:00' },
  { value: '07:00', label: '오전 7:00' },
  { value: '08:00', label: '오전 8:00' },
  { value: '09:00', label: '오전 9:00' },
  { value: '10:00', label: '오전 10:00' },
  { value: '11:00', label: '오전 11:00' },
  { value: '12:00', label: '오후 12:00' },
  { value: '13:00', label: '오후 1:00' },
  { value: '14:00', label: '오후 2:00' },
  { value: '15:00', label: '오후 3:00' },
  { value: '18:00', label: '오후 6:00' },
  { value: '20:00', label: '오후 8:00' },
  { value: '22:00', label: '오후 10:00' },
];

// ---- 페이지 ----

const NotificationSettingsPage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [count, setCount] = useState(DEFAULT_SETTINGS.dailyQuestionCount);
  const [sendTime, setSendTime] = useState(DEFAULT_SETTINGS.sendTime);
  const [enabled, setEnabled] = useState(DEFAULT_SETTINGS.enabled);

  useQuery({
    queryKey: QUERY_KEYS.NOTIFICATION_SETTINGS,
    queryFn: getNotificationSettings,
    enabled: false,
  });

  const saveMutation = useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.NOTIFICATION_SETTINGS, data);
      toast.success('알림 설정이 저장되었습니다.');
    },
    onError: () => {
      toast.error('알림 설정 저장에 실패했습니다.');
    },
  });

  const verifyMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      toast.success('인증 메일이 발송되었습니다.');
    },
    onError: () => {
      toast.error('인증 메일 발송에 실패했습니다.');
    },
  });

  const handleSave = () => {
    saveMutation.mutate({ email, dailyQuestionCount: count, sendTime, enabled });
  };

  const handleVerify = () => {
    if (!email.trim()) {
      toast.error('이메일 주소를 입력해주세요.');
      return;
    }
    verifyMutation.mutate({ email });
  };

  const handleCountChange = (delta: number) => {
    setCount((prev) => Math.min(MAX_COUNT, Math.max(MIN_COUNT, prev + delta)));
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1
          className="text-[length:var(--font-size-2xl)] font-bold mb-8"
          style={{ color: 'var(--color-text)' }}
        >
          알림 설정
        </h1>

        <div className="flex flex-col gap-8">
          {/* 이메일 주소 */}
          <div>
            <Input
              label="이메일 주소"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              suffix={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVerify}
                  isLoading={verifyMutation.isPending}
                >
                  인증하기
                </Button>
              }
            />
          </div>

          {/* 매일 받을 질문 개수 */}
          <div className="flex flex-col gap-[var(--spacing-sm)]">
            <p
              className="text-[length:var(--font-size-base)] font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              매일 받을 질문 개수
            </p>
            <div className="flex items-center gap-4">
              <div
                className="inline-flex items-center rounded-[var(--radius-md)]"
                style={{
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-white)',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleCountChange(-1)}
                  disabled={count <= MIN_COUNT}
                  className="flex items-center justify-center w-10 h-10 text-lg font-medium transition-colors rounded-l-[var(--radius-md)]"
                  style={{
                    color: count <= MIN_COUNT ? 'var(--color-gray-300)' : 'var(--color-text)',
                    background: 'none',
                    border: 'none',
                    cursor: count <= MIN_COUNT ? 'not-allowed' : 'pointer',
                  }}
                  aria-label="줄이기"
                >
                  −
                </button>
                <span
                  className="w-10 text-center text-[length:var(--font-size-lg)] font-semibold select-none"
                  style={{
                    color: 'var(--color-text)',
                    borderLeft: '1px solid var(--color-border)',
                    borderRight: '1px solid var(--color-border)',
                    lineHeight: '40px',
                  }}
                >
                  {count}
                </span>
                <button
                  type="button"
                  onClick={() => handleCountChange(1)}
                  disabled={count >= MAX_COUNT}
                  className="flex items-center justify-center w-10 h-10 text-lg font-medium transition-colors rounded-r-[var(--radius-md)]"
                  style={{
                    color: count >= MAX_COUNT ? 'var(--color-gray-300)' : 'var(--color-text)',
                    background: 'none',
                    border: 'none',
                    cursor: count >= MAX_COUNT ? 'not-allowed' : 'pointer',
                  }}
                  aria-label="늘리기"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 발송 시간 */}
          <div className="flex flex-col gap-[var(--spacing-sm)]">
            <p
              className="text-[length:var(--font-size-base)] font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              발송 시간
            </p>
            <div style={{ width: 200 }}>
              <Select value={sendTime} onChange={setSendTime}>
                <Select.Trigger />
                <Select.Content>
                  {SEND_TIME_OPTIONS.map((opt) => (
                    <Select.Item key={opt.value} value={opt.value}>
                      {opt.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
          </div>

          {/* 알림 활성화 */}
          <div className="flex flex-col gap-[var(--spacing-sm)]">
            <p
              className="text-[length:var(--font-size-base)] font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              알림 활성화
            </p>
            <Toggle checked={enabled} onChange={setEnabled} />
          </div>

          {/* 저장하기 */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSave}
            isLoading={saveMutation.isPending}
          >
            저장하기
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotificationSettingsPage;
