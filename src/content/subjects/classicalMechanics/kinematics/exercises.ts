import type { PracticeQuestion } from '../../../../types/physics';

export const KINEMATICS_EXERCISES: PracticeQuestion[] = [
  {
    id: 'kin-q1',
    chapterId: 'kinematics',
    topicId: 'displacement-1d',
    difficulty: 'Easy',
    type: 'multiple-choice',
    prompt:
      'A runner starts at $x_1 = +5\\text{ m}$, sprints to $x = +25\\text{ m}$, and then jogs back to $x_2 = +10\\text{ m}$. What are her net displacement $\\Delta x$ and total distance traveled $d$?',
    options: [
      'Δx = +5 m, d = 35 m',
      'Δx = +35 m, d = 5 m',
      'Δx = +10 m, d = 30 m',
      'Δx = -5 m, d = 35 m',
    ],
    correctOptionIndex: 0,
    explanation:
      'Displacement depends only on endpoints: $\\Delta x = 10 - 5 = +5\\text{ m}$. Total distance sums both legs: $|25 - 5| + |10 - 25| = 20 + 15 = 35\\text{ m}$.',
  },
  {
    id: 'kin-q2',
    chapterId: 'kinematics',
    topicId: 'position-1d',
    difficulty: 'Easy',
    type: 'true-false',
    prompt:
      'True or False: Shifting the coordinate origin from $x = 0$ to $x = +10\\text{ m}$ changes an object’s position coordinates, but leaves its displacement $\\Delta x$ and average velocity unchanged.',
    options: ['True', 'False'],
    correctOptionIndex: 0,
    explanation:
      'True. Both $x_1$ and $x_2$ shift by the same constant $-10\\text{ m}$, so that constant cancels when computing $\\Delta x = x_2 - x_1$.',
  },
  {
    id: 'kin-q3',
    chapterId: 'kinematics',
    topicId: 'average-velocity',
    difficulty: 'Easy',
    type: 'diagram',
    prompt:
      'In the position–time graph below, a particle passes $(t_1 = 1\\text{ s}, x_1 = 2\\text{ m})$ and $(t_2 = 5\\text{ s}, x_2 = 14\\text{ m})$. What is the slope of the dashed secant line, representing $v_{\\text{avg}}$?',
    diagram: {
      kind: 'kinematics-xt-secant',
      title: 'Secant line on x–t from (1 s, 2 m) to (5 s, 14 m)',
    },
    options: ['+2.0 m/s', '+3.0 m/s', '+4.0 m/s', '+12.0 m/s'],
    correctOptionIndex: 1,
    explanation:
      'The secant slope is $v_{\\text{avg}} = \\frac{\\Delta x}{\\Delta t} = \\frac{14 - 2}{5 - 1} = \\frac{12}{4} = +3.0\\text{ m/s}$.',
  },
  {
    id: 'kin-q4',
    chapterId: 'kinematics',
    topicId: 'instantaneous-velocity',
    difficulty: 'Medium',
    type: 'numerical',
    prompt:
      'A particle moves along the $x$-axis according to $x(t) = 2t^3 - 6t + 4$ (with $x$ in meters and $t$ in seconds). Calculate its instantaneous velocity in m/s at $t = 2.0\\text{ s}$.',
    numericAnswer: 18,
    numericTolerance: 0.1,
    unit: 'm/s',
    explanation:
      'Differentiate position with respect to time: $v(t) = \\frac{dx}{dt} = 6t^2 - 6$. Substituting $t = 2.0\\text{ s}$ gives $v(2.0) = 6(4) - 6 = 18\\text{ m/s}$.',
  },
  {
    id: 'kin-q5',
    chapterId: 'kinematics',
    topicId: 'instantaneous-acceleration',
    difficulty: 'Medium',
    type: 'conceptual',
    prompt:
      'At a certain instant, a car has velocity $v = -18\\text{ m/s}$ and acceleration $a = +3.0\\text{ m/s}^2$. Which statement correctly describes the car at that moment?',
    options: [
      'Moving in the +x direction and speeding up',
      'Moving in the -x direction and speeding up',
      'Moving in the -x direction and slowing down',
      'Momentarily at rest',
    ],
    correctOptionIndex: 2,
    explanation:
      'Because $v < 0$, the car is moving in the $-x$ direction. Because $a > 0$ has the opposite sign ($v\\,a < 0$), the acceleration opposes the velocity and the car is slowing down.',
  },
  {
    id: 'kin-q6',
    chapterId: 'kinematics',
    topicId: 'constant-acceleration',
    difficulty: 'Medium',
    type: 'numerical',
    prompt:
      'A train moving at $v_0 = 20\\text{ m/s}$ brakes with constant acceleration $a = -2.5\\text{ m/s}^2$ until it comes to rest ($v = 0$). How many meters does it travel while braking?',
    numericAnswer: 80,
    numericTolerance: 0.5,
    unit: 'm',
    explanation:
      'Use the time-independent equation $v^2 = v_0^2 + 2a\\Delta x$: $0 = 20^2 + 2(-2.5)\\Delta x \\implies 5\\Delta x = 400 \\implies \\Delta x = 80\\text{ m}$.',
  },
  {
    id: 'kin-q7',
    chapterId: 'kinematics',
    topicId: 'area-under-vt-graph',
    difficulty: 'Easy',
    type: 'diagram',
    prompt:
      'The velocity–time graph below ramps linearly from $v(0) = 4\\text{ m/s}$ to $v(6\\text{ s}) = 16\\text{ m/s}$. Using the area under the $v$–$t$ graph (rectangle + triangle), find the displacement $\\Delta x$.',
    diagram: {
      kind: 'kinematics-vt-trapezoid',
      title: 'Linear v–t ramp from 4 m/s to 16 m/s over 6 s',
    },
    options: ['48 m', '60 m', '72 m', '96 m'],
    correctOptionIndex: 1,
    explanation:
      'Trapezoid area $= \\frac{v_1 + v_2}{2}\\Delta t = \\frac{4 + 16}{2}(6) = 10 \\times 6 = 60\\text{ m}$ (equivalently $4\\times 6 + \\frac{1}{2}(12)(6) = 24 + 36 = 60\\text{ m}$).',
  },
  {
    id: 'kin-q8',
    chapterId: 'kinematics',
    topicId: 'area-under-at-graph',
    difficulty: 'Medium',
    type: 'diagram',
    prompt:
      'An object starts with $v(0) = 5\\text{ m/s}$ and follows the piecewise $a$–$t$ profile shown: $+4\\text{ m/s}^2$ from $0$ to $3\\text{ s}$, then $-2\\text{ m/s}^2$ from $3$ to $5\\text{ s}$. What is its velocity $v(5\\text{ s})$?',
    diagram: {
      kind: 'kinematics-at-step',
      title: 'Piecewise a–t graph: +4 m/s² on [0, 3 s] and −2 m/s² on [3, 5 s]',
    },
    options: ['8 m/s', '13 m/s', '17 m/s', '21 m/s'],
    correctOptionIndex: 1,
    explanation:
      'The signed area under $a(t)$ gives $\\Delta v = (+4)(3) + (-2)(2) = 12 - 4 = +8\\text{ m/s}$. Adding initial velocity: $v(5) = 5 + 8 = 13\\text{ m/s}$.',
  },
  {
    id: 'kin-q9',
    chapterId: 'kinematics',
    topicId: 'change-velocity-indefinite-integral',
    difficulty: 'Medium',
    type: 'numerical',
    prompt:
      'A rocket sled accelerates at $a(t) = 3t^2 + 2$ ($\\text{m/s}^2$) starting from $v(0) = 5.0\\text{ m/s}$. What is its velocity in m/s at $t = 2.0\\text{ s}$?',
    numericAnswer: 17,
    numericTolerance: 0.1,
    unit: 'm/s',
    explanation:
      'Integrate $a(t)$: $v(t) = \\int (3t^2 + 2)\\,dt = t^3 + 2t + C$. Since $v(0) = 5$, $C = 5$. At $t = 2.0\\text{ s}$, $v(2.0) = 8 + 4 + 5 = 17\\text{ m/s}$.',
  },
  {
    id: 'kin-q10',
    chapterId: 'kinematics',
    topicId: 'area-as-indefinite-integral',
    difficulty: 'Hard',
    type: 'conceptual',
    prompt:
      'Let $F(t) = \\int_{t_0}^{t} a(u)\\,du$ be the accumulated area under an acceleration–time graph from $t_0$ to $t$. What does the instantaneous slope $dF/dt$ represent physically?',
      options: [
      'The particle’s position x(t)',
      'The particle’s instantaneous acceleration a(t)',
      'The average velocity over [t₀, t]',
      'The total distance traveled',
    ],
    correctOptionIndex: 1,
    explanation:
      'By the Fundamental Theorem of Calculus, differentiating the running area function $F(t)$ with respect to its upper limit $t$ returns the integrand $a(t)$.',
  },
  {
    id: 'kin-q11',
    chapterId: 'kinematics',
    topicId: 'definite-integral-acceleration',
    difficulty: 'Hard',
    type: 'numerical',
    prompt:
      'An object starts at $v(1\\text{ s}) = -2.0\\text{ m/s}$ and experiences time-varying acceleration $a(t) = 6t$ ($\\text{m/s}^2$). Using the definite integral $\\int_1^3 a(t)\\,dt$, compute $v(3\\text{ s})$ in m/s.',
    numericAnswer: 22,
    numericTolerance: 0.1,
    unit: 'm/s',
    explanation:
      '$\\Delta v = \\int_1^3 6t\\,dt = [3t^2]_1^3 = 27 - 3 = 24\\text{ m/s}$. Adding initial velocity: $v(3) = -2.0 + 24 = 22\\text{ m/s}$.',
  },
  {
    id: 'kin-q12',
    chapterId: 'kinematics',
    topicId: 'displacement-definite-integral-velocity',
    difficulty: 'Hard',
    type: 'multiple-choice',
    prompt:
      'A particle moves with velocity $v(t) = 6 - 2t$ ($\\text{m/s}$) over $0 \\le t \\le 6\\text{ s}$. Compare its net displacement $\\Delta x = \\int_0^6 v(t)\\,dt$ and total distance traveled $d = \\int_0^6 |v(t)|\\,dt$.',
    options: [
      'Δx = 0 m and d = 0 m',
      'Δx = 18 m and d = 18 m',
      'Δx = 0 m and d = 18 m',
      'Δx = 9 m and d = 18 m',
    ],
    correctOptionIndex: 2,
    explanation:
      'Velocity crosses zero at $t = 3\\text{ s}$. Over $[0,3]$, area is $+\\frac{1}{2}(6)(3) = +9\\text{ m}$; over $[3,6]$, area is $-\\frac{1}{2}(6)(3) = -9\\text{ m}$. Thus $\\Delta x = 9 - 9 = 0\\text{ m}$, while total distance is $d = 9 + 9 = 18\\text{ m}$.',
  },
];
