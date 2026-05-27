import { useRef, useState, type DragEvent, type ChangeEvent, type SyntheticEvent } from 'react';
import { PiUploadSimple, PiFile } from 'react-icons/pi';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { useUploadDocument } from '@/hooks/useDocument';
import { ACCEPTED_EXTENSIONS, DOCUMENT_CATEGORIES, type DocumentCategory } from '@/types/document';

// ---- Stepper ----

const STEP_LABELS = ['문서 업로드', '분석 중', '완료'];

type StepperProps = { currentStep: number };

const Stepper = ({ currentStep }: StepperProps) => (
  <div className="flex items-center gap-2 mb-8">
    {STEP_LABELS.map((label, i) => (
      <div key={label} className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
            style={
              i === currentStep
                ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-white)' }
                : { backgroundColor: 'var(--color-gray-200)', color: 'var(--color-gray-500)' }
            }
          >
            {i + 1}
          </div>
          <span
            className="text-sm font-medium"
            style={{
              color: i === currentStep ? 'var(--color-text)' : 'var(--color-gray-400)',
            }}
          >
            {label}
          </span>
        </div>
        {i < STEP_LABELS.length - 1 && (
          <span style={{ color: 'var(--color-gray-300)', margin: '0 4px' }}>→</span>
        )}
      </div>
    ))}
  </div>
);

// ---- Dropzone ----

type DropzoneProps = {
  file: File | null;
  onChange: (file: File | null) => void;
};

const Dropzone = ({ file, onChange }: DropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onChange(dropped);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    onChange(selected);
    e.target.value = '';
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className="rounded-xl flex flex-col items-center justify-center py-14 px-6 transition-colors"
      style={{
        border: `2px dashed ${dragOver ? 'var(--color-primary)' : 'var(--color-gray-300)'}`,
        backgroundColor: dragOver ? 'var(--color-primary-light)' : 'var(--color-white)',
        minHeight: 240,
      }}
    >
      {file ? (
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-primary-light)' }}
          >
            <PiFile size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            {file.name}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {(file.size / 1024).toFixed(1)} KB
          </p>
          <button
            type="button"
            className="text-xs underline mt-1"
            style={{
              color: 'var(--color-text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={() => onChange(null)}
          >
            파일 제거
          </button>
        </div>
      ) : (
        <>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: 'var(--color-gray-100)' }}
          >
            <PiUploadSimple size={36} style={{ color: 'var(--color-primary)' }} />
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
            PDF, Markdown, TXT 파일을 끌어다 놓으세요
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="!self-center"
            onClick={() => inputRef.current?.click()}
          >
            파일 선택
          </Button>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(',')}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};

// ---- Page ----

const DocumentUploadPage = () => {
  const { mutate: uploadMutate, isPending, isSuccess } = useUploadDocument();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const isValid = file !== null && title.trim() !== '' && category !== '';
  const currentStep = isSuccess ? 2 : isPending ? 1 : 0;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError('파일, 문서 제목, 카테고리를 모두 입력해주세요.');
      return;
    }
    setError('');

    uploadMutate(
      { file: file!, title: title.trim(), category: category as DocumentCategory },
      {
        onError: () => setError('업로드에 실패했습니다. 다시 시도해주세요.'),
      },
    );
  };

  return (
    <Layout>
      <h1
        style={{
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 700,
          color: 'var(--color-text)',
          marginBottom: 24,
        }}
      >
        문서 업로드
      </h1>

      <Stepper currentStep={currentStep} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <Dropzone file={file} onChange={setFile} />

        <Input
          label="문서 제목"
          type="text"
          placeholder="예: 스프링 핵심 정리"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="!h-[52px] !rounded-[var(--radius-lg)]"
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            카테고리
          </label>
          <Select value={category} onChange={setCategory}>
            <Select.Trigger placeholder="카테고리를 선택하세요" className="h-[52px]" />
            <Select.Content>
              {DOCUMENT_CATEGORIES.map((cat) => (
                <Select.Item key={cat.value} value={cat.value}>
                  {cat.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        {error && (
          <p className="text-sm" style={{ color: '#EF4444' }}>
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isPending}
          disabled={!isValid}
          style={{ height: 52 }}
        >
          업로드 및 분석 시작
        </Button>
      </form>
    </Layout>
  );
};

export default DocumentUploadPage;
