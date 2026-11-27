import { useEffect, useState } from 'react';
import { SIMULATIONS, getSimulationById } from '../../content/registry';
import type { SimulationId } from '../../types/physics';
import {
  averageVelocity2D,
  circularStateAtTime,
  decomposeAcceleration2D,
  displacement2D,
  position2D,
  projectileFlightSummary,
  projectileStateAtTime,
  riverCrossingSummary,
  velocity2D,
} from '../../services/physics/kinematics2dMath';
import { formatNum } from '../../services/physics/vectorMath';
import { MathBlock, MathText } from '../../components/equations/MathText';
import { ParamControl } from '../../components/simulation/ParamControl';
import {
  type DisplayOptionsState,
  SimulationWorkspace,
} from '../../components/simulation/SimulationWorkspace';
import { Kinematics2DCanvas } from './Kinematics2DCanvas';

interface Kinematics2DLabProps {
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

export function Kinematics2DLab({
  activeSimId,
  onChangeSimId,
  onNavigateTopicTitle,
}: Kinematics2DLabProps) {
  const sims2D = SIMULATIONS.filter((s) => s.chapterId === 'kinematics-2d');
  const simConfig =
    sims2D.find((s) => s.id === activeSimId) ??
    getSimulationById('kinematics2d-projectile') ??
    sims2D[0];

  const [displayOptions, setDisplayOptions] = useState<DisplayOptionsState>(DEFAULT_DISPLAY);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [tNow, setTNow] = useState(1.8);

  // Mode 1: 2D Motion Vectors
  const [vx0, setVx0] = useState(4);
  const [vy0, setVy0] = useState(7);
  const [ax, setAx] = useState(1.2);
  const [ay, setAy] = useState(-2.5);
  const [t1, setT1] = useState(0.5);
  const [t2, setT2] = useState(3.5);
  const tMaxVectors = 5;

  // Mode 2: Projectile Motion
  const [launchSpeed, setLaunchSpeed] = useState(25);
  const [launchAngleDeg, setLaunchAngleDeg] = useState(45);
  const [launchHeight, setLaunchHeight] = useState(0);
  const [gravity, setGravity] = useState(9.8);
  const [showComplementary, setShowComplementary] = useState(true);

  // Mode 3: Circular Motion
  const [radius, setRadius] = useState(5);
  const [circSpeed0, setCircSpeed0] = useState(6);
  const [tangentialAccel, setTangentialAccel] = useState(0);

  // Mode 4: Relative Velocity
  const [riverWidth, setRiverWidth] = useState(100);
  const [boatSpeed, setBoatSpeed] = useState(5);
  const [upstreamAngleDeg, setUpstreamAngleDeg] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(3);

  const projSummary = projectileFlightSummary(launchSpeed, launchAngleDeg, launchHeight, gravity);
  const riverSummary = riverCrossingSummary(riverWidth, boatSpeed, upstreamAngleDeg, currentSpeed);

  const activeTMax =
    simConfig.id === 'kinematics2d-projectile'
      ? Math.max(0.5, projSummary.timeOfFlight)
      : simConfig.id === 'kinematics2d-circular'
        ? 12
        : simConfig.id === 'kinematics2d-relative'
          ? Number.isFinite(riverSummary.crossingTime)
            ? riverSummary.crossingTime
            : 25
          : tMaxVectors;

  useEffect(() => {
    setIsPlaying(false);
    if (simConfig.id === 'kinematics2d-projectile') {
      setTNow(Number((projSummary.timeOfFlight * 0.45).toFixed(2)));
    } else if (simConfig.id === 'kinematics2d-relative') {
      setTNow(Number((Math.min(10, activeTMax * 0.5)).toFixed(2)));
    } else if (simConfig.id === 'kinematics2d-circular') {
      setTNow(1.2);
    } else {
      setTNow(2.0);
    }
  }, [simConfig.id]);

  useEffect(() => {
    if (!isPlaying) return;
    let rafId = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setTNow((prev) => {
        const next = prev + dt * speed;
        return next > activeTMax ? 0 : Number(next.toFixed(3));
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, speed, activeTMax]);

  const handleReset = () => {
    setDisplayOptions(DEFAULT_DISPLAY);
    setIsPlaying(false);
    setSpeed(1);
    if (simConfig.id === 'kinematics2d-vectors') {
      setVx0(4);
      setVy0(7);
      setAx(1.2);
      setAy(-2.5);
      setT1(0.5);
      setT2(3.5);
      setTNow(2.0);
    } else if (simConfig.id === 'kinematics2d-projectile') {
      setLaunchSpeed(25);
      setLaunchAngleDeg(45);
      setLaunchHeight(0);
      setGravity(9.8);
      setShowComplementary(true);
      setTNow(1.8);
    } else if (simConfig.id === 'kinematics2d-circular') {
      setRadius(5);
      setCircSpeed0(6);
      setTangentialAccel(0);
      setTNow(1.2);
    } else {
      setRiverWidth(100);
      setBoatSpeed(5);
      setUpstreamAngleDeg(0);
      setCurrentSpeed(3);
      setTNow(10);
    }
  };

  const renderByMode = () => {
    if (simConfig.id === 'kinematics2d-vectors') {
      const ta = Math.min(t1, t2);
      const tb = Math.max(t1, t2);
      const r1 = position2D(0, 0, vx0, vy0, ax, ay, ta);
      const r2 = position2D(0, 0, vx0, vy0, ax, ay, tb);
      const dr = displacement2D(r1, r2);
      const vAvg = averageVelocity2D(r1, r2, tb - ta);
      const rNow = position2D(0, 0, vx0, vy0, ax, ay, tNow);
      const vNow = velocity2D(vx0, vy0, ax, ay, tNow);
      const vSpeed = Math.hypot(vNow.x, vNow.y);
      const decomp = decomposeAcceleration2D(vNow.x, vNow.y, ax, ay);

      return {
        mode: 'vectors-2d' as const,
        leftControls: (
          <div className="space-y-3">
            <ParamControl
              id="k2d-vx0"
              label="Initial Velocity v₀x"
              value={vx0}
              min={-8}
              max={10}
              step={0.5}
              unit="m/s"
              accentColor="#059669"
              onChange={setVx0}
            />
            <ParamControl
              id="k2d-vy0"
              label="Initial Velocity v₀y"
              value={vy0}
              min={-8}
              max={12}
              step={0.5}
              unit="m/s"
              accentColor="#059669"
              onChange={setVy0}
            />
            <ParamControl
              id="k2d-ax"
              label="Acceleration a_x"
              value={ax}
              min={-4}
              max={4}
              step={0.2}
              unit="m/s²"
              accentColor="#DC2626"
              onChange={setAx}
            />
            <ParamControl
              id="k2d-ay"
              label="Acceleration a_y"
              value={ay}
              min={-6}
              max={4}
              step={0.2}
              unit="m/s²"
              accentColor="#DC2626"
              onChange={setAy}
            />
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <ParamControl
                id="k2d-tnow"
                label="Inspect Instant t"
                value={Math.min(tNow, tMaxVectors)}
                min={0}
                max={tMaxVectors}
                step={0.1}
                unit="s"
                accentColor="#2563EB"
                onChange={(val) => {
                  setIsPlaying(false);
                  setTNow(val);
                }}
              />
              <ParamControl
                id="k2d-t1"
                label="Interval Start t₁"
                value={t1}
                min={0}
                max={tMaxVectors - 0.5}
                step={0.25}
                unit="s"
                accentColor="#64748B"
                onChange={(v) => setT1(Math.min(v, t2 - 0.25))}
              />
              <ParamControl
                id="k2d-t2"
                label="Interval End t₂"
                value={t2}
                min={0.5}
                max={tMaxVectors}
                step={0.25}
                unit="s"
                accentColor="#7C3AED"
                onChange={(v) => setT2(Math.max(v, t1 + 0.25))}
              />
            </div>
          </div>
        ),
        rightCalculations: (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-blue-700 font-medium">Position |r(t)|</div>
                <div className="font-mono font-bold text-base text-blue-950 tabular-nums mt-0.5">
                  {formatNum(Math.hypot(rNow.x, rNow.y), 2)} m
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="text-emerald-700 font-medium">Speed |v(t)|</div>
                <div className="font-mono font-bold text-base text-emerald-950 tabular-nums mt-0.5">
                  {formatNum(vSpeed, 2)} m/s
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                <div className="text-amber-800 font-medium">Parallel a_∥</div>
                <div className="font-mono font-bold text-base text-amber-950 tabular-nums mt-0.5">
                  {formatNum(decomp.aParallelSigned, 2)} m/s²
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200">
                <div className="text-indigo-700 font-medium">Normal a_⊥</div>
                <div className="font-mono font-bold text-base text-indigo-950 tabular-nums mt-0.5">
                  {formatNum(decomp.aPerpMag, 2)} m/s²
                </div>
              </div>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-white space-y-1 overflow-x-auto">
              <MathBlock
                latex={`\\vec{r}(${formatNum(tNow, 1)}) = (${formatNum(rNow.x, 1)}\\hat{i} + ${formatNum(rNow.y, 1)}\\hat{j})\\text{ m}`}
              />
              <MathBlock
                latex={`\\vec{v}(${formatNum(tNow, 1)}) = (${formatNum(vNow.x, 1)}\\hat{i} + ${formatNum(vNow.y, 1)}\\hat{j})\\text{ m/s}`}
              />
              <MathBlock
                latex={`\\Delta\\vec{r} = (${formatNum(dr.x, 1)}\\hat{i} + ${formatNum(dr.y, 1)}\\hat{j})\\text{ m}`}
              />
              <MathBlock
                latex={`|\\vec{v}_{\\text{avg}}| = ${formatNum(Math.hypot(vAvg.x, vAvg.y), 2)}\\text{ m/s}`}
              />
            </div>
            <p className="text-slate-600 leading-relaxed">
              <MathText
                text={
                  decomp.isSpeedingUp
                    ? 'Because $a_\\parallel > 0$, speed is currently **increasing** while $a_\\perp$ curves the path.'
                    : 'Because $a_\\parallel \\le 0$, speed is **decreasing or stationary** while $a_\\perp$ curves the path.'
                }
              />
            </p>
          </div>
        ),
      };
    }

    if (simConfig.id === 'kinematics2d-projectile') {
      const clampedT = Math.min(tNow, projSummary.timeOfFlight);
      const cur = projectileStateAtTime(launchSpeed, launchAngleDeg, launchHeight, gravity, clampedT);
      return {
        mode: 'projectile' as const,
        leftControls: (
          <div className="space-y-3">
            <ParamControl
              id="k2d-v0"
              label="Launch Speed v₀"
              value={launchSpeed}
              min={5}
              max={45}
              step={1}
              unit="m/s"
              accentColor="#2563EB"
              onChange={setLaunchSpeed}
            />
            <ParamControl
              id="k2d-theta"
              label="Launch Angle θ₀"
              value={launchAngleDeg}
              min={5}
              max={85}
              step={1}
              unit="°"
              accentColor="#059669"
              onChange={setLaunchAngleDeg}
            />
            <ParamControl
              id="k2d-y0"
              label="Launch Height y₀"
              value={launchHeight}
              min={0}
              max={30}
              step={1}
              unit="m"
              accentColor="#64748B"
              onChange={setLaunchHeight}
            />
            <ParamControl
              id="k2d-g"
              label="Gravity g"
              value={gravity}
              min={1.6}
              max={20}
              step={0.2}
              unit="m/s²"
              accentColor="#DC2626"
              onChange={setGravity}
            />
            <ParamControl
              id="k2d-proj-t"
              label="Flight Time t"
              value={clampedT}
              min={0}
              max={Number(projSummary.timeOfFlight.toFixed(2))}
              step={0.05}
              unit="s"
              accentColor="#2563EB"
              onChange={(val) => {
                setIsPlaying(false);
                setTNow(val);
              }}
            />
            <label className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showComplementary}
                onChange={(e) => setShowComplementary(e.target.checked)}
                className="accent-blue-600"
              />
              <span>Show complementary angle ({90 - launchAngleDeg}°) arc when y₀ = 0</span>
            </label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setLaunchSpeed(25);
                  setLaunchAngleDeg(45);
                  setLaunchHeight(0);
                  setGravity(9.8);
                }}
                className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                Max Range (45°)
              </button>
              <button
                type="button"
                onClick={() => {
                  setLaunchSpeed(20);
                  setLaunchAngleDeg(30);
                  setLaunchHeight(0);
                  setGravity(9.8);
                  setShowComplementary(true);
                }}
                className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                30° vs 60° Pair
              </button>
            </div>
          </div>
        ),
        rightCalculations: (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-blue-700 font-medium">Range R</div>
                <div className="font-mono font-bold text-base text-blue-950 tabular-nums mt-0.5">
                  {formatNum(projSummary.horizontalRange, 2)} m
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="text-emerald-700 font-medium">Max Height H</div>
                <div className="font-mono font-bold text-base text-emerald-950 tabular-nums mt-0.5">
                  {formatNum(projSummary.maxHeight, 2)} m
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-600 font-medium">Flight Time</div>
                <div className="font-mono font-bold text-base text-slate-900 tabular-nums mt-0.5">
                  {formatNum(projSummary.timeOfFlight, 2)} s
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                <div className="text-amber-800 font-medium">Speed at t</div>
                <div className="font-mono font-bold text-base text-amber-950 tabular-nums mt-0.5">
                  {formatNum(cur.speed, 2)} m/s
                </div>
              </div>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-white space-y-1 overflow-x-auto">
              <MathBlock latex={`x(${formatNum(clampedT, 2)}) = ${formatNum(cur.x, 2)}\\text{ m}`} />
              <MathBlock latex={`y(${formatNum(clampedT, 2)}) = ${formatNum(Math.max(0, cur.y), 2)}\\text{ m}`} />
              <MathBlock latex={`v_x = ${formatNum(cur.vx, 2)}\\text{ m/s}`} />
              <MathBlock latex={`v_y = ${formatNum(cur.vy, 2)}\\text{ m/s}`} />
            </div>
          </div>
        ),
      };
    }

    if (simConfig.id === 'kinematics2d-circular') {
      const st = circularStateAtTime(radius, circSpeed0, tangentialAccel, tNow);
      return {
        mode: 'circular' as const,
        leftControls: (
          <div className="space-y-3">
            <ParamControl
              id="k2d-circ-r"
              label="Orbit Radius R"
              value={radius}
              min={2}
              max={15}
              step={0.5}
              unit="m"
              accentColor="#2563EB"
              onChange={setRadius}
            />
            <ParamControl
              id="k2d-circ-v0"
              label="Initial Speed v₀"
              value={circSpeed0}
              min={1}
              max={20}
              step={0.5}
              unit="m/s"
              accentColor="#059669"
              onChange={setCircSpeed0}
            />
            <ParamControl
              id="k2d-circ-at"
              label="Tangential Accel a_t"
              value={tangentialAccel}
              min={-4}
              max={6}
              step={0.5}
              unit="m/s²"
              accentColor="#D97706"
              onChange={setTangentialAccel}
            />
            <ParamControl
              id="k2d-circ-t"
              label="Clock Time t"
              value={Math.min(tNow, 12)}
              min={0}
              max={12}
              step={0.1}
              unit="s"
              accentColor="#4F46E5"
              onChange={(val) => {
                setIsPlaying(false);
                setTNow(val);
              }}
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setTangentialAccel(0);
                  setCircSpeed0(6);
                  setRadius(5);
                }}
                className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                Uniform (a_t = 0)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTangentialAccel(2.5);
                  setCircSpeed0(3);
                  setRadius(6);
                  setTNow(1.5);
                }}
                className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                Speeding Up
              </button>
            </div>
          </div>
        ),
        rightCalculations: (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="text-emerald-700 font-medium">Speed v(t)</div>
                <div className="font-mono font-bold text-base text-emerald-950 tabular-nums mt-0.5">
                  {formatNum(st.speed, 2)} m/s
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
                <div className="text-red-700 font-medium">Centripetal a_c</div>
                <div className="font-mono font-bold text-base text-red-950 tabular-nums mt-0.5">
                  {formatNum(st.ac, 2)} m/s²
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                <div className="text-amber-800 font-medium">Tangential a_t</div>
                <div className="font-mono font-bold text-base text-amber-950 tabular-nums mt-0.5">
                  {formatNum(st.at, 2)} m/s²
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200">
                <div className="text-indigo-700 font-medium">Total |a|</div>
                <div className="font-mono font-bold text-base text-indigo-950 tabular-nums mt-0.5">
                  {formatNum(st.aTotal, 2)} m/s²
                </div>
              </div>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-white space-y-1 overflow-x-auto">
              <MathBlock
                latex={`a_c = \\frac{${formatNum(st.speed, 2)}^2}{${formatNum(radius, 1)}} = ${formatNum(st.ac, 2)}\\text{ m/s}^2`}
              />
              <MathBlock
                latex={`|\\vec{a}| = \\sqrt{a_c^2 + a_t^2} = ${formatNum(st.aTotal, 2)}\\text{ m/s}^2`}
              />
              {st.period !== null && (
                <MathBlock
                  latex={`T = \\frac{2\\pi R}{v} = ${formatNum(st.period, 2)}\\text{ s}`}
                />
              )}
            </div>
          </div>
        ),
      };
    }

    // kinematics2d-relative
    return {
      mode: 'relative' as const,
      leftControls: (
        <div className="space-y-3">
          <ParamControl
            id="k2d-rel-w"
            label="River Width W"
            value={riverWidth}
            min={40}
            max={200}
            step={10}
            unit="m"
            accentColor="#475569"
            onChange={setRiverWidth}
          />
          <ParamControl
            id="k2d-rel-vb"
            label="Boat Speed v_BW"
            value={boatSpeed}
            min={2}
            max={12}
            step={0.5}
            unit="m/s"
            accentColor="#2563EB"
            onChange={setBoatSpeed}
          />
          <ParamControl
            id="k2d-rel-vw"
            label="Current Speed v_WG"
            value={currentSpeed}
            min={0}
            max={8}
            step={0.5}
            unit="m/s"
            accentColor="#059669"
            onChange={setCurrentSpeed}
          />
          <ParamControl
            id="k2d-rel-ang"
            label="Upstream Steering α"
            value={upstreamAngleDeg}
            min={-45}
            max={70}
            step={1}
            unit="°"
            accentColor="#DC2626"
            onChange={setUpstreamAngleDeg}
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {riverSummary.upstreamZeroDriftAngleDeg !== null && (
              <button
                type="button"
                onClick={() =>
                  setUpstreamAngleDeg(Number(riverSummary.upstreamZeroDriftAngleDeg!.toFixed(1)))
                }
                className="px-2.5 py-1 rounded border border-blue-200 bg-blue-50 hover:bg-blue-100 text-xs font-medium text-blue-800"
              >
                Zero-Drift Angle ({formatNum(riverSummary.upstreamZeroDriftAngleDeg, 1)}°)
              </button>
            )}
            <button
              type="button"
              onClick={() => setUpstreamAngleDeg(0)}
              className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700"
            >
              Fastest Crossing (0°)
            </button>
          </div>
        </div>
      ),
      rightCalculations: (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
              <div className="text-red-700 font-medium">Ground Speed |v_BG|</div>
              <div className="font-mono font-bold text-base text-red-950 tabular-nums mt-0.5">
                {formatNum(riverSummary.groundSpeed, 2)} m/s
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-blue-700 font-medium">Crossing Time</div>
              <div className="font-mono font-bold text-base text-blue-950 tabular-nums mt-0.5">
                {Number.isFinite(riverSummary.crossingTime)
                  ? `${formatNum(riverSummary.crossingTime, 2)} s`
                  : '∞'}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-slate-600 font-medium">Downstream Drift</div>
              <div className="font-mono font-bold text-base text-slate-900 tabular-nums mt-0.5">
                {Number.isFinite(riverSummary.downstreamDrift)
                  ? `${formatNum(riverSummary.downstreamDrift, 1)} m`
                  : '∞'}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="text-emerald-700 font-medium">Zero-Drift α*</div>
              <div className="font-mono font-bold text-base text-emerald-950 tabular-nums mt-0.5">
                {riverSummary.upstreamZeroDriftAngleDeg !== null
                  ? `${formatNum(riverSummary.upstreamZeroDriftAngleDeg, 1)}°`
                  : 'Impossible'}
              </div>
            </div>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white space-y-1 overflow-x-auto">
            <MathBlock
              latex={`\\vec{v}_{BW} = (${formatNum(riverSummary.vBW.x, 2)}\\hat{i} + ${formatNum(riverSummary.vBW.y, 2)}\\hat{j})\\text{ m/s}`}
            />
            <MathBlock
              latex={`\\vec{v}_{BG} = (${formatNum(riverSummary.vBG.x, 2)}\\hat{i} + ${formatNum(riverSummary.vBG.y, 2)}\\hat{j})\\text{ m/s}`}
            />
          </div>
        </div>
      ),
    };
  };

  const view = renderByMode();

  return (
    <SimulationWorkspace
      config={simConfig}
      allSimulations={sims2D}
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
      supportsResultantToggle
      supportsComponentsToggle
      leftControls={view.leftControls}
      centerCanvas={
        <Kinematics2DCanvas
          mode={view.mode}
          tNow={tNow}
          vx0={vx0}
          vy0={vy0}
          ax={ax}
          ay={ay}
          t1={Math.min(t1, t2)}
          t2={Math.max(t1, t2)}
          tMax={tMaxVectors}
          launchSpeed={launchSpeed}
          launchAngleDeg={launchAngleDeg}
          launchHeight={launchHeight}
          gravity={gravity}
          showComplementary={showComplementary}
          radius={radius}
          circSpeed0={circSpeed0}
          tangentialAccel={tangentialAccel}
          riverWidth={riverWidth}
          boatSpeed={boatSpeed}
          upstreamAngleDeg={upstreamAngleDeg}
          currentSpeed={currentSpeed}
          showGrid={displayOptions.showGrid}
          showAxisLabels={displayOptions.showAxisLabels}
          showLabels={displayOptions.showVectorLabels}
          showComponents={displayOptions.showComponents}
          showResultant={displayOptions.showResultant}
          zoom={displayOptions.zoom}
          ariaLabel={simConfig.title}
        />
      }
      rightCalculations={view.rightCalculations}
      onNavigateTopic={onNavigateTopicTitle}
    />
  );
}
