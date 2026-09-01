/**
 * Batch 2 — authored narrative content for the next most-visible concepts.
 *
 * Same consumer-owned pedagogy contract as `narratives.ts` (CONSTITUTION.md §35):
 * real people honoured by name with their true roles and recorded words (sourced),
 * a historical timeline, respected/differing views each given due weight, and an
 * "Explained" deep-dive that starts simple and scales up for enthusiasts,
 * professionals and nerds. Facts remain canonical-consistent with LearningHubSTEM.
 *
 * Each entry is keyed by the canonical concept id and composes with the known fact
 * via `composeNarrativeLesson`.
 */
import type { NarrativeContent } from '@stem-tuition/content-provider';

/** Batch 2 additions, merged into the main NARRATIVES record. */
export const NARRATIVES_BATCH2: Record<string, NarrativeContent> = {
  'lhs:phys.velocity': {
    conceptId: 'lhs:phys.velocity',
    hook:
      'You can measure how fast a thing is going and still be wrong about where it is heading. That is the whole difference between speed and velocity — and it is a difference most people spend their whole lives never consciously noticing, even though pilots, sailors and physicists rely on it every day.',
    history:
      'For most of history "how fast" was just one number along a path. It took the careful work of Galileo Galilei in the early 1600s to insist on separating distance, time and the ratio between them, and to describe motion with intervals rather than a single guess. Later, Isaac Newton and Gottfried Leibniz developed calculus precisely to handle how displacement changes continuously with time. The modern notion of velocity as a vector — a speed carrying a direction — came together as physics matured, so that a thing "going 60" and a thing "going 60 north-east" are genuinely different statements about the world.',
    figures: [
      {
        name: 'Galileo Galilei',
        lifespan: '1564–1642',
        role: 'Italian mathematician, physicist and astronomer',
        contribution:
          'His study of falling bodies and inclined planes founded the modern idea that motion should be described by measurable quantities — distance, time and their rates — rather than by the vague "natural motion" of the scholastics.',
        statement:
          '…the natural (or unbounded) motion of a falling body is continually accelerated.',
        statementSource: 'Galileo, Two New Sciences (Discorsi), 1638',
      },
      {
        name: 'Isaac Newton',
        lifespan: '1643–1727',
        role: 'English mathematician and natural philosopher',
        contribution:
          'He treated velocity as a rate of change of position, and — with the calculus he co-founded — gave the tools to compute it exactly, and to define force in terms of changes to velocity.',
        statement:
          'Quantity of motion is the measure of the same, arising from both the velocity and the quantity of matter conjunctly.',
        statementSource: 'Isaac Newton, Principia, Definitions II (1687, trans. Motte)',
      },
    ],
    timeline: [
      {
        period: 'c. 1300s',
        event: 'Scholastic thinkers speak of "motion" vaguely, with no clean separation of distance, time and speed.',
        note: 'Motion is a quality, not yet a measured quantity.',
      },
      {
        period: '1638',
        event: 'Galileo publishes Two New Sciences, describing uniformly accelerated motion with time and distance.',
        figure: 'Galileo Galilei',
        note: 'The birth of kinematics as a quantitative subject.',
      },
      {
        period: '1687',
        event: 'Newton’s Principia gives precise definitions and uses calculus to describe how motion changes.',
        figure: 'Isaac Newton',
        note: 'Velocity becomes a rigorously defined rate.',
      },
    ],
    perspectives: [
      {
        figure: 'Ancient and medieval natural philosophy',
        view:
          'A body has a "natural" tendency to move or rest, and speed is a quality of that motion judged by the senses.',
        standing: 'Superseded — but it is the very frame Galileo had to break',
        note: 'Without this honest starting point, kinematics never becomes exact.',
      },
      {
        figure: 'Galileo Galilei (1638)',
        view: 'Motion is fully described by measurable ratios of distance and time; uniform acceleration has a constant rate.',
        standing: 'Established — the foundation of kinematics',
        note: 'Galileo proved the abstract idea with real ramps and water clocks.',
      },
    ],
    deepDive: {
      phenomenon: 'Why velocity is a vector, and what that really means for describing motion',
      intro:
        'Velocity answers the question "how fast, and in what direction?" This deep-dive walks from the everyday idea to the calculus that makes velocity exact.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Velocity tells you how far an object moves each second *and the direction it moves*. If a car drives 60 km in one hour north, its velocity is 60 km/h north. The 60 km/h part is its speed; the "north" part is the direction. Two cars can have the same speed — say 60 km/h — while moving in opposite directions, and then they have different velocities. Speed is a number; velocity is a number with an arrow.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with vectors',
          body:
            'Velocity is displacement per time, v = Δs/Δt, where Δs is the change of position — a vector. Speed is distance per time, a scalar. Because displacement is "green line from start to finish," a runner who loops a track and returns to the start has, on average, velocity zero, even at high speed. Instantaneous velocity is the limit of Δs/Δt as Δt → 0: the derivative of position, v = ds/dt. It is the slope of the position–time graph at each instant.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied scientists',
          body:
            'In practice you resolve velocity into components, and integrating those components reconstructs displacement. Navigation systems, GPS receivers and inertial guidance all operate on velocity vectors composed of east, north and up rates. Sign conventions matter: a velocity written as a signed scalar on an axis is a vector in dependence; choosing the axis flips the sign. When velocity changes, acceleration is its time-derivative, so position, velocity and acceleration are the three layers of one differential chain — the backbone of mechanics and control theory.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Velocity is the derivative of position along a manifold-chart: the tangent vector to the trajectory. On curved spacetime trajectories change even with no "applied" acceleration, because the covariant derivative — not the coordinate derivative — defines proper acceleration. The distinction between coordinate velocity and proper velocity is essential in relativity, where nothing exceeds c as a coordinate speed while proper velocities remain unbounded. This is why a quarterback’s throw, a satellite’s orbit and a particle in a synchrotron are described by the same tangent-vector concept, just on very different geometries.',
        },
      ],
    },
    whatCameBefore:
      'You already know distance (how much path) and time (how many seconds). Velocity combines them with direction. Before velocity you need displacement and vectors, because velocity is displacement per time.',
    connections: [
      'Acceleration (the rate at which velocity changes)',
      'Momentum (mass × velocity)',
      'Kinetic energy (½mv² depends on speed, not direction)',
    ],
    applications: [
      'Air-traffic controllers track not just speed but heading — a plane’s velocity vector — to keep traffic separated.',
      'Wind forecasters give both the wind speed and the direction it comes from, because a sailboat needs the vector, not just the number.',
      'A GPS unit computes your velocity to update arrival time; if it only knew speed it could not tell the difference between looping back and going straight.',
    ],
    workedExamples: [
      'A bird flies 30 km east in 2 hours, then 30 km west in 2 hours. Total distance 60 km, average speed 15 km/h. But displacement is back to the start, zero, so average velocity is 0 km/h. Same travel, two different answers — speed and velocity measure genuinely different things.',
    ],
    analogies: [
      'Speed is like the number on a car’s dashboard; velocity is that number together with the compass you are aiming along. The dashboard does not tell you whether you are headed to the coast or the mountains, and neither does speed alone.',
    ],
    misconceptions: [
      'Higher speed does not always mean greater velocity for an object with direction — a fast object returning to its start can have zero net velocity.',
      'Velocity is not the same as speed; the direction is part of it.',
      'Constant speed does not mean constant velocity — turning at constant speed changes velocity because direction changes.',
    ],
    tryThis:
      'Stand at one end of a corridor and walk to the far wall and back, timing yourself. Your average speed is easy to feel; challenge yourself to compute your average velocity over the round trip. It is zero — and noticing *why* is the lesson.',
    funFacts: [
      'The speed of light in a vacuum is the same velocity for every observer — the one speed that never changes frame.',
      'A satellite in a circular orbit has constant speed but constantly changing velocity, because its direction keeps turning.',
    ],
    estimatedTimeMinutes: 14,
  },

  'lhs:phys.acceleration': {
    conceptId: 'lhs:phys.acceleration',
    hook:
      'Press the accelerator in a car and you feel pushed back into your seat even while the car may be going slowly. That feeling is not speed — it is the *change* of speed. Acceleration is the most physical of the basic quantities: you feel it in your body, not just read it on a gauge.',
    history:
      'The idea that motion could *change* in a smooth, measureable way was one of the great intellectual revolutions of the 1600s. Aristotle had imagined motion in qualitative terms, and for two thousand years no one had properly expressed "how fast motion is speeding up." Galileo changed that. Using inclined planes and careful timing, he demonstrated that a falling body gains equal speed in equal times — uniform acceleration — and wrote the relationship between distance, time and acceleration. Newton then folded acceleration into his second law, F = m·a, making the *rate of change of velocity* the very thing forces act upon.',
    figures: [
      {
        name: 'Aristotle',
        lifespan: '384–322 BCE',
        role: 'Greek philosopher',
        contribution:
          'He taught that heavier bodies fall faster and that natural motion tends toward rest — a starting point that, while wrong about falling, framed the question that Galileo later overturned.',
        statement:
          'The heavy moves quickly towards its own place naturally.',
        statementSource: 'Attributed to the Aristotelian tradition (paraphrase of On the Heavens)',
      },
      {
        name: 'Galileo Galilei',
        lifespan: '1564–1642',
        role: 'Italian mathematician, physicist and astronomer',
        contribution:
          'Discovered that falling bodies accelerate uniformly: they gain equal speed in equal times, independent of mass (ignoring air). He established the central role of acceleration in describing motion.',
        statement:
          '…in equally accelerated motion, distances traversed from rest are proportional to the squares of the times.',
        statementSource: 'Galileo, Two New Sciences (Discorsi), Third Day, 1638',
      },
      {
        name: 'Isaac Newton',
        lifespan: '1643–1727',
        role: 'English mathematician and natural philosopher',
        contribution:
          'Made acceleration the quantity that forces change: his second law states that net force equals mass times acceleration, the precise link between force and motion.',
        statement:
          'The alteration of motion is ever proportional to the motive force impressed.',
        statementSource: 'Isaac Newton, Principia, Law II (1687, trans. Motte)',
      },
    ],
    timeline: [
      {
        period: 'c. 350 BCE',
        event: 'Aristotle frames natural motion qualitatively; "acceleration" as a measured quantity does not yet exist.',
        figure: 'Aristotle',
      },
      {
        period: '1604',
        event: 'Galileo begins his experiments on falling bodies and inclined planes, establishing uniform acceleration.',
        figure: 'Galileo Galilei',
      },
      {
        period: '1638',
        event: 'Two New Sciences publishes the law of accelerated motion: distance ∝ time².',
        figure: 'Galileo Galilei',
      },
      {
        period: '1687',
        event: 'Newton ties acceleration into his laws: net force = mass × acceleration.',
        figure: 'Isaac Newton',
      },
    ],
    perspectives: [
      {
        figure: 'Aristotle (c. 350 BCE)',
        view: 'Falling bodies speed up because they grow closer to their natural place; the reason is teleological, not mathematical.',
        standing: 'Superseded by experiment, but historically the unavoidable starting point',
        note: 'Galileo’s breakthrough was to measure acceleration rather than argue about purpose.',
      },
      {
        figure: 'Galileo Galilei (1638)',
        view: 'Acceleration is uniform for falling bodies near Earth: equal velocity changes in equal times, mass-independent.',
        standing: 'Established — the empirical foundation',
        note: 'Air resistance hides this on everyday scales; it is exact in a vacuum.',
      },
      {
        figure: 'Isaac Newton (1687)',
        view: 'Acceleration is the quantity forces produce: net force = mass × acceleration.',
        standing: 'The current consensus in classical mechanics',
        note: 'This unifies falling, braking and turning into one law.',
      },
    ],
    deepDive: {
      phenomenon: 'What acceleration really is — and why you feel it in your body',
      intro:
        'Acceleration is how fast velocity changes. Because velocity has both size and direction, acceleration includes turning as much as speeding up. This deep-dive scales from the everyday to the geometry of curved motion.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Acceleration is how quickly something speeds up (or slows down, or turns). If a bicycle goes from rest to 4 m/s in 2 seconds, its acceleration is 2 m/s per second, written 2 m/s². Every second it is moving 2 m/s faster. You feel it when a bus pulls away — the push into the seat is the bus accelerating. When the bus brakes, the pull forward is you accelerating in the opposite sense (deceleration).',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with vectors',
          body:
            'Acceleration is the time-rate of change of velocity: a = Δv/Δt, and instantaneously a = dv/dt. It is a vector. Crucially, because velocity is a vector, changing *direction* at constant speed is still acceleration — uniform circular motion has acceleration toward the centre (centripetal), a = v²/r. Speeding *up* and *turning* are both acceleration; only unchanging velocity means no acceleration.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied scientists',
          body:
            'Acceleration is the second time-derivative of position. In design, you specify acceleration limits to protect cargo and passengers from g-forces; accelerometers measure it in three axes. For curved motion the acceleration vector decomposes into tangential (changed speed) and normal (changed direction) parts: a = a_t·t̂ + (v²/r)·n̂. Control systems use this decomposition to plan smooth trajectories that respect both speed and curvature constraints.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Acceleration is the covariant second derivative of the trajectory when geometry is curved. Weightlessness is not absence of gravity but a free-falling frame where proper acceleration vanishes; surface gravity g and the locally measured weight differ by exactly the frame acceleration. Relativity replaces "force produces acceleration" with force producing proper acceleration along a worldline, and the metric governs how coordinate vs proper acceleration compare as velocity approaches c. The humble a = F/m of Newton survives as the local, low-velocity limit of a far richer statement.',
        },
      ],
    },
    whatCameBefore:
      'You need displacement and velocity first, because acceleration is the rate at which velocity changes — you can only take "the change of the change" once you have velocity.',
    connections: [
      'Velocity (the quantity acceleration changes)',
      'Newton’s second law (force is what causes acceleration)',
      'Free fall (a famous, nearly constant acceleration)',
    ],
    applications: [
      'Suspension bridges and roller coasters are designed so the acceleration riders and structures feel stays within safe limits.',
      'A smartphone’s accelerometer tells it whether to rotate the screen by detecting the direction of the acceleration of gravity.',
      'Race-car drivers shift weight under braking because acceleration shifts loads between front and rear tyres.',
    ],
    workedExamples: [
      'A train starts from rest and reaches 30 m/s in 15 s. a = Δv/Δt = (30 − 0) ÷ 15 = 2 m/s². Every second its speed grows by 2 m/s; in 15 s it has gained exactly 30 m/s.',
    ],
    analogies: [
      'Speed is like the car’s current speedometer reading; acceleration is how fast that needle is turning. You can be accelerating hard from a stop while the needle is still low, and coasting at top speed with the needle still.',
    ],
    misconceptions: [
      'Acceleration is not "getting faster" only — slowing down and turning are also acceleration.',
      'Constant speed is not zero acceleration if the direction changes.',
      'Objects in free fall all accelerate at g ≈ 9.8 m/s² regardless of mass, ignoring air resistance.',
    ],
    tryThis:
      'Swing a weight on a string in a slow circle overhead. Feel the pull on the string — that pull is centripetal force, and it is keeping the weight accelerating inward even though its speed is constant.',
    funFacts: [
      'Astronauts in orbit experience weightlessness: they are falling freely the whole time, and "zero acceleration" in their frame is not the same as gravity being absent.',
      'A sports car can accelerate at roughly one "g" (9.8 m/s²) — about the same as falling off a chair.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.density': {
    conceptId: 'lhs:phys.density',
    hook:
      'Why does a steel ship float while a steel nail sinks, when both are made of the same metal? The answer is not weight — it is how that weight is spread through space. That ratio of mass to volume is density, and it decides what floats, what sinks, and why the whole ocean behaves as it does.',
    history:
      'The intuition that some things are "heavier for their size" is ancient; Archimedes is famously said to have solved the king’s gold-crown problem by realising density could decide whether a thing was truly gold or simply painted. He compared the crown’s weight to the water it displaced. Much later, the modern definition of density — mass per unit volume — was built on careful measurement traditions, and Antoine Lavoisier’s insistence on precise quantification helped make density a reliable, measurable property of every material.',
    figures: [
      {
        name: 'Archimedes',
        lifespan: 'c. 287–212 BCE',
        role: 'Greek mathematician and engineer of Syracuse',
        contribution:
          'Legend holds he distinguished pure gold from alloy by comparing weight with water displacement — effectively comparing densities. He also derived the principle of buoyancy that bears his name, the natural pair to density.',
        statement:
          'Give me a place to stand, and I will move the Earth.',
        statementSource: 'Attributed to Archimedes (often misread as a boast; used here only as his recorded voice on levers)',
      },
      {
        name: 'Antoine Lavoisier',
        lifespan: '1743–1794',
        role: 'French chemist',
        contribution:
          'His insistence on exact measurement and conservation of mass made quantitative properties like density reliable tools of science.',
        statement:
          'Nothing is lost, nothing is created, everything is transformed.',
        statementSource: 'Paraphrase of Lavoisier’s conservation principle, 18th century',
      },
    ],
    timeline: [
      {
        period: 'c. 250 BCE',
        event: 'Archimedes reportedly determines gold purity by density/water displacement.',
        figure: 'Archimedes',
      },
      {
        period: 'c. 400–1200s',
        event: 'Hydrometers and balance-based measurement slowly advance the practical notion of "heaviness per volume."',
      },
      {
        period: '18th century',
        event: 'Lavoisier’s quantitative chemistry makes density a standard, trustworthy property.',
        figure: 'Antoine Lavoisier',
      },
    ],
    perspectives: [
      {
        figure: 'Archimedes (c. 250 BCE)',
        view: 'Weight compared with displaced water reveals a material’s nature — a practical density test without modern units.',
        standing: 'Prescient and reusable',
        note: 'The crown problem is the classic, if possibly legendary, example.',
      },
      {
        figure: 'Antoine Lavoisier (18th century)',
        view: 'Matter is conserved; measurable properties like density must be exact and reproducible.',
        standing: 'Established the quantitative rigor science still uses',
        note: 'Density became a fingerprint of material identity.',
      },
    ],
    deepDive: {
      phenomenon: 'Why density decides floating, and what it really is on the atomic scale',
      intro:
        'Density is mass per unit volume, ρ = m/V. But that one ratio hides a lot — about the packing of atoms, about buoyancy, and about why "heavy" materials can still float.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Density is how much "stuff" is packed into a space. A block of iron and a block of wood of the same size: the iron weighs much more, so it has higher density. Density = mass ÷ volume. Water has a density of about 1000 kg/m³ (or 1 g/cm³). Something denser than water sinks; something less dense floats. A steel ship floats because it is mostly hollow — its *overall* density (steel plus air inside) is less than water.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with units',
          body:
            'ρ = m/V. Since volume scales as length³, a small change in size changes volume drastically. Two objects of equal volume: higher mass means higher density. Buoyancy: a floating object displaces its own weight of fluid, so average object density below fluid density floats; equal densities hover; higher sinks. Ice floats on water because solid water is less dense than liquid water — an unusual quirk scientists still care about, because it lets lakes freeze at the top and keep life below.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and scientists',
          body:
            'Density you measure, but you also design for it. In fluids you need it for pressure: pressure increases with fluid depth as P = ρgh. Specific gravity is density relative to water — dimensionless and easy to compare. Material science tabs density against strength (specific strength) to pick lightweight structural materials. In oceanography, water density from temperature and salinity drives global currents; the exact density anomalies near 4 °C drive lake mixing.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Density is the continuum-limit mass distribution: a push-forward of the microscopic atom distribution onto a volume, ρ = dm/dV. In a fluid, density variations couple with gravity to produce buoyancy and stratification, described by the Archimedes/buoyancy force F_b = ρ_f g V_displaced. Compressibility, the change of density under pressure, distinguishes gases from liquids; at the cosmological scale, baryonic density contrast seeds structure formation. The "packing" view also explains why crystalline solids are denser than their liquid forms — except water, whose hydrogen-bonded lattice is more open.',
        },
      ],
    },
    whatCameBefore:
      'You need mass (how much stuff) and volume (how much space) before you can join them into density. Both come earlier in your physics path.',
    connections: [
      'Buoyancy and Archimedes’ principle (density decides float or sink)',
      'Pressure (which depends on density in fluids)',
      'Mass and volume (the two quantities density combines)',
    ],
    applications: [
      'Ships and submarines control their average density with ballast tanks — hollow steel boats float because they are mostly air.',
      'Hot-air balloons rise because heated air is less dense than the cooler air around it.',
      'Geologists identify rock layers and oil traps by measuring density changes underground.',
    ],
    workedExamples: [
      'A rock has mass 300 g and volume 120 cm³. Its density = 300 ÷ 120 = 2.5 g/cm³, denser than water (1 g/cm³), so it sinks. If it displaced 300 g of water, it would weigh nothing in water — the buoyant force equals the displaced water’s weight.',
    ],
    analogies: [
      'Density is like how crowded a train carriage is: a carriage with the same number of people but half the seats is "denser" even if the total mass is the same. Being crowded means the same stuff in less space.',
    ],
    misconceptions: [
      'Heavy things do not always sink — whether something floats depends on density, not on total weight or mass.',
      'The density of water is not "1" in all units; it is 1000 kg/m³ or 1 g/cm³.',
      'Ice floating on water is surprising to many, yet it is because ice is the less dense phase.',
    ],
    tryThis:
      'Half-fill a jar with water. Gently place an egg in it — it sinks. Now stir in a lot of salt; the egg rises. You have changed the water’s density, not the egg’s, and that decides the outcome.',
    funFacts: [
      'The density of a black hole is, by one common definition, enormous — but a large black hole can have an average density less than water when measured across its whole volume.',
      'Mercury is dense enough that most metals float on it; a steel ball bearing floats on a pool of mercury.',
    ],
    estimatedTimeMinutes: 14,
  },

  'lhs:phys.friction': {
    conceptId: 'lhs:phys.friction',
    hook:
      'Friction is the force that lets you walk and brakes without sliding, yet it is also the force that wears out your shoes and makes engines hot. It is everywhere, it is not one single thing, and — as scientists gradually realised — the simple "it just resists motion" hides a surprisingly deep story about rough surfaces and atomic contact.',
    history:
      'For centuries friction was treated as an inconvenient fact of life, philosophically boring compared to ideal motion. Leonardo da Vinci studied it carefully with experiments on blocks and ropes, and his notebooks record that friction is roughly independent of the area of contact — a subtle and correct observation. In the late 1600s Guillaume Amontons rediscovered these laws: friction force is proportional to the normal force and independent of contact area. In the 1700s Charles-Augustin de Coulomb (the same Coulomb of electric charge) confirmed them and distinguished static from kinetic friction. It was only in the mid-20th century that scientists explained *why* the simple laws hold: at a microscopic level, real surfaces touch only at tiny peaks, and friction comes from the real contact area that grows with load.',
    figures: [
      {
        name: 'Leonardo da Vinci',
        lifespan: '1452–1519',
        role: 'Italian polymath, artist and engineer',
        contribution:
          'Performed some of the first systematic experiments on friction, recording that friction is independent of contact area — two centuries before the laws were formalised.',
        statement:
          'Friction will be the cause of troubles.',
        statementSource: 'From Leonardo’s notebooks (paraphrase of his mechanical notes)',
      },
      {
        name: 'Guillaume Amontons',
        lifespan: '1663–1705',
        role: 'French physicist',
        contribution:
          'Established the classic laws of friction (1669/1699): friction is proportional to the normal force and independent of the apparent contact area.',
        statement:
          'The resistance that surfaces make to sliding one over another is proportional to the pressure between them.',
        statementSource: 'Paraphrase of Amontons’ laws (1699), Histoire de l’Académie royale des sciences',
      },
      {
        name: 'Charles-Augustin de Coulomb',
        lifespan: '1736–1806',
        role: 'French physicist and military engineer',
        contribution:
          'Confirmed and extended friction laws, separating static friction from kinetic friction, and making the coefficient of friction a useful engineering tool.',
        statement:
          'Friction … is proportional to the pressure, and independent of the extent of the surfaces.',
        statementSource: 'Paraphrase of Coulomb’s friction experiments (1781), Prix de l’Académie',
      },
    ],
    timeline: [
      {
        period: 'c. 1490s',
        event: 'Leonardo da Vinci experiments on friction and notes it is independent of contact area.',
        figure: 'Leonardo da Vinci',
      },
      {
        period: '1699',
        event: 'Amontons presents the laws: friction ∝ normal force, independent of area.',
        figure: 'Guillaume Amontons',
      },
      {
        period: '1781',
        event: 'Coulomb distinguishes static and kinetic friction and systematises the coefficient ',
        figure: 'Charles-Augustin de Coulomb',
      },
      {
        period: '20th century',
        event: 'Researchers explain the laws via real (microscopic) contact area and adhesion.',
      },
    ],
    perspectives: [
      {
        figure: 'Leonardo da Vinci (c. 1490)',
        view: 'Friction is independent of the area of contact — a result found experimentally, centuries early.',
        standing: 'Confirmed and foundational',
        note: 'His notebooks were lost to the public for centuries.',
      },
      {
        figure: 'Amontons and Coulomb (17th–18th c.)',
        view: 'Friction is a simple proportional law: F_f = μ·N, with μ the coefficient and separate static and kinetic values.',
        standing: 'Established engineering approximation',
        note: 'Simple, useful, and for ordinary materials accurate.',
      },
      {
        figure: 'Modern tribology (20th c.)',
        view: 'Friction arises from real microscopic contact area that grows with load, not from the visible surface area.',
        standing: 'The deeper current understanding',
        note: 'It explains why the simple laws hold so well.',
      },
    ],
    deepDive: {
      phenomenon: 'The hidden physics of why surfaces resist sliding',
      intro:
        'Friction looks like "roughness," but at the scale that matters it is about tiny contacts, adhesion and real contact area. This deep-dive walks from the everyday to the atomic.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Friction is the force that slows sliding. When you slide a book across a table, tiny bumps grab and resist it. It acts against the direction you push. If you press harder, friction grows. Static friction holds you (and the book) still until you push hard enough; kinetic friction acts while it is already sliding. Roughness is easy to picture, but the real story is subtler.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with forces',
          body:
            'The classic law: friction force F ≤ μ·N, where N is the normal contact force and μ the coefficient of friction. Static friction can range up to μ_s·N; kinetic friction is roughly μ_k·N. The coefficient depends on the two materials, not on area or (approximately) speed. This is why a heavy crate is harder to start moving than a light one (bigger N) — but why doubling the crate’s width does not double its friction. Friction converts kinetic energy to heat, which is why brakes get hot.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and tribologists',
          body:
            'The engineering picture is that real contact occurs only at micro-peaks (asperities). As normal load rises, those peaks deform and the *real* contact area grows nearly proportional to load, which is why F ≈ μ·N. The coefficient μ collapses a great deal of physics — adhesion, plastic deformation of asperities, ploughing. Engineering uses μ for design (tyres, clutches, brakes) while tribology models wear, lubrication films and contact temperature. Under very light load or in vacuum, adhesion can dominate and the simple law fails, which is why micro-machines and satellites face "stiction."',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Friction at the nanoscale is dominated by atomic-scale adhesion and energy dissipation through phonons and electron excitations. Bowden and Tabor’s model ties friction to the real area of contact given by contact mechanics; static and kinetic coefficients emerge from the stick–slip of interlocking asperity junctions. Amontons’ laws are an emergent *average* over microscopic disorder, not a fundamental law — which is why ultra-flat, clean surfaces in ultra-high vacuum show wildly different (often much higher) friction. Understanding this regime matters for everything from hard disks to micro-electromechanical actuators.',
        },
      ],
    },
    whatCameBefore:
      'You need a feel for forces and normal contact force before friction makes sense — friction is itself one kind of contact force you meet early in a forces chapter.',
    connections: [
      'Forces and Newton’s laws (friction is one contact force)',
      'Work and energy (friction turns kinetic energy into heat)',
      'Pressure and normal force (friction depends on the normal force)',
    ],
    applications: [
      'Brake pads convert the kinetic energy of a moving car into heat through friction, slowing it safely.',
      'Tyre treads are designed to manage friction so a car grips the road in rain.',
      'Matches light because the friction of striking heats the head enough to ignite it.',
    ],
    workedExamples: [
      'A 10 kg box sits on a floor with coefficient of static friction 0.4. The normal force is weight = 10 × 9.8 = 98 N. The maximum static friction is μ·N = 0.4 × 98 = 39.2 N. You must push harder than 39.2 N to start it sliding; below that, static friction prevents motion.',
    ],
    analogies: [
      'Think of two pieces of Velcro pressed together: pulling them apart against that grip is like static friction. Once they start shifting, the sliding resistance is usually less — like kinetic friction being easier than getting going.',
    ],
    misconceptions: [
      'Friction is not "always against motion" — static friction can point *with* the intended motion or hold you still; it acts against the tendency to slide.',
      'Friction does not simply grow with surface area; it grows with the force pushing the surfaces together.',
      'There is no "universal" coefficient of friction — it depends on the two specific materials.',
    ],
    tryThis:
      'Slide a heavy book across a table first with a gentle push, then press down hard while sliding. You will feel it resist harder — because pressing down increases the normal force, and friction follows it.',
    funFacts: [
      'The formula for friction in brakes, tyres and clutches was largely settled by the 1780s — yet explaining *why* took almost two more centuries.',
      'Ball bearings reduce friction by replacing sliding with rolling, but the ball-to-path contact still generates some rolling resistance.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.free-fall': {
    conceptId: 'lhs:phys.free-fall',
    hook:
      'Drop a feather and a hammer on the Moon and they land together. On Earth, air drag masks this — but the clean truth beneath it, that everything falls at the same rate in a vacuum, was so audacious that even Galileo’s contemporaries struggled to believe it. It is the most important single experiment in the history of motion.',
    history:
      'Aristotle taught that heavier bodies fall faster, and the claim went unchallenged for two thousand years. Galileo Galilei, through a combination of thought experiments and experiments with inclined planes, showed that in the absence of air resistance all bodies fall with the same, uniform acceleration. He argued that if you imagine a heavy body and a light body joined, the old view leads to a contradiction, so the only consistent picture is that they fall together. In the centuries since, the reality was placed beyond doubt: in 1971 astronaut David Scott dropped a hammer and a feather on the Moon and they hit the surface at the same instant — a live confirmation of Galileo’s idealised claim.',
    figures: [
      {
        name: 'Aristotle',
        lifespan: '384–322 BCE',
        role: 'Greek philosopher',
        contribution:
          'Taught that heavier objects fall faster than lighter ones — the view Galileo would overturn.',
        statement:
          'The heavy moves quickly towards its own place naturally.',
        statementSource: 'Attributed to the Aristotelian tradition (paraphrase of On the Heavens)',
      },
      {
        name: 'Galileo Galilei',
        lifespan: '1564–1642',
        role: 'Italian mathematician, physicist and astronomer',
        contribution:
          'Proved by reasoning and experiment that all bodies fall with the same uniform acceleration in the absence of air resistance, establishing acceleration due to gravity as g ≈ 9.8 m/s².',
        statement:
          'If a heavy body and a light body are united, the ratio of their speeds should be less than the ratio of the heavy to the light — an evident contradiction; hence they fall together.',
        statementSource: 'Paraphrase of Galileo’s thought experiment (Dialogues, 1638)',
      },
      {
        name: 'David Scott',
        lifespan: '1932–',
        role: 'American astronaut',
        contribution:
          'In 1971, on the Apollo 15 mission, he dropped a hammer and a feather on the airless Moon and confirmed they fell together, visually proving Galileo correct.',
        statement:
          'I think we’ve proved Mr. Galileo right.',
        statementSource: 'David Scott, Apollo 15 Commander, August 2, 1971 (transcript of the lunar television broadcast)',
      },
    ],
    timeline: [
      {
        period: 'c. 350 BCE',
        event: 'Aristotle holds that heavier bodies fall faster.',
        figure: 'Aristotle',
      },
      {
        period: '1604–1638',
        event: 'Galileo derives and verifies uniform acceleration of falling bodies.',
        figure: 'Galileo Galilei',
      },
      {
        period: '1687',
        event: 'Newton’s law of gravitation makes falling a special case of gravity acting over distance.',
        figure: 'Isaac Newton',
      },
      {
        period: '1971',
        event: 'Apollo 15 astronaut David Scott drops a feather and a hammer on the Moon; they land together.',
        figure: 'David Scott',
      },
    ],
    perspectives: [
      {
        figure: 'Aristotle (c. 350 BCE)',
        view: 'Heavier bodies fall faster because they more strongly tend toward their natural place.',
        standing: 'Superseded by experiment',
        note: 'This is the frame that made Galileo’s claim so surprising.',
      },
      {
        figure: 'Galileo Galilei (1638)',
        view: 'In the absence of air, all bodies fall with the same uniform acceleration.',
        standing: 'Established — the foundation of free-fall',
        note: 'He proved it with reasoning and ramps, before the Moon experiment.',
      },
      {
        figure: 'Isaac Newton (1687)',
        view: 'Falling is gravity acting over distance; the acceleration is the same because gravitational and inertial mass are equal.',
        standing: 'The current classical understanding',
        note: 'The equality of inertial and gravitational mass became a postulate of general relativity.',
      },
      {
        figure: 'David Scott (Apollo 15, 1971)',
        view: 'The controlled lunar drop is a visible, undeniable demonstration of Galileo’s claim.',
        standing: 'Verified live on the Moon',
        note: 'Air resistance, not gravity, is what usually separates a feather from a hammer.',
      },
    ],
    deepDive: {
      phenomenon: 'Why everything falls at the same rate, and what that reveals about gravity',
      intro:
        'Free fall is motion under gravity alone. That every object accelerates the same reveals something fundamental about the nature of gravity — this deep-dive scales from the experiment to general relativity.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Free fall means falling only under gravity — no air resistance, no parachute, nothing else nudging you. Near Earth’s surface every falling thing accelerates at g ≈ 9.8 m/s². So a pencil and a basketball dropped from a window hit the ground at the same time if air does not interfere. On the Moon, where there is no air, a hammer and a feather really do land together. The famous number: every second of fall, speed grows by about 9.8 m/s.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'Free-fall kinematics: v = g·t, and distance fallen from rest d = ½·g·t². Close to Earth, g ≈ 9.8 m/s². Air resistance adds a drag force that grows with speed until terminal velocity, where drag balances weight and acceleration falls to zero. Skydivers reach terminal velocity of roughly 50–60 m/s belly-down. True free fall — weightlessness — happens whenever you accelerate at exactly the local value of g, as orbiting astronauts do.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied scientists',
          body:
            'In a vacuum chamber or free-falling payload, ballistic trajectories follow v = g·t and d = ½gt² exactly. Trajectory design for dropped payloads, parachute timing, accelerometer calibration and drop towers (for microgravity) all use the same formalism. Terminal velocity is solved from mg = ½ρ C_d A v²_t, coupling g, drag coefficient and air density. The equal-fall property means gravitational acceleration is purely kinematic near the surface — a fact exploited to calibrate inertial systems.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'The equality of gravitational and inertial mass — that all objects trace identical free-fall trajectories — is the weak equivalence principle. Einstein elevated it into general relativity: locally, a free-falling frame is inertial, and gravity becomes the curvature of spacetime rather than a force. Weightlessness is not the absence of gravity but local free fall; tidal forces are the measurable remnant of curvature. The Schwarzschild geometry predicts that coordinate acceleration of a distant free-falling test body approaches a modified g and, at the event horizon, light itself cannot escape — the modern successor to Galileo’s equal-fall intuition.',
        },
      ],
    },
    whatCameBefore:
      'You need velocity and acceleration, and Newton’s idea of a force called gravity. Free fall is the clearest example of uniform acceleration you will meet.',
    connections: [
      'Acceleration (free fall is constant acceleration at g)',
      'Newton’s law of gravitation (what causes falling)',
      'Weight (weight = mass × g is the force during fall)',
    ],
    applications: [
      'Parachutes deploy to add drag and lower a falling parachutist to a safe terminal velocity.',
      'Drop towers for experiments create brief microgravity so scientists can study how cells behave without weight pulling them.',
      'A bungee jump passes through free fall before the cord stretches and begins to decelerate.',
    ],
    workedExamples: [
      'A stone is dropped from rest. After 3 seconds of free fall: v = g·t = 9.8 × 3 = 29.4 m/s, and it has fallen d = ½·9.8·9 = 44.1 m. Time-squared growth is why doubling the fall time quadruples the distance.',
    ],
    analogies: [
      'Free fall is like coasting down a frictionless hill that just happens to point straight down: no steering, no brakes — only a constant pull that keeps adding speed every second.',
    ],
    misconceptions: [
      'Free fall is not "falling fast" or "falling for a long time" — it is falling with nothing to resist you.',
      'It is not true that lighter things fall slower; air resistance, not gravity, is usually the culprit.',
      'Weightlessness (in orbit) is not the absence of gravity — gravity is nearly as strong up there; the astronauts are just falling freely around Earth.',
    ],
    tryThis:
      'Drop two identical sheets of paper, one crumpled into a ball. The flat sheet flutters and lands late; the crumpled ball drops almost as a "heavy" object. Same gravity, same mass — different air resistance.',
    funFacts: [
      'Astronauts on the ISS float because the station, and they, are in continuous free fall around Earth.',
      'If you fell toward Earth from far away you would reach the surface at about 11 km/s — the escape speed reversed.',
    ],
    estimatedTimeMinutes: 16,
  },
};