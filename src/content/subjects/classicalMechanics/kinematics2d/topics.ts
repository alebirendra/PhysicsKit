import type { TopicItem } from '../../../../types/physics';

export const KINEMATICS_2D_TOPICS: TopicItem[] = [
  {
    id: 'kin2d-intro',
    chapterId: 'kinematics-2d',
    order: 1,
    sectionNumber: '3.1',
    title: 'Introduction to Two-Dimensional Motion',
    shortDescription:
      'Analyze motion in a plane by decomposing trajectories into two independent one-dimensional motions linked by a shared clock time $t$.',
    conceptIntro:
      'Real motion rarely stays confined to a single straight line—thrown baseballs arc across a field, planets sweep out curved orbits, and boats angle across flowing rivers. In two-dimensional kinematics, we describe curved motion in a plane by combining Chapter 1 vector algebra with Chapter 2 calculus along orthogonal $x$ and $y$ axes.',
    physicalInterpretation:
      'The central physical principle of 2D kinematics is the independence of perpendicular motions: what happens along the horizontal $x$-axis and what happens along the vertical $y$-axis obey separate 1D kinematic equations coupled only through the common parameter $t$. A marble rolled horizontally off a table and a marble dropped from rest at the exact same height reach the floor simultaneously.',
    mathematicalFormulation: {
      summary: 'A single 2D vector equation splits cleanly into two parallel scalar 1D equations:',
      equations: [
        {
          label: 'Vector Form (Constant Acceleration)',
          latex: '\\vec{r}(t) = \\vec{r}_0 + \\vec{v}_0 t + \\tfrac{1}{2}\\vec{a}t^2',
          context: 'Compact vector law valid in any dimension.',
        },
        {
          label: 'Independent Horizontal & Vertical Equations',
          latex: 'x(t) = x_0 + v_{0x}t + \\tfrac{1}{2}a_x t^2, \\qquad y(t) = y_0 + v_{0y}t + \\tfrac{1}{2}a_y t^2',
          context: 'Each coordinate evolves independently as its own 1D motion sharing the same time $t$.',
        },
      ],
    },
    visualExplanation: {
      description:
        'A curved path in the $xy$-plane projects simultaneously onto a horizontal shadow $x(t)$ and a vertical shadow $y(t)$.',
      diagram: {
        kind: 'kin2d-intro',
        caption: 'Curved 2D trajectory decomposed into simultaneous horizontal x(t) and vertical y(t) projections.',
      },
    },
    workedExample: {
      title: 'Two Orthogonal Accelerations from Rest',
      problem:
        'A robotic puck glides across a frictionless air table starting from the origin at rest. Thrusters apply constant acceleration $a_x = 2.0\\text{ m/s}^2$ and $a_y = 1.5\\text{ m/s}^2$. Find its coordinates $(x, y)$ at $t = 4.0\\text{ s}$.',
      given: ['x_0 = 0', 'y_0 = 0', 'v_{0x} = 0', 'v_{0y} = 0', 'a_x = 2.0\\text{ m/s}^2', 'a_y = 1.5\\text{ m/s}^2'],
      steps: [
        {
          explanation: 'Evaluate the horizontal $x$-motion independently at $t = 4.0\\text{ s}$:',
          math: 'x(4.0) = \\tfrac{1}{2}(2.0)(4.0)^2 = 16.0\\text{ m}',
        },
        {
          explanation: 'Evaluate the vertical $y$-motion independently at $t = 4.0\\text{ s}$:',
          math: 'y(4.0) = \\tfrac{1}{2}(1.5)(4.0)^2 = 12.0\\text{ m}',
        },
      ],
      answer: '$(16.0\\text{ m},\\, 12.0\\text{ m})$, distance $r = \\sqrt{16^2 + 12^2} = 20.0\\text{ m}$ from the origin.',
    },
    simulationId: 'kinematics2d-vectors',
    checkYourUnderstanding: {
      prompt: 'Ball A is dropped straight down from a cliff while Ball B is launched horizontally at $15\\text{ m/s}$ from the same height. Ignoring air drag, which hits the flat ground below first?',
      options: [
        'Ball A hits first because it travels a shorter path',
        'Ball B hits first because it has greater total speed',
        'Both hit the ground at the exact same time',
        'Ball B stays aloft twice as long',
      ],
      correctIndex: 2,
      explanation: 'Both start with $v_{0y} = 0$ and share the same vertical acceleration $a_y = -g$, so their vertical motions $y(t)$ are identical.',
    },
    keywords: ['3.1', 'two dimensional', 'independence of motion', 'orthogonal axes', 'trajectory'],
  },
  {
    id: 'position-2d',
    chapterId: 'kinematics-2d',
    order: 2,
    sectionNumber: '3.2.1',
    title: 'Position Vector in Two Dimensions',
    shortDescription:
      'Locate an object in a plane at instant $t$ using the origin-anchored vector $\\vec{r}(t) = x(t)\\hat{i} + y(t)\\hat{j}$.',
    conceptIntro:
      'In 1D kinematics a single signed number $x(t)$ suffices to specify location. In a 2D plane we must give two coordinates $(x(t), y(t))$ simultaneously, which we package into a single position vector $\\vec{r}(t)$ drawn from the chosen coordinate origin $O$ to the particle.',
    physicalInterpretation:
      'As time advances, the tip of $\\vec{r}(t)$ traces out the particle’s geometric trajectory curve in space. Changing where you place the origin shifts $\\vec{r}(t)$ itself, so position vectors are always measured relative to an explicit reference origin.',
    mathematicalFormulation: {
      summary: 'Express $\\vec{r}(t)$ in unit-vector form or compute its radial distance from the origin:',
      equations: [
        {
          label: 'Position Vector',
          latex: '\\vec{r}(t) = x(t)\\hat{i} + y(t)\\hat{j}',
          context: 'Combines time-varying horizontal coordinate $x(t)$ and vertical coordinate $y(t)$.',
        },
        {
          label: 'Distance & Polar Angle from Origin',
          latex: 'r(t) = |\\vec{r}(t)| = \\sqrt{x(t)^2 + y(t)^2}, \\qquad \\theta(t) = \\operatorname{atan2}(y(t), x(t))',
          context: 'Gives the straight-line distance from origin $O$ and directional angle.',
        },
      ],
    },
    visualExplanation: {
      description:
        'At instant $t$, $\\vec{r}(t)$ points from $(0,0)$ to $(x(t), y(t))$ on the curved trajectory.',
      diagram: {
        kind: 'position-2d',
        caption: 'Position vector r(t) = x(t)i + y(t)j pointing from origin O to the particle on its path.',
      },
    },
    workedExample: {
      title: 'Position Vector at Two Clock Readings',
      problem:
        'A drone’s position in meters is $\\vec{r}(t) = (3t)\\hat{i} + (8 - 2t^2)\\hat{j}$. Find $\\vec{r}(2\\text{ s})$ and its straight-line distance from the launchpad origin.',
      given: ['x(t) = 3t', 'y(t) = 8 - 2t^2', 't = 2.0\\text{ s}'],
      steps: [
        {
          explanation: 'Substitute $t = 2.0\\text{ s}$ into $x(t)$ and $y(t)$:',
          math: 'x(2) = 3(2) = 6.0\\text{ m}, \\qquad y(2) = 8 - 2(4) = 0\\text{ m}',
        },
        {
          explanation: 'Write $\\vec{r}(2)$ and compute its magnitude:',
          math: '\\vec{r}(2) = 6.0\\hat{i}\\text{ m}, \\qquad |\\vec{r}(2)| = \\sqrt{6.0^2 + 0^2} = 6.0\\text{ m}',
        },
      ],
      answer: '$\\vec{r}(2\\text{ s}) = 6.0\\hat{i}\\text{ m}$, at distance $6.0\\text{ m}$ east of the origin.',
    },
    simulationId: 'kinematics2d-vectors',
    checkYourUnderstanding: {
      prompt: 'A particle follows $\\vec{r}(t) = (4\\cos t)\\hat{i} + (4\\sin t)\\hat{j}\\text{ m}$. How does the magnitude $|\\vec{r}(t)|$ change with time?',
      options: [
        'It grows linearly with $t$',
        'It oscillates between $0$ and $4\\text{ m}$',
        'It remains constant at $4\\text{ m}$ for all $t$',
        'It equals $4\\sqrt{2}\\text{ m}$',
      ],
      correctIndex: 2,
      explanation: '$|\\vec{r}(t)| = \\sqrt{16\\cos^2 t + 16\\sin^2 t} = \\sqrt{16} = 4\\text{ m}$ constantly—the particle moves on a circle of radius $4\\text{ m}$.',
    },
    keywords: ['3.2.1', 'position vector', 'r(t)', 'unit vector', 'trajectory'],
  },
  {
    id: 'displacement-2d',
    chapterId: 'kinematics-2d',
    order: 3,
    sectionNumber: '3.2.2',
    title: 'Displacement Vector in Two Dimensions',
    shortDescription:
      'Measure the straight-line change in position $\\Delta\\vec{r} = \\vec{r}(t_2) - \\vec{r}(t_1)$ between two instants.',
    conceptIntro:
      'When an object moves along a curve from point $P_1$ at time $t_1$ to point $P_2$ at time $t_2$, its net change in position is the 2D displacement vector $\\Delta\\vec{r} = \\vec{r}_2 - \\vec{r}_1$.',
    physicalInterpretation:
      'Geometrically, $\\Delta\\vec{r}$ is the straight chord arrow pointing directly from the earlier point $P_1$ to the later point $P_2$. Just like in 1D, displacement depends only on the endpoints and is invariant under shifting the coordinate origin—yet its magnitude $|\\Delta\\vec{r}|$ is always less than or equal to the curved arc length traveled.',
    mathematicalFormulation: {
      summary: 'Subtract corresponding $x$ and $y$ coordinates between $t_1$ and $t_2$:',
      equations: [
        {
          label: '2D Displacement Vector',
          latex: '\\Delta\\vec{r} = \\vec{r}(t_2) - \\vec{r}(t_1) = \\Delta x\\,\\hat{i} + \\Delta y\\,\\hat{j}',
          context: 'Where $\\Delta x = x_2 - x_1$ and $\\Delta y = y_2 - y_1$.',
        },
        {
          label: 'Magnitude & Direction',
          latex: '|\\Delta\\vec{r}| = \\sqrt{(\\Delta x)^2 + (\\Delta y)^2}, \\qquad \\theta_{\\Delta r} = \\operatorname{atan2}(\\Delta y, \\Delta x)',
          context: 'Straight-line chord distance and heading from $P_1$ to $P_2$.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Position vectors $\\vec{r}_1$ and $\\vec{r}_2$ radiate from the origin, while $\\Delta\\vec{r}$ bridges the chord from $P_1$ to $P_2$.',
      diagram: {
        kind: 'displacement-2d',
        caption: 'Displacement Δr = r₂ − r₁ connects P₁ to P₂ as a chord across the curved trajectory.',
      },
    },
    workedExample: {
      title: 'Chord Displacement Across a Curve',
      problem:
        'A surveyor tracks a rover moving from $\\vec{r}_1 = (2.0\\hat{i} + 5.0\\hat{j})\\text{ m}$ at $t_1 = 1\\text{ s}$ to $\\vec{r}_2 = (10.0\\hat{i} - 1.0\\hat{j})\\text{ m}$ at $t_2 = 5\\text{ s}$. Find $\\Delta\\vec{r}$ and $|\\Delta\\vec{r}|$.',
      given: ['\\vec{r}_1 = (2.0, 5.0)\\text{ m}', '\\vec{r}_2 = (10.0, -1.0)\\text{ m}'],
      steps: [
        {
          explanation: 'Subtract initial coordinates from final coordinates:',
          math: '\\Delta\\vec{r} = (10.0 - 2.0)\\hat{i} + (-1.0 - 5.0)\\hat{j} = 8.0\\hat{i} - 6.0\\hat{j}\\text{ m}',
        },
        {
          explanation: 'Compute the magnitude of $\\Delta\\vec{r}$:',
          math: '|\\Delta\\vec{r}| = \\sqrt{8.0^2 + (-6.0)^2} = \\sqrt{64 + 36} = 10.0\\text{ m}',
        },
      ],
      answer: '$\\Delta\\vec{r} = (8.0\\hat{i} - 6.0\\hat{j})\\text{ m}$, with straight-line magnitude $10.0\\text{ m}$.',
    },
    simulationId: 'kinematics2d-vectors',
    checkYourUnderstanding: {
      prompt: 'A runner completes exactly one full lap around a $400\\text{ m}$ circular track. What is the magnitude of her displacement $|\\Delta\\vec{r}|$?',
      options: ['$400\\text{ m}$', '$200\\text{ m}$', '$0\\text{ m}$', '$127.3\\text{ m}$'],
      correctIndex: 2,
      explanation: 'She returns to her exact starting coordinates ($\\vec{r}_2 = \\vec{r}_1$), so $\\Delta\\vec{r} = \\vec{0}$ even though distance traveled is $400\\text{ m}$.',
    },
    keywords: ['3.2.2', 'displacement vector', 'delta r', 'chord', 'change in position'],
  },
  {
    id: 'avg-velocity-2d',
    chapterId: 'kinematics-2d',
    order: 4,
    sectionNumber: '3.3.1',
    title: 'Average Velocity Vector',
    shortDescription:
      'Compute average velocity $\\vec{v}_{\\text{avg}} = \\Delta\\vec{r}/\\Delta t$, always pointing along the displacement chord.',
    conceptIntro:
      'Dividing the 2D displacement vector $\\Delta\\vec{r}$ by the positive scalar time interval $\\Delta t = t_2 - t_1$ produces the average velocity vector $\\vec{v}_{\\text{avg}}$.',
    physicalInterpretation:
      'Because $\\Delta t > 0$ is a positive scalar, $\\vec{v}_{\\text{avg}}$ always has the exact same direction as $\\Delta\\vec{r}$—it points straight along the secant chord joining the particle’s start and end points during $[t_1, t_2]$, regardless of how sharply the trajectory curved in between.',
    mathematicalFormulation: {
      summary: 'Scale $\\Delta\\vec{r}$ by $1/\\Delta t$ component-by-component:',
      equations: [
        {
          label: 'Average Velocity Vector',
          latex: '\\vec{v}_{\\text{avg}} = \\frac{\\Delta\\vec{r}}{\\Delta t} = \\frac{\\Delta x}{\\Delta t}\\hat{i} + \\frac{\\Delta y}{\\Delta t}\\hat{j} = v_{\\text{avg},x}\\hat{i} + v_{\\text{avg},y}\\hat{j}',
          context: 'Each component equals the 1D average velocity along that axis.',
        },
      ],
    },
    visualExplanation: {
      description:
        'The average velocity vector lies parallel to the secant chord $\\Delta\\vec{r}$ between $\\vec{r}(t_1)$ and $\\vec{r}(t_2)$.',
      diagram: {
        kind: 'avg-velocity-2d',
        caption: 'Average velocity v_avg shares the direction of the displacement chord Δr across Δt.',
      },
    },
    workedExample: {
      title: 'Average Velocity Over a 4-Second Interval',
      problem:
        'Using the rover displacement $\\Delta\\vec{r} = (8.0\\hat{i} - 6.0\\hat{j})\\text{ m}$ between $t_1 = 1\\text{ s}$ and $t_2 = 5\\text{ s}$, find $\\vec{v}_{\\text{avg}}$ and its speed.',
      given: ['\\Delta\\vec{r} = (8.0\\hat{i} - 6.0\\hat{j})\\text{ m}', '\\Delta t = 5 - 1 = 4.0\\text{ s}'],
      steps: [
        {
          explanation: 'Divide each displacement component by $\\Delta t = 4.0\\text{ s}$:',
          math: '\\vec{v}_{\\text{avg}} = \\frac{8.0}{4.0}\\hat{i} + \\frac{-6.0}{4.0}\\hat{j} = (2.0\\hat{i} - 1.5\\hat{j})\\text{ m/s}',
        },
        {
          explanation: 'Find the magnitude of $\\vec{v}_{\\text{avg}}$:',
          math: '|\\vec{v}_{\\text{avg}}| = \\sqrt{2.0^2 + (-1.5)^2} = 2.5\\text{ m/s}',
        },
      ],
      answer: '$\\vec{v}_{\\text{avg}} = (2.0\\hat{i} - 1.5\\hat{j})\\text{ m/s}$ (magnitude $2.5\\text{ m/s}$).',
    },
    simulationId: 'kinematics2d-vectors',
    checkYourUnderstanding: {
      prompt: 'How does the direction of $\\vec{v}_{\\text{avg}}$ over $[t_1, t_2]$ compare to the direction of $\\Delta\\vec{r}$ over the same interval?',
      options: [
        'It is perpendicular to $\\Delta\\vec{r}$',
        'It always has the exact same direction as $\\Delta\\vec{r}$',
        'It is always tangent to the path at $t_1$',
        'It points toward the origin',
      ],
      correctIndex: 1,
      explanation: 'Since $\\Delta t > 0$, dividing a vector by a positive scalar scales its length without changing its direction.',
    },
    keywords: ['3.3.1', 'average velocity', 'chord', 'delta r over delta t'],
  },
  {
    id: 'inst-velocity-2d',
    chapterId: 'kinematics-2d',
    order: 5,
    sectionNumber: '3.3.2',
    title: 'Instantaneous Velocity Vector',
    shortDescription:
      'Take the limit $\\Delta t \\to 0$ to obtain $\\vec{v}(t) = d\\vec{r}/dt$, always tangent to the trajectory in the direction of motion.',
    conceptIntro:
      'Shrinking the time interval $\\Delta t$ around instant $t$ pulls the endpoint $P_2$ back along the curve toward $P_1$. The secant chord rotates until it aligns with the geometric tangent to the path, defining the instantaneous velocity vector $\\vec{v}(t)$.',
    physicalInterpretation:
      'Two key facts govern $\\vec{v}(t)$: (1) its direction is always strictly tangent to the trajectory and points forward along the motion, and (2) its magnitude $v = |\\vec{v}| = \\sqrt{v_x^2 + v_y^2}$ is the instantaneous speed measured along the curve.',
    mathematicalFormulation: {
      summary: 'Differentiate each coordinate of $\\vec{r}(t)$ with respect to time:',
      equations: [
        {
          label: 'Instantaneous Velocity Derivative',
          latex: '\\vec{v}(t) = \\lim_{\\Delta t \\to 0}\\frac{\\Delta\\vec{r}}{\\Delta t} = \\frac{d\\vec{r}}{dt} = \\frac{dx}{dt}\\hat{i} + \\frac{dy}{dt}\\hat{j} = v_x\\hat{i} + v_y\\hat{j}',
          context: 'Vector time derivative computed component-by-component.',
        },
        {
          label: 'Instantaneous Speed & Path Slope',
          latex: 'v(t) = |\\vec{v}(t)| = \\sqrt{v_x^2 + v_y^2}, \\qquad \\tan\\phi = \\frac{v_y}{v_x} = \\frac{dy}{dx}',
          context: 'Angle $\\phi$ of the velocity arrow matches the geometric tangent slope $dy/dx$ of the curve.',
        },
      ],
    },
    visualExplanation: {
      description:
        'As $\\Delta t \\to 0$, secant chords converge onto the tangent arrow $\\vec{v}(t)$ at the particle’s position.',
      diagram: {
        kind: 'inst-velocity-2d',
        caption: 'Instantaneous velocity v(t) = dr/dt is always tangent to the curved path.',
      },
    },
    workedExample: {
      title: 'Tangent Velocity from a Parametric Trajectory',
      problem:
        'A particle’s position is $\\vec{r}(t) = (4t)\\hat{i} + (6t - t^2)\\hat{j}\\text{ m}$. Find $\\vec{v}(t)$, its speed at $t = 1\\text{ s}$, and its heading angle.',
      given: ['x(t) = 4t', 'y(t) = 6t - t^2', 't = 1.0\\text{ s}'],
      steps: [
        {
          explanation: 'Differentiate $x(t)$ and $y(t)$ with respect to $t$:',
          math: 'v_x(t) = 4, \\qquad v_y(t) = 6 - 2t \\implies \\vec{v}(t) = 4\\hat{i} + (6 - 2t)\\hat{j}\\text{ m/s}',
        },
        {
          explanation: 'Evaluate at $t = 1.0\\text{ s}$:',
          math: '\\vec{v}(1) = 4\\hat{i} + 4\\hat{j}\\text{ m/s}, \\qquad v(1) = \\sqrt{4^2 + 4^2} = 4\\sqrt{2} \\approx 5.66\\text{ m/s}',
        },
        {
          explanation: 'Find the tangent direction angle:',
          math: '\\phi = \\operatorname{atan2}(4, 4) = 45^\\circ',
        },
      ],
      answer: '$\\vec{v}(1) = (4\\hat{i} + 4\\hat{j})\\text{ m/s}$, speed $5.66\\text{ m/s}$ at $45^\\circ$ above $+x$.',
    },
    simulationId: 'kinematics2d-vectors',
    checkYourUnderstanding: {
      prompt: 'Can a particle move along a curved path while maintaining a constant velocity vector $\\vec{v}$?',
      options: [
        'Yes, if its speed stays constant',
        'No, because curving changes the direction of $\\vec{v}$ even if speed is constant',
        'Yes, whenever $v_x$ is constant',
        'Only if acceleration is tangent to the path',
      ],
      correctIndex: 1,
      explanation: 'Velocity is a vector with both magnitude and direction. Bending along a curve rotates the tangent direction of $\\vec{v}$, so $\\vec{v}$ cannot be constant.',
    },
    keywords: ['3.3.2', 'instantaneous velocity', 'tangent', 'speed', 'dr/dt'],
  },
  {
    id: 'acceleration-2d',
    chapterId: 'kinematics-2d',
    order: 6,
    sectionNumber: '3.4.1',
    title: 'Average & Instantaneous Acceleration Vectors',
    shortDescription:
      'Decompose $\\vec{a}(t) = d\\vec{v}/dt$ into parallel ($\\vec{a}_\\parallel$) and perpendicular ($\\vec{a}_\\perp$) parts that change speed vs. bend direction.',
    conceptIntro:
      'In 1D, acceleration could only speed an object up or slow it down. In 2D, velocity can change in magnitude, in direction, or in both simultaneously. Thus $\\vec{a}_{\\text{avg}} = \\Delta\\vec{v}/\\Delta t$ and $\\vec{a}(t) = d\\vec{v}/dt$ generally point at an angle to $\\vec{v}(t)$, leaning toward the concave (inside) side of the curve.',
    physicalInterpretation:
      'Splitting $\\vec{a}$ into a component $\\vec{a}_\\parallel$ tangent to $\\vec{v}$ and a normal component $\\vec{a}_\\perp$ perpendicular to $\\vec{v}$ gives complete geometric clarity: $\\vec{a}_\\parallel$ changes only the object’s speed (increasing it when aligned with $\\vec{v}$, decreasing it when opposite), whereas $\\vec{a}_\\perp$ bends the trajectory without changing speed.',
    mathematicalFormulation: {
      summary: 'Compute $\\vec{a}(t)$ in Cartesian components or decompose it along and across $\\vec{v}$:',
      equations: [
        {
          label: 'Average & Instantaneous Acceleration',
          latex: '\\vec{a}_{\\text{avg}} = \\frac{\\vec{v}_2 - \\vec{v}_1}{\\Delta t}, \\qquad \\vec{a}(t) = \\frac{d\\vec{v}}{dt} = \\frac{dv_x}{dt}\\hat{i} + \\frac{dv_y}{dt}\\hat{j}',
          context: 'Rate of change of the velocity vector.',
        },
        {
          label: 'Parallel & Perpendicular Decomposition',
          latex: '\\vec{a} = \\vec{a}_\\parallel + \\vec{a}_\\perp, \\qquad a_\\parallel = \\frac{\\vec{a}\\cdot\\vec{v}}{|\\vec{v}|} = \\frac{dv}{dt}, \\qquad a_\\perp = \\sqrt{|\\vec{a}|^2 - a_\\parallel^2} = \\frac{v^2}{R_{\\text{curv}}}',
          context: '$a_\\parallel$ changes speed $v$; $a_\\perp$ turns the direction of $\\vec{v}$ toward the inside of the turn.',
        },
      ],
    },
    visualExplanation: {
      description:
        'At any point on a curve, $\\vec{a}$ splits into orthogonal vectors $\\vec{a}_\\parallel$ (along the tangent) and $\\vec{a}_\\perp$ (pointing toward the curve’s concave interior).',
      diagram: {
        kind: 'acceleration-2d-decomp',
        caption: 'Total acceleration a decomposes into speed-changing a_|| and path-curving a_⊥.',
      },
    },
    workedExample: {
      title: 'Speed-Changing vs. Turning Acceleration',
      problem:
        'At a certain instant a car has velocity $\\vec{v} = (6.0\\hat{i} + 8.0\\hat{j})\\text{ m/s}$ and acceleration $\\vec{a} = (2.0\\hat{i} - 5.0\\hat{j})\\text{ m/s}^2$. Find $a_\\parallel$ and $a_\\perp$, and determine if the car is speeding up or slowing down.',
      given: ['\\vec{v} = (6.0, 8.0)\\text{ m/s}', '\\vec{a} = (2.0, -5.0)\\text{ m/s}^2'],
      steps: [
        {
          explanation: 'Compute speed $|\\vec{v}|$ and dot product $\\vec{a}\\cdot\\vec{v}$:',
          math: '|\\vec{v}| = \\sqrt{6^2 + 8^2} = 10.0\\text{ m/s}, \\qquad \\vec{a}\\cdot\\vec{v} = (2)(6) + (-5)(8) = -28\\text{ m}^2/\\text{s}^3',
        },
        {
          explanation: 'Find signed parallel acceleration $a_\\parallel = (\\vec{a}\\cdot\\vec{v})/|\\vec{v}|$:',
          math: 'a_\\parallel = \\frac{-28}{10.0} = -2.80\\text{ m/s}^2',
        },
        {
          explanation: 'Find perpendicular component $a_\\perp$ from Pythagoras:',
          math: '|\\vec{a}| = \\sqrt{2^2 + (-5)^2} = \\sqrt{29}, \\qquad a_\\perp = \\sqrt{29 - (-2.8)^2} = \\sqrt{21.16} = 4.60\\text{ m/s}^2',
        },
      ],
      answer: '$a_\\parallel = -2.80\\text{ m/s}^2$ (slowing down) and $a_\\perp = 4.60\\text{ m/s}^2$ (curving clockwise).',
    },
    simulationId: 'kinematics2d-vectors',
    checkYourUnderstanding: {
      prompt: 'If a particle curves along a path while maintaining constant speed, what must be true about $\\vec{a}$ and $\\vec{v}$?',
      options: [
        '$\\vec{a} = \\vec{0}$',
        '$\\vec{a}$ is parallel to $\\vec{v}$',
        '$\\vec{a}$ is strictly perpendicular to $\\vec{v}$ ($\\vec{a}\\cdot\\vec{v} = 0$)',
        '$\\vec{a}$ points outward away from the curve center',
      ],
      correctIndex: 2,
      explanation: 'Constant speed means $dv/dt = a_\\parallel = 0$, so all of $\\vec{a}$ must lie in $\\vec{a}_\\perp$, perpendicular to $\\vec{v}$ and toward the inside of the turn.',
    },
    keywords: ['3.4.1', 'acceleration vector', 'parallel', 'perpendicular', 'tangential', 'normal'],
  },
  {
    id: 'projectile-equations',
    chapterId: 'kinematics-2d',
    order: 7,
    sectionNumber: '3.5.1',
    title: 'Projectile Motion: Equations & Independence of Axes',
    shortDescription:
      'Model ideal free-flight motion under gravity with $a_x = 0$ (constant $v_x$) and $a_y = -g$ (uniform vertical acceleration).',
    conceptIntro:
      'An ideal projectile is any object launched into the air and acted upon solely by uniform downward gravity (neglecting air resistance). Choosing $+x$ horizontally and $+y$ vertically upward makes $a_x = 0$ and $a_y = -g \\approx -9.8\\text{ m/s}^2$.',
    physicalInterpretation:
      'Because $a_x = 0$, the horizontal velocity component $v_x(t) = v_0\\cos\\theta_0$ never changes throughout the entire flight! Meanwhile, $v_y(t)$ decreases linearly at $9.8\\text{ m/s}$ every second, momentarily reaching $v_y = 0$ at the apex—where the projectile is still moving horizontally with speed $v_0\\cos\\theta_0$.',
    mathematicalFormulation: {
      summary: 'Resolve initial velocity $\\vec{v}_0$ into components and apply constant-acceleration kinematics separately to $x$ and $y$:',
      equations: [
        {
          label: 'Initial Velocity Components',
          latex: 'v_{0x} = v_0\\cos\\theta_0, \\qquad v_{0y} = v_0\\sin\\theta_0',
          context: 'Launch speed $v_0$ at elevation angle $\\theta_0$ above the horizontal.',
        },
        {
          label: 'Horizontal & Vertical Motion Equations',
          latex: 'x(t) = x_0 + (v_0\\cos\\theta_0)t, \\qquad v_x(t) = v_0\\cos\\theta_0',
          context: 'Zero horizontal acceleration keeps $v_x$ constant.',
        },
        {
          label: 'Vertical Free-Fall Equations',
          latex: 'y(t) = y_0 + (v_0\\sin\\theta_0)t - \\tfrac{1}{2}gt^2, \\qquad v_y(t) = v_0\\sin\\theta_0 - gt',
          context: 'Uniform downward gravitational acceleration $a_y = -g$.',
        },
      ],
    },
    visualExplanation: {
      description:
        'At successive equal time steps, horizontal spacing stays uniform ($v_x = \\text{const}$) while $v_y$ shrinks to zero at the apex and turns negative during descent.',
      diagram: {
        kind: 'projectile-axes',
        caption: 'Horizontal velocity vx remains constant while vertical velocity vy reverses under gravity.',
      },
    },
    workedExample: {
      title: 'Velocity at the Peak and 3 Seconds After Launch',
      problem:
        'A soccer ball is kicked from ground level ($x_0 = 0, y_0 = 0$) at $v_0 = 25\\text{ m/s}$ and $\\theta_0 = 37^\\circ$ ($\\cos 37^\\circ \\approx 0.80, \\sin 37^\\circ \\approx 0.60$). Using $g = 9.8\\text{ m/s}^2$, find its position and velocity at $t = 2.0\\text{ s}$.',
      given: ['v_0 = 25\\text{ m/s}', '\\theta_0 = 37^\\circ', 'g = 9.8\\text{ m/s}^2', 't = 2.0\\text{ s}'],
      steps: [
        {
          explanation: 'Compute initial velocity components:',
          math: 'v_{0x} = 25(0.80) = 20.0\\text{ m/s}, \\qquad v_{0y} = 25(0.60) = 15.0\\text{ m/s}',
        },
        {
          explanation: 'Find $(x, y)$ at $t = 2.0\\text{ s}$:',
          math: 'x(2) = 20.0(2.0) = 40.0\\text{ m}, \\qquad y(2) = 15.0(2.0) - 4.9(4.0) = 10.4\\text{ m}',
        },
        {
          explanation: 'Find $(v_x, v_y)$ at $t = 2.0\\text{ s}$:',
          math: 'v_x(2) = 20.0\\text{ m/s}, \\qquad v_y(2) = 15.0 - 9.8(2.0) = -4.6\\text{ m/s}',
        },
      ],
      answer: 'At $t = 2.0\\text{ s}$ the ball is at $(40.0\\text{ m},\\, 10.4\\text{ m})$ descending with $\\vec{v} = (20.0\\hat{i} - 4.6\\hat{j})\\text{ m/s}$.',
    },
    simulationId: 'kinematics2d-projectile',
    checkYourUnderstanding: {
      prompt: 'At the highest point (apex) of an angled projectile launch ($0^\\circ < \\theta_0 < 90^\\circ$), what are its velocity and acceleration?',
      options: [
        'Both velocity and acceleration are zero',
        '$v_y = 0$, $v_x = v_0\\cos\\theta_0$, and $a_y = -g$',
        '$v_x = 0$, $v_y = v_0\\sin\\theta_0$, and $a_y = 0$',
        'Acceleration reverses upward',
      ],
      correctIndex: 1,
      explanation: 'At the apex only the vertical velocity vanishes ($v_y = 0$). Horizontal speed $v_x = v_0\\cos\\theta_0$ and downward gravity $a_y = -g$ never turn off.',
    },
    keywords: ['3.5.1', 'projectile motion', 'gravity', 'vx constant', 'launch angle'],
  },
  {
    id: 'projectile-trajectory',
    chapterId: 'kinematics-2d',
    order: 8,
    sectionNumber: '3.5.2',
    title: 'Parabolic Trajectory Equation',
    shortDescription:
      'Eliminate time $t$ between $x(t)$ and $y(t)$ to prove that ideal projectile paths form an exact downward parabola $y(x)$.',
    conceptIntro:
      'Instead of asking where the projectile is at time $t$, we often want the geometric shape of its flight path $y$ as a direct function of horizontal distance $x$—for instance, to check whether a ball clears a wall at distance $x = D$.',
    physicalInterpretation:
      'Because $x = v_{0x} t$ is linear in $t$, solving for $t = x / (v_0\\cos\\theta_0)$ and substituting into $y(t)$ yields a quadratic function of $x$ with a negative $x^2$ coefficient. Every ideal projectile with $v_{0x} \\neq 0$ traces a symmetric downward parabola.',
    mathematicalFormulation: {
      summary: 'Substitute $t = (x - x_0)/(v_0\\cos\\theta_0)$ into the vertical equation:',
      equations: [
        {
          label: 'Trajectory Equation y(x)',
          latex: 'y(x) = y_0 + (\\tan\\theta_0)\\,x - \\frac{g}{2v_0^2\\cos^2\\theta_0}\\,x^2',
          context: 'Starting from $x_0 = 0$; exact quadratic parabola in $x$.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Eliminating $t$ reveals height $y(x)$ directly above any horizontal position $x$, letting us test obstacle clearance.',
      diagram: {
        kind: 'projectile-parabola',
        caption: 'Parabolic trajectory y(x) checks height directly at a target distance x.',
      },
    },
    workedExample: {
      title: 'Clearing a Stadium Wall',
      problem:
        'A baseball leaves a bat at height $y_0 = 1.0\\text{ m}$ with $v_0 = 30\\text{ m/s}$ at $\\theta_0 = 45^\\circ$. Does it clear a $4.0\\text{ m}$ outfield wall located $80\\text{ m}$ away? (Use $g = 9.8\\text{ m/s}^2$.)',
      given: ['y_0 = 1.0\\text{ m}', 'v_0 = 30\\text{ m/s}', '\\theta_0 = 45^\\circ', 'x = 80\\text{ m}'],
      steps: [
        {
          explanation: 'Insert $\\tan 45^\\circ = 1$ and $\\cos^2 45^\\circ = 0.5$ into the trajectory equation:',
          math: 'y(80) = 1.0 + 80(1) - \\frac{9.8 (80)^2}{2(30)^2 (0.5)}',
        },
        {
          explanation: 'Evaluate the quadratic term:',
          math: 'y(80) = 81.0 - \\frac{62720}{900} \\approx 81.0 - 69.69 = 11.31\\text{ m}',
        },
      ],
      answer: 'Yes—at $x = 80\\text{ m}$ the ball is at height $y = 11.3\\text{ m}$, easily clearing the $4.0\\text{ m}$ wall by $7.3\\text{ m}$.',
    },
    simulationId: 'kinematics2d-projectile',
    checkYourUnderstanding: {
      prompt: 'If you double the launch speed $v_0$ while keeping $\\theta_0$ and $y_0 = 0$ fixed, how does the quadratic drop term $\\frac{g x^2}{2v_0^2\\cos^2\\theta_0}$ change at a given $x$?',
      options: [
        'It doubles',
        'It halves',
        'It becomes one-fourth as large',
        'It stays the same',
      ],
      correctIndex: 2,
      explanation: 'Because $v_0^2$ sits in the denominator, doubling $v_0$ divides the downward parabolic curvature term by $2^2 = 4$.',
    },
    keywords: ['3.5.2', 'parabolic trajectory', 'y(x)', 'eliminate time', 'projectile path'],
  },
  {
    id: 'projectile-range-height',
    chapterId: 'kinematics-2d',
    order: 9,
    sectionNumber: '3.5.3',
    title: 'Time of Flight, Maximum Height & Horizontal Range',
    shortDescription:
      'Derive $t_{\\text{flight}}$, apex height $H_{\\max}$, and horizontal range $R = \\frac{v_0^2\\sin(2\\theta_0)}{g}$, including complementary angles.',
    conceptIntro:
      'Three landmark values summarize any projectile launch over level ground ($y = y_0$ at landing): how long it stays airborne ($t_{\\text{flight}}$), how high it rises ($H_{\\max}$), and how far horizontally it lands ($R$).',
    physicalInterpretation:
      'For level-ground launches, $\\sin(2\\theta_0)$ reaches its maximum of $1$ at $\\theta_0 = 45^\\circ$, maximizing range $R$. Moreover, because $\\sin(2(90^\\circ - \\theta_0)) = \\sin(180^\\circ - 2\\theta_0) = \\sin(2\\theta_0)$, complementary launch angles like $30^\\circ$ and $60^\\circ$ land at the exact same horizontal range $R$, with the steeper angle soaring higher and staying aloft longer.',
    mathematicalFormulation: {
      summary: 'For level ground ($y_{\\text{land}} = y_0$), set $v_y = 0$ for apex and $y(t) = y_0$ for landing:',
      equations: [
        {
          label: 'Time of Flight & Maximum Height (Level Ground)',
          latex: 't_{\\text{flight}} = \\frac{2v_0\\sin\\theta_0}{g}, \\qquad H_{\\max} = \\frac{v_0^2\\sin^2\\theta_0}{2g}',
          context: 'Total flight time is twice the rise time $t_{\\text{apex}} = v_0\\sin\\theta_0 / g$.',
        },
        {
          label: 'Horizontal Range Formula (Level Ground)',
          latex: 'R = v_{0x} t_{\\text{flight}} = \\frac{v_0^2\\sin(2\\theta_0)}{g}',
          context: 'Valid when landing height equals launch height ($y_{\\text{land}} = y_0$). For $y_0 > 0$, solve the quadratic $y_0 + v_{0y}t - \\frac{1}{2}gt^2 = 0$ directly.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Complementary angles $\\theta_0$ and $90^\\circ - \\theta_0$ share the same range $R$, while $\\theta_0 = 45^\\circ$ maximizes $R$ on level ground.',
      diagram: {
        kind: 'projectile-range-height',
        caption: 'Complementary launch angles (30° and 60°) reach the same range R; 45° achieves maximum range.',
      },
    },
    workedExample: {
      title: 'Range & Peak Height of Complementary Launches',
      problem:
        'A water cannon fires at $v_0 = 20\\text{ m/s}$ over level ground ($g = 9.8\\text{ m/s}^2$). Compare the maximum height $H_{\\max}$, flight time, and range $R$ for $\\theta_0 = 30^\\circ$ and $\\theta_0 = 60^\\circ$.',
      given: ['v_0 = 20\\text{ m/s}', 'g = 9.8\\text{ m/s}^2', '\\theta_1 = 30^\\circ', '\\theta_2 = 60^\\circ'],
      steps: [
        {
          explanation: 'Compute range $R$ for $\\theta_1 = 30^\\circ$ (since $\\sin 60^\\circ = \\sin 120^\\circ \\approx 0.8660$, both give the same $R$):',
          math: 'R = \\frac{20^2 \\sin(60^\\circ)}{9.8} = \\frac{400(0.8660)}{9.8} \\approx 35.35\\text{ m}',
        },
        {
          explanation: 'Compute flight times and peak heights separately:',
          math: 't_{30} = \\frac{2(20)\\sin 30^\\circ}{9.8} = 2.04\\text{ s}, \\quad H_{30} = \\frac{400(0.25)}{19.6} = 5.10\\text{ m}',
        },
        {
          explanation: 'Now evaluate $\\theta_2 = 60^\\circ$:',
          math: 't_{60} = \\frac{2(20)\\sin 60^\\circ}{9.8} = 3.53\\text{ s}, \\quad H_{60} = \\frac{400(0.75)}{19.6} = 15.31\\text{ m}',
        },
      ],
      answer: 'Both land at $R = 35.35\\text{ m}$, but $60^\\circ$ rises three times higher ($15.31\\text{ m}$ vs. $5.10\\text{ m}$) and stays airborne $1.73\\times$ longer.',
    },
    simulationId: 'kinematics2d-projectile',
    checkYourUnderstanding: {
      prompt: 'When launching off a $15\\text{ m}$ high cliff ($y_0 = 15\\text{ m}$) onto flat ground below, is $\\theta_0 = 45^\\circ$ still the angle that maximizes horizontal range?',
      options: [
        'Yes, $45^\\circ$ always maximizes range regardless of cliff height',
        'No, the optimal angle is less than $45^\\circ$ because extra vertical drop adds flight time',
        'No, the optimal angle is $90^\\circ$',
        'Yes, as long as $v_0 > 10\\text{ m/s}$',
      ],
      correctIndex: 1,
      explanation: 'From an elevated cliff, launching slightly flatter ($< 45^\\circ$) gives a larger $v_{0x}$ while still exploiting the cliff drop for flight time.',
    },
    keywords: ['3.5.3', 'range', 'max height', 'time of flight', 'complementary angles', '45 degrees'],
  },
  {
    id: 'uniform-circular-motion',
    chapterId: 'kinematics-2d',
    order: 10,
    sectionNumber: '3.6.1',
    title: 'Uniform Circular Motion & Centripetal Acceleration',
    shortDescription:
      'Even at constant speed $v$, turning around a circle of radius $R$ requires an inward centripetal acceleration $a_c = v^2/R$.',
    conceptIntro:
      'An object traveling along a circle of radius $R$ at strictly constant speed $v$ undergoes uniform circular motion. Because the velocity arrow continuously rotates to stay tangent to the circle, its velocity vector is constantly changing—meaning the object is always accelerating!',
    physicalInterpretation:
      'Since speed never changes ($a_\\parallel = 0$), the acceleration vector is purely perpendicular to $\\vec{v}$ and points straight inward toward the center of the circle—hence the name centripetal (“center-seeking”) acceleration. Faster speed or tighter radius curves the velocity vector more rapidly, increasing $a_c = v^2/R$.',
    mathematicalFormulation: {
      summary: 'Link centripetal acceleration $a_c$ to speed $v$, radius $R$, and orbital period $T$:',
      equations: [
        {
          label: 'Centripetal Acceleration',
          latex: 'a_c = \\frac{v^2}{R} = \\omega^2 R, \\qquad \\vec{a}_c = -\\frac{v^2}{R}\\hat{r}',
          context: 'Points radially inward toward the circle center at every instant.',
        },
        {
          label: 'Orbital Period & Speed',
          latex: 'T = \\frac{2\\pi R}{v}, \\qquad a_c = \\frac{4\\pi^2 R}{T^2}',
          context: 'Period $T$ is the time for one complete $2\\pi R$ revolution.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Velocity $\\vec{v}$ stays tangent to the circle while centripetal acceleration $\\vec{a}_c$ always points straight toward the center.',
      diagram: {
        kind: 'circular-uniform',
        caption: 'Uniform circular motion: tangent velocity v perpendicular to inward centripetal acceleration a_c.',
      },
    },
    workedExample: {
      title: 'Centripetal Acceleration on a Highway Curve',
      problem:
        'A car rounds a flat circular curve of radius $R = 80\\text{ m}$ at a steady speed of $v = 20\\text{ m/s}$. Find its centripetal acceleration $a_c$ and the time $T$ it would take to complete one full loop.',
      given: ['R = 80\\text{ m}', 'v = 20\\text{ m/s}'],
      steps: [
        {
          explanation: 'Compute centripetal acceleration $a_c = v^2 / R$:',
          math: 'a_c = \\frac{20^2}{80} = \\frac{400}{80} = 5.0\\text{ m/s}^2',
        },
        {
          explanation: 'Compute full-circle period $T = 2\\pi R / v$:',
          math: 'T = \\frac{2\\pi(80)}{20} = 8\\pi \\approx 25.13\\text{ s}',
        },
      ],
      answer: '$a_c = 5.0\\text{ m/s}^2$ directed radially inward; full-circle period $T = 25.1\\text{ s}$.',
    },
    simulationId: 'kinematics2d-circular',
    checkYourUnderstanding: {
      prompt: 'If a satellite orbits at the same speed $v$ in a circle of half the radius ($R/2$), what happens to its centripetal acceleration $a_c$?',
      options: [
        'It halves',
        'It doubles',
        'It quadruples',
        'It stays unchanged',
      ],
      correctIndex: 1,
      explanation: 'Since $a_c = v^2 / R$, halving $R$ at fixed $v$ doubles the centripetal acceleration.',
    },
    keywords: ['3.6.1', 'uniform circular motion', 'centripetal acceleration', 'v^2/R', 'period'],
  },
  {
    id: 'nonuniform-circular-motion',
    chapterId: 'kinematics-2d',
    order: 11,
    sectionNumber: '3.6.2',
    title: 'Non-Uniform Circular Motion',
    shortDescription:
      'When speed changes along a circular track, total acceleration combines radial $a_c = v^2/R$ and tangential $a_t = dv/dt$ orthogonally.',
    conceptIntro:
      'A roller-coaster car speeding up down a vertical loop or a cyclist braking into a circular turn changes both the direction and the magnitude of $\\vec{v}$. This is non-uniform circular motion.',
    physicalInterpretation:
      'At every instant, total acceleration $\\vec{a}$ splits into two perpendicular vectors: the radial centripetal vector $\\vec{a}_c$ (size $v^2/R$, inward toward center, responsible for curving) and the tangential vector $\\vec{a}_t$ (size $|dv/dt|$, tangent to the circle, responsible for changing speed). Consequently, $\\vec{a}$ tilts forward of the radius when speeding up and backward when slowing down.',
    mathematicalFormulation: {
      summary: 'Combine orthogonal radial and tangential accelerations via the Pythagorean theorem:',
      equations: [
        {
          label: 'Total Acceleration Vector & Magnitude',
          latex: '\\vec{a} = \\vec{a}_c + \\vec{a}_t, \\qquad |\\vec{a}| = \\sqrt{a_c^2 + a_t^2} = \\sqrt{\\left(\\frac{v^2}{R}\\right)^2 + \\left(\\frac{dv}{dt}\\right)^2}',
          context: 'Because $\\vec{a}_c \\perp \\vec{a}_t$, their magnitudes add in quadrature.',
        },
        {
          label: 'Tilt Angle Inside the Radius',
          latex: '\\tan\\beta = \\frac{|a_t|}{a_c}',
          context: 'Angle $\\beta$ between the total acceleration vector $\\vec{a}$ and the inward radial line.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Total acceleration $\\vec{a}$ is the vector diagonal of inward $\\vec{a}_c$ and tangent $\\vec{a}_t$.',
      diagram: {
        kind: 'circular-nonuniform',
        caption: 'Non-uniform circular motion: a = a_c + a_t tilts ahead of the radius when speeding up.',
      },
    },
    workedExample: {
      title: 'Speeding Up Around a Circular Track',
      problem:
        'A test car starts on a $R = 50\\text{ m}$ circular skidpad and reaches speed $v = 15\\text{ m/s}$ while accelerating forward tangentially at $a_t = 3.0\\text{ m/s}^2$. Find the magnitude of its net acceleration $|\\vec{a}|$.',
      given: ['R = 50\\text{ m}', 'v = 15\\text{ m/s}', 'a_t = 3.0\\text{ m/s}^2'],
      steps: [
        {
          explanation: 'Compute the instantaneous centripetal component $a_c = v^2/R$:',
          math: 'a_c = \\frac{15^2}{50} = \\frac{225}{50} = 4.50\\text{ m/s}^2',
        },
        {
          explanation: 'Combine orthogonal components $a_c$ and $a_t$:',
          math: '|\\vec{a}| = \\sqrt{4.50^2 + 3.0^2} = \\sqrt{20.25 + 9.0} = \\sqrt{29.25} \\approx 5.41\\text{ m/s}^2',
        },
      ],
      answer: 'Net acceleration magnitude is $5.41\\text{ m/s}^2$, tilted $\\arctan(3.0/4.5) = 33.7^\\circ$ forward of the inward radius.',
    },
    simulationId: 'kinematics2d-circular',
    checkYourUnderstanding: {
      prompt: 'A car travels around a circular track while pressing the brakes so its speed decreases ($a_t < 0$). Which way does its net acceleration vector $\\vec{a}$ point?',
      options: [
        'Strictly outward away from the center',
        'Strictly backward along the tangent',
        'Inward toward the circle interior and angled backward opposite $\\vec{v}$',
        'Inward and angled forward along $\\vec{v}$',
      ],
      correctIndex: 2,
      explanation: 'Inward $\\vec{a}_c$ pulls it around the curve while backward $\\vec{a}_t$ reduces its speed, so $\\vec{a} = \\vec{a}_c + \\vec{a}_t$ points inward and backward.',
    },
    keywords: ['3.6.2', 'non-uniform circular motion', 'tangential acceleration', 'radial', 'net acceleration'],
  },
  {
    id: 'relative-velocity-2d',
    chapterId: 'kinematics-2d',
    order: 12,
    sectionNumber: '3.7',
    title: 'Relative Velocity in Two Dimensions',
    shortDescription:
      'Transform velocities between moving reference frames using Galilean vector addition $\\vec{v}_{PA} = \\vec{v}_{PB} + \\vec{v}_{BA}$.',
    conceptIntro:
      'Velocity always depends on the observer’s reference frame. A boat’s engine pushes it relative to the flowing water ($\\vec{v}_{BW}$), while the river carries the water downstream relative to the riverbank ($\\vec{v}_{WG}$). An observer on shore sees the vector sum of both.',
    physicalInterpretation:
      'The inner subscripts chain together cleanly like dominoes: $\\vec{v}_{BG} = \\vec{v}_{BW} + \\vec{v}_{WG}$. Even in 2D, cross-river motion ($y$) depends solely on the boat’s cross-river velocity component $v_{BW,y}$—the current flowing parallel to the banks cannot speed up or slow down how long it takes to cross the river, it only adds downstream drift unless the boat angles upstream to cancel it.',
    mathematicalFormulation: {
      summary: 'Add frame-transformation velocity vectors component-by-component:',
      equations: [
        {
          label: 'Galilean Relative Velocity Addition',
          latex: '\\vec{v}_{PA} = \\vec{v}_{PB} + \\vec{v}_{BA}, \\qquad \\vec{v}_{AB} = -\\vec{v}_{BA}',
          context: 'Velocity of object $P$ relative to frame $A$ equals velocity of $P$ in frame $B$ plus velocity of frame $B$ relative to $A$.',
        },
        {
          label: 'River Crossing Time & Drift',
          latex: 't_{\\text{cross}} = \\frac{W}{v_{BW}\\cos\\alpha}, \\qquad \\Delta x_{\\text{drift}} = (v_{WG} - v_{BW}\\sin\\alpha)\\,t_{\\text{cross}}',
          context: 'With river width $W$, current $v_{WG}$ along $+x$, and boat aimed upstream by angle $\\alpha$ from straight across.',
        },
      ],
    },
    visualExplanation: {
      description:
        'A vector triangle links boat-in-water $\\vec{v}_{BW}$, water-on-ground $\\vec{v}_{WG}$, and resultant shore velocity $\\vec{v}_{BG}$.',
      diagram: {
        kind: 'relative-velocity-2d',
        caption: 'Vector sum v_BG = v_BW + v_WG governs crossing path and downstream drift.',
      },
    },
    workedExample: {
      title: 'Zero-Drift River Crossing',
      problem:
        'A ferryboat has speed $v_{BW} = 5.0\\text{ m/s}$ in still water and must cross a $120\\text{ m}$ wide river with current $v_{WG} = 3.0\\text{ m/s}$ east. At what upstream angle $\\alpha$ from north should it steer to land directly north, and how long will the crossing take?',
      given: ['W = 120\\text{ m}', 'v_{BW} = 5.0\\text{ m/s}', 'v_{WG} = 3.0\\text{ m/s}'],
      steps: [
        {
          explanation: 'Set net east-west velocity $v_{BG,x} = 0$ to cancel drift:',
          math: '3.0 - 5.0\\sin\\alpha = 0 \\implies \\sin\\alpha = \\frac{3.0}{5.0} = 0.60 \\implies \\alpha = 36.87^\\circ\\text{ west of north}',
        },
        {
          explanation: 'Find northward crossing speed $v_{BG,y}$ and crossing time:',
          math: 'v_{BG,y} = 5.0\\cos(36.87^\\circ) = 4.0\\text{ m/s}, \\qquad t_{\\text{cross}} = \\frac{120}{4.0} = 30.0\\text{ s}',
        },
      ],
      answer: 'Steer $36.9^\\circ$ upstream from straight across; crossing takes $30.0\\text{ s}$ with zero drift.',
    },
    simulationId: 'kinematics2d-relative',
    checkYourUnderstanding: {
      prompt: 'A boat aims straight across a river ($\\alpha = 0^\\circ$) at $4\\text{ m/s}$ relative to the water. If the river current suddenly doubles from $2\\text{ m/s}$ to $4\\text{ m/s}$, how does the time to cross the river change?',
      options: [
        'It doubles',
        'It halves',
        'It stays exactly the same because cross-river speed is unchanged',
        'It increases by $\\sqrt{2}$',
      ],
      correctIndex: 2,
      explanation: 'Crossing time depends solely on river width $W$ divided by the perpendicular component $v_{BG,y} = v_{BW} = 4\\text{ m/s}$. Faster current increases downstream drift, not crossing time.',
    },
    keywords: ['3.7', 'relative velocity', 'river boat', 'reference frame', 'galilean'],
  },
];
