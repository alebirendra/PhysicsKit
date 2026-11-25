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

const KINEMATICS_DIAGRAM_KINDS = new Set<string>([
  'kinematics-intro',
  'position-axis',
  'time-interval',
  'displacement-1d',
  'avg-velocity-secant',
  'inst-velocity-tangent',
  'avg-acceleration-secant',
  'inst-acceleration-tangent',
  'constant-accel-trio',
  'area-at-graph',
  'area-vt-graph',
  'indefinite-integral-antiderivative',
  'area-function-ftc',
  'definite-integral-accel',
  'definite-integral-velocity',
]);

function KinematicsTopicSvgContent({ kind, w, h }: { kind: TopicDiagramSpec['kind']; w: number; h: number }) {
  const gx0 = 46;
  const gx1 = w - 24;
  const gy0 = 26;
  const gy1 = h - 30;

  if (kind === 'kinematics-intro') {
    return (
      <>
        <line x1="28" y1="42" x2={w - 28} y2="42" stroke="#64748B" strokeWidth="1.5" />
        <circle cx="160" cy="42" r="3.5" fill="#475569" />
        <text x="155" y="57" fontSize="10" fill="#64748B">0</text>
        <circle cx="240" cy="42" r="6" fill="#2563EB" />
        <SvgArrow x1={240} y1={42} x2={290} y2={42} color="#059669" strokeWidth={2.5} id="ki-v" />
        <text x="275" y="33" fontSize="10" fontWeight="700" fill="#059669">v(t)</text>
        <text x="233" y="28" fontSize="10" fontWeight="700" fill="#2563EB">x(t)</text>

        {/* Three stacked mini graphs x(t), v(t), a(t) */}
        <rect x="28" y="72" width="92" height="112" rx="5" fill="#F8FAFC" stroke="#CBD5E1" />
        <path d="M 38 164 Q 74 150 110 88" fill="none" stroke="#2563EB" strokeWidth="2.5" />
        <text x="36" y="88" fontSize="10" fontWeight="700" fill="#2563EB">x(t)</text>
        <text x="48" y="177" fontSize="9" fill="#64748B">slope = v</text>

        <rect x="134" y="72" width="92" height="112" rx="5" fill="#F8FAFC" stroke="#CBD5E1" />
        <line x1="144" y1="158" x2="216" y2="92" stroke="#059669" strokeWidth="2.5" />
        <text x="142" y="88" fontSize="10" fontWeight="700" fill="#059669">v(t)</text>
        <text x="148" y="177" fontSize="9" fill="#64748B">slope = a</text>

        <rect x="240" y="72" width="92" height="112" rx="5" fill="#F8FAFC" stroke="#CBD5E1" />
        <line x1="250" y1="114" x2="322" y2="114" stroke="#DC2626" strokeWidth="2.5" />
        <text x="248" y="88" fontSize="10" fontWeight="700" fill="#DC2626">a(t)</text>
        <text x="252" y="177" fontSize="9" fill="#64748B">area = Δv</text>
      </>
    );
  }

  if (kind === 'position-axis') {
    const ay = 108;
    const ox = 165;
    return (
      <>
        <SvgArrow x1={26} y1={ay} x2={w - 22} y2={ay} color="#475569" strokeWidth={2} id="pos-axis" />
        <text x={w - 28} y={ay - 10} fontSize="11" fontWeight="700" fill="#334155">+x (m)</text>
        {[-4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((tick) => {
          const tx = ox + tick * 28;
          return (
            <g key={tick}>
              <line x1={tx} y1={ay - 6} x2={tx} y2={ay + 6} stroke="#64748B" strokeWidth={tick === 0 ? 2 : 1.2} />
              <text x={tx - 4} y={ay + 20} fontSize="10" fill="#475569">{tick}</text>
            </g>
          );
        })}
        <text x={ox - 4} y={ay - 12} fontSize="10" fontWeight="700" fill="#0F172A">O</text>
        <circle cx={ox - 3 * 28} cy={ay} r="5.5" fill="#D97706" />
        <text x={ox - 3 * 28 - 22} y={ay - 14} fontSize="11" fontWeight="700" fill="#B45309">x₁ = −3 m</text>
        <circle cx={ox + 5 * 28} cy={ay} r="5.5" fill="#2563EB" />
        <text x={ox + 5 * 28 - 24} y={ay - 14} fontSize="11" fontWeight="700" fill="#1D4ED8">x₂ = +5 m</text>
      </>
    );
  }

  if (kind === 'time-interval') {
    const ty = 122;
    return (
      <>
        <SvgArrow x1={30} y1={ty} x2={w - 22} y2={ty} color="#475569" strokeWidth={2} id="ti-axis" />
        <text x={w - 28} y={ty + 18} fontSize="11" fontWeight="700" fill="#334155">t (s)</text>
        <rect x="96" y="64" width="164" height={ty - 64} fill="#DBEAFE" fillOpacity="0.65" />
        <line x1="96" y1="54" x2="96" y2={ty + 8} stroke="#2563EB" strokeWidth="2" strokeDasharray="4 3" />
        <line x1="260" y1="54" x2="260" y2={ty + 8} stroke="#2563EB" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="96" cy={ty} r="4.5" fill="#1D4ED8" />
        <circle cx="260" cy={ty} r="4.5" fill="#1D4ED8" />
        <text x="90" y={ty + 22} fontSize="11" fontWeight="700" fill="#1D4ED8">t₁</text>
        <text x="254" y={ty + 22} fontSize="11" fontWeight="700" fill="#1D4ED8">t₂</text>
        <SvgArrow x1={102} y1={84} x2={254} y2={84} color="#1D4ED8" strokeWidth={2} id="ti-span" />
        <text x="148" y="76" fontSize="12" fontWeight="700" fill="#1E40AF">Δt = t₂ − t₁</text>
      </>
    );
  }

  if (kind === 'displacement-1d') {
    const axY = 142;
    return (
      <>
        <SvgArrow x1={26} y1={axY} x2={w - 22} y2={axY} color="#64748B" strokeWidth={1.8} id="d1-axis" />
        <text x={w - 26} y={axY + 16} fontSize="11" fill="#475569">x</text>
        {/* Out-and-back dashed path */}
        <path
          d="M 76 112 L 296 112 C 314 112 314 82 296 82 L 204 82"
          fill="none"
          stroke="#64748B"
          strokeWidth="2.2"
          strokeDasharray="6 4"
        />
        <text x="150" y="72" fontSize="10" fontWeight="600" fill="#475569">Total distance d (path length)</text>
        {/* Direct displacement */}
        <circle cx="76" cy={axY} r="4.5" fill="#0F172A" />
        <circle cx="204" cy={axY} r="4.5" fill="#2563EB" />
        <SvgArrow x1={76} y1={axY} x2={198} y2={axY} color="#DC2626" strokeWidth={3} id="d1-dx" />
        <text x="70" y={axY + 18} fontSize="11" fontWeight="700" fill="#0F172A">x₁</text>
        <text x="198" y={axY + 18} fontSize="11" fontWeight="700" fill="#2563EB">x₂</text>
        <text x="116" y={axY - 10} fontSize="11" fontWeight="700" fill="#DC2626">Δx = x₂ − x₁</text>
      </>
    );
  }

  if (kind === 'avg-velocity-secant' || kind === 'avg-acceleration-secant') {
    const isVel = kind === 'avg-velocity-secant';
    const p1 = { x: 96, y: 150 };
    const p2 = { x: 274, y: 54 };
    return (
      <>
        <line x1={gx0} y1={gy1} x2={gx1} y2={gy1} stroke="#94A3B8" strokeWidth="1.5" />
        <line x1={gx0} y1={gy0} x2={gx0} y2={gy1} stroke="#94A3B8" strokeWidth="1.5" />
        <text x={gx1 - 6} y={gy1 + 14} fontSize="11" fill="#475569">t</text>
        <text x={gx0 - 18} y={gy0 + 8} fontSize="11" fontWeight="700" fill="#0F172A">{isVel ? 'x' : 'v'}</text>
        <path
          d={`M ${gx0 + 12} ${gy1 - 12} Q 185 148 310 38`}
          fill="none"
          stroke={isVel ? '#2563EB' : '#059669'}
          strokeWidth="2.5"
        />
        {/* Secant & rise/run triangle */}
        <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p1.y} stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1={p2.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1={p1.x - 16} y1={p1.y + 9} x2={p2.x + 18} y2={p2.y - 10} stroke="#DC2626" strokeWidth="2.5" />
        <circle cx={p1.x} cy={p1.y} r="4.5" fill="#DC2626" />
        <circle cx={p2.x} cy={p2.y} r="4.5" fill="#DC2626" />
        <text x="176" y={p1.y + 14} fontSize="10" fontWeight="600" fill="#475569">Δt</text>
        <text x={p2.x + 6} y="106" fontSize="10" fontWeight="600" fill="#DC2626">{isVel ? 'Δx' : 'Δv'}</text>
        <text x="128" y="82" fontSize="11" fontWeight="700" fill="#DC2626">
          {isVel ? 'Secant slope = v_avg' : 'Secant slope = a_avg'}
        </text>
      </>
    );
  }

  if (kind === 'inst-velocity-tangent' || kind === 'inst-acceleration-tangent') {
    const isVel = kind === 'inst-velocity-tangent';
    const px = 178;
    const py = 114;
    return (
      <>
        <line x1={gx0} y1={gy1} x2={gx1} y2={gy1} stroke="#94A3B8" strokeWidth="1.5" />
        <line x1={gx0} y1={gy0} x2={gx0} y2={gy1} stroke="#94A3B8" strokeWidth="1.5" />
        <text x={gx1 - 6} y={gy1 + 14} fontSize="11" fill="#475569">t</text>
        <text x={gx0 - 18} y={gy0 + 8} fontSize="11" fontWeight="700" fill="#0F172A">{isVel ? 'x' : 'v'}</text>
        <path
          d={`M ${gx0 + 12} 166 Q 165 152 308 38`}
          fill="none"
          stroke={isVel ? '#2563EB' : '#059669'}
          strokeWidth="2.5"
        />
        {/* Fading secant */}
        <line x1={px} y1={py} x2={278} y2={58} stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 3" />
        <circle cx={278} cy={58} r="3.5" fill="#94A3B8" />
        {/* Tangent line */}
        <line x1="92" y1="164" x2="266" y2="62" stroke="#DC2626" strokeWidth="2.5" />
        <circle cx={px} cy={py} r="5" fill="#DC2626" />
        <text x="190" y="132" fontSize="10" fontWeight="600" fill="#64748B">Δt → 0</text>
        <text x="108" y="88" fontSize="11" fontWeight="700" fill="#DC2626">
          {isVel ? 'Tangent slope = dx/dt' : 'Tangent slope = dv/dt'}
        </text>
      </>
    );
  }

  if (kind === 'constant-accel-trio') {
    return (
      <>
        <rect x="24" y="34" width="96" height="138" rx="5" fill="#F8FAFC" stroke="#CBD5E1" />
        <line x1="34" y1="138" x2="110" y2="138" stroke="#94A3B8" />
        <line x1="34" y1="80" x2="110" y2="80" stroke="#DC2626" strokeWidth="2.5" />
        <text x="34" y="52" fontSize="10" fontWeight="700" fill="#DC2626">a(t) = const</text>

        <rect x="132" y="34" width="96" height="138" rx="5" fill="#F8FAFC" stroke="#CBD5E1" />
        <line x1="142" y1="138" x2="218" y2="138" stroke="#94A3B8" />
        <line x1="142" y1="134" x2="218" y2="64" stroke="#059669" strokeWidth="2.5" />
        <text x="142" y="52" fontSize="10" fontWeight="700" fill="#059669">v(t) = v₀ + at</text>

        <rect x="240" y="34" width="96" height="138" rx="5" fill="#F8FAFC" stroke="#CBD5E1" />
        <line x1="250" y1="138" x2="326" y2="138" stroke="#94A3B8" />
        <path d="M 250 138 Q 288 134 326 60" fill="none" stroke="#2563EB" strokeWidth="2.5" />
        <text x="248" y="52" fontSize="10" fontWeight="700" fill="#2563EB">x(t) = parabola</text>
      </>
    );
  }

  if (kind === 'area-at-graph') {
    return (
      <>
        <line x1={gx0} y1={gy1} x2={gx1} y2={gy1} stroke="#94A3B8" strokeWidth="1.5" />
        <line x1={gx0} y1={gy0} x2={gx0} y2={gy1} stroke="#94A3B8" strokeWidth="1.5" />
        <rect x="96" y="76" width="176" height={gy1 - 76} fill="#FEE2E2" fillOpacity="0.8" />
        <line x1={gx0} y1="76" x2={gx1 - 14} y2="76" stroke="#DC2626" strokeWidth="2.5" />
        <line x1="96" y1="76" x2="96" y2={gy1} stroke="#DC2626" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="272" y1="76" x2="272" y2={gy1} stroke="#DC2626" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x={gx0 - 20} y={gy0 + 10} fontSize="11" fontWeight="700" fill="#DC2626">a</text>
        <text x={gx1 - 6} y={gy1 + 14} fontSize="11" fill="#475569">t</text>
        <text x="90" y={gy1 + 15} fontSize="10" fill="#334155">t₁</text>
        <text x="266" y={gy1 + 15} fontSize="10" fill="#334155">t₂</text>
        <text x="128" y="132" fontSize="12" fontWeight="700" fill="#991B1B">Area = a Δt = Δv</text>
      </>
    );
  }

  if (kind === 'area-vt-graph') {
    const base = gy1;
    const v0y = 126;
    const vfy = 52;
    return (
      <>
        <line x1={gx0} y1={base} x2={gx1} y2={base} stroke="#94A3B8" strokeWidth="1.5" />
        <line x1={gx0} y1={gy0} x2={gx0} y2={base} stroke="#94A3B8" strokeWidth="1.5" />
        {/* Lower rectangle v0*t */}
        <rect x={gx0} y={v0y} width="228" height={base - v0y} fill="#DBEAFE" fillOpacity="0.85" />
        {/* Upper triangle 1/2 a t^2 */}
        <polygon points={`${gx0},${v0y} ${gx0 + 228},${v0y} ${gx0 + 228},${vfy}`} fill="#D1FAE5" fillOpacity="0.9" />
        <line x1={gx0} y1={v0y} x2={gx0 + 228} y2={v0y} stroke="#2563EB" strokeWidth="1.2" strokeDasharray="4 3" />
        <line x1={gx0} y1={v0y} x2={gx0 + 228} y2={vfy} stroke="#059669" strokeWidth="2.8" />
        <line x1={gx0 + 228} y1={vfy} x2={gx0 + 228} y2={base} stroke="#475569" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x={gx0 - 20} y={gy0 + 8} fontSize="11" fontWeight="700" fill="#059669">v</text>
        <text x={gx0 - 20} y={v0y + 4} fontSize="10" fill="#1D4ED8">v₀</text>
        <text x="126" y="156" fontSize="11" fontWeight="700" fill="#1E40AF">Rectangle: v₀t</text>
        <text x="180" y="106" fontSize="11" fontWeight="700" fill="#047857">Triangle: ½at²</text>
      </>
    );
  }

  if (kind === 'indefinite-integral-antiderivative') {
    return (
      <>
        <line x1={gx0} y1={gy1} x2={gx1} y2={gy1} stroke="#94A3B8" strokeWidth="1.5" />
        <line x1={gx0} y1={gy0} x2={gx0} y2={gy1} stroke="#94A3B8" strokeWidth="1.5" />
        <text x={gx0 - 24} y={gy0 + 8} fontSize="11" fontWeight="700" fill="#0F172A">v(t)</text>
        <text x={gx1 - 6} y={gy1 + 14} fontSize="11" fill="#475569">t</text>
        <path d={`M ${gx0} 156 Q 170 144 306 94`} fill="none" stroke="#94A3B8" strokeWidth="2" />
        <path d={`M ${gx0} 122 Q 170 110 306 60`} fill="none" stroke="#2563EB" strokeWidth="2.8" />
        <path d={`M ${gx0} 88 Q 170 76 306 26`} fill="none" stroke="#94A3B8" strokeWidth="2" />
        <text x="242" y="128" fontSize="10" fill="#64748B">C₁ = 0</text>
        <text x="234" y="88" fontSize="11" fontWeight="700" fill="#1D4ED8">C₂ = v₀</text>
        <text x="242" y="50" fontSize="10" fill="#64748B">C₃</text>
        <text x="64" y="42" fontSize="11" fontWeight="600" fill="#334155">Same slope a(t), shifted by C</text>
      </>
    );
  }

  if (kind === 'area-function-ftc') {
    return (
      <>
        <line x1={gx0} y1={gy1} x2={gx1} y2={gy1} stroke="#94A3B8" strokeWidth="1.5" />
        <line x1={gx0} y1={gy0} x2={gx0} y2={gy1} stroke="#94A3B8" strokeWidth="1.5" />
        <path
          d={`M 78 ${gy1} L 78 134 Q 155 110 232 76 L 232 ${gy1} Z`}
          fill="#DBEAFE"
          fillOpacity="0.8"
        />
        {/* Thin strip dt */}
        <rect x="232" y="72" width="16" height={gy1 - 72} fill="#FDE68A" stroke="#D97706" strokeWidth="1.2" />
        <path d="M 56 140 Q 160 110 310 46" fill="none" stroke="#2563EB" strokeWidth="2.5" />
        <text x="72" y={gy1 + 15} fontSize="10" fill="#334155">t₀</text>
        <text x="228" y={gy1 + 15} fontSize="10" fontWeight="700" fill="#1D4ED8">t</text>
        <text x="246" y={gy1 + 15} fontSize="10" fontWeight="700" fill="#B45309">t+dt</text>
        <text x="128" y="152" fontSize="11" fontWeight="700" fill="#1E40AF">F(t)</text>
        <text x="252" y="114" fontSize="10" fontWeight="700" fill="#B45309">dF ≈ f(t)dt</text>
      </>
    );
  }

  if (kind === 'definite-integral-accel') {
    const bars = [
      { x: 76, w: 36, h: 42 },
      { x: 112, w: 36, h: 56 },
      { x: 148, w: 36, h: 74 },
      { x: 184, w: 36, h: 94 },
      { x: 220, w: 36, h: 114 },
      { x: 256, w: 36, h: 132 },
    ];
    return (
      <>
        <line x1={gx0} y1={gy1} x2={gx1} y2={gy1} stroke="#94A3B8" strokeWidth="1.5" />
        <line x1={gx0} y1={gy0} x2={gx0} y2={gy1} stroke="#94A3B8" strokeWidth="1.5" />
        {bars.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={gy1 - b.h}
            width={b.w}
            height={b.h}
            fill="#FEE2E2"
            stroke="#EF4444"
            strokeWidth="1"
          />
        ))}
        <path d="M 60 152 Q 178 118 308 42" fill="none" stroke="#B91C1C" strokeWidth="2.5" />
        <text x={gx0 - 24} y={gy0 + 8} fontSize="11" fontWeight="700" fill="#B91C1C">a(t)</text>
        <text x="72" y={gy1 + 15} fontSize="10" fill="#334155">t₁</text>
        <text x="286" y={gy1 + 15} fontSize="10" fill="#334155">t₂</text>
        <text x="86" y="54" fontSize="11" fontWeight="700" fill="#991B1B">Σ a(tᵢ) Δt → ∫ a(t) dt = Δv</text>
      </>
    );
  }

  // definite-integral-velocity
  const zeroY = 110;
  return (
    <>
      <line x1={gx0} y1={zeroY} x2={gx1} y2={zeroY} stroke="#64748B" strokeWidth="1.5" />
      <line x1={gx0} y1={gy0} x2={gx0} y2={gy1} stroke="#94A3B8" strokeWidth="1.5" />
      {/* Positive lobe */}
      <polygon points={`72,${zeroY} 72,54 196,${zeroY}`} fill="#DBEAFE" fillOpacity="0.9" />
      {/* Negative lobe */}
      <polygon points={`196,${zeroY} 288,${zeroY} 288,154`} fill="#FFE4E6" fillOpacity="0.9" />
      <line x1="72" y1="54" x2="288" y2="154" stroke="#0F172A" strokeWidth="2.5" />
      <text x={gx0 - 24} y={gy0 + 8} fontSize="11" fontWeight="700" fill="#0F172A">v(t)</text>
      <text x={gx1 - 6} y={zeroY - 6} fontSize="10" fill="#475569">t</text>
      <text x="96" y="96" fontSize="11" fontWeight="700" fill="#1D4ED8">+Δx₁</text>
      <text x="234" y="132" fontSize="11" fontWeight="700" fill="#BE123C">−Δx₂</text>
      <text x="150" y="42" fontSize="10" fontWeight="600" fill="#334155">Δx = ∫ v(t) dt</text>
    </>
  );
}

