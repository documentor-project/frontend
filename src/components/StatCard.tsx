import Card from '@/components/Card';

type Props = {
  value: number | string;
  label: string;
  className?: string;
};

export default function StatCard({ value, label, className = '' }: Props) {
  return (
    <Card
      className={className}
      style={{ textAlign: 'center', padding: 'var(--spacing-lg) var(--spacing-xl)' }}
    >
      <p
        style={{
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 700,
          color: 'var(--color-primary)',
          lineHeight: 1.2,
          marginBottom: 'var(--spacing-xs)',
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-muted)',
        }}
      >
        {label}
      </p>
    </Card>
  );
}
