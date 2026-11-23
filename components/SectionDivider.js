export default function SectionDivider({ from = '#FBF6EC', to = '#14213D', flip = false }) {
  return (
    <div className={flip ? 'rotate-180' : ''} style={{ lineHeight: 0 }}>
      <svg
        className="wave-divider"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="1440" height="60" fill={from} />
        <path
          d="M0,32 C240,60 480,4 720,20 C960,36 1200,58 1440,26 L1440,60 L0,60 Z"
          fill={to}
        />
      </svg>
    </div>
  );
}
