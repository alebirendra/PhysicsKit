import type {
  ChapterItem,
  LearningResource,
  PracticeQuestion,
  SimulationConfig,
  SimulationId,
  SubjectItem,
  TopicItem,
} from '../types/physics';
import { VECTORS_TOPICS } from './subjects/classicalMechanics/vectors/topics';
import { VECTORS_EXERCISES } from './subjects/classicalMechanics/vectors/exercises';

export const SUBJECTS: SubjectItem[] = [
  {
    id: 'classical-mechanics',
    title: 'Classical Mechanics',
    subtitle: 'Motion, Forces, Energy & Spatial Geometry',
    description:
      'Build rock-solid geometric and mathematical intuition for how objects move, interact, balance, and rotate in 2D and 3D space.',
    status: 'available',
    chapterIds: [
      'vectors',
      'kinematics',
      'dynamics',
      'work-energy',
      'momentum',
      'rotational-motion',
      'gravitation',
      'oscillations',
    ],
    resourceIds: ['cm-foundations-text', 'vector-lab-suite', 'cm-problem-bank'],
    accentColor: '#2563EB',
  },
  {
    id: 'electricity-magnetism',
    title: 'Electricity and Magnetism',
    subtitle: 'Fields, Potential, Circuits & Maxwell’s Equations',
    description:
      'Visualize electric field lines, Gauss’s law surfaces, circuit dynamics, and electromagnetic induction.',
    status: 'coming-soon',
    chapterIds: [],
    resourceIds: [],
    accentColor: '#0284C7',
  },
  {
    id: 'waves-optics',
    title: 'Waves and Optics',
    subtitle: 'Superposition, Interference, Diffraction & Lenses',
    description:
      'Explore traveling waves, standing harmonics, ray tracing, and wave interference patterns.',
    status: 'coming-soon',
    chapterIds: [],
    resourceIds: [],
    accentColor: '#0D9488',
  },
  {
    id: 'thermodynamics',
    title: 'Thermodynamics',
    subtitle: 'Temperature, Heat Engines, Entropy & Kinetic Theory',
    description:
      'Connect microscopic particle collisions to macroscopic pressure-volume cycles and entropy.',
    status: 'coming-soon',
    chapterIds: [],
    resourceIds: [],
    accentColor: '#D97706',
  },
  {
    id: 'modern-physics',
    title: 'Modern Physics',
    subtitle: 'Relativity, Quantum Mechanics & Atomic Structure',
    description:
      'Investigate spacetime intervals, wave-particle duality, potential wells, and atomic transitions.',
    status: 'coming-soon',
    chapterIds: [],
    resourceIds: [],
    accentColor: '#4F46E5',
  },
];

export const LEARNING_RESOURCES: LearningResource[] = [
  {
    id: 'cm-foundations-text',
    subjectId: 'classical-mechanics',
    title: 'Classical Mechanics: Visual Foundations',
    authorOrSource: 'PhysicsKit Curriculum Series',
    type: 'Interactive Textbook',
    description:
      'A structured, intuition-first interactive textbook pairing geometric diagrams with live parameter labs and worked derivations.',
    chapterIds: ['vectors', 'kinematics', 'dynamics', 'work-energy'],
    status: 'available',
  },
  {
    id: 'vector-lab-suite',
    subjectId: 'classical-mechanics',
    title: 'Vector Geometry & Spatial Calculus Lab',
    authorOrSource: 'PhysicsKit Simulation Engine',
    type: 'Simulation Suite',
    description:
      'Eight real-time 2D and 3D interactive mathematical workspaces covering representation, addition, projection, dot products, and cross products.',
    chapterIds: ['vectors'],
    status: 'available',
  },
  {
    id: 'cm-problem-bank',
    subjectId: 'classical-mechanics',
    title: 'Applied Mechanics Problem Companion',
    authorOrSource: 'PhysicsKit Assessment Bank',
    type: 'Problem Bank',
    description:
      'Graded conceptual, numerical, and vector-diagram exercises calibrated across Easy, Medium, and Hard difficulty tiers.',
    chapterIds: ['vectors'],
    status: 'available',
  },
];

