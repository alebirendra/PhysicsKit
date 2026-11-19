import type { PracticeQuestion } from '../../../../types/physics';

export const VECTORS_EXERCISES: PracticeQuestion[] = [
  {
    id: 'vec-q1',
    chapterId: 'vectors',
    topicId: 'scalars-and-vectors',
    difficulty: 'Easy',
    type: 'conceptual',
    prompt:
      'A car drives around a circular roundabout at a steady speedometer reading of 30 km/h. Which statement accurately describes its motion?',
    options: [
      'Both its speed and velocity remain constant.',
      'Its speed is constant, while its velocity vector is continuously changing.',
      'Its velocity is constant, while its speed changes with angle.',
      'Speed is a vector and velocity is a scalar.',
    ],
    correctOptionIndex: 1,
    explanation:
      'Speed is a scalar magnitude (fixed at 30 km/h), whereas velocity is a vector. As the car curves, its direction changes continuously, so the velocity vector changes.',
  },
  {
    id: 'vec-q2',
    chapterId: 'vectors',
    topicId: 'magnitude-and-direction',
    difficulty: 'Easy',
    type: 'numerical',
    prompt:
      'A displacement vector has Cartesian components Δx = 6.0 m and Δy = 8.0 m. Calculate its magnitude in meters.',
    numericAnswer: 10,
    numericTolerance: 0.05,
    unit: 'm',
    explanation:
      'Using the Pythagorean theorem: $|\\Delta\\vec{r}| = \\sqrt{6.0^2 + 8.0^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10.0\\text{ m}$.',
  },
  {
    id: 'vec-q3',
    chapterId: 'vectors',
    topicId: 'vector-addition',
    difficulty: 'Easy',
    type: 'diagram',
    prompt:
      'Inspect the two vectors shown in the diagram: $\\vec{A} = (4, 1)$ and $\\vec{B} = (-1, 3)$. What are the coordinates of the resultant vector $\\vec{R} = \\vec{A} + \\vec{B}$?',
    diagram: {
      kind: 'addition-pair',
      ax: 4,
      ay: 1,
      bx: -1,
      by: 3,
      labelA: 'A (4, 1)',
      labelB: 'B (-1, 3)',
    },
    options: ['(5, 4)', '(3, 4)', '(3, -2)', '(5, -2)'],
    correctOptionIndex: 1,
    explanation:
      'Add components independently: $R_x = 4 + (-1) = 3$ and $R_y = 1 + 3 = 4$, giving $\\vec{R} = (3, 4)$.',
  },
  {
    id: 'vec-q4',
    chapterId: 'vectors',
    topicId: 'resolution-of-vectors',
    difficulty: 'Easy',
    type: 'true-false',
    prompt:
      'True or False: When a vector of magnitude 10 units points at an angle of 60° above the +x axis, its horizontal x-component is larger than its vertical y-component.',
    options: ['True', 'False'],
    correctOptionIndex: 1,
    explanation:
      'False. At $60^\\circ$, $A_x = 10\\cos(60^\\circ) = 5.0$ while $A_y = 10\\sin(60^\\circ) \\approx 8.66$, so the vertical component is larger.',
  },
  {
    id: 'vec-q5',
    chapterId: 'vectors',
    topicId: 'vector-subtraction',
    difficulty: 'Medium',
    type: 'multiple-choice',
    prompt:
      'Given $\\vec{A} = 5\\hat{i} - 2\\hat{j}$ and $\\vec{B} = 2\\hat{i} + 2\\hat{j}$, what is the magnitude of $\\vec{A} - \\vec{B}$?',
    options: ['3', '5', '7', '√53'],
    correctOptionIndex: 1,
    explanation:
      'First subtract components: $\\vec{A} - \\vec{B} = (5 - 2)\\hat{i} + (-2 - 2)\\hat{j} = 3\\hat{i} - 4\\hat{j}$. Its magnitude is $\\sqrt{3^2 + (-4)^2} = 5$.',
  },
  {
    id: 'vec-q6',
    chapterId: 'vectors',
    topicId: 'dot-product',
    difficulty: 'Medium',
    type: 'numerical',
    prompt:
      'Compute the dot product $\\vec{A} \\cdot \\vec{B}$ for $\\vec{A} = (3, -4)$ and $\\vec{B} = (5, 2)$.',
    numericAnswer: 7,
    numericTolerance: 0.05,
    unit: '',
    explanation:
      'Using component multiplication: $\\vec{A} \\cdot \\vec{B} = (3)(5) + (-4)(2) = 15 - 8 = 7$.',
  },
  {
    id: 'vec-q7',
    chapterId: 'vectors',
    topicId: 'unit-vectors',
    difficulty: 'Medium',
    type: 'diagram',
    prompt:
      'In the vector diagram below, vector $\\vec{A}$ ends at $(-3, 4)$. How is $\\vec{A}$ expressed in unit vector notation, and what is its unit direction vector $\\hat{u}_A$?',
    diagram: {
      kind: 'single-vector',
      ax: -3,
      ay: 4,
      labelA: 'A (-3, 4)',
    },
    options: [
      'A = -3i + 4j; û = -0.6i + 0.8j',
      'A = 3i - 4j; û = 0.6i - 0.8j',
      'A = -3i + 4j; û = -3i + 4j',
      'A = -4i + 3j; û = -0.8i + 0.6j',
    ],
    correctOptionIndex: 0,
    explanation:
      'With tip at $(-3, 4)$, $\\vec{A} = -3\\hat{i} + 4\\hat{j}$ and $|\\vec{A}| = 5$. Dividing by $5$ yields $\\hat{u}_A = -0.6\\hat{i} + 0.8\\hat{j}$.',
  },
  {
    id: 'vec-q8',
    chapterId: 'vectors',
    topicId: 'position-and-displacement',
    difficulty: 'Medium',
    type: 'numerical',
    prompt:
      'A particle moves from initial position $\\vec{r}_1 = (2, -1)\\text{ m}$ to final position $\\vec{r}_2 = (-6, 5)\\text{ m}$. Find the magnitude of its displacement vector in meters.',
    numericAnswer: 10,
    numericTolerance: 0.05,
    unit: 'm',
    explanation:
      '$\\Delta\\vec{r} = \\vec{r}_2 - \\vec{r}_1 = (-6 - 2, 5 - (-1)) = (-8, 6)\\text{ m}$. Magnitude $= \\sqrt{(-8)^2 + 6^2} = 10\\text{ m}$.',
  },
  {
    id: 'vec-q9',
    chapterId: 'vectors',
    topicId: 'cross-product',
    difficulty: 'Hard',
    type: 'multiple-choice',
    prompt:
      'Vector $\\vec{A} = 2\\hat{i} + 3\\hat{k}$ and vector $\\vec{B} = 4\\hat{j}$. What is $\\vec{A} \\times \\vec{B}$?',
    options: [
      '-12i + 8k',
      '12i - 8k',
      '8i + 12k',
      '-8i - 12k',
    ],
    correctOptionIndex: 0,
    explanation:
      'Using distributive cross products: $(2\\hat{i} + 3\\hat{k}) \\times 4\\hat{j} = 8(\\hat{i} \\times \\hat{j}) + 12(\\hat{k} \\times \\hat{j}) = 8\\hat{k} + 12(-\\hat{i}) = -12\\hat{i} + 8\\hat{k}$.',
  },
  {
    id: 'vec-q10',
    chapterId: 'vectors',
    topicId: 'dot-product',
    difficulty: 'Hard',
    type: 'numerical',
    prompt:
      'Two vectors have magnitudes $|\\vec{A}| = 8$ and $|\\vec{B}| = 5$, and their dot product is $\\vec{A} \\cdot \\vec{B} = 20$. What is the angle $\\theta$ between them in degrees?',
    numericAnswer: 60,
    numericTolerance: 0.5,
    unit: '°',
    explanation:
      '$\\cos\\theta = \\frac{\\vec{A}\\cdot\\vec{B}}{AB} = \\frac{20}{8 \\times 5} = 0.50 \\implies \\theta = \\cos^{-1}(0.50) = 60^\\circ$.',
  },
  {
    id: 'vec-q11',
    chapterId: 'vectors',
    topicId: 'cross-product',
    difficulty: 'Hard',
    type: 'conceptual',
    prompt:
      'Two non-zero vectors $\\vec{A}$ and $\\vec{B}$ have $|\\vec{A} \\times \\vec{B}| = \\vec{A} \\cdot \\vec{B}$. What is the angle $\\theta$ between them?',
    options: ['0°', '30°', '45°', '90°'],
    correctOptionIndex: 2,
    explanation:
      'Setting $AB\\sin\\theta = AB\\cos\\theta$ gives $\\tan\\theta = 1$, so $\\theta = 45^\\circ$.',
  },
  {
    id: 'vec-q12',
    chapterId: 'vectors',
    topicId: 'applications-of-vectors',
    difficulty: 'Hard',
    type: 'true-false',
    prompt:
      'True or False: If two vectors have different magnitudes, it is still possible for the sum of those two vectors alone to equal the zero vector.',
    options: ['True', 'False'],
    correctOptionIndex: 1,
    explanation:
      'False. Two vectors sum to zero only when $\\vec{A} = -\\vec{B}$, which requires them to have equal magnitudes and opposite directions. (You need at least three vectors of unequal magnitudes to sum to zero.)',
  },
];
