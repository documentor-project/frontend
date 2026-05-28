import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PiCheck } from 'react-icons/pi';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import Toggle from '@/components/Toggle';
import { useGenerateQuestions } from '@/hooks/useQuestion';
import { ROUTES } from '@/constants/routes';
import {
  QUESTION_COUNTS,
  DIFFICULTY_OPTIONS,
  FIELD_OPTIONS,
  QUESTION_TYPE_OPTIONS,
  type QuestionCount,
  type QuestionDifficulty,
  type QuestionField,
  type QuestionType,
} from '@/types/question';

// ---- Section ----

type SectionProps = {
  label: string;
  children: React.ReactNode;
};

const Section = ({ label, children }: SectionProps) => (
  <div className="flex flex-col gap-3">
    <span className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
      {label}
    </span>
    {children}
  </div>
);

// ---- Page ----

const QuestionSettingsPage = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const parsedDocumentId = Number(documentId);

  const { mutate, isPending } = useGenerateQuestions(parsedDocumentId);

  const [count, setCount] = useState<QuestionCount>(10);
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>('BASIC');
  const [field, setField] = useState<QuestionField>('CS');
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>(['CONCEPT']);
  const [includeFollowUp, setIncludeFollowUp] = useState(true);
  const [error, setError] = useState('');

  const toggleQuestionType = (type: QuestionType) => {
    setQuestionTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleSubmit = () => {
    if (!documentId || isNaN(parsedDocumentId)) {
      setError('문서 정보를 찾을 수 없습니다.');
      return;
    }
    if (questionTypes.length === 0) {
      setError('질문 유형을 최소 하나 선택해주세요.');
      return;
    }
    setError('');

    mutate(
      {
        questionCount: count,
        difficulty,
        field,
        includeFollowUp,
        questionTypes,
      },
      {
        onSuccess: () => navigate(ROUTES.QUESTION_LIST),
        onError: () => setError('질문 생성에 실패했습니다. 다시 시도해주세요.'),
      },
    );
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
        질문 생성 설정
      </h1>

      <div className="flex flex-col gap-8">
        <Section label="질문 개수">
          <div className="flex gap-2">
            {QUESTION_COUNTS.map((c) => (
              <Button
                key={c}
                type="button"
                variant="chip"
                selected={count === c}
                onClick={() => setCount(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        </Section>

        <Section label="난이도">
          <div className="flex gap-2">
            {DIFFICULTY_OPTIONS.map(({ value, label }) => (
              <Button
                key={value}
                type="button"
                variant="chip"
                selected={difficulty === value}
                onClick={() => setDifficulty(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </Section>

        <Section label="기술 분야">
          <div className="flex flex-wrap gap-2">
            {FIELD_OPTIONS.map(({ value, label }) => (
              <Button
                key={value}
                type="button"
                variant="chip"
                selected={field === value}
                onClick={() => setField(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </Section>

        <Section label="질문 유형">
          <div className="flex flex-wrap gap-2">
            {QUESTION_TYPE_OPTIONS.map(({ value, label }) => {
              const isSelected = questionTypes.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleQuestionType(value)}
                  className="flex items-center gap-1.5 h-9 px-4 text-sm rounded-[var(--radius-md)] border transition-colors"
                  style={{
                    backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-white)',
                    borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-gray-300)',
                    color: isSelected ? 'var(--color-white)' : 'var(--color-gray-500)',
                  }}
                >
                  {isSelected ? (
                    <PiCheck size={14} />
                  ) : (
                    <span
                      className="w-3.5 h-3.5 rounded-full border flex-shrink-0"
                      style={{ borderColor: 'var(--color-gray-300)' }}
                    />
                  )}
                  {label}
                </button>
              );
            })}
          </div>
        </Section>

        <Section label="꼬리질문 포함">
          <Toggle checked={includeFollowUp} onChange={setIncludeFollowUp} />
        </Section>

        {error && (
          <p className="text-sm" style={{ color: '#EF4444' }}>
            {error}
          </p>
        )}

        <Button
          type="button"
          variant="primary"
          fullWidth
          isLoading={isPending}
          disabled={questionTypes.length === 0}
          onClick={handleSubmit}
          style={{ height: 52 }}
        >
          질문 생성하기
        </Button>
      </div>
    </Layout>
  );
};

export default QuestionSettingsPage;
