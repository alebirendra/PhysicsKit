import type { TopicItem } from '../../../../types/physics';

export const KINEMATICS_TOPICS: TopicItem[] = [
  {
    id: 'kinematics-intro',
    chapterId: 'kinematics',
    order: 1,
    sectionNumber: '2.1',
    title: 'Introduction',
    shortDescription:
      'Describing straight-line motion through position, velocity, acceleration, and calculus without yet invoking forces.',
    conceptIntro:
      'Kinematics is the mathematical language of motion. Before asking why an object moves (dynamics), we build precise tools to describe where an object is at every instant, how rapidly its position changes, and how rapidly its velocity changes along a single straight line.',
    physicalInterpretation:
      'Consider a train traveling along a straight track, an elevator rising in a shaft, or a ball tossed straight upward. Even though the real world is three-dimensional, aligning a single coordinate axis (such as $+x$) with the line of motion reduces vector direction to a simple algebraic sign: positive for forward and negative for backward.',
    mathematicalFormulation: {
      summary:
        'One-dimensional kinematics treats position $x(t)$, velocity $v_x(t)$, and acceleration $a_x(t)$ as signed functions of a single time variable $t$.',
      equations: [
        {
          label: 'Trajectory Function',
          latex: 'x = x(t)',
          context: 'Gives the particle’s coordinate along the $x$-axis at every clock reading $t$.',
        },
        {
          label: 'Differential & Integral Hierarchy',
          latex: 'x(t) \\xrightarrow{\\;d/dt\\;} v_x(t) \\xrightarrow{\\;d/dt\\;} a_x(t) \\quad\\text{and}\\quad a_x(t) \\xrightarrow{\\;\\int dt\\;} v_x(t) \\xrightarrow{\\;\\int dt\\;} x(t)',
          context: 'Differentiation moves from position to velocity to acceleration; integration reverses the chain.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Motion along a straight track maps directly onto three stacked time graphs—position $x(t)$, velocity $v(t)$, and acceleration $a(t)$—linked by slopes and areas.',
      diagram: {
        kind: 'kinematics-intro',
        caption: 'One-dimensional motion along the x-axis represented simultaneously by its position, velocity, and acceleration curves.',
      },
    },
    workedExample: {
      title: 'Choosing a 1D Coordinate System for Vertical Toss',
      problem:
        'A student stands on a bridge $15\\text{ m}$ above a river and throws a stone straight up. Suggest a convenient 1D axis origin and positive direction, and give the initial coordinate $x_0$ and sign of the initial velocity.',
      given: ['\\text{Bridge height} = 15\\text{ m above river}', '\\text{Initial throw: upward}'],
      steps: [
        {
          explanation: 'Place the origin $x = 0$ at the water surface and choose upward as $+x$ (or $+y$).',
          math: 'x_{\\text{water}} = 0\\text{ m}, \\quad +\\text{upward}',
        },
        {
          explanation: 'Read the stone’s initial coordinate and velocity sign in this coordinate system.',
          math: 'x_0 = +15\\text{ m}, \\quad v_0 > 0',
        },
      ],
      answer: 'With origin at the river and $+x$ upward, $x_0 = +15\\text{ m}$ and $v_0 > 0$ (while gravity points in the $-x$ direction).',
    },
    simulationId: 'kinematics-motion',
    checkYourUnderstanding: {
      prompt: 'In one-dimensional kinematics, what does a minus sign in $v_x = -8\\text{ m/s}$ communicate?',
      options: [
        'The object is necessarily slowing down.',
        'The object is moving in the negative coordinate direction at 8 m/s.',
        'The object is located behind the origin at x < 0.',
        'The object has negative mass.',
      ],
      correctIndex: 1,
      explanation: 'In 1D, algebraic signs encode direction along the chosen axis. A negative velocity simply means motion toward decreasing $x$, regardless of where the object currently sits.',
    },
    keywords: ['2.1', 'introduction', 'one dimensional kinematics', 'rectilinear motion', 'coordinate axis'],
  },
  {
    id: 'position-1d',
    chapterId: 'kinematics',
    order: 2,
    sectionNumber: '2.2.1',
    title: 'Position',
    shortDescription:
      'Locating a particle on a directed number line using an origin, scale, and signed coordinate x.',
    conceptIntro:
      'Position specifies an object’s location relative to a chosen reference point called the origin ($x = 0$). In one dimension, position is a signed scalar coordinate (or a 1D position vector $\\vec{x} = x\\hat{i}$) whose sign tells us which side of the origin the particle occupies.',
    physicalInterpretation:
      'Think of mileposts along a straight highway where Mile 0 marks town center. Mile $+4$ is 4 units east of town, while Mile $-3$ is 3 units west. Moving the origin changes every position coordinate $x_1$ and $x_2$ by a constant offset, even though the physical locations do not move.',
    mathematicalFormulation: {
      summary: 'A 1D position coordinate combines a reference origin, a unit length, and a positive direction.',
      equations: [
        {
          label: '1D Position Vector',
          latex: '\\vec{x}(t) = x(t)\\hat{i}',
          context: 'In 1D, the full position vector reduces to a single signed coordinate $x(t)$ along $\\hat{i}$.',
        },
        {
          label: 'Origin Shift Transformation',
          latex: "x'(t) = x(t) - x_{\\text{ref}}",
          context: 'Shifting the origin to $x_{\\text{ref}}$ shifts all position values by the same constant.',
        },
      ],
    },
    visualExplanation: {
      description:
        'A horizontal coordinate axis shows the origin $O$, evenly spaced meter marks, a negative position $x_1 < 0$ to the left, and a positive position $x_2 > 0$ to the right.',
      diagram: {
        kind: 'position-axis',
        caption: 'Signed position coordinates x₁ = −3.0 m (left of origin) and x₂ = +5.0 m (right of origin).',
      },
    },
    workedExample: {
      title: 'Relabeling Position Under an Origin Shift',
      problem:
        'A cart sits at $x = +6.0\\text{ m}$ relative to a classroom door ($x = 0$). If you redefine the origin to be at a table located at $x_{\\text{table}} = +2.5\\text{ m}$, what is the cart’s new position $x^{\\prime}$?',
      given: ['x = +6.0\\text{ m}', 'x_{\\text{table}} = +2.5\\text{ m}'],
      steps: [
        {
          explanation: 'Measure the cart’s signed distance from the new origin at $x_{\\text{table}}$.',
          math: "x' = x - x_{\\text{table}} = 6.0\\text{ m} - 2.5\\text{ m}",
        },
        {
          explanation: 'Evaluate the shifted coordinate.',
          math: "x' = +3.5\\text{ m}",
        },
      ],
      answer: '$x^{\\prime} = +3.5\\text{ m}$ relative to the table.',
    },
    simulationId: 'kinematics-motion',
    checkYourUnderstanding: {
      prompt: 'A particle is at $x = -12\\text{ m}$ while another is at $x = +4\\text{ m}$. Which statement is true?',
      options: [
        'The particle at -12 m is closer to the origin than the particle at +4 m.',
        'The particle at -12 m is 12 m from the origin on the negative side.',
        'Position can never be negative in classical mechanics.',
        'Both particles have the same position magnitude.',
      ],
      correctIndex: 1,
      explanation: 'Distance from the origin is $|x|$, so $|-12\\text{ m}| = 12\\text{ m}$ on the negative side of $x = 0$.',
    },
    keywords: ['2.2.1', 'position', 'origin', 'coordinate', 'signed location'],
  },
  {
    id: 'time-interval',
    chapterId: 'kinematics',
    order: 3,
    sectionNumber: '2.2.2',
    title: 'Time interval',
    shortDescription:
      'Measuring the elapsed duration Δt = t₂ − t₁ between two instants along a motion.',
    conceptIntro:
      'While an instant $t$ records a single clock reading (like a frame in a video), physics tracks changes that happen over a duration. A time interval $\\Delta t$ is the difference between a final clock reading $t_2$ and an initial clock reading $t_1$.',
    physicalInterpretation:
      'A stopwatch started at $t_1 = 2.0\\text{ s}$ and stopped at $t_2 = 7.5\\text{ s}$ measures an elapsed time interval of $\\Delta t = 5.5\\text{ s}$. For forward-moving physical processes, $t_2 > t_1$, so $\\Delta t > 0$ even if we shift when we press “zero” on the clock.',
    mathematicalFormulation: {
      summary: 'The uppercase Greek delta ($\\Delta$) always denotes “final minus initial”.',
      equations: [
        {
          label: 'Time Interval Definition',
          latex: '\\Delta t = t_2 - t_1',
          context: 'Elapsed duration between initial time $t_1$ and final time $t_2$, measured in seconds (s).',
        },
        {
          label: 'Clock-Zero Invariance',
          latex: '\\Delta t = (t_2 + c) - (t_1 + c) = t_2 - t_1',
          context: 'Adding an arbitrary offset $c$ to all clock readings leaves every time interval unchanged.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Two vertical markers at $t_1$ and $t_2$ on the horizontal time axis bracket the shaded duration $\\Delta t = t_2 - t_1$.',
      diagram: {
        kind: 'time-interval',
        caption: 'Time interval Δt = t₂ − t₁ spanning between clock readings t₁ and t₂.',
      },
    },
    workedExample: {
      title: 'Computing Elapsed Time Between Photogates',
      problem:
        'A glider passes Photogate A when a lab timer reads $t_1 = 1.45\\text{ s}$ and passes Photogate B at $t_2 = 4.20\\text{ s}$. What is the time interval $\\Delta t$ between the two gates?',
      given: ['t_1 = 1.45\\text{ s}', 't_2 = 4.20\\text{ s}'],
      steps: [
        {
          explanation: 'Subtract the initial clock reading from the final clock reading.',
          math: '\\Delta t = t_2 - t_1 = 4.20\\text{ s} - 1.45\\text{ s}',
        },
        {
          explanation: 'Compute the difference.',
          math: '\\Delta t = 2.75\\text{ s}',
        },
      ],
      answer: '$\\Delta t = 2.75\\text{ s}$.',
    },
    simulationId: 'kinematics-motion',
    checkYourUnderstanding: {
      prompt: 'If a runner crosses the 50 m mark at $t_1 = 6.2\\text{ s}$ and the 100 m mark at $t_2 = 11.8\\text{ s}$, what is $\\Delta t$?',
      options: ['18.0 s', '5.6 s', '-5.6 s', '6.2 s'],
      correctIndex: 1,
      explanation: '$\\Delta t = t_2 - t_1 = 11.8\\text{ s} - 6.2\\text{ s} = 5.6\\text{ s}$.',
    },
    keywords: ['2.2.2', 'time interval', 'delta t', 'duration', 'elapsed time'],
  },
  {
    id: 'displacement-1d',
    chapterId: 'kinematics',
    order: 4,
    sectionNumber: '2.2.3',
    title: 'Displacement',
    shortDescription:
      'Net change in position Δx = x₂ − x₁, contrasted with total path distance traveled.',
    conceptIntro:
      'Displacement is the net change in an object’s position between two instants: $\\Delta x = x_2 - x_1$. Unlike total distance traveled, which accumulates every step regardless of direction, displacement depends only on the starting and ending coordinates and carries a sign.',
    physicalInterpretation:
      'If you walk from $x_1 = +2\\text{ m}$ out to $x = +7\\text{ m}$ and then walk back to $x_2 = +1\\text{ m}$, you walked a total distance of $5\\text{ m} + 6\\text{ m} = 11\\text{ m}$, yet your net displacement is $\\Delta x = 1 - 2 = -1\\text{ m}$ (1 meter left of where you started). Like $\\Delta t$, $\\Delta x$ is invariant if you shift the origin.',
    mathematicalFormulation: {
      summary: 'Displacement is signed and path-independent between endpoints; distance is non-negative and path-dependent.',
      equations: [
        {
          label: '1D Displacement',
          latex: '\\Delta x = x_2 - x_1 = x(t_2) - x(t_1)',
          context: 'Positive $\\Delta x$ indicates net motion in $+x$; negative $\\Delta x$ indicates net motion in $-x$.',
        },
        {
          label: 'Distance vs. Displacement',
          latex: 'd \\ge |\\Delta x|',
          context: 'Total path length $d$ equals $|\\Delta x|$ only when motion never reverses direction.',
        },
      ],
    },
    visualExplanation: {
      description:
        'A curved or reversing trajectory from $x_1$ out to a turnaround point and back to $x_2$ shows a long dashed path (distance $d$) compared to the single straight arrow $\\Delta x$ connecting $x_1$ to $x_2$.',
      diagram: {
        kind: 'displacement-1d',
        caption: 'Displacement Δx = x₂ − x₁ connects start to finish directly, whereas total distance sums every forward and backward segment.',
      },
    },
    workedExample: {
      title: 'Displacement vs. Distance on a Turnaround Trip',
      problem:
        'A cyclist starts at $x_1 = -4.0\\text{ m}$, rides forward to $x_{\\text{turn}} = +8.0\\text{ m}$, and reverses to stop at $x_2 = +2.0\\text{ m}$. Find both the net displacement $\\Delta x$ and total distance traveled $d$.',
      given: ['x_1 = -4.0\\text{ m}', 'x_{\\text{turn}} = +8.0\\text{ m}', 'x_2 = +2.0\\text{ m}'],
      steps: [
        {
          explanation: 'Compute net displacement using only final and initial coordinates.',
          math: '\\Delta x = x_2 - x_1 = 2.0 - (-4.0) = +6.0\\text{ m}',
        },
        {
          explanation: 'Compute total distance by summing the absolute length of each leg.',
          math: 'd = |8.0 - (-4.0)| + |2.0 - 8.0| = 12.0 + 6.0 = 18.0\\text{ m}',
        },
      ],
      answer: 'Net displacement $\\Delta x = +6.0\\text{ m}$; total distance traveled $d = 18.0\\text{ m}$.',
    },
    simulationId: 'kinematics-motion',
    checkYourUnderstanding: {
      prompt: 'An elevator rises from floor position $x_1 = 3\\text{ m}$ to $x = 15\\text{ m}$, then descends to $x_2 = 0\\text{ m}$. What is its displacement $\\Delta x$?',
      options: ['+27 m', '+3 m', '-3 m', '0 m'],
      correctIndex: 2,
      explanation: 'Displacement depends only on initial and final positions: $\\Delta x = x_2 - x_1 = 0\\text{ m} - 3\\text{ m} = -3\\text{ m}$.',
    },
    keywords: ['2.2.3', 'displacement', 'distance', 'delta x', 'net change in position'],
  },
  {
    id: 'average-velocity',
    chapterId: 'kinematics',
    order: 5,
    sectionNumber: '2.3.1',
    title: 'Average velocity',
    shortDescription:
      'Rate of displacement v_avg = Δx / Δt over an interval, equal to the slope of the secant line on an x–t graph.',
    conceptIntro:
      'Two trips can cover the same displacement in very different amounts of time. Average velocity quantifies the overall rate of change of position across a finite time interval $\\Delta t$ by dividing net displacement $\\Delta x$ by $\\Delta t$.',
    physicalInterpretation:
      'Geometrically, if you mark two points $(t_1, x_1)$ and $(t_2, x_2)$ on a position-versus-time graph and connect them with a straight secant line, the slope of that secant line is literally $v_{\\text{avg}}$. Meanwhile, average speed equals total distance divided by $\\Delta t$, which can exceed $|v_{\\text{avg}}|$ whenever direction reverses.',
    mathematicalFormulation: {
      summary: 'Average velocity is a signed ratio of displacement to elapsed time.',
      equations: [
        {
          label: 'Average Velocity',
          latex: 'v_{\\text{avg}} = \\frac{\\Delta x}{\\Delta t} = \\frac{x_2 - x_1}{t_2 - t_1}',
          context: 'Measured in $\\text{m/s}$; matches the slope of the secant line joining $(t_1, x_1)$ and $(t_2, x_2)$.',
        },
        {
          label: 'Average Speed (Scalar)',
          latex: 's_{\\text{avg}} = \\frac{\\text{total distance}}{\\Delta t} \\ge |v_{\\text{avg}}|',
          context: 'Always non-negative because total path distance cannot cancel out.',
        },
      ],
    },
    visualExplanation: {
      description:
        'The straight secant line connecting $(t_1, x_1)$ and $(t_2, x_2)$ on the $x$–$t$ curve forms a right triangle with horizontal run $\\Delta t$ and vertical rise $\\Delta x$.',
      diagram: {
        kind: 'avg-velocity-secant',
        caption: 'Average velocity equals the slope Δx/Δt of the secant line between (t₁, x₁) and (t₂, x₂).',
      },
    },
    workedExample: {
      title: 'Secant Slope on a Position–Time Curve',
      problem:
        'A particle follows $x(t) = 2t^2 - 3t + 1$ (meters, seconds). Find its average velocity over the interval from $t_1 = 1.0\\text{ s}$ to $t_2 = 4.0\\text{ s}$.',
      given: ['x(t) = 2t^2 - 3t + 1', 't_1 = 1.0\\text{ s}', 't_2 = 4.0\\text{ s}'],
      steps: [
        {
          explanation: 'Evaluate positions at both endpoints.',
          math: 'x(1) = 2(1)^2 - 3(1) + 1 = 0\\text{ m}, \\quad x(4) = 2(4)^2 - 3(4) + 1 = 21\\text{ m}',
        },
        {
          explanation: 'Compute the secant slope $\\Delta x / \\Delta t$.',
          math: 'v_{\\text{avg}} = \\frac{21 - 0}{4.0 - 1.0} = \\frac{21}{3.0} = +7.0\\text{ m/s}',
        },
      ],
      answer: '$v_{\\text{avg}} = +7.0\\text{ m/s}$.',
    },
    simulationId: 'kinematics-velocity',
    checkYourUnderstanding: {
      prompt: 'A car travels from $x_1 = 10\\text{ m}$ at $t_1 = 2\\text{ s}$ to $x_2 = -14\\text{ m}$ at $t_2 = 8\\text{ s}$. What is its average velocity?',
      options: ['+4.0 m/s', '-4.0 m/s', '-0.67 m/s', '+2.3 m/s'],
      correctIndex: 1,
      explanation: '$v_{\\text{avg}} = \\frac{-14 - 10}{8 - 2} = \\frac{-24}{6} = -4.0\\text{ m/s}$.',
    },
    keywords: ['2.3.1', 'average velocity', 'secant line', 'slope', 'average speed'],
  },
  {
    id: 'instantaneous-velocity',
    chapterId: 'kinematics',
    order: 6,
    sectionNumber: '2.3.3',
    title: 'Instantaneous velocity',
    shortDescription:
      'Velocity at an exact instant v(t) = dx/dt, obtained as the limit of secant slopes—the tangent line to x(t).',
    conceptIntro:
      'Average velocity tells us what happened over a whole interval, hiding whether the object sped up, paused, or turned around inside that window. By shrinking $\\Delta t \\to 0$, the second point $(t + \\Delta t, x(t + \\Delta t))$ slides along the $x$–$t$ curve toward $(t, x(t))$, turning the secant line into the tangent line.',
    physicalInterpretation:
      'The speedometer in a car (together with compass heading in 1D) reads instantaneous speed $|v(t)|$. On an $x$–$t$ plot, steep upward tangents mean rapid forward motion, steep downward tangents mean rapid backward motion, and a horizontal tangent ($v = 0$) marks a brief stop or turning point.',
    mathematicalFormulation: {
      summary: 'Instantaneous velocity is the first derivative of position with respect to time.',
      equations: [
        {
          label: 'Limit Definition & Derivative',
          latex: 'v(t) = \\lim_{\\Delta t \\to 0} \\frac{x(t + \\Delta t) - x(t)}{\\Delta t} = \\frac{dx}{dt}',
          context: 'Slope of the tangent line to the $x$–$t$ curve at instant $t$.',
        },
        {
          label: 'Instantaneous Speed',
          latex: 'v_{\\text{inst, speed}}(t) = |v(t)| = \\left|\\frac{dx}{dt}\\right|',
          context: 'Magnitude of the instantaneous velocity vector.',
        },
      ],
    },
    visualExplanation: {
      description:
        'As $\\Delta t$ shrinks from a wide interval toward zero, a sequence of secant lines pivots smoothly until it aligns with the tangent line touching $(t, x(t))$.',
      diagram: {
        kind: 'inst-velocity-tangent',
        caption: 'Shrinking Δt → 0 pivots the secant line into the instantaneous tangent line with slope v(t) = dx/dt.',
      },
    },
    workedExample: {
      title: 'Instantaneous Velocity via Differentiation',
      problem:
        'For a particle moving along $x(t) = 3t^2 - 12t + 5$ (m), find $v(t)$, its velocity at $t = 3.0\\text{ s}$, and the time when it momentarily stops.',
      given: ['x(t) = 3t^2 - 12t + 5', 't = 3.0\\text{ s}'],
      steps: [
        {
          explanation: 'Differentiate $x(t)$ with respect to $t$.',
          math: 'v(t) = \\frac{dx}{dt} = 6t - 12',
        },
        {
          explanation: 'Evaluate $v$ at $t = 3.0\\text{ s}$, and solve $v(t) = 0$ for the turning point.',
          math: 'v(3.0) = 6(3.0) - 12 = +6.0\\text{ m/s}; \\quad 6t - 12 = 0 \\implies t = 2.0\\text{ s}',
        },
      ],
      answer: '$v(t) = 6t - 12\\text{ m/s}$, $v(3.0\\text{ s}) = +6.0\\text{ m/s}$, and the particle momentarily stops at $t = 2.0\\text{ s}$.',
    },
    simulationId: 'kinematics-velocity',
    checkYourUnderstanding: {
      prompt: 'At the peak of a curve on an $x$–$t$ graph, the tangent line is completely horizontal. What is the instantaneous velocity at that moment?',
      options: [
        'Maximum positive value',
        'Zero',
        'Equal to acceleration',
        'Undefined',
      ],
      correctIndex: 1,
      explanation: 'A horizontal tangent line has slope zero, so $v(t) = dx/dt = 0$ at that instant.',
    },
    keywords: ['2.3.3', 'instantaneous velocity', 'derivative', 'tangent line', 'dx/dt', 'limit'],
  },
  {
    id: 'average-acceleration',
    chapterId: 'kinematics',
    order: 7,
    sectionNumber: '2.4.1',
    title: 'Average acceleration',
    shortDescription:
      'Rate of change of velocity a_avg = Δv / Δt over a time interval, equal to the secant slope on a v–t graph.',
    conceptIntro:
      'Whenever an object speeds up, slows down, or reverses direction, its velocity changes. Average acceleration measures the net change in velocity $\\Delta v = v_2 - v_1$ divided by the elapsed time interval $\\Delta t = t_2 - t_1$.',
    physicalInterpretation:
      'Just as average velocity is the secant slope on an $x$–$t$ graph, average acceleration is the secant slope on a $v$–$t$ graph. Its SI unit is meters per second squared ($\\text{m/s}^2$), meaning how many $\\text{m/s}$ the velocity shifts each second.',
    mathematicalFormulation: {
      summary: 'Average acceleration compares velocities at two instants separated by $\\Delta t$.',
      equations: [
        {
          label: 'Average Acceleration',
          latex: 'a_{\\text{avg}} = \\frac{\\Delta v}{\\Delta t} = \\frac{v_2 - v_1}{t_2 - t_1}',
          context: 'Slope of the secant line connecting $(t_1, v_1)$ and $(t_2, v_2)$ on the $v$–$t$ graph.',
        },
      ],
    },
    visualExplanation: {
      description:
        'A secant line across the $v$–$t$ curve shows $\\Delta v$ vertically and $\\Delta t$ horizontally, giving $a_{\\text{avg}} = \\Delta v / \\Delta t$.',
      diagram: {
        kind: 'avg-acceleration-secant',
        caption: 'Average acceleration equals the slope Δv/Δt of the secant line on a v–t graph.',
      },
    },
    workedExample: {
      title: 'Braking Average Acceleration',
      problem:
        'A train traveling at $v_1 = +24\\text{ m/s}$ applies its brakes and slows to $v_2 = +6.0\\text{ m/s}$ over a $6.0\\text{ s}$ interval. Calculate its average acceleration.',
      given: ['v_1 = +24\\text{ m/s}', 'v_2 = +6.0\\text{ m/s}', '\\Delta t = 6.0\\text{ s}'],
      steps: [
        {
          explanation: 'Find the change in velocity $\\Delta v = v_2 - v_1$.',
          math: '\\Delta v = 6.0\\text{ m/s} - 24\\text{ m/s} = -18\\text{ m/s}',
        },
        {
          explanation: 'Divide by the time interval $\\Delta t$.',
          math: 'a_{\\text{avg}} = \\frac{-18\\text{ m/s}}{6.0\\text{ s}} = -3.0\\text{ m/s}^2',
        },
      ],
      answer: '$a_{\\text{avg}} = -3.0\\text{ m/s}^2$ (directed opposite to the train’s velocity).',
    },
    simulationId: 'kinematics-acceleration',
    checkYourUnderstanding: {
      prompt: 'A particle moves in the $-x$ direction at $v_1 = -4\\text{ m/s}$ and 2 seconds later moves at $v_2 = -12\\text{ m/s}$. What is its average acceleration?',
      options: ['+4 m/s²', '-4 m/s²', '-8 m/s²', '+8 m/s²'],
      correctIndex: 1,
      explanation: '$a_{\\text{avg}} = \\frac{-12 - (-4)}{2} = \\frac{-8}{2} = -4\\text{ m/s}^2$. Since $v$ and $a$ share the same negative sign, the particle is speeding up in the $-x$ direction!',
    },
    keywords: ['2.4.1', 'average acceleration', 'delta v', 'v-t secant', 'm/s^2'],
  },
  {
    id: 'instantaneous-acceleration',
    chapterId: 'kinematics',
    order: 8,
    sectionNumber: '2.4.2',
    title: 'Instantaneous acceleration',
    shortDescription:
      'Derivative of velocity a(t) = dv/dt = d²x/dt², governing tangent slope on v–t and concavity on x–t.',
    conceptIntro:
      'Taking the limit of average acceleration as $\\Delta t \\to 0$ yields instantaneous acceleration $a(t) = dv/dt$. Because $v = dx/dt$, acceleration is simultaneously the second derivative of position, $d^2x/dt^2$.',
    physicalInterpretation:
      'Crucially, “negative acceleration” does NOT automatically mean “slowing down.” An object speeds up whenever $v$ and $a$ have the SAME sign (both positive or both negative), and slows down whenever $v$ and $a$ have OPPOSITE signs. On an $x$–$t$ graph, $a > 0$ curves the graph upward (concave up) and $a < 0$ curves it downward (concave down).',
    mathematicalFormulation: {
      summary: 'Instantaneous acceleration is the tangent slope of $v(t)$ and the curvature of $x(t)$.',
      equations: [
        {
          label: 'Instantaneous Acceleration',
          latex: 'a(t) = \\lim_{\\Delta t \\to 0} \\frac{v(t+\\Delta t) - v(t)}{\\Delta t} = \\frac{dv}{dt} = \\frac{d^2 x}{dt^2}',
          context: 'First derivative of $v(t)$ and second derivative of $x(t)$.',
        },
        {
          label: 'Speeding Up vs. Slowing Down Rule',
          latex: 'v(t)\\,a(t) > 0 \\implies \\text{speeding up}, \\qquad v(t)\\,a(t) < 0 \\implies \\text{slowing down}',
          context: 'Because $\\frac{d}{dt}(v^2) = 2va$, speed $|v|$ grows precisely when $v$ and $a$ point the same way.',
        },
      ],
    },
    visualExplanation: {
      description:
        'A tangent line on the $v$–$t$ curve gives $a(t) = dv/dt$, while shaded sign regions indicate when $v$ and $a$ agree (speeding up) versus oppose (slowing down).',
      diagram: {
        kind: 'inst-acceleration-tangent',
        caption: 'Instantaneous acceleration is the slope of the tangent line on v(t), determining whether speed grows or diminishes.',
      },
    },
    workedExample: {
      title: 'Finding Acceleration from Cubic Position',
      problem:
        'A particle’s position is given by $x(t) = t^3 - 6t^2 + 9t$ (m). Find $v(t)$ and $a(t)$, and determine whether the particle is speeding up or slowing down at $t = 0.5\\text{ s}$.',
      given: ['x(t) = t^3 - 6t^2 + 9t', 't = 0.5\\text{ s}'],
      steps: [
        {
          explanation: 'Differentiate once for velocity and a second time for acceleration.',
          math: 'v(t) = 3t^2 - 12t + 9, \\qquad a(t) = \\frac{dv}{dt} = 6t - 12',
        },
        {
          explanation: 'Evaluate both at $t = 0.5\\text{ s}$ and compare their signs.',
          math: 'v(0.5) = 3(0.25) - 6 + 9 = +3.75\\text{ m/s}, \\quad a(0.5) = 6(0.5) - 12 = -9.0\\text{ m/s}^2',
        },
      ],
      answer: '$a(t) = 6t - 12\\text{ m/s}^2$. At $t = 0.5\\text{ s}$, $v > 0$ and $a < 0$ (opposite signs), so the particle is slowing down.',
    },
    simulationId: 'kinematics-acceleration',
    checkYourUnderstanding: {
      prompt: 'At $t = 4\\text{ s}$, a particle has $v = -5\\text{ m/s}$ and $a = -3\\text{ m/s}^2$. What is happening to its speed at that instant?',
      options: [
        'Its speed is decreasing because acceleration is negative.',
        'Its speed is increasing because velocity and acceleration point in the same direction.',
        'Its speed is constant.',
        'It has stopped moving.',
      ],
      correctIndex: 1,
      explanation: 'Both $v$ and $a$ are negative, so $v\\,a = +15 > 0$. Speed $|v|$ is increasing as the particle accelerates faster in the $-x$ direction.',
    },
    keywords: ['2.4.2', 'instantaneous acceleration', 'dv/dt', 'second derivative', 'speeding up', 'slowing down'],
  },
  {
    id: 'constant-acceleration',
    chapterId: 'kinematics',
    order: 9,
    sectionNumber: '2.5',
    title: 'Constant acceleration',
    shortDescription:
      'The classic kinematic equations governing motion when a(t) = a is uniform in time.',
    conceptIntro:
      'Many foundational physical scenarios—near-Earth free fall, frictionless inclines, and uniform braking—involve constant acceleration $a$. When $a$ does not vary with time, $a(t)$ is horizontal, $v(t)$ is a straight line, and $x(t)$ is a smooth parabola.',
    physicalInterpretation:
      'Because velocity changes steadily at a fixed rate $a$, the average velocity across $[0, t]$ is simply the midpoint $\\frac{1}{2}(v_0 + v)$. Multiplying that average velocity by $t$ immediately gives the displacement without calculus!',
    mathematicalFormulation: {
      summary: 'Combining linear velocity growth with midpoint averaging yields the four standard constant-acceleration equations.',
      equations: [
        {
          label: 'Velocity–Time',
          latex: 'v = v_0 + a t',
          context: 'Velocity varies linearly with time at slope $a$.',
        },
        {
          label: 'Position–Time',
          latex: 'x = x_0 + v_0 t + \\frac{1}{2} a t^2',
          context: 'Parabolic trajectory combining initial velocity drift and acceleration curvature.',
        },
        {
          label: 'Time-Independent Equation',
          latex: 'v^2 = v_0^2 + 2a(x - x_0)',
          context: 'Eliminates time $t$ by substituting $t = (v - v_0)/a$ into the displacement formula.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Side-by-side aligned graphs show how a flat horizontal $a$–$t$ line produces a slanted linear $v$–$t$ line and a curved parabolic $x$–$t$ curve.',
      diagram: {
        kind: 'constant-accel-trio',
        caption: 'The constant-acceleration hierarchy: flat a(t), linear v(t), and parabolic x(t).',
      },
    },
    workedExample: {
      title: 'Runway Takeoff with Constant Acceleration',
      problem:
        'A jet starts from rest ($v_0 = 0$) at $x_0 = 0$ and accelerates uniformly at $a = 3.2\\text{ m/s}^2$ along a $900\\text{ m}$ runway. What speed does it reach at liftoff?',
      given: ['x_0 = 0', 'v_0 = 0', 'a = 3.2\\text{ m/s}^2', '\\Delta x = 900\\text{ m}'],
      steps: [
        {
          explanation: 'Select the time-independent kinematic equation since $t$ is not given.',
          math: 'v^2 = v_0^2 + 2a\\Delta x = 0 + 2(3.2)(900)',
        },
        {
          explanation: 'Take the positive square root for forward motion.',
          math: 'v = \\sqrt{5760} \\approx 75.9\\text{ m/s}',
        },
      ],
      answer: 'The jet reaches $v \\approx 75.9\\text{ m/s}$ ($\\approx 273\\text{ km/h}$).',
    },
    simulationId: 'kinematics-constant-accel',
    checkYourUnderstanding: {
      prompt: 'A ball starts from rest and accelerates uniformly at $a = 4.0\\text{ m/s}^2$ for $3.0\\text{ s}$. How far does it travel?',
      options: ['12 m', '18 m', '24 m', '36 m'],
      correctIndex: 1,
      explanation: 'Using $\\Delta x = v_0 t + \\frac{1}{2}at^2 = 0 + \\frac{1}{2}(4.0)(3.0)^2 = 2.0 \\times 9 = 18\\text{ m}$.',
    },
    keywords: ['2.5', 'constant acceleration', 'kinematic equations', 'free fall', 'parabola'],
  },
  {
    id: 'area-under-at-graph',
    chapterId: 'kinematics',
    order: 10,
    sectionNumber: '2.5.1',
    title: 'Area under the a–t graph',
    shortDescription:
      'Interpreting the signed geometric area under an acceleration-time curve as the net change in velocity Δv.',
    conceptIntro:
      'Just as the slope of the $v$–$t$ graph gives acceleration, reversing the operation shows that the signed area trapped between the $a$–$t$ curve and the time axis from $t_1$ to $t_2$ equals the change in velocity $\\Delta v = v(t_2) - v(t_1)$.',
    physicalInterpretation:
      'When acceleration is constant at $a_0$, the $a$–$t$ region is a rectangle of height $a_0$ and width $\\Delta t$, giving area $a_0 \\Delta t = \\Delta v$. Regions above the $t$-axis add positive velocity; regions below the $t$-axis subtract velocity.',
    mathematicalFormulation: {
      summary: 'Area on an $a$–$t$ graph carries units of $(\\text{m/s}^2)\\cdot\\text{s} = \\text{m/s}$, which is a change in velocity—not velocity itself unless $v(t_1) = 0$.',
      equations: [
        {
          label: 'Constant Acceleration Rectangle',
          latex: '\\Delta v = v(t_2) - v(t_1) = a\\,\\Delta t = \\text{Area}_{a\\text{–}t}',
          context: 'Rectangular area under a flat $a(t) = a$ line directly yields $\\Delta v$.',
        },
        {
          label: 'Recovering Final Velocity',
          latex: 'v(t_2) = v(t_1) + \\text{Signed Area}_{a\\text{–}t}[t_1, t_2]',
          context: 'Always add the initial velocity $v(t_1)$ to the area to obtain $v(t_2)$.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Shading the rectangle (or piecewise segments) under $a(t)$ from $t_1$ to $t_2$ directly displays $\\Delta v = \\text{height} \\times \\text{width}$.',
      diagram: {
        kind: 'area-at-graph',
        caption: 'The signed area bounded by the a–t curve between t₁ and t₂ equals the change in velocity Δv = v₂ − v₁.',
      },
    },
    workedExample: {
      title: 'Velocity Change from a Triangular/Rectangular a–t Profile',
      problem:
        'A rocket sled starts with $v(0) = 10\\text{ m/s}$. From $t = 0$ to $t = 4\\text{ s}$, its acceleration is constant at $+5\\text{ m/s}^2$; from $t = 4\\text{ s}$ to $t = 6\\text{ s}$, acceleration drops to $-2\\text{ m/s}^2$. Find $v(6\\text{ s})$ using areas.',
      given: ['v(0) = 10\\text{ m/s}', 'a_1 = +5\\text{ m/s}^2\\text{ on }[0,4]', 'a_2 = -2\\text{ m/s}^2\\text{ on }[4,6]'],
      steps: [
        {
          explanation: 'Compute the positive area from $0$ to $4\\text{ s}$ and negative area from $4$ to $6\\text{ s}$.',
          math: '\\Delta v = (+5)(4) + (-2)(2) = 20 - 4 = +16\\text{ m/s}',
        },
        {
          explanation: 'Add $\\Delta v$ to the initial velocity $v(0)$.',
          math: 'v(6) = v(0) + \\Delta v = 10 + 16 = 26\\text{ m/s}',
        },
      ],
      answer: '$v(6\\text{ s}) = 26\\text{ m/s}$.',
    },
    simulationId: 'kinematics-constant-accel',
    checkYourUnderstanding: {
      prompt: 'An object starts with $v(0) = +5\\text{ m/s}$. Its $a$–$t$ graph shows a constant $-3\\text{ m/s}^2$ for $4\\text{ s}$. What is $v(4\\text{ s})$?',
      options: ['-12 m/s', '-7 m/s', '+17 m/s', '+7 m/s'],
      correctIndex: 1,
      explanation: 'Area $= (-3)(4) = -12\\text{ m/s}$ gives $\\Delta v$. Then $v(4) = v(0) + \\Delta v = 5 + (-12) = -7\\text{ m/s}$.',
    },
    keywords: ['2.5.1', 'area under a-t graph', 'change in velocity', 'signed area'],
  },
  {
    id: 'area-under-vt-graph',
    chapterId: 'kinematics',
    order: 11,
    sectionNumber: '2.5.2',
    title: 'Area under the v–t graph',
    shortDescription:
      'Reading displacement Δx = x₂ − x₁ directly as the trapezoid (rectangle + triangle) area under the v–t line.',
    conceptIntro:
      'Under constant acceleration, the $v$–$t$ graph is a straight line rising from $v_0$ to $v_0 + at$. The area under that line between $t = 0$ and $t$ splits cleanly into a rectangle of area $v_0 t$ and a right triangle of area $\\frac{1}{2}(at)(t) = \\frac{1}{2}at^2$.',
    physicalInterpretation:
      'Every thin slice of width $dt$ under $v(t)$ represents a tiny displacement $v\\,dt$. Summing those slices geometrically produces the trapezoid area $\\frac{1}{2}(v_1 + v_2)\\Delta t$, which equals the net displacement $\\Delta x$. If $v(t)$ dips below the time axis, the negative area represents backward displacement.',
    mathematicalFormulation: {
      summary: 'Geometric decomposition of the $v$–$t$ trapezoid gives the famous $x(t)$ equation.',
      equations: [
        {
          label: 'Rectangle + Triangle Decomposition',
          latex: '\\Delta x = \\underbrace{v_0 t}_{\\text{rectangle}} + \\underbrace{\\frac{1}{2}(v - v_0)t}_{\\text{triangle}} = v_0 t + \\frac{1}{2}at^2',
          context: 'Visual proof of the constant-acceleration displacement equation.',
        },
        {
          label: 'Trapezoid Average Formula',
          latex: '\\Delta x = \\frac{v_1 + v_2}{2}\\,\\Delta t',
          context: 'Valid whenever $v(t)$ is linear (constant acceleration) on $[t_1, t_2]$.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Under a linear $v$–$t$ ramp, a lower blue rectangle ($v_0 t$) and an upper emerald triangle ($\\frac{1}{2}at^2$) together form the displacement trapezoid.',
      diagram: {
        kind: 'area-vt-graph',
        caption: 'Shading the v–t graph into a rectangle (v₀Δt) plus a triangle (½aΔt²) yields the total displacement Δx.',
      },
    },
    workedExample: {
      title: 'Displacement from a Braking Trapezoid',
      problem:
        'A car decelerates uniformly from $v_1 = 20\\text{ m/s}$ to $v_2 = 8\\text{ m/s}$ in $\\Delta t = 4.0\\text{ s}$. Use the $v$–$t$ trapezoid area to find its displacement.',
      given: ['v_1 = 20\\text{ m/s}', 'v_2 = 8\\text{ m/s}', '\\Delta t = 4.0\\text{ s}'],
      steps: [
        {
          explanation: 'Compute the average height of the trapezoid and multiply by its width $\\Delta t$.',
          math: '\\Delta x = \\frac{v_1 + v_2}{2}\\Delta t = \\frac{20 + 8}{2}(4.0)',
        },
        {
          explanation: 'Evaluate the area.',
          math: '\\Delta x = 14 \\times 4.0 = 56\\text{ m}',
        },
      ],
      answer: '$\\Delta x = 56\\text{ m}$.',
    },
    simulationId: 'kinematics-constant-accel',
    checkYourUnderstanding: {
      prompt: 'If a $v$–$t$ graph lies entirely below the time axis from $t = 0$ to $t = 5\\text{ s}$ with an enclosed area of magnitude $15\\text{ m}$, what is the displacement $\\Delta x$?',
      options: ['+15 m', '-15 m', '0 m', '+3 m'],
      correctIndex: 1,
      explanation: 'Area below the time axis corresponds to negative velocity ($v < 0$), so the signed displacement is $\\Delta x = -15\\text{ m}$.',
    },
    keywords: ['2.5.2', 'area under v-t graph', 'displacement', 'trapezoid', 'rectangle plus triangle'],
  },
  {
    id: 'change-velocity-indefinite-integral',
    chapterId: 'kinematics',
    order: 12,
    sectionNumber: '2.6.1',
    title: 'Change of velocity as the indefinite integral',
    shortDescription:
      'Recovering the general velocity function v(t) = ∫ a(t) dt + C from non-constant acceleration using antiderivatives.',
    conceptIntro:
      'When acceleration varies with time—such as a rocket burning fuel or a spring oscillator—the constant-acceleration formulas no longer apply. Because $a(t) = dv/dt$, finding $v(t)$ from $a(t)$ means finding an antiderivative: the indefinite integral $\\int a(t)\\,dt$.',
    physicalInterpretation:
      'An indefinite integral always brings an arbitrary constant $C$ because infinitely many velocity curves share the exact same slope $a(t)$ at every time—they are just shifted vertically! Specifying the initial velocity $v(0) = v_0$ pins down $C$ uniquely.',
    mathematicalFormulation: {
      summary: 'Antidifferentiation maps any integrable acceleration $a(t)$ to a family of velocity functions $v(t)$.',
      equations: [
        {
          label: 'Velocity via Indefinite Integral',
          latex: 'v(t) = \\int a(t)\\,dt = A(t) + C',
          context: 'Here $A^{\\prime}(t) = a(t)$, and $C$ is fixed by an initial condition such as $v(0) = v_0$.',
        },
        {
          label: 'Linear Acceleration Example',
          latex: 'a(t) = a_0 + j t \\implies v(t) = v_0 + a_0 t + \\frac{1}{2} j t^2',
          context: 'With constant jerk $j = da/dt$, velocity grows quadratically in time.',
        },
      ],
    },
    visualExplanation: {
      description:
        'A family of vertically shifted velocity curves $v(t) = A(t) + C$ shares identical tangent slopes $a(t)$ at every instant $t$; choosing $v_0$ selects the unique physical trajectory.',
      diagram: {
        kind: 'indefinite-integral-antiderivative',
        caption: 'Different constants C shift v(t) vertically while preserving the exact same derivative slope a(t) = dv/dt.',
      },
    },
    workedExample: {
      title: 'Finding v(t) from Time-Varying Acceleration',
      problem:
        'A car’s acceleration increases linearly according to $a(t) = 1.2 + 0.6t$ ($\\text{m/s}^2$). If $v(0) = 4.0\\text{ m/s}$, find the velocity function $v(t)$ and evaluate $v(5.0\\text{ s})$.',
      given: ['a(t) = 1.2 + 0.6t', 'v(0) = 4.0\\text{ m/s}'],
      steps: [
        {
          explanation: 'Compute the indefinite integral of $a(t)$.',
          math: 'v(t) = \\int (1.2 + 0.6t)\\,dt = 1.2t + 0.3t^2 + C',
        },
        {
          explanation: 'Apply $v(0) = 4.0$ to determine $C$, then evaluate at $t = 5.0\\text{ s}$.',
          math: 'C = 4.0 \\implies v(5.0) = 1.2(5) + 0.3(25) + 4.0 = 6.0 + 7.5 + 4.0 = 17.5\\text{ m/s}',
        },
      ],
      answer: '$v(t) = 4.0 + 1.2t + 0.3t^2\\text{ m/s}$, giving $v(5.0\\text{ s}) = 17.5\\text{ m/s}$.',
    },
    simulationId: 'kinematics-integrals',
    checkYourUnderstanding: {
      prompt: 'If two identical particles experience the same acceleration $a(t) = 3t$ for $t \\ge 0$, but Particle A starts at $v_A(0) = 0$ and Particle B starts at $v_B(0) = 5\\text{ m/s}$, how do their velocities compare at any later time $t$?',
      options: [
        'v_B(t) is always 5 m/s larger than v_A(t).',
        'Their velocities become equal at t = 5 s.',
        'Particle B always accelerates faster than Particle A.',
        'v_B(t) = 5 v_A(t).',
      ],
      correctIndex: 0,
      explanation: 'Both share the same antiderivative term $\\frac{3}{2}t^2$; their constant offsets differ by $C_B - C_A = 5\\text{ m/s}$ at all times.',
    },
    keywords: ['2.6.1', 'indefinite integral', 'antiderivative', 'change of velocity', 'constant of integration'],
  },
  {
    id: 'area-as-indefinite-integral',
    chapterId: 'kinematics',
    order: 13,
    sectionNumber: '2.6.2',
    title: 'Area as the indefinite integral',
    shortDescription:
      'Connecting the running area function F(t) under a curve f(t) to antiderivatives via the Fundamental Theorem of Calculus.',
    conceptIntro:
      'Why does “area under a curve” equal “antiderivative”? Define a running area function $F(t)$ that accumulates the area under any continuous curve $f(u)$ up to variable upper time $t$. Nudging $t$ forward by a tiny slice $\\Delta t$ adds a narrow strip of area approximately $f(t)\\Delta t$.',
    physicalInterpretation:
      'Dividing that incremental area $\\Delta F \\approx f(t)\\Delta t$ by $\\Delta t$ and taking $\\Delta t \\to 0$ proves $F^{\\prime}(t) = f(t)$! That means the running area function IS an antiderivative of $f(t)$, differing from any other antiderivative $G(t)$ only by an additive constant $C$.',
    mathematicalFormulation: {
      summary: 'Accumulating thin rectangular slices bridges Riemann geometry and indefinite integration.',
      equations: [
        {
          label: 'Running Area Function & Derivative',
          latex: 'F(t) = \\int_{t_0}^{t} f(u)\\,du \\implies \\frac{dF}{dt} = \\lim_{\\Delta t \\to 0} \\frac{F(t+\\Delta t) - F(t)}{\\Delta t} = f(t)',
          context: 'The rate at which accumulated area grows equals the height of the curve at $t$.',
        },
        {
          label: 'Link to General Antiderivative',
          latex: 'F(t) = G(t) - G(t_0), \\quad\\text{where } G(t) = \\int f(t)\\,dt',
          context: 'Any indefinite integral $G(t)$ computes accumulated area up to an additive constant.',
        },
      ],
    },
    visualExplanation: {
      description:
        'A shaded region from $t_0$ to $t$ with a thin highlighted vertical strip of width $\\Delta t$ and height $f(t)$ shows visually why $\\Delta(\\text{Area}) \\approx f(t)\\Delta t$.',
      diagram: {
        kind: 'area-function-ftc',
        caption: 'Adding a thin slice of area dF = f(t) dt shows that the derivative of accumulated area equals the curve height f(t).',
      },
    },
    workedExample: {
      title: 'Checking Area Growth as an Antiderivative',
      problem:
        'Let $f(t) = 2t + 1$ for $t \\ge 0$. Compute the area $F(t)$ accumulated from $t_0 = 0$ to $t$ using trapezoid geometry, and verify that $dF/dt = f(t)$.',
      given: ['f(t) = 2t + 1', 't_0 = 0'],
      steps: [
        {
          explanation: 'Find the trapezoid area from $u = 0$ (height $1$) to $u = t$ (height $2t + 1$).',
          math: 'F(t) = \\frac{1 + (2t + 1)}{2}\\,t = (t + 1)t = t^2 + t',
        },
        {
          explanation: 'Differentiate $F(t)$ to recover $f(t)$.',
          math: '\\frac{dF}{dt} = 2t + 1 = f(t)',
        },
      ],
      answer: '$F(t) = t^2 + t$ matches the antiderivative $\\int (2t + 1)\\,dt$ with $C = 0$, confirming $dF/dt = f(t)$.',
    },
    simulationId: 'kinematics-integrals',
    checkYourUnderstanding: {
      prompt: 'If $F(t)$ represents the accumulated area under $v(t)$ from $t = 0$ to $t$, what does the slope $dF/dt$ at $t = 3\\text{ s}$ equal?',
      options: [
        'The acceleration a(3 s)',
        'The velocity v(3 s)',
        'The total distance traveled up to 3 s',
        'Zero',
      ],
      correctIndex: 1,
      explanation: 'By the Fundamental Theorem of Calculus, the rate at which the area under $v(t)$ accumulates at time $t$ is the curve height $v(t)$ itself.',
    },
    keywords: ['2.6.2', 'area as indefinite integral', 'fundamental theorem of calculus', 'riemann strip', 'antiderivative'],
  },
  {
    id: 'definite-integral-acceleration',
    chapterId: 'kinematics',
    order: 14,
    sectionNumber: '2.6.3',
    title: 'Definite integral of acceleration',
    shortDescription:
      'Evaluating net velocity change Δv = ∫[t₁→t₂] a(t) dt as a limit of Riemann sums and antiderivative difference.',
    conceptIntro:
      'To find the exact change in velocity between $t_1$ and $t_2$ for an arbitrary continuous acceleration $a(t)$, we slice $[t_1, t_2]$ into $N$ narrow intervals of width $\\Delta t$, estimate each small velocity kick as $a(t_i)\\Delta t$, and let $N \\to \\infty$. That limit is the definite integral of acceleration.',
    physicalInterpretation:
      'Notice the subtle distinction: the definite integral $\\int_{t_1}^{t_2} a(t)\\,dt$ equals the CHANGE in velocity $\\Delta v = v(t_2) - v(t_1)$, which equals the signed area under the $a$–$t$ curve. Even if $a(t)$ smoothly ramps up or oscillates, the integral accumulates every tiny impulse of acceleration cleanly.',
    mathematicalFormulation: {
      summary: 'The definite integral turns Riemann midpoint rectangles into an exact antiderivative evaluation.',
      equations: [
        {
          label: 'Riemann Sum to Definite Integral',
          latex: '\\Delta v = v(t_2) - v(t_1) = \\lim_{N \\to \\infty} \\sum_{i=1}^{N} a(t_i)\\,\\Delta t = \\int_{t_1}^{t_2} a(t)\\,dt',
          context: 'Approximate area from $N$ subintervals converges to the exact velocity change.',
        },
        {
          label: 'Evaluation with Antiderivative',
          latex: 'v(t_2) = v(t_1) + \\int_{t_1}^{t_2} a(t)\\,dt',
          context: 'The arbitrary constant $C$ cancels automatically when subtracting at limits $t_2$ and $t_1$.',
        },
      ],
    },
    visualExplanation: {
      description:
        'Midpoint Riemann rectangles of width $\\Delta t$ tile under a curved $a(t)$ profile from $t_1$ to $t_2$, visually converging to the smooth signed area $\\Delta v$.',
      diagram: {
        kind: 'definite-integral-accel',
        caption: 'Riemann midpoint bars under a(t) approximate Δv; as N → ∞, their sum equals the definite integral ∫ a(t) dt.',
      },
    },
    workedExample: {
      title: 'Velocity Change Under Varying Acceleration',
      problem:
        'A probe starts at $v(1.0\\text{ s}) = 3.0\\text{ m/s}$ and experiences acceleration $a(t) = 6t - 2$ ($\\text{m/s}^2$). Compute $\\Delta v$ over $[1.0\\text{ s}, 3.0\\text{ s}]$ and find $v(3.0\\text{ s})$.',
      given: ['a(t) = 6t - 2', 'v(1.0) = 3.0\\text{ m/s}', 't_1 = 1.0\\text{ s},\\; t_2 = 3.0\\text{ s}'],
      steps: [
        {
          explanation: 'Find an antiderivative of $a(t)$ and evaluate from $t_1 = 1$ to $t_2 = 3$.',
          math: '\\Delta v = \\int_{1}^{3} (6t - 2)\\,dt = \\Big[3t^2 - 2t\\Big]_{1}^{3} = (27 - 6) - (3 - 2) = 20\\text{ m/s}',
        },
        {
          explanation: 'Add $\\Delta v$ to $v(1.0\\text{ s})$.',
          math: 'v(3.0) = 3.0 + 20 = 23.0\\text{ m/s}',
        },
      ],
      answer: '$\\Delta v = 20\\text{ m/s}$ and $v(3.0\\text{ s}) = 23.0\\text{ m/s}$.',
    },
    simulationId: 'kinematics-integrals',
    checkYourUnderstanding: {
      prompt: 'For $a(t) = 4t$ ($\\text{m/s}^2$), what is the definite integral $\\int_0^2 a(t)\\,dt$?',
      options: ['4 m/s', '8 m/s', '16 m/s', '2 m/s'],
      correctIndex: 1,
      explanation: '$\\int_0^2 4t\\,dt = [2t^2]_0^2 = 2(4) - 0 = 8\\text{ m/s}$.',
    },
    keywords: ['2.6.3', 'definite integral of acceleration', 'riemann sum', 'delta v', 'integral a(t)'],
  },
  {
    id: 'displacement-definite-integral-velocity',
    chapterId: 'kinematics',
    order: 15,
    sectionNumber: '2.6.4',
    title: 'Displacement as the definite integral of velocity',
    shortDescription:
      'Computing net displacement Δx = ∫[t₁→t₂] v(t) dt versus total path distance ∫ |v(t)| dt.',
    conceptIntro:
      'Completing the calculus hierarchy, integrating instantaneous velocity over a time interval $[t_1, t_2]$ produces net displacement: $\\Delta x = \\int_{t_1}^{t_2} v(t)\\,dt$. When $v(t)$ changes sign, positive and negative signed areas partially cancel in displacement, whereas integrating $|v(t)|$ sums every step into total distance.',
    physicalInterpretation:
      'Imagine a particle moving forward for $2\\text{ s}$ and then reversing for $2\\text{ s}$ symmetrically. The positive $v$–$t$ lobe and negative $v$–$t$ lobe have equal areas with opposite signs, so $\\int v(t)\\,dt = 0$ (back where it started), while total distance $\\int |v(t)|\\,dt > 0$ counts both trips positively.',
    mathematicalFormulation: {
      summary: 'Signed integration yields displacement; absolute-value integration yields distance.',
      equations: [
        {
          label: 'Displacement as Definite Integral',
          latex: '\\Delta x = x(t_2) - x(t_1) = \\int_{t_1}^{t_2} v(t)\\,dt',
          context: 'Signed area under $v(t)$ between $t_1$ and $t_2$.',
        },
        {
          label: 'Total Distance vs. Displacement',
          latex: 'd = \\int_{t_1}^{t_2} |v(t)|\\,dt \\ge \\left|\\int_{t_1}^{t_2} v(t)\\,dt\\right| = |\\Delta x|',
          context: 'To compute distance analytically when $v(t)$ crosses zero, split the integral at every root $v(t)=0$.',
        },
      ],
    },
    visualExplanation: {
      description:
        'A $v$–$t$ curve crossing the horizontal time axis highlights the positive lobe ($+\\Delta x_1$) in blue above the axis and the negative lobe ($-\\Delta x_2$) in rose below the axis.',
      diagram: {
        kind: 'definite-integral-velocity',
        caption: 'Displacement sums signed areas (+lobe minus −lobe), whereas total distance adds the absolute areas of both lobes.',
      },
    },
    workedExample: {
      title: 'Displacement vs. Distance When Velocity Reverses',
      problem:
        'A particle moves with velocity $v(t) = 6 - 2t$ ($\\text{m/s}$) from $t_1 = 0$ to $t_2 = 5\\text{ s}$. Find both its net displacement $\\Delta x$ and total distance traveled $d$.',
      given: ['v(t) = 6 - 2t', 't_1 = 0\\text{ s},\\; t_2 = 5\\text{ s}'],
      steps: [
        {
          explanation: 'Integrate $v(t)$ directly over $[0, 5]$ for net displacement.',
          math: '\\Delta x = \\int_0^5 (6 - 2t)\\,dt = \\Big[6t - t^2\\Big]_0^5 = 30 - 25 = +5.0\\text{ m}',
        },
        {
          explanation: 'Find where $v(t) = 0$ ($t = 3\\text{ s}$) and sum the absolute areas on $[0, 3]$ and $[3, 5]$.',
          math: 'd = \\left|\\int_0^3 (6 - 2t)\\,dt\\right| + \\left|\\int_3^5 (6 - 2t)\\,dt\\right| = |9| + |-4| = 13.0\\text{ m}',
        },
      ],
      answer: 'Net displacement $\\Delta x = +5.0\\text{ m}$; total distance traveled $d = 13.0\\text{ m}$.',
    },
    simulationId: 'kinematics-integrals',
    checkYourUnderstanding: {
      prompt: 'Over $[0, 4\\text{ s}]$, a particle has $v(t) = 4 - 2t\\text{ m/s}$. Which pair correctly reports its net displacement $\\Delta x$ and total distance $d$?',
      options: [
        'Δx = 8 m, d = 8 m',
        'Δx = 0 m, d = 8 m',
        'Δx = 0 m, d = 0 m',
        'Δx = 4 m, d = 8 m',
      ],
      correctIndex: 1,
      explanation: 'From $0$ to $2\\text{ s}$, area is $+4\\text{ m}$; from $2$ to $4\\text{ s}$, area is $-4\\text{ m}$. Thus $\\Delta x = 4 - 4 = 0\\text{ m}$, while $d = |4| + |-4| = 8\\text{ m}$.',
    },
    keywords: ['2.6.4', 'displacement as definite integral', 'integral of velocity', 'signed area', 'total distance'],
  },
];
