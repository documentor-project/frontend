import { useState, type SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useRegister } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import Logo from '@/components/Logo';

const INPUT_CLASS = '!h-[52px] shadow-[0_2px_6px_rgba(0,0,0,0.07)]';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { mutate: registerMutate, isPending } = useRegister();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    passwordConfirm?: string;
    general?: string;
  }>({});

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!name) next.name = '이름을 입력해주세요.';
    if (!email) next.email = '이메일을 입력해주세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = '올바른 이메일 형식을 입력해주세요.';
    if (!password) next.password = '비밀번호를 입력해주세요.';
    else if (password.length < 8) next.password = '비밀번호는 8자 이상이어야 합니다.';
    if (!passwordConfirm) next.passwordConfirm = '비밀번호 확인을 입력해주세요.';
    else if (password !== passwordConfirm) next.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!validate()) return;

    registerMutate(
      { name, email, password, passwordConfirm },
      {
        onSuccess: () => navigate(ROUTES.LOGIN),
        onError: () => setErrors({ general: '회원가입에 실패했습니다. 다시 시도해주세요.' }),
      },
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
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
          회원가입
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <Input
            label="이름"
            type="text"
            placeholder="홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            autoComplete="name"
            className={INPUT_CLASS}
          />

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
            placeholder="8자 이상 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="new-password"
            className={INPUT_CLASS}
          />

          <Input
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            error={errors.passwordConfirm}
            autoComplete="new-password"
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
            회원가입
          </Button>
        </form>

        <p
          className="text-center"
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-muted)',
            marginTop: 28,
          }}
        >
          이미 계정이 있으신가요?{' '}
          <Link to={ROUTES.LOGIN} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
