import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  FlaskConical,
  GraduationCap,
  Layers,
  MessageSquare,
  Search,
} from 'lucide-react';
import { CHAPTERS, SIMULATIONS, SUBJECTS, TOPICS } from '../../content/registry';
import { searchPhysicsContent } from '../../services/search/globalSearch';
import type { AppRoute, SearchResultItem, SimulationId } from '../../types/physics';

interface HomePageProps {
  recentSimIds: SimulationId[];
  completedTopicIds: string[];
  onNavigate: (
    route: AppRoute,
    params?: { subjectId?: string; chapterId?: string; topicId?: string; simId?: SimulationId; questionId?: string },
  ) => void;
}

export function HomePage({ recentSimIds, completedTopicIds, onNavigate }: HomePageProps) {
  const [heroQuery, setHeroQuery] = useState('');
  const heroResults = heroQuery.trim().length > 0 ? searchPhysicsContent(heroQuery, 8) : [];

  const vectorsChapter = CHAPTERS.find((c) => c.id === 'vectors');
  const featuredSims = SIMULATIONS.filter((s) =>
    ['representation', 'addition', 'resolution', 'cross-product'].includes(s.id),
  );
  const recentSims = recentSimIds
    .map((id) => SIMULATIONS.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const progressPct = vectorsChapter
    ? Math.round((completedTopicIds.length / Math.max(1, TOPICS.length)) * 100)
    : 0;

  const handleSelectSearch = (item: SearchResultItem) => {
    setHeroQuery('');
    onNavigate(item.route, item.params);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
          <div className="text-sm font-semibold text-blue-600">
            Understand Physics. See It. Explore It.
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-slate-900 leading-[1.14] text-balance">
            Learn physics by manipulating live geometry and equations.
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
            PhysicsKit pairs clear conceptual lessons with real-time 2D and 3D simulations, step-by-step derivations, interactive quizzes, and an AI physics tutor—beginning with Classical Mechanics and Vectors.
          </p>

          {/* Hero Search Bar */}
          <div className="relative max-w-xl pt-1">
            <label htmlFor="home-explore-search" className="sr-only">
              What would you like to explore?
            </label>
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="home-explore-search"
              type="search"
              value={heroQuery}
              onChange={(e) => setHeroQuery(e.target.value)}
              placeholder="What would you like to explore?"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none shadow-sm"
            />

            {heroQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-14 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-80 overflow-y-auto divide-y divide-slate-100">
                {heroResults.length === 0 ? (
                  <div className="p-4 text-sm text-slate-500">
                    No matches for “{heroQuery}”. Try “vectors”, “dot product”, or “cross product”.
                  </div>
                ) : (
                  heroResults.map((res) => (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => handleSelectSearch(res)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate">{res.title}</div>
                        <div className="text-xs text-slate-500 truncate">{res.subtitle}</div>
                      </div>
                      <span className="text-xs font-medium text-blue-600 shrink-0">{res.category}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('chapter', { chapterId: 'vectors' })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <span>Explore Chapter: Vectors</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('simulations', { simId: 'representation' })}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium transition-colors whitespace-nowrap"
            >
              <span>Open Vector Lab</span>
            </button>
          </div>
        </div>

        {/* Featured First Chapter Card (Classical Mechanics -> Vectors) */}
        {vectorsChapter && (
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Classical Mechanics · Chapter {vectorsChapter.number}</span>
                <span className="font-mono tabular-nums">{progressPct}% complete</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{vectorsChapter.title}</h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{vectorsChapter.summary}</p>
              </div>

              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <div className="text-slate-500">Topics</div>
                  <div className="font-mono font-bold text-base text-slate-900 tabular-nums mt-0.5">
                    {vectorsChapter.topicIds.length}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Simulations</div>
                  <div className="font-mono font-bold text-base text-slate-900 tabular-nums mt-0.5">
                    {vectorsChapter.simulationIds.length}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Est. Time</div>
                  <div className="font-mono font-bold text-base text-slate-900 tabular-nums mt-0.5">
                    {vectorsChapter.estimatedMinutes}m
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onNavigate('chapter', { chapterId: 'vectors' })}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
              >
                <span>Explore Chapter</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* FEATURED PHYSICS SIMULATIONS */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Featured Physics Simulations</h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Real-time mathematical visualizations driven by live parameter controls.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('simulations')}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap"
          >
            View all 8 simulations
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredSims.map((sim) => (
            <button
              key={sim.id}
              type="button"
              onClick={() => onNavigate('simulations', { simId: sim.id })}
              className="text-left bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-4 transition-colors flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Vector Lab</span>
                  <span className="font-mono text-blue-700 font-medium">{sim.dimension}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">{sim.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-3">
                  {sim.summary}
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-600 inline-flex items-center gap-1">
                Launch simulation <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* RECENTLY EXPLORED SIMULATIONS (if any) */}
      {recentSims.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Recently Explored Simulations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recentSims.slice(0, 3).map((sim) => (
              <button
                key={sim.id}
                type="button"
                onClick={() => onNavigate('simulations', { simId: sim.id })}
                className="text-left bg-white border border-slate-200 hover:border-blue-300 rounded-xl px-4 py-3 flex items-center justify-between gap-3 transition-colors"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900">{sim.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{sim.dimension} Interactive Lab</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* AVAILABLE SUBJECTS & POPULAR CHAPTERS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-bold text-slate-900">Physics Subjects</h2>
            <button
              type="button"
              onClick={() => onNavigate('explore')}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Explore curriculum
            </button>
          </div>
          <div className="space-y-3">
            {SUBJECTS.map((sub) => {
              const available = sub.status === 'available';
              return (
                <div
                  key={sub.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{available ? 'Available Now' : 'Coming Soon'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{available ? `${sub.chapterIds.length} planned chapters` : 'Planned module'}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{sub.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{sub.description}</p>
                  </div>
                  {available ? (
                    <button
                      type="button"
                      onClick={() => onNavigate('subject', { subjectId: sub.id })}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                    >
                      Open Subject
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap shrink-0">
                      In development
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Popular Chapters</h2>
          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
            {CHAPTERS.slice(0, 5).map((ch) => (
              <div key={ch.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs text-slate-500">
                    Classical Mechanics · Chapter {ch.number}
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{ch.title}</div>
                  <div className="text-xs text-slate-600 mt-0.5 line-clamp-1">{ch.summary}</div>
                </div>
                {ch.status === 'available' ? (
                  <button
                    type="button"
                    onClick={() => onNavigate('chapter', { chapterId: ch.id })}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium whitespace-nowrap shrink-0"
                  >
                    Explore
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">Soon</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW PHYSICSKIT WORKS */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold text-slate-900">How PhysicsKit Works</h2>
          <p className="text-sm text-slate-600 mt-1">
            Every chapter connects physical intuition, real-time mathematics, and guided problem solving.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <BookOpen className="w-5 h-5 text-blue-600" aria-hidden="true" />
            <h3 className="text-sm font-bold text-slate-900">01. Concept & Intuition</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Structured topics explain the physical meaning behind every law before introducing symbols.
            </p>
          </div>
          <div className="space-y-2">
            <FlaskConical className="w-5 h-5 text-blue-600" aria-hidden="true" />
            <h3 className="text-sm font-bold text-slate-900">02. Live Parameter Lab</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Drag vectors in 2D and 3D space while equations and numerical projections update instantly.
            </p>
          </div>
          <div className="space-y-2">
            <GraduationCap className="w-5 h-5 text-blue-600" aria-hidden="true" />
            <h3 className="text-sm font-bold text-slate-900">03. Practice & Mastery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Test understanding across conceptual, numerical, and diagram questions with worked explanations.
            </p>
          </div>
          <div className="space-y-2">
            <MessageSquare className="w-5 h-5 text-blue-600" aria-hidden="true" />
            <h3 className="text-sm font-bold text-slate-900">04. AI Physics Tutor</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ask topic-aware questions for Socratic hints, equation walkthroughs, or extra practice problems.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-slate-400" aria-hidden="true" />
            Modular architecture ready for Kinematics, Dynamics, E&M, Waves, Thermodynamics & Modern Physics.
          </span>
          <button
            type="button"
            onClick={() => onNavigate('explore')}
            className="inline-flex items-center gap-1 text-blue-600 font-medium hover:underline"
          >
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            Browse curriculum tree
          </button>
        </div>
      </section>
    </div>
  );
}
