import { useQuery, useMutation } from '@tanstack/react-query';
import { PiShareNetwork, PiFile } from 'react-icons/pi';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import Card from '@/components/Card';
import useToast from '@/hooks/useToast';
import { getQuestions, createShareLink } from '@/api/questions';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { DifficultyLevel, Question } from '@/types/question';
import { useState } from 'react';

const DIFFICULTY_BADGE: Record<DifficultyLevel, string> = {
  입문: 'badge badge-green',
  기본: 'badge badge-purple',
  심화: 'badge badge-gray',
};

type FollowUpAccordionProps = {
  followUpQuestions: string[];
};

const FollowUpAccordion = ({ followUpQuestions }: FollowUpAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (followUpQuestions.length === 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-1 text-[length:var(--font-size-sm)] font-medium"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          color: 'var(--color-primary)',
        }}
      >
        꼬리질문 ({followUpQuestions.length})
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'transform 200ms ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-200"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <ul className="flex flex-col gap-1 pt-2 pb-1 pl-1">
            {followUpQuestions.map((fq, i) => (
              <li
                key={i}
                className="text-[length:var(--font-size-sm)]"
                style={{ color: 'var(--color-text-muted)' }}
              >
                · {fq}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// ---- 질문 카드 ----

type QuestionCardProps = {
  index: number;
  question: Question;
};

const QuestionCardItem = ({ index, question }: QuestionCardProps) => (
  <Card>
    <div className="flex flex-col gap-3">
      {/* 질문 */}
      <h3
        className="text-[length:var(--font-size-lg)] font-semibold leading-snug"
        style={{ color: 'var(--color-primary)', margin: 0 }}
      >
        {index}. {question.question}
      </h3>

      {/* 태그 */}
      <div className="flex gap-2 flex-wrap">
        <span className={DIFFICULTY_BADGE[question.difficulty]}>{question.difficulty}</span>
        <span className="badge badge-gray">{question.techArea}</span>
      </div>

      {/* 꼬리질문 */}
      <FollowUpAccordion followUpQuestions={question.followUpQuestions} />

      {/* 출처 파일 */}
      {question.sourceFile && (
        <p
          className="flex items-center gap-1 text-[length:var(--font-size-xs)]"
          style={{ color: 'var(--color-text-muted)', margin: 0 }}
        >
          <PiFile size={14} />
          {question.sourceFile}
        </p>
      )}
    </div>
  </Card>
);

// ---- 페이지 ----

const QuestionListPage = () => {
  const toast = useToast();

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.QUESTIONS,
    queryFn: getQuestions,
  });

  const shareMutation = useMutation({
    mutationFn: createShareLink,
    onSuccess: ({ shareUrl }) => {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
      toast.success('공유 링크가 클립보드에 복사되었습니다.');
    },
    onError: () => {
      toast.error('공유 링크 생성에 실패했습니다.');
    },
  });

  if (isLoading || !data) {
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
      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <h1
          className="text-[length:var(--font-size-2xl)] font-bold mb-6"
          style={{ color: 'var(--color-text)' }}
        >
          생성된 질문 목록
        </h1>

        {/* 질문 수 + 공유 버튼 */}
        <div className="flex items-center justify-between mb-6">
          <p
            className="text-[length:var(--font-size-sm)]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            총{' '}
            <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
              {data.total}개
            </span>{' '}
            질문
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => shareMutation.mutate()}
            isLoading={shareMutation.isPending}
            className="flex items-center gap-1.5"
          >
            <PiShareNetwork size={15} />
            공유 링크 생성
          </Button>
        </div>

        {/* 질문 목록 */}
        {data.questions.length === 0 ? (
          <div
            className="flex items-center justify-center h-48 rounded-[var(--radius-lg)] text-[length:var(--font-size-base)]"
            style={{ border: '1px dashed var(--color-border)', color: 'var(--color-text-muted)' }}
          >
            생성된 질문이 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {data.questions.map((q, i) => (
              <QuestionCardItem key={q.id} index={i + 1} question={q} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QuestionListPage;
