import { BookOpen, MessageSquare } from 'lucide-react';
import { TOPICS, getChapterById, getSimulationById } from '../../content/registry';
import type { AppRoute, SimulationId } from '../../types/physics';
import { VectorLab } from '../../simulations/vector/VectorLab';
import { KinematicsLab } from '../../simulations/kinematics/KinematicsLab';

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
  const isKinematics = simConfig?.chapterId === 'kinematics';
  const activeChapterId = isKinematics ? 'kinematics' : 'vectors';
  const activeChapter = getChapterById(activeChapterId);

  const handleNavigateTopicTitle = (topicTitle: string) => {
    const matched = TOPICS.find((t) => t.title.toLowerCase() === topicTitle.toLowerCase());
    if (matched) {
      onNavigate('chapter', { chapterId: matched.chapterId, topicId: matched.id });
    } else {
      onNavigate('chapter', { chapterId: activeChapterId });
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-blue-600">
            Classical Mechanics · Chapter {activeChapter?.number ?? 1}: {activeChapter?.title ?? 'Vectors'}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isKinematics ? 'Interactive 1D Kinematics Lab' : 'Interactive Vector Lab'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center p-1 rounded-lg bg-slate-100" role="group" aria-label="Simulation chapter lab">
            <button
              type="button"
              onClick={() => onChangeSimId('representation')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                !isKinematics ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ch. 1 · Vector Lab
            </button>
            <button
              type="button"
              onClick={() => onChangeSimId('kinematics-motion')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                isKinematics ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ch. 2 · 1D Kinematics Lab
            </button>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('chapter', { chapterId: activeChapterId })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <span>{activeChapter?.title ?? 'Chapter'}</span>
          </button>
          <button
            type="button"
            onClick={() =>
              onNavigate('tutor', {
                subjectId: 'classical-mechanics',
                chapterId: activeChapterId,
                tutorTopic: simConfig?.title ?? activeChapter?.title ?? 'Classical Mechanics',
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
            <span>Ask AI Tutor</span>
          </button>
        </div>
      </div>

      {isKinematics ? (
        <KinematicsLab
          activeSimId={activeSimId}
          onChangeSimId={onChangeSimId}
          onNavigateTopicTitle={handleNavigateTopicTitle}
        />
      ) : (
        <VectorLab
          activeSimId={activeSimId}
          onChangeSimId={onChangeSimId}
          onNavigateTopicTitle={handleNavigateTopicTitle}
        />
      )}
    </div>
  );
}