export const CHAPTERS: ChapterItem[] = [
  {
    id: 'vectors',
    subjectId: 'classical-mechanics',
    resourceId: 'cm-foundations-text',
    number: 1,
    title: 'Vectors',
    summary:
      'Master directional quantities in 2D and 3D space—from graphical arrows and trigonometric components to unit vectors, dot products, and 3D cross products.',
    estimatedMinutes: 90,
    status: 'available',
    learningObjectives: [
      'Distinguish scalar quantities from directional vector quantities in physical contexts.',
      'Convert fluently between polar (magnitude, angle) and Cartesian (Ax, Ay) coordinates.',
      'Combine and subtract vectors both geometrically (head-to-tail, parallelogram) and algebraically.',
      'Resolve any vector into orthogonal rectangular components and express it with unit vectors i, j, k.',
      'Compute and physically interpret dot products (work, projection) and 3D cross products (torque, right-hand rule).',
    ],
    keyEquations: [
      {
        label: 'Magnitude & Angle',
        latex: 'A = \\sqrt{A_x^2 + A_y^2}, \\quad \\theta = \\operatorname{atan2}(A_y, A_x)',
        meaning: 'Links rectangular coordinates to arrow length and direction.',
      },
      {
        label: 'Vector Resolution',
        latex: 'A_x = A\\cos\\theta, \\quad A_y = A\\sin\\theta',
        meaning: 'Projects a vector onto perpendicular horizontal and vertical axes.',
      },
      {
        label: 'Vector Addition',
        latex: 'R_x = A_x + B_x, \\quad R_y = A_y + B_y, \\quad R = \\sqrt{R_x^2 + R_y^2}',
        meaning: 'Computes the resultant vector from independent axis sums.',
      },
      {
        label: 'Unit Vector Form',
        latex: '\\vec{A} = A_x\\hat{i} + A_y\\hat{j} + A_z\\hat{k}',
        meaning: 'Expresses any 3D vector as a linear combination of standard basis unit vectors.',
      },
      {
        label: 'Dot Product',
        latex: '\\vec{A} \\cdot \\vec{B} = |\\vec{A}||\\vec{B}|\\cos\\theta = A_x B_x + A_y B_y',
        meaning: 'Measures directional alignment; fundamental to mechanical work.',
      },
      {
        label: 'Cross Product',
        latex: '|\\vec{A} \\times \\vec{B}| = |\\vec{A}||\\vec{B}|\\sin\\theta',
        meaning: 'Produces a perpendicular 3D vector scaled by the spanned parallelogram area.',
      },
    ],
    topicIds: VECTORS_TOPICS.map((t) => t.id),
    simulationIds: [
      'representation',
      'addition',
      'subtraction',
      'resolution',
      'unit-vectors',
      'dot-product',
      'cross-product',
      'displacement',
    ],
    modules: [
      ...VECTORS_TOPICS.map((t) => ({
        id: `mod-${t.id}`,
        kind: 'lesson' as const,
        title: `${t.order}. ${t.title}`,
        refId: t.id,
      })),
      {
        id: 'mod-vec-lab',
        kind: 'simulation',
        title: 'Interactive Vector Simulation Lab',
        refId: 'representation',
      },
      {
        id: 'mod-vec-practice',
        kind: 'exercise-set',
        title: 'Vectors Practice & Quiz Set',
        refId: 'vectors',
      },
    ],
  },
  {
    id: 'kinematics',
    subjectId: 'classical-mechanics',
    resourceId: 'cm-foundations-text',
    number: 2,
    title: 'Kinematics',
    summary: 'Position, velocity, acceleration, projectile trajectories, and circular motion.',
    estimatedMinutes: 110,
    status: 'coming-soon',
    learningObjectives: [],
    keyEquations: [],
    topicIds: [],
    simulationIds: [],
    modules: [],
  },
  {
    id: 'dynamics',
    subjectId: 'classical-mechanics',
    resourceId: 'cm-foundations-text',
    number: 3,
    title: 'Dynamics',
    summary: 'Newton’s Laws of Motion, free-body diagrams, friction, and tension systems.',
    estimatedMinutes: 120,
    status: 'coming-soon',
    learningObjectives: [],
    keyEquations: [],
    topicIds: [],
    simulationIds: [],
    modules: [],
  },
  {
    id: 'work-energy',
    subjectId: 'classical-mechanics',
    resourceId: 'cm-foundations-text',
    number: 4,
    title: 'Work and Energy',
    summary: 'Work via dot products, kinetic & potential energy, and conservation laws.',
    estimatedMinutes: 95,
    status: 'coming-soon',
    learningObjectives: [],
    keyEquations: [],
    topicIds: [],
    simulationIds: [],
    modules: [],
  },
  {
    id: 'momentum',
    subjectId: 'classical-mechanics',
    resourceId: 'cm-foundations-text',
    number: 5,
    title: 'Momentum',
    summary: 'Impulse, elastic and inelastic collisions, and center of mass.',
    estimatedMinutes: 85,
    status: 'coming-soon',
    learningObjectives: [],
    keyEquations: [],
    topicIds: [],
    simulationIds: [],
    modules: [],
  },
  {
    id: 'rotational-motion',
    subjectId: 'classical-mechanics',
    resourceId: 'cm-foundations-text',
    number: 6,
    title: 'Rotational Motion',
    summary: 'Torque via cross products, moment of inertia, and angular momentum.',
    estimatedMinutes: 115,
    status: 'coming-soon',
    learningObjectives: [],
    keyEquations: [],
    topicIds: [],
    simulationIds: [],
    modules: [],
  },
  {
    id: 'gravitation',
    subjectId: 'classical-mechanics',
    resourceId: 'cm-foundations-text',
    number: 7,
    title: 'Gravitation',
    summary: 'Universal gravitation, orbital mechanics, and Kepler’s laws.',
    estimatedMinutes: 90,
    status: 'coming-soon',
    learningObjectives: [],
    keyEquations: [],
    topicIds: [],
    simulationIds: [],
    modules: [],
  },
  {
    id: 'oscillations',
    subjectId: 'classical-mechanics',
    resourceId: 'cm-foundations-text',
    number: 8,
    title: 'Oscillations',
    summary: 'Simple harmonic motion, pendulums, damping, and resonance.',
    estimatedMinutes: 95,
    status: 'coming-soon',
    learningObjectives: [],
    keyEquations: [],
    topicIds: [],
    simulationIds: [],
    modules: [],
  },
];

