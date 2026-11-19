import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Grid3X3,
  Pause,
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { SimulationConfig, SimulationId } from '../../types/physics';
import { MathBlock, MathText } from '../equations/MathText';

export interface DisplayOptionsState {
  showGrid: boolean;
  showAxisLabels: boolean;
  showVectorLabels: boolean;
  showComponents: boolean;
  showResultant: boolean;
  zoom: number;
}

interface SimulationWorkspaceProps {
  config: SimulationConfig;
  allSimulations: SimulationConfig[];
  onSelectSimulation: (id: SimulationId) => void;
  onReset: () => void;
  displayOptions: DisplayOptionsState;
  onChangeDisplayOptions: (next: DisplayOptionsState) => void;
  supportsAnimation?: boolean;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  animationSpeed?: number;
  onChangeAnimationSpeed?: (speed: number) => void;
  supportsZoom?: boolean;
  supportsResultantToggle?: boolean;
  supportsComponentsToggle?: boolean;
  leftControls: React.ReactNode;
  centerCanvas: React.ReactNode;
  rightCalculations: React.ReactNode;
  onNavigateTopic?: (topicTitle: string) => void;
}

export function SimulationWorkspace({
  config,
  allSimulations,
  onSelectSimulation,
  onReset,
  displayOptions,
  onChangeDisplayOptions,
  supportsAnimation = false,
  isPlaying = false,
  onTogglePlay,
  animationSpeed = 1,
  onChangeAnimationSpeed,
  supportsZoom = true,
  supportsResultantToggle = true,
  supportsComponentsToggle = true,
  leftControls,
  centerCanvas,
  rightCalculations,
  onNavigateTopic,
}: SimulationWorkspaceProps) {
  const [mobileTab, setMobileTab] = useState<'canvas' | 'controls' | 'math'>('canvas');
  const [quickAnswer, setQuickAnswer] = useState<number | null>(null);

  const currentIndex = allSimulations.findIndex((s) => s.id === config.id);
  const prevSim = currentIndex > 0 ? allSimulations[currentIndex - 1] : null;
  const nextSim = currentIndex >= 0 && currentIndex < allSimulations.length - 1 ? allSimulations[currentIndex + 1] : null;

  const handleSelectSim = (id: SimulationId) => {
    setQuickAnswer(null);
    onSelectSimulation(id);
  };

  return (
    <div className="space-y-4">
      {/* Simulation Selector Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-2 flex items-center gap-1.5 overflow-x-auto">
        {allSimulations.map((sim) => {
          const active = sim.id === config.id;
          return (
            <button
              key={sim.id}
              type="button"
              onClick={() => handleSelectSim(sim.id)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {sim.shortTitle}
            </button>
          );
        })}
      </div>

      {/* Responsive Mobile Tab Bar (< xl) */}
      <div className="xl:hidden flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
        <button
          type="button"
          onClick={() => setMobileTab('canvas')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            mobileTab === 'canvas' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          Visualization
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('controls')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            mobileTab === 'controls' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          Parameters
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('math')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            mobileTab === 'math' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          Results & Equations
        </button>
      </div>

      {/* Main 3-Panel Simulation Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* LEFT PANEL: Title, Explanation, Parameters, Display Options */}
        <section
          aria-label="Simulation controls"
          className={`xl:col-span-3 bg-white border border-slate-200 rounded-xl p-4 space-y-5 ${
            mobileTab === 'controls' ? 'block' : 'hidden xl:block'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-blue-700">{config.dimension} Simulation</span>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset</span>
              </button>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">{config.title}</h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{config.summary}</p>
          </div>

          {/* Playback & Speed if applicable */}
          {supportsAnimation && onTogglePlay && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={onTogglePlay}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                {onChangeAnimationSpeed && (
                  <div className="flex items-center gap-1">
                    {[0.5, 1, 2].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => onChangeAnimationSpeed(spd)}
                        className={`px-2 py-1 rounded text-xs font-mono tabular-nums ${
                          animationSpeed === spd
                            ? 'bg-slate-900 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Simulation-specific parameter sliders & numeric inputs */}
          <div className="space-y-4">{leftControls}</div>

          {/* Display Options */}
          <div className="pt-4 border-t border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                Display Options
              </span>
              {supportsZoom && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Zoom out"
                    onClick={() =>
                      onChangeDisplayOptions({
                        ...displayOptions,
                        zoom: Math.max(0.6, Number((displayOptions.zoom - 0.15).toFixed(2))),
                      })
                    }
                    className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-100"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono tabular-nums text-slate-600 w-10 text-center">
                    {Math.round(displayOptions.zoom * 100)}%
                  </span>
                  <button
                    type="button"
                    aria-label="Zoom in"
                    onClick={() =>
                      onChangeDisplayOptions({
                        ...displayOptions,
                        zoom: Math.min(1.9, Number((displayOptions.zoom + 0.15).toFixed(2))),
                      })
                    }
                    className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-100"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <label className="flex items-center gap-2 px-2 py-1.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={displayOptions.showGrid}
                  onChange={(e) =>
                    onChangeDisplayOptions({ ...displayOptions, showGrid: e.target.checked })
                  }
                  className="accent-blue-600"
                />
                <span className="text-slate-700 inline-flex items-center gap-1">
                  <Grid3X3 className="w-3 h-3 text-slate-400" aria-hidden="true" />
                  Grid
                </span>
              </label>

              <label className="flex items-center gap-2 px-2 py-1.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={displayOptions.showAxisLabels}
                  onChange={(e) =>
                    onChangeDisplayOptions({ ...displayOptions, showAxisLabels: e.target.checked })
                  }
                  className="accent-blue-600"
                />
                <span className="text-slate-700">Axes</span>
              </label>

              <label className="flex items-center gap-2 px-2 py-1.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={displayOptions.showVectorLabels}
                  onChange={(e) =>
                    onChangeDisplayOptions({ ...displayOptions, showVectorLabels: e.target.checked })
                  }
                  className="accent-blue-600"
                />
                <span className="text-slate-700">Labels</span>
              </label>

              {supportsComponentsToggle && (
                <label className="flex items-center gap-2 px-2 py-1.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={displayOptions.showComponents}
                    onChange={(e) =>
                      onChangeDisplayOptions({ ...displayOptions, showComponents: e.target.checked })
                    }
                    className="accent-blue-600"
                  />
                  <span className="text-slate-700">Components</span>
                </label>
              )}

              {supportsResultantToggle && (
                <label className="flex items-center gap-2 px-2 py-1.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-50 col-span-2">
                  <input
                    type="checkbox"
                    checked={displayOptions.showResultant}
                    onChange={(e) =>
                      onChangeDisplayOptions({ ...displayOptions, showResultant: e.target.checked })
                    }
                    className="accent-blue-600"
                  />
                  <span className="text-slate-700">Show Resultant / Product</span>
                </label>
              )}
            </div>
          </div>
        </section>

        {/* CENTER PANEL: Large Interactive Visualization */}
        <section
          aria-label="Interactive visualization stage"
          className={`xl:col-span-6 bg-white border border-slate-200 rounded-xl p-2 sm:p-3 ${
            mobileTab === 'canvas' ? 'block' : 'hidden xl:block'
          }`}
        >
          {centerCanvas}
        </section>

        {/* RIGHT PANEL: Numerical Results, Equations, Step-by-step Calculations */}
        <section
          aria-label="Live mathematical results"
          className={`xl:col-span-3 bg-white border border-slate-200 rounded-xl p-4 space-y-4 ${
            mobileTab === 'math' ? 'block' : 'hidden xl:block'
          }`}
        >
          <div>
            <h3 className="text-sm font-bold text-slate-900">Governing Equation</h3>
            <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm overflow-x-auto">
              <MathBlock latex={config.keyEquationLatex} />
            </div>
          </div>

          <div className="space-y-4">{rightCalculations}</div>
        </section>
      </div>

      {/* BOTTOM SECTION: Learning Objectives, Related Concepts, Practice Quick Check, Prev/Next */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Learning Objectives</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600 list-disc pl-4">
              {config.learningObjectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>

            <h4 className="text-xs font-semibold text-slate-500 mt-4">Related Topics</h4>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {config.relatedTopics.map((topicTitle) => (
                <button
                  key={topicTitle}
                  type="button"
                  onClick={() => onNavigateTopic?.(topicTitle)}
                  className="text-xs font-medium text-blue-700 hover:underline text-left"
                >
                  {topicTitle}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-900">Quick Concept Check</h3>
            <p className="text-sm text-slate-700 mt-1">
              <MathText text={config.quickCheck.prompt} />
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {config.quickCheck.options.map((opt, idx) => {
                const chosen = quickAnswer === idx;
                const isCorrect = idx === config.quickCheck.correctIndex;
                let style = 'border-slate-200 bg-white text-slate-700 hover:border-blue-300';
                if (quickAnswer !== null) {
                  if (isCorrect) style = 'border-emerald-500 bg-emerald-50 text-emerald-900';
                  else if (chosen) style = 'border-red-400 bg-red-50 text-red-900';
                }
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuickAnswer(idx)}
                    className={`text-left px-3 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${style}`}
                  >
                    <MathText text={opt} />
                  </button>
                );
              })}
            </div>
            {quickAnswer !== null && (
              <p className="mt-3 text-xs text-slate-700 leading-relaxed">
                <strong className={quickAnswer === config.quickCheck.correctIndex ? 'text-emerald-700' : 'text-red-700'}>
                  {quickAnswer === config.quickCheck.correctIndex ? 'Correct: ' : 'Check again: '}
                </strong>
                <MathText text={config.quickCheck.explanation} />
              </p>
            )}
          </div>
        </div>

        {/* Previous / Next Simulation Navigation */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
          {prevSim ? (
            <button
              type="button"
              onClick={() => handleSelectSim(prevSim.id)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous: {prevSim.shortTitle}</span>
            </button>
          ) : (
            <div />
          )}

          {nextSim ? (
            <button
              type="button"
              onClick={() => handleSelectSim(nextSim.id)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-sm font-medium text-white transition-colors"
            >
              <span>Next: {nextSim.shortTitle}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </section>
    </div>
  );
}
