/**
 * Generated cover art for a project when no screenshot is provided:
 * a stylised "app window" in the project's accent color.
 */
export function MissionArt({ title, color, image, className = "" }: { title: string; color: string; image?: string | null; className?: string }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={`${title} screenshot`} className={`h-full w-full object-cover ${className}`} loading="lazy" />;
  }
  const seed = [...title].reduce((a, c) => a + c.charCodeAt(0), 0);
  const bars = Array.from({ length: 7 }, (_, i) => 20 + ((seed * (i + 3)) % 60));
  const id = `g-${seed}`;
  return (
    <svg viewBox="0 0 400 240" className={`h-full w-full ${className}`} role="img" aria-label={`${title} cover art`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#171329" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#${id})`} />
      <g opacity="0.12" stroke="#fff">
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={i * 36} y1="0" x2={i * 36 - 120} y2="240" />
        ))}
      </g>
      <g transform="translate(40 34)">
        <rect width="320" height="176" rx="10" fill="#0d0a1c" opacity="0.82" />
        <rect width="320" height="22" rx="10" fill="#fff" opacity="0.06" />
        {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
          <circle key={c} cx={14 + i * 14} cy="11" r="4" fill={c} />
        ))}
        <rect x="16" y="38" width="90" height="10" rx="5" fill={color} />
        <rect x="16" y="56" width="140" height="6" rx="3" fill="#fff" opacity="0.25" />
        <rect x="16" y="68" width="110" height="6" rx="3" fill="#fff" opacity="0.15" />
        {bars.map((h, i) => (
          <rect key={i} x={180 + i * 18} y={150 - h} width="11" height={h} rx="2" fill={color} opacity={0.4 + i * 0.08} />
        ))}
        <path d={`M16 150 ${bars.map((h, i) => `L ${16 + i * 22} ${150 - h * 0.7}`).join(" ")}`} stroke="#45c9ff" strokeWidth="2.5" fill="none" />
      </g>
    </svg>
  );
}
