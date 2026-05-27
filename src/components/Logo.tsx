const Logo = () => (
  <div className="flex items-center gap-3">
    <div
      className="flex items-center justify-center"
      style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: 'var(--color-primary)' }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    </div>
    <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text)' }}>DocuMentor</span>
  </div>
);

export default Logo;
