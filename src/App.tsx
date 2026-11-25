import { useEffect, useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/Home/HomePage';
import { ExplorePage } from './pages/Explore/ExplorePage';
import { SubjectPage } from './pages/Subjects/SubjectPage';
import { VectorsChapterPage } from './pages/Chapters/VectorsChapterPage';
import { SimulationsPage } from './pages/Simulations/SimulationsPage';
import { ResourcesPage } from './pages/Resources/ResourcesPage';
import { PracticePage } from './pages/Practice/PracticePage';
import { TutorPage } from './pages/Tutor/TutorPage';
import { AboutPage } from './pages/About/AboutPage';
import type { AppRoute, SimulationId } from './types/physics';

const COMPLETED_TOPICS_KEY = 'physicskit.completedTopics.v1';
const RECENT_SIMS_KEY = 'physicskit.recentSims.v1';

export default function App() {
  const [route, setRoute] = useState<AppRoute>('home');
  const [subjectId, setSubjectId] = useState<string>('classical-mechanics');
  const [chapterId, setChapterId] = useState<string>('vectors');
  const [topicId, setTopicId] = useState<string | undefined>(undefined);
  const [simId, setSimId] = useState<SimulationId>('representation');
  const [questionId, setQuestionId] = useState<string | undefined>(undefined);
  const [practiceChapterId, setPracticeChapterId] = useState<string | undefined>(undefined);
  const [tutorTopic, setTutorTopic] = useState<string | undefined>(undefined);

  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(COMPLETED_TOPICS_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [recentSimIds, setRecentSimIds] = useState<SimulationId[]>(() => {
    try {
      const raw = localStorage.getItem(RECENT_SIMS_KEY);
      return raw ? (JSON.parse(raw) as SimulationId[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(COMPLETED_TOPICS_KEY, JSON.stringify(completedTopicIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [completedTopicIds]);

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_SIMS_KEY, JSON.stringify(recentSimIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [recentSimIds]);

  // Support optional deep link parameters like ?route=simulations&sim=cross-product
  useEffect(() => {
    const validRoutes: AppRoute[] = [
      'home',
      'explore',
      'subject',
      'chapter',
      'simulations',
      'resources',
      'practice',
      'tutor',
      'about',
    ];
    const params = new URLSearchParams(window.location.search);
    const r = params.get('route') as AppRoute | null;
    const s = params.get('sim') as SimulationId | null;
    const c = params.get('chapter');
    const t = params.get('topic');
    if (s) setSimId(s);
    if (c) {
      setChapterId(c);
      setPracticeChapterId(c);
    }
    if (t) setTopicId(t);
    if (r && validRoutes.includes(r)) setRoute(r);
  }, []);

  const recordRecentSim = (id: SimulationId) => {
    setRecentSimIds((prev) => [id, ...prev.filter((item) => item !== id)].slice(0, 6));
  };

  const handleNavigate = (
    nextRoute: AppRoute,
    params?: {
      subjectId?: string;
      chapterId?: string;
      topicId?: string;
      simId?: SimulationId;
      questionId?: string;
      tutorTopic?: string;
    },
  ) => {
    if (params?.subjectId) setSubjectId(params.subjectId);
    if (params?.chapterId) setChapterId(params.chapterId);
    setPracticeChapterId(nextRoute === 'practice' ? params?.chapterId ?? 'all' : undefined);
    setTopicId(params?.topicId);
    setQuestionId(params?.questionId);
    if (params?.tutorTopic) setTutorTopic(params.tutorTopic);
    if (params?.simId) {
      setSimId(params.simId);
      recordRecentSim(params.simId);
    } else if (nextRoute === 'simulations') {
      recordRecentSim(simId);
    }
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSimulation = (id: SimulationId) => {
    setSimId(id);
    recordRecentSim(id);
  };

  const handleToggleTopicComplete = (id: string) => {
    setCompletedTopicIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <AppShell currentRoute={route} onNavigate={handleNavigate}>
      {route === 'home' && (
        <HomePage
          recentSimIds={recentSimIds}
          completedTopicIds={completedTopicIds}
          onNavigate={handleNavigate}
        />
      )}
      {route === 'explore' && <ExplorePage onNavigate={handleNavigate} />}
      {route === 'subject' && <SubjectPage subjectId={subjectId} onNavigate={handleNavigate} />}
      {route === 'chapter' && (
        <VectorsChapterPage
          chapterId={chapterId}
          initialTopicId={topicId}
          completedTopicIds={completedTopicIds}
          onToggleTopicComplete={handleToggleTopicComplete}
          onNavigate={handleNavigate}
        />
      )}
      {route === 'simulations' && (
        <SimulationsPage
          activeSimId={simId}
          onChangeSimId={handleSelectSimulation}
          onNavigate={handleNavigate}
        />
      )}
      {route === 'resources' && <ResourcesPage onNavigate={handleNavigate} />}
      {route === 'practice' && (
        <PracticePage initialQuestionId={questionId} initialChapterId={practiceChapterId} />
      )}
      {route === 'tutor' && <TutorPage initialTopic={tutorTopic} />}
      {route === 'about' && <AboutPage onNavigate={(r) => handleNavigate(r)} />}
    </AppShell>
  );
}
