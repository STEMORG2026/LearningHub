/**
 * Batch 4 — senior-secondary (NEB Grade 11) mechanics narratives.
 *
 * Authored to the Master-Reviewer rubric (docs/guides/task-playbooks/narration/):
 * story-shaped prose, real people with recorded words + sources, a historical
 * timeline, respected/differing views given due weight, and a deep-dive that scales
 * Curious → Enthusiast → Professional → Nerd. Canonical facts stay consistent with the
 * vendored STEMMA export.
 */
import type { NarrativeContent } from '@learninghub/content-provider';

export const NARRATIVES_BATCH4: Record<string, NarrativeContent> = {
  'lhs:phys.impulse': {
    conceptId: 'lhs:phys.impulse',
    hook:
      'A sheet crumples a little and the egg survives; a brick wall does not and the egg does not. The break is time. Impulse is the quiet idea that lets a boxer roll with a punch, a parachute open, and a diver plunge into a pool — all by buying the same change of motion a little more time.',
    history:
      'Impulse grew out of the earliest attempts to talk about pushes in a way that could be measured. René Descartes, in the 1640s, spoke of the "quantity of motion" a moving body carries, and the idea of a force acting through an interval steadily became a quantity in its own right. Isaac Newton, in the 1687 Principia, framed his second law as "the alteration of motion is proportional to the motive force impressed" — that is, a force acting for a time changes a body’s momentum. The modern compact form, impulse J = F·Δt = Δp, unifies force and time into one measured quantity: the product that decides how much a push actually changes motion, no matter whether the push is sharp or long.',
    figures: [
      {
        name: 'René Descartes',
        lifespan: '1596–1650',
        role: 'French mathematician and natural philosopher',
        contribution:
          'Introduced the idea of "quantity of motion" (momentum in modern dress), giving scientists a conserved, measurable descriptor of moving bodies.',
        statement:
          '…the quantity of motion which God put in matter is altogether conserved.',
        statementSource: 'Paraphrase of Descartes, Principia Philosophiae (1644)',
      },
      {
        name: 'Isaac Newton',
        lifespan: '1643–1727',
        role: 'English mathematician and natural philosopher',
        contribution:
          'Expressed the effect of a force over time as the change of motion (momentum), the physical core of impulse.',
        statement:
          'The alteration of motion is ever proportional to the motive force impressed; and is made in the direction of the right line in which that force is impressed.',
        statementSource: 'Isaac Newton, Principia, Law II (1687, trans. Andrew Motte)',
      },
    ],
    timeline: [
      {
        period: '1644',
        event: 'Descartes frames "quantity of motion" as conserved.',
        figure: 'René Descartes',
        note: 'An early, flawed, but decisive step toward momentum.',
      },
      {
        period: '1687',
        event: 'Newton states that force over time changes motion (momentum).',
        figure: 'Isaac Newton',
      },
      {
        period: '19th century',
        event: 'Engineers and physicists formalise impulse and use force–time graphs; safety engineering (airbags, crumple zones) later applies it directly.',
        note: 'The idea leaves theory and starts saving lives.',
      },
    ],
    perspectives: [
      {
        figure: 'René Descartes (1644)',
        view:
          'There is a conserved quantity of motion, proportional to size and speed — an early quantity-of-motion idea.',
        standing: 'Refined and corrected (he omitted direction); conceptually foundational',
        note: 'His "quantity of motion" lacked direction; momentum and impulse completed it.',
      },
      {
        figure: 'Isaac Newton (1687)',
        view:
          'Force acting for a time produces a change of motion — the exact relationship impulse encodes.',
        standing: 'The current consensus in classical mechanics',
        note: 'Generalises to variable forces by integrating over time.',
      },
      {
        figure: 'Modern safety engineering',
        view: 'For a fixed change of momentum, lengthening the collision time lowers the average force — the working principle of airbags and crumple zones.',
        standing: 'Applied consensus',
        note: 'The direct, life-saving use of impulse.',
      },
    ],
    deepDive: {
      phenomenon: 'How force and time combine into impulse — and why time decides breakage',
      intro:
        'Impulse is the product of force and the time it acts, and it equals the change of momentum. The subtle part — that spreading the same impulse over more time softens the blow — is what this deep-dive unpacks.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Impulse is a force multiplied by how long it acts: J = F·Δt. A strong force for a short time and a gentle force for a long time can give the same impulse — the same change of motion. That is why catching a fast ball by pulling your hand back works: you lengthen the time over which the ball slows, so the force on your hand is smaller. Airbags do the same. Impulse equals the change in momentum, J = Δ(m·v).',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'From Newton’s second law, F = Δ(mv)/Δt, so F·Δt = Δ(mv). Impulse J = ∫F·dt equals the change of momentum, and for constant mass J = m·Δv. The units are N·s, identical to kg·m/s. On a force–time graph, the impulse is the area under the curve. This is why collision safety focuses on time: for a given Δp, a longer Δt gives a smaller average force, F_avg = Δp/Δt.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and crash-safety designers',
          body:
            'In impact engineering you design for a target average force by controlling deformation time. Crumple zones, airbag inflation rates and helmet liners are tuned so the occupant’s momentum change happens over the largest safe Δt, keeping peak deceleration within human tolerance (roughly tens of g with restraint). Analysis uses F_avg = Δp/Δt, and variable forces are handled by integrating the force–time trace. The same principle sizes padded floors, landing mats and protective packaging.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Impulse is the time-integral of force, the time-component of the force–momentum exchange at the core of Newtonian and relativistic dynamics. In collisions it connects to momentum conservation and the impulse–momentum theorem; in elasticity the peak force is bounded by contact time and stiffness. Over short impulsive events, external forces often act far more slowly than the impact itself, so momentum is approximately conserved across the collision. The same Δp over smaller Δt raises F — which is precisely what makes a bullet’s impulse so destructive and a thrusting rocket, with gentle long-duration force, so gentle per unit impulse.',
        },
      ],
    },
    whatCameBefore:
      'You need momentum (mass × velocity) and force. Impulse is the bridge between them — force multiplied by the time it acts gives exactly the change in momentum.',
    connections: [
      'Momentum (impulse is what changes it)',
      'Newton’s second law (impulse is its time-integrated form)',
      'Conservation of momentum (collisions)',
    ],
    applications: [
      'An airbag inflates so your head slows over a longer time, cutting the crash force — impulse buys you the milliseconds that save your neck.',
      'A goalkeeper catches a hard shot by pulling hands back, lengthening the catch time and halving the sting.',
      'Crumple zones in cars are designed to extend the collision time before the passenger compartment feels the stop.',
    ],
    workedExamples: [
      'A 150 g cricket ball moving at 30 m/s is stopped by a wicket-keeper’s gloves over 0.05 s. Change in momentum Δp = 0.150 × 30 = 4.5 kg·m/s. Average force F = Δp/Δt = 4.5 ÷ 0.05 = 90 N. If the keeper pulls back and doubles the stopping time to 0.10 s, the force halves to 45 N — that is the physics of a cushioned catch.',
    ],
    analogies: [
      'Picture stamping a cardboard box: one sharp stamp and you crush it; press the same total push slowly over a second and the box just moves. Same impulse, gentler force — because you stretched the time.',
    ],
    misconceptions: [
      'Impulse is not force alone; it is force times time.',
      'A small force can give a large impulse if it acts long enough.',
      'Impulse is not only about collisions — every force acting over time produces impulse.',
      'Two equal impulses always mean equal momentum change, whatever the force shape.',
    ],
    tryThis:
      'Hold a raw egg over a thick towel and drop it from waist height — it survives. Drop it onto a plate and it breaks. The egg’s drop is the same; the towel just stretches the deceleration time.',
    funFacts: [
      'A karate chop can break a board because the hand’s momentum is dumped in a fraction of a millisecond, spiking the force.',
      'The force on your head in a proper airbag crash is spread over roughly 30 to 100 milliseconds — enough to shift from lethal to survivable.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.inertia': {
    conceptId: 'lhs:phys.inertia',
    hook:
      'Everything keeps doing what it is doing until something makes it stop — a leaning tower of books stays up, a moving car wants to keep moving. This reluctance to change, which the Romans never named and the medievals denied, is the single idea that lets Newton’s whole physics stand at all.',
    history:
      'For centuries, the natural assumption — championed by Aristotle — was that a body at rest naturally stays at rest and a moving body naturally slows until it stops. It took Galileo Galilei to break this. Through thought experiments of perfectly smooth planes he showed that a moving body, left alone, keeps moving forever at constant speed; there is no "natural" decay. Isaac Newton named this property and made it the first of his laws. The word "inertia" itself comes from the Latin *iners*, meaning idle or sluggish — Newton used a variant to describe the matter’s resistance to change. In the 20th century, Albert Einstein centred his general relativity on the deep equality of inertial and gravitational mass, turning Galileo’s intuition into the very skeleton of gravity.',
    figures: [
      {
        name: 'Aristotle',
        lifespan: '384–322 BCE',
        role: 'Greek philosopher',
        contribution:
          'Taught that rest is the natural state and that continued motion requires a continued mover — the view inertia had to overturn.',
        statement:
          'Whatever is in motion is moved by something.',
        statementSource: 'Paraphrase of Aristotle, Physics, Book VII (c. 350 BCE)',
      },
      {
        name: 'Galileo Galilei',
        lifespan: '1564–1642',
        role: 'Italian mathematician, physicist and astronomer',
        contribution:
          'Showed by idealised reasoning that a body, once moving, continues at constant velocity unless acted on — the birth of the inertia idea.',
        statement:
          'A body which is in a state of motion moves with constant velocity in the same direction unless it is acted upon by an external force.',
        statementSource: 'Galileo, Dialogues Concerning Two New Sciences (1638) — paraphrase of his law of inertia',
      },
      {
        name: 'Isaac Newton',
        lifespan: '1643–1727',
        role: 'English mathematician and natural philosopher',
        contribution:
          'Made inertia the first law of motion and tied it to mass, calling matter’s resistance to change its inherent force of inactivity.',
        statement:
          'Every body perseveres in its state of rest, or of uniform motion in a right line, unless it is compelled to change that state by forces impressed thereon.',
        statementSource: 'Isaac Newton, Principia, Law I (1687, trans. Andrew Motte)',
      },
    ],
    timeline: [
      {
        period: 'c. 350 BCE',
        event: 'Aristotle holds that motion requires a sustaining mover.',
        figure: 'Aristotle',
        note: 'The deeply intuitive view inertia will overturn.',
      },
      {
        period: '1638',
        event: 'Galileo argues that a moving body keeps its velocity unless acted on.',
        figure: 'Galileo Galilei',
      },
      {
        period: '1687',
        event: 'Newton states the law of inertia as his first law of motion.',
        figure: 'Isaac Newton',
      },
      {
        period: '1916',
        event: 'General relativity builds on the equality of inertial and gravitational mass.',
        figure: 'Albert Einstein',
      },
    ],
    perspectives: [
      {
        figure: 'Aristotle (c. 350 BCE)',
        view: 'Rest is natural; motion needs a constant cause.',
        standing: 'Superseded by experiment',
        note: 'Feels true near the ground, where friction masks inertia.',
      },
      {
        figure: 'Galileo Galilei (1638)',
        view: 'A moving body continues at constant velocity forever if nothing acts.',
        standing: 'Established — the foundation of the first law',
        note: 'Arrived at by idealised reasoning, not a real frictionless surface.',
      },
      {
        figure: 'Isaac Newton (1687)',
        view: 'Inertia is the body’s resistance to change, proportional to its mass.',
        standing: 'The working law of everyday mechanics',
        note: 'Mass is the measure of inertia.',
      },
      {
        figure: 'Albert Einstein (1916)',
        view: 'Inertial and gravitational mass are equal, and this is the root of gravity — free fall is motion along curved spacetime.',
        standing: 'The modern consensus',
        note: 'Inertia’s deepest modern reading.',
      },
    ],
    deepDive: {
      phenomenon: 'Why inertia is not a force, and how it becomes the basis of motion',
      intro:
        'Inertia is a body’s resistance to any change in its state of motion — a property of matter, not a push. This deep-dive separates it from force and carries it into relativity.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Inertia is why things are "lazy" about changing speed or direction. A parked car resists being pushed; a moving car resists being stopped. That resistance is inertia. It is not a force that pushes back through space — it is the property of matter that makes change need a cause. The bigger the mass, the more inertia: a loaded truck is harder to stop than a bicycle because it has more inertia.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with forces',
          body:
            'Newton’s first law: a body continues at constant velocity unless a net force acts. Inertia is quantified by mass: larger m means more resistance to a given acceleration, which is why the second law F = ma couples force to mass. It is a common confusion to think a "force of inertia" shoves you forward when a car brakes — there is no such forward force; your body simply continues moving (inertia) until the seatbelt applies a real force.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied scientists',
          body:
            'Inertia enters every dynamic model as mass and moment of inertia. Translational inertia (mass) resists linear acceleration; rotational inertia (moment of inertia I) resists angular acceleration, τ = I·α. In vehicle design, higher inertia means longer stopping distances and bigger control forces; inertial navigation senses mass’s resistance to acceleration to locate a craft without external reference. Seatbelts, airbags and crumple zones all exist because human inertia must be managed during rapid deceleration.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'The law of inertia is the statement that an inertial frame exists and that free motion is straight and uniform. In general relativity, inertia is geometry: bodies follow geodesics, and "constant velocity" depends on the connection. The equality of inertial and gravitational mass — the weak equivalence principle — is the observation that free fall erases the distinction, making weight and inertia two faces of the same curvature. Mach even questioned whether inertia is local at all, suggesting it may arise from the distant matter of the universe — an open and still-disputed idea.',
        },
      ],
    },
    whatCameBefore:
      'You need mass and velocity. Inertia is what gives mass its everyday meaning — the resistance that makes force necessary to change motion.',
    connections: [
      'Newton’s first law (inertia is its content)',
      'Mass (the measure of inertia)',
      'Newton’s second law (force overcomes inertia)',
    ],
    applications: [
      'Seatbelts and airbags exist because your body, by inertia, keeps moving forward when the car stops suddenly.',
      'Shaking a tree branch knocks fruit loose: the branch moves, the fruit’s inertia keeps it behind, and it breaks free.',
      'Inertial guidance keeps submarines and spacecraft on course by measuring the mass’s resistance to acceleration.',
    ],
    workedExamples: [
      'If a car brakes suddenly, your body — by inertia — continues forward. To stop you in 0.2 s from 20 m/s, a seatbelt must supply force F = m·Δv/Δt = 70 × 20 ÷ 0.2 = 7000 N on you. Inertia does not push you; the belt is the real force stopping you.',
    ],
    analogies: [
      'Picture inertia as the stubbornness of a sled on ice: once it is moving it keeps sliding — not because anything is pushing it, but because nothing is stopping it. The sled’s mass is its stubbornness.',
    ],
    misconceptions: [
      'Inertia is not a forward force when a vehicle brakes; it is your body continuing to move.',
      'Inertia is not weight; a heavy object has more inertia because of mass, not gravity.',
      'Inertia applies to objects in motion as much as to objects at rest.',
    ],
    tryThis:
      'Put a coin on top of a card on top of a cup. Flick the card out fast — the coin drops straight into the cup. The coin’s inertia makes it resist the quick sideways pull, so it falls straight down with almost no sideways motion.',
    funFacts: [
      'The word "inertia" comes from Latin *iners* — "idle" or "inactive" — Newton’s own name for the idea.',
      'A fly inside a sealed, speeding train flies normally — the air and the fly share the train’s motion, so inertia is invisible until the train accelerates or brakes.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.kinetic-energy': {
    conceptId: 'lhs:phys.kinetic-energy',
    hook:
      'A juggler’s ball, a batter’s swing, a freight train’s tonnage — all are the same thing in different packages: energy of motion. And because it grows with the square of speed, kinetic energy is why going twice as fast is four times as dangerous.',
    history:
      'The idea that a moving body "holds" energy took centuries to pin down. Gottfried Leibniz in the 1680s argued that a moving body’s "living force" (vis viva) was proportional to mass times the square of velocity — a radical claim against Cartesian views that it was merely momentum. The term "kinetic energy" came from the Greek *kinesis* (motion), promoted by William Rankine and William Thomson (Lord Kelvin) in the mid-1800s as energy split into two kinds. Émilie du Châtelet, in her 1740 commentary on Newton, was among the first to publish the law of conservation of energy with kinetic and potential energy clearly distinguished. By the time Joule demonstrated the mechanical equivalent of heat, kinetic energy was a cornerstone.',
    figures: [
      {
        name: 'Gottfried Wilhelm Leibniz',
        lifespan: '1646–1716',
        role: 'German mathematician and philosopher',
        contribution:
          'Proposed that the "living force" (vis viva) of a moving body scales as mass × velocity squared — the seed of kinetic energy.',
        statement:
          'The living forces are proportional to the square of the velocities.',
        statementSource: 'Paraphrase of Leibniz’s vis viva argument (1686), Acta Eruditorum',
      },
      {
        name: 'Émilie du Châtelet',
        lifespan: '1706–1749',
        role: 'French scientist and translator of Newton',
        contribution:
          'From experiments on falling balls she defended the velocity-squared law and, in her Institutions de Physique (1740), helped introduce the idea energy is conserved.',
        statement:
          'The quantity of action… is greater for a large living force than for a small.',
        statementSource: 'Paraphrase from Émilie du Châtelet’s Institutions de Physique (1740)',
      },
      {
        name: 'James Prescott Joule',
        lifespan: '1818–1889',
        role: 'English physicist and brewer',
        contribution:
          'Measured the mechanical equivalent of heat, showing kinetic/mechanical energy converts into heat energy — energy conservation across forms.',
        statement:
          '…the inexhaustible power of gravity is a source of mechanical effect derivable from the earth.',
        statementSource: 'James Joule, "On the Mechanical Equivalent of Heat" (1843) — paraphrase',
      },
    ],
    timeline: [
      {
        period: '1686',
        event: 'Leibniz argues living force ∝ mv², against Cartesian momentum views.',
        figure: 'Gottfried Leibniz',
      },
      {
        period: '1740',
        event: 'Émilie du Châtelet publishes Institutions de Physique, defending velocity-squared energy and its conservation.',
        figure: 'Émilie du Châtelet',
      },
      {
        period: '1843–1847',
        event: 'Joule measures the mechanical equivalent of heat.',
        figure: 'James Prescott Joule',
      },
      {
        period: '1850s',
        event: 'Rankine and Kelvin formalise "kinetic" and "potential" energy as the two kinds.',
        figure: 'William Rankine; William Thomson (Kelvin)',
      },
    ],
    perspectives: [
      {
        figure: 'Cartesian natural philosophers (17th c.)',
        view: 'The quantity of motion is momentum; "force of motion" is mass × speed.',
        standing: 'Superseded — momentum is conserved, but it is not energy',
        note: 'The debate hinged on confusing two conserved quantities.',
      },
      {
        figure: 'Gottfried Leibniz (1686)',
        view: 'A moving body’s living force is proportional to mv².',
        standing: 'Established — this is kinetic energy',
        note: 'Correct for the energy of motion.',
      },
      {
        figure: 'Émilie du Châtelet (1740)',
        view: 'The velocity-squared quantity is real, measurable, and conserved along with potential energy.',
        standing: 'Influential — one of the first clear energy-conservation statements',
        note: 'Her experiment with falling and rebounding balls gave empirical backing.',
      },
      {
        figure: 'James Joule (1843)',
        view: 'Mechanical energy converts into heat in fixed proportion.',
        standing: 'The current consensus — the mechanical equivalent of heat',
        note: 'Unified the two energies.',
      },
    ],
    deepDive: {
      phenomenon: 'Why kinetic energy scales with the square of speed',
      intro:
        'Kinetic energy is ½mv². The famous square is not a curiosity — it is what makes speed so dangerous, braking distances so long, and collisions so energetic. This deep-dive explains it.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Kinetic energy is the energy a moving object has because it moves: KE = ½·m·v². A slow-moving object has a little; double the speed and the energy goes up four times, not twice. That is why a car at 100 km/h is far more dangerous than at 50 — four times the kinetic energy to absorb in a crash. Mass matters too: a heavier truck at the same speed carries more kinetic energy than a light car.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'KE = ½mv². The v² comes from the work done to accelerate: work W = F·d, and with F = ma and v² = 2ad, you get W = ½mv². Because of the square, energy is very sensitive to speed: doubling v quadruples KE; tripling multiplies by nine. KE is always non-negative. Braking distance follows directly — a car’s stopping distance roughly quadruples when speed doubles, because the brakes must remove ½mv².',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied scientists',
          body:
            'Kinetic energy transfer governs collision severity, so impact engineering uses ΔKE (not just Δp) to assess damage — a bullet with ½mv² a few times larger can penetrate where impulse alone is modest. Wind turbines convert the kinetic energy of moving air (flowing through the rotor area) into electricity; because of the v² (and mass flow ∝ v), available power scales with v³. Vehicle dynamics, projectile ballistics and kinetic-energy weapons all balance ½mv² against practical constraints.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Kinetic energy is one term of a relativistic invariant — for a particle of rest mass m₀, E = γm₀c², whose non-relativistic limit gives KE ≈ ½m₀v². The v² structure reflects that energy is a scalar in the energy–momentum four-vector, while momentum is the spatial part. In thermodynamics, the average kinetic energy of molecules is proportional to absolute temperature — ⟨KE⟩ = ¾kT (per degree) — linking the microscopic motion to temperature. The square also makes KE frame-dependent, since it depends on the square of velocity in the chosen frame.',
        },
      ],
    },
    whatCameBefore:
      'You need velocity and mass, and work (force × distance). Kinetic energy is, in a sense, the work stored in motion — ½mv² falls straight out of work.',
    connections: [
      'Work and energy (work changes kinetic energy)',
      'Potential energy (KE converts to and from PE)',
      'Conservation of energy (KE is one currency of it)',
      'Temperature (molecular KE in gases)',
    ],
    applications: [
      'Braking distance rises with the square of speed, so a 100 km/h stop needs four times the distance of a 50 km/h stop.',
      'Wind turbines tap the kinetic energy of moving air; a wind turbine’s power output rises steeply with wind speed.',
      'A fast cricket ball carries enough kinetic energy to break gloves — that is why protective gear is engineered for ½mv².',
    ],
    workedExamples: [
      'A 1000 kg car at 20 m/s has KE = ½·1000·20² = 200,000 J. At 40 m/s (doubled speed), KE = ½·1000·40² = 800,000 J — four times as much. The brakes must dissipate four times the energy, which is why doubling speed roughly quadruples stopping distance.',
    ],
    analogies: [
      'A bowling ball and a tennis ball moving together: the bowling ball, heavier, carries far more kinetic energy; and a tennis ball served very fast can carry more energy than a slowly rolled bowling ball. Mass and the square of speed both count.',
    ],
    misconceptions: [
      'Kinetic energy is not proportional to speed — it is proportional to speed squared.',
      'Kinetic energy is never negative (it has no direction).',
      'Heavier is not always more kinetic energy — a light object at high speed can beat a heavy one at low speed.',
    ],
    tryThis:
      'Roll a marble down a ramp made of a ruler onto a flat table at two ramp heights. Notice how the marble travels much farther (more kinetic energy) when released a little higher — the height gives potential energy that becomes kinetic energy.',
    funFacts: [
      'A train moving at even 30 km/h carries enormous kinetic energy — enough that railway safety demands signals seen from far away.',
      'The name "kinetic energy" came from the Greek for motion; it was standardised by Rankine and Kelvin in the 1850s.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.potential-energy': {
    conceptId: 'lhs:phys.potential-energy',
    hook:
      'Place a book on a high shelf and you have stored something in the air — not in the book alone, but in the whole arrangement of book and Earth. That hidden energy, released the instant the book falls, is potential energy: the world keeping your debt until you let it fall.',
    history:
      'The idea that position stores energy emerged alongside kinetic energy. Émilie du Châtelet realised that a raised body, and a moving body, could both carry energy, and argued they convert into each other while the total holds steady. In the 1850s the Scottish engineer William Rankine introduced "potential energy" and William Thomson (Kelvin) championed the split of energy into kinetic and potential kinds. The term "potential" captured his idea that the energy is only latent — waiting, poised by position or configuration, to become motion.',
    figures: [
      {
        name: 'Émilie du Châtelet',
        lifespan: '1706–1749',
        role: 'French scientist and translator of Newton',
        contribution:
          'Argued that a body at height stores energy that converts to motion, helping establish energy conservation with both kinetic and potential (latent) forms.',
        statement:
          '…the energy of a body is measured by its capacity to perform work.',
        statementSource: 'Paraphrase of Émilie du Châtelet’s Institutions de Physique (1740)',
      },
      {
        name: 'William Rankine',
        lifespan: '1820–1872',
        role: 'Scottish civil and mechanical engineer',
        contribution:
          'Coined "potential energy" (and the term for energy of position), formalising energy into kinetic and potential categories.',
        statement:
          'Energy is the capability of producing changes in matter.',
        statementSource: 'Paraphrase of Rankine’s writing on the classification of energy (1853)',
      },
      {
        name: 'William Thomson (Lord Kelvin)',
        lifespan: '1824–1907',
        role: 'British mathematical physicist',
        contribution:
          'Promoted the kinetic–potential split of energy and the conservation of total mechanical energy.',
        statementSource: 'Kelvin’s lectures on the mechanical theory of energy (1850s) — paraphrase',
      },
    ],
    timeline: [
      {
        period: '1740',
        event: 'Émilie du Châtelet defends energy conservation with latent (position) energy.',
        figure: 'Émilie du Châtelet',
      },
      {
        period: '1853',
        event: 'Rankine introduces "potential energy" to name energy of position.',
        figure: 'William Rankine',
      },
      {
        period: '1850s',
        event: 'Kelvin promotes the kinetic–potential split and mechanical energy conservation.',
        figure: 'William Thomson (Kelvin)',
      },
    ],
    perspectives: [
      {
        figure: 'Émilie du Châtelet (1740)',
        view: 'A raised body holds latent energy convertible into motion; total energy is conserved.',
        standing: 'Established — one of the first clear statements',
        note: 'Preceded the formal vocabulary by a century.',
      },
      {
        figure: 'William Rankine (1853)',
        view: 'Energy splits into kinetic (of motion) and potential (of position/condition); both are "capability to produce change."',
        standing: 'The modern classification',
        note: 'His terminology still governs the subject.',
      },
      {
        figure: 'Gravitational field picture (formal physics)',
        view: 'Gravitational potential energy belongs to the body–Earth system, chosen relative to a reference level (PE = mgh with that choice).',
        standing: 'The current consensus',
        note: 'Only differences in PE are physical; the datum is a choice.',
      },
    ],
    deepDive: {
      phenomenon: 'Why potential energy is "stored," and where it lives',
      intro:
        'Potential energy is energy stored by position or configuration. The subtlety — that it belongs to a system, not to one object, and that only differences matter — is what this deep-dive makes clear.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Potential energy is "stored" energy — it is not doing anything yet, but it can become motion. Lift a ball to the top of a slide and it gains gravitational potential energy; let go and that stored energy turns into kinetic energy as it falls. For gravity near Earth, PE = m·g·h: the heavier, the higher, the more stored energy. It always depends on a reference level — "ground" — so only differences in height matter.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'Gravitational potential energy PE = mgh relative to your chosen datum. Because energy must come from somewhere, PE is a property of the object–Earth system, not the object alone — which is why lifting a book does work on the Earth–book pair. In conservative fields, PE is defined up to an additive constant; only differences matter. Springs store elastic potential energy PE = ½kx², and electrostatic PE = kqQ/r for point charges. As an object moves in a potential, ΔPE = −W by conservative forces, feeding conservation PE + KE = const.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied scientists',
          body:
            'Potential energy is central to energy budgets. Hydroelectric generation converts gravitational PE (mgh) of stored water into kinetic and then electrical energy; a pumped-storage plant reverses it, buying PE to sell later. Structural and aerospace engineers track elastic strain energy (½kσ²/…) in loaded members. Choosing the correct datum and being consistent about sign conventions avoids errors in conservative systems. In orbital mechanics, gravitational potential energy −GMm/r governs escape velocity and transfer orbits — the larger the radius, the less negative (higher) the PE.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Potential energy is a coordinate-dependent potential function whose gradient (with sign) gives conservative force: F = −∇U. In general relativity, gravitational PE becomes geometry — a test particle follows a geodesic, so the energy balance of orbits is more subtle, with binding energy tied to the metric. In quantum mechanics, the potential U(x) shapes the Schrödinger equation and gives rise to bound states with quantised energies, tunnelling through potential barriers, and the zero-point energy of oscillators. Elastic, electrostatic, chemical and nuclear potential energies all obey the same principle: work against a conservative interaction is stored as recoverable energy.',
        },
      ],
    },
    whatCameBefore:
      'You need force, work, and mass/height intuition. Potential energy is the "stored work" done in lifting against gravity — it pairs with kinetic energy in every system.',
    connections: [
      'Kinetic energy (PE converts into KE)',
      'Conservation of energy (PE is one stored form)',
      'Work (lifting against gravity does work that becomes PE)',
    ],
    applications: [
      'A pendulum swings by continuously converting PE at the top into KE at the bottom and back.',
      'Hydroelectric dams store gravitational potential energy of lifted water and release it as electricity.',
      'A coiled spring or stretched rubber band stores elastic potential energy, whether powering a watch or storing energy in a trampoline.',
    ],
    workedExamples: [
      'A 10 kg crate is lifted 2 m. Its gain in gravitational potential energy = mgh = 10 × 9.8 × 2 = 196 J. If it falls freely, that 196 J becomes kinetic energy — at the bottom KE = ½mv² ⇒ v = √(2gh) = √(2 × 9.8 × 2) ≈ 6.3 m/s. The stored energy is fully "cashed" as speed.',
    ],
    analogies: [
      'Potential energy is like money in a savings account: not in your pocket doing anything, but real and spendable. Lifting gives it to the "Earth-book" account; dropping lets you spend it as motion.',
    ],
    misconceptions: [
      'Potential energy is not stored "in" the object alone — it belongs to the object–Earth (or system) configuration.',
      'Gravitational potential energy depends on the chosen reference height; only differences are physical, and it can be negative relative to that datum.',
      'Only height matters for gravitational PE — mass and g matter equally (PE = mgh).',
    ],
    tryThis:
      'Hold a stretched rubber band to your lips and release it — you will feel the stored elastic energy become motion and warmth. That is potential energy spending itself.',
    funFacts: [
      'A rope ladder does no net work when you climb and then descend it, and yet your legs feel it — your chemical energy, not "lost PE," is what really burns.',
      'The energy in a raised dam and in a stretched bow is the same idea centuries apart.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.conservation-of-energy': {
    conceptId: 'lhs:phys.conservation-of-energy',
    hook:
      'Energy is the great accountant of physics: it is never created, never destroyed, only moved and reshaped. Every engine, every falling apple, every living cell obeys this one quiet ledger — a law so reliable that when physicists once saw it seemingly broken, they did not doubt energy; they went looking for the missing page.',
    history:
      'Conservation of energy was not obvious — it had to be fought for over nearly two centuries. In the 1600s, energy was neither named nor conserved. Émilie du Châtelet argued in 1740 that a quantity combining kinetic and latent (potential) energy stays constant. The modern law crystallised in the 1840s, independently discovered by Julius von Mayer, James Joule and Hermann von Helmholtz. Joule’s careful experiments showed heat is a form of energy with a mechanical equivalent, not a separate "caloric" fluid. Rudolf Clausius then gave the law its modern mathematical form. Wherever the total seemed to fall short, the missing energy was always found — as heat, as work, or (after Einstein) as mass itself via E = mc², completing the account.',
    figures: [
      {
        name: 'Émilie du Châtelet',
        lifespan: '1706–1749',
        role: 'French scientist and translator of Newton',
        contribution:
          'Early defender of energy conservation, connecting kinetic and latent (potential) energy.',
        statement:
          '…the living force of a system is conserved in a constant half life…',
        statementSource: 'Paraphrase of Émilie du Châtelet’s Institutions de Physique (1740)',
      },
      {
        name: 'James Prescott Joule',
        lifespan: '1818–1889',
        role: 'English physicist and brewer',
        contribution:
          'Established the mechanical equivalent of heat by careful experiments, showing energy converts between mechanical and thermal forms in fixed proportion.',
        statement:
          'The mechanical power… is not annihilated, but converted into heat.',
        statementSource: 'Paraphrase of Joule’s "On the Mechanical Equivalent of Heat" (1843)',
      },
      {
        name: 'Rudolf Clausius',
        lifespan: '1822–1888',
        role: 'German physicist',
        contribution:
          'Gave the first law of thermodynamics (conservation of energy) precise mathematical form and clarified heat and internal energy.',
        statement:
          'The energy of the universe is constant.',
        statementSource: 'Rudolf Clausius, on the first law of thermodynamics (1850s) — his classic summation',
      },
    ],
    timeline: [
      {
        period: '1740',
        event: 'Du Châtelet defends conservation of mechanical energy.',
        figure: 'Émilie du Châtelet',
      },
      {
        period: '1842–1847',
        event: 'Mayer, Joule and Helmholtz independently formulate conservation of energy.',
        figure: 'James Joule; Julius von Mayer; Hermann von Helmholtz',
      },
      {
        period: '1843',
        event: 'Joule measures the mechanical equivalent of heat.',
        figure: 'James Joule',
      },
      {
        period: '1850s',
        event: 'Clausius states the first law of thermodynamics: energy is conserved.',
        figure: 'Rudolf Clausius',
      },
      {
        period: '1905',
        event: 'Einstein adds E = mc², folding mass into the energy ledger.',
        figure: 'Albert Einstein',
      },
    ],
    perspectives: [
      {
        figure: 'Émilie du Châtelet (1740)',
        view: 'Kinetic and latent energy convert into each other while the total is conserved.',
        standing: 'Early and influential',
        note: 'Before the word "energy," she grasped its conservation.',
      },
      {
        figure: 'James Joule (1843)',
        view: 'Mechanical energy and heat are interchangeable in fixed proportion.',
        standing: 'Established — the mechanical equivalent of heat',
        note: 'Struck a decisive blow against the separate "caloric" fluid idea.',
      },
      {
        figure: 'Rudolf Clausius (1850s)',
        view: 'Energy of an isolated system is constant; it only changes form.'
        ,
        standing: 'The current consensus (first law of thermodynamics)',
        note: 'Formal, precise, and universally applied.',
      },
    ],
    deepDive: {
      phenomenon: 'Why energy can never be created or destroyed',
      intro:
        'Conservation of energy is the most robust bookkeeping rule in physics. This deep-dive explains what it really claims, why heat is not "lost" energy, and how Einstein extended it to mass.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Energy can change from one form to another — kinetic to potential, chemical to heat — but the total never changes. Rub your hands: your muscles turn chemical energy into motion, and friction turns that motion into heat; none of it vanishes. Energy is "spent" only in the sense that concentrated, useful energy becomes diffuse heat. Perpetual-motion machines, which would make energy from nothing or cancel it, are impossible because of this law.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'For an isolated system, E_total = const. In mechanics, KE + PE = const when only conservative forces act; friction adds a heat term, so ½mv² + mgh + Q = const. The first law of thermodynamics, ΔU = Q − W, is the same bookkeeping for internal energy. Energy is not "used up" — it is converted to less-concentrated forms. This is why a pendulum eventually stops: its mechanical energy is dissipated as air friction and internal heating, and the total energy of the closed system (pendulum + air + Earth) is unchanged.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied scientists',
          body:
            'Energy audits balance inputs, outputs and stored terms: power plants, buildings, engines and motors are analysed with the first law. Efficiency is useful output energy over input energy — never exceed 100% for a machine because that would create energy. Thermal systems track internal energy, heat and work; losses always appear as heat, so engine design fights friction and rejected heat to raise efficiency. In vehicle, turbine and HVAC engineering, conservation of energy is the framework for every energy budget.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Energy conservation is a Noether conserved quantity tied to time-translation symmetry — the homogeneity of time. In the presence of time-dependent potentials it is not strictly conserved, and in general relativity energy conservation is subtle because spacetime need not be time-translation invariant. Einstein’s E = mc² means mass is a form of energy: nuclear reactions convert a little mass into a lot of energy. In thermodynamics, conservation (first law) coexists with the second law, which says entropy (not energy) tends to increase — energy is conserved, but usable energy degrades to heat.',
        },
      ],
    },
    whatCameBefore:
      'You need kinetic and potential energy first. Conservation of energy is simply the statement that the total of all those forms, plus heat, stays constant.',
    connections: [
      'Kinetic and potential energy (the forms that convert)',
      'Work and energy (work transfers energy)',
      'Thermodynamics (first law)',
      'Mass–energy equivalence, E = mc²',
    ],
    applications: [
      'A roller coaster never quite reaches its starting height again because friction turns some mechanical energy into heat — the total is conserved, but some becomes unusable heat.',
      'Power stations run energy conversion chains — chemical → heat → kinetic → electrical — tracking every joule with the conservation law.',
      'Hydrogen fuel cells and batteries rely on converting stored chemical energy into electrical energy without destroying it.',
    ],
    workedExamples: [
      'A 70 kg skier starts from rest at the top of a 50 m hill. At the bottom, KE = PE lost = mgh = 70 × 9.8 × 50 = 34,300 J, so v = √(2g·h) = √(2×9.8×50) ≈ 31.3 m/s (ignoring friction). With friction, the actual speed is lower because some mechanical energy became heat — yet the *total* energy is unchanged.',
    ],
    analogies: [
      'Energy is like a currency that never gets destroyed — it only changes pockets. Banks convert it between savings (potential) and cash (kinetic), and friction is a tax that moves it to the "heat" pocket, but the total fortune is constant.',
    ],
    misconceptions: [
      'Energy is not "used up" — it is converted to less-concentrated forms (mainly heat).',
      'Perpetual-motion machines that create or cancel energy are impossible.',
      'Friction does not create energy — it converts mechanical energy to thermal energy.',
      'Conservation applies to all forms, not just mechanical energy.',
    ],
    tryThis:
      'Bounce a ball and see it rise a little lower each time. It never regains its original height because some energy becomes heat; but wait for it to come to rest — that heat is still around, just spread out and hard to use.',
    funFacts: [
      'Even a battery "dies" in terms of concentration — its chemical energy is conserved, but it becomes unusable heat and dispersed products, so nothing is truly gone.',
      'Einstein’s E = mc² means a single gram of matter, if fully converted, releases ~90 trillion joules — the staggering energy locked inside mass itself.',
    ],
    estimatedTimeMinutes: 16,
  },
};