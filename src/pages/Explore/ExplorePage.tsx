import { ArrowRight } from 'lucide-react';
import { CHAPTERS, LEARNING_RESOURCES, SUBJECTS } from '../../content/registry';
import type { AppRoute, SimulationId } from '../../types/physics';

interface ExplorePageProps {
  onNavigate: (
    route: AppRoute,
    params?: { subjectId?: string; chapterId?: string; topicId?: string; simId?: SimulationId },
  ) => void;
}

export function ExplorePage({ onNavigate }: ExplorePageProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="space-y-2">
        <div className="text-xs font-semibold text-blue-600">Curriculum Explorer</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Explore Physics</h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Navigate PhysicsKit’s hierarchical curriculum from high-level physics branches down to interactive chapters, learning resources, and simulations.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUBJECTS.map((subject) => {
            const subjectChapters = CHAPTERS.filter((c) => c.subjectId === subject.id);
            const subjectResources = LEARNING_RESOURCES.filter((r) => r.subjectId === subject.id);
            const isAvailable = subject.status === 'available';

            return (
              <div
                key={subject.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{isAvailable ? 'Active Subject' : 'Upcoming Subject'}</span>
                    <span>
                      {subjectChapters.length} chapters · {subjectResources.length} resources
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{subject.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{subject.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {isAvailable ? (
                    <button
                      type="button"
                      onClick={() => onNavigate('subject', { subjectId: subject.id })}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                    >
                      <span>Explore {subject.title}</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">
                      Configured in content registry — chapters coming soon
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
