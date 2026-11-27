import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  FlaskConical,
  GraduationCap,
  MessageSquare,
} from 'lucide-react';
import {
  SIMULATIONS,
  getChapterById,
  getTopicsForChapter,
} from '../../content/registry';
import type { AppRoute, SimulationId } from '../../types/physics';
import { MathBlock, MathText } from '../../components/equations/MathText';
import { TopicDiagramSvg } from '../../components/equations/VectorDiagramSvg';

interface VectorsChapterPageProps {
  chapterId: string;
  initialTopicId?: string;
  completedTopicIds: string[];
  onToggleTopicComplete: (topicId: string) => void;
  onNavigate: (
    route: AppRoute,
    params?: {
      subjectId?: string;
      chapterId?: string;
      topicId?: string;
      simId?: SimulationId;
      tutorTopic?: string;
    },
  ) => void;
}

export function VectorsChapterPage({
  chapterId,
  initialTopicId,
  completedTopicIds,
  onToggleTopicComplete,
  onNavigate,
}: VectorsChapterPageProps) {
  const chapter = getChapterById(chapterId) ?? getChapterById('vectors')!;
  const topics = getTopicsForChapter(chapter.id);
  const chapterSims = SIMULATIONS.filter((s) => chapter.simulationIds.includes(s.id));
  const labName =
    chapter.id === 'kinematics'
      ? '1D Kinematics Lab'
      : chapter.id === 'kinematics-2d'
        ? '2D Kinematics Lab'
        : 'Vector Lab';
  const defaultSimId: SimulationId = chapter.simulationIds[0] ?? 'representation';

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(initialTopicId ?? null);
  const [checkChoice, setCheckChoice] = useState<number | null>(null);

  useEffect(() => {
    if (initialTopicId) {
      setSelectedTopicId(initialTopicId);
      setCheckChoice(null);
    } else {
      setSelectedTopicId(null);
      setCheckChoice(null);
    }
  }, [chapterId, initialTopicId]);

  const activeTopic = selectedTopicId ? topics.find((t) => t.id === selectedTopicId) ?? topics[0] : null;
  const completedCount = topics.filter((t) => completedTopicIds.includes(t.id)).length;
  const progressPct = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;

  const openTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setCheckChoice(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activeTopic) {
    const idx = topics.findIndex((t) => t.id === activeTopic.id);
    const prevTopic = idx > 0 ? topics[idx - 1] : null;
    const nextTopic = idx < topics.length - 1 ? topics[idx + 1] : null;
    const linkedSim = SIMULATIONS.find((s) => s.id === activeTopic.simulationId);
    const isCompleted = completedTopicIds.includes(activeTopic.id);

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setSelectedTopicId(null)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to {chapter.title} Overview</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onNavigate('tutor', {
                  subjectId: chapter.subjectId,
                  chapterId: chapter.id,
                  tutorTopic: activeTopic.title,
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
              <span>Ask Tutor about this topic</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleTopicComplete(activeTopic.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isCompleted
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isCompleted ? 'Completed' : 'Mark Topic Complete'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Topic Sidebar Navigation */}
          <aside className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-3 space-y-1">
            <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 flex items-center justify-between">
              <span>Learning Mode · {topics.length} Topics</span>
              <span className="font-mono tabular-nums">{progressPct}%</span>
            </div>
            <div className="space-y-0.5 max-h-[65vh] overflow-y-auto">
              {topics.map((t) => {
                const active = t.id === activeTopic.id;
                const done = completedTopicIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => openTopic(t.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${
                      active
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" aria-hidden="true" />
                    )}
                    <span className="truncate">
                      {t.sectionNumber ? `${t.sectionNumber} · ` : `${t.order}. `}
                      {t.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* 7-Stage Learning Mode Content */}
          <article className="lg:col-span-9 space-y-6">
            <header className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
              <div className="text-xs font-semibold text-blue-600">
                Classical Mechanics · Chapter {chapter.number}: {chapter.title} ·{' '}
                {activeTopic.sectionNumber ? `Section ${activeTopic.sectionNumber} (${activeTopic.order}/${topics.length})` : `Topic ${activeTopic.order} of ${topics.length}`}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {activeTopic.sectionNumber ? `${activeTopic.sectionNumber} ${activeTopic.title}` : activeTopic.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600">
                <MathText text={activeTopic.shortDescription} />
              </p>
            </header>

            {/* 1. Concept Introduction & 2. Physical Interpretation */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">1. Concept Introduction</h2>
                <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                  <MathText text={activeTopic.conceptIntro} />
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <h2 className="text-base font-bold text-slate-900">2. Physical Interpretation</h2>
                <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                  <MathText text={activeTopic.physicalInterpretation} />
                </p>
              </div>
            </section>

            {/* 3. Mathematical Formulation & 4. Visual Explanation */}
            <section className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-900">3. Mathematical Formulation</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <MathText text={activeTopic.mathematicalFormulation.summary} />
                </p>
                <div className="space-y-3">
                  {activeTopic.mathematicalFormulation.equations.map((eq) => (
                    <div key={eq.label} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-xs font-semibold text-slate-500">{eq.label}</div>
                      <div className="my-1.5 overflow-x-auto">
                        <MathBlock latex={eq.latex} />
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <MathText text={eq.context} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-900">4. Visual Explanation</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <MathText text={activeTopic.visualExplanation.description} />
                </p>
                <TopicDiagramSvg spec={activeTopic.visualExplanation.diagram} />
              </div>
            </section>

            {/* 5. Worked Example */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div>
                <div className="text-xs font-semibold text-blue-600">5. Worked Example</div>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">{activeTopic.workedExample.title}</h2>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed">
                <MathText text={activeTopic.workedExample.problem} />
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800">Given:</span>
                {activeTopic.workedExample.given.map((g, i) => (
                  <span key={i}>
                    <MathBlock latex={g} displayMode={false} />
                    {i < activeTopic.workedExample.given.length - 1 ? ' , ' : ''}
                  </span>
                ))}
              </div>
              <div className="space-y-2.5">
                {activeTopic.workedExample.steps.map((st, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-200">
                    <div className="text-xs font-medium text-slate-600">
                      Step {i + 1}: <MathText text={st.explanation} />
                    </div>
                    <div className="mt-1 overflow-x-auto">
                      <MathBlock latex={st.math} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-950">
                <strong>Answer: </strong>
                <MathText text={activeTopic.workedExample.answer} />
              </div>
            </section>

            {/* 6. Interactive Simulation Link */}
            {linkedSim && (
              <section className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-blue-600">6. Interactive Simulation</div>
                  <h2 className="text-lg font-bold text-slate-900">{linkedSim.title}</h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-xl">{linkedSim.summary}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('simulations', { simId: linkedSim.id })}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
                >
                  <FlaskConical className="w-4 h-4" aria-hidden="true" />
                  <span>Open in {labName}</span>
                </button>
              </section>
            )}

            {/* 7. Check Your Understanding */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div>
                <div className="text-xs font-semibold text-blue-600">7. Check Your Understanding</div>
                <p className="text-sm sm:text-base font-semibold text-slate-900 mt-1">
                  <MathText text={activeTopic.checkYourUnderstanding.prompt} />
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeTopic.checkYourUnderstanding.options.map((opt, idx) => {
                  const chosen = checkChoice === idx;
                  const correct = idx === activeTopic.checkYourUnderstanding.correctIndex;
                  let cls = 'border-slate-200 bg-white text-slate-700 hover:border-blue-400';
                  if (checkChoice !== null) {
                    if (correct) cls = 'border-emerald-500 bg-emerald-50 text-emerald-950';
                    else if (chosen) cls = 'border-red-400 bg-red-50 text-red-950';
                  }
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCheckChoice(idx)}
                      className={`text-left px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-colors ${cls}`}
                    >
                      <MathText text={opt} />
                    </button>
                  );
                })}
              </div>
              {checkChoice !== null && (
                <div className="text-xs sm:text-sm text-slate-700 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <strong
                    className={
                      checkChoice === activeTopic.checkYourUnderstanding.correctIndex
                        ? 'text-emerald-700'
                        : 'text-red-700'
                    }
                  >
                    {checkChoice === activeTopic.checkYourUnderstanding.correctIndex
                      ? 'Correct! '
                      : 'Not quite: '}
                  </strong>
                  <MathText text={activeTopic.checkYourUnderstanding.explanation} />
                </div>
              )}
            </section>

            {/* Previous / Next Topic Footer */}
            <div className="flex items-center justify-between gap-4 pt-2">
              {prevTopic ? (
                <button
                  type="button"
                  onClick={() => openTopic(prevTopic.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>
                    {prevTopic.order}. {prevTopic.title}
                  </span>
                </button>
              ) : (
                <div />
              )}

              {nextTopic ? (
                <button
                  type="button"
                  onClick={() => openTopic(nextTopic.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-sm font-medium text-white"
                >
                  <span>
                    Next: {nextTopic.order}. {nextTopic.title}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate('practice', { chapterId: chapter.id })}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Go to {chapter.title} Practice Quiz</span>
                </button>
              )}
            </div>
          </article>
        </div>
      </div>
    );
  }

  // CHAPTER LANDING PAGE VIEW
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb & Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate('subject', { subjectId: chapter.subjectId })}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Classical Mechanics</span>
          </button>

          <div className="text-xs font-mono tabular-nums text-slate-600">
            Progress: {completedCount} / {topics.length} topics ({progressPct}%)
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-3">
            <div className="text-xs font-semibold text-blue-600">Chapter {chapter.number}</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{chapter.title}</h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{chapter.summary}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => openTopic(topics[0].id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
              >
                <span>Start Learning Mode</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('simulations', { simId: defaultSimId })}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium transition-colors"
              >
                <FlaskConical className="w-4 h-4 text-blue-600" aria-hidden="true" />
                <span>Open {labName}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('practice', { chapterId: chapter.id })}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium transition-colors"
              >
                <GraduationCap className="w-4 h-4 text-slate-600" aria-hidden="true" />
                <span>Practice Exercises</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Learning Objectives</h2>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
              {chapter.learningObjectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
            <div className="pt-2">
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Navigation Grid */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Topics in {chapter.title}</h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Select any topic to enter the 7-stage interactive Learning Mode.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {topics.map((topic) => {
            const done = completedTopicIds.includes(topic.id);
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => openTopic(topic.id)}
                className="text-left bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-4 transition-colors flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono">
                      {topic.sectionNumber ? `Section ${topic.sectionNumber}` : `Topic ${String(topic.order).padStart(2, '0')}`}
                    </span>
                    <span className={done ? 'text-emerald-600 font-medium' : 'text-slate-400'}>
                      {done ? 'Completed' : 'Open lesson'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{topic.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                    <MathText text={topic.shortDescription} />
                  </p>
                </div>
                <span className="text-xs font-semibold text-blue-600 inline-flex items-center gap-1">
                  Study topic <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Available Simulations */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Available {chapter.title} Simulations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {chapterSims.map((sim) => (
            <button
              key={sim.id}
              type="button"
              onClick={() => onNavigate('simulations', { simId: sim.id })}
              className="text-left bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-4 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Interactive Lab</span>
                <span className="font-mono text-blue-700 font-medium">{sim.dimension}</span>
              </div>
              <div className="text-sm font-bold text-slate-900">{sim.title}</div>
              <p className="text-xs text-slate-600 line-clamp-2">{sim.summary}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Important Equations */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Important Equations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapter.keyEquations.map((eq) => (
            <div key={eq.label} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="text-xs font-semibold text-blue-700">{eq.label}</div>
              <div className="overflow-x-auto py-1">
                <MathBlock latex={eq.latex} />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{eq.meaning}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
