import type { TopicItem } from '../../../../types/physics';

export const VECTORS_TOPICS: TopicItem[] = [
  {
    id: 'intro-to-vectors',
    chapterId: 'vectors',
    order: 1,
    title: 'Introduction to Vectors',
    shortDescription: 'Why physics requires quantities that carry both size and spatial orientation.',
    conceptIntro:
      'In physics, knowing how large a push, velocity, or displacement is tells only half the story. To predict where an object moves or how structures balance, we must specify direction alongside magnitude.',
    physicalInterpretation:
      'Imagine walking 5 meters from a doorway. Without knowing whether you walk north, east, or up a staircase, your final location is completely undetermined. Vectors encode both the "how much" and the "which way" in a single mathematical object.',
    mathematicalFormulation: {
      summary: 'A vector is denoted with a bold letter or an arrow above its symbol, distinguishing it from an ordinary number.',
      equations: [
        {
          label: 'Vector Notation',
          latex: '\\vec{A} = (A, \\theta)',
          context: 'A 2D vector specified by its magnitude $A = |\\vec{A}| \\ge 0$ and direction angle $\\theta$.',
        },
        {
          label: 'Equality of Vectors',
          latex: '\\vec{A} = \\vec{B} \\iff |\\vec{A}| = |\\vec{B}| \\text{ and } \\theta_A = \\theta_B',
          context: 'Two free vectors are equal if they share the exact same magnitude and direction, regardless of starting point.',
        },
      ],
    },
    visualExplanation: {
      description:
        'A vector appears as a directed line segment: its tail marks the starting point, its shaft length is proportional to magnitude, and its arrowhead specifies direction.',
      diagram: {
        kind: 'vector-arrow',
        caption: 'Vector A with magnitude 5.0 units directed at 37° above the +x axis.',
      },
    },
    workedExample: {
      title: 'Comparing Two Velocity Vectors',
      problem:
        'Car 1 travels at $20\\text{ m/s}$ due East. Car 2 travels at $20\\text{ m/s}$ due North. Are their speeds equal? Are their velocity vectors equal?',
      given: ['|\\vec{v}_1| = 20\\text{ m/s}, \\theta_1 = 0^\\circ', '|\\vec{v}_2| = 20\\text{ m/s}, \\theta_2 = 90^\\circ'],
      steps: [
        {
          explanation: 'Compare the magnitudes (speeds) of both cars.',
          math: '|\\vec{v}_1| = |\\vec{v}_2| = 20\\text{ m/s}',
        },
        {
          explanation: 'Compare their directions.',
          math: '\\theta_1 = 0^\\circ \\neq \\theta_2 = 90^\\circ',
        },
      ],
      answer: 'Their speeds are equal ($20\\text{ m/s}$), but their velocity vectors are not equal because they point in different directions.',
    },
    simulationId: 'representation',
    checkYourUnderstanding: {
      prompt: 'Which change makes two initially identical vectors unequal?',
      options: [
        'Translating one vector parallel to itself to a new starting point',
        'Rotating one vector by 45° while keeping its length fixed',
        'Measuring its length in centimeters instead of meters without changing the physical arrow',
        'Labeling one vector v and the other u while keeping length and direction identical',
      ],
      correctIndex: 1,
      explanation: 'Free vectors are unchanged by parallel translation, but rotating a vector changes its direction and therefore creates a different vector.',
    },
    keywords: ['vector', 'introduction', 'direction', 'magnitude', 'free vector'],
  },
  {
    id: 'scalars-and-vectors',
    chapterId: 'vectors',
    order: 2,
    title: 'Scalars and Vectors',
    shortDescription: 'Distinguishing purely numerical physical quantities from directional ones.',
    conceptIntro:
      'Physical quantities split into two fundamental families: scalars, completely described by a single number and unit, and vectors, which require both a magnitude and a direction in space.',
    physicalInterpretation:
      'Temperature in a room ($22^\\circ\\text{C}$) or mass ($4.5\\text{ kg}$) has no direction—adding two masses is ordinary arithmetic ($2\\text{ kg} + 3\\text{ kg} = 5\\text{ kg}$). Forces and displacements, however, can reinforce or cancel each other depending on their angle.',
    mathematicalFormulation: {
      summary: 'Scalars obey standard real-number algebra; vectors obey geometric and component-wise vector algebra.',
      equations: [
        {
          label: 'Scalar Combination',
          latex: 'm_{\\text{total}} = m_1 + m_2',
          context: 'Mass, time, energy, and temperature combine by ordinary addition.',
        },
        {
          label: 'Vector Magnitude Constraint',
          latex: '|\\vec{A} + \\vec{B}| \\le |\\vec{A}| + |\\vec{B}|',
          context: 'The triangle inequality shows two vectors combine to less than the sum of their lengths unless they point in the same direction.',
        },
      ],
    },
    visualExplanation: {
      description:
        'A scalar thermometer reading needs only a single number line. A displacement vector lives on a 2D or 3D coordinate plane with an explicit orientation.',
      diagram: {
        kind: 'scalar-vs-vector',
        caption: 'Distance (scalar) measures total path length; displacement (vector) connects start to finish in a straight directed line.',
      },
    },
    workedExample: {
      title: 'Distance vs. Displacement on a Track',
      problem:
        'A runner completes one full lap around a circular track of circumference $400\\text{ m}$ and stops at the starting line. Find the distance traveled and the net displacement.',
      given: ['\\text{Path length} = 400\\text{ m}', '\\text{Initial position} = \\text{Final position}'],
      steps: [
        {
          explanation: 'Distance is a scalar equal to the total length along the path.',
          math: 'd = 400\\text{ m}',
        },
        {
          explanation: 'Displacement is the straight-line vector from initial to final position.',
          math: '\\Delta\\vec{r} = \\vec{r}_f - \\vec{r}_i = \\vec{0}\\text{ m}',
        },
      ],
      answer: 'Distance = $400\\text{ m}$ (scalar); Displacement magnitude = $0\\text{ m}$ (zero vector).',
    },
    simulationId: 'displacement',
    checkYourUnderstanding: {
      prompt: 'Which of the following lists contains ONLY vector quantities?',
      options: [
        'Mass, speed, work, temperature',
        'Displacement, velocity, acceleration, force',
        'Force, energy, momentum, time',
        'Velocity, distance, torque, electric charge',
      ],
      correctIndex: 1,
      explanation: 'Displacement, velocity, acceleration, and force all possess both magnitude and spatial direction.',
    },
    keywords: ['scalar', 'vector', 'distance', 'displacement', 'speed', 'velocity'],
  },
  {
    id: 'graphical-representation',
    chapterId: 'vectors',
    order: 3,
    title: 'Graphical Representation of Vectors',
    shortDescription: 'Drawing scaled arrows in Cartesian planes and interpreting head, tail, and orientation.',
    conceptIntro:
      'Graphically, every vector is drawn as a straight arrow whose length is scaled to its magnitude and whose tip points along the vector direction.',
    physicalInterpretation:
      'Engineers and physicists sketch vector diagrams (such as free-body force diagrams) to inspect balance, relative sizes, and net direction before crunching a single equation.',
    mathematicalFormulation: {
      summary: 'Choosing a consistent scale factor links physical units (like Newtons or m/s) to geometric length on a coordinate grid.',
      equations: [
        {
          label: 'Scale Factor Relation',
          latex: 'L_{\\text{drawn}} = k \\cdot |\\vec{F}|',
          context: 'If $1\\text{ grid unit} = 10\\text{ N}$, then a $40\\text{ N}$ force is drawn 4 grid units long.',
        },
        {
          label: 'Polar Angle Convention',
          latex: '\\theta \\text{ measured counterclockwise from } +x\\text{-axis}',
          context: 'Standard mathematical angle convention places $0^\\circ$ along $+x$ and $90^\\circ$ along $+y$.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Placing the tail at the coordinate origin $(0,0)$ makes the tip coordinates directly equal to the vector components $(A_x, A_y)$.',
      diagram: {
        kind: 'graphical-scale',
        caption: 'Standard position places the vector tail at the origin with angle θ measured counterclockwise from +x.',
      },
    },
    workedExample: {
      title: 'Plotting a Force Vector to Scale',
      problem:
        'Using a scale where $1\\text{ unit} = 5\\text{ N}$, describe how to draw a force $\\vec{F}$ of $25\\text{ N}$ at $\\theta = 180^\\circ$.',
      given: ['|\\vec{F}| = 25\\text{ N}', '\\text{Scale } = 5\\text{ N/unit}', '\\theta = 180^\\circ'],
      steps: [
        {
          explanation: 'Divide the physical magnitude by the scale factor to find the arrow length.',
          math: 'L = \\frac{25\\text{ N}}{5\\text{ N/unit}} = 5\\text{ units}',
        },
        {
          explanation: 'Locate $\\theta = 180^\\circ$ counterclockwise from $+x$, which points along the negative $x$-axis.',
          math: '\\text{Tail at } (0,0), \\text{ Tip at } (-5, 0)',
        },
      ],
      answer: 'Draw an arrow 5 grid units long starting at $(0,0)$ and pointing left to $(-5,0)$.',
    },
    simulationId: 'representation',
    checkYourUnderstanding: {
      prompt: 'If a vector tail sits at the origin $(0,0)$ and its tip is at $(0, -6)$, what is its standard angle $\\theta$?',
      options: ['0°', '90°', '180°', '270°'],
      correctIndex: 3,
      explanation: 'Pointing straight down along the negative y-axis corresponds to 270° counterclockwise from the +x axis.',
    },
    keywords: ['graphical', 'representation', 'arrow', 'scale', 'origin', 'coordinates'],
  },
  {
    id: 'magnitude-and-direction',
    chapterId: 'vectors',
    order: 4,
    title: 'Magnitude and Direction',
    shortDescription: 'Converting between Cartesian coordinates $(A_x, A_y)$ and polar form $(A, \\theta)$.',
    conceptIntro:
      'A vector in a plane can be specified either by its horizontal and vertical extents $(A_x, A_y)$ or by its overall length $A$ and angle $\\theta$. Converting cleanly between these two descriptions is essential.',
    physicalInterpretation:
      'Suppose a drone flies $3\\text{ km}$ east and $4\\text{ km}$ north. Its onboard GPS tracks $(3, 4)\\text{ km}$, while its pilot needs the straight-line range ($5\\text{ km}$) and compass heading ($53.1^\\circ$ north of east).',
    mathematicalFormulation: {
      summary: 'The Pythagorean theorem gives the magnitude, and the inverse tangent gives the angle—always adjusted for the vector quadrant.',
      equations: [
        {
          label: 'Magnitude',
          latex: 'A = |\\vec{A}| = \\sqrt{A_x^2 + A_y^2}',
          context: 'Always non-negative regardless of the signs of $A_x$ and $A_y$.',
        },
        {
          label: 'Direction Angle',
          latex: '\\theta = \\operatorname{atan2}(A_y, A_x)',
          context: 'Using $\\operatorname{atan2}$ automatically handles all four quadrants, whereas $\\tan^{-1}(A_y/A_x)$ can be off by $180^\\circ$ when $A_x < 0$.',
        },
      ],
    },
    visualExplanation: {
      description:
        'The vector forms the hypotenuse of a right triangle whose legs are $A_x$ and $A_y$. When $A_x$ is negative, the vector points into Quadrant II or III.',
      diagram: {
        kind: 'magnitude-direction',
        caption: 'Right-triangle geometry linking Cartesian components (Ax, Ay) to polar magnitude A and angle θ.',
      },
    },
    workedExample: {
      title: 'Finding Magnitude and Quadrant-Corrected Angle',
      problem: 'Find the magnitude and standard angle of $\\vec{A} = (-4, 3)$.',
      given: ['A_x = -4', 'A_y = 3'],
      steps: [
        {
          explanation: 'Compute the magnitude using the Pythagorean theorem.',
          math: 'A = \\sqrt{(-4)^2 + 3^2} = \\sqrt{16 + 9} = 5',
        },
        {
          explanation: 'Find the reference angle and note that $A_x < 0, A_y > 0$ places $\\vec{A}$ in Quadrant II.',
          math: '\\theta_{\\text{ref}} = \\tan^{-1}\\left(\\frac{3}{4}\\right) \\approx 36.87^\\circ \\implies \\theta = 180^\\circ - 36.87^\\circ = 143.13^\\circ',
        },
      ],
      answer: 'Magnitude $A = 5.00$, direction $\\theta = 143.13^\\circ$.',
    },
    simulationId: 'representation',
    checkYourUnderstanding: {
      prompt: 'A vector has components $A_x = -5$ and $A_y = -5$. What is its standard angle $\\theta$?',
      options: ['45°', '135°', '225°', '315°'],
      correctIndex: 2,
      explanation: 'Both components are negative, placing the vector in Quadrant III: $180^\\circ + 45^\\circ = 225^\\circ$.',
    },
    keywords: ['magnitude', 'direction', 'angle', 'atan2', 'pythagorean', 'quadrant'],
  },
  {
    id: 'vector-addition',
    chapterId: 'vectors',
    order: 5,
    title: 'Vector Addition',
    shortDescription: 'Combining vectors geometrically via head-to-tail or parallelogram rules and algebraically by components.',
    conceptIntro:
      'When two or more forces or displacements act together, their combined effect is the resultant vector $\\vec{R} = \\vec{A} + \\vec{B}$. Vector addition accounts for both magnitude and direction.',
    physicalInterpretation:
      'If two tugboats pull a barge at different angles, the barge accelerates along the single resultant force $\\vec{R}$. Only when they pull in the exact same direction do the magnitudes simply add.',
    mathematicalFormulation: {
      summary: 'Component addition turns any geometric vector sum into exact independent sums along each coordinate axis.',
      equations: [
        {
          label: 'Component Sum',
          latex: 'R_x = A_x + B_x, \\qquad R_y = A_y + B_y',
          context: 'Add horizontal components together and vertical components together separately.',
        },
        {
          label: 'Resultant Magnitude & Angle',
          latex: 'R = \\sqrt{R_x^2 + R_y^2}, \\qquad \\theta_R = \\operatorname{atan2}(R_y, R_x)',
          context: 'Reconstructs the resultant vector from its summed components.',
        },
      ],
    },
    visualExplanation: {
      description:
        'In the head-to-tail method, place the tail of $\\vec{B}$ at the head of $\\vec{A}$; $\\vec{R}$ runs from the tail of $\\vec{A}$ to the head of $\\vec{B}$. In the parallelogram method, both tails start at the origin and $\\vec{R}$ is the main diagonal.',
      diagram: {
        kind: 'head-to-tail',
        caption: 'Head-to-tail triangle construction and equivalent parallelogram diagonal for R = A + B.',
      },
    },
    workedExample: {
      title: 'Adding Two Orthogonal-ish Vectors by Components',
      problem: 'Given $\\vec{A} = (4, 1)$ and $\\vec{B} = (2, 7)$, find $\\vec{R} = \\vec{A} + \\vec{B}$ and its magnitude.',
      given: ['A_x = 4, A_y = 1', 'B_x = 2, B_y = 7'],
      steps: [
        {
          explanation: 'Sum the $x$ and $y$ components independently.',
          math: 'R_x = 4 + 2 = 6, \\qquad R_y = 1 + 7 = 8',
        },
        {
          explanation: 'Calculate the resultant magnitude.',
          math: 'R = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = 10',
        },
      ],
      answer: '$\\vec{R} = (6, 8)$ with magnitude $R = 10.00$ and angle $\\theta_R = 53.13^\\circ$.',
    },
    simulationId: 'addition',
    checkYourUnderstanding: {
      prompt: 'If $|\\vec{A}| = 6$ and $|\\vec{B}| = 8$, what are the minimum and maximum possible magnitudes of $\\vec{A} + \\vec{B}$?',
      options: ['0 and 14', '2 and 14', '6 and 10', '2 and 10'],
      correctIndex: 1,
      explanation: 'When antiparallel ($180^\\circ$ apart), $|8 - 6| = 2$; when parallel ($0^\\circ$ apart), $6 + 8 = 14$.',
    },
    keywords: ['addition', 'resultant', 'head-to-tail', 'parallelogram', 'sum'],
  },
  {
    id: 'vector-subtraction',
    chapterId: 'vectors',
    order: 6,
    title: 'Vector Subtraction',
    shortDescription: 'Subtracting vectors by reversing the subtrahend and adding: $\\vec{A} - \\vec{B} = \\vec{A} + (-\\vec{B})$.',
    conceptIntro:
      'Vector subtraction measures the change or difference between two vector states. It is defined directly through vector addition by adding the negative (reversed) vector.',
    physicalInterpretation:
      'Average acceleration depends on $\\Delta \\vec{v} = \\vec{v}_f - \\vec{v}_i$. Even if a car maintains constant speed around a turn, $\\vec{v}_f - \\vec{v}_i$ is non-zero because the direction changed!',
    mathematicalFormulation: {
      summary: 'Negating a vector reverses its direction by $180^\\circ$ (negating every component).',
      equations: [
        {
          label: 'Negative Vector',
          latex: '-\\vec{B} = (-B_x, -B_y)',
          context: 'Same magnitude as $\\vec{B}$, opposite direction.',
        },
        {
          label: 'Difference Formula',
          latex: '\\vec{D} = \\vec{A} - \\vec{B} = \\vec{A} + (-\\vec{B}) = (A_x - B_x, A_y - B_y)',
          context: 'Component-wise subtraction yields the difference vector pointing from the tip of $\\vec{B}$ to the tip of $\\vec{A}$.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Flip $\\vec{B}$ by $180^\\circ$ to form $-\\vec{B}$, then apply head-to-tail addition with $\\vec{A}$. Equivalently, when $\\vec{A}$ and $\\vec{B}$ share a tail, $\\vec{A} - \\vec{B}$ connects the tip of $\\vec{B}$ to the tip of $\\vec{A}$.',
      diagram: {
        kind: 'subtraction',
        caption: 'Constructing A - B by reversing B into -B and adding head-to-tail to A.',
      },
    },
    workedExample: {
      title: 'Change in Velocity Around a Corner',
      problem: 'A cyclist moves east at $\\vec{v}_i = (6, 0)\\text{ m/s}$ and turns north to $\\vec{v}_f = (0, 8)\\text{ m/s}$. Find $\\Delta\\vec{v} = \\vec{v}_f - \\vec{v}_i$.',
      given: ['\\vec{v}_i = (6, 0)\\text{ m/s}', '\\vec{v}_f = (0, 8)\\text{ m/s}'],
      steps: [
        {
          explanation: 'Reverse $\\vec{v}_i$ to obtain $-\\vec{v}_i = (-6, 0)\\text{ m/s}$.',
          math: '\\Delta\\vec{v} = \\vec{v}_f + (-\\vec{v}_i)',
        },
        {
          explanation: 'Subtract components and find magnitude.',
          math: '\\Delta\\vec{v} = (0 - 6,\\, 8 - 0) = (-6, 8)\\text{ m/s}, \\quad |\\Delta\\vec{v}| = \\sqrt{(-6)^2 + 8^2} = 10\\text{ m/s}',
        },
      ],
      answer: '$\\Delta\\vec{v} = (-6, 8)\\text{ m/s}$ with magnitude $10\\text{ m/s}$ at $126.87^\\circ$ (northwest).',
    },
    simulationId: 'subtraction',
    checkYourUnderstanding: {
      prompt: 'When $\\vec{A}$ and $\\vec{B}$ are drawn from the same origin, which arrow represents $\\vec{A} - \\vec{B}$?',
      options: [
        'From the tip of A to the tip of B',
        'From the tip of B to the tip of A',
        'The long diagonal of the parallelogram',
        'A vector perpendicular to both A and B',
      ],
      correctIndex: 1,
      explanation: 'Since $\\vec{B} + (\\vec{A} - \\vec{B}) = \\vec{A}$, placing the tail of $\\vec{A} - \\vec{B}$ at the tip of $\\vec{B}$ reaches the tip of $\\vec{A}$.',
    },
    keywords: ['subtraction', 'negative vector', 'difference', 'change in velocity'],
  },
  {
    id: 'resolution-of-vectors',
    chapterId: 'vectors',
    order: 7,
    title: 'Resolution of Vectors',
    shortDescription: 'Splitting a single vector into perpendicular projections along chosen axes.',
    conceptIntro:
      'Vector resolution is the reverse of addition: we decompose a single vector $\\vec{A}$ into two perpendicular vectors along the $x$ and $y$ axes whose sum equals $\\vec{A}$.',
    physicalInterpretation:
      'When you pull a suitcase handle at an angle $\\theta$ above the floor, part of your pull moves the suitcase forward ($F\\cos\\theta$) and part lifts it slightly off the ground ($F\\sin\\theta$).',
    mathematicalFormulation: {
      summary: 'Trigonometry projects the hypotenuse $A$ onto the adjacent ($x$) and opposite ($y$) axes.',
      equations: [
        {
          label: 'Horizontal Projection',
          latex: 'A_x = A \\cos\\theta',
          context: 'Valid when $\\theta$ is measured counterclockwise from the $+x$ axis.',
        },
        {
          label: 'Vertical Projection',
          latex: 'A_y = A \\sin\\theta',
          context: 'Measures how strongly the vector points along the $y$ axis.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Dropping perpendicular dashed lines from the vector tip to the $x$ and $y$ axes reveals the shadow lengths $A_x$ and $A_y$ on each axis.',
      diagram: {
        kind: 'resolution',
        caption: 'Dropping perpendiculars from the tip of A projects out Ax = A cos(θ) and Ay = A sin(θ).',
      },
    },
    workedExample: {
      title: 'Resolving a Pull Force on a Sled',
      problem: 'A rope pulls a sled with $50\\text{ N}$ at $37^\\circ$ above horizontal ($\\cos 37^\\circ \\approx 0.80, \\sin 37^\\circ \\approx 0.60$). Find the horizontal and vertical force components.',
      given: ['F = 50\\text{ N}', '\\theta = 37^\\circ'],
      steps: [
        {
          explanation: 'Compute the horizontal component pulling the sled forward.',
          math: 'F_x = 50\\cos(37^\\circ) \\approx 50(0.80) = 40\\text{ N}',
        },
        {
          explanation: 'Compute the vertical component lifting upward.',
          math: 'F_y = 50\\sin(37^\\circ) \\approx 50(0.60) = 30\\text{ N}',
        },
      ],
      answer: '$F_x = 40\\text{ N}$ horizontal, $F_y = 30\\text{ N}$ vertical.',
    },
    simulationId: 'resolution',
    checkYourUnderstanding: {
      prompt: 'At what angle $\\theta$ in Quadrant I are the horizontal and vertical components $A_x$ and $A_y$ equal in magnitude?',
      options: ['30°', '45°', '60°', '90°'],
      correctIndex: 1,
      explanation: 'At $45^\\circ$, $\\cos(45^\\circ) = \\sin(45^\\circ) = \\sqrt{2}/2$, so $A_x = A_y$.',
    },
    keywords: ['resolution', 'projection', 'cosine', 'sine', 'trigonometry'],
  },
  {
    id: 'rectangular-components',
    chapterId: 'vectors',
    order: 8,
    title: 'Rectangular Components',
    shortDescription: 'Working with orthogonal components in 2D and rotated coordinate systems.',
    conceptIntro:
      'Rectangular components express a vector along mutually perpendicular ($90^\\circ$) axes. Because perpendicular directions are independent, motion or force along one axis never leaks into the other.',
    physicalInterpretation:
      'A projectile launched off a cliff moves horizontally at constant velocity while accelerating downward due to gravity—two completely independent 1D problems solved via rectangular components.',
    mathematicalFormulation: {
      summary: 'A vector equals the vector sum of its rectangular component vectors.',
      equations: [
        {
          label: 'Component Decomposition',
          latex: '\\vec{A} = \\vec{A}_x + \\vec{A}_y',
          context: 'Any 2D vector can be uniquely written as one horizontal vector plus one vertical vector.',
        },
        {
          label: 'Pythagorean Consistency',
          latex: 'A_x^2 + A_y^2 = (A\\cos\\theta)^2 + (A\\sin\\theta)^2 = A^2',
          context: 'Trigonometric identity $\\cos^2\\theta + \\sin^2\\theta = 1$ guarantees length is preserved.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Rectangular components form a closed rectangle with the vector as its diagonal. Rotating the coordinate axes changes $(A_x, A_y)$ values while leaving the vector itself unchanged.',
      diagram: {
        kind: 'components',
        caption: 'Rectangular box formed by orthogonal component vectors Ax and Ay.',
      },
    },
    workedExample: {
      title: 'Checking Component Reconstruction',
      problem: 'A displacement has components $\\Delta x = -9\\text{ m}$ and $\\Delta y = 12\\text{ m}$. Verify its magnitude and signs.',
      given: ['\\Delta x = -9\\text{ m}', '\\Delta y = +12\\text{ m}'],
      steps: [
        {
          explanation: 'Note the quadrant: negative $x$ and positive $y$ means Quadrant II.',
          math: '\\text{Direction: West and North}',
        },
        {
          explanation: 'Combine rectangular components quadratically.',
          math: '|\\Delta\\vec{r}| = \\sqrt{(-9)^2 + 12^2} = \\sqrt{81 + 144} = \\sqrt{225} = 15\\text{ m}',
        },
      ],
      answer: 'Magnitude is $15\\text{ m}$ pointing into Quadrant II ($126.87^\\circ$).',
    },
    simulationId: 'resolution',
    checkYourUnderstanding: {
      prompt: 'Why are rectangular ($90^\\circ$) components preferred over oblique axes in classical mechanics?',
      options: [
        'Because perpendicular components are mathematically independent of one another',
        'Because vectors can only exist at 90° angles in nature',
        'Because rectangular components always have positive signs',
        'Because magnitude becomes equal to Ax + Ay',
      ],
      correctIndex: 0,
      explanation: 'Orthogonality decouples the x, y, and z equations of motion so each axis can be solved independently.',
    },
    keywords: ['rectangular', 'components', 'orthogonal', 'axes', 'independence'],
  },
  {
    id: 'unit-vectors',
    chapterId: 'vectors',
    order: 9,
    title: 'Unit Vectors',
    shortDescription: 'Representing pure direction with dimensionless unit vectors $\\hat{i}, \\hat{j}, \\hat{k}$.',
    conceptIntro:
      'A unit vector has a magnitude of exactly $1$ and no physical units—its sole job is to specify direction. The standard Cartesian unit vectors $\\hat{i}$, $\\hat{j}$, and $\\hat{k}$ point along $+x$, $+y$, and $+z$.',
    physicalInterpretation:
      'Writing $\\vec{F} = (4\\hat{i} - 3\\hat{j})\\text{ N}$ separates scale from orientation: $4\\text{ N}$ along $+x$ combined with $3\\text{ N}$ along $-y$. Any vector $\\vec{A}$ divided by its magnitude $|\\vec{A}|$ yields its own unit direction vector $\\hat{u}_A$.',
    mathematicalFormulation: {
      summary: 'Unit vector notation turns geometric vector arrows into clean algebraic polynomials.',
      equations: [
        {
          label: '3D Unit Vector Expansion',
          latex: '\\vec{A} = A_x\\hat{i} + A_y\\hat{j} + A_z\\hat{k}',
          context: 'Standard basis expansion where $|\\hat{i}| = |\\hat{j}| = |\\hat{k}| = 1$.',
        },
        {
          label: 'Unit Direction Vector',
          latex: '\\hat{u}_A = \\frac{\\vec{A}}{|\\vec{A}|}',
          context: 'Produces a vector of length 1 pointing in the exact same direction as $\\vec{A}$.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Basis vectors $\\hat{i}, \\hat{j}, \\hat{k}$ form a mutually perpendicular right-handed triad at the origin. Scaling them by $A_x, A_y, A_z$ reaches any point in 3D space.',
      diagram: {
        kind: 'unit-vectors',
        caption: 'Right-handed orthonormal basis triad i, j, k scaling to construct vector A.',
      },
    },
    workedExample: {
      title: 'Finding a Unit Vector Along a Given Direction',
      problem: 'Find the unit vector $\\hat{u}$ in the direction of $\\vec{A} = 2\\hat{i} - 2\\hat{j} + 1\\hat{k}$.',
      given: ['A_x = 2, A_y = -2, A_z = 1'],
      steps: [
        {
          explanation: 'Compute the 3D magnitude of $\\vec{A}$.',
          math: '|\\vec{A}| = \\sqrt{2^2 + (-2)^2 + 1^2} = \\sqrt{4 + 4 + 1} = 3',
        },
        {
          explanation: 'Divide each component by $|\\vec{A}| = 3$.',
          math: '\\hat{u} = \\frac{2}{3}\\hat{i} - \\frac{2}{3}\\hat{j} + \\frac{1}{3}\\hat{k}',
        },
      ],
      answer: '$\\hat{u} = \\frac{2}{3}\\hat{i} - \\frac{2}{3}\\hat{j} + \\frac{1}{3}\\hat{k}$ (verify $|\\hat{u}| = 1$).',
    },
    simulationId: 'unit-vectors',
    checkYourUnderstanding: {
      prompt: 'What is the magnitude of the unit vector $\\hat{u} = 0.6\\hat{i} + 0.8\\hat{j}$?',
      options: ['0.7', '1.0', '1.4', '0.48'],
      correctIndex: 1,
      explanation: '$\\sqrt{0.6^2 + 0.8^2} = \\sqrt{0.36 + 0.64} = \\sqrt{1.00} = 1.0$.',
    },
    keywords: ['unit vector', 'i hat', 'j hat', 'k hat', 'basis', '3d'],
  },
  {
    id: 'position-and-displacement',
    chapterId: 'vectors',
    order: 10,
    title: 'Position and Displacement Vectors',
    shortDescription: 'Tracking an object’s coordinate location $\\vec{r}$ and net change in position $\\Delta\\vec{r}$.',
    conceptIntro:
      'A position vector $\\vec{r}$ points from the chosen coordinate origin to a particle’s location. When the particle moves from $\\vec{r}_1$ to $\\vec{r}_2$, its displacement vector is $\\Delta\\vec{r} = \\vec{r}_2 - \\vec{r}_1$.',
    physicalInterpretation:
      'While position vectors depend on where you place the origin $(0,0)$, the displacement vector $\\Delta\\vec{r}$ is completely independent of the origin—every observer agrees on how far and in which direction the object moved.',
    mathematicalFormulation: {
      summary: 'Displacement is always final position minus initial position.',
      equations: [
        {
          label: 'Position Vector',
          latex: '\\vec{r} = x\\hat{i} + y\\hat{j} + z\\hat{k}',
          context: 'Points from the origin $(0,0,0)$ to $(x,y,z)$.',
        },
        {
          label: 'Displacement Vector',
          latex: '\\Delta\\vec{r} = \\vec{r}_2 - \\vec{r}_1 = (x_2 - x_1)\\hat{i} + (y_2 - y_1)\\hat{j}',
          context: 'Connects the initial point directly to the final point.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Drawing $\\vec{r}_1$ and $\\vec{r}_2$ from the origin forms a triangle whose third side—pointing from the tip of $\\vec{r}_1$ to the tip of $\\vec{r}_2$—is $\\Delta\\vec{r}$.',
      diagram: {
        kind: 'displacement',
        caption: 'Triangle relation r1 + Δr = r2 showing Δr = r2 - r1 from initial to final position.',
      },
    },
    workedExample: {
      title: 'Drone Flight Between Two Waypoints',
      problem: 'A drone starts at $\\vec{r}_1 = (-2, 1)\\text{ m}$ and flies to $\\vec{r}_2 = (4, 9)\\text{ m}$. Find the displacement vector and distance covered in a straight line.',
      given: ['\\vec{r}_1 = (-2, 1)\\text{ m}', '\\vec{r}_2 = (4, 9)\\text{ m}'],
      steps: [
        {
          explanation: 'Subtract initial coordinates from final coordinates.',
          math: '\\Delta\\vec{r} = (4 - (-2))\\hat{i} + (9 - 1)\\hat{j} = 6\\hat{i} + 8\\hat{j}\\text{ m}',
        },
        {
          explanation: 'Calculate the displacement magnitude.',
          math: '|\\Delta\\vec{r}| = \\sqrt{6^2 + 8^2} = 10\\text{ m}',
        },
      ],
      answer: '$\\Delta\\vec{r} = (6\\hat{i} + 8\\hat{j})\\text{ m}$, magnitude $10\\text{ m}$ at $53.13^\\circ$.',
    },
    simulationId: 'displacement',
    checkYourUnderstanding: {
      prompt: 'An object moves from $(3, 4)$ to $(3, -2)$. What is its displacement vector $\\Delta\\vec{r}$?',
      options: ['6j', '-6j', '6i + 2j', '-6i'],
      correctIndex: 1,
      explanation: '$\\Delta\\vec{r} = (3 - 3)\\hat{i} + (-2 - 4)\\hat{j} = -6\\hat{j}$.',
    },
    keywords: ['position', 'displacement', 'origin', 'coordinates', 'delta r'],
  },
  {
    id: 'dot-product',
    chapterId: 'vectors',
    order: 11,
    title: 'Dot Product (Scalar Product)',
    shortDescription: 'Measuring how strongly two vectors align, with direct application to mechanical work.',
    conceptIntro:
      'The dot product takes two vectors and returns a single scalar number that measures how much one vector points in the direction of the other.',
    physicalInterpretation:
      'Mechanical work $W = \\vec{F} \\cdot \\vec{d} = Fd\\cos\\theta$ is a dot product! Pushing perpendicular to motion ($\\theta = 90^\\circ$) does zero work; pushing along motion ($\\theta = 0^\\circ$) does maximum positive work; pushing opposite to motion ($\\theta = 180^\\circ$) removes energy.',
    mathematicalFormulation: {
      summary: 'The dot product can be computed either from magnitudes and the enclosed angle or directly from components.',
      equations: [
        {
          label: 'Geometric Definition',
          latex: '\\vec{A} \\cdot \\vec{B} = |\\vec{A}||\\vec{B}|\\cos\\theta',
          context: 'Zero when vectors are perpendicular ($\\theta = 90^\\circ$); maximum when parallel.',
        },
        {
          label: 'Algebraic Component Form',
          latex: '\\vec{A} \\cdot \\vec{B} = A_x B_x + A_y B_y + A_z B_z',
          context: 'Allows computing the angle $\\theta$ between any two vectors without knowing $\\theta$ beforehand.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Geometrically, $\\vec{A} \\cdot \\vec{B}$ equals the length of $\\vec{B}$ multiplied by the shadow (projection) $A\\cos\\theta$ that $\\vec{A}$ casts onto $\\vec{B}$.',
      diagram: {
        kind: 'dot-product',
        caption: 'Scalar projection A cos(θ) of vector A onto vector B.',
      },
    },
    workedExample: {
      title: 'Testing Orthogonality & Computing Work',
      problem: 'A constant force $\\vec{F} = (5\\hat{i} + 2\\hat{j})\\text{ N}$ moves an object through displacement $\\vec{d} = (4\\hat{i} - 3\\hat{j})\\text{ m}$. Find the work done.',
      given: ['\\vec{F} = (5, 2)\\text{ N}', '\\vec{d} = (4, -3)\\text{ m}'],
      steps: [
        {
          explanation: 'Multiply corresponding components and sum.',
          math: 'W = \\vec{F} \\cdot \\vec{d} = (5)(4) + (2)(-3)',
        },
        {
          explanation: 'Simplify to obtain the scalar energy transfer in Joules.',
          math: 'W = 20 - 6 = 14\\text{ J}',
        },
      ],
      answer: 'The work done by the force is $14\\text{ J}$.',
    },
    simulationId: 'dot-product',
    checkYourUnderstanding: {
      prompt: 'If $\\vec{A} \\cdot \\vec{B} = 0$ and neither vector is zero, what is the angle between $\\vec{A}$ and $\\vec{B}$?',
      options: ['0° (parallel)', '45°', '90° (perpendicular)', '180° (antiparallel)'],
      correctIndex: 2,
      explanation: 'Since $|\\vec{A}| > 0$ and $|\\vec{B}| > 0$, $\\cos\\theta = 0 \\implies \\theta = 90^\\circ$.',
    },
    keywords: ['dot product', 'scalar product', 'work', 'angle', 'orthogonal', 'perpendicular'],
  },
  {
    id: 'cross-product',
    chapterId: 'vectors',
    order: 12,
    title: 'Cross Product (Vector Product)',
    shortDescription: 'Generating a perpendicular 3D vector whose magnitude equals the spanned parallelogram area.',
    conceptIntro:
      'Unlike the dot product, the cross product $\\vec{A} \\times \\vec{B}$ produces a new 3D vector that is strictly perpendicular to the plane containing both $\\vec{A}$ and $\\vec{B}$.',
    physicalInterpretation:
      'Torque ($\\vec{\\tau} = \\vec{r} \\times \\vec{F}$) and angular momentum ($\\vec{L} = \\vec{r} \\times \\vec{p}$) rely on the cross product. Pulling a wrench parallel to its handle ($\\theta = 0^\\circ$) produces zero twist; pulling at $90^\\circ$ maximizes torque.',
    mathematicalFormulation: {
      summary: 'Cross product magnitude scales with $\\sin\\theta$, and its direction obeys the right-hand rule (anti-commutative: $\\vec{B} \\times \\vec{A} = -(\\vec{A} \\times \\vec{B})$).',
      equations: [
        {
          label: 'Magnitude Formula',
          latex: '|\\vec{A} \\times \\vec{B}| = |\\vec{A}||\\vec{B}|\\sin\\theta',
          context: 'Numerically equal to the area of the parallelogram spanned by $\\vec{A}$ and $\\vec{B}$.',
        },
        {
          label: 'Determinant Expansion',
          latex: '\\vec{A} \\times \\vec{B} = (A_y B_z - A_z B_y)\\hat{i} + (A_z B_x - A_x B_z)\\hat{j} + (A_x B_y - A_y B_x)\\hat{k}',
          context: 'Exact 3D component formula satisfying $\\hat{i} \\times \\hat{j} = \\hat{k}$.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Curl the fingers of your right hand from $\\vec{A}$ toward $\\vec{B}$ through the smaller angle $\\theta$; your extended thumb points along $\\vec{A} \\times \\vec{B}$ perpendicular to the shaded parallelogram.',
      diagram: {
        kind: 'cross-product',
        caption: '3D right-hand rule: A × B rises perpendicular to the plane spanned by A and B.',
      },
    },
    workedExample: {
      title: 'Computing Torque as a 3D Cross Product',
      problem: 'A force $\\vec{F} = (0, 4, 0)\\text{ N}$ acts at position $\\vec{r} = (3, 0, 0)\\text{ m}$. Find $\\vec{\\tau} = \\vec{r} \\times \\vec{F}$.',
      given: ['\\vec{r} = 3\\hat{i}\\text{ m}', '\\vec{F} = 4\\hat{j}\\text{ N}'],
      steps: [
        {
          explanation: 'Apply the determinant components with $r_y = r_z = 0$ and $F_x = F_z = 0$.',
          math: '\\tau_x = 0, \\quad \\tau_y = 0, \\quad \\tau_z = r_x F_y - r_y F_x = (3)(4) - 0 = 12',
        },
        {
          explanation: 'Check direction using $\\hat{i} \\times \\hat{j} = \\hat{k}$.',
          math: '\\vec{\\tau} = 12\\hat{k}\\text{ N}\\cdot\\text{m}',
        },
      ],
      answer: '$\\vec{\\tau} = 12\\hat{k}\\text{ N}\\cdot\\text{m}$ (magnitude $12\\text{ N}\\cdot\\text{m}$ along $+z$).',
    },
    simulationId: 'cross-product',
    checkYourUnderstanding: {
      prompt: 'What is the value of $\\hat{j} \\times \\hat{i}$ in a standard right-handed coordinate system?',
      options: ['+k', '-k', '0', '+i'],
      correctIndex: 1,
      explanation: 'Because the cross product is anti-commutative and $\\hat{i} \\times \\hat{j} = +\\hat{k}$, reversing the order gives $\\hat{j} \\times \\hat{i} = -\\hat{k}$.',
    },
    keywords: ['cross product', 'vector product', 'right hand rule', 'torque', '3d', 'determinant'],
  },
  {
    id: 'applications-of-vectors',
    chapterId: 'vectors',
    order: 13,
    title: 'Applications of Vectors',
    shortDescription: 'Applying vector decomposition and addition to inclined planes, river crossings, and static equilibrium.',
    conceptIntro:
      'Vectors unify almost every problem in Classical Mechanics: balancing forces on bridges, computing river-boat drift, launching projectiles, and analyzing blocks sliding down inclined planes.',
    physicalInterpretation:
      'On an inclined ramp tilted by angle $\\theta$, rotating the coordinate axes so $+x$ points down the slope turns gravity $m\\vec{g}$ into $mg\\sin\\theta$ (sliding along the ramp) and $mg\\cos\\theta$ (pressing into the surface).',
    mathematicalFormulation: {
      summary: 'Newton’s Second Law is fundamentally a vector equation decomposed along independent axes.',
      equations: [
        {
          label: 'Static Equilibrium',
          latex: '\\sum \\vec{F} = \\vec{0} \\iff \\sum F_x = 0 \\text{ and } \\sum F_y = 0',
          context: 'An object remains at rest or moves at constant velocity when the vector sum of forces vanishes.',
        },
        {
          label: 'Relative Velocity',
          latex: '\\vec{v}_{\\text{ground}} = \\vec{v}_{\\text{boat/water}} + \\vec{v}_{\\text{water/ground}}',
          context: 'Vector addition directly predicts true path and speed across currents or crosswinds.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Resolving weight $m\\vec{g}$ parallel and perpendicular to an incline explains why steeper ramps accelerate objects faster while reducing normal force.',
      diagram: {
        kind: 'inclined-plane',
        caption: 'Weight vector mg resolved into parallel (mg sin θ) and perpendicular (mg cos θ) components on a ramp.',
      },
    },
    workedExample: {
      title: 'Airplane Flying in a Crosswind',
      problem: 'An aircraft flies due North at airspeed $v_p = 120\\text{ m/s}$ while a wind blows due East at $v_w = 50\\text{ m/s}$. Find the plane’s ground speed.',
      given: ['\\vec{v}_p = (0, 120)\\text{ m/s}', '\\vec{v}_w = (50, 0)\\text{ m/s}'],
      steps: [
        {
          explanation: 'Add the two orthogonal velocity vectors.',
          math: '\\vec{v}_{\\text{ground}} = \\vec{v}_p + \\vec{v}_w = (50, 120)\\text{ m/s}',
        },
        {
          explanation: 'Compute the magnitude of the resultant ground velocity.',
          math: '|\\vec{v}_{\\text{ground}}| = \\sqrt{50^2 + 120^2} = \\sqrt{2500 + 14400} = 130\\text{ m/s}',
        },
      ],
      answer: 'Ground speed is $130\\text{ m/s}$ directed $67.38^\\circ$ north of east.',
    },
    simulationId: 'addition',
    checkYourUnderstanding: {
      prompt: 'Three forces act on a hanging traffic light in static equilibrium. What must their vector sum equal?',
      options: [
        'The weight of the traffic light',
        'Twice the tension in one cable',
        'The zero vector 0',
        'A vector pointing straight down',
      ],
      correctIndex: 2,
      explanation: 'Static equilibrium means zero acceleration, so the net resultant vector force $\\sum \\vec{F}$ must equal $\\vec{0}$.',
    },
    keywords: ['applications', 'equilibrium', 'relative velocity', 'inclined plane', 'forces'],
  },
];