export function TopicDiagramSvg({ spec }: TopicDiagramSvgProps) {
  const w = 360;
  const h = 210;
  const ox = 110;
  const oy = 148;
  const isKinematics = KINEMATICS_DIAGRAM_KINDS.has(spec.kind);

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

        {isKinematics ? (
          <KinematicsTopicSvgContent kind={spec.kind} w={w} h={h} />
        ) : spec.kind === 'scalar-vs-vector' ? (
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
  if ('title' in diagram) {
    const w = 320;
    const h = 190;
    return (
      <div className="inline-block rounded-lg border border-slate-200 bg-white p-3">
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={diagram.title}>
          <rect width={w} height={h} fill="#F8FAFC" rx="6" />
          {diagram.kind === 'kinematics-xt-secant' && (
            <>
              <line x1="42" y1="158" x2="292" y2="158" stroke="#64748B" strokeWidth="1.5" />
              <line x1="42" y1="22" x2="42" y2="158" stroke="#64748B" strokeWidth="1.5" />
              <path d="M 52 152 Q 160 135 278 36" fill="none" stroke="#2563EB" strokeWidth="2.5" />
              <line x1="82" y1="142" x2="246" y2="56" stroke="#DC2626" strokeWidth="2" strokeDasharray="5 3" />
              <circle cx="82" cy="142" r="4" fill="#DC2626" />
              <circle cx="246" cy="56" r="4" fill="#DC2626" />
              <text x="64" y="172" fontSize="10" fill="#334155">t₁ = 1 s</text>
              <text x="232" y="172" fontSize="10" fill="#334155">t₂ = 5 s</text>
              <text x="86" y="136" fontSize="10" fontWeight="700" fill="#DC2626">(1, 2 m)</text>
              <text x="224" y="46" fontSize="10" fontWeight="700" fill="#DC2626">(5, 14 m)</text>
              <text x="16" y="28" fontSize="10" fontWeight="700" fill="#2563EB">x (m)</text>
            </>
          )}
          {diagram.kind === 'kinematics-vt-trapezoid' && (
            <>
              <line x1="42" y1="158" x2="292" y2="158" stroke="#64748B" strokeWidth="1.5" />
              <line x1="42" y1="22" x2="42" y2="158" stroke="#64748B" strokeWidth="1.5" />
              <rect x="42" y="124" width="218" height="34" fill="#DBEAFE" />
              <polygon points="42,124 260,124 260,44" fill="#D1FAE5" />
              <line x1="42" y1="124" x2="260" y2="44" stroke="#059669" strokeWidth="2.5" />
              <line x1="260" y1="44" x2="260" y2="158" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 3" />
              <text x="10" y="128" fontSize="10" fontWeight="700" fill="#1D4ED8">4</text>
              <text x="6" y="48" fontSize="10" fontWeight="700" fill="#047857">16</text>
              <text x="38" y="172" fontSize="10" fill="#334155">0</text>
              <text x="248" y="172" fontSize="10" fill="#334155">6 s</text>
              <text x="14" y="24" fontSize="10" fontWeight="700" fill="#0F172A">v (m/s)</text>
            </>
          )}
          {diagram.kind === 'kinematics-at-step' && (
            <>
              <line x1="42" y1="112" x2="292" y2="112" stroke="#64748B" strokeWidth="1.5" />
              <line x1="42" y1="22" x2="42" y2="168" stroke="#64748B" strokeWidth="1.5" />
              <rect x="42" y="48" width="132" height="64" fill="#DBEAFE" />
              <rect x="174" y="112" width="88" height="32" fill="#FEE2E2" />
              <polyline
                points="42,48 174,48 174,144 262,144"
                fill="none"
                stroke="#DC2626"
                strokeWidth="2.5"
              />
              <text x="10" y="52" fontSize="10" fontWeight="700" fill="#1D4ED8">+4</text>
              <text x="10" y="148" fontSize="10" fontWeight="700" fill="#B91C1C">−2</text>
              <text x="168" y="126" fontSize="10" fill="#334155">3 s</text>
              <text x="256" y="106" fontSize="10" fill="#334155">5 s</text>
              <text x="10" y="24" fontSize="10" fontWeight="700" fill="#0F172A">a (m/s²)</text>
            </>
          )}
        </svg>
      </div>
    );
  }

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
