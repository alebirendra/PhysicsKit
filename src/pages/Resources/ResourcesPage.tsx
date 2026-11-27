import { ArrowRight, BookOpen } from 'lucide-react';
import { CHAPTERS, LEARNING_RESOURCES, SUBJECTS } from '../../content/registry';
import type { AppRoute, SimulationId } from '../../types/physics';

interface ResourcesPageProps {
  onNavigate: (
    route: AppRoute,
    params?: { subjectId?: string; chapterId?: string; topicId?: string; simId?: SimulationId },
  ) => void;
}

export function ResourcesPage({ onNavigate }: ResourcesPageProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <div className="text-xs font-semibold text-blue-600">Textbooks, Suites & Companion Banks</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Learning Resources</h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          PhysicsKit organizes content into modular books, simulation suites, and exercise companions so new textbooks and chapters can be plugged into any subject.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {LEARNING_RESOURCES.map((res) => {
          const subject = SUBJECTS.find((s) => s.id === res.subjectId);
          const linkedChapters = CHAPTERS.filter((c) => res.chapterIds.includes(c.id));

          return (
            <article
              key={res.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{subject?.title}</span>
                  <span className="font-medium text-blue-700">{res.type}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{res.title}</h2>
                    <div className="text-xs text-slate-500 mt-0.5">{res.authorOrSource}</div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{res.description}</p>

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-700 mb-1.5">Included Chapters</div>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {linkedChapters.map((ch) => (
                      <li key={ch.id} className="flex items-center justify-between">
                        <span>
                          Ch. {ch.number} · {ch.title}
                        </span>
                        <span className="text-slate-400">
                          {ch.status === 'available' ? 'Ready' : 'Soon'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (res.id === 'kinematics2d-lab-suite') {
                    onNavigate('simulations', { simId: 'kinematics2d-projectile' });
                  } else if (res.id === 'kinematics-lab-suite') {
                    onNavigate('simulations', { simId: 'kinematics-motion' });
                  } else if (res.type === 'Simulation Suite') {
                    onNavigate('simulations', { simId: 'representation' });
                  } else if (res.type === 'Problem Bank') {
                    onNavigate('practice');
                  } else {
                    onNavigate('subject', { subjectId: res.subjectId });
                  }
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
              >
                <span>Open Resource</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
