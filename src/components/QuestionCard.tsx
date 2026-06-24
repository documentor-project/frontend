import { useState } from 'react';
import Card from '@/components/Card';
import {
  DIFFICULTY_LABEL,
  QUESTION_TYPE_LABEL,
  type QuestionDifficulty,
  type QuestionType,
  type FollowUpQuestion,
  type QuestionSource,
} from '@/types/question';

type Props = {
  index: number;
  content: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  followUps?: FollowUpQuestion[];
  source?: QuestionSource;
  className?: string;
};

export default function QuestionCard({
  index,
  content,
  difficulty,
  type,
  followUps = [],
  source,
  className = '',
}: Props) {
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);

  return (
    <Card className={className}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        <h3
          style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 600,
            color: 'var(--color-primary)',
            margin: 0,
          }}
        >
          {index}. {content}
        </h3>

        <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
          <span className="badge badge-purple">{DIFFICULTY_LABEL[difficulty]}</span>
          <span className="badge badge-gray">{QUESTION_TYPE_LABEL[type]}</span>
        </div>

        {followUps.length > 0 && (
          <button
            onClick={() => setIsFollowUpOpen((prev) => !prev)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              color: 'var(--color-primary)',
            }}
          >
            꼬리질문 ({followUps.length}) {isFollowUpOpen ? '▴' : '▾'}
          </button>
        )}

        {followUps.length > 0 && isFollowUpOpen && (
          <ul
            style={{
              padding: 0,
              margin: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-xs)',
            }}
          >
            {followUps.map((fq) => (
              <li
                key={fq.followUpQuestionId}
                style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}
              >
                {fq.content}
              </li>
            ))}
          </ul>
        )}

        {source && (
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            📄 {source.documentTitle} · p.{source.page}
          </p>
        )}
      </div>
    </Card>
  );
}
