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
import { KINEMATICS_TOPICS } from './subjects/classicalMechanics/kinematics/topics';
import { KINEMATICS_EXERCISES } from './subjects/classicalMechanics/kinematics/exercises';

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
    resourceIds: ['cm-foundations-text', 'vector-lab-suite', 'kinematics-lab-suite', 'cm-problem-bank'],
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
    id: 'kinematics-lab-suite',
    subjectId: 'classical-mechanics',
    title: '1D Kinematics & Integral Calculus Lab',
    authorOrSource: 'PhysicsKit Simulation Engine',
    type: 'Simulation Suite',
    description:
      'Five interactive 1D motion, secant/tangent slope, area-under-curve, and Riemann integration workspaces.',
    chapterIds: ['kinematics'],
    status: 'available',
  },
  {
    id: 'cm-problem-bank',
    subjectId: 'classical-mechanics',
    title: 'Applied Mechanics Problem Companion',
    authorOrSource: 'PhysicsKit Assessment Bank',
    type: 'Problem Bank',
    description:
      'Graded conceptual, numerical, and diagram exercises calibrated across Easy, Medium, and Hard difficulty tiers.',
    chapterIds: ['vectors', 'kinematics'],
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
    title: 'One Dimensional Kinematics',
    summary:
      'Describe straight-line motion through position, time intervals, displacement, secant/tangent velocity and acceleration, constant-a equations, graph areas, and definite/indefinite integrals.',
    estimatedMinutes: 110,
    status: 'available',
    learningObjectives: [
      'Distinguish signed 1D position coordinates, elapsed time intervals, displacement, and total distance traveled.',
      'Connect average velocity and average acceleration (secant slopes) to instantaneous derivatives (tangent slopes).',
      'Predict speeding up vs. slowing down from the relative algebraic signs of velocity and acceleration.',
      'Derive and apply constant-acceleration kinematics via rectangle + triangle areas under a–t and v–t graphs.',
      'Use indefinite and definite integrals (and Riemann sums) of a(t) and v(t) to recover Δv and Δx for varying acceleration.',
    ],
    keyEquations: [
      {
        label: 'Displacement & Time Interval',
        latex: '\\Delta x = x_2 - x_1, \\quad \\Delta t = t_2 - t_1',
        meaning: 'Signed net position change and elapsed duration between two clock readings.',
      },
      {
        label: 'Average & Instantaneous Velocity',
        latex: 'v_{\\text{avg}} = \\frac{\\Delta x}{\\Delta t}, \\quad v(t) = \\frac{dx}{dt}',
        meaning: 'Secant slope across an interval vs. tangent slope at an instant.',
      },
      {
        label: 'Average & Instantaneous Acceleration',
        latex: 'a_{\\text{avg}} = \\frac{\\Delta v}{\\Delta t}, \\quad a(t) = \\frac{dv}{dt} = \\frac{d^2x}{dt^2}',
        meaning: 'Rate of change of velocity; governs whether speed grows or diminishes.',
      },
      {
        label: 'Constant Acceleration Kinematics',
        latex: 'v = v_0 + at, \\quad x = x_0 + v_0t + \\tfrac{1}{2}at^2, \\quad v^2 = v_0^2 + 2a\\Delta x',
        meaning: 'Exact motion equations when acceleration is uniform in time.',
      },
      {
        label: 'Change of Velocity as Integral',
        latex: '\\Delta v = v(t_2) - v(t_1) = \\int_{t_1}^{t_2} a(t)\\,dt',
        meaning: 'Signed area under the acceleration–time curve.',
      },
      {
        label: 'Displacement as Integral',
        latex: '\\Delta x = x(t_2) - x(t_1) = \\int_{t_1}^{t_2} v(t)\\,dt',
        meaning: 'Signed area under the velocity–time curve (distinct from total distance ∫|v(t)|dt).',
      },
    ],
    topicIds: KINEMATICS_TOPICS.map((t) => t.id),
    simulationIds: [
      'kinematics-motion',
      'kinematics-velocity',
      'kinematics-acceleration',
      'kinematics-constant-accel',
      'kinematics-integrals',
    ],
    modules: [
      ...KINEMATICS_TOPICS.map((t) => ({
        id: `mod-${t.id}`,
        kind: 'lesson' as const,
        title: `${t.sectionNumber ?? `${t.order}.`} ${t.title}`,
        refId: t.id,
      })),
      {
        id: 'mod-kin-lab',
        kind: 'simulation',
        title: 'Interactive 1D Kinematics Lab',
        refId: 'kinematics-motion',
      },
      {
        id: 'mod-kin-practice',
        kind: 'exercise-set',
        title: '1D Kinematics Practice & Quiz Set',
        refId: 'kinematics',
      },
    ],
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
  {
    id: 'kinematics-motion',
    chapterId: 'kinematics',
    title: '1D Position, Time Interval & Displacement',
    shortTitle: '1D Motion',
    summary: 'Track a moving particle along a straight 1D axis while comparing signed displacement Δx against total path distance d over [t₁, t₂].',
    dimension: '1D',
    learningObjectives: [
      'Interpret signed coordinates x(t₁) and x(t₂) on a directed number line.',
      'Observe how direction reversals make total distance exceed |Δx|.',
    ],
    relatedTopics: ['Introduction', 'Position', 'Time interval', 'Displacement'],
    keyEquationLatex: '\\begin{aligned} \\Delta x &= x(t_2) - x(t_1) \\\\ d &= \\int_{t_1}^{t_2} |v(t)|\\,dt \\end{aligned}',
    quickCheck: {
      prompt: 'When does total distance traveled d strictly exceed |Δx|?',
      options: [
        'Whenever initial position x₀ is negative',
        'Whenever the particle reverses direction inside [t₁, t₂]',
        'Whenever velocity is constant and positive',
        'Whenever Δt > 1 s',
      ],
      correctIndex: 1,
      explanation: 'A direction reversal cancels part of the net displacement Δx while adding positively to path distance d.',
    },
  },
  {
    id: 'kinematics-velocity',
    chapterId: 'kinematics',
    title: 'Average vs. Instantaneous Velocity',
    shortTitle: 'Velocity & Slopes',
    summary: 'Compare the secant line slope v_avg across [t₁, t₂] against the instantaneous tangent line v(t) = dx/dt as Δt shrinks.',
    dimension: '1D',
    learningObjectives: [
      'Relate average velocity Δx/Δt to the secant chord on an x–t graph.',
      'Watch the secant slope converge to the tangent slope dx/dt as Δt → 0.',
    ],
    relatedTopics: ['Average velocity', 'Instantaneous velocity'],
    keyEquationLatex: '\\begin{aligned} v_{\\text{avg}} &= \\frac{x(t_2) - x(t_1)}{t_2 - t_1} \\\\ v(t) &= \\frac{dx}{dt} \\end{aligned}',
    quickCheck: {
      prompt: 'What happens to the secant line on x(t) as you shrink t₁ and t₂ tightly around instant t?',
      options: [
        'Its slope approaches zero',
        'It becomes vertical',
        'Its slope converges to the instantaneous velocity v(t) = dx/dt',
        'It equals the area under x(t)',
      ],
      correctIndex: 2,
      explanation: 'By the limit definition of the derivative, shrinking Δt → 0 turns the secant chord into the tangent line.',
    },
  },
  {
    id: 'kinematics-acceleration',
    chapterId: 'kinematics',
    title: 'Average & Instantaneous Acceleration',
    shortTitle: 'Acceleration',
    summary: 'Explore secant a_avg and tangent a(t) = dv/dt on v(t), and see how the signs of v and a determine speeding up vs. slowing down.',
    dimension: '1D',
    learningObjectives: [
      'Distinguish average acceleration Δv/Δt from instantaneous slope dv/dt.',
      'Identify speeding up (v·a > 0) versus slowing down (v·a < 0).',
    ],
    relatedTopics: ['Average acceleration', 'Instantaneous acceleration'],
    keyEquationLatex: '\\begin{aligned} a_{\\text{avg}} &= \\frac{\\Delta v}{\\Delta t} \\\\ a(t) &= \\frac{dv}{dt} = \\frac{d^2x}{dt^2} \\end{aligned}',
    quickCheck: {
      prompt: 'If a particle has v = -6 m/s and a = -2 m/s² at instant t, what is its speed doing?',
      options: [
        'Slowing down because a is negative',
        'Speeding up in the -x direction because v and a share the same sign',
        'Remaining constant',
        'Reversing immediately',
      ],
      correctIndex: 1,
      explanation: 'Speed increases whenever v and a point in the same direction (v·a > 0).',
    },
  },
  {
    id: 'kinematics-constant-accel',
    chapterId: 'kinematics',
    title: 'Constant Acceleration & Graph Areas',
    shortTitle: 'Constant Accel & Areas',
    summary: 'Inspect synchronized a–t, v–t, and x–t graphs with live shaded areas Δv = aΔt and Δx = v₁Δt + ½a(Δt)².',
    dimension: '1D',
    learningObjectives: [
      'Connect the rectangular area under a(t) to Δv.',
      'Decompose the trapezoid area under v(t) into a rectangle plus triangle yielding Δx.',
    ],
    relatedTopics: ['Constant acceleration', 'Area under the a–t graph', 'Area under the v–t graph'],
    keyEquationLatex: '\\begin{aligned} \\Delta v &= a\\Delta t \\\\ \\Delta x &= v_1\\Delta t + \\tfrac{1}{2}a(\\Delta t)^2 \\end{aligned}',
    quickCheck: {
      prompt: 'In the v–t trapezoid decomposition, what does the triangular upper piece ½a(Δt)² represent?',
      options: [
        'Initial velocity',
        'Additional displacement caused by changing velocity at rate a',
        'Total acceleration',
        'Elapsed time',
      ],
      correctIndex: 1,
      explanation: 'The rectangle v₁Δt is displacement at constant initial velocity; the triangle ½a(Δt)² adds the extra displacement from acceleration.',
    },
  },
  {
    id: 'kinematics-integrals',
    chapterId: 'kinematics',
    title: 'Indefinite & Definite Integrals in Kinematics',
    shortTitle: 'Integrals & Riemann',
    summary: 'Vary jerk j and Riemann subintervals N to watch midpoint rectangles converge to ∫a(t)dt = Δv and ∫v(t)dt = Δx, alongside antiderivative shifts + C.',
    dimension: '1D',
    learningObjectives: [
      'See how initial condition C selects a single curve from the antiderivative family ∫a(t)dt + C.',
      'Compare N-bin Riemann midpoint sums against exact definite integrals of a(t) and v(t).',
    ],
    relatedTopics: [
      'Change of velocity as the indefinite integral',
      'Area as the indefinite integral',
      'Definite integral of acceleration',
      'Displacement as the definite integral of velocity',
    ],
    keyEquationLatex: '\\begin{aligned} v(t_2) - v(t_1) &= \\int_{t_1}^{t_2} a(t)\\,dt \\\\ x(t_2) - x(t_1) &= \\int_{t_1}^{t_2} v(t)\\,dt \\end{aligned}',
    quickCheck: {
      prompt: 'When v(t) crosses zero inside [t₁, t₂], how does ∫v(t)dt differ from ∫|v(t)|dt?',
      options: [
        'They are always identical',
        '∫v(t)dt gives signed net displacement Δx, while ∫|v(t)|dt gives total distance traveled',
        '∫v(t)dt gives acceleration',
        '∫|v(t)|dt can be negative',
      ],
      correctIndex: 1,
      explanation: 'Negative velocity lobes subtract in ∫v(t)dt (displacement) but add positively in ∫|v(t)|dt (distance).',
    },
  },
];

export const TOPICS: TopicItem[] = [...VECTORS_TOPICS, ...KINEMATICS_TOPICS];
export const PRACTICE_QUESTIONS: PracticeQuestion[] = [...VECTORS_EXERCISES, ...KINEMATICS_EXERCISES];

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
