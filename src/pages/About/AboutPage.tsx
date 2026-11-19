import { ArrowRight, Cpu, Layers, Ruler } from 'lucide-react';
import type { AppRoute } from '../../types/physics';

interface AboutPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="space-y-3">
        <div className="text-xs font-semibold text-blue-600">About PhysicsKit</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Understand Physics. See It. Explore It.
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          PhysicsKit is an interactive learning and simulation platform built for students, educators, and self-learners who want to connect physical intuition directly with real-time mathematics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <Ruler className="w-5 h-5 text-blue-600" aria-hidden="true" />
          <h2 className="text-base font-bold text-slate-900">Real Mathematical Engines</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every 2D Canvas and 3D Three.js simulation runs directly on decoupled vector algebra utilities—never pre-rendered loops or static placeholders.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <Layers className="w-5 h-5 text-blue-600" aria-hidden="true" />
          <h2 className="text-base font-bold text-slate-900">Extensible Content Tree</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Subjects, books, chapters, topics, simulations, and exercises live in a typed registry so future modules plug in cleanly.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <Cpu className="w-5 h-5 text-blue-600" aria-hidden="true" />
          <h2 className="text-base font-bold text-slate-900">Guided Problem Solving</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Pairs a 7-stage conceptual learning flow and graded exercises with a context-aware AI Physics Tutor for step-by-step hints.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Ready to explore Vectors?</h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Jump into the interactive Vector Lab or start the 13-topic Classical Mechanics chapter.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('simulations')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
          >
            <span>Open Vector Lab</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
