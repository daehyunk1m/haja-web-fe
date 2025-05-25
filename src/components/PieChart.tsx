export default function PieChart({
  progress,
  size = 100,
  fillColor = "#f66",
  bgColor = "#eee",
}: {
  progress: number;
  size?: number;
  fillColor?: string;
  bgColor?: string;
}) {
  const radius = size / 2;
  const angle = (progress / 100) * 360;

  const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  };

  const describeArc = (cx: number, cy: number, r: number, endAngle: number) => {
    const start = polarToCartesian(cx, cy, r, 0);
    const end = polarToCartesian(cx, cy, r, endAngle);
    const largeArcFlag = endAngle > 180 ? 1 : 0;

    return [`M ${cx} ${cy}`, `L ${start.x} ${start.y}`, `A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`, `Z`].join(" ");
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={radius} cy={radius} r={radius} fill={bgColor} />
      {progress > 0 && progress < 100 && <path d={describeArc(radius, radius, radius, angle)} fill={fillColor} />}
      {progress === 100 && <circle cx={radius} cy={radius} r={radius} fill={fillColor} />}
    </svg>
  );
}
