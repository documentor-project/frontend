import { useState, type SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useLogin } from '@/hooks/useAuth';
import { kakaoLogin } from '@/api/auth';
import { ROUTES } from '@/router';
import Logo from '@/components/Logo';

const INPUT_CLASS = '!h-[52px] shadow-[0_2px_6px_rgba(0,0,0,0.07)]';

const LoginPage = () => {
  const navigate = useNavigate();
  const { mutate: loginMutate, isPending } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!email) next.email = '이메일을 입력해주세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = '올바른 이메일 형식을 입력해주세요.';
    if (!password) next.password = '비밀번호를 입력해주세요.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!validate()) return;

    loginMutate(
      { email, password },
      {
        onSuccess: () => navigate(ROUTES.QUESTION_LIST),
        onError: () => setErrors({ general: '이메일 또는 비밀번호가 올바르지 않습니다.' }),
      },
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="mb-8">
        <Logo />
      </div>

      <div
        className="w-full max-w-[500px] rounded-2xl"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-md)',
          padding: '48px 40px 44px',
        }}
      >
        <h2
          className="text-center"
          style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', marginBottom: 32 }}
        >
          로그인
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <Input
            label="이메일"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
            className={INPUT_CLASS}
          />

          <Input
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
            className={INPUT_CLASS}
          />

          {errors.general && (
            <p
              className="text-center"
              style={{ fontSize: 'var(--font-size-sm)', color: '#EF4444' }}
            >
              {errors.general}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isPending}
            style={{ height: 52, marginTop: 4 }}
          >
            로그인
          </Button>
        </form>

        <div className="flex items-center gap-4" style={{ margin: '28px 0' }}>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
            또는
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
        </div>

        <Button type="button" variant="kakao" fullWidth onClick={kakaoLogin} style={{ height: 52 }}>
          카카오로 시작하기
        </Button>

        <p
          className="text-center"
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-muted)',
            marginTop: 28,
          }}
        >
          계정이 없으신가요?{' '}
          <Link to={ROUTES.REGISTER} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
