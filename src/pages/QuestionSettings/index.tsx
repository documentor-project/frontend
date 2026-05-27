import { useState } from 'react';
import { PiCheck } from 'react-icons/pi';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import Toggle from '@/components/Toggle';
import { useGenerateQuestions } from '@/hooks/useQuestion';
import {
  QUESTION_COUNTS,
  DIFFICULTY_LEVELS,
  TECH_FIELDS,
  type QuestionCount,
  type DifficultyLevel,
  type TechField,
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
  const { mutate, isPending } = useGenerateQuestions();

  const [count, setCount] = useState<QuestionCount>(10);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('기본');
  const [techFields, setTechFields] = useState<TechField[]>(['CS']);
  const [includeFollowUp, setIncludeFollowUp] = useState(true);

  const toggleTechField = (field: TechField) => {
    setTechFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field],
    );
  };

  const handleSubmit = () => {
    mutate({ count, difficulty, techFields, includeFollowUp });
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
            {DIFFICULTY_LEVELS.map((d) => (
              <Button
                key={d}
                type="button"
                variant="chip"
                selected={difficulty === d}
                onClick={() => setDifficulty(d)}
              >
                {d}
              </Button>
            ))}
          </div>
        </Section>

        <Section label="기술 분야">
          <div className="flex flex-wrap gap-2">
            {TECH_FIELDS.map((field) => {
              const isSelected = techFields.includes(field);
              return (
                <button
                  key={field}
                  type="button"
                  onClick={() => toggleTechField(field)}
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
                  {field}
                </button>
              );
            })}
          </div>
        </Section>

        <Section label="꼬리질문 포함">
          <Toggle checked={includeFollowUp} onChange={setIncludeFollowUp} />
        </Section>

        <Button
          type="button"
          variant="primary"
          fullWidth
          isLoading={isPending}
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
