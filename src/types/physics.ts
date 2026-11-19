export type AppRoute =
  | 'home'
  | 'explore'
  | 'subject'
  | 'chapter'
  | 'simulations'
  | 'resources'
  | 'practice'
  | 'tutor'
  | 'about';

export type SimulationId =
  | 'representation'
  | 'addition'
  | 'subtraction'
  | 'resolution'
  | 'unit-vectors'
  | 'dot-product'
  | 'cross-product'
  | 'displacement';

export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface PolarVector {
  magnitude: number;
  angleDeg: number;
}

export interface SubjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  status: 'available' | 'coming-soon';
  chapterIds: string[];
  resourceIds: string[];
  accentColor: string;
}

export interface LearningResource {
  id: string;
  subjectId: string;
  title: string;
  authorOrSource: string;
  type: 'Interactive Textbook' | 'Simulation Suite' | 'Problem Bank';
  description: string;
  chapterIds: string[];
  status: 'available' | 'coming-soon';
}

export interface ChapterModuleRef {
  id: string;
  kind: 'lesson' | 'simulation' | 'exercise-set' | 'demonstration';
  title: string;
  refId: string;
}

export interface ChapterItem {
  id: string;
  subjectId: string;
  resourceId: string;
  number: number;
  title: string;
  summary: string;
  estimatedMinutes: number;
  status: 'available' | 'coming-soon';
  learningObjectives: string[];
  keyEquations: { label: string; latex: string; meaning: string }[];
  topicIds: string[];
  simulationIds: SimulationId[];
  modules: ChapterModuleRef[];
}

export interface WorkedExample {
  title: string;
  problem: string;
  given: string[];
  steps: { explanation: string; math: string }[];
  answer: string;
}

export interface TopicDiagramSpec {
  kind:
    | 'vector-arrow'
    | 'scalar-vs-vector'
    | 'graphical-scale'
    | 'magnitude-direction'
    | 'head-to-tail'
    | 'parallelogram'
    | 'subtraction'
    | 'resolution'
    | 'components'
    | 'unit-vectors'
    | 'displacement'
    | 'dot-product'
    | 'cross-product'
    | 'inclined-plane';
  caption: string;
}

export interface QuickCheckQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TopicItem {
  id: string;
  chapterId: string;
  order: number;
  title: string;
  shortDescription: string;
  conceptIntro: string;
  physicalInterpretation: string;
  mathematicalFormulation: {
    summary: string;
    equations: { label: string; latex: string; context: string }[];
  };
  visualExplanation: {
    description: string;
    diagram: TopicDiagramSpec;
  };
  workedExample: WorkedExample;
  simulationId: SimulationId;
  checkYourUnderstanding: QuickCheckQuestion;
  keywords: string[];
}

export interface SimulationConfig {
  id: SimulationId;
  chapterId: string;
  title: string;
  shortTitle: string;
  summary: string;
  dimension: '2D' | '3D' | '2D/3D';
  learningObjectives: string[];
  relatedTopics: string[];
  keyEquationLatex: string;
  quickCheck: QuickCheckQuestion;
}

export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionType =
  | 'multiple-choice'
  | 'numerical'
  | 'conceptual'
  | 'diagram'
  | 'true-false';

export interface PracticeQuestion {
  id: string;
  chapterId: string;
  topicId: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  prompt: string;
  diagram?: {
    kind: 'single-vector' | 'addition-pair' | 'dot-angle' | 'displacement-pair';
    ax: number;
    ay: number;
    bx?: number;
    by?: number;
    labelA?: string;
    labelB?: string;
  };
  options?: string[];
  correctOptionIndex?: number;
  numericAnswer?: number;
  numericTolerance?: number;
  unit?: string;
  explanation: string;
}

export interface SearchResultItem {
  id: string;
  category: 'Subject' | 'Chapter' | 'Topic' | 'Simulation' | 'Equation' | 'Practice';
  title: string;
  subtitle: string;
  route: AppRoute;
  params?: {
    subjectId?: string;
    chapterId?: string;
    topicId?: string;
    simId?: SimulationId;
    questionId?: string;
  };
}
