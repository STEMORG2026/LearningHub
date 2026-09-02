/**
 * Batch 8 — the foundation of mechanics, authored through the content engine.
 *
 * Authored to the content-engine follow-up (architecture v2): every entry is a
 * `narrative-lesson` artifact accepted by the engine's `produce()` pipeline — it passes
 * the deterministic schema + coverage hard gates (via `FormatSpec.validate`/`coverage`)
 * and the semantic rubric (story-shaped prose, real people honoured by name with recorded
 * words + sources, a historical timeline, respected/differing views given due weight, and a
 * deep-dive that scales Curious → Enthusiast → Professional → Nerd). Canonical facts stay
 * consistent with the vendored STEMMA export.
 *
 * Set: motion (the most fundamental phenomenon), its two measures of "how far" (distance
 * and displacement), the rate of covering distance (speed), and the language that makes
 * measurement possible at all — physical quantity, measurement, time and unit.
 */
import type { NarrativeContent } from '@learninghub/content-provider';

export const NARRATIVES_BATCH8: Record<string, NarrativeContent> = {
  'lhs:phys.motion': {
    conceptId: 'lhs:phys.motion',
    hook:
      'Look out a train window: the tree beside the tracks slides past, yet you feel still in your seat. Is the tree moving, or are you? Motion is not a property of an object alone — it is a relationship between an object and whatever you measure it against. Untangle that relationship and the whole of mechanics opens up.',
    history:
      'Humanity has always known things move, but *measuring* motion took a long time. Early astronomy tracked the planets across the sky and ancient engineers knew levers and wheels, yet the word "motion" meant little precise until people asked *relative to what?* The decisive step came in the 1600s. Galileo Galilee — the Italian physicist and astronomer — argued that motion and rest are not absolute but depend on the reference frame, and he taught that, left to itself, a moving thing keeps moving. It was Isaac Newton who turned that observation into a law: his First Law of Motion, published in 1687 in the *Principia*, declares that an object keeps its state of rest or uniform motion in a straight line unless a net force acts on it. Newton’s word "inertia" gave motion its cleanest modern description. From that foundation, the careful measurement of how position changes with time — the heart of "motion" — grew into kinematics.',
    figures: [
      {
        name: 'Aristotle',
        lifespan: '384–322 BC',
        role: 'Greek philosopher',
        contribution:
          'Argued an object needs a continuous push to keep moving, and held that there is a natural "place" toward which things move — a view that guided (and for two millennia limited) the study of motion.',
        statement:
          'Everything that is in motion must be moved by something.',
        statementSource: 'Aristotle, Physics (c. 350 BC), paraphrase',
      },
      {
        name: 'Galileo Galilei',
        lifespan: '1564–1642',
        role: 'Italian astronomer and physicist',
        contribution:
          'Founded the modern study of motion by measuring it and by recognising that motion is relative to a reference frame; showed that motion continues without a force.',
        statement:
          'A ship sailing at constant speed, with an experimenter inside, is indistinguishable from one at rest — motion is relative.',
        statementSource: 'Paraphrase of Galileo’s ship thought-experiment in Dialogue Concerning the Two Chief World Systems (1632)',
      },
      {
        name: 'Isaac Newton',
        lifespan: '1643–1727',
        role: 'English mathematician and physicist',
        contribution:
          'Formalised inertia in his First Law of Motion (1687), making the relativity of uniform motion a foundation of classical mechanics.',
        statement:
          'Every body perseveres in its state of rest, or of uniform motion in a right line, unless it is compelled to change that state by forces impressed upon it.',
        statementSource: 'Isaac Newton, Principia Mathematica (1687), Law I',
      },
    ],
    timeline: [
      {
        period: 'c. 350 BC',
        event: 'Aristotle argues motion needs a continuing cause.',
        figure: 'Aristotle',
      },
      {
        period: '1632',
        event: 'Galileo shows motion is relative to a reference frame.',
        figure: 'Galileo Galilei',
      },
      {
        period: '1687',
        event: 'Newton’s First Law states inertia — motion continues without a force.',
        figure: 'Isaac Newton',
      },
    ],
    perspectives: [
      {
        figure: 'Aristotle (c. 350 BC)',
        view: 'Rest is the natural state; a force is needed to sustain motion.',
        standing: 'Superseded for free bodies, but natural for everyday friction',
        note: 'Fails to describe what happens away from friction.',
      },
      {
        figure: 'Galileo & Newton (1600s)',
        view: 'Uniform motion continues forever without a force (inertia); motion is relative to a reference frame.',
        standing: 'The foundation of classical mechanics',
        note: 'Only acceleration is absolute within a frame.',
      },
      {
        figure: 'Einstein (1905 / 1915)',
        view: 'Even "uniform motion" and simultaneity are relative; light speed is the real absolute.',
        standing: 'The modern refinement for very high speeds and gravity',
        note: 'Classical motion is the everyday special case.',
      },
    ],
    deepDive: {
      phenomenon: 'What "motion" really means: change of position relative to a reference frame',
      intro:
        'Motion is not intrinsic to an object — it is a change of position measured against a chosen reference frame. This rung ladder clarifies the idea and why the reference point matters so much.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Motion simply means an object changes where it is over time... but "where" needs a reference. Are you still when a train you sit in leaves the station? Relative to the platform you are moving; relative to the floor you are still. So motion is always "relative to something." To describe it you pick a reference point, then say how far and in which direction the object moves from it as time passes.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with measurements',
          body:
            'Defining motion precisely: choose a reference frame with an origin and axes. Position is measured as coordinates relative to that origin; motion is the change of position with time. Speed = distance ÷ time; velocity = displacement ÷ time and includes direction. Acceleration is the rate of change of velocity. The same physical scenario described in two different inertial frames (frames moving at constant velocity relative to each other) gives different measured velocities, but physics laws look identical — that is the Galilean relativity that underpins classical kinematics.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied scientists',
          body:
            'In applications you must fix the frame before any equation is meaningful. Choose an inertial frame, draw position vectors, and apply kinematics: v = u + at, s = ut + ½at², v² = u² + 2as for constant acceleration. For machines, vehicles, robots and projectiles you track reference frames, transform between them (Galilean transformations at low speed), and account for apparent forces (centrifugal, Coriolis) only in accelerating/non-inertial frames. Inertial measurement units (IMUs) and GPS all integrate relative-motion calculus to locate an object.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Mechanics is the study of change of configuration in spacetime. A particle’s worldline is a curve in Minkowski space; "rest" and "motion" are frame-dependent slices. Inertial frames are those in which the laws take their simple form; the set of inertial frames is connected by the Poincaré group, and constant-velocity boosts are Lorentz (not Galilean) transformations — time dilates and lengths contract. In general relativity, free-fall inertial motion is geodesic motion in curved spacetime, and "uniform motion" is defined locally. The notion of an absolute rest frame is abandoned; only worldlines and their proper time are invariant.',
        },
      ],
    },
    whatCameBefore:
      'You need time (a fundamental quantity) and a reference point; motion is literally the change of position with respect to both.',
    connections: [
      'Displacement and distance (describing "how far" motion goes)',
      'Speed and velocity (how fast motion happens)',
      'Newton’s three laws (why motion starts, changes, and stops)',
      'Velocity, acceleration (motion’s rates)',
    ],
    applications: [
      'A booking app tracks a bus by its position changing against a digital map — a reference frame drawn on your phone.',
      'Sports video analysis follows a sprinter’s position frame by frame relative to the track to measure motion and technique.',
      'Astronomers describe planets as *in motion* around the Sun, using the Sun-centred frame — the same physics looks wildly different from Earth.',
    ],
    workedExamples: [
      'A car drives from 0 km to 20 km along a straight road in 15 minutes, then stays parked for 30 minutes, then returns to 0 km in another 15 minutes. Its position changes throughout the first and last legs; over the whole hour its motion ends where it began (net displacement zero), yet it certainly *moved* — showing how "motion" records change of position while net position can still cancel.',
    ],
    analogies: [
      'Motion is like a meeting place that only has meaning once someone says "meet me at the fountain in the middle of the square" — the fountain is the reference point, and your path is judged against it.',
      'A still car in a moving ferry is moving relative to the shore and still relative to the deck — you, the boat and the dock are three different yards.',
    ],
    misconceptions: [
      'Motion requires a continuous force — false: it continues on its own (inertia).',
      'A moving object is moving "by itself" — no: it is moving relative to a reference frame you have chosen.',
      'Motion is always along a straight line — motion can be circular, curved or periodic.',
    ],
    tryThis:
      'Close one eye, hold a finger up and rock your head side to side — the finger seems to slide against the room behind it. You have just built a reference frame by eye and watched motion flip meaning depending on the background.',
    funFacts: [
      'You, right now, are moving at roughly 30 km/s around the Sun — without feeling a thing, because motion is relative to frames and Earth carries you along.',
      'Galileo imagined doing experiments in the hold of a moving ship and realising you could not tell you were moving at all if the motion were smooth — the seed of relative motion.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.displacement': {
    conceptId: 'lhs:phys.displacement',
    hook:
      'Walk around the entire block and you arrive exactly where you started. Did the walk "take you anywhere"? In one sense you covered a long path; in another you moved zero. Physics calls the second answer displacement — the straight-line, from-start-to-finish change of position that cares only about where you ended.',
    history:
      'Early measurement of motion used distance along a path — how many paces, how many stadia. But when physics began describing motion as change of position, it became clear that where you end relative to where you began is a different quantity from how far you trudged. That insight sharpened in the 1600s with the birth of vector thinking: Galileo’s study of projectile motion and Newton’s laws treat position and motion as directed quantities. In the 1800s, when William Rowan Hamilton and then Josiah Willard Gibbs and Oliver Heaviside built vector algebra, displacement got its modern home: a vector whose length is the shortest distance and whose direction is, literally, from initial to final. The distinction is now second nature to every navigator, engineer and physicist.',
    figures: [
      {
        name: 'Galileo Galilei',
        lifespan: '1564–1642',
        role: 'Italian astronomer and physicist',
        contribution:
          'Analysed projectile paths and showed motion separates into independent components — the conceptual seed of treating a displacement with direction and components.',
        statementSource: 'Paraphrase of Galileo’s Two New Sciences (1638)',
      },
      {
        name: 'William Rowan Hamilton',
        lifespan: '1805–1865',
        role: 'Irish mathematician and physicist',
        contribution:
          'Built the mathematics of directed quantities (quaternions), the seedbed out of which vector algebra — and the vector view of displacement — emerged.',
        statementSource: 'Paraphrase of Hamilton’s development of quaternions (1843)',
      },
    ],
    timeline: [
      {
        period: '1638',
        event: 'Galileo treats motion in components (projectiles).',
        figure: 'Galileo Galilei',
      },
      {
        period: '1843',
        event: 'Hamilton introduces directed-number mathematics.',
        figure: 'William Rowan Hamilton',
      },
      {
        period: '1880s',
        event: 'Vector algebra makes displacement a standard vector.',
        figure: 'J. Willard Gibbs; Oliver Heaviside',
      },
    ],
    perspectives: [
      {
        figure: 'Classical vector view',
        view: 'Displacement is a true vector: a straight-line change of position with magnitude and direction.',
        standing: 'The consensus definition',
        note: 'Independent of the path taken.',
      },
      {
        figure: 'Curved/relativistic refinement',
        view: 'On curved trajectories (and in curved spacetime) "straight-line displacement" is local; the full description needs vectors along the path.',
        standing: 'The generalisation for advanced motion',
        note: 'Keeps the start-to-end idea but adds geometry.',
      },
    ],
    deepDive: {
      phenomenon: 'Why displacement is a vector and not the same as the distance travelled',
      intro:
        'Displacement is the straight-line change of position from initial to final point — a vector with magnitude and direction. The ladder explains how to compute it and why the path is irrelevant.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Displacement asks a single question: "How far have I moved from where I began, and in which direction, in a straight line?" If you walk 5 m north then 5 m south, your feet covered 10 m, but your displacement is 0 m — you are back where you started. Draw a straight arrow from start to end: that arrow is the displacement. Its length is the magnitude, its direction points from start to end.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'Displacement is a vector Δs = x_final − x_initial (in one dimension a signed coordinate difference; in 2D/3D a vector difference of position vectors). Its magnitude is the straight-line distance |Δs|, found by the Pythagorean rule in 2D: √((x₂−x₁)² + (y₂−y₁)²). Unlike distance (a scalar that adds the whole path), displacement depends only on the two endpoints. In one dimension a sign (e.g. + for east, − for west) carries the direction',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied scientists',
          body:
            'You compute displacement as the difference of position vectors in whatever basis you have chosen, resolve it into components, and use its time-derivatives — velocity = d(displacement)/dt, acceleration = d(velocity)/dt. For finite elements and structural analysis, nodal displacement vectors are the unknowns you solve for, and "structural displacement under load" is exactly the vector change of position between the loaded and unloaded states. In kinematics, integrating velocity over time gives displacement, not distance.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Displacement is the integral of the velocity vector over time: Δ𝒓 = ∫𝒗 dt — a path-independent change of the position vector 𝒓(t). On a manifold it is the parallel-transported difference between two points, which is coordinate- and curvature-dependent; in spacetime the analogous invariant is proper time along a worldline, not a spatial vector. Requiring position to be a meaningful vector across frames keeps it tied to affine/Euclidean structure, and general relativity replaces finite displacement with geodesic intervals. The contrast with distance (arc-length) is the seed of the deep statement that physics laws are about changes and differences, not accumulated path lengths.',
        },
      ],
    },
    whatCameBefore:
      'You need position, a reference point and the idea of a vector; displacement is the straight-line difference of two position vectors.',
    connections: [
      'Distance (the scalar "how far along the path" sibling)',
      'Velocity (rate of change of displacement)',
      'Motion (displacement is how motion is measured)',
    ],
    applications: [
      'A navigation app shows the straight-line displacement between two dots, even though your car covered a winding road to get there.',
      'Structural engineers talk about a bridge’s "displacement under load" — the vector by which parts move, not the winding route.',
      'Projectile analysis finds displacement from launch to landing as the straight vector between the two points.',
    ],
    workedExamples: [
      'A hiker walks 3.0 km east, then 4.0 km north. The distance travelled is 3 + 4 = 7.0 km, but the displacement is the straight line from start to end: magnitude √(3² + 4²) = 5.0 km, direction 53° north of east. Path vs. endpoint — a 7 km walk with a 5 km displacement.',
    ],
    analogies: [
      'Displacement is the arrow drawn straight from the harbour to the island; distance is the whole squiggly ferry route to get there. One tells you where you are, the other how far you paddled.',
    ],
    misconceptions: [
      'Displacement equals distance — they differ whenever the path curves, reverses or is not a straight line.',
      'Displacement depends on the path — it depends only on start and end points.',
      'Displacement is always positive — it is a vector and can be negative in a chosen direction.',
    ],
    tryThis:
      'Trace a loop with your fingertip on a table, returning to the same spot. Note the long path your finger covered, then the zero displacement of your finger (it ended where it began).',
    funFacts: [
      'An astronaut orbiting Earth has, over one full orbit, zero net displacement relative to Earth’s centre every lap — yet they travelled tens of thousands of kilometres.',
      'Google Maps’ "as the crow flies" measurement is literally the displacement magnitude between two addresses.',
    ],
    estimatedTimeMinutes: 14,
  },

  'lhs:phys.distance': {
    conceptId: 'lhs:phys.distance',
    hook:
      'The little white line on a road. The odometer in a taxi. The label "5 km" on a running course. Each is about counting the whole path — the wiggle-proof, turn-by-turn total of how far you actually went. Physics treasures that number, and calls it by a plain, sturdy name: distance.',
    history:
      'Humans measured distance long before they measured almost anything else — by paces, cubits, ropes and days of travel. Ancient roads, trade and surveying all needed the total length between two places, whatever the route. The insight that distance is *scalar* — a total that ignores direction — became explicit only when mathematics distinguished such quantities from vectors. As vector algebra took shape in the 1800s (through Hamilton, and Gibbs and Heaviside), physics gained a clean vocabulary: distance is the scalar arc-length of a path, while displacement is a vector. In daily life, distance stayed the ruler of roads and odometers; in physics, it is the magnitude of a path, always non-negative and additive across segments.',
    figures: [
      {
        name: 'Eratosthenes',
        lifespan: 'c. 276–194 BC',
        role: 'Greek polymath and librarian of Alexandria',
        contribution:
          'Computed the circumference of the Earth from the measured distance between two cities, showing how central—and how precisely measurable—distance is.',
        statementSource: 'Paraphrase of Eratosthenes’ measurement of the Earth (c. 240 BC)',
      },
      {
        name: 'James Clerk Maxwell',
        lifespan: '1831–1879',
        role: 'Scottish physicist',
        contribution:
          'Developed the equations that make speed and distance the natural language of classical physics, embedding distance as a fundamental coordinate.',
        statementSource: 'Paraphrase of Maxwell’s Treatise on Electricity and Magnetism (1873)',
      },
    ],
    timeline: [
      {
        period: 'c. 240 BC',
        event: 'Eratosthenes measures the Earth’s circumference by distance between cities.',
        figure: 'Eratosthenes',
      },
      {
        period: '1880s',
        event: 'Distance is formalised as a scalar within vector algebra.',
        figure: 'J. Willard Gibbs; Oliver Heaviside',
      },
    ],
    perspectives: [
      {
        figure: 'Everyday/practical view',
        view: 'Distance is the total length of a route — what roads and odometers report.',
        standing: 'The ordinary and useful meaning',
        note: 'Idealised as path length.',
      },
      {
        figure: 'Physics (differential) view',
        view: 'Distance is arc-length — the integral of infinitesimal steps along the path.',
        standing: 'The precise modern definition',
        note: 'Additive and path-dependent, always non-negative.',
      },
    ],
    deepDive: {
      phenomenon: 'Why distance is a scalar that only ever grows along a path',
      intro:
        'Distance is the total length of the path travelled — a scalar, non-negative number. The ladder explains additivity, path-dependence, and where distance sits next to displacement.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Distance is simply "how much ground you covered." Take a winding path and it is the whole length you walked, every turn added up. It is always a positive number (or zero), never negative. If you walk to the shop and back the same way, the distance is twice the way there — even though you ended where you started.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with numbers and units',
          body:
            'Distance d is a scalar: magnitude only, no direction, unit metres. Along a straight segment it is the length; over many segments you add them: d_total = d₁ + d₂ + … . Distance is path-dependent (different routes give different totals) and non-negative. Speed = distance ÷ time, so if you know average speed and elapsed time the distance covered is d = v·t. Distance is what odometers accumulate; it is the *scalar contrast* to displacement, which is a straight-line vector between endpoints.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied scientists',
          body:
            'In continuous motion, distance is arc-length L = ∫ |dr/ds| ds along the trajectory — or ∫√(dx² + dy² + dz²) over the path. It is additive and invariant to how you parametrise the path but depends on the path itself. Kinematics uses it for odometry: integrating speed over time gives distance; dead-reckoning and GPS route-length rely on it. Opposite to displacement (a vector), distance is the geoinvariant quantity a vehicle’s trip computer shows.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Distance is the length functional defined by the spacetime metric: for a path γ, L[γ] = ∫√(g_μν ẋ^μ ẋ^ν) dλ. In flat space this is ordinary Euclidean arc-length; on a manifold it depends on the metric, being *not* invariant under curved/relativistic structure in the way displacement is not well-defined globally. Along a geodesic, distance is extremal (shortest in Riemannian, longest for timelike worldlines). The key subtlety: distance is a scalar measured along a curve, whereas displacement is a vector difference of endpoints — and they coincide only for straight-line paths in flat space.',
        },
      ],
    },
      whatCameBefore: 'You need the idea of measuring length; distance is the simplest scalar measure of "how far along a path".',
    connections: [
      'Displacement (the vector "from start to end" sibling)',
      'Speed (distance ÷ time)',
      'Measurement (distance is one of the first quantities we measure)',
    ],
    applications: [
      'A taxi meter counts the distance driven along streets — not the straight-line displacement between pick-up and drop-off.',
      'An athlete’s race distance (e.g. 5 km) is the total track length, regardless of laps.',
      'Map apps report "route length" by adding every turn — the distance travelled.',
    ],
    workedExamples: [
      'Run a 100 m sprint up a straight track then a 100 m return leg: total distance 200 m, even though displacement at the end is 0 m. The distance records every metre of ground you covered.',
    ],
    analogies: [
      'Distance is the total beads threaded on a necklace — count every bead along the string. Displacement is the straightening of the string between the two ends.',
    ],
    misconceptions: [
      'Distance equals displacement — they differ whenever the path is not a straight line.',
      'Distance can be negative — it is a scalar magnitude and is always non-negative.',
      'Distance is the same for every route — it depends on the path.',
    ],
    tryThis:
      'Set a phone tracker to record a walk where you head out, wander in a zig-zag, and return home. It will show kilometres of distance, but your displacement (home to home) will be zero.',
    funFacts: [
      'A marathon is meant to be about 42.2 km of distance, but athletes in lane 1 finish with near-zero net displacement around the stadium circuit.',
      'The distance around Earth at the Equator is about 40,000 km — a number Eratosthenes rounded impressively close to, using only distance between two cities and a shadow.',
    ],
    estimatedTimeMinutes: 13,
  },

  'lhs:phys.speed': {
    conceptId: 'lhs:phys.speed',
    hook:
      'A cheetah and a tortoise cross the same field. Fast? Slow? The answer every physicist and every speedometer gives is a single number: distance covered divided by the time taken. That one ratio, speed, is how we turn "quick" and "slow" from feelings into facts.',
    history:
      'Speed emerged as a measured idea with the birth of science of motion. Galileo Galilei — in his 1638 *Two New Sciences* — was among the first to treat speed as something to measure and compare, and he worked out how uniform acceleration makes speed grow steadily with time. Before him, "faster" and "slower" were loose words; after him, speed = distance ÷ time became a calculable quantity. As clocks improved in the 1600s–1700s (pendulum clocks by Christiaan Huygens), measuring the time interval made speed measurement reliable. In the 1800s the railway electrified the public’s sense of speed, and the modern speedometer turned it into a gauge. Today speed is a foundation of kinematics: a scalar always non-negative, distinguished sharply from velocity, its vector cousin with direction.',
    figures: [
      {
        name: 'Galileo Galilei',
        lifespan: '1564–1642',
        role: 'Italian astronomer and physicist',
        contribution:
          'Established speed as a measurable quantity and analysed uniform acceleration, relating distance, time and speed.',
        statement:
          'Equal increments of speed are gained in equal intervals of time during free fall.',
        statementSource: 'Paraphrase of Galileo’s Two New Sciences (1638), Third Day',
      },
      {
        name: 'Christiaan Huygens',
        lifespan: '1629–1695',
        role: 'Dutch physicist and inventor',
        contribution:
          'Perfected the pendulum clock, giving the precise time measurement on which speed measurement depends.',
        statementSource: 'Paraphrase of Huygens’ Horologium Oscillatorium (1673)',
      },
    ],
    timeline: [
      {
        period: '1638',
        event: 'Galileo treats speed as measurable and analyses uniform acceleration.',
        figure: 'Galileo Galilei',
      },
      {
        period: '1673',
        event: 'Huygens perfects the pendulum clock — precise timekeeping for speed.',
        figure: 'Christiaan Huygens',
      },
      {
        period: '1800s',
        event: 'Described speed as distance ÷ time, as railways popularise fast travel.',
        figure: '—',
      },
    ],
    perspectives: [
      {
        figure: 'Average-speed view',
        view: 'Speed = total distance ÷ total time over a journey.',
        standing: 'The workhorse definition',
        note: 'Effective when speed fluctuates.',
      },
      {
        figure: 'Instantaneous-speed view',
        view: 'Speed = the limit of distance ÷ time as the interval shrinks to an instant.',
        standing: 'The precise calculus definition',
        note: 'How a speedometer truly reads.',
      },
    ],
    deepDive: {
      phenomenon: 'How a single ratio — distance divided by time — captures "fast" and "slow"',
      intro:
        'Speed is the scalar rate at which distance is covered. The ladder moves from the simple ratio to the calculus notion and its role in kinematics.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Speed asks "how much ground per unit of time?" A runner who covers 100 m in 10 seconds runs at 100 ÷ 10 = 10 metres per second. The formula is speed = distance ÷ time. Faster means more distance in the same time, or the same distance in less time. It is always one number with a unit — metres per second, kilometres per hour — and it is never negative: you cannot cover "negative" ground.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'For a journey with changing speed, average speed v = d_total / t_total — total distance divided by the total time of the whole trip, *not* the average of speeds of each leg. Instantaneous speed is the derivative v = dd/dt. For uniform acceleration from rest, after time t, instantaneous speed v = at and distance d = ½at². Speed is a scalar; its vector counterpart is velocity, which also records direction. Just because average speed = total distance ÷ total time, a high-speed section does not "average out" by simple averaging — you divide total distance by total time.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied scientists',
          body:
            'You compute average speed over an interval as total distance over total time, and instantaneous speed as the time-derivative of the path length. For vehicles, speed sensors read wheel rotation or GPS; odometry integrates speed to get distance. In traffic engineering, design speed and speed limits derive from geometric design parameters (curvature, sight distance) and the actual ratio of path length to time. Units conversion matters (m/s ↔ km/h with factor 3.6). In rail, aviation and robotics, accurate speed control requires estimating instantaneous speed from measured position/time data, filtered against noise.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Speed is the magnitude of the velocity vector: v = |𝒗| = |d𝒓/dt|, and also the arc-length speed ds/dt along a trajectory. In special relativity, the invariant speed of light c is the same for all inertial observers, so speeds do not add linearly at high velocities (velocity-addition is the relativistic composition law). Speed is not a Lorentz-invariant quantity for massive objects, but it is a scalar on each worldline. The distinction between path-speed (dd/dt) and displacement-speed (rate of change of position) vanishes only for straight-line motion without reversal — a subtlety every rigorous treatment of kinematics keeps explicit.',
        },
      ],
    },
    whatCameBefore:
      'You need distance (scalar path length) and time (the interval); speed is their ratio.',
    connections: [
      'Distance (the numerator) and time (the denominator)',
      'Velocity (speed plus direction — a vector)',
      'Average vs. instantaneous speed',
      'Graphical analysis of motion (distance–time and speed–time graphs)',
    ],
    applications: [
      'A speedometer reads your instantaneous speed by sensing wheel rotations matched to clock time.',
      'Flight controllers work in knots (nautical miles per hour) — a speed unit tuned to navigation.',
      'Traffic-engineered speed limits are set from how distance is covered per unit time on designed road curves.',
    ],
    workedExamples: [
      'A car travels 120 km in 2 hours. Average speed = 120 / 2 = 60 km/h. If it then drives back 120 km in 1 hour, total distance = 240 km, total time = 3 h, average = 240/3 = 80 km/h — not (60 + 120)/2 = 90 km/h, because you divide total distance by total time.',
    ],
    analogies: [
      'Speed is like the pace of a marching band covering a parade route: better measured as "how many metres per minute the whole column moves" than as a guess about any single musician.',
    ],
    misconceptions: [
      'Speed equals velocity — velocity includes direction; speed does not.',
      'Speed is always constant — speed can change continuously; you must distinguish average from instantaneous.',
      'Average speed is the average of the speeds of the legs — it is total distance divided by total time.',
    ],
    tryThis:
      'On your phone’s map, time yourself walking a flat 100 m stretch. Divide 100 m by your seconds to find your walking speed in m/s, then multiply by 3.6 to get your km/h pace.',
    funFacts: [
      'Sound travels at about 343 m/s; light is about a million times faster — which is why you see distant lightning before you hear the thunder.',
      'The earliest speed camera measured simply the distance a car passed over a known gap divided by the time between two sensors.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.measurement': {
    conceptId: 'lhs:phys.measurement',
    hook:
      'How long is that table? Pick a ruler and you "compare" it against marks. Here is the quiet magic: the entire language of science — every number in every equation — rests on this humble act of comparing an unknown against a known. Measurement is how a quiet guess becomes a checked, repeatable fact.',
    history:
      'Measurement is older than writing. Ancient civilisations measured land for taxes and flood recovery (Egyptian surveyors after the Nile floods), length in cubits, weight in grain-like standards and time by the Sun and stars. The Greeks who followed (like Eratosthenes) measured the Earth itself. What changed over centuries is *standardisation*: for most of history, local standards conflicted. In 1799, revolutionary France defined the metre and the kilogram as fixed standards — the birth of the metric system and of a single, reproducible way to measure. In 1960 the world formalised the International System of Units (SI), making measurement a global, exact language. Today the act of measuring — comparing an unknown quantity with a known standard — is the defining method of physics.',
    figures: [
      {
        name: 'Eratosthenes',
        lifespan: 'c. 276–194 BC',
        role: 'Greek polymath',
        contribution:
          'Measured Earth’s circumference with a shadow and a known distance between cities — a landmark of comparing unknowns against standards.',
        statementSource: 'Paraphrase of Eratosthenes’ Earth measurement (c. 240 BC)',
      },
      {
        name: 'Blaise Pascal',
        lifespan: '1623–1662',
        role: 'French mathematician and physicist',
        contribution:
          'Emphasised that measurement with instruments and reproducible procedure is the ground of experimental science.',
        statementSource: 'Paraphrase of Pascal’s scientific method and experiments',
      },
    ],
    timeline: [
      {
        period: 'c. 240 BC',
        event: 'Eratosthenes measures the Earth — early great measurement.',
        figure: 'Eratosthenes',
      },
      {
        period: '1799',
        event: 'France defines the metre and kilogram — the metric system begins.',
        figure: 'French Academy of Sciences',
      },
      {
        period: '1960',
        event: 'The SI (International System of Units) is formalised.',
        figure: 'General Conference on Weights and Measures',
      },
    ],
    perspectives: [
      {
        figure: 'Operational view',
        view: 'To measure is to compare an unknown quantity against a defined standard unit.',
        standing: 'The core definition',
        note: 'Every measurement is a comparison.',
      },
      {
        figure: 'Accuracy/uncertainty view',
        view: 'No measurement is exact; reporting the uncertainty is part of the result.',
        standing: 'The rigorous experimental view',
        note: 'Separates precision from accuracy.',
      },
    ],
    deepDive: {
      phenomenon: 'Why every measurement is a comparison, and how instruments make it exact',
      intro:
        'Measurement compares an unknown quantity with a defined standard. The ladder explains the comparison, sources of error, and precision vs. accuracy.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'To measure is to ask "how many of this known amount fit the unknown?" A ruler is a set of centimetre standards; you line them up and count. A thermometer compares your temperature to its scale of marks. So measurement is always a comparison against a standard, and the result is a number plus a unit. Every measurement has a little uncertainty — a ruler can be read to the nearest mark, not perfectly.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with calculations',
          body:
            'A measurement has a number, a unit, and an uncertainty (e.g. 12.5 ± 0.1 cm). Accuracy is how close a measurement is to the true value; precision is how repeatable it is — you can be precise but wrong (a miscalibrated ruler). Error sources include instrument limits, parallax, and reaction time; you can estimate uncertainty from the finest division or repeated trials. Measured quantities connect to physics through units, and significant figures reflect the precision of the measurement.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied scientists',
          body:
            'You report measurement with systematic error (bias) and random error separated; you estimate uncertainty via standard deviation of repeated measurements, and propagate it through computations (e.g. adding relative uncertainties in quadrature for products). Calibration ties instruments to a traceable national standard. SI is defined by exact constants (e.g. the second via caesium-133, the metre via the speed of light), so modern measurement is direct/constant-based rather than artifact-based. Tolerance, repeatability and GUM-style uncertainty budgets govern engineering measurement.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and metrologists',
          body:
            'Arguably the deepest: measurement is a procedure that couples a system to a standard and yields a number; quantum metrology exploits superposition and entanglement to reach the standard-quantum-limit. The 2019 SI redefinition anchored all base units to exact physical constants (c, Δν_Cs, h, e, k_B, N_A, K_cd), making the "comparison to a standard" literally a comparison to a constant of nature. Observer/measurement interplay and the Heisenberg limit bound measurement precision; quantum-limited sensing is now the frontier of precise measurement.',
        },
      ],
    },
    whatCameBefore:
      'You need the idea of physical quantities and of a standard (unit); measurement is the act of comparing the two.',
    connections: [
      'Physical quantity (what we measure)',
      'Unit (the standard we measure against)',
      'Time and distance as among the first measured quantities',
    ],
    applications: [
      'A home thermometer measures temperature by comparing expansion against a printed °C scale.',
      'An atomic clock measures time by counting a fixed standard — caesium vibrations — instead of a moving hand.',
      'A GPS device measures position by comparing satellite signal travel times, with disciplined error correction.',
    ],
    workedExamples: [
      'You time a falling ball and read 1.28 s on a stopwatch with a resolution of 0.01 s. The measurement is 1.28 s ± 0.01 s (plus human reaction-time error). Repeat it many times and the spread of results tells you the random uncertainty — measuring is not just one number but a number with reliability attached.',
    ],
    analogies: [
      'Measurement is like weighing fruit on a balance where the "fruit" is the unknown and the "weights" are the standard units — you keep adding standard weights until they match.',
    ],
    misconceptions: [
      'Measurement gives the exact true value — every measurement carries some uncertainty.',
      'Only lab instruments count — any comparison against a standard is measurement.',
      'Precision and accuracy are the same — a precise measurement can still be inaccurate (biased).',
    ],
    tryThis:
      'Measure a short length three times with a ruler, resetting between tries. Notice you get slightly different readings — that spread is your measurement uncertainty made visible.',
    funFacts: [
      'The metre was originally defined as one ten-millionth of the distance from the North Pole to the Equator along a meridian.',
      'The kilogram, last of the old physical artifact units, was retired in 2019 and is now defined by the Planck constant — a fundamental constant of nature.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.physical-quantity': {
    conceptId: 'lhs:phys.physical-quantity',
    hook:
      'Your height, a car’s mass, the temperature outside, the weight of a load — each can be written as a number with a unit. That is the secret ingredient that turns "long," "heavy" and "warm" into precise science. A property that can be quantified is a physical quantity, and it is the grammar of every physics equation.',
    history:
      'The ancient world could quantify some things (length, mass, time) but treated "heat," "speed" and "force" as slippery qualities. The decisive shift — that nature is fundamentally measurable — came with Galileo, who insisted that the book of the universe is written in mathematical characters, and with Newton, who quantified force, mass and acceleration. Throughout the 1700s and 1800s, physics added more measurable quantities (energy, temperature, charge, field). By the early 1900s, the notion that a physical quantity = a number × a unit, and that quantities come in dimensioned kinds, was fully established (dimension analysis traces to James Clerk Maxwell and Joseph Fourier). Today, whether a property is a real physical quantity is decided by whether you can measure it and express it reproducibly as a number with a unit.',
    figures: [
      {
        name: 'Galileo Galilei',
        lifespan: '1564–1642',
        role: 'Italian astronomer and physicist',
        contribution:
          'Championed the quantification of nature — treating measurable quantities as the language of science.',
        statement:
          'The book of nature is written in the language of mathematics.',
        statementSource: 'Paraphrase of Galileo’s Il Saggiatore (1623)',
      },
      {
        name: 'James Clerk Maxwell',
        lifespan: '1831–1879',
        role: 'Scottish physicist',
        contribution:
          'Formalised the theory of physical dimensions, treating quantities as number × unit and dimensioned kinds.',
        statementSource: 'Paraphrase of Maxwell’s work on dimensions (1871–1873)',
      },
      {
        name: 'Joseph Fourier',
        lifespan: '1768–1830',
        role: 'French mathematician and physicist',
        contribution:
          'His dimensional analysis of heat helped establish that physical quantities have consistent dimensioned structure.',
        statementSource: 'Paraphrase of Fourier’s Analytical Theory of Heat (1822)',
      },
    ],
    timeline: [
      {
        period: '1623',
        event: 'Galileo argues nature is written in mathematical language.',
        figure: 'Galileo Galilei',
      },
      {
        period: '1822',
        event: 'Fourier shapes dimensional analysis.',
        figure: 'Joseph Fourier',
      },
      {
        period: '1870s',
        event: 'Maxwell formalises physical dimensions.',
        figure: 'James Clerk Maxwell',
      },
    ],
    perspectives: [
      {
        figure: 'Quantitative view',
        view: 'A physical quantity is a measurable property expressed as a number times a unit.',
        standing: 'The consensus definition',
        note: 'What makes science quantitative.',
      },
      {
        figure: 'Dimensioned analysis view',
        view: 'Quantities belong to dimensioned kinds (length, time, mass…); equations must be dimensionally consistent.',
        standing: 'The rigorous analytical tool',
        note: 'Catches errors and reveals structure.',
      },
    ],
    deepDive: {
      phenomenon: 'How "number × unit" turns every measurable property into scientific language',
      intro:
        'A physical quantity is a quantifiable property: a number combined with a unit. The ladder shows the definition, the scalar/vector split, and dimensional consistency.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Some properties you can measure: how tall, how heavy, how hot, how fast. Each becomes a physical quantity when you express it as a number plus a unit — 1.6 metres, 3 kilograms, 37 °C, 80 km/h. Not every property is a physical quantity: "beautiful" or "interesting" cannot be measured like that. The number tells how many, the unit tells what kind, and together they communicate precisely.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with categories',
          body:
            'A physical quantity Q = {number} × {unit}. Quantities split into scalar (magnitude only: mass, time, energy, temperature) and vector (magnitude + direction: displacement, velocity, force, field). Each quantity has a dimension (length L, time T, mass M) and equations must balance dimensions. Derived quantities combine base ones (speed [LT⁻¹], force [MLT⁻²]). Whether a property is a physical quantity is decided by measurability, not by sentiment — and dimensional analysis (checking every term balances) is a powerful check.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied scientists',
          body:
            'You work with base and derived physical quantities and their SI units; you use dimensional homogeneity in every equation to catch mistakes. You choose the right quantity for a problem (e.g. momentum vs. kinetic energy), manage vector vs. scalar accordingly, and convert units faithfully. In design and safety, the ability to quantify (stresses, flows, tolerances, uncertainty) is what makes engineering reproducible and verifiable — a physical quantity is the unit of technical communication across disciplines.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'The dimensioned structure of physical quantities reflects the symmetries and units of nature; by 2019 all SI base quantities are defined by exact constants, so a physical quantity is ultimately tied to a fundamental constant. Under active analysis, dimensioned-quantity calculus (units as algebraic objects when treating derivative quantities) clarifies transformations between systems. The deep view: a measurable quantity is an assignment of a real number to a state of the world under a calibrated procedure — inherently tied to measurement theory — which scales into operator/observable structure in quantum mechanics where some quantities’ joint values are fundamentally constrained (uncertainty principle).',
        },
      ],
    },
    whatCameBefore:
      'You need the act of measurement and its standard (unit); physical quantity is the property that those make precise.',
    connections: [
      'Measurement (how we quantify)',
      'Unit (the standard reference)',
      'Scalar and vector (the two kinds of physical quantity)',
    ],
    applications: [
      'Engineering safety specifies physical quantities with tolerances — a beam’s load, a fluid’s pressure — so it can be checked exactly.',
      'A weather forecast quantifies temperature, wind speed and pressure — physical quantities that shape decisions.',
      'A pharmacy measures doses in milligrams — a precise physical quantity for safety.',
    ],
    workedExamples: [
      'Your car’s mass is 1,200 kg and its speed is 20 m/s. Both are physical quantities (mass = scalar, speed = scalar). Its momentum (a vector) is mass × velocity: 1,200 kg × 20 m/s = 24,000 kg·m/s in the direction of motion. Every number carried the right quantity and units.',
    ],
    analogies: [
      'A physical quantity is a recipe measured in cups and teaspoons — every ingredient is a number plus a unit, so anyone following the recipe gets the same dish.',
    ],
    misconceptions: [
      'A physical quantity is the same as the object or substance it describes — it is a property of the object, not the object.',
      'Every property is a physical quantity — only measurable/quantifiable properties are.',
      'Units are optional — a physical quantity without a unit is meaningless.',
    ],
    tryThis:
      'List five things around you and write each as a number with a unit (e.g. phone ~0.2 kg, room ~22 °C). Where you cannot produce a number, you have found a non-physical (qualitative) property.',
    funFacts: [
      'There is a physical quantity for "electric current brightness" and one for "radioactivity" (the becquerel) — physicists love naming units after the people who defined the ideas.',
      'Dimensional analysis helped scientists sanity-check Einstein’s equations: each term has to carry the same physical dimensions, or the formula is wrong.',
    ],
    estimatedTimeMinutes: 14,
  },

  'lhs:phys.time': {
    conceptId: 'lhs:phys.time',
    hook:
      'Before a sunrise, after a lecture, the seconds stretch or fly by. But the time a stopwatch counts is a cool, steady dimension: the interval between two events. Physics does not care whether time feels fast or slow — it measures time as the fundamental quantity that orders events and drives every rate in the universe.',
    history:
      'Humans measured time by nature’s cycles before they measured anything else — sundials tracked the Sun, water clocks dripped steadily, and calendars ordered seasons. The precision revolution began when Christiaan Huygens (1656) built a reliable pendulum clock and, later, John Harrison (1700s) solved longitude by developing marine chronometers that kept time at sea. In 1967 the world stopped defining the second by the Earth’s spin and fixed it by the vibrations of caesium atoms — ×9,192,631,770 oscillations per second. A century earlier, Albert Einstein (1905) had upturned the assumption that time is a universal clock: his special relativity showed time is not absolute; it runs differently for observers in relative motion (time dilation), stitching time and space into a single spacetime.',
    figures: [
      {
        name: 'Christiaan Huygens',
        lifespan: '1629–1695',
        role: 'Dutch physicist and inventor',
        contribution:
          'Built the first reliable pendulum clock (1656), making time measurement regular enough for science.',
        statementSource: 'Paraphrase of Huygens’ Horologium Oscillatorium (1673)',
      },
      {
        name: 'John Harrison',
        lifespan: '1693–1776',
        role: 'English clockmaker',
        contribution:
          'Built marine chronometers that kept precise time at sea, solving the longitude problem — time measurement as navigation.',
        statementSource: 'Paraphrase of Harrison’s chronometer work (1700s)',
      },
      {
        name: 'Albert Einstein',
        lifespan: '1879–1955',
        role: 'German-born theoretical physicist',
        contribution:
          'Showed time is relative: time dilates with relative motion and gravity, unifying time with space into spacetime (1905–1915).',
        statement:
          'Time cannot be absolutely defined, and there is an inseparable relation between time and signal velocity.',
        statementSource: 'Paraphrase of Einstein’s considerations on time in special relativity (1905)',
      },
    ],
    timeline: [
      {
        period: '1656',
        event: 'Huygens’ pendulum clock makes timekeeping regular.',
        figure: 'Christiaan Huygens',
      },
      {
        period: '1700s',
        event: 'Harrison’s chronometers solve longitude at sea.',
        figure: 'John Harrison',
      },
      {
        period: '1905',
        event: 'Einstein’s relativity shows time is relative (time dilation).',
        figure: 'Albert Einstein',
      },
      {
        period: '1967',
        event: 'The second is redefined by caesium atom vibrations.',
        figure: 'International community',
      },
    ],
    perspectives: [
      {
        figure: 'Newton (1687)',
        view: 'Absolute, mathematical time flows uniformly and independently of anything physical.',
        standing: 'Classical view — excellent on Earth’s everyday scales',
        note: 'Replaced at extremes.',
      },
      {
        figure: 'Einstein (1905–1915)',
        view: 'Time is relative: it dilates and merges with space into spacetime; simultaneity is frame-dependent.',
        standing: 'The modern view, confirmed by GPS and particle physics',
        note: 'Everyday time is the low-speed limit.',
      },
    ],
    deepDive: {
      phenomenon: 'How physics treats time: a dimension, a measured interval, and a quantity that dilates',
      intro:
        'Time is a fundamental scalar quantity that orders and measures the interval between events. The ladder explains clocks, intervals, and the relativity that reshapes time at extremes.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Time is the dimension that tells us what happens before and after. We measure a *time interval* between two events with a clock: how many seconds (or minutes) pass. It is a scalar — a number with a unit (second). "Time" is the dimension; a "clock reading" is just a label for a moment. Two events separated by a stopwatch reading of 5 s have a 5-second interval. Time is everywhere the "independent variable" when we describe motion.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'Time t is a fundamental base quantity (unit s). Kinematics treats time as the independent variable: position r(t), velocity v = dr/dt, acceleration a = dv/dt. For constant acceleration, time appears squared in s = ut + ½at². Time intervals are measured by counting a periodic standard — a pendulum, a crystal, a caesium clock. In relativity, an inertial observer’s clock reads proper time τ, and a moving clock appears to run slow (time dilation): Δt = γΔτ, where γ = 1/√(1 − v²/c²) is the Lorentz factor. Time and space unify: an interval in spacetime is invariant.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied scientists',
          body:
            'You treat time as a measured, controllable coordinate: synchronise systems with UTC and atomic time; account for GPS relativistic correction (satellite clocks run fast by ~38 µs/day relative to Earth — correct or positioning fails). You measure time with oscillators and discipline clocks; timing jitter and drift are engineering concerns. In control systems and signal processing (sampling, Fourier transforms), time is the independent axis; in navigation, precise time is the fourth coordinate you must know.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'The deepest view: time is the coordinate along worldlines in (pseudo-)Riemannian spacetime. In special relativity it dilates; in general relativity, gravitational fields also dilate time (clocks run slower in stronger gravity). The invariant quantity is proper time τ = ∫√(−g_μν dx^μ dx^ν) along a timelike worldline. Dynamics recast time as the evolution parameter of phase space; in quantum field theory, time is a background parameter in non-relativistic quantum mechanics, while in relativity it is a coordinate to be treated on equal footing with space — a tension at the heart of reconciling quantum mechanics and gravity, where the "problem of time" remains open.',
        },
      ],
    },
    whatCameBefore:
      'You need the concepts of event and measurement; time is the dimension that orders events and is measured as an interval.',
    connections: [
      'Motion (position changes with time)',
      'Speed and velocity (how much happens per unit time)',
      'Measurement (time is a base quantity we measure)',
    ],
    applications: [
      'An athlete’s finish time measured to 0.001 s by a stop clock decides races.',
      'GPS satellites carry atomic clocks and apply relativistic corrections — without precision time, your location would drift metres.',
      'A sunrise-and-sunset calendar budgets the day by measured time intervals.',
    ],
    workedExamples: [
      'A runner crosses each 100 m in 10.0 s; the interval between the start gun and the finish line is 10.0 s. If they run 1,500 m in 375 s, their average speed is 1,500 / 375 = 4.0 m/s — showing how time, as the denominator, turns motion into a rate.',
    ],
    analogies: [
      'Time as the dimension is like the horizontal axis of a graph — a direction along which events line up in order, against which we read "when."',
    ],
    misconceptions: [
      'Time equals a clock reading — time is the dimension; the clock reading is a label of a moment.',
      'Time is the same for every observer — at high speeds and strong gravity, time dilates.',
      'Time can be measured exactly — every time measurement has uncertainty.',
    ],
    tryThis:
      'Use any clock to time a pendulum (a swinging key on a string) over 10 swings; divide by 10 for the period. Notice the small spread in repeats — that is time-measurement uncertainty in action.',
    funFacts: [
      'The modern second is defined by how long a caesium-133 atom takes to complete exactly 9,192,631,770 oscillations.',
      'Because GPS satellites orbit at high speed and low gravity, their clocks tick slower by ~7 µs/day from speed and ~45 µs/day faster from gravity — net about 38 µs/day correction.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.unit': {
    conceptId: 'lhs:phys.unit',
    hook:
      'Say "the box weighs 5." Is that 5 grams, 5 kilograms, or 5 elephants? A number with no unit is a shout into the void. The unit is the agreed scale that gives a number its meaning — and getting the world to agree on units is one of the great collaborative feats of science.',
    history:
      'For most of history every town had its own foot, pound, and bushel, and trade across borders was a tangle of conflicting standards. The French Revolution brought a radical answer: a single, rational system. In 1799 France defined the metre (one ten-millionth of the Paris meridian) and the kilogram, founding the metric system. Over the following century, the idea spread — Britain and many nations adopted metric units, and in 1960 the General Conference on Weights and Measures created the International System of Units (SI) built on seven base units (metre, kilogram, second, ampere, kelvin, mole, candela). The great final step came in 2019, when all SI base units were redefined by exact constants of nature (like the speed of light and Planck’s constant) rather than physical objects — making the kilogram, the metric standard previously stored as a metal cylinder, a definition from nature itself.',
    figures: [
      {
        name: 'The French Academy of Sciences',
        lifespan: '1790s',
        role: 'Institution defining the metric system',
        contribution:
          'Defined the metre and kilogram as natural, reproducible standards at the founding of the metric system (1799).',
        statementSource: 'Paraphrase of the French Academy’s 1799 metre and kilogram definitions',
      },
      {
        name: 'Max Planck',
        lifespan: '1858–1947',
        role: 'German theoretical physicist',
        contribution:
          'The Planck constant, a fundamental constant of nature, now defines the kilogram in the modern SI (2019).',
        statementSource: 'Paraphrase of the 2019 SI redefinition via the Planck constant',
      },
    ],
    timeline: [
      {
        period: '1799',
        event: 'The metre and kilogram are defined — metric system begins.',
        figure: 'French Academy of Sciences',
      },
      {
        period: '1960',
        event: 'SI is formalised with seven base units.',
        figure: 'General Conference on Weights and Measures',
      },
      {
        period: '2019',
        event: 'All base units redefined by exact constants of nature.',
        figure: 'International metrology community',
      },
    ],
    perspectives: [
      {
        figure: 'Classic artifact view',
        view: 'A unit is a fixed physical standard (e.g. a metal kilogram) against which others are compared.',
        standing: 'Historical and intuitive',
        note: 'Fragile — an artifact can change.',
      },
      {
        figure: 'Modern constant view',
        view: 'A unit is defined by an exact constant of nature, giving precision and universality.',
        standing: 'The current SI basis',
        note: 'Reproducible anywhere in the universe.',
      },
    ],
    deepDive: {
      phenomenon: 'Why a unit is a convention — and why standardising it changed the world',
      intro:
        'A unit is an agreed standard reference amount of a quantity. The ladder explains the comparison, conversion, and the modern constants-based definitions.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'A unit is the "agreed size" you compare a quantity to. When you say 5 kilograms, the kilogram is the unit — one agreed amount of mass — and 5 means five of those. Different people could agree on different units (say "stone" instead of "kilogram") and still measure the same thing; the unit is a convention. The number is meaningless without the unit, and the unit must match the kind of quantity (you don’t measure length in seconds).',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with conversions',
          body:
            'A physical quantity is number × unit; the unit gives the scale. Conversion between units uses the fact that the same quantity has a fixed value: 1 km = 1000 m, 1 h = 3600 s, so 72 km/h = 72 × (1000 m)/(3600 s) = 20 m/s. SI base units: metre (m), kilogram (kg), second (s), ampere (A), kelvin (K), mole (mol), candela (cd); derived units (e.g. newton N = kg·m/s²) follow from definitions. Dimensional consistency means you must keep units through every step — a misplaced unit changes the answer by a factor of 1000.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied scientists',
          body:
            'You write every engineering quantity with SI units, use prefix-aware conversions (nano, micro, milli, kilo, mega, giga), and enforce dimensional analysis on every equation. You track units through calculations (e.g. stress in N/m² = Pa), convert carefully (e.g. thermal, energy, and pressure units), and handle unit strings in software with libraries to avoid catastrophic unit errors (e.g. the 1999 Mars Climate Orbiter that failed on Imperial/metric mismatch). Traceability to the SI via calibration chains keeps your measurements comparable. Tolerance specification in engineering relies on unambiguous units.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and metrologists',
          body:
            'The 2019 revolution: all seven base units are now defined by exact numerical values of fundamental constants (c for the metre, Δν_Cs for the second, h for the kilogram, e for the ampere, etc.) using fixed SI-defining constants — so a unit is no longer tied to any object or place, but to the constants of physics themselves. Dimensioned-quantity calculus treats units as algebraic objects; you can derive compound units from base definitions. The deepest perspective: units formalise the scale symmetry of physical law — the systems you pick define the "units" in which the constants of nature are expressed, connecting measurement to the symmetries at the root of physics.',
        },
      ],
    },
    whatCameBefore:
      'You need the idea of a physical quantity and measurement; a unit is the standard reference by which that quantity is measured.',
    connections: [
      'Measurement (the act that uses units)',
      'Physical quantity (what a unit gives scale to)',
      'Time, distance — quantities first given standard units',
    ],
    applications: [
      'International trade relies on agreed mass/volume units — "5 kg" means the same in Kathmandu and Cairo.',
      'A scientist reproduces an experiment in any lab because SI units are universal and exact.',
      'Engineering tolerance on a bolt (e.g. 10.00 ± 0.05 mm) is only meaningful because the millimetre is a fixed unit.',
    ],
    workedExamples: [
      'Convert a speed of 54 km/h to m/s. Since 1 km = 1000 m and 1 h = 3600 s: 54 km/h = 54 × 1000 m / 3600 s = 15 m/s. The unit conversion is the whole calculation — the number is meaningless without the unit chain held through every step.',
    ],
    analogies: [
      'A unit is the agreed size of a baking cup: "recipe wants 2 cups of flour" is exact only because everyone agrees what one cup is.',
    ],
    misconceptions: [
      'Units are properties of the object being measured — units are conventions, not properties.',
      'Any number can wear any unit — the unit must match the kind of quantity.',
      'Bigger number means bigger quantity — without the unit, comparison is impossible (5 kg vs 5000 g are the same).',
    ],
    tryThis:
      'Weigh a fruit with two different units (grams and kilograms). The number changes (250 g vs 0.25 kg) but the fruit is the same — one unit, two scales, same reality.',
    funFacts: [
      'Before standard units, a "foot" was literally the length of the ruler’s owner’s foot — a recipe for chaos.',
      'The kilogram was the last base unit defined by a physical object (a metal cylinder) until 2019, when it became a definition from the Planck constant.',
    ],
    estimatedTimeMinutes: 15,
  },
};