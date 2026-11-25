import { useEffect, useState } from 'react';
import { SIMULATIONS, getSimulationById } from '../../content/registry';
import type { SimulationId, Vector2D, Vector3D } from '../../types/physics';
import {
  addVectors2D,
  angleBetween2D,
  angleBetween3D,
  clampNumber,
  crossProduct3D,
  degToRad,
  displacement2D,
  dotProduct2D,
  formatNum,
  formatSignedTerm,
  fromPolar,
  magnitude2D,
  magnitude3D,
  negateVector2D,
  resolveVector,
  scalarProjection2D,
  subtractVectors2D,
  toPolar,
  vectorProjection2D,
} from '../../services/physics/vectorMath';
import { MathBlock, MathText } from '../../components/equations/MathText';
import { ParamControl } from '../../components/simulation/ParamControl';
import {
  type DisplayOptionsState,
  SimulationWorkspace,
} from '../../components/simulation/SimulationWorkspace';
import { Vector2DCanvas, type CanvasVectorItem } from './Vector2DCanvas';
import { Vector3DCanvas } from './Vector3DCanvas';

interface VectorLabProps {
  activeSimId: SimulationId;
  onChangeSimId: (id: SimulationId) => void;
  onNavigateTopicTitle?: (topicTitle: string) => void;
}

const DEFAULT_DISPLAY: DisplayOptionsState = {
  showGrid: true,
  showAxisLabels: true,
  showVectorLabels: true,
  showComponents: true,
  showResultant: true,
  zoom: 1,
};

