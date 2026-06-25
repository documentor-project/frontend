import { useNavigate } from 'react-router-dom';
import { PiFileText, PiCaretRight } from 'react-icons/pi';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { useQuestionSets } from '@/hooks/useQuestion';
import { buildQuestionListPath } from '@/constants/routes';
import { DIFFICULTY_LABEL } from '@/types/question';

const QuestionSetsPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuestionSets();

  if (isLoading || !data) {
    return (
      <Layout>
        <div
          className="flex items-center justify-center h-64"
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
        <h1
          className="text-[length:var(--font-size-2xl)] font-bold mb-6"
          style={{ color: 'var(--color-text)' }}
        >
          질문 리스트
        </h1>

        {data.content.length === 0 ? (
          <div
            className="flex items-center justify-center h-48"
            style={{ border: '1px dashed var(--color-border)', color: 'var(--color-text-muted)' }}
          >
            아직 생성된 질문 세트가 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {data.content.map((set) => (
              <Card
                key={set.questionSetId}
                onClick={() => navigate(buildQuestionListPath(set.questionSetId))}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <p
                      className="text-[length:var(--font-size-lg)] font-semibold truncate"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {set.title}
                    </p>
                    <p
                      className="text-[length:var(--font-size-sm)] flex items-center gap-1.5 truncate"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      <PiFileText size={14} />
                      {set.documentTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="badge badge-purple">{DIFFICULTY_LABEL[set.difficulty]}</span>
                      <span className="badge badge-gray">{set.questionCount}개 질문</span>
                    </div>
                  </div>
                  <PiCaretRight
                    size={18}
                    style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QuestionSetsPage;
