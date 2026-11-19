import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { CHAPTERS, LEARNING_RESOURCES, getSubjectById } from '../../content/registry';
import type { AppRoute, SimulationId } from '../../types/physics';

interface SubjectPageProps {
  subjectId: string;
  onNavigate: (
    route: AppRoute,
    params?: { subjectId?: string; chapterId?: string; topicId?: string; simId?: SimulationId },
  ) => void;
}

export function SubjectPage({ subjectId, onNavigate }: SubjectPageProps) {
  const subject = getSubjectById(subjectId) ?? getSubjectById('classical-mechanics')!;
  const chapters = CHAPTERS.filter((c) => c.subjectId === subject.id);
  const resources = LEARNING_RESOURCES.filter((r) => r.subjectId === subject.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => onNavigate('explore')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Back to Explore Physics</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{subject.title}</h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">{subject.description}</p>
      </div>

      {/* Chapters List */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Chapters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chapters.map((chapter) => {
            const active = chapter.status === 'available';
            return (
              <div
                key={chapter.id}
                className={`bg-white border rounded-xl p-5 flex flex-col justify-between gap-4 ${
                  active ? 'border-slate-200' : 'border-slate-200/70 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Chapter {chapter.number}</span>
                    <span>
                      {active
                        ? `${chapter.topicIds.length} topics · ${chapter.simulationIds.length} simulations`
                        : 'Coming soon'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{chapter.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {chapter.summary}
                  </p>
                </div>

                {active ? (
                  <button
                    type="button"
                    onClick={() => onNavigate('chapter', { chapterId: chapter.id })}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                  >
                    <span>Explore Chapter</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                ) : (
                  <div className="text-xs font-medium text-slate-400">
                    Chapter slot registered in Classical Mechanics
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Books & Learning Resources inside this subject */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Books & Learning Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources.map((res) => (
            <div key={res.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="text-xs font-medium text-blue-700 inline-flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{res.type}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{res.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
