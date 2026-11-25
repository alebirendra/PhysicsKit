import { useEffect, useState } from 'react';
import { SIMULATIONS, getSimulationById } from '../../content/registry';
import type { SimulationId } from '../../types/physics';
import {
  accelerationAtTime,
  averageAcceleration1D,
  averageVelocity1D,
  constantAccelSpeedSquared,
  deltaVelocity1D,
  displacement1D,
  motionBehaviorLabel,
  positionAtTime,
  riemannMidpointIntegral,
  timeInterval,
  totalDistance1D,
  velocityAtTime,
} from '../../services/physics/kinematicsMath';
import { formatNum } from '../../services/physics/vectorMath';
import { MathBlock, MathText } from '../../components/equations/MathText';
import { ParamControl } from '../../components/simulation/ParamControl';
import {
  type DisplayOptionsState,
  SimulationWorkspace,
} from '../../components/simulation/SimulationWorkspace';
import { KinematicsCanvas } from './KinematicsCanvas';

interface KinematicsLabProps {
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

export function KinematicsLab({ activeSimId, onChangeSimId, onNavigateTopicTitle }: KinematicsLabProps) {
  const kinematicsSims = SIMULATIONS.filter((s) => s.chapterId === 'kinematics');
  const simConfig =
    kinematicsSims.find((s) => s.id === activeSimId) ??
    getSimulationById('kinematics-motion') ??
    kinematicsSims[0];

  const [displayOptions, setDisplayOptions] = useState<DisplayOptionsState>(DEFAULT_DISPLAY);

  // Shared kinematic parameters
  const [x0, setX0] = useState(0);
  const [v0, setV0] = useState(4);
  const [a0, setA0] = useState(2);
  const [jerk, setJerk] = useState(0);
  const [t1, setT1] = useState(1);
  const [t2, setT2] = useState(5);
  const [tNow, setTNow] = useState(3);
  const tMax = 8;

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Mode-specific toggles
  const [integralTarget, setIntegralTarget] = useState<'velocity' | 'acceleration'>('velocity');
  const [riemannBins, setRiemannBins] = useState(8);

  // Reset jerk to 0 when entering constant-acceleration or basic motion labs
  useEffect(() => {
    if (simConfig.id === 'kinematics-constant-accel' || simConfig.id === 'kinematics-motion') {
      setJerk(0);
    } else if (simConfig.id === 'kinematics-integrals' && jerk === 0) {
      setJerk(0.6);
      setA0(0.5);
      setV0(2);
    } else if (simConfig.id === 'kinematics-acceleration' && jerk === 0) {
      setJerk(0.5);
    }
  }, [simConfig.id]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;
    let rafId = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setTNow((prev) => {
        const next = prev + dt * speed;
        return next > tMax ? 0 : Number(next.toFixed(3));
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, speed]);

  const handleReset = () => {
    setDisplayOptions(DEFAULT_DISPLAY);
    setIsPlaying(false);
    setX0(0);
    setT1(1);
    setT2(5);
    setTNow(3);
    if (simConfig.id === 'kinematics-integrals') {
      setV0(2);
      setA0(0.5);
      setJerk(0.6);
      setRiemannBins(8);
    } else if (simConfig.id === 'kinematics-acceleration') {
      setV0(-4);
      setA0(1);
      setJerk(0.5);
    } else if (simConfig.id === 'kinematics-velocity') {
      setV0(6);
      setA0(-2);
      setJerk(0);
    } else {
      setV0(4);
      setA0(2);
      setJerk(0);
    }
  };

  const ta = Math.min(t1, t2);
  const tb = Math.max(t1, t2);
  const dtInterval = timeInterval(ta, tb);
  const xAt1 = positionAtTime(x0, v0, a0, jerk, ta);
  const xAt2 = positionAtTime(x0, v0, a0, jerk, tb);
  const dx = displacement1D(x0, v0, a0, jerk, ta, tb);
  const dist = totalDistance1D(v0, a0, jerk, ta, tb);
  const vAt1 = velocityAtTime(v0, a0, jerk, ta);
  const vAt2 = velocityAtTime(v0, a0, jerk, tb);
  const dv = deltaVelocity1D(v0, a0, jerk, ta, tb);
  const vAvg = averageVelocity1D(x0, v0, a0, jerk, ta, tb);
  const aAvg = averageAcceleration1D(v0, a0, jerk, ta, tb);

  const xNow = positionAtTime(x0, v0, a0, jerk, tNow);
  const vNow = velocityAtTime(v0, a0, jerk, tNow);
  const aNow = accelerationAtTime(a0, jerk, tNow);
  const behavior = motionBehaviorLabel(vNow, aNow);

  const renderByMode = () => {
    if (simConfig.id === 'kinematics-motion') {
      return {
        mode: 'motion' as const,
        leftExtra: (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-600">Quick Scenarios</div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setX0(-4);
                  setV0(6);
                  setA0(-2);
                  setJerk(0);
                  setT1(0);
                  setT2(6);
                }}
                className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                Turnaround &amp; Return
              </button>
              <button
                type="button"
                onClick={() => {
                  setX0(2);
                  setV0(3);
                  setA0(0);
                  setJerk(0);
                  setT1(1);
                  setT2(5);
                }}
                className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                Steady Motion
              </button>
            </div>
          </div>
        ),
        rightExtra: (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-blue-700 font-medium">Displacement Δx</div>
                <div className="font-mono font-bold text-base text-blue-950 tabular-nums mt-0.5">
                  {formatNum(dx, 2)} m
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-600 font-medium">Total Distance d</div>
                <div className="font-mono font-bold text-base text-slate-900 tabular-nums mt-0.5">
                  {formatNum(dist, 2)} m
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-600 font-medium">Time Interval Δt</div>
                <div className="font-mono font-bold text-base text-slate-900 tabular-nums mt-0.5">
                  {formatNum(dtInterval, 2)} s
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="text-emerald-700 font-medium">Position x(t)</div>
                <div className="font-mono font-bold text-base text-emerald-950 tabular-nums mt-0.5">
                  {formatNum(xNow, 2)} m
                </div>
              </div>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-white overflow-x-auto">
              <MathBlock
                latex={`\\Delta t = ${formatNum(tb, 1)} - ${formatNum(ta, 1)} = ${formatNum(dtInterval, 1)}\\text{ s}`}
              />
              <MathBlock
                latex={`\\Delta x = x(${formatNum(tb, 1)}) - x(${formatNum(ta, 1)}) = ${formatNum(xAt2, 1)} - (${formatNum(xAt1, 1)}) = ${formatNum(dx, 1)}\\text{ m}`}
              />
            </div>
          </div>
        ),
      };
    }

    if (simConfig.id === 'kinematics-velocity') {
      return {
        mode: 'velocity-slopes' as const,
        leftExtra: (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-600">Limit Experiment (Δt → 0)</div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setT1(Math.max(0, Number((tNow - 0.15).toFixed(2))));
                  setT2(Math.min(tMax, Number((tNow + 0.15).toFixed(2))));
                }}
                className="px-2.5 py-1 rounded border border-blue-200 bg-blue-50 hover:bg-blue-100 text-xs font-medium text-blue-800"
              >
                Shrink Interval Around t
              </button>
              <button
                type="button"
                onClick={() => {
                  setT1(1);
                  setT2(6);
                }}
                className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                Wide Secant [1, 6]
              </button>
            </div>
          </div>
        ),
        rightExtra: (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
                <div className="text-red-700 font-medium">Secant v_avg</div>
                <div className="font-mono font-bold text-base text-red-950 tabular-nums mt-0.5">
                  {formatNum(vAvg, 2)} m/s
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="text-emerald-700 font-medium">Tangent v(t)</div>
                <div className="font-mono font-bold text-base text-emerald-950 tabular-nums mt-0.5">
                  {formatNum(vNow, 2)} m/s
                </div>
              </div>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-white overflow-x-auto">
              <MathBlock
                latex={`v_{\\text{avg}} = \\frac{${formatNum(xAt2, 1)} - (${formatNum(xAt1, 1)})}{${formatNum(tb, 1)} - ${formatNum(ta, 1)}} = ${formatNum(vAvg, 2)}\\text{ m/s}`}
              />
              <MathBlock
                latex={`v(${formatNum(tNow, 1)}) = \\left.\\frac{dx}{dt}\\right|_{t=${formatNum(tNow, 1)}} = ${formatNum(vNow, 2)}\\text{ m/s}`}
              />
            </div>
            <p className="text-slate-600 leading-relaxed">
              <MathText text="Shrink $[t_1, t_2]$ around $t$ to watch the dashed red secant line align with the solid black tangent line." />
            </p>
          </div>
        ),
      };
    }

    if (simConfig.id === 'kinematics-acceleration') {
      return {
        mode: 'acceleration-slopes' as const,
        leftExtra: (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <ParamControl
              id="kin-jerk"
              label="Jerk j = da/dt"
              value={jerk}
              min={-2}
              max={2}
              step={0.1}
              unit="m/s³"
              accentColor="#D97706"
              onChange={setJerk}
            />
          </div>
        ),
        rightExtra: (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
                <div className="text-red-700 font-medium">Secant a_avg</div>
                <div className="font-mono font-bold text-base text-red-950 tabular-nums mt-0.5">
                  {formatNum(aAvg, 2)} m/s²
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                <div className="text-amber-800 font-medium">Tangent a(t)</div>
                <div className="font-mono font-bold text-base text-amber-950 tabular-nums mt-0.5">
                  {formatNum(aNow, 2)} m/s²
                </div>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-slate-500 font-medium">Instantaneous Behavior</div>
              <div className="font-semibold text-slate-900 mt-0.5">{behavior}</div>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-white overflow-x-auto">
              <MathBlock
                latex={`a_{\\text{avg}} = \\frac{v(${formatNum(tb, 1)}) - v(${formatNum(ta, 1)})}{${formatNum(dtInterval, 1)}} = ${formatNum(aAvg, 2)}\\text{ m/s}^2`}
              />
              <MathBlock
                latex={`a(${formatNum(tNow, 1)}) = ${formatNum(a0, 1)} + (${formatNum(jerk, 1)})(${formatNum(tNow, 1)}) = ${formatNum(aNow, 2)}\\text{ m/s}^2`}
              />
            </div>
          </div>
        ),
      };
    }

    if (simConfig.id === 'kinematics-constant-accel') {
      const rectArea = vAt1 * dtInterval;
      const triArea = 0.5 * a0 * dtInterval * dtInterval;
      const vSq = constantAccelSpeedSquared(v0, a0, xNow - x0);
      return {
        mode: 'constant-accel' as const,
        leftExtra: (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-600">Constant-a Presets</div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setX0(0);
                  setV0(18);
                  setA0(-9.8);
                  setT1(0);
                  setT2(4);
                  setTNow(2);
                }}
                className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                Vertical Toss (g = −9.8)
              </button>
              <button
                type="button"
                onClick={() => {
                  setX0(0);
                  setV0(16);
                  setA0(-2);
                  setT1(0);
                  setT2(6);
                  setTNow(4);
                }}
                className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                Uniform Braking
              </button>
            </div>
          </div>
        ),
        rightExtra: (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
                <div className="text-red-700 font-medium">a–t Area (Δv)</div>
                <div className="font-mono font-bold text-base text-red-950 tabular-nums mt-0.5">
                  {formatNum(dv, 2)} m/s
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="text-emerald-700 font-medium">v–t Area (Δx)</div>
                <div className="font-mono font-bold text-base text-emerald-950 tabular-nums mt-0.5">
                  {formatNum(dx, 2)} m
                </div>
              </div>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-white space-y-1 overflow-x-auto">
              <MathBlock latex={`\\text{Rect} = v_1\\Delta t = ${formatNum(rectArea, 1)}\\text{ m}`} />
              <MathBlock latex={`\\text{Tri} = \\tfrac{1}{2}a(\\Delta t)^2 = ${formatNum(triArea, 1)}\\text{ m}`} />
              <MathBlock latex={`v^2 = v_0^2 + 2a\\Delta x = ${formatNum(vSq, 1)}\\;(\\text{m/s})^2`} />
            </div>
          </div>
        ),
      };
    }

    // kinematics-integrals
    const targetFn =
      integralTarget === 'acceleration'
        ? (t: number) => accelerationAtTime(a0, jerk, t)
        : (t: number) => velocityAtTime(v0, a0, jerk, t);
    const { sum: riemannSum } = riemannMidpointIntegral(targetFn, ta, tb, riemannBins);
    const exactIntegral = integralTarget === 'acceleration' ? dv : dx;

    return {
      mode: 'integrals' as const,
      leftExtra: (
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <ParamControl
            id="kin-int-jerk"
            label="Jerk j = da/dt"
            value={jerk}
            min={-2}
            max={2}
            step={0.1}
            unit="m/s³"
            accentColor="#D97706"
            onChange={setJerk}
          />
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-1.5">Integrate Function</div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setIntegralTarget('acceleration')}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
                  integralTarget === 'acceleration'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                ∫ a(t) dt = Δv
              </button>
              <button
                type="button"
                onClick={() => setIntegralTarget('velocity')}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
                  integralTarget === 'velocity'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                ∫ v(t) dt = Δx
              </button>
            </div>
          </div>
          <ParamControl
            id="kin-bins"
            label="Riemann Subintervals N"
            value={riemannBins}
            min={2}
            max={40}
            step={1}
            unit=""
            accentColor="#4F46E5"
            onChange={(val) => setRiemannBins(Math.round(val))}
          />
        </div>
      ),
      rightExtra: (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200">
              <div className="text-indigo-700 font-medium">Riemann Sum (N={riemannBins})</div>
              <div className="font-mono font-bold text-base text-indigo-950 tabular-nums mt-0.5">
                {formatNum(riemannSum, 2)} {integralTarget === 'acceleration' ? 'm/s' : 'm'}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-blue-700 font-medium">Exact Definite Integral</div>
              <div className="font-mono font-bold text-base text-blue-950 tabular-nums mt-0.5">
                {formatNum(exactIntegral, 2)} {integralTarget === 'acceleration' ? 'm/s' : 'm'}
              </div>
            </div>
          </div>
          {integralTarget === 'velocity' && (
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Total Distance ∫|v(t)|dt</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">{formatNum(dist, 2)} m</span>
            </div>
          )}
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white overflow-x-auto">
            {integralTarget === 'acceleration' ? (
              <MathBlock
                latex={`\\Delta v = \\int_{${formatNum(ta, 1)}}^{${formatNum(tb, 1)}} (${formatNum(a0, 1)} + ${formatNum(jerk, 1)}t)\\,dt = ${formatNum(dv, 2)}\\text{ m/s}`}
              />
            ) : (
              <MathBlock
                latex={`\\Delta x = \\int_{${formatNum(ta, 1)}}^{${formatNum(tb, 1)}} v(t)\\,dt = ${formatNum(dx, 2)}\\text{ m}`}
              />
            )}
          </div>
        </div>
      ),
    };
  };

  const view = renderByMode();

  return (
    <SimulationWorkspace
      config={simConfig}
      allSimulations={kinematicsSims}
      onSelectSimulation={onChangeSimId}
      onReset={handleReset}
      displayOptions={displayOptions}
      onChangeDisplayOptions={setDisplayOptions}
      supportsAnimation
      isPlaying={isPlaying}
      onTogglePlay={() => setIsPlaying((p) => !p)}
      animationSpeed={speed}
      onChangeAnimationSpeed={setSpeed}
      supportsZoom
      supportsResultantToggle={false}
      supportsComponentsToggle={simConfig.id === 'kinematics-constant-accel'}
      leftControls={
        <div className="space-y-3.5">
          <ParamControl
            id="kin-x0"
            label="Initial Position x₀"
            value={x0}
            min={-15}
            max={15}
            step={0.5}
            unit="m"
            accentColor="#2563EB"
            onChange={setX0}
          />
          <ParamControl
            id="kin-v0"
            label="Initial Velocity v₀"
            value={v0}
            min={-15}
            max={20}
            step={0.5}
            unit="m/s"
            accentColor="#059669"
            onChange={setV0}
          />
          <ParamControl
            id="kin-a0"
            label="Acceleration a₀"
            value={a0}
            min={-12}
            max={10}
            step={0.2}
            unit="m/s²"
            accentColor="#DC2626"
            onChange={setA0}
          />
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <ParamControl
              id="kin-t1"
              label="Interval Start t₁"
              value={t1}
              min={0}
              max={tMax - 0.5}
              step={0.25}
              unit="s"
              accentColor="#64748B"
              onChange={(val) => setT1(Math.min(val, t2 - 0.25))}
            />
            <ParamControl
              id="kin-t2"
              label="Interval End t₂"
              value={t2}
              min={0.5}
              max={tMax}
              step={0.25}
              unit="s"
              accentColor="#0F172A"
              onChange={(val) => setT2(Math.max(val, t1 + 0.25))}
            />
            <ParamControl
              id="kin-tnow"
              label="Inspect Instant t"
              value={tNow}
              min={0}
              max={tMax}
              step={0.1}
              unit="s"
              accentColor="#2563EB"
              onChange={(val) => {
                setIsPlaying(false);
                setTNow(val);
              }}
            />
          </div>
          {view.leftExtra}
        </div>
      }
      centerCanvas={
        <KinematicsCanvas
          mode={view.mode}
          x0={x0}
          v0={v0}
          a0={a0}
          jerk={jerk}
          tMax={tMax}
          tNow={tNow}
          t1={ta}
          t2={tb}
          integralTarget={integralTarget}
          riemannBins={riemannBins}
          showGrid={displayOptions.showGrid}
          showAxisLabels={displayOptions.showAxisLabels}
          showLabels={displayOptions.showVectorLabels}
          showAreaDecomposition={displayOptions.showComponents}
          zoom={displayOptions.zoom}
          onScrubTime={(t) => {
            setIsPlaying(false);
            setTNow(t);
          }}
          ariaLabel={simConfig.title}
        />
      }
      rightCalculations={view.rightExtra}
      onNavigateTopic={onNavigateTopicTitle}
    />
  );
}