export function VectorLab({ activeSimId, onChangeSimId, onNavigateTopicTitle }: VectorLabProps) {
  const simConfig = getSimulationById(activeSimId) ?? SIMULATIONS[0];
  const [displayOptions, setDisplayOptions] = useState<DisplayOptionsState>(DEFAULT_DISPLAY);

  // A. Representation & D. Resolution polar state
  const [repMag, setRepMag] = useState(5);
  const [repAngle, setRepAngle] = useState(37);

  // B. Addition, C. Subtraction, F. Dot Product 2D vectors
  const [vecA, setVecA] = useState<Vector2D>({ x: 4, y: 2 });
  const [vecB, setVecB] = useState<Vector2D>({ x: -1, y: 4 });
  const [additionMethod, setAdditionMethod] = useState<'head-to-tail' | 'parallelogram'>('head-to-tail');

  // D. Resolution animation state
  const [resPlaying, setResPlaying] = useState(true);
  const [resSpeed, setResSpeed] = useState(1);
  const [resPhase, setResPhase] = useState(1);

  // E. Unit Vectors (2D / 3D toggle)
  const [unitVec, setUnitVec] = useState<Vector3D>({ x: 3, y: 4, z: 2 });
  const [unitMode3D, setUnitMode3D] = useState(true);

  // G. Cross Product 3D
  const [crossA, setCrossA] = useState<Vector3D>({ x: 2, y: 1, z: 0 });
  const [crossB, setCrossB] = useState<Vector3D>({ x: 0, y: 2, z: 1 });

  // H. Position & Displacement
  const [posR1, setPosR1] = useState<Vector2D>({ x: -3, y: 2 });
  const [posR2, setPosR2] = useState<Vector2D>({ x: 4, y: 5 });

  // Animation loop for Resolution of Vectors projection sweep
  useEffect(() => {
    if (activeSimId !== 'resolution' || !resPlaying) return;
    let rafId = 0;
    let lastTime = performance.now();
    let localPhase = 0;

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      localPhase = (localPhase + dt * 0.45 * resSpeed) % 1.4;
      setResPhase(Math.min(1, localPhase));
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [activeSimId, resPlaying, resSpeed]);

  const handleReset = () => {
    setDisplayOptions(DEFAULT_DISPLAY);
    if (activeSimId === 'representation' || activeSimId === 'resolution') {
      setRepMag(5);
      setRepAngle(37);
      setResPhase(1);
    } else if (activeSimId === 'addition' || activeSimId === 'subtraction' || activeSimId === 'dot-product') {
      setVecA({ x: 4, y: 2 });
      setVecB({ x: -1, y: 4 });
    } else if (activeSimId === 'unit-vectors') {
      setUnitVec({ x: 3, y: 4, z: 2 });
    } else if (activeSimId === 'cross-product') {
      setCrossA({ x: 2, y: 1, z: 0 });
      setCrossB({ x: 0, y: 2, z: 1 });
    } else if (activeSimId === 'displacement') {
      setPosR1({ x: -3, y: 2 });
      setPosR2({ x: 4, y: 5 });
    }
  };

  // Render logic per simulation mode
  const renderSimulationContent = () => {
    if (activeSimId === 'representation') {
      const { ax, ay, magnitude, angleDeg } = resolveVector(repMag, repAngle);
      const vectors: CanvasVectorItem[] = [
        {
          id: 'rep-A',
          tail: { x: 0, y: 0 },
          head: { x: ax, y: ay },
          color: '#2563EB',
          label: `A (${formatNum(ax, 1)}, ${formatNum(ay, 1)})`,
          draggableHead: true,
          showComponents: displayOptions.showComponents,
        },
      ];

      return {
        supportsZoom: true,
        supportsResultantToggle: false,
        supportsComponentsToggle: true,
        leftControls: (
          <div className="space-y-4">
            <ParamControl
              id="rep-mag"
              label="Magnitude |A|"
              value={repMag}
              min={0}
              max={8}
              step={0.1}
              unit="u"
              onChange={(val) => setRepMag(val)}
            />
            <ParamControl
              id="rep-angle"
              label="Direction Angle θ"
              value={repAngle}
              min={0}
              max={360}
              step={1}
              unit="°"
              onChange={(val) => setRepAngle(val)}
            />
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <ParamControl
                id="rep-x"
                label="x-component (Ax)"
                value={ax}
                min={-8}
                max={8}
                step={0.1}
                accentColor="#059669"
                onChange={(nx) => {
                  const p = toPolar({ x: nx, y: ay });
                  setRepMag(clampNumber(p.magnitude, 0, 8));
                  setRepAngle(p.angleDeg);
                }}
              />
              <ParamControl
                id="rep-y"
                label="y-component (Ay)"
                value={ay}
                min={-8}
                max={8}
                step={0.1}
                accentColor="#D97706"
                onChange={(ny) => {
                  const p = toPolar({ x: ax, y: ny });
                  setRepMag(clampNumber(p.magnitude, 0, 8));
                  setRepAngle(p.angleDeg);
                }}
              />
            </div>
            <p className="text-xs text-slate-500">
              Tip: Drag the circular tip handle of A directly on the coordinate grid.
            </p>
          </div>
        ),
        centerCanvas: (
          <Vector2DCanvas
            vectors={vectors}
            arcs={[
              {
                center: { x: 0, y: 0 },
                startRad: 0,
                endRad: degToRad(angleDeg),
                radiusUnits: Math.min(1.6, magnitude * 0.4),
                color: '#64748B',
                label: `${formatNum(angleDeg, 1)}°`,
              },
            ]}
            showGrid={displayOptions.showGrid}
            showAxisLabels={displayOptions.showAxisLabels}
            showVectorLabels={displayOptions.showVectorLabels}
            zoom={displayOptions.zoom}
            onDragVector={(_id, _target, worldPos) => {
              const polar = toPolar(worldPos);
              setRepMag(clampNumber(polar.magnitude, 0, 8));
              setRepAngle(Math.round(polar.angleDeg));
            }}
            ariaLabel="Interactive 2D vector representation coordinate plane"
          />
        ),
        rightCalculations: (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500">Magnitude |A|</div>
                <div className="font-mono font-bold text-base text-slate-900 tabular-nums mt-0.5">
                  {formatNum(magnitude)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500">Angle θ</div>
                <div className="font-mono font-bold text-base text-slate-900 tabular-nums mt-0.5">
                  {formatNum(angleDeg, 1)}°
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500">Ax</div>
                <div className="font-mono font-bold text-base text-emerald-700 tabular-nums mt-0.5">
                  {formatNum(ax)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500">Ay</div>
                <div className="font-mono font-bold text-base text-amber-700 tabular-nums mt-0.5">
                  {formatNum(ay)}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="font-semibold text-slate-900">Step-by-Step Calculation</div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white overflow-x-auto">
                <MathBlock
                  latex={`A_x = ${formatNum(magnitude)}\\cos(${formatNum(angleDeg, 1)}^\\circ) = ${formatNum(ax)}`}
                />
                <MathBlock
                  latex={`A_y = ${formatNum(magnitude)}\\sin(${formatNum(angleDeg, 1)}^\\circ) = ${formatNum(ay)}`}
                />
                <MathBlock
                  latex={`|\\vec{A}| = \\sqrt{(${formatNum(ax)})^2 + (${formatNum(ay)})^2} = ${formatNum(magnitude)}`}
                />
              </div>
              <p className="leading-relaxed text-slate-600">
                Placing the tail at $(0, 0)$ equates the tip coordinates directly to $(A_x, A_y)$, connecting geometry to algebra.
              </p>
            </div>
          </div>
        ),
      };
    }

    if (activeSimId === 'addition') {
      const res = addVectors2D(vecA, vecB);
      const resPolar = toPolar(res);
      const polarA = toPolar(vecA);
      const polarB = toPolar(vecB);

      const vectors: CanvasVectorItem[] = [
        {
          id: 'add-A',
          tail: { x: 0, y: 0 },
          head: vecA,
          color: '#2563EB',
          label: `A (${formatNum(vecA.x, 1)}, ${formatNum(vecA.y, 1)})`,
          draggableHead: true,
          showComponents: displayOptions.showComponents,
        },
      ];

      if (additionMethod === 'head-to-tail') {
        vectors.push({
          id: 'add-B-shifted',
          tail: vecA,
          head: res,
          color: '#059669',
          label: `B (${formatNum(vecB.x, 1)}, ${formatNum(vecB.y, 1)})`,
          draggableHead: false,
          labelPosition: 'midpoint',
        });
        vectors.push({
          id: 'add-B-origin',
          tail: { x: 0, y: 0 },
          head: vecB,
          color: '#059669',
          label: 'B (origin)',
          dashed: true,
          lineWidth: 1.75,
          draggableHead: true,
        });
      } else {
        vectors.push({
          id: 'add-B',
          tail: { x: 0, y: 0 },
          head: vecB,
          color: '#059669',
          label: `B (${formatNum(vecB.x, 1)}, ${formatNum(vecB.y, 1)})`,
          draggableHead: true,
          showComponents: displayOptions.showComponents,
        });
      }

      if (displayOptions.showResultant) {
        vectors.push({
          id: 'add-R',
          tail: { x: 0, y: 0 },
          head: res,
          color: '#DC2626',
          label: `R (${formatNum(res.x, 1)}, ${formatNum(res.y, 1)})`,
          lineWidth: 3.25,
        });
      }

      return {
        supportsZoom: true,
        supportsResultantToggle: true,
        supportsComponentsToggle: true,
        leftControls: (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                Geometric Method
              </span>
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setAdditionMethod('head-to-tail')}
                  className={`py-1.5 px-2 rounded-md text-xs font-medium transition-colors ${
                    additionMethod === 'head-to-tail'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Head-to-Tail
                </button>
                <button
                  type="button"
                  onClick={() => setAdditionMethod('parallelogram')}
                  className={`py-1.5 px-2 rounded-md text-xs font-medium transition-colors ${
                    additionMethod === 'parallelogram'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Parallelogram
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="text-xs font-semibold text-blue-700">Vector A</div>
              <ParamControl
                id="add-ax"
                label="Ax"
                value={vecA.x}
                min={-6}
                max={6}
                step={0.5}
                accentColor="#2563EB"
                onChange={(x) => setVecA((p) => ({ ...p, x }))}
              />
              <ParamControl
                id="add-ay"
                label="Ay"
                value={vecA.y}
                min={-6}
                max={6}
                step={0.5}
                accentColor="#2563EB"
                onChange={(y) => setVecA((p) => ({ ...p, y }))}
              />
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="text-xs font-semibold text-emerald-700">Vector B</div>
              <ParamControl
                id="add-bx"
                label="Bx"
                value={vecB.x}
                min={-6}
                max={6}
                step={0.5}
                accentColor="#059669"
                onChange={(x) => setVecB((p) => ({ ...p, x }))}
              />
              <ParamControl
                id="add-by"
                label="By"
                value={vecB.y}
                min={-6}
                max={6}
                step={0.5}
                accentColor="#059669"
                onChange={(y) => setVecB((p) => ({ ...p, y }))}
              />
            </div>
          </div>
        ),
        centerCanvas: (
          <Vector2DCanvas
            vectors={vectors}
            polygons={
              additionMethod === 'parallelogram'
                ? [
                    {
                      points: [{ x: 0, y: 0 }, vecA, res, vecB],
                      fillColor: 'rgba(37, 99, 235, 0.08)',
                      strokeColor: '#94A3B8',
                    },
                  ]
                : []
            }
            segments={
              additionMethod === 'parallelogram'
                ? [
                    { from: vecA, to: res, color: '#059669', dashed: true },
                    { from: vecB, to: res, color: '#2563EB', dashed: true },
                  ]
                : []
            }
            showGrid={displayOptions.showGrid}
            showAxisLabels={displayOptions.showAxisLabels}
            showVectorLabels={displayOptions.showVectorLabels}
            zoom={displayOptions.zoom}
            onDragVector={(id, _target, pos) => {
              if (id === 'add-A') setVecA(pos);
              if (id === 'add-B' || id === 'add-B-origin') setVecB(pos);
            }}
            ariaLabel="Vector addition simulation canvas"
          />
        ),
        rightCalculations: (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
                <div className="text-red-700 font-medium">Resultant |R|</div>
                <div className="font-mono font-bold text-base text-red-900 tabular-nums mt-0.5">
                  {formatNum(resPolar.magnitude)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
                <div className="text-red-700 font-medium">Angle θR</div>
                <div className="font-mono font-bold text-base text-red-900 tabular-nums mt-0.5">
                  {formatNum(resPolar.angleDeg, 1)}°
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500">|A| / |B|</div>
                <div className="font-mono font-semibold text-slate-900 tabular-nums mt-0.5">
                  {formatNum(polarA.magnitude)} / {formatNum(polarB.magnitude)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500">R = (Rx, Ry)</div>
                <div className="font-mono font-semibold text-slate-900 tabular-nums mt-0.5">
                  ({formatNum(res.x, 1)}, {formatNum(res.y, 1)})
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 bg-white overflow-x-auto">
              <MathBlock
                latex={`R_x = ${formatNum(vecA.x, 1)} ${formatSignedTerm(vecB.x, 1)} = ${formatNum(res.x, 1)}`}
              />
              <MathBlock
                latex={`R_y = ${formatNum(vecA.y, 1)} ${formatSignedTerm(vecB.y, 1)} = ${formatNum(res.y, 1)}`}
              />
              <MathBlock
                latex={`R = \\sqrt{(${formatNum(res.x, 1)})^2 + (${formatNum(res.y, 1)})^2} = ${formatNum(resPolar.magnitude)}`}
              />
            </div>

            <p className="text-slate-600 leading-relaxed">
              {additionMethod === 'head-to-tail'
                ? 'Head-to-tail places B’s tail at A’s tip; R closes the triangle from origin to final tip.'
                : 'Parallelogram places both tails at the origin; R forms the main diagonal.'}
            </p>
          </div>
        ),
      };
    }

    if (activeSimId === 'subtraction') {
      const negB = negateVector2D(vecB);
      const diff = subtractVectors2D(vecA, vecB);
      const diffPolar = toPolar(diff);

      const vectors: CanvasVectorItem[] = [
        {
          id: 'sub-A',
          tail: { x: 0, y: 0 },
          head: vecA,
          color: '#2563EB',
          label: `A (${formatNum(vecA.x, 1)}, ${formatNum(vecA.y, 1)})`,
          draggableHead: true,
          showComponents: displayOptions.showComponents,
        },
        {
          id: 'sub-B',
          tail: { x: 0, y: 0 },
          head: vecB,
          color: '#94A3B8',
          label: `B (${formatNum(vecB.x, 1)}, ${formatNum(vecB.y, 1)})`,
          dashed: true,
          lineWidth: 2,
          draggableHead: true,
        },
        {
          id: 'sub-negB-origin',
          tail: { x: 0, y: 0 },
          head: negB,
          color: '#059669',
          label: `-B (${formatNum(negB.x, 1)}, ${formatNum(negB.y, 1)})`,
          dashed: true,
          lineWidth: 1.75,
        },
        {
          id: 'sub-negB-shifted',
          tail: vecA,
          head: diff,
          color: '#059669',
          label: '+ (-B)',
          labelPosition: 'midpoint',
        },
      ];

      if (displayOptions.showResultant) {
        vectors.push({
          id: 'sub-D',
          tail: { x: 0, y: 0 },
          head: diff,
          color: '#DC2626',
          label: `A - B (${formatNum(diff.x, 1)}, ${formatNum(diff.y, 1)})`,
          lineWidth: 3.25,
        });
      }

      return {
        supportsZoom: true,
        supportsResultantToggle: true,
        supportsComponentsToggle: true,
        leftControls: (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="text-xs font-semibold text-blue-700">Vector A</div>
              <ParamControl
                id="sub-ax"
                label="Ax"
                value={vecA.x}
                min={-6}
                max={6}
                step={0.5}
                accentColor="#2563EB"
                onChange={(x) => setVecA((p) => ({ ...p, x }))}
              />
              <ParamControl
                id="sub-ay"
                label="Ay"
                value={vecA.y}
                min={-6}
                max={6}
                step={0.5}
                accentColor="#2563EB"
                onChange={(y) => setVecA((p) => ({ ...p, y }))}
              />
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-600">Vector B (Subtracted)</div>
              <ParamControl
                id="sub-bx"
                label="Bx"
                value={vecB.x}
                min={-6}
                max={6}
                step={0.5}
                accentColor="#059669"
                onChange={(x) => setVecB((p) => ({ ...p, x }))}
              />
              <ParamControl
                id="sub-by"
                label="By"
                value={vecB.y}
                min={-6}
                max={6}
                step={0.5}
                accentColor="#059669"
                onChange={(y) => setVecB((p) => ({ ...p, y }))}
              />
            </div>
          </div>
        ),
        centerCanvas: (
          <Vector2DCanvas
            vectors={vectors}
            showGrid={displayOptions.showGrid}
            showAxisLabels={displayOptions.showAxisLabels}
            showVectorLabels={displayOptions.showVectorLabels}
            zoom={displayOptions.zoom}
            onDragVector={(id, _target, pos) => {
              if (id === 'sub-A') setVecA(pos);
              if (id === 'sub-B') setVecB(pos);
            }}
            ariaLabel="Vector subtraction simulation canvas"
          />
        ),
        rightCalculations: (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
                <div className="text-red-700 font-medium">|A - B|</div>
                <div className="font-mono font-bold text-base text-red-900 tabular-nums mt-0.5">
                  {formatNum(diffPolar.magnitude)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
                <div className="text-red-700 font-medium">Angle</div>
                <div className="font-mono font-bold text-base text-red-900 tabular-nums mt-0.5">
                  {formatNum(diffPolar.angleDeg, 1)}°
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 bg-white overflow-x-auto">
              <MathBlock latex={`-\\vec{B} = (${formatNum(negB.x, 1)},\\, ${formatNum(negB.y, 1)})`} />
              <MathBlock
                latex={`D_x = A_x - B_x = ${formatNum(vecA.x, 1)} - (${formatNum(vecB.x, 1)}) = ${formatNum(diff.x, 1)}`}
              />
              <MathBlock
                latex={`D_y = A_y - B_y = ${formatNum(vecA.y, 1)} - (${formatNum(vecB.y, 1)}) = ${formatNum(diff.y, 1)}`}
              />
            </div>

            <p className="text-slate-600 leading-relaxed">
              <MathText text="Reversing $\mathbf{B}$ by $180^\circ$ produces $-\mathbf{B}$ (dashed green). Adding $-\mathbf{B}$ head-to-tail onto $\mathbf{A}$ yields $\mathbf{A} - \mathbf{B}$." />
            </p>
          </div>
        ),
      };
    }

    if (activeSimId === 'resolution') {
      const { ax, ay, magnitude, angleDeg } = resolveVector(repMag, repAngle);
      const animAx = ax * resPhase;
      const animAy = ay * resPhase;

      const vectors: CanvasVectorItem[] = [
        {
          id: 'res-A',
          tail: { x: 0, y: 0 },
          head: { x: ax, y: ay },
          color: '#2563EB',
          label: `A = ${formatNum(magnitude, 1)}`,
          draggableHead: true,
        },
      ];

      if (displayOptions.showComponents) {
        vectors.push({
          id: 'res-Ax',
          tail: { x: 0, y: 0 },
          head: { x: animAx, y: 0 },
          color: '#059669',
          label: `Ax = ${formatNum(ax, 2)}`,
          lineWidth: 3,
        });
        vectors.push({
          id: 'res-Ay',
          tail: { x: 0, y: 0 },
          head: { x: 0, y: animAy },
          color: '#D97706',
          label: `Ay = ${formatNum(ay, 2)}`,
          lineWidth: 3,
        });
      }

      return {
        supportsZoom: true,
        supportsResultantToggle: false,
        supportsComponentsToggle: true,
        supportsAnimation: true,
        isPlaying: resPlaying,
        onTogglePlay: () => setResPlaying((p) => !p),
        animationSpeed: resSpeed,
        onChangeAnimationSpeed: setResSpeed,
        leftControls: (
          <div className="space-y-4">
            <ParamControl
              id="res-mag"
              label="Magnitude A"
              value={repMag}
              min={1}
              max={8}
              step={0.1}
              onChange={setRepMag}
            />
            <ParamControl
              id="res-angle"
              label="Angle θ"
              value={repAngle}
              min={0}
              max={360}
              step={1}
              unit="°"
              onChange={setRepAngle}
            />
            <p className="text-xs text-slate-500">
              Watch the perpendicular projections sweep along the x and y axes, or pause and drag A directly.
            </p>
          </div>
        ),
        centerCanvas: (
          <Vector2DCanvas
            vectors={vectors}
            segments={
              displayOptions.showComponents
                ? [
                    { from: { x: ax, y: ay }, to: { x: animAx, y: 0 }, color: '#059669', dashed: true },
                    { from: { x: ax, y: ay }, to: { x: 0, y: animAy }, color: '#D97706', dashed: true },
                  ]
                : []
            }
            arcs={[
              {
                center: { x: 0, y: 0 },
                startRad: 0,
                endRad: degToRad(angleDeg),
                radiusUnits: Math.min(1.6, magnitude * 0.4),
                color: '#64748B',
                label: `${formatNum(angleDeg, 0)}°`,
              },
            ]}
            showGrid={displayOptions.showGrid}
            showAxisLabels={displayOptions.showAxisLabels}
            showVectorLabels={displayOptions.showVectorLabels}
            zoom={displayOptions.zoom}
            onDragVector={(_id, _target, pos) => {
              const polar = toPolar(pos);
              setRepMag(clampNumber(polar.magnitude, 1, 8));
              setRepAngle(Math.round(polar.angleDeg));
            }}
            ariaLabel="Vector resolution interactive animation canvas"
          />
        ),
        rightCalculations: (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="text-emerald-700 font-medium">Ax = A cos θ</div>
                <div className="font-mono font-bold text-base text-emerald-900 tabular-nums mt-0.5">
                  {formatNum(ax)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                <div className="text-amber-700 font-medium">Ay = A sin θ</div>
                <div className="font-mono font-bold text-base text-amber-900 tabular-nums mt-0.5">
                  {formatNum(ay)}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 bg-white overflow-x-auto">
              <MathBlock
                latex={`A_x = ${formatNum(magnitude)}\\cos(${formatNum(angleDeg, 1)}^\\circ) = ${formatNum(ax)}`}
              />
              <MathBlock
                latex={`A_y = ${formatNum(magnitude)}\\sin(${formatNum(angleDeg, 1)}^\\circ) = ${formatNum(ay)}`}
              />
              <MathBlock
                latex={`A_x^2 + A_y^2 = ${formatNum(ax ** 2 + ay ** 2)} = A^2`}
              />
            </div>

            <p className="text-slate-600 leading-relaxed">
              <MathText text="The dashed projection rays drop orthogonally onto each axis, decomposing $\mathbf{A}$ into two independent perpendicular vectors." />
            </p>
          </div>
        ),
      };
    }

    if (activeSimId === 'unit-vectors') {
      const mag = magnitude3D(unitVec);
      const uHat: Vector3D =
        mag > 1e-6 ? { x: unitVec.x / mag, y: unitVec.y / mag, z: unitVec.z / mag } : { x: 0, y: 0, z: 0 };

      return {
        supportsZoom: !unitMode3D,
        supportsResultantToggle: true,
        supportsComponentsToggle: false,
        leftControls: (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setUnitMode3D(false)}
                className={`py-1.5 px-2 rounded-md text-xs font-medium transition-colors ${
                  !unitMode3D ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                2D (i, j)
              </button>
              <button
                type="button"
                onClick={() => setUnitMode3D(true)}
                className={`py-1.5 px-2 rounded-md text-xs font-medium transition-colors ${
                  unitMode3D ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                3D (i, j, k)
              </button>
            </div>

            <ParamControl
              id="uv-ax"
              label="Ax (along î)"
              value={unitVec.x}
              min={-5}
              max={5}
              step={0.5}
              accentColor="#2563EB"
              onChange={(x) => setUnitVec((p) => ({ ...p, x }))}
            />
            <ParamControl
              id="uv-ay"
              label="Ay (along ĵ)"
              value={unitVec.y}
              min={-5}
              max={5}
              step={0.5}
              accentColor="#059669"
              onChange={(y) => setUnitVec((p) => ({ ...p, y }))}
            />
            {unitMode3D && (
              <ParamControl
                id="uv-az"
                label="Az (along k̂)"
                value={unitVec.z}
                min={-5}
                max={5}
                step={0.5}
                accentColor="#D97706"
                onChange={(z) => setUnitVec((p) => ({ ...p, z }))}
              />
            )}
          </div>
        ),
        centerCanvas: unitMode3D ? (
          <Vector3DCanvas
            vectors={[
              { id: 'basis-i', vec: { x: 1, y: 0, z: 0 }, color: 0x2563eb, label: 'î (1,0,0)' },
              { id: 'basis-j', vec: { x: 0, y: 1, z: 0 }, color: 0x059669, label: 'ĵ (0,1,0)' },
              { id: 'basis-k', vec: { x: 0, y: 0, z: 1 }, color: 0xd97706, label: 'k̂ (0,0,1)' },
              {
                id: 'vec-A-3d',
                vec: unitVec,
                color: 0x0f172a,
                label: 'A',
                visible: displayOptions.showResultant,
              },
              { id: 'vec-uhat', vec: uHat, color: 0xdc2626, label: 'û = A/|A|' },
            ]}
            showGrid={displayOptions.showGrid}
            showAxisLabels={displayOptions.showAxisLabels}
            ariaLabel="3D unit vectors i, j, k visualization"
          />
        ) : (
          <Vector2DCanvas
            vectors={[
              { id: 'i-hat', tail: { x: 0, y: 0 }, head: { x: 1, y: 0 }, color: '#2563EB', label: 'î', lineWidth: 3 },
              { id: 'j-hat', tail: { x: 0, y: 0 }, head: { x: 0, y: 1 }, color: '#059669', label: 'ĵ', lineWidth: 3 },
              {
                id: 'vec-A-2d',
                tail: { x: 0, y: 0 },
                head: { x: unitVec.x, y: unitVec.y },
                color: '#0F172A',
                label: `A = ${formatNum(unitVec.x, 1)}î ${formatSignedTerm(unitVec.y, 1)}ĵ`,
                draggableHead: true,
                showComponents: true,
              },
              {
                id: 'u-hat-2d',
                tail: { x: 0, y: 0 },
                head: {
                  x: magnitude2D({ x: unitVec.x, y: unitVec.y }) > 1e-6 ? unitVec.x / magnitude2D({ x: unitVec.x, y: unitVec.y }) : 0,
                  y: magnitude2D({ x: unitVec.x, y: unitVec.y }) > 1e-6 ? unitVec.y / magnitude2D({ x: unitVec.x, y: unitVec.y }) : 0,
                },
                color: '#DC2626',
                label: 'û (|û|=1)',
                lineWidth: 2.5,
              },
            ]}
            showGrid={displayOptions.showGrid}
            showAxisLabels={displayOptions.showAxisLabels}
            showVectorLabels={displayOptions.showVectorLabels}
            zoom={displayOptions.zoom}
            onDragVector={(_id, _target, pos) => setUnitVec((p) => ({ ...p, x: pos.x, y: pos.y }))}
            ariaLabel="2D unit vectors i and j visualization"
          />
        ),
        rightCalculations: (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500">Magnitude |A|</div>
                <div className="font-mono font-bold text-base text-slate-900 tabular-nums mt-0.5">
                  {formatNum(unitMode3D ? mag : magnitude2D({ x: unitVec.x, y: unitVec.y }))}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
                <div className="text-red-700 font-medium">Unit Vector |û|</div>
                <div className="font-mono font-bold text-base text-red-900 tabular-nums mt-0.5">
                  {mag > 1e-6 ? '1.00' : '0.00'}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 bg-white overflow-x-auto">
              <MathBlock
                latex={
                  unitMode3D
                    ? `\\vec{A} = ${formatNum(unitVec.x, 1)}\\hat{i} ${formatSignedTerm(unitVec.y, 1)}\\hat{j} ${formatSignedTerm(unitVec.z, 1)}\\hat{k}`
                    : `\\vec{A} = ${formatNum(unitVec.x, 1)}\\hat{i} ${formatSignedTerm(unitVec.y, 1)}\\hat{j}`
                }
              />
              {unitMode3D && (
                <MathBlock
                  latex={`\\hat{u} = ${formatNum(uHat.x)}\\hat{i} ${formatSignedTerm(uHat.y)}\\hat{j} ${formatSignedTerm(uHat.z)}\\hat{k}`}
                />
              )}
            </div>

            <p className="text-slate-600 leading-relaxed">
              <MathText text="The basis triad $\hat{i}, \hat{j}, \hat{k}$ provides pure orthogonal directions of length 1. Dividing $\mathbf{A}$ by $|\mathbf{A}|$ yields the unit direction vector $\hat{u}$." />
            </p>
          </div>
        ),
      };
    }

    if (activeSimId === 'dot-product') {
      const magA = magnitude2D(vecA);
      const magB = magnitude2D(vecB);
      const dot = dotProduct2D(vecA, vecB);
      const theta = angleBetween2D(vecA, vecB);
      const scalarProj = scalarProjection2D(vecA, vecB);
      const vecProj = vectorProjection2D(vecA, vecB);

      const angleA = Math.atan2(vecA.y, vecA.x);
      const angleB = Math.atan2(vecB.y, vecB.x);

      return {
        supportsZoom: true,
        supportsResultantToggle: true,
        supportsComponentsToggle: true,
        leftControls: (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                Quick Angle Presets
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setVecA({ x: 4, y: 0 });
                    setVecB({ x: 5, y: 0 });
                  }}
                  className="px-2 py-1.5 rounded border border-slate-200 hover:bg-blue-50 text-xs font-medium text-slate-700"
                >
                  Parallel (0°)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVecA({ x: 0, y: 4 });
                    setVecB({ x: 5, y: 0 });
                  }}
                  className="px-2 py-1.5 rounded border border-slate-200 hover:bg-blue-50 text-xs font-medium text-slate-700"
                >
                  Perp. (90°)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVecA({ x: -4, y: 0 });
                    setVecB({ x: 5, y: 0 });
                  }}
                  className="px-2 py-1.5 rounded border border-slate-200 hover:bg-blue-50 text-xs font-medium text-slate-700"
                >
                  Anti (180°)
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="text-xs font-semibold text-blue-700">Vector A</div>
              <ParamControl
                id="dot-ax"
                label="Ax"
                value={vecA.x}
                min={-6}
                max={6}
                step={0.5}
                accentColor="#2563EB"
                onChange={(x) => setVecA((p) => ({ ...p, x }))}
              />
              <ParamControl
                id="dot-ay"
                label="Ay"
                value={vecA.y}
                min={-6}
                max={6}
                step={0.5}
                accentColor="#2563EB"
                onChange={(y) => setVecA((p) => ({ ...p, y }))}
              />
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="text-xs font-semibold text-emerald-700">Vector B</div>
              <ParamControl
                id="dot-bx"
                label="Bx"
                value={vecB.x}
                min={-6}
                max={6}
                step={0.5}
                accentColor="#059669"
                onChange={(x) => setVecB((p) => ({ ...p, x }))}
              />
              <ParamControl
                id="dot-by"
                label="By"
                value={vecB.y}
                min={-6}
                max={6}
                step={0.5}
                accentColor="#059669"
                onChange={(y) => setVecB((p) => ({ ...p, y }))}
              />
            </div>
          </div>
        ),
        centerCanvas: (
          <Vector2DCanvas
            vectors={[
              {
                id: 'dot-A',
                tail: { x: 0, y: 0 },
                head: vecA,
                color: '#2563EB',
                label: `A (${formatNum(vecA.x, 1)}, ${formatNum(vecA.y, 1)})`,
                draggableHead: true,
                showComponents: displayOptions.showComponents,
              },
              {
                id: 'dot-B',
                tail: { x: 0, y: 0 },
                head: vecB,
                color: '#059669',
                label: `B (${formatNum(vecB.x, 1)}, ${formatNum(vecB.y, 1)})`,
                draggableHead: true,
              },
              ...(displayOptions.showResultant
                ? [
                    {
                      id: 'dot-proj',
                      tail: { x: 0, y: 0 },
                      head: vecProj,
                      color: '#DC2626',
                      label: `proj_B(A)`,
                      lineWidth: 3.5,
                    },
                  ]
                : []),
            ]}
            segments={
              displayOptions.showResultant
                ? [{ from: vecA, to: vecProj, color: '#94A3B8', dashed: true }]
                : []
            }
            arcs={
              magA > 0.1 && magB > 0.1
                ? [
                    {
                      center: { x: 0, y: 0 },
                      startRad: angleB,
                      endRad: angleA,
                      radiusUnits: Math.min(1.5, Math.min(magA, magB) * 0.45),
                      color: '#64748B',
                      label: `${formatNum(theta, 1)}°`,
                    },
                  ]
                : []
            }
            showGrid={displayOptions.showGrid}
            showAxisLabels={displayOptions.showAxisLabels}
            showVectorLabels={displayOptions.showVectorLabels}
            zoom={displayOptions.zoom}
            onDragVector={(id, _target, pos) => {
              if (id === 'dot-A') setVecA(pos);
              if (id === 'dot-B') setVecB(pos);
            }}
            ariaLabel="Dot product and scalar projection simulation"
          />
        ),
        rightCalculations: (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-blue-700 font-medium">A · B (Scalar)</div>
                <div className="font-mono font-bold text-base text-blue-950 tabular-nums mt-0.5">
                  {formatNum(dot)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500">Angle θ</div>
                <div className="font-mono font-bold text-base text-slate-900 tabular-nums mt-0.5">
                  {formatNum(theta, 1)}°
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 col-span-2">
                <div className="text-slate-500">Scalar Projection (A cos θ)</div>
                <div className="font-mono font-semibold text-slate-900 tabular-nums mt-0.5">
                  {formatNum(scalarProj)}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 bg-white overflow-x-auto text-xs">
              <MathBlock
                latex={`\\vec{A}\\cdot\\vec{B} = (${formatNum(vecA.x, 1)})(${formatNum(vecB.x, 1)}) + (${formatNum(vecA.y, 1)})(${formatNum(vecB.y, 1)})`}
              />
              <MathBlock latex={`\\vec{A}\\cdot\\vec{B} = ${formatNum(dot)}`} />
              <MathBlock
                latex={`|\\vec{A}||\\vec{B}|\\cos(${formatNum(theta, 1)}^\\circ) = ${formatNum(magA * magB * Math.cos(degToRad(theta)))}`}
              />
            </div>

            <p className="text-slate-600 leading-relaxed">
              {Math.abs(dot) < 0.05
                ? 'Orthogonal! Because θ ≈ 90°, the vectors share zero directional alignment (A · B = 0).'
                : dot > 0
                  ? 'Positive dot product (θ < 90°): A has a forward component along B.'
                  : 'Negative dot product (θ > 90°): A points partially opposite to B.'}
            </p>
          </div>
        ),
      };
    }

    if (activeSimId === 'cross-product') {
      const cross = crossProduct3D(crossA, crossB);
      const magA = magnitude3D(crossA);
      const magB = magnitude3D(crossB);
      const magC = magnitude3D(cross);
      const theta = angleBetween3D(crossA, crossB);

      return {
        supportsZoom: false,
        supportsResultantToggle: true,
        supportsComponentsToggle: false,
        leftControls: (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setCrossA({ x: 3, y: 0, z: 0 });
                  setCrossB({ x: 0, y: 3, z: 0 });
                }}
                className="px-2 py-1.5 rounded border border-slate-200 hover:bg-blue-50 text-xs font-medium text-slate-700"
              >
                î × ĵ = k̂
              </button>
              <button
                type="button"
                onClick={() => {
                  setCrossA({ x: 0, y: 3, z: 0 });
                  setCrossB({ x: 3, y: 0, z: 0 });
                }}
                className="px-2 py-1.5 rounded border border-slate-200 hover:bg-blue-50 text-xs font-medium text-slate-700"
              >
                ĵ × î = -k̂
              </button>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="text-xs font-semibold text-blue-700">Vector A (3D)</div>
              <ParamControl
                id="cp-ax"
                label="Ax"
                value={crossA.x}
                min={-4}
                max={4}
                step={0.5}
                accentColor="#2563EB"
                onChange={(x) => setCrossA((p) => ({ ...p, x }))}
              />
              <ParamControl
                id="cp-ay"
                label="Ay"
                value={crossA.y}
                min={-4}
                max={4}
                step={0.5}
                accentColor="#2563EB"
                onChange={(y) => setCrossA((p) => ({ ...p, y }))}
              />
              <ParamControl
                id="cp-az"
                label="Az"
                value={crossA.z}
                min={-4}
                max={4}
                step={0.5}
                accentColor="#2563EB"
                onChange={(z) => setCrossA((p) => ({ ...p, z }))}
              />
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="text-xs font-semibold text-emerald-700">Vector B (3D)</div>
              <ParamControl
                id="cp-bx"
                label="Bx"
                value={crossB.x}
                min={-4}
                max={4}
                step={0.5}
                accentColor="#059669"
                onChange={(x) => setCrossB((p) => ({ ...p, x }))}
              />
              <ParamControl
                id="cp-by"
                label="By"
                value={crossB.y}
                min={-4}
                max={4}
                step={0.5}
                accentColor="#059669"
                onChange={(y) => setCrossB((p) => ({ ...p, y }))}
              />
              <ParamControl
                id="cp-bz"
                label="Bz"
                value={crossB.z}
                min={-4}
                max={4}
                step={0.5}
                accentColor="#059669"
                onChange={(z) => setCrossB((p) => ({ ...p, z }))}
              />
            </div>
          </div>
        ),
        centerCanvas: (
          <Vector3DCanvas
            vectors={[
              { id: 'cp-A', vec: crossA, color: 0x2563eb, label: 'A' },
              { id: 'cp-B', vec: crossB, color: 0x059669, label: 'B' },
              {
                id: 'cp-C',
                vec: cross,
                color: 0xdc2626,
                label: 'A × B',
                visible: displayOptions.showResultant,
              },
            ]}
            showGrid={displayOptions.showGrid}
            showAxisLabels={displayOptions.showAxisLabels}
            showParallelogram={true}
            parallelogramPair={[crossA, crossB]}
            showRightHandCurl={true}
            ariaLabel="3D cross product right-hand rule visualization"
          />
        ),
        rightCalculations: (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
                <div className="text-red-700 font-medium">|A × B| (Area)</div>
                <div className="font-mono font-bold text-base text-red-900 tabular-nums mt-0.5">
                  {formatNum(magC)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500">Angle θ</div>
                <div className="font-mono font-bold text-base text-slate-900 tabular-nums mt-0.5">
                  {formatNum(theta, 1)}°
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 bg-white overflow-x-auto text-xs">
              <MathBlock
                latex={`\\vec{A} \\times \\vec{B} = ${formatNum(cross.x, 1)}\\hat{i} ${formatSignedTerm(cross.y, 1)}\\hat{j} ${formatSignedTerm(cross.z, 1)}\\hat{k}`}
              />
              <MathBlock
                latex={`|\\vec{A}||\\vec{B}|\\sin(${formatNum(theta, 1)}^\\circ)`}
              />
              <MathBlock
                latex={`= (${formatNum(magA)})(${formatNum(magB)})(${formatNum(Math.sin(degToRad(theta)))}) = ${formatNum(magC)}`}
              />
            </div>

            <p className="text-slate-600 leading-relaxed">
              <MathText text="Curl your right-hand fingers along the amber arc from $\mathbf{A}$ to $\mathbf{B}$; your thumb points along $\mathbf{A} \times \mathbf{B}$ (red), perpendicular to the shaded parallelogram." />
            </p>
          </div>
        ),
      };
    }

    // H. Position & Displacement
    const disp = displacement2D(posR1, posR2);
    return {
      supportsZoom: true,
      supportsResultantToggle: true,
      supportsComponentsToggle: true,
      leftControls: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-700">Initial Position r₁</div>
            <ParamControl
              id="disp-x1"
              label="x₁"
              value={posR1.x}
              min={-7}
              max={7}
              step={0.5}
              unit="m"
              accentColor="#64748B"
              onChange={(x) => setPosR1((p) => ({ ...p, x }))}
            />
            <ParamControl
              id="disp-y1"
              label="y₁"
              value={posR1.y}
              min={-7}
              max={7}
              step={0.5}
              unit="m"
              accentColor="#64748B"
              onChange={(y) => setPosR1((p) => ({ ...p, y }))}
            />
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="text-xs font-semibold text-blue-700">Final Position r₂</div>
            <ParamControl
              id="disp-x2"
              label="x₂"
              value={posR2.x}
              min={-7}
              max={7}
              step={0.5}
              unit="m"
              accentColor="#2563EB"
              onChange={(x) => setPosR2((p) => ({ ...p, x }))}
            />
            <ParamControl
              id="disp-y2"
              label="y₂"
              value={posR2.y}
              min={-7}
              max={7}
              step={0.5}
              unit="m"
              accentColor="#2563EB"
              onChange={(y) => setPosR2((p) => ({ ...p, y }))}
            />
          </div>
          <p className="text-xs text-slate-500">
            Tip: Drag either the start point r₁ or end point r₂ directly on the plane.
          </p>
        </div>
      ),
      centerCanvas: (
        <Vector2DCanvas
          vectors={[
            {
              id: 'disp-r1',
              tail: { x: 0, y: 0 },
              head: posR1,
              color: '#64748B',
              label: `r₁ (${formatNum(posR1.x, 1)}, ${formatNum(posR1.y, 1)})`,
              draggableHead: true,
              lineWidth: 2.25,
            },
            {
              id: 'disp-r2',
              tail: { x: 0, y: 0 },
              head: posR2,
              color: '#2563EB',
              label: `r₂ (${formatNum(posR2.x, 1)}, ${formatNum(posR2.y, 1)})`,
              draggableHead: true,
              lineWidth: 2.25,
            },
            ...(displayOptions.showResultant
              ? [
                  {
                    id: 'disp-delta',
                    tail: posR1,
                    head: posR2,
                    color: '#DC2626',
                    label: `Δr (${formatNum(disp.delta.x, 1)}, ${formatNum(disp.delta.y, 1)})`,
                    lineWidth: 3.25,
                    showComponents: displayOptions.showComponents,
                  },
                ]
              : []),
          ]}
          showGrid={displayOptions.showGrid}
          showAxisLabels={displayOptions.showAxisLabels}
          showVectorLabels={displayOptions.showVectorLabels}
          zoom={displayOptions.zoom}
          unitSuffix="m"
          onDragVector={(id, _target, pos) => {
            if (id === 'disp-r1') setPosR1(pos);
            if (id === 'disp-r2') setPosR2(pos);
          }}
          ariaLabel="Position and displacement vector simulation"
        />
      ),
      rightCalculations: (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
              <div className="text-red-700 font-medium">Distance |Δr|</div>
              <div className="font-mono font-bold text-base text-red-900 tabular-nums mt-0.5">
                {formatNum(disp.magnitude)} m
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
              <div className="text-red-700 font-medium">Heading θ</div>
              <div className="font-mono font-bold text-base text-red-900 tabular-nums mt-0.5">
                {formatNum(disp.angleDeg, 1)}°
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 bg-white overflow-x-auto">
            <MathBlock
              latex={`\\Delta x = ${formatNum(posR2.x, 1)} - (${formatNum(posR1.x, 1)}) = ${formatNum(disp.delta.x, 1)}\\text{ m}`}
            />
            <MathBlock
              latex={`\\Delta y = ${formatNum(posR2.y, 1)} - (${formatNum(posR1.y, 1)}) = ${formatNum(disp.delta.y, 1)}\\text{ m}`}
            />
            <MathBlock
              latex={`|\\Delta\\vec{r}| = \\sqrt{(${formatNum(disp.delta.x, 1)})^2 + (${formatNum(disp.delta.y, 1)})^2} = ${formatNum(disp.magnitude)}\\text{ m}`}
            />
          </div>

          <p className="text-slate-600 leading-relaxed">
            <MathText text="Notice that $\mathbf{r}_1 + \Delta\mathbf{r} = \mathbf{r}_2$. Even if the origin shifts, $\Delta\mathbf{r}$ stays invariant." />
          </p>
        </div>
      ),
    };
  };

  const content = renderSimulationContent();

  return (
    <SimulationWorkspace
      config={simConfig}
      allSimulations={SIMULATIONS.filter((s) => s.chapterId === 'vectors')}
      onSelectSimulation={onChangeSimId}
      onReset={handleReset}
      displayOptions={displayOptions}
      onChangeDisplayOptions={setDisplayOptions}
      supportsAnimation={content.supportsAnimation}
      isPlaying={content.isPlaying}
      onTogglePlay={content.onTogglePlay}
      animationSpeed={content.animationSpeed}
      onChangeAnimationSpeed={content.onChangeAnimationSpeed}
      supportsZoom={content.supportsZoom}
      supportsResultantToggle={content.supportsResultantToggle}
      supportsComponentsToggle={content.supportsComponentsToggle}
      leftControls={content.leftControls}
      centerCanvas={content.centerCanvas}
      rightCalculations={content.rightCalculations}
      onNavigateTopic={onNavigateTopicTitle}
    />
  );
}
