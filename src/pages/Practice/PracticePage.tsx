import { useEffect, useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { PRACTICE_QUESTIONS, getChapterById, getQuestionsForChapter } from '../../content/registry';
import type { QuestionDifficulty } from '../../types/physics';
import { MathText } from '../../components/equations/MathText';
import { PracticeDiagramSvg } from '../../components/equations/VectorDiagramSvg';

interface QuestionSubmission {
  isCorrect: boolean;
  chosenOption?: number;
  numericValue?: string;
}

interface PracticePageProps {
  initialQuestionId?: string;
  initialChapterId?: string;
}

export function PracticePage({ initialQuestionId, initialChapterId }: PracticePageProps) {
  const [chapterFilter, setChapterFilter] = useState<string>(initialChapterId ?? 'all');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | QuestionDifficulty>('All');
  const [submissions, setSubmissions] = useState<Record<string, QuestionSubmission>>({});
  const [numericInputs, setNumericInputs] = useState<Record<string, string>>({});
  const [numericErrors, setNumericErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialChapterId) {
      setChapterFilter(initialChapterId);
    }
  }, [initialChapterId]);

  const chapterQuestions =
    chapterFilter === 'all' ? PRACTICE_QUESTIONS : getQuestionsForChapter(chapterFilter);

  const visibleQuestions =
    difficultyFilter === 'All'
      ? chapterQuestions
      : chapterQuestions.filter((q) => q.difficulty === difficultyFilter);

  const activeChapter = chapterFilter !== 'all' ? getChapterById(chapterFilter) : undefined;
  const chapterQuestionIds = new Set(chapterQuestions.map((q) => q.id));
  const attemptedCount = Object.keys(submissions).filter((id) => chapterQuestionIds.has(id)).length;
  const correctCount = Object.entries(submissions).filter(
    ([id, s]) => chapterQuestionIds.has(id) && s.isCorrect,
  ).length;

  const handleSelectOption = (questionId: string, optionIdx: number, correctIdx: number) => {
    setSubmissions((prev) => ({
      ...prev,
      [questionId]: {
        isCorrect: optionIdx === correctIdx,
        chosenOption: optionIdx,
      },
    }));
  };

  const handleSubmitNumeric = (
    questionId: string,
    expected: number,
    tolerance: number,
  ) => {
    const raw = (numericInputs[questionId] ?? '').trim();
    if (!raw) {
      setNumericErrors((prev) => ({ ...prev, [questionId]: 'Enter a numerical value before checking.' }));
      return;
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      setNumericErrors((prev) => ({ ...prev, [questionId]: 'Please enter a valid finite number.' }));
      return;
    }
    setNumericErrors((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
    const isCorrect = Math.abs(parsed - expected) <= tolerance;
    setSubmissions((prev) => ({
      ...prev,
      [questionId]: {
        isCorrect,
        numericValue: raw,
      },
    }));
  };

  const handleRetryQuestion = (questionId: string) => {
    setSubmissions((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    setNumericErrors((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const handleResetAll = () => {
    setSubmissions({});
    setNumericInputs({});
    setNumericErrors({});
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Score Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-blue-600">
            {activeChapter
              ? `Classical Mechanics · Chapter ${activeChapter.number}`
              : 'Classical Mechanics · All Available Chapters'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {activeChapter ? `${activeChapter.title} Practice & Quizzes` : 'Physics Practice & Quizzes'}
          </h1>
          <p className="text-sm text-slate-600">
            Test conceptual understanding, mathematical reasoning, numerical accuracy, and diagram interpretation.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <div className="text-xs text-slate-500">Score</div>
            <div
              data-testid="practice-score"
              className="text-2xl font-mono font-bold text-slate-900 tabular-nums"
            >
              {correctCount} / {chapterQuestions.length}
            </div>
            <div className="text-xs text-slate-500 tabular-nums">{attemptedCount} answered</div>
          </div>

          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Retry All</span>
          </button>
        </div>
      </div>

      {/* Chapter & Difficulty Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg" role="group" aria-label="Filter by chapter">
            {[
              { id: 'all', label: 'All Chapters' },
              { id: 'vectors', label: 'Ch. 1 · Vectors' },
              { id: 'kinematics', label: 'Ch. 2 · 1D Kinematics' },
            ].map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => setChapterFilter(ch.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  chapterFilter === ch.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg" role="group" aria-label="Filter by difficulty">
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficultyFilter(level)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  difficultyFilter === level
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono tabular-nums">
          Showing {visibleQuestions.length} questions
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-5">
        {visibleQuestions.map((q, idx) => {
          const sub = submissions[q.id];
          const isHighlighted = initialQuestionId === q.id;
          const typeLabel = q.type.replace('-', ' ').replace(/\b\w/g, (m) => m.toUpperCase());

          return (
            <article
              key={q.id}
              className={`bg-white border rounded-xl p-5 sm:p-6 space-y-4 ${
                isHighlighted ? 'border-blue-400 ring-1 ring-blue-100' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-slate-700">Q{idx + 1}</span>
                  <span aria-hidden="true">·</span>
                  <span>{q.difficulty}</span>
                  <span aria-hidden="true">·</span>
                  <span>{typeLabel}</span>
                </div>
                {sub && (
                  <button
                    type="button"
                    onClick={() => handleRetryQuestion(q.id)}
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Try again
                  </button>
                )}
              </div>

              <p className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
                <MathText text={q.prompt} />
              </p>

              {q.diagram && (
                <div>
                  <PracticeDiagramSvg diagram={q.diagram} />
                </div>
              )}

              {q.type === 'numerical' && q.numericAnswer !== undefined ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <label htmlFor={`num-${q.id}`} className="sr-only">
                      Numerical answer for question {idx + 1}
                    </label>
                    <input
                      id={`num-${q.id}`}
                      type="text"
                      inputMode="decimal"
                      value={numericInputs[q.id] ?? ''}
                      disabled={Boolean(sub)}
                      onChange={(e) =>
                        setNumericInputs((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      placeholder="Enter number..."
                      className="w-44 h-10 px-3 rounded-lg border border-slate-300 text-sm font-mono tabular-nums text-slate-900 focus:border-blue-600 focus:outline-none disabled:bg-slate-50"
                    />
                    {q.unit && <span className="text-sm font-mono text-slate-600">{q.unit}</span>}
                    {!sub && (
                      <button
                        type="button"
                        onClick={() =>
                          handleSubmitNumeric(q.id, q.numericAnswer!, q.numericTolerance ?? 0.05)
                        }
                        className="px-4 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors"
                      >
                        Check Answer
                      </button>
                    )}
                  </div>
                  {numericErrors[q.id] && (
                    <p className="text-xs text-red-600 font-medium">{numericErrors[q.id]}</p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(q.options ?? []).map((opt, optIdx) => {
                    const isChosen = sub?.chosenOption === optIdx;
                    const isCorrectOpt = optIdx === q.correctOptionIndex;
                    let cls = 'border-slate-200 bg-white text-slate-700 hover:border-blue-400';
                    if (sub) {
                      if (isCorrectOpt) cls = 'border-emerald-500 bg-emerald-50 text-emerald-950';
                      else if (isChosen) cls = 'border-red-400 bg-red-50 text-red-950';
                      else cls = 'border-slate-200 bg-slate-50 text-slate-500';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={Boolean(sub)}
                        onClick={() => handleSelectOption(q.id, optIdx, q.correctOptionIndex ?? 0)}
                        className={`text-left px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-colors ${cls}`}
                      >
                        <MathText text={opt} />
                      </button>
                    );
                  })}
                </div>
              )}

              {sub && (
                <div
                  className={`p-4 rounded-xl border text-xs sm:text-sm space-y-1 ${
                    sub.isCorrect
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-red-50/70 border-red-200 text-red-950'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {sub.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-700" aria-hidden="true" />
                        <span>
                          Incorrect
                          {q.type === 'numerical' && q.numericAnswer !== undefined
                            ? ` · Expected ${q.numericAnswer}${q.unit ? ` ${q.unit}` : ''}`
                            : ''}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="leading-relaxed">
                    <MathText text={q.explanation} />
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
