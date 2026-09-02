/**
 * Batch 7 — remaining senior-secondary physics: vector/scalar mechanics, thermo
 * temperature/thermal-energy/change-of-state, and the electromagnetic spectrum.
 *
 * Authored to the Master-Reviewer rubric (docs/guides/task-playbooks/narration/):
 * story-shaped prose, real people with recorded words + sources, a historical
 * timeline, respected/differing views given due weight, and a deep-dive that scales
 * Curious → Enthusiast → Professional → Nerd. Canonical facts stay consistent with the
 * vendored STEMMA export.
 */
import type { NarrativeContent } from '@learninghub/content-provider';

export const NARRATIVES_BATCH7: Record<string, NarrativeContent> = {
  'lhs:phys.vector': {
    conceptId: 'lhs:phys.vector',
    hook:
      'A wind is not just "10 m/s" — it is 10 m/s *toward the east*. Say the speed alone and a pilot is lost; add the direction and a ship finds its way. That pairing of size and direction, handled by its own arithmetic, is what physicists call a vector.',
    history:
      'The mathematics of directed quantity grew slowly. Ancient Greek geometry worked with line segments but treated length, not direction, as primary. In the 1500s–1600s, the study of motion — Galileo and Newton — forced physicists to think about velocities as having direction: Newton’s first law is about the direction an object keeps moving. The modern vector calculus was forged in the 1800s. In 1843 William Rowan Hamilton invented quaternions, and shortly after, Josiah Willard Gibbs and Oliver Heaviside (independently, in the 1880s) extracted the simpler vector algebra we use today — dot and cross products, vector addition — separating the useful core from Hamilton’s more abstract system. By the 1900s, vectors were the everyday language of physics and engineering.',
    figures: [
      {
        name: 'William Rowan Hamilton',
        lifespan: '1805–1865',
        role: 'Irish mathematician and physicist',
        contribution:
          'Introduced quaternions (1843), a general number system with directed parts, from which modern vector algebra later emerged.',
        statement:
          '…I shall henceforth assume the letters i, j, k … as a new class of imaginary quantities.',
        statementSource: 'Paraphrase of Hamilton’s discovery of quaternions (October 1843)',
      },
      {
        name: 'Josiah Willard Gibbs',
        lifespan: '1839–1903',
        role: 'American physicist and mathematician',
        contribution:
          'Developed the practical vector analysis used in modern physics (dot and cross products, operators), independent of Heaviside.',
        statementSource: 'Paraphrase of Gibbs’ lecture notes on vector analysis (1881)',
      },
      {
        name: 'Oliver Heaviside',
        lifespan: '1850–1925',
        role: 'English electrical engineer and mathematician',
        contribution:
          'Independently reformulated Maxwell’s equations in vector notation, helping establish vectors as the language of electromagnetism.',
        statementSource: 'Paraphrase of Heaviside’s vector treatment of electromagnetism (1890s)',
      },
    ],
    timeline: [
      {
        period: '1687',
        event: 'Newton’s laws treat motion as directed.',
        figure: 'Isaac Newton',
        note: 'Velocity and momentum implicitly carry direction.',
      },
      {
        period: '1843',
        event: 'Hamilton invents quaternions.',
        figure: 'William Rowan Hamilton',
      },
      {
        period: '1880s',
        event: 'Gibbs and Heaviside develop modern vector algebra.',
        figure: 'J. Willard Gibbs; Oliver Heaviside',
      },
    ],
    perspectives: [
      {
        figure: 'Hamilton (quaternions, 1843)',
        view: 'Directed quantity is best handled by a four-part number system (quaternions).',
        standing: 'Mathematically deep but too abstract for general use',
        note: 'Led directly to simpler vectors.',
      },
      {
        figure: 'Gibbs & Heaviside (1880s)',
        view: 'A practical vector algebra (addition, dot, cross) is enough for physics.',
        standing: 'The consensus language',
        note: 'Separated the useful core from quaternions.',
      },
      {
        figure: 'Tensor / modern view',
        view: 'Vectors are rank-1 tensors; deeper quantities need tensors.',
        standing: 'The generalised framework',
        note: 'Vectors are a special case of a larger structure.',
      },
    ],
    deepDive: {
      phenomenon: 'A quantity with both magnitude and direction, added by its own rules',
      intro:
        'A vector has magnitude and direction and follows vector addition (tip-to-tail). The deep-dive explains why direction changes the arithmetic and when the same idea generalises.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'A vector is a quantity with both a size and a direction — like 5 m/s east, or a push of 3 N upward. You cannot add directions like ordinary numbers: walk 3 km north then 4 km east and you end up 5 km away, not 7. Direction matters. Draw it as an arrow: the arrow’s length is the size, and its direction is the direction. Adding vectors means putting arrows tip-to-tail.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'A vector has magnitude and direction, written in components, e.g. v = (vₓ, v_y). Vector addition is component-wise; the magnitude is |v| = √(vₓ² + v_y²). Operations: dot product a·b = |a||b|cosθ (scalar, projection), cross product a×b (vector, magnitude |a||b|sinθ). Position, velocity, acceleration, force, momentum and field are vectors; speed, mass, energy and temperature are scalars. Independence of perpendicular components is the key to analysing projectile motion.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied scientists',
          body:
            'You resolve vectors into components for force/motion analysis, compute resultants for structural and mechanical loads, and use dot/cross products in statics, dynamics and electromagnetic design. Reference frames matter: a vector’s components change under rotation; you transform them with rotation matrices. Unit vectors, basis decomposition and coordinate systems (Cartesian, cylindrical, spherical) are everyday tools. In CAD/FEA and circuit/field solvers, vectors and their gradients are core.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Vectors live in a vector space over a field; a vector is an element of a set closed under addition and scalar multiplication. Under coordinate changes, a (contravariant) vector transforms like dxⁱ; a 1-form/covector transforms dually. General relativity and differential geometry generalise vectors to tensors and to objects defined on manifolds (tangent bundles). In quantum mechanics, state vectors in Hilbert space and operators (e.g. momentum −iħ∇) replace the classical directed arrows while inheriting the same linear structure.',
        },
      ],
    },
    whatCameBefore:
      'You need the idea of a physical quantity with units; a vector is such a quantity that also carries a direction.',
    connections: [
      'Scalar (a vector’s no-direction cousin)',
      'Velocity, force, acceleration (all vectors)',
      'Projectile motion (vectors components separate)',
    ],
    applications: [
      'Plotting a course: wind (vector) plus plane velocity (vector) give the ground track.',
      'A tugboat pulling a ship at an angle applies a force you resolve into forward and sideways components.',
      'Navigation and GPS combine position and velocity vectors.',
    ],
    workedExamples: [
      'Walk 3.0 km north then 4.0 km east. Your displacement is a vector from start to end, magnitude √(3² + 4²) = 5.0 km, direction 37° east of north — not 7 km, because you cannot add directions as plain numbers.',
    ],
    analogies: [
      'A vector is a treasure-map instruction: "3 paces north, then 4 east" is not the same as "7 paces any which way." The direction is part of the instruction itself.',
    ],
    misconceptions: [
      'Vectors do not add like ordinary numbers — magnitude + direction follow special rules.',
      'Speed is a scalar, velocity is a vector; they are not the same thing.',
      'A vector’s "size" (magnitude) is not its only info — the direction is essential.',
    ],
    tryThis:
      'Push a shopping cart at an angle: only the forward component does useful work across the aisle. Pull it straight and it glides more easily — you are feeling vector components split the force in practice.',
    funFacts: [
      'The dot and cross products we use came from Gibbs and Heaviside trimming Hamilton’s quaternions — two people, separately, reaching the same tidy result.',
      'The "right-hand rule" for cross products is a human convention about which perpendicular direction to call positive — arrow, arrow, thumb.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.scalar': {
    conceptId: 'lhs:phys.scalar',
    hook:
      'How much soup is in the pot? How heavy is a stone? How fast is your pulse? Each answer is a single number with a unit — and for a surprising number of questions, that one number is all you need. Quantities that ask only "how much" are the everyday workhorses of science: scalars.',
    history:
      'The notion that some quantities are just numbers with units — no direction — predates modern physics. Ancient measurement of length, mass and time by the Greeks and in trade are all scalar comparisons. When Newton and Galileo formalised motion they distinguished speed (scalar) from velocity (vector), although the clean mathematical split came with the vector calculus of the late 1800s (Gibbs, Heaviside; see "vector"). By the 20th century, thermodynamics clarified that energy, temperature, mass and charge are scalars — they fully describe a state with one number each, no direction needed.',
    figures: [
      {
        name: 'Galileo Galilei',
        lifespan: '1564–1642',
        role: 'Italian astronomer and physicist',
        contribution:
          'Quantified motion and led the move to measure nature, treating many quantities as single-number magnitudes in experiments.',
        statementSource: 'Paraphrase of Galileo’s Two New Sciences (1638)',
      },
      {
        name: 'James Prescott Joule',
        lifespan: '1818–1889',
        role: 'English physicist',
        contribution:
          'Measured heat and energy as scalar quantities (the mechanical equivalent of heat), clarifying that energy has magnitude but not direction.',
        statementSource: 'Paraphrase of Joule’s energy-work measurements (1840s)',
      },
    ],
    timeline: [
      {
        period: '1638',
        event: 'Galileo quantifies motion, treating measure as single-valued magnitude.',
        figure: 'Galileo Galilei',
      },
      {
        period: '1840s',
        event: 'Joule frames heat/energy as scalar quantities.',
        figure: 'James Prescott Joule',
      },
      {
        period: '1880s',
        event: 'Vector algebra clarifies scalars as the no-direction case.',
        figure: 'J. Willard Gibbs; Oliver Heaviside',
      },
    ],
    perspectives: [
      {
        figure: 'Classical measurement tradition',
        view: 'Quantities like length, mass, time are single numbers with units.',
        standing: 'Foundational and still true',
        note: 'Scalars precede vectors historically.',
      },
      {
        figure: 'Vector-calculus era (Gibbs/Heaviside)',
        view: 'A scalar is the no-direction partner of a vector — fully described by magnitude alone.',
        standing: 'The clean modern frame',
        note: 'Turns the division between "how much" and "which way" explicit.',
      },
      {
        figure: 'Tensor view',
        view: 'A scalar is a rank-0 tensor — invariant under coordinate change.',
        standing: 'The generalised consensus',
        note: 'Scalars do not change when you rotate your axes.',
      },
    ],
    deepDive: {
      phenomenon: 'A quantity with magnitude but no direction, obeying ordinary arithmetic',
      intro:
        'A scalar is fully described by a number and a unit; it follows ordinary arithmetic. The deep-dive distinguishes scalars from vectors and shows why energy/temperature/mass are scalars while many everyday "speeds" need direction.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'A scalar is a quantity that is just a number with a unit — like a mass of 3 kg or a temperature of 20°C. It has a size but no direction. You do not say "3 kg toward the door"; mass has no direction. Ordinary arithmetic works: 2 kg + 3 kg = 5 kg. Energy, temperature, time, distance and mass are scalars.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with basics',
          body:
            'A scalar has magnitude but no direction: mass (kg), energy (J), temperature (K), time (s), distance (m), speed (m/s), work (J), charge (C). Scalars combine with normal addition; they are invariant under rotation of the coordinate axes. Speed is the scalar magnitude of velocity, |v|. In thermodynamics, extensive (mass, energy) and intensive (temperature, pressure) quantities are scalars, though they behave differently under subdivision.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'You treat energy budgets, heat transfer, mass and pressure as scalars in balances and control. In field solvers you distinguish scalar fields (T(x,y,z), φ(x,y,z), p) from vector fields (force, velocity, E, B). Scalar quantities flow through power and energy accounting; efficiency, and safety margins are dimensionless scalars. Recognising what is a scalar vs a vector prevents sign/direction errors in component design.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'A scalar is a rank-0 tensor: a single value invariant under coordinate transformations (φ\' = φ). In relativity, proper time τ and invariant mass are scalars, while energy and momentum combine into a 4-vector. In field theory, scalar fields (φ, Higgs Higgs field) are distinguished by their transformation law. Scalars in a vector space: the field of scalars is the coefficient set (ℝ or ℂ) over which vectors are combined.',
        },
      ],
    },
    whatCameBefore:
      'You need the idea of a quantity with units; a scalar is the simplest kind — magnitude alone.',
    connections: [
      'Vector (the direction-carrying partner)',
      'Speed vs velocity (scalar vs vector)',
      'Energy, temperature, mass (all scalars)',
    ],
    applications: [
      'A kitchen recipe uses scalar quantities — grams, litres, minutes — with no direction.',
      'Batteries are rated in joules (energy, scalar) — stored amount, not a direction.',
      'Weather is described by scalar temperature and pressure plus vector wind.',
    ],
    workedExamples: [
      'Your car’s speedometer reads speed — a scalar: 60 km/h, just a magnitude. Velocity would also say the direction, e.g. 60 km/h due north. Going around a curve at constant 60 km/h your speed is constant (scalar same) but your velocity changes (direction changes).',
    ],
    analogies: [
      'A scalar is a suitcase label that says only the weight — "15 kg." A vector adds an arrow — "15 kg, being carried this way." Most things you carry are scalar-labelled.',
    ],
    misconceptions: [
      'Scalars are not "smaller" than vectors — they are just a different kind of quantity.',
      'Speed and velocity are not synonyms: one is scalar, the other vector.',
      'A scalar still has a unit; "mag[nitude] only" does not mean "no unit".',
    ],
    tryThis:
      'Read a thermometer, a bathroom scale and a stopwatch: all give scalar readings. Then step outside and feel that the wind speed is a scalar while the wind direction makes it a vector — the number alone does not tell you which way the leaves blow.',
    funFacts: [
      'In relativity, the one "quantity" that every observer agrees on is a scalar (the proper time interval) — while energy and momentum, which you might think simpler, are vectors that change between observers.',
      'Temperature is a scalar, yet it is actually an "average" — averaged over billions of jiggling particles.',
    ],
    estimatedTimeMinutes: 14,
  },

  'lhs:phys.projectile-motion': {
    conceptId: 'lhs:phys.projectile-motion',
    hook:
      'Cannonballs and water jets, basketball shots and rockets — all trace the same graceful arc. What looks like one curving motion is really two independent ones happening at once: a steady horizontal glide and a vertical rise-and-fall. Separate them, and the mystery of the parabola disappears.',
    history:
      'The curved path of a thrown object puzzled physicists for centuries. The ancient and medieval view, following Aristotle, held that a projectile is pushed along until it runs out of impetus. In the 1500s, Niccolò Tartaglia experimentally studied cannonball ranges. Galileo Galilei was the first (Two New Sciences, 1638) to prove that the path is a parabola and, crucially, that the horizontal and vertical motions are independent and combine with different rules: horizontal motion is uniform, vertical motion is uniformly accelerated by gravity. This independence became a cornerstone of mechanics. Newton’s laws (1687) then grounded projectile motion in force and acceleration. Artillery, sports and, later, rocketry all built on it.',
    figures: [
      {
        name: 'Galileo Galilei',
        lifespan: '1564–1642',
        role: 'Italian astronomer and physicist',
        contribution:
          'First proved projectile paths are parabolas and that horizontal (uniform) and vertical (accelerated) motions act independently.',
        statement:
          '…a projectile … carries a motion compounded of one which is uniform and one which is naturally accelerated.',
        statementSource: 'Paraphrase of Galileo’s Two New Sciences (1638)',
      },
      {
        name: 'Niccolò Tartaglia',
        lifespan: 'c. 1499–1557',
        role: 'Italian mathematician',
        contribution:
          'Experimentally studied cannonball ranges and observed that maximum range occurs at a 45° launch angle — a result later explained by theory.',
        statementSource: 'Paraphrase of Tartaglia’s Nova Scientia (1537)',
      },
      {
        name: 'Isaac Newton',
        lifespan: '1643–1727',
        role: 'English mathematician and natural philosopher',
        contribution:
          'Grounded projectile motion in his laws of motion and gravity, unifying the behaviour under forces.',
        statementSource: 'Paraphrase of Newton’s Principia (1687)',
      },
    ],
    timeline: [
      {
        period: '1537',
        event: 'Tartaglia studies cannonball trajectories and ranges.',
        figure: 'Niccolò Tartaglia',
      },
      {
        period: '1638',
        event: 'Galileo proves projectile paths are parabolas (independence of motion).',
        figure: 'Galileo Galilei',
      },
      {
        period: '1687',
        event: 'Newton’s laws unify projectile behaviour under forces.',
        figure: 'Isaac Newton',
      },
    ],
    perspectives: [
      {
        figure: 'Aristotelian view',
        view: 'A projectile is continuously pushed until impetus runs out.',
        standing: 'Superseded by Galileo',
        note: 'Could not explain the parabola or equal-free-fall.',
      },
      {
        figure: 'Galileo (1638)',
        view: 'Horizontal and vertical motions are independent; the path is a parabola.',
        standing: 'Core correct model',
        note: 'Range = v²sin(2θ)/g follows.',
      },
      {
        figure: 'Newton / modern',
        view: 'Projectile motion is force-driven (weight downward); air resistance is a real correction.',
        standing: 'The modern consensus',
        note: 'Ideal model neglects drag; real trajectories differ.',
      },
    ],
    deepDive: {
      phenomenon: 'Two independent motions — uniform horizontal, accelerated vertical',
      intro:
        'Projectile motion is the combination of constant horizontal velocity and vertical acceleration g. The deep-dive derives the range, flight time and height, and notes air-resistance limits.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Throw a ball and it arcs. What is happening: sideways it keeps moving at a steady speed; up/down, gravity pulls it. These two motions happen at the same time but do not mix — the sideways part is unchanged by the falling part. That is why you aim ahead of a falling object, and why water shooting from a hose curves in a smooth parabola.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'Launch at speed v and angle θ: vₓ = vcosθ (constant), v_y = vsinθ − gt (accelerated by g). Flight time T = 2v sinθ/g; range R = v² sin(2θ)/g, maximum at θ = 45°; max height H = v² sin²θ/(2g). Horizontal and vertical motions add independently; the vertical part alone is free fall. Time to top = v sinθ/g.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'Ballistics, sports equipment, water fountains and bombardment design use the launch-angle/range relation. Real projectiles need drag: quadratic air resistance, crosswind and spin (Magnus effect) alter range and add a terminal-velocity correction. You compute impact points, safety distances, and optimum launch angles with ballistic coefficients. Structured-light and particle-injection systems are often analysed as projectiles with small perturbations.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Integrating the ballistic equations of motion under constant acceleration proves the parabola from y(x) = x tanθ − gx²/(2v²cos²θ). With drag, the ODEs m d²r/dt² = −mg ŷ − ½ρAC_D |v|v are nonlinear and solved numerically. The independence of components comes from linearity of the equations of motion when forces act independently, and generalises to projectile motion under conservative fields. Coriolis effects appear for long-range projectile in a rotating frame.',
        },
      ],
    },
    whatCameBefore:
      'You need velocity/acceleration (vectors) and what free fall does; projectile motion combines uniform horizontal motion with vertical free fall.',
    connections: [
      'Vector components (the horizontal vs vertical split)',
      'Free-fall acceleration (the vertical part)',
      'Gravitation (what supplies the vertical force)',
    ],
    applications: [
      'A basketball or football follows projectile motion under gravity.',
      'Firefighting hoses and irrigation systems launch water to reach a target.',
      'Rocket staging and artillery forecasting rely on projectile (ballistic) mathematics.',
    ],
    workedExamples: [
      'A ball is launched at 20 m/s at 30°. vₓ = 20cos30° = 17.3 m/s, v_y = 20sin30° = 10 m/s. Flight time T = 2×10/9.8 ≈ 2.04 s. Range R = vₓ·T ≈ 17.3×2.04 ≈ 35 m. Double the angle to 60° and the range is similar (same sin2θ); 45° would give the maximum reach.',
    ],
    analogies: [
      'Projectile motion is a conveyor belt carrying a ball while the ball also falls: one ride slides you along steadily (horizontally) while gravity drops you vertically — the two combine into the arc without one changing the other.',
    ],
    misconceptions: [
      'Projectile motion is not one curved force dragging sideways and down — it is two independent motions added.',
      'At the top of the arc the vertical velocity is zero, but horizontal velocity (and total motion) is not.',
      'Air resistance is neglected in the ideal model; real balls and shells do not follow perfect parabolas.',
    ],
    tryThis:
      'Fill a paper cup with a hole in its side and shoot a horizontal stream of water, or drop yourself: let a friend drop one ball straight down while you throw another horizontally from the same height — they hit the ground at the same time, because falling is independent of horizontal motion.',
    funFacts: [
      'A 45° launch angle gives maximum range — a fact known to artillery gunners long before the mathematics was formalised.',
      'Without air resistance, every projectile follows an exact parabola; with air it is an "Euler-degraded" path with a steeper fall.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.gravitation': {
    conceptId: 'lhs:phys.gravitation',
    hook:
      'The apple and the Moon obey the same invisible pull. A force you cannot see binds planets to the Sun, keeps you to the ground, and — over billions of years — gathered dust into galaxies. Grasping gravitation is grasping why the whole Universe is connected.',
    history:
      'The ancients knew objects fall but had no unifying theory. Aristotle thought heavy things fall to their natural place. In the 1600s, Kepler described planetary orbits (Tycho’s data), and in 1687 Isaac Newton published the law of universal gravitation in the Principia: every mass attracts every other with a force proportional to the product of masses and inversely proportional to the square of the distance. He showed the same force that drops an apple keeps the Moon in orbit. For two centuries this stood as the crowning theory. In the 1900s, Albert Einstein’s general relativity reimagined gravitation as the curvature of spacetime, explaining effects Newton’s law could not (Mercury’s orbit, light bending). Gravitation remains both the most familiar and deepest force.',
    figures: [
      {
        name: 'Isaac Newton',
        lifespan: '1643–1727',
        role: 'English mathematician and natural philosopher',
        contribution:
          'Published the law of universal gravitation (1687), unifying terrestrial and celestial motion: F = G·M·m/r².',
        statement:
          'I deduced that the forces which keep the planets in their orbs must be reciprocally as the squares of their distances from the centres about which they revolve.',
        statementSource: 'Paraphrase of Isaac Newton, Principia (1687)',
      },
      {
        name: 'Albert Einstein',
        lifespan: '1879–1955',
        role: 'German-born theoretical physicist',
        contribution:
          'Formulated general relativity (1915), describing gravity as the curvature of spacetime and explaining effects Newton’s law could not.',
        statement:
          'The curvature of space-time … can be used to replace the action of the gravitational field.',
        statementSource: 'Paraphrase of Einstein’s general relativity papers (1915–1916)',
      },
      {
        name: 'Johannes Kepler',
        lifespan: '1571–1630',
        role: 'German mathematician and astronomer',
        contribution:
          'Described the empirical laws of planetary motion that Newton later explained with gravitation.',
        statementSource: 'Paraphrase of Kepler’s Astronomia nova (1609)',
      },
    ],
    timeline: [
      {
        period: '1609–1619',
        event: 'Kepler formulates his three laws of planetary motion.',
        figure: 'Johannes Kepler',
      },
      {
        period: '1687',
        event: 'Newton publishes the law of universal gravitation.',
        figure: 'Isaac Newton',
      },
      {
        period: '1915',
        event: 'Einstein publishes general relativity.',
        figure: 'Albert Einstein',
      },
    ],
    perspectives: [
      {
        figure: 'Aristotelian physics',
        view: 'Heavy objects fall because they seek their natural place.',
        standing: 'Superseded',
        note: 'Qualitative, no quantitative law.',
      },
      {
        figure: 'Newton (1687)',
        view: 'Universal attraction: F = GMm/r², action at a distance.',
        standing: 'Accurate for nearly all practical scales',
        note: 'Two-centuries-standard; explains Kepler from one law.',
      },
      {
        figure: 'Einstein / general relativity',
        view: 'Gravity is spacetime curvature; mass-energy curves geometry.',
        standing: 'The modern consensus',
        note: 'Fixes Mercury’s perihelion, light bending, black holes, GPS corrections.',
      },
    ],
    deepDive: {
      phenomenon: 'A universal attraction described by an inverse-square law and, deeper, as spacetime curvature',
      intro:
        'Gravitation is the mutual attraction of all mass-energy, F = GMm/r² in Newton’s form. The deep-dive scales from everyday weight to general relativity.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Gravitation is the force that pulls you to the Earth and the Earth to the Sun. Every object with mass pulls on every other. The pull is stronger for heavier things and weaker as you move apart — double the distance and the pull drops to a quarter. It is why an apple falls, why the Moon circles Earth, and why planets circle the Sun.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'Newton’s law: F = G·M·m/r², with G ≈ 6.674×10⁻¹¹ N·m²/kg². The force is always attractive, along the line joining centres. Your weight is W = GMm/R² at Earth’s surface, so g = GM/R² ≈ 9.8 m/s². Inverse square: doubling radius quarters the force. Gravitational potential energy U = −GMm/r, conveniently zero at infinity. Orbits: circular speed v = √(GM/r).',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'Orbital mechanics, satellite design, launch windows, GPS time corrections and geostationary placement all use gravitation and its perturbations (oblateness J₂, drag, third bodies). You compute transfer orbits (Hohmann), Δv budgets, and tidal forces. Precision relies on general-relativity corrections for clocks in orbit and for Mercury’s precession. Gravimetry maps underground structure from tiny g variations.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'General relativity: gravity = curvature of spacetime encoded in the Einstein field equations G_μν + Λg_μν = (8πG/c⁴)T_μν. Particles follow geodesics; light bends and redshifts; gravitational waves propagate as ripples in curvature (LIGO, 2015). Black holes and the Schwarzschild/Kerr metrics, gravitational time dilation, and the equivalence principle unify inertial with gravitational mass. Quantum gravity is the open frontier.',
        },
      ],
    },
    whatCameBefore:
      'You need force, mass, weight and acceleration; gravitation is the particular force that, near Earth, gives weight and free-fall g.',
    connections: [
      'Weight (W = mg)',
      'Gravitational acceleration (g)',
      'Projectile motion and orbits',
    ],
    applications: [
      'Satellites stay in orbit because Earth’s gravity provides the needed central force.',
      'The tides are the Moon’s (and Sun’s) gravity stretching the oceans.',
      'GPS receiver hardware applies gravitational time-dilation corrections to stay accurate.',
    ],
    workedExamples: [
      'A 70 kg person on Earth (M=5.97×10²⁴ kg, r=6.37×10⁶ m): F = GMm/r² ≈ (6.674×10⁻¹¹ × 5.97×10²⁴ × 70)/(6.37×10⁶)² ≈ 687 N — their weight. The same person on the Moon (g≈1.6) would weigh ≈112 N.',
    ],
    analogies: [
      'Gravity is a stretched rubber sheet: a heavy ball (the Sun) dimples it, and lighter balls (planets) roll along the curves — not pulled "down" by an invisible string, but guided by the shape the mass makes around it.',
    ],
    misconceptions: [
      'Gravity is not a force just at the surface — it acts over the whole Universe between all masses.',
      'Weight is not the same as mass: weight is the force gravity exerts on a mass.',
      'The Moon "falls" toward Earth constantly — its sideways motion keeps missing, forming the orbit.',
    ],
    tryThis:
      'Drop a stone and a feather in air and they fall at slightly different rates only because of drag. In a vacuum (or a sealed jar pumped out) they fall together: gravity accelerates all masses the same, whatever their weight.',
    funFacts: [
      'Gravity is the weakest known force, yet it dominates the Universe because it always adds and never cancels.',
      'Apollo astronauts left laser reflectors on the Moon; ranging them measures the Earth–Moon distance to centimetres, confirming general relativity precisely.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.gravitational-acceleration': {
    conceptId: 'lhs:phys.gravitational-acceleration',
    hook:
      'Drop a feather and a hammer in a vacuum and they fall side by side. Why? Because near the ground, gravity gives everything the very same acceleration — about 9.8 metres per second, every second. The "g" you feel in an elevator is that universal pull.',
    history:
      'The idea that gravity accelerates all objects equally was not obvious. Aristotle taught that heavy objects fall faster. For centuries this went untested. Galileo Galilei challenged it with experiments (dropping objects, rolling balls down inclines) in the early 1600s and concluded that, neglecting air resistance, all bodies fall with the same acceleration. The development of vacuum pumps (Otto von Guericke, 1650s) let Robert Boyle test dropping in vacuum. Newton tied it into gravity: F = mg, and since F = ma, the mass cancels — a = g for all bodies. Modern precision (the value g ≈ 9.803 m/s² varies by latitude and altitude) came from pendulum and gravitational measurements.',
    figures: [
      {
        name: 'Galileo Galilei',
        lifespan: '1564–1642',
        role: 'Italian astronomer and physicist',
        contribution:
          'Established that all bodies fall with the same acceleration (neglecting air resistance), overturning Aristotle.',
        statement:
          'All bodies, great and small, fall to the ground with equal velocities if the resistance of the air be taken away.',
        statementSource: 'Paraphrase of Galileo’s investigation of falling bodies (c. 1604–1638)',
      },
      {
        name: 'Isaac Newton',
        lifespan: '1643–1727',
        role: 'English mathematician and natural philosopher',
        contribution:
          'Explained the universal equal fall: since F = G·M·m/r² = ma, the mass m cancels, so a = g for every body.',
        statementSource: 'Paraphrase of Newton’s Principia (1687)',
      },
    ],
    timeline: [
      {
        period: 'c. 1604',
        event: 'Galileo studies falling bodies and inclined planes.',
        figure: 'Galileo Galilei',
      },
      {
        period: '1650s',
        event: 'Vacuum pumps let fall be tested without air drag.',
        figure: 'Otto von Guericke',
      },
      {
        period: '1687',
        event: 'Newton derives equal acceleration g from gravity.',
        figure: 'Isaac Newton',
      },
    ],
    perspectives: [
      {
        figure: 'Aristotle',
        view: 'Heavier objects fall faster.',
        standing: 'Superseded',
        note: 'Qualitative and famously wrong in detail.',
      },
      {
        figure: 'Galileo',
        view: 'All bodies fall with the same acceleration, neglecting air resistance.',
        standing: 'Core correct result',
        note: 'Guided by experiment.',
      },
      {
        figure: 'Newton / equivalence',
        view: 'g is the same for all masses because inertial and gravitational mass are equal.',
        standing: 'The modern (relativity-backed) consensus',
        note: 'The equivalence principle unifies it.',
      },
    ],
    deepDive: {
      phenomenon: 'The constant acceleration near Earth’s surface, the same for all bodies',
      intro:
        'g ≈ 9.8 m/s² is the acceleration of a freely falling object near Earth’s surface. The deep-dive shows why it is mass-independent and how it scales with latitude and height.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'g is the pull of Earth on a falling object — about 9.8 m/s². It means every second, a falling object speeds up by about 9.8 m/s. Everything, heavy or light (without air), falls with the same g, so a dropped ball and a dropped book speed up the same way. On the Moon g is about 1.6, so you would fall slower there.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'g = GM/R² ≈ 9.8 m/s², the surface gravitational acceleration from a planet of mass M and radius R. It is independent of the falling body’s mass because F = GMm/R² = ma → a = GM/R². g varies with latitude (Earth’s rotation flattens it), altitude (distance from centre), and local mass anomalies. Free fall: v = gt, h = ½gt². g appears in weight W = mg and projectile/ballistic problems.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'You use standard gravity g₀ = 9.80665 m/s² for calibration, load and test design (g of the equipment). Geodesy and gravimetry correct for free-air and Bouguer anomalies. In transport, accelerometers report forces in "g"s; structural design factors in g loads. Space launch accounts for gravity loss (ɴ acceleration along the path), reducing Δv below ideal. g also sets the natural frequency of pendulums and of some instruments.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'g is an emerging quantity from the metric: the proper acceleration of a stationary observer at radius r. Exact value from the Schwarzschild metric gives g = GM/[r²√(1−2GM/c²r)]. The universality of free fall — the equivalence principle — states gravitational and inertial mass are identical, tested to high precision by Eötvös and modern torsion-balance experiments. In rotating frames, effective g includes centrifugal terms, and precision gravimetry uses free-air gradient g changes by ≈3.1 µGal/m.',
        },
      ],
    },
    whatCameBefore:
      'You need force, mass and acceleration, plus gravitation; g is the acceleration gravity produces near Earth.',
    connections: [
      'Gravitation (g = GM/R²)',
      'Weight (W = mg)',
      'Free fall and projectile motion',
    ],
    applications: [
      'Ski jumps and sports use g to time falls and arcs.',
      'Roller-coaster design rates acceleration in multiples of g.',
      'Gravimeters in geology measure tiny g changes to map underground structure.',
    ],
    workedExamples: [
      'Drop a ball from rest; it falls with g = 9.8 m/s². After 1 s its speed is 9.8 m/s; after 2 s, 19.6 m/s. Distance it falls in 2 s: h = ½·9.8·2² = 19.6 m. On the Moon (g=1.6) after 2 s it would be only 3.2 m/s.',
    ],
    analogies: [
      'g is like an escalator of speed: every second it adds one "step" of downward velocity, and the gift is exactly the same step for a feather or a boulder — the escalator does not care who rides.',
    ],
    misconceptions: [
      'Heavier objects do NOT fall faster in vacuum — all fall with the same g.',
      'g is not the same everywhere — it varies with latitude and altitude.',
      'g is an acceleration, not a force; weight (mg) is the force it produces.',
    ],
    tryThis:
      'Drop two objects of very different mass through the same height and time them — in air they are close. If you have a vacuum bottle or sealed tube with a feather and a coin, invert it: they land together, proving g is universal.',
    funFacts: [
      'If you dropped a coin from the top of a 130-storey tower, it would strike the ground at over 50 m/s — but a feather in that same vacuum would land at exactly the same moment.',
      'Your weight changes by a fraction of a percent between sea level and a mountain top because g decreases with height.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.weight': {
    conceptId: 'lhs:phys.weight',
    hook:
      'The bathroom scale says 70 — but on the Moon that same body reads about 12, and in a soaring elevator it can feel like pressing ice. Weight is not what you are made of; it is how hard gravity is tugging on you right now. Mass is yours; weight is the deal gravity is making.',
    history:
      'Ancient science understood heaviness but did not separate mass from weight. The key conceptual break emerged over centuries. Galileo and Newton distinguished quantity of matter (mass) from the force gravity exerts (weight). Newton’s second law gave W = mg, and his principle that the same mass feels different pull on different planets made the distinction concrete. The kilogram is fundamentally a unit of mass; weight in newtons is force. In the late 1900s, the difference became practical: a spring scale measures force (weight), while a balance compares mass. By the 20th century the mass/weight distinction was a cornerstone of physics education, though everyday speech still conflates them.',
    figures: [
      {
        name: 'Isaac Newton',
        lifespan: '1643–1727',
        role: 'English mathematician and natural philosopher',
        contribution:
          'Clear distinction between quantity of matter (mass) and the force gravity exerts (weight): W = mg.',
        statement:
          'The weight of a body is the force by which it is impelled downwards by gravity.',
        statementSource: 'Paraphrase of Isaac Newton, Principia (1687)',
      },
      {
        name: 'Galileo Galilei',
        lifespan: '1564–1642',
        role: 'Italian astronomer and physicist',
        contribution:
          'Helped separate quantity of matter from force of gravity through his study of falling bodies.',
        statementSource: 'Paraphrase of Galileo’s Two New Sciences (1638)',
      },
    ],
    timeline: [
      {
        period: '1638',
        event: 'Galileo’s mechanics distinguish matter from gravitational effect.',
        figure: 'Galileo Galilei',
      },
      {
        period: '1687',
        event: 'Newton formalises mass vs weight (W = mg).',
        figure: 'Isaac Newton',
      },
      {
        period: '19th–20th c.',
        event: 'Mass (kg, a mass unit) vs weight (N, a force) become canonical.',
        note: 'Reinforced by SI and relativity.',
      },
    ],
    perspectives: [
      {
        figure: 'Everyday/informal',
        view: 'Weight = how heavy; "I weigh 70 kg."',
        standing: 'Conflates mass and weight',
        note: 'Harmless in trade; wrong in physics.',
      },
      {
        figure: 'Newtonian physics',
        view: 'Weight is the force of gravity on a mass, W = mg.',
        standing: 'The standard model',
        note: 'Weight is a force (vector, N).',
      },
      {
        figure: 'Relativity',
        view: 'Weight is the "apparent weight" in a frame; the physical content is spacetime geometry and proper acceleration.',
        standing: 'Refines the Newtonian picture',
        note: 'Weight varies with acceleration frame.',
      },
    ],
    deepDive: {
      phenomenon: 'The force of gravity on a mass — and why it changes though mass does not',
      intro:
        'Weight is the gravitational force W = mg (a vector toward the planet’s centre). The deep-dive distinguishes it from mass, shows apparent weight in accelerating frames, and notes relativity’s refinement.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Weight is the pull of gravity on you. Mass is how much "stuff" you have. On Earth a 70 kg person has weight about 687 N; on the Moon the same mass weighs only about 112 N because the Moon pulls less. A scale that uses springs shows this force; a balance compares real mass. Weight is a force, measured in newtons; mass is measured in kilograms.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'Weight W = mg, a vector toward the centre (newtons). g varies by location, so weight varies while mass does not. Apparent weight in an accelerating elevator: N − mg = ma → N = m(g+a) when accelerating up (heavier), N = m(g−a) accelerating down (lighter); at free fall N = 0 ("weightless"). Spring scales measure normal/contact force (weight); balances and inertial balances measure mass.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'You separate force from mass in structural loads, transport and payload design: loads are weight (N) = m·g, using standard gravity g₀ = 9.80665 m/s². Aerospace computes apparent weight and g-loads, and calibrates cells in gravity. In geo/satellite and lifting applications, weight changes with altitude; you never size a crane or a beam with mass alone. "Mass" for rocket fuel and "weight" for structural load must stay distinct.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'In relativity, "weight" is the force measured by a scale, which in a frame equals the proper acceleration times the mass; the equivalence principle makes a drop-elevator and far-from-mass identical "weightless" frames. Weight is not an intrinsic property — it is a frame/field-dependent reading. The distinction underpins inertial vs gravitational mass equality, tested by Eötvös-type experiments, and clarifies why "zero gravity" in orbit is really weight-lessness (free fall), not absent gravitation.',
        },
      ],
    },
    whatCameBefore:
      'You need mass, force and g; weight is the force gravity exerts on a mass.',
    connections: [
      'Mass (invariant; weight is variable)',
      'Gravitational acceleration (g → W = mg)',
      'Gravitation (the source of weight)',
    ],
    applications: [
      'Declaring what you "weigh" uses a spring scale that measures force — that is why astronauts report different readings.',
      'Elevator rides: accelerating up feels heavy, accelerating down feels light — apparent weight in action.',
      'Adding cargo: cranes and bridges are designed for weight (force), not mass.',
    ],
    workedExamples: [
      'A 60 kg astronaut on Earth weighs W = 60 × 9.8 = 588 N. On the Moon (g≈1.6) the same person weighs 60 × 1.6 = 96 N — one-sixth — but their 60 kg mass is unchanged. In orbit, free fall makes them "weightless" (scale reads 0) though gravity is still strong: gravity provides the centripetal pull.',
    ],
    analogies: [
      'Mass is the amount of clay you hold; weight is how hard the table presses back because Earth is pulling the clay down. Move the clay to a weaker planet and the clay is still the same lump — only how hard it presses changes.',
    ],
    misconceptions: [
      'Weight and mass are not the same — weight is a force that changes with gravity; mass is invariant.',
      'Being "weightless" in orbit is free fall, not the absence of gravity.',
      'A scale that relies on springs measures weight; a balance measures mass, so balances work on the Moon too.',
    ],
    tryThis:
      'Stand on a bathroom scale in a lift: note the reading as it goes up, cruises, and comes down — it is higher, then normal, then lower. Those are the same forces you feel pressing your feet as apparent weight changes.',
    funFacts: [
      'Crossing from sea level to a mountain you "lose" a little weight (g drops) yet your mass is identical — and so is your health insurance weight target.',
      'The famous "ma" clearing test: a triple-beam balance still gives the same answer on the Moon, because it compares mass, while a spring scale does not.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.temperature': {
    conceptId: 'lhs:phys.temperature',
    hook:
      'Stir a pot of water and one degree is one degree — or is it? Touch the metal lid and the wood handle at the same "temperature" and one feels almost cold. Temperature is not heat and is not "how hot it feels"; it is a measure of how fast the particles are jiggling, and it decides which way heat flows.',
    history:
      'For a long time temperature was a feeling, not a number. The first sealed thermometers appeared in the 1600s; scientists (Galileo, Santorio) made air and liquid thermometers. Daniel Gabriel Fahrenheit built alcohol/mercury thermometers and the Fahrenheit scale (1724); Anders Celsius proposed the centigrade scale (1742, actually with 0 as boiling and 100 as freezing, reversed by Linnaeus). In the 1700s, Joseph Black began distinguishing temperature from amount of heat — the birth of the concept. In 1848, William Thomson (Lord Kelvin) introduced an absolute temperature scale based on thermodynamics, with absolute zero (−273.15 °C) where particle motion is minimal. The kinetic theory then connected temperature to average molecular kinetic energy.',
    figures: [
      {
        name: 'Daniel Gabriel Fahrenheit',
        lifespan: '1686–1736',
        role: 'German-Polish physicist and glassblower',
        contribution:
          'Built reliable mercury thermometers and introduced the Fahrenheit scale (1724).',
        statementSource: 'Paraphrase of Fahrenheit’s thermometer work (1709–1724)',
      },
      {
        name: 'Anders Celsius',
        lifespan: '1701–1744',
        role: 'Swedish astronomer',
        contribution:
          'Proposed the centigrade (Celsius) scale in 1742.',
        statementSource: 'Paraphrase of Celsius’s papers (1742)',
      },
      {
        name: 'William Thomson (Lord Kelvin)',
        lifespan: '1824–1907',
        role: 'British mathematical physicist',
        contribution:
          'Introduced the absolute (Kelvin) temperature scale based on thermodynamics, with true zero at particle-motion minimum.',
        statementSource: 'Paraphrase of Thomson’s absolute-temperature work (1848)',
      },
      {
        name: 'Joseph Black',
        lifespan: '1728–1799',
        role: 'Scottish physician and chemist',
        contribution:
          'Distinguished temperature from amount of heat, and studied latent heat.',
        statementSource: 'Paraphrase of Joseph Black’s lectures on heat (1760s)',
      },
    ],
    timeline: [
      {
        period: '1593–1600s',
        event: 'Early sealed thermometers (Galileo, Santorio).',
      },
      {
        period: '1724',
        event: 'Fahrenheit scale and mercury thermometers.',
        figure: 'Daniel Gabriel Fahrenheit',
      },
      {
        period: '1742',
        event: 'Celsius (centigrade) scale proposed.',
        figure: 'Anders Celsius',
      },
      {
        period: '1848',
        event: 'Kelvin introduces the absolute temperature scale.',
        figure: 'William Thomson (Lord Kelvin)',
      },
    ],
    perspectives: [
      {
        figure: 'Joseph Black (1760s)',
        view: 'Temperature and amount of heat are distinct ideas.',
        standing: 'Foundational',
        note: 'Separated "degrees" from "heat content".',
      },
      {
        figure: 'Fahrenheit / Celsius',
        view: 'Temperature is a reproducible number on a chosen scale.',
        standing: 'Practically essential',
        note: 'Zero points are convention-based.',
      },
      {
        figure: 'Kelvin / kinetic theory',
        view: 'Temperature is an absolute measure tied to average molecular kinetic energy; true zero exists.',
        standing: 'The modern consensus',
        note: 'Kelvin scale makes T a physical, not arbitrary, quantity.',
      },
    ],
    deepDive: {
      phenomenon: 'A measure of average particle jiggling that sets the direction of heat flow',
      intro:
        'Temperature is proportional to average molecular kinetic energy; it is not heat. The deep-dive covers the scales, the distinction from heat, and the physics of "absolute zero."',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Temperature is a measure of how fast the tiny particles in a substance are moving — energetic particles make it hot, calm particles make it cold. It is not the same as heat: heat is energy that moves; temperature is the "how vigorous" reading. It is what decides which way heat flows — always from hotter to colder. We measure it on scales like Celsius, Fahrenheit or Kelvin.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'In kinetic theory, T ∝ mean kinetic energy of molecules: ⟨KE⟩ = (3/2)kT for an ideal gas (k is Boltzmann’s constant). Kelvin scale is absolute: T(K) = T(°C) + 273.15. Heat flows from higher to lower T (second law). Temperature is intensive (same for a big/small sample) while heat is extensive. Thermometers measure a property that changes with T (expansion, resistance), calibrated on a standard.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'You distinguish process temperature from energy for heat exchangers, thermal budgets and process control: temperature is a state variable, heat is an energy transfer. Control loops, sensors (RTD, thermocouple) and calibration to standards (ITS-90) are essential. Thermal design uses T for heat-transfer driving force and for material limits; phase-change and reaction rates are strong functions of T. "Absolute" matters: Rankine/Kelvin eliminate sign errors in gas laws.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Statistical mechanics defines T via β = 1/kT = ∂S/∂U at fixed volume — entropy’s response to energy. Negative temperature is possible for bounded, inverted populations (laser gain). At T→0, quantum effects dominate; the third law forbids reaching absolute zero. At the other extreme, Planck temperatures tie to foundational physics. In relativity, temperature transforms nontrivially; in gravitation, Hawking temperature ∝ black-hole surface gravity — connecting thermodynamics to spacetime.',
        },
      ],
    },
    whatCameBefore:
      'You need the kinetic/thermal picture of matter; temperature quantifies how fast particles move.',
    connections: [
      'Heat (temperature drives its flow)',
      'Thermal energy (related but distinct)',
      'Change of state (phase changes at constant T)',
    ],
    applications: [
      'Fever thermometers read body temperature to judge health.',
      'Engine cooling manages temperature so materials and combustion stay in range.',
      'Cooking follows target food temperatures, which are not the same as energy.',
    ],
    workedExamples: [
      'A 1.0 kg iron block and a 1.0 kg water block both at 20°C have the SAME temperature, yet different amounts of thermal energy — water holds far more because it needs 4,200 J per kg·K vs iron’s ~450 J per kg·K. Same T, very different energy content: temperature is not heat.',
    ],
    analogies: [
      'Temperature is the "excitement level" of a crowd; heat is the total noise they produce. Two different-size crowds can have the same excitement (same temperature) but produce very different total sound (different heat/energy).',
    ],
    misconceptions: [
      'Temperature is not heat — it is a reading of particle vigour; heat is energy in transit.',
      '"You can’t add cold" — cold is just lower temperature; heat always flows hot to cold.',
      'Celsius/Fahrenheit have arbitrary zeroes; Kelvin is absolute and can’t go below 0.',
    ],
    tryThis:
      'Put a metal spoon and a wooden spoon in the same cup of hot water; the metal feels hotter to touch even though both are the same temperature — because the metal conducts heat out of your skin faster. Same temperature, different feel.',
    funFacts: [
      'Absolute zero (−273.15 °C) is the point where, in classical theory, particles would stop moving — quantum motion can never be fully removed.',
      'The nearest place to a perfect vacuum, space, has an extremely low radiation temperature (~2.7 K) — the faint glow of the Big Bang.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.thermal-energy': {
    conceptId: 'lhs:phys.thermal-energy',
    hook:
      'A warm coffee has thermal energy; so does a bathtub of tepid water — and the bathtub may hold far more. Thermal energy is the sum total of the jiggling and pulling inside a material. Temperature says how fast; thermal energy says how much.',
    history:
      'Heat was long thought to be a fluid ("caloric") that flowed from hot to cold. In the 1790s, Benjamin Thompson (Count Rumford) showed cannon boring produced nearly endless heat — not a finite fluid. James Prescott Joule measured the mechanical equivalent of heat in the 1840s, showing heat and work are forms of the same energy. The kinetic theory then recognised thermal energy as the sum of microscopic kinetic and potential energy of particles. In the 20th century, statistical mechanics (Boltzmann, Gibbs) made "internal energy" — of which thermal energy is the random part — a precisely defined thermodynamic state function.',
    figures: [
      {
        name: 'James Prescott Joule',
        lifespan: '1818–1889',
        role: 'English physicist',
        contribution:
          'Measured the mechanical equivalent of heat, showing heat/work are interconvertible energy — underpinning the concept of internal energy.',
        statementSource: 'Paraphrase of Joule’s heat-work experiments (1843–1850)',
      },
      {
        name: 'Ludwig Boltzmann',
        lifespan: '1844–1906',
        role: 'Austrian physicist',
        contribution:
          'Founded statistical mechanics, linking macroscopic thermal energy to the statistics of microscopic particle motion.',
        statementSource: 'Paraphrase of Boltzmann’s statistical mechanics (1870s–1880s)',
      },
      {
        name: 'Benjamin Thompson (Count Rumford)',
        lifespan: '1753–1814',
        role: 'British-American physicist',
        contribution:
          'Showed heat is generated without limit by mechanical work (cannon boring), discrediting the caloric theory.',
        statementSource: 'Paraphrase of Rumford’s cannOn-boring experiment (1798)',
      },
    ],
    timeline: [
      {
        period: '1798',
        event: 'Rumford shows unlimited heat from friction (work→heat).',
        figure: 'Count Rumford',
      },
      {
        period: '1840s',
        event: 'Joule measures the mechanical equivalent of heat.',
        figure: 'James Prescott Joule',
      },
      {
        period: '1870s–1880s',
        event: 'Boltzmann founds statistical mechanics of thermal energy.',
        figure: 'Ludwig Boltzmann',
      },
    ],
    perspectives: [
      {
        figure: 'Caloric theorists',
        view: 'Heat is a stored fluid that flows.',
        standing: 'Superseded',
        note: 'Failed the friction test.',
      },
      {
        figure: 'Rumford / Joule',
        view: 'Heat and work are convertible forms of energy.',
        standing: 'Correct — energy basis',
        note: 'Energy is conserved.',
      },
      {
        figure: 'Statistical mechanics',
        view: 'Thermal energy is the microscopic kinetic + potential internal energy of particles.',
        standing: 'The modern consensus',
        note: 'Distinct from temperature and from heat transfer.',
      },
    ],
    deepDive: {
      phenomenon: 'The total internal motion-and-bonding energy of a material',
      intro:
        'Thermal energy is the internal energy associated with particles’ random motion and interactions: kinetic + potential. The deep-dive distinguishes it from temperature and heat, and from ordered work.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Thermal energy is the total energy inside a material due to its particles moving and pulling on each other. A bigger or more massive object can hold more thermal energy than a small hot one. It is related to but different from temperature: temperature says how fast, thermal energy says how much total. You add thermal energy to melt ice, boil water, or warm your hands.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'Thermal energy is part of internal energy U: the kinetic and potential energy of the particles. It is extensive (∝ mass), unlike temperature. Change via heating: Q = mcΔT (no phase change) or Q = mL (phase change). U is a state function; by the first law ΔU = Q − W, so thermal energy can be changed by heat in/out or by work. Ideal gas: U depends only on T (U = (f/2)NkT).',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'You use internal energy U and enthalpy H = U + pV in energy balances and process design. Sensible heat (mcΔT) and latent heat (mL) change thermal energy during heating and phase change. Storage systems (water, molten salt, PCM) bank thermal energy by these means; heat-engine cycles convert part of it to work while rejecting the rest. Insulation sizing and thermal mass design are thermal-energy engineering.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'In statistical mechanics, U = Σ_i p_i E_i over microstate energies; ⟨E⟩ defines temperature via ∂S/∂U. Thermal energy is the "disordered" part of energy, distinct from macroscopic work and ordered kinetic energy. Heat Q and work W are process path functions; U is a state function, so thermodynamic cycles and the First Law ΔU = Q − W are exact. At low T, quantum effects (phonons, Debye heat capacity ∝T³) reshape how thermal energy stores in solids.',
        },
      ],
    },
    whatCameBefore:
      'You need temperature, heat, and the kinetic idea of matter; thermal energy is the total internal energy those describe in aggregate.',
    connections: [
      'Temperature (related but distinct)',
      'Heat (an energy transfer that changes it)',
      'Change of state (latent energy at constant T)',
    ],
    applications: [
      'Storing heat in hot water tanks and insulated walls banks thermal energy for later.',
      'Cooking transfers thermal energy into food; it is the energy (not just temperature) that matters for volume.',
      'Molten-salt thermal storage helps solar plants deliver power after sunset.',
    ],
    workedExamples: [
      '1.0 kg of water at 40°C holds roughly 4,200 J of thermal energy per degree above freezing; it would take Q = mcΔT = 1.0×4200×(40−0) = 168,000 J to reach it from 0°C. Melting the same ice to water (latent heat ~334 kJ/kg) requires 334,000 J — nearly double — even though the temperature stays 0°C.',
    ],
    analogies: [
      'Thermal energy is the total water in a reservoir; temperature is how full each pipe is per unit. Two reservoirs can have the same water level (temperature) while holding hugely different total volumes (thermal energy) because one is far larger.',
    ],
    misconceptions: [
      'Thermal energy is not temperature — it is the total, which depends on mass.',
      'Thermal energy is not the same as heat — heat is the energy *transferred*; thermal energy is what is stored.',
      'Changing phase uses a lot of thermal energy with no temperature change (latent heat).',
    ],
    tryThis:
      'Boil a small and a large pan of water to the same temperature: same T, but the big pan has absorbed far more thermal energy. Time them on the same stove and see the big one take much longer — it is collecting more energy at the same temperature.',
    funFacts: [
      'A warm lake contains vastly more thermal energy than a boiling kettle despite being far cooler — volume beats temperature.',
      'The Sun’s energy reaching Earth is mostly thermal energy spread by radiation, warmth measured in kelvins yet carrying exawatts of power.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.change-of-state': {
    conceptId: 'lhs:phys.change-of-state',
    hook:
      'Boiling water stays stubbornly at 100°C while you pour in energy; melting ice refuses to get warmer until the last crystal is gone. When matter changes state, it swallows energy without changing temperature — energy used to break the bonds holding particles together. That hidden energy, latent heat, explains why ice is such a stoic antagonist of a hot kitchen.',
    history:
      'The idea that phase changes absorb or release heat at constant temperature was established by Joseph Black in the 1760s. Studying ice melting and water boiling, he showed a fixed quantity of heat is needed just to change state — which he called latent heat. This corrected the earlier view that temperature always rises with added heat. Latent heat and the distinction between temperature and heat content became foundations of thermodynamics. Later, the phase concept (solid/liquid/gas) and phase diagrams were unified, and phase changes were understood as breaking or forming intermolecular bonds rather than just heating.',
    figures: [
      {
        name: 'Joseph Black',
        lifespan: '1728–1799',
        role: 'Scottish physician and chemist',
        contribution:
          'Established the concept of latent heat: heat absorbed (or released) during a change of state at constant temperature.',
        statement:
          '…the heat … employed in converting ice into water … is latent, or hid, and … insensible to the thermometer.',
        statementSource: 'Paraphrase of Joseph Black’s lectures on latent heat (1760s)',
      },
      {
        name: 'James Prescott Joule',
        lifespan: '1818–1889',
        role: 'English physicist',
        contribution:
          'Measured energy quantitatively, linking latent-heat ideas to the conservation of energy.',
        statementSource: 'Paraphrase of Joule’s energy work (1840s–1850s)',
      },
    ],
    timeline: [
      {
        period: '1760s',
        event: 'Black explains latent heat of fusion/vaporisation.',
        figure: 'Joseph Black',
      },
      {
        period: '1840s+',
        event: 'Energy conservation consolidates latent-heat ideas.',
        figure: 'James Prescott Joule',
      },
      {
        period: '19th c.',
        event: 'Phase diagrams unify solid/liquid/gas behaviour.',
      },
    ],
    perspectives: [
      {
        figure: 'Earlier thermometric view',
        view: 'Adding heat always raises temperature.',
        standing: 'Incomplete',
        note: 'Fails exactly at phase change.',
      },
      {
        figure: 'Joseph Black (1760s)',
        view: 'Phase change absorbs/releases heat at constant temperature — latent heat.',
        standing: 'Correct and foundational',
        note: 'Temperature is not a heat meter.',
      },
      {
        figure: 'Modern phase-transition theory',
        view: 'Phase changes involve latent heat and, at critical points, symmetry changes; bonds reorganise.',
        standing: 'The modern consensus',
        note: 'Latent heat is one face of a richer physics.',
      },
    ],
    deepDive: {
      phenomenon: 'Phase transition at constant temperature, absorbing latent heat',
      intro:
        'Change of state (melting, boiling, condensation, freezing, sublimation) happens at a fixed temperature while latent heat Q = mL is absorbed or released. The deep-dive unpacks why temperature plateaus.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Matter can be solid, liquid or gas — its state. When it changes state, like ice melting or water boiling, it stays at the same temperature while using (or giving out) energy. That energy goes into breaking (or forming) the bonds between particles, not into making them move faster. That is why ice sits at 0°C absorbing heat, and boiling water stays at 100°C though you keep adding energy.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'Latent heat: Q = mL, where L is the latent heat (J/kg) — e.g. L_fusion(water) ≈ 334 kJ/kg, L_vaporisation ≈ 2260 kJ/kg. During the transition T is constant; energy changes internal potential energy (bonding), not kinetic. Specific latent heat values differ for fusion vs vaporisation. Heating a substance: Q = mcΔT in a single phase, then a flat region (latent) during the change, then mcΔT again. Cooling reverses it.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'Phase-change engineering is central: vaporisation absorbs heat (refrigeration, steam cycles), condensation rejects it (power plants, distillation). Heat exchangers, boilers and condensers are designed around latent heat and phase boundaries. Thermal storage via PCMs banks large energy at nearly constant temperature. Pressure changes shift transition temperatures (boiling point rises with pressure), so you design for the operating pressure. Phase diagrams (Clausius–Clapeyron) guide that.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Latent heat relates to entropy discontinuity at a first-order transition: ΔS = L/T. The Clausius–Clapeyron relation dP/dT = L/(TΔV) links the phase boundary to latent heat and volume change. Condensation/vaporisation is a second-order effects surface; near the critical point, differences vanish and order parameters change (second-order transitions, Landau theory). Statistical mechanics explains latent heat as the energy cost of rearranging symmetries of molecular ordering.',
        },
      ],
    },
    whatCameBefore:
      'You need heat, temperature, and thermal energy; a phase change is where these interact in a special, constant-temperature way.',
    connections: [
      'Heat (Q = mL)',
      'Temperature (constant during the change)',
      'Thermal energy (latent energy goes into bonds)',
    ],
    applications: [
      'Sweat cooling uses vaporisation of water to pull heat from your skin.',
      'Refrigerators and air conditioners absorb heat in an evaporator and release it in a condenser.',
      'Distillation separates liquids by controlled boiling-point changes.',
    ],
    workedExamples: [
      'To melt 0.5 kg of ice at 0°C: Q = mL = 0.5 × 334,000 = 167,000 J, but the temperature stays 0°C. Then to warm the resulting water to 10°C adds Q = mcΔT = 0.5 × 4200 × 10 = 21,000 J. Notice melting alone took 8× the energy of warming by 10°C — and yet the ice never got hotter while melting.',
    ],
    analogies: [
      'Changing state is like unstacking bricks held by magnets: to pull a whole layer apart you spend energy overcoming the magnets, and only after the layer is free do the bricks move "faster." At the moment of unstacking, temperature (how fast) stays put while you pour in the energy to break every magnet.',
    ],
    misconceptions: [
      'Adding heat does not always raise temperature — during a phase change it is all latent.',
      'Boiling water is still 100°C even while you keep adding huge energy; it is not getting hotter, it is turning more to steam.',
      'Melting and boiling need different energies (latent heat of fusion ≪ vaporisation), so states are not all "the same amount of change".',
    ],
    tryThis:
      'Watch an ice cube melt in a warm drink: it stays at 0°C while the drink cools. Then boil water on a timer: it reaches 100°C and stays there as you keep the heat on — the plateau you see is latent heat being absorbed, not temperature rising.',
    funFacts: [
      'Water’s very large latent heat of vaporisation is why sweating keeps you cool so effectively.',
      'Ice and steam both demand a huge energy "toll" at constant temperature — the reason a steam burn is so much worse than a boiling-water burn (steam releases latent heat as it condenses on you).',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.electromagnetic-spectrum': {
    conceptId: 'lhs:phys.electromagnetic-spectrum',
    hook:
      'Your eyes see only a single window of light, yet all around you travel radio waves, microwaves, infrared, ultraviolet, X-rays and gamma rays — the same kind of wave at different frequencies. The rainbow you can see is a sliver of an enormous invisible spectrum that someone had to discover one band at a time.',
    history:
      'For most of history "light" was just what the eye sees. The break came when scientists realised different radiant phenomena are the same thing at different wavelengths. In 1800 William Herschel discovered infrared just beyond the red end (he found a thermometer warmed in the dark region past red). In 1801 Johann Wilhelm Ritter found ultraviolet just past violet. In 1865 James Clerk Maxwell showed light is an electromagnetic wave, unifying light with radio and predicting the whole spectrum. Heinrich Hertz produced and detected radio waves in 1888. X-rays were discovered by Wilhelm Röntgen in 1895; radioactivity revealed gamma rays (Rutherford, 1900s); microwaves came with radar in the 1940s. Today the spectrum from radio to gamma is one physical scale through c = fλ only.',
    figures: [
      {
        name: 'William Herschel',
        lifespan: '1738–1822',
        role: 'German-British astronomer',
        contribution:
          'Discovered infrared radiation (1800) by finding warming beyond the red end of the visible spectrum.',
        statementSource: 'Paraphrase of Herschel’s 1800 experiments with a thermometer in prism light',
      },
      {
        name: 'Johann Wilhelm Ritter',
        lifespan: '1776–1810',
        role: 'German physicist',
        contribution:
          'Discovered ultraviolet radiation (1801) beyond the violet end, using chemical (photographic) action.',
        statementSource: 'Paraphrase of Ritter’s ultraviolet experiments (1801)',
      },
      {
        name: 'James Clerk Maxwell',
        lifespan: '1831–1879',
        role: 'Scottish physicist',
        contribution:
          'Showed light is an electromagnetic wave and predicted the full EM spectrum unified by c = fλ.',
        statement:
          'Light itself … we may hope to explain by this theory as an electromagnetic disturbance.',
        statementSource: 'Paraphrase of Maxwell’s electromagnetic theory (1865)',
      },
      {
        name: 'Heinrich Hertz',
        lifespan: '1857–1894',
        role: 'German physicist',
        contribution:
          'Generated and detected radio waves (1888), confirming Maxwell’s electromagnetic prediction outside the visible.',
        statementSource: 'Paraphrase of Hertz’s radio-wave experiments (1888)',
      },
    ],
    timeline: [
      {
        period: '1800',
        event: 'Herschel discovers infrared.',
        figure: 'William Herschel',
      },
      {
        period: '1801',
        event: 'Ritter discovers ultraviolet.',
        figure: 'Johann Wilhelm Ritter',
      },
      {
        period: '1865',
        event: 'Maxwell unifies light and all EM waves via c = fλ.',
        figure: 'James Clerk Maxwell',
      },
      {
        period: '1888',
        event: 'Hertz produces radio waves.',
        figure: 'Heinrich Hertz',
      },
      {
        period: '1895',
        event: 'Röntgen discovers X-rays.',
        figure: 'Wilhelm Röntgen',
      },
    ],
    perspectives: [
      {
        figure: 'Pre-1800 view',
        view: 'Light is just the visible spectrum.',
        standing: 'Incomplete',
        note: 'No notion of invisible radiation.',
      },
      {
        figure: 'Maxwell–Hertz (1860s–80)',
        view: 'All EM radiation is the same phenomenon at different wavelengths by c = fλ.',
        standing: 'The unifying consensus',
        note: 'Radio and light are the same wave.',
      },
      {
        figure: 'Quantum view',
        view: 'Each band also consists of photons of energy E = hf; higher frequency = more energetic photons.',
        standing: 'Complements the wave view',
        note: 'Explains why X-rays and gamma are penetrating.',
      },
    ],
    deepDive: {
      phenomenon: 'The full range of electromagnetic radiation, one physical scale',
      intro:
        'The EM spectrum spans radio → microwave → infrared → visible → ultraviolet → X-ray → gamma, ordered by wavelength/frequency with c = fλ constant in vacuum. The deep-dive links band to photon energy and uses.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Light, radio, Wi-Fi, X-rays and microwaves are all the same kind of wave — just with different frequencies (how fast it wiggles) and wavelengths (distance between crests). Your eyes only catch the small "visible" part. Higher frequency means more energy in each wave, which is why X-rays can pass through tissue but radio waves cannot. A complete order, low to high frequency: radio, microwave, infrared, visible, ultraviolet, X-ray, gamma.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'All EM waves travel at c in vacuum and satisfy c = fλ. Frequency increases (wavelength decreases) across: radio (λ > ~1 mm), microwave, infrared, visible (~400–700 nm), ultraviolet, X-ray, gamma. Photon energy E = hf = hc/λ is directly proportional to frequency — so gamma photons are the most energetic and radio the least. Absorption by atmosphere selects which bands reach the ground (UV absorbed by ozone, etc.).',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'Each band has distinct engineering: radio/communications (assigned bands, antennas sized to λ), microwaves (radar, satellite, heating), infrared (thermal imaging, remote sensing, fibre), visible (optics, imaging), UV (sterilisation, lithography), X-ray (medical/nondestructive imaging), gamma (nuclear/medical therapy). Material response differs by band; shielding and safety (ionising vs non-ionising) divide at UV/higher.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'The whole EM spectrum is described by Maxwell’s equations and quantised into photons E = hf. Higher-frequency radiation is more penetrating because photon energy exceeds binding energies of matter (ionising). The spectrum connects astrophysics: cosmic microwave background (2.7 K), and at the high end, gamma-ray bursts. Dispersion, Doppler and gravitational redshifts shift the observed band, and spectroscopy reads the translated spectrum to learn the source.',
        },
      ],
    },
    whatCameBefore:
      'You need light, waves (frequency/wavelength), and the photon idea; the EM spectrum is the complete household of this one kind of wave.',
    connections: [
      'Light (the visible band)',
      'Frequency/wavelength (c = fλ orders the spectrum)',
      'Energy (E = hf; higher frequency = more energetic)',
    ],
    applications: [
      'Radio and mobile networks broadcast on assigned low-frequency bands.',
      'X-rays image bones because their photons pass through soft tissue but are blocked by bone.',
      'Infrared cameras "see" heat in the dark for rescue and inspection.',
      'Gamma radiation targets tumours in radiotherapy.',
    ],
    workedExamples: [
      'A radio station at 100 MHz has λ = c/f = (3×10⁸)/(1.0×10⁸) = 3.0 m. Visible green light at 500 nm has f = c/λ = (3×10⁸)/(5.0×10⁻⁷) = 6×10¹⁴ Hz. A gamma ray at 0.01 nm would have f = 3×10¹⁹ Hz — vastly more energetic photons, which is why gamma is penetrating.',
    ],
    analogies: [
      'The EM spectrum is one staircase of waves where each step up raises the frequency and the energy of each "bundle." Your eyes only open a tiny door on one mid landing; the other floors hum with radio, X-rays and the rest, all the same staircase.',
    ],
    misconceptions: [
      'Radio, X-rays and light are not different kinds of things — they are the same EM wave at different frequencies.',
      '"Light" is not just what you see; visible is one narrow band.',
      'Higher frequency does not mean faster travel (all travel at c) — it means shorter wavelength and more energy per photon.',
    ],
    tryThis:
      'Turn on an FM radio while your phone sends a message nearby — the interference you hear is radio waves (your phone’s GHz signal) interacting with the radio’s tuned band, visible proof of invisible EM radiation sharing your air.',
    funFacts: [
      'Infrared was found by a thermometer sitting just past the red end of a rainbow — William Herschel noticed the unseen warmth.',
      'The entire cosmic microwave background — the afterglow of the Big Bang — is microwave radiation at 2.7 K, one more band of the same spectrum.',
    ],
    estimatedTimeMinutes: 16,
  },
};