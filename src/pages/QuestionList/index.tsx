import { useParams } from 'react-router-dom';
import { PiShareNetwork } from 'react-icons/pi';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import QuestionCard from '@/components/QuestionCard';
import useToast from '@/hooks/useToast';
import { useQuestionSetDetail, useCreateShareLink } from '@/hooks/useQuestion';

const QuestionListPage = () => {
  const { questionSetId } = useParams<{ questionSetId: string }>();
  const parsedQuestionSetId = Number(questionSetId);
  const toast = useToast();

  const { data, isLoading, isError } = useQuestionSetDetail(parsedQuestionSetId);
  const shareMutation = useCreateShareLink(parsedQuestionSetId);

  const handleShare = () => {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    shareMutation.mutate(
      { expiresAt },
      {
        onSuccess: ({ shareUrl }) => {
          navigator.clipboard.writeText(shareUrl).catch(() => {});
          toast.success('공유 링크가 클립보드에 복사되었습니다.');
        },
        onError: () => toast.error('공유 링크 생성에 실패했습니다.'),
      },
    );
  };

  if (isLoading) {
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

  if (isError || !data) {
    return (
      <Layout>
        <div
          className="flex items-center justify-center h-64"
          style={{ color: 'var(--color-text-muted)' }}
        >
          질문 목록을 불러오지 못했습니다.
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
          {data.title}
        </h1>

        <div className="flex items-center justify-between mb-6">
          <p
            className="text-[length:var(--font-size-sm)]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            총 <span className="font-semibold">{data.questions.length}개</span> 질문
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            isLoading={shareMutation.isPending}
            className="flex items-center gap-1.5"
          >
            <PiShareNetwork size={15} />
            공유 링크 생성
          </Button>
        </div>

        {data.questions.length === 0 ? (
          <div
            className="flex items-center justify-center h-48"
            style={{ border: '1px dashed var(--color-border)', color: 'var(--color-text-muted)' }}
          >
            생성된 질문이 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {data.questions.map((q, i) => (
              <QuestionCard
                key={q.questionId}
                index={i + 1}
                content={q.content}
                difficulty={q.difficulty}
                type={q.type}
                followUps={q.followUps}
                source={q.source}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QuestionListPage;
