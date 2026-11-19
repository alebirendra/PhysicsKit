import type { PracticeQuestion, TopicDiagramSpec } from '../../types/physics';

interface TopicDiagramSvgProps {
  spec: TopicDiagramSpec;
}

function SvgArrow({
  x1,
  y1,
  x2,
  y2,
  color,
  strokeWidth = 2.5,
  dashed = false,
  id,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  strokeWidth?: number;
  dashed?: boolean;
  id: string;
}) {
  return (
    <g>
      <defs>
        <marker
          id={id}
          viewBox="0 0 10 10"
          refX="8.5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill={color} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? '5 4' : undefined}
        markerEnd={`url(#${id})`}
        strokeLinecap="round"
      />
    </g>
  );
}

export function TopicDiagramSvg({ spec }: TopicDiagramSvgProps) {
  const w = 360;
  const h = 210;
  const ox = 110;
  const oy = 148;

  return (
    <figure className="rounded-lg border border-slate-200 bg-white p-3">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-auto max-h-56"
        role="img"
        aria-label={spec.caption}
      >
        <defs>
          <pattern id={`grid-${spec.kind}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#F1F5F9" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={w} height={h} fill={`url(#grid-${spec.kind})`} rx="6" />

        {spec.kind === 'scalar-vs-vector' ? (
          <>
            <text x="24" y="34" fontSize="11" fontWeight="600" fill="#475569">
              Distance (Scalar path): 7.0 m
            </text>
            <path
              d="M 48 145 Q 110 40 190 95 T 295 85"
              fill="none"
              stroke="#64748B"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />
            <circle cx="48" cy="145" r="4.5" fill="#0F172A" />
            <circle cx="295" cy="85" r="4.5" fill="#0F172A" />
            <SvgArrow x1={48} y1={145} x2={288} y2={87} color="#2563EB" strokeWidth={3} id="sv-disp" />
            <text x="148" y="138" fontSize="12" fontWeight="600" fill="#2563EB">
              Displacement Δr (Vector)
            </text>
          </>
        ) : spec.kind === 'inclined-plane' ? (
          <>
            <polygon points="48,168 308,168 308,68" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
            <rect
              x="162"
              y="76"
              width="42"
              height="28"
              rx="3"
              fill="#DBEAFE"
              stroke="#2563EB"
              strokeWidth="1.5"
              transform="rotate(-21 183 90)"
            />
            <SvgArrow x1={183} y1={90} x2={183} y2={162} color="#0F172A" id="inc-mg" />
            <SvgArrow x1={183} y1={90} x2={132} y2={110} color="#DC2626" id="inc-par" />
            <SvgArrow x1={183} y1={90} x2={208} y2={152} color="#059669" id="inc-perp" />
            <text x="192" y="158" fontSize="11" fontWeight="600" fill="#0F172A">mg</text>
            <text x="92" y="106" fontSize="11" fontWeight="600" fill="#DC2626">mg sin θ</text>
            <text x="216" y="145" fontSize="11" fontWeight="600" fill="#059669">mg cos θ</text>
            <text x="80" y="160" fontSize="11" fill="#475569">θ</text>
          </>
        ) : spec.kind === 'cross-product' ? (
          <>
            <polygon points="150,145 258,145 292,102 184,102" fill="#DBEAFE" fillOpacity="0.65" stroke="#93C5FD" strokeWidth="1.5" />
            <SvgArrow x1={150} y1={145} x2={255} y2={145} color="#2563EB" strokeWidth={2.5} id="cp-a" />
            <SvgArrow x1={150} y1={145} x2={184} y2={102} color="#059669" strokeWidth={2.5} id="cp-b" />
            <SvgArrow x1={150} y1={145} x2={150} y2={42} color="#DC2626" strokeWidth={3} id="cp-r" />
            <text x="256" y="162" fontSize="12" fontWeight="700" fill="#2563EB">A</text>
            <text x="188" y="96" fontSize="12" fontWeight="700" fill="#059669">B</text>
            <text x="160" y="48" fontSize="12" fontWeight="700" fill="#DC2626">A × B (⊥ plane)</text>
            <text x="212" y="128" fontSize="10" fill="#1E40AF">Area = AB sin θ</text>
          </>
        ) : spec.kind === 'unit-vectors' ? (
          <>
            <line x1="150" y1="142" x2="290" y2="142" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="150" y1="142" x2="150" y2="28" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="150" y1="142" x2="72" y2="188" stroke="#CBD5E1" strokeWidth="1.5" />
            <SvgArrow x1={150} y1={142} x2={212} y2={142} color="#2563EB" id="uv-i" />
            <SvgArrow x1={150} y1={142} x2={150} y2={80} color="#059669" id="uv-j" />
            <SvgArrow x1={150} y1={142} x2={106} y2={168} color="#D97706" id="uv-k" />
            <SvgArrow x1={150} y1={142} x2={245} y2={62} color="#0F172A" strokeWidth={2.5} id="uv-v" />
            <text x="216" y="156" fontSize="12" fontWeight="700" fill="#2563EB">î (x)</text>
            <text x="158" y="84" fontSize="12" fontWeight="700" fill="#059669">ĵ (y)</text>
            <text x="86" y="176" fontSize="12" fontWeight="700" fill="#D97706">k̂ (z)</text>
            <text x="250" y="60" fontSize="12" fontWeight="700" fill="#0F172A">A</text>
          </>
        ) : (
          <>
            <line x1="28" y1={oy} x2={w - 24} y2={oy} stroke="#94A3B8" strokeWidth="1.5" />
            <line x1={ox} y1="20" x2={ox} y2={h - 20} stroke="#94A3B8" strokeWidth="1.5" />
            <text x={w - 22} y={oy + 4} fontSize="11" fill="#64748B">x</text>
            <text x={ox + 6} y="26" fontSize="11" fill="#64748B">y</text>

            {(spec.kind === 'vector-arrow' || spec.kind === 'graphical-scale') && (
              <>
                <SvgArrow x1={ox} y1={oy} x2={248} y2={58} color="#2563EB" strokeWidth={3} id="va-main" />
                <path d={`M ${ox + 34} ${oy} A 34 34 0 0 0 ${ox + 28} ${oy - 20}`} fill="none" stroke="#64748B" strokeWidth="1.5" />
                <text x={ox + 38} y={oy - 10} fontSize="11" fill="#475569">θ</text>
                <text x="254" y="56" fontSize="12" fontWeight="700" fill="#2563EB">A</text>
                <text x={ox - 34} y={oy + 15} fontSize="10" fill="#64748B">(0, 0)</text>
              </>
            )}

            {(spec.kind === 'magnitude-direction' || spec.kind === 'resolution' || spec.kind === 'components') && (
              <>
                <line x1={ox} y1={58} x2={248} y2={58} stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1={248} y1={oy} x2={248} y2={58} stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4" />
                <SvgArrow x1={ox} y1={oy} x2={248} y2={oy} color="#059669" strokeWidth={2.5} id="res-x" />
                <SvgArrow x1={ox} y1={oy} x2={ox} y2={58} color="#D97706" strokeWidth={2.5} id="res-y" />
                <SvgArrow x1={ox} y1={oy} x2={248} y2={58} color="#2563EB" strokeWidth={3} id="res-a" />
                <text x="172" y={oy + 18} fontSize="11" fontWeight="600" fill="#059669">Ax = A cos θ</text>
                <text x={ox - 78} y="102" fontSize="11" fontWeight="600" fill="#D97706">Ay = A sin θ</text>
                <text x="254" y="56" fontSize="12" fontWeight="700" fill="#2563EB">A</text>
              </>
            )}

            {(spec.kind === 'head-to-tail' || spec.kind === 'parallelogram') && (
              <>
                <SvgArrow x1={ox} y1={oy} x2={208} y2={114} color="#2563EB" strokeWidth={2.5} id="add-a" />
                <SvgArrow x1={208} y1={114} x2={264} y2={48} color="#059669" strokeWidth={2.5} id="add-b" />
                <SvgArrow x1={ox} y1={oy} x2={264} y2={48} color="#DC2626" strokeWidth={3} id="add-r" />
                <text x="155" y="144" fontSize="12" fontWeight="700" fill="#2563EB">A</text>
                <text x="242" y="88" fontSize="12" fontWeight="700" fill="#059669">B</text>
                <text x="176" y="84" fontSize="12" fontWeight="700" fill="#DC2626">R = A + B</text>
              </>
            )}

            {spec.kind === 'subtraction' && (
              <>
                <SvgArrow x1={ox} y1={oy} x2={232} y2={88} color="#2563EB" strokeWidth={2.5} id="sub-a" />
                <SvgArrow x1={ox} y1={oy} x2={176} y2={128} color="#94A3B8" strokeWidth={2} dashed id="sub-b" />
                <SvgArrow x1={232} y1={88} x2={166} y2={108} color="#059669" strokeWidth={2} dashed id="sub-nb" />
                <SvgArrow x1={ox} y1={oy} x2={166} y2={108} color="#DC2626" strokeWidth={3} id="sub-r" />
                <text x="236" y="84" fontSize="11" fontWeight="700" fill="#2563EB">A</text>
                <text x="178" y="142" fontSize="11" fill="#64748B">B</text>
                <text x="196" y="76" fontSize="11" fontWeight="600" fill="#059669">-B</text>
                <text x="128" y="102" fontSize="11" fontWeight="700" fill="#DC2626">A - B</text>
              </>
            )}

            {spec.kind === 'displacement' && (
              <>
                <SvgArrow x1={ox} y1={oy} x2={180} y2={98} color="#64748B" strokeWidth={2} id="dp-r1" />
                <SvgArrow x1={ox} y1={oy} x2={262} y2={58} color="#2563EB" strokeWidth={2.5} id="dp-r2" />
                <SvgArrow x1={180} y1={98} x2={262} y2={58} color="#DC2626" strokeWidth={3} id="dp-dr" />
                <circle cx={180} cy={98} r="4" fill="#64748B" />
                <circle cx={262} cy={58} r="4" fill="#2563EB" />
                <text x="134" y="114" fontSize="11" fontWeight="600" fill="#64748B">r₁</text>
                <text x="200" y="114" fontSize="11" fontWeight="600" fill="#2563EB">r₂</text>
                <text x="218" y="68" fontSize="12" fontWeight="700" fill="#DC2626">Δr</text>
              </>
            )}

            {spec.kind === 'dot-product' && (
              <>
                <SvgArrow x1={ox} y1={oy} x2={265} y2={oy} color="#059669" strokeWidth={2.5} id="dp-b" />
                <SvgArrow x1={ox} y1={oy} x2={212} y2={62} color="#2563EB" strokeWidth={2.5} id="dp-a" />
                <line x1={212} y1={62} x2={212} y2={oy} stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1={ox} y1={oy - 3} x2={212} y2={oy - 3} stroke="#DC2626" strokeWidth="4" />
                <text x="270" y={oy + 4} fontSize="12" fontWeight="700" fill="#059669">B</text>
                <text x="218" y="60" fontSize="12" fontWeight="700" fill="#2563EB">A</text>
                <text x="136" y={oy + 18} fontSize="11" fontWeight="600" fill="#DC2626">A cos θ</text>
                <text x={ox + 28} y={oy - 14} fontSize="11" fill="#475569">θ</text>
              </>
            )}
          </>
        )}
      </svg>
      <figcaption className="mt-2 text-xs text-slate-600 leading-relaxed">{spec.caption}</figcaption>
    </figure>
  );
}

export function PracticeDiagramSvg({ diagram }: { diagram: NonNullable<PracticeQuestion['diagram']> }) {
  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const step = 20;

  const toPx = (vx: number, vy: number) => ({
    x: cx + vx * step,
    y: cy - vy * step,
  });

  const pA = toPx(diagram.ax, diagram.ay);
  const pB = diagram.bx !== undefined && diagram.by !== undefined ? toPx(diagram.bx, diagram.by) : null;

  return (
    <div className="inline-block rounded-lg border border-slate-200 bg-white p-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Practice vector diagram">
        {Array.from({ length: 11 }, (_, idx) => {
          const offset = (idx - 5) * step;
          return (
            <g key={idx}>
              <line x1={cx + offset} y1={10} x2={cx + offset} y2={size - 10} stroke="#F1F5F9" strokeWidth="1" />
              <line x1={10} y1={cy + offset} x2={size - 10} y2={cy + offset} stroke="#F1F5F9" strokeWidth="1" />
            </g>
          );
        })}
        <line x1={10} y1={cy} x2={size - 10} y2={cy} stroke="#94A3B8" strokeWidth="1.5" />
        <line x1={cx} y1={10} x2={cx} y2={size - 10} stroke="#94A3B8" strokeWidth="1.5" />

        <SvgArrow x1={cx} y1={cy} x2={pA.x} y2={pA.y} color="#2563EB" strokeWidth={2.5} id="pq-a" />
        <circle cx={pA.x} cy={pA.y} r="3" fill="#2563EB" />
        <text x={pA.x + 6} y={pA.y - 6} fontSize="11" fontWeight="600" fill="#1D4ED8">
          {diagram.labelA ?? `(${diagram.ax}, ${diagram.ay})`}
        </text>

        {pB && (
          <>
            <SvgArrow x1={cx} y1={cy} x2={pB.x} y2={pB.y} color="#059669" strokeWidth={2.5} id="pq-b" />
            <circle cx={pB.x} cy={pB.y} r="3" fill="#059669" />
            <text x={pB.x + 6} y={pB.y - 6} fontSize="11" fontWeight="600" fill="#047857">
              {diagram.labelB ?? `(${diagram.bx}, ${diagram.by})`}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
