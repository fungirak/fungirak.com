// Sello FUNGIRAK Studio exclusivo de fungirak.com: un hongo con su micelio,
// la red que une todos los proyectos del estudio.
export default function Sello({ size = 128 }) {
  const id = "selloPath";
  return (
    <svg className="seal" width={size} height={size} viewBox="0 0 140 140" role="img" aria-label="Sello FUNGIRAK Studio">
      <defs>
        <path id={id} d="M70 70 m -54 0 a 54 54 0 1 1 108 0 a 54 54 0 1 1 -108 0" />
        <linearGradient id="selloGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00e676" />
          <stop offset=".5" stopColor="#22b8cf" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <circle cx="70" cy="70" r="66" fill="none" stroke="url(#selloGrad)" strokeWidth="2" strokeDasharray="2 5" />
      <circle cx="70" cy="70" r="61" fill="none" stroke="url(#selloGrad)" strokeWidth="2.4" />
      <circle cx="70" cy="70" r="40" fill="none" stroke="url(#selloGrad)" strokeWidth="1.6" />
      <text fill="currentColor" fontFamily="var(--font-display)" fontSize="9.6" fontWeight="700" letterSpacing="2.2">
        <textPath href={`#${id}`}>FUNGIRAK STUDIO · CONECTADO DESDE SANTA FE · </textPath>
      </text>
      {/* Hongo */}
      <path d="M50 66c0-12 9-21 20-21s20 9 20 21c0 2-1.5 3-3.5 3h-33c-2 0-3.5-1-3.5-3z" fill="#00c853" />
      <circle cx="61" cy="57" r="3.4" fill="#fff" opacity=".9" />
      <circle cx="75" cy="53" r="2.6" fill="#fff" opacity=".9" />
      <circle cx="82" cy="61" r="2.2" fill="#fff" opacity=".9" />
      <path d="M64 69h12l1.5 13c.2 2-1.3 3.5-3.3 3.5h-8.4c-2 0-3.5-1.5-3.3-3.5z" fill="currentColor" opacity=".85" />
      {/* Micelio */}
      <g fill="none" stroke="url(#selloGrad)" strokeWidth="1.6" strokeLinecap="round">
        <path d="M66 86c-4 4-10 5-16 4" />
        <path d="M74 86c4 4 10 5 16 4" />
        <path d="M70 86v8" />
        <path d="M58 89c-2 3-1 6 1 8" />
        <path d="M82 89c2 3 1 6-1 8" />
      </g>
      <g fill="url(#selloGrad)">
        <circle cx="50" cy="90" r="2.2" />
        <circle cx="90" cy="90" r="2.2" />
        <circle cx="70" cy="95" r="2.2" />
        <circle cx="59" cy="98" r="1.8" />
        <circle cx="81" cy="98" r="1.8" />
      </g>
    </svg>
  );
}
