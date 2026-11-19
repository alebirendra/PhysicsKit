import { BookOpen, MessageSquare } from 'lucide-react';
import { TOPICS, getSimulationById } from '../../content/registry';
import type { AppRoute, SimulationId } from '../../types/physics';
import { VectorLab } from '../../simulations/vector/VectorLab';

interface SimulationsPageProps {
  activeSimId: SimulationId;
  onChangeSimId: (id: SimulationId) => void;
  onNavigate: (
    route: AppRoute,
    params?: { subjectId?: string; chapterId?: string; topicId?: string; simId?: SimulationId; tutorTopic?: string },
  ) => void;
}

export function SimulationsPage({ activeSimId, onChangeSimId, onNavigate }: SimulationsPageProps) {
  const simConfig = getSimulationById(activeSimId);

  const handleNavigateTopicTitle = (topicTitle: string) => {
    const matched = TOPICS.find((t) => t.title.toLowerCase() === topicTitle.toLowerCase());
    if (matched) {
      onNavigate('chapter', { chapterId: matched.chapterId, topicId: matched.id });
    } else {
      onNavigate('chapter', { chapterId: 'vectors' });
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-blue-600">
            Classical Mechanics · Vectors Simulation Lab
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Interactive Vector Lab</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('chapter', { chapterId: 'vectors' })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <span>Vectors Chapter</span>
          </button>
          <button
            type="button"
            onClick={() =>
              onNavigate('tutor', {
                subjectId: 'classical-mechanics',
                chapterId: 'vectors',
                tutorTopic: simConfig?.title ?? 'Vectors',
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
            <span>Ask AI Tutor</span>
          </button>
        </div>
      </div>

      <VectorLab
        activeSimId={activeSimId}
        onChangeSimId={onChangeSimId}
        onNavigateTopicTitle={handleNavigateTopicTitle}
      />
    </div>
  );
}