export const SIMULATIONS: SimulationConfig[] = [
  {
    id: 'representation',
    chapterId: 'vectors',
    title: 'Vector Representation',
    shortTitle: 'Representation',
    summary: 'Drag the vector tip directly on the Cartesian plane or adjust magnitude and angle to observe live component coordinates.',
    dimension: '2D',
    learningObjectives: [
      'Relate a vector’s geometric arrow length and angle to its Cartesian coordinates (Ax, Ay).',
      'Observe how quadrant signs change as the standard polar angle sweeps from 0° to 360°.',
    ],
    relatedTopics: ['Introduction to Vectors', 'Graphical Representation of Vectors', 'Magnitude and Direction'],
    keyEquationLatex: '\\vec{A} = (A_x, A_y) = (A\\cos\\theta,\\, A\\sin\\theta)',
    quickCheck: {
      prompt: 'If you drag the tip of A to (-3, -4), what are its magnitude and quadrant?',
      options: ['Magnitude 5 in Quadrant III', 'Magnitude 7 in Quadrant III', 'Magnitude 5 in Quadrant II', 'Magnitude 1 in Quadrant IV'],
      correctIndex: 0,
      explanation: 'Both coordinates are negative (Quadrant III), and $\\sqrt{(-3)^2 + (-4)^2} = 5$.',
    },
  },
  {
    id: 'addition',
    chapterId: 'vectors',
    title: 'Vector Addition',
    shortTitle: 'Addition',
    summary: 'Combine two adjustable vectors A and B into resultant R = A + B using either the head-to-tail or parallelogram geometric construction.',
    dimension: '2D',
    learningObjectives: [
      'Compare the head-to-tail and parallelogram methods for adding two vectors.',
      'Verify that algebraic component sums Rx = Ax + Bx and Ry = Ay + By match the geometric resultant.',
    ],
    relatedTopics: ['Vector Addition', 'Applications of Vectors'],
    keyEquationLatex: 'R_x = A_x + B_x,\\; R_y = A_y + B_y,\\; R = \\sqrt{R_x^2 + R_y^2}',
    quickCheck: {
      prompt: 'When are the head-to-tail and parallelogram methods guaranteed to produce the same resultant R?',
      options: [
        'Only when A and B are perpendicular',
        'Always, for any pair of vectors A and B',
        'Only when |A| = |B|',
        'Only in Quadrant I',
      ],
      correctIndex: 1,
      explanation: 'Translating B to the tip of A forms one half of the exact parallelogram whose diagonal is R = A + B.',
    },
  },
  {
    id: 'subtraction',
    chapterId: 'vectors',
    title: 'Vector Subtraction',
    shortTitle: 'Subtraction',
    summary: 'Visualize A - B by flipping vector B into -B and performing head-to-tail addition A + (-B).',
    dimension: '2D',
    learningObjectives: [
      'Interpret the negative vector -B as a 180° reversal of B with unchanged magnitude.',
      'Connect A - B geometrically to both A + (-B) and the tip-to-tip difference arrow.',
    ],
    relatedTopics: ['Vector Subtraction', 'Position and Displacement Vectors'],
    keyEquationLatex: '\\vec{D} = \\vec{A} - \\vec{B} = \\vec{A} + (-\\vec{B})',
    quickCheck: {
      prompt: 'If vector B = (3, -2), what is the negative vector -B?',
      options: ['(-3, -2)', '(3, 2)', '(-3, 2)', '(2, -3)'],
      correctIndex: 2,
      explanation: 'Negating a vector reverses the sign of every component: $-(3, -2) = (-3, 2)$.',
    },
  },
  {
    id: 'resolution',
    chapterId: 'vectors',
    title: 'Resolution of Vectors',
    shortTitle: 'Resolution',
    summary: 'Animate perpendicular projections onto the x and y axes and inspect how Ax = A cos(θ) and Ay = A sin(θ) vary with angle.',
    dimension: '2D',
    learningObjectives: [
      'Visualize how a single vector decomposes into independent orthogonal shadows Ax and Ay.',
      'Predict at which angles Ax or Ay vanishes or reaches maximum magnitude.',
    ],
    relatedTopics: ['Resolution of Vectors', 'Rectangular Components'],
    keyEquationLatex: 'A_x = A\\cos\\theta, \\quad A_y = A\\sin\\theta',
    quickCheck: {
      prompt: 'As θ increases from 0° to 90° for a fixed magnitude A, how do Ax and Ay behave?',
      options: [
        'Both Ax and Ay increase',
        'Ax decreases while Ay increases',
        'Ax increases while Ay decreases',
        'Both stay constant',
      ],
      correctIndex: 1,
      explanation: 'Between 0° and 90°, $\\cos\\theta$ decreases from 1 to 0 while $\\sin\\theta$ increases from 0 to 1.',
    },
  },
  {
    id: 'unit-vectors',
    chapterId: 'vectors',
    title: 'Unit Vectors (i, j, k)',
    shortTitle: 'Unit Vectors',
    summary: 'Construct vectors in 2D or full 3D space using standard basis unit vectors i, j, and k, and inspect the normalized unit direction vector.',
    dimension: '2D/3D',
    learningObjectives: [
      'Express any 2D or 3D vector as A = Ax i + Ay j + Az k.',
      'Verify that the normalized unit vector û = A / |A| always maintains magnitude 1.',
    ],
    relatedTopics: ['Unit Vectors', 'Rectangular Components'],
    keyEquationLatex: '\\vec{A} = A_x\\hat{i} + A_y\\hat{j} + A_z\\hat{k}, \\quad \\hat{u} = \\frac{\\vec{A}}{|\\vec{A}|}',
    quickCheck: {
      prompt: 'If you double every component (Ax, Ay, Az) of vector A, what happens to its unit vector û = A / |A|?',
      options: [
        'Its magnitude doubles to 2',
        'It reverses direction',
        'It stays completely unchanged with magnitude 1',
        'It becomes zero',
      ],
      correctIndex: 2,
      explanation: 'Both the vector and its magnitude double, so the factor of 2 cancels out and the pure direction unit vector û is unchanged.',
    },
  },
  {
    id: 'dot-product',
    chapterId: 'vectors',
    title: 'Dot Product Explorer',
    shortTitle: 'Dot Product',
    summary: 'Adjust two vectors to explore how the enclosed angle θ governs A · B = AB cos(θ) and the scalar projection of A onto B.',
    dimension: '2D',
    learningObjectives: [
      'Observe why perpendicular vectors always yield A · B = 0.',
      'See how acute angles give positive dot products and obtuse angles give negative dot products.',
    ],
    relatedTopics: ['Dot Product (Scalar Product)', 'Applications of Vectors'],
    keyEquationLatex: '\\vec{A} \\cdot \\vec{B} = |\\vec{A}||\\vec{B}|\\cos\\theta = A_x B_x + A_y B_y',
    quickCheck: {
      prompt: 'What sign does the dot product A · B have when the angle between A and B is 120°?',
      options: ['Positive', 'Zero', 'Negative', 'Undefined'],
      correctIndex: 2,
      explanation: 'For angles between $90^\\circ$ and $180^\\circ$, $\\cos\\theta < 0$, making the dot product negative.',
    },
  },
  {
    id: 'cross-product',
    chapterId: 'vectors',
    title: '3D Cross Product & Right-Hand Rule',
    shortTitle: 'Cross Product 3D',
    summary: 'Orbit freely in 3D space to visualize A, B, their spanned parallelogram area, and the perpendicular resultant A × B.',
    dimension: '3D',
    learningObjectives: [
      'Verify visually that A × B is strictly perpendicular to the plane containing A and B.',
      'Relate |A × B| = AB sin(θ) to the area of the spanned parallelogram and the right-hand rule.',
    ],
    relatedTopics: ['Cross Product (Vector Product)', 'Unit Vectors'],
    keyEquationLatex: '|\\vec{A} \\times \\vec{B}| = |\\vec{A}||\\vec{B}|\\sin\\theta',
    quickCheck: {
      prompt: 'When are two non-zero 3D vectors guaranteed to have a cross product of zero?',
      options: [
        'When they are perpendicular (90°)',
        'When they are parallel (0°) or antiparallel (180°)',
        'When they have equal lengths',
        'When they lie in the xy-plane',
      ],
      correctIndex: 1,
      explanation: 'Since $\\sin(0^\\circ) = \\sin(180^\\circ) = 0$, parallel and antiparallel vectors span zero area and give $\\vec{A} \\times \\vec{B} = \\vec{0}$.',
    },
  },
  {
    id: 'displacement',
    chapterId: 'vectors',
    title: 'Position and Displacement',
    shortTitle: 'Displacement',
    summary: 'Drag an object’s initial position r1 and final position r2 to observe the coordinate-independent displacement vector Δr = r2 - r1.',
    dimension: '2D',
    learningObjectives: [
      'Distinguish position vectors anchored at the origin from the displacement vector connecting r1 to r2.',
      'Verify that Δr = r2 - r1 gives both straight-line distance and heading.',
    ],
    relatedTopics: ['Position and Displacement Vectors', 'Vector Subtraction', 'Scalars and Vectors'],
    keyEquationLatex: '\\Delta\\vec{r} = \\vec{r}_2 - \\vec{r}_1 = (x_2 - x_1)\\hat{i} + (y_2 - y_1)\\hat{j}',
    quickCheck: {
      prompt: 'If an object starts at (4, 3) and returns to (4, 3) after wandering around the grid, what is Δr?',
      options: ['(8, 6)', '(4, 3)', '(0, 0)', '5 units'],
      correctIndex: 2,
      explanation: 'Because initial and final positions match ($\\vec{r}_2 = \\vec{r}_1$), $\\Delta\\vec{r} = \\vec{0} = (0, 0)$.',
    },
  },
];

export const TOPICS: TopicItem[] = [...VECTORS_TOPICS];
export const PRACTICE_QUESTIONS: PracticeQuestion[] = [...VECTORS_EXERCISES];

export function getSubjectById(id: string): SubjectItem | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export function getChapterById(id: string): ChapterItem | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function getTopicsForChapter(chapterId: string): TopicItem[] {
  return TOPICS.filter((t) => t.chapterId === chapterId).sort((a, b) => a.order - b.order);
}

export function getSimulationById(id: SimulationId): SimulationConfig | undefined {
  return SIMULATIONS.find((s) => s.id === id);
}

export function getQuestionsForChapter(chapterId: string): PracticeQuestion[] {
  return PRACTICE_QUESTIONS.filter((q) => q.chapterId === chapterId);
}
