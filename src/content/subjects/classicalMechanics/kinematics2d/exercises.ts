import type { PracticeQuestion } from '../../../../types/physics';

export const KINEMATICS_2D_EXERCISES: PracticeQuestion[] = [
  {
    id: 'k2d-q1',
    chapterId: 'kinematics-2d',
    topicId: 'kin2d-intro',
    difficulty: 'Easy',
    type: 'conceptual',
    prompt:
      'A marble rolls off a horizontal tabletop at $4.0\\text{ m/s}$ at the exact instant a second marble is dropped straight down from the same height. Neglecting air resistance, which statement is true?',
    options: [
      'The dropped marble hits the floor first',
      'Both marbles hit the floor at the exact same instant',
      'The rolling marble stays airborne longer because it travels farther',
      'The rolling marble hits with smaller vertical velocity $v_y$',
    ],
    correctOptionIndex: 1,
    explanation:
      'Horizontal and vertical motions are independent: both marbles start with $v_{0y} = 0$ from the same height under $a_y = -g$, so they share identical vertical fall times.',
  },
  {
    id: 'k2d-q2',
    chapterId: 'kinematics-2d',
    topicId: 'position-2d',
    difficulty: 'Easy',
    type: 'numerical',
    prompt:
      'A particle has position vector $\\vec{r}(t) = (3t)\\hat{i} + (4t)\\hat{j}\\text{ m}$. What is its distance $|\\vec{r}|$ from the origin at $t = 2.0\\text{ s}$?',
    numericAnswer: 10,
    numericTolerance: 0.1,
    unit: 'm',
    explanation:
      'At $t = 2.0\\text{ s}$, $\\vec{r}(2) = (6.0\\hat{i} + 8.0\\hat{j})\\text{ m}$, so $|\\vec{r}(2)| = \\sqrt{6^2 + 8^2} = 10.0\\text{ m}$.',
  },
  {
    id: 'k2d-q3',
    chapterId: 'kinematics-2d',
    topicId: 'displacement-2d',
    difficulty: 'Easy',
    type: 'multiple-choice',
    prompt:
      'An unmanned glider moves from $\\vec{r}_1 = (5\\hat{i} - 2\\hat{j})\\text{ m}$ to $\\vec{r}_2 = (1\\hat{i} + 4\\hat{j})\\text{ m}$ in $2.0\\text{ s}$. What is its average velocity vector $\\vec{v}_{\\text{avg}}$?',
    options: [
      '$(-2\\hat{i} + 3\\hat{j})\\text{ m/s}$',
      '$(2\\hat{i} - 3\\hat{j})\\text{ m/s}$',
      '$(3\\hat{i} + 1\\hat{j})\\text{ m/s}$',
      '$(-4\\hat{i} + 6\\hat{j})\\text{ m/s}$',
    ],
    correctOptionIndex: 0,
    explanation:
      '$\\Delta\\vec{r} = \\vec{r}_2 - \\vec{r}_1 = (-4\\hat{i} + 6\\hat{j})\\text{ m}$. Dividing by $\\Delta t = 2.0\\text{ s}$ gives $\\vec{v}_{\\text{avg}} = (-2\\hat{i} + 3\\hat{j})\\text{ m/s}$.',
  },
  {
    id: 'k2d-q4',
    chapterId: 'kinematics-2d',
    topicId: 'inst-velocity-2d',
    difficulty: 'Medium',
    type: 'numerical',
    prompt:
      'A drone follows $\\vec{r}(t) = (5t)\\hat{i} + (12t - 3t^2)\\hat{j}\\text{ m}$. What is its instantaneous speed $|\\vec{v}|$ at $t = 2.0\\text{ s}$?',
    numericAnswer: 5,
    numericTolerance: 0.1,
    unit: 'm/s',
    explanation:
      '$v_x(t) = 5\\text{ m/s}$ and $v_y(t) = 12 - 6t$. At $t = 2.0\\text{ s}$, $v_y = 0$, so $|\\vec{v}| = \\sqrt{5^2 + 0^2} = 5.0\\text{ m/s}$.',
  },
  {
    id: 'k2d-q5',
    chapterId: 'kinematics-2d',
    topicId: 'acceleration-2d',
    difficulty: 'Medium',
    type: 'true-false',
    prompt:
      'True or False: If a particle’s instantaneous speed $|\\vec{v}|$ is constant along a curved path, its instantaneous acceleration vector $\\vec{a}(t)$ must be perpendicular to $\\vec{v}(t)$.',
    options: ['True', 'False'],
    correctOptionIndex: 0,
    explanation:
      'True. Constant speed implies $a_\\parallel = dv/dt = 0$, leaving only the perpendicular component $\\vec{a}_\\perp$ to bend the direction of motion.',
  },
  {
    id: 'k2d-q6',
    chapterId: 'kinematics-2d',
    topicId: 'projectile-equations',
    difficulty: 'Medium',
    type: 'diagram',
    prompt:
      'Inspect the projectile trajectory diagram launched at $v_0 = 20\\text{ m/s}$ and $\\theta_0 = 37^\\circ$ ($\\cos 37^\\circ = 0.80, \\sin 37^\\circ = 0.60$). What is the projectile’s speed at the highest point $H_{\\max}$?',
    diagram: {
      kind: 'kin2d-projectile-flight',
      title: 'Projectile launch at v0 = 20 m/s, angle 37 degrees',
    },
    options: ['0 m/s', '12.0 m/s', '16.0 m/s', '20.0 m/s'],
    correctOptionIndex: 2,
    explanation:
      'At the apex $v_y = 0$, so the remaining speed equals the constant horizontal component $v_x = v_0\\cos 37^\\circ = 20(0.80) = 16.0\\text{ m/s}$.',
  },
  {
    id: 'k2d-q7',
    chapterId: 'kinematics-2d',
    topicId: 'projectile-range-height',
    difficulty: 'Medium',
    type: 'numerical',
    prompt:
      'A cannon fires a shell over flat ground at $v_0 = 28\\text{ m/s}$ and $\\theta_0 = 45^\\circ$. Using $g = 9.8\\text{ m/s}^2$, calculate its maximum horizontal range $R$.',
    numericAnswer: 80,
    numericTolerance: 0.5,
    unit: 'm',
    explanation:
      '$R = \\frac{v_0^2\\sin(2\\theta_0)}{g} = \\frac{28^2 \\sin(90^\\circ)}{9.8} = \\frac{784}{9.8} = 80.0\\text{ m}$.',
  },
  {
    id: 'k2d-q8',
    chapterId: 'kinematics-2d',
    topicId: 'projectile-trajectory',
    difficulty: 'Hard',
    type: 'multiple-choice',
    prompt:
      'Two identical balls are launched from ground level at the same speed $v_0$: Ball 1 at $25^\\circ$ and Ball 2 at $65^\\circ$. Neglecting air drag, which statement is true?',
    options: [
      'Ball 1 lands farther away than Ball 2',
      'Ball 2 has a greater horizontal range than Ball 1',
      'Both balls reach the same horizontal range, while Ball 2 reaches a greater height',
      'Both balls reach the same maximum height',
    ],
    correctOptionIndex: 2,
    explanation:
      'Because $25^\\circ + 65^\\circ = 90^\\circ$, the launch angles are complementary and give equal range $R$. The steeper $65^\\circ$ launch has larger $v_{0y}$, giving greater height and flight time.',
  },
  {
    id: 'k2d-q9',
    chapterId: 'kinematics-2d',
    topicId: 'uniform-circular-motion',
    difficulty: 'Easy',
    type: 'numerical',
    prompt:
      'A bicycle wheel rotates so a reflector at radius $R = 0.50\\text{ m}$ moves at steady speed $v = 4.0\\text{ m/s}$. What is the magnitude of its centripetal acceleration $a_c$?',
    numericAnswer: 32,
    numericTolerance: 0.2,
    unit: 'm/s²',
    explanation:
      '$a_c = \\frac{v^2}{R} = \\frac{4.0^2}{0.50} = \\frac{16}{0.50} = 32.0\\text{ m/s}^2$.',
  },
  {
    id: 'k2d-q10',
    chapterId: 'kinematics-2d',
    topicId: 'nonuniform-circular-motion',
    difficulty: 'Hard',
    type: 'diagram',
    prompt:
      'A particle moves counterclockwise on a circle of radius $R = 4.0\\text{ m}$. At the instant shown, its speed is $v = 4.0\\text{ m/s}$ and it is speeding up tangentially at $a_t = 3.0\\text{ m/s}^2$. Find the magnitude of its total acceleration $|\\vec{a}|$.',
    diagram: {
      kind: 'kin2d-circular-accel',
      title: 'Non-uniform circular motion with ac = 4 m/s^2 and at = 3 m/s^2',
    },
    options: ['3.0 m/s²', '4.0 m/s²', '5.0 m/s²', '7.0 m/s²'],
    correctOptionIndex: 2,
    explanation:
      'The inward centripetal component is $a_c = v^2/R = 16/4 = 4.0\\text{ m/s}^2$. Since $\\vec{a}_c \\perp \\vec{a}_t$, $|\\vec{a}| = \\sqrt{4.0^2 + 3.0^2} = 5.0\\text{ m/s}^2$.',
  },
  {
    id: 'k2d-q11',
    chapterId: 'kinematics-2d',
    topicId: 'relative-velocity-2d',
    difficulty: 'Medium',
    type: 'diagram',
    prompt:
      'A boat with still-water speed $v_{BW} = 5.0\\text{ m/s}$ aims straight north across a $100\\text{ m}$ wide river whose current flows east at $v_{WG} = 3.0\\text{ m/s}$. How far downstream (east) does the boat drift upon reaching the far bank?',
    diagram: {
      kind: 'kin2d-river-boat',
      title: 'River crossing with W = 100 m, v_BW = 5 m/s north, v_WG = 3 m/s east',
    },
    options: ['20 m', '40 m', '60 m', '100 m'],
    correctOptionIndex: 2,
    explanation:
      'Crossing time is $t = W / v_{BW} = 100 / 5.0 = 20\\text{ s}$. Downstream drift is $\\Delta x = v_{WG} t = 3.0 \\times 20 = 60\\text{ m}$.',
  },
  {
    id: 'k2d-q12',
    chapterId: 'kinematics-2d',
    topicId: 'acceleration-2d',
    difficulty: 'Hard',
    type: 'numerical',
    prompt:
      'At a given instant a glider has velocity $\\vec{v} = (3.0\\hat{i} + 4.0\\hat{j})\\text{ m/s}$ and acceleration $\\vec{a} = (5.0\\hat{i} + 0\\hat{j})\\text{ m/s}^2$. Find the scalar parallel acceleration component $a_\\parallel = \\frac{\\vec{a}\\cdot\\vec{v}}{|\\vec{v}|}$.',
    numericAnswer: 3,
    numericTolerance: 0.1,
    unit: 'm/s²',
    explanation:
      'Speed is $|\\vec{v}| = \\sqrt{3^2 + 4^2} = 5.0\\text{ m/s}$ and $\\vec{a}\\cdot\\vec{v} = 5(3) + 0(4) = 15$, so $a_\\parallel = 15 / 5.0 = 3.0\\text{ m/s}^2$.',
  },
];
