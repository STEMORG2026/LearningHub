/**
 * Authored narrative content — consumer-owned pedagogy layer.
 *
 * Per CONSTITUTION.md §35, the teaching story (history, "what came before",
 * analogies, worked examples) is owned by STEM-TUITION, not LearningHubSTEM.
 * These narratives wrap the canonical facts from the knowledge base with the
 * progressive story that makes a concept feel alive and connected.
 *
 * Each entry is keyed by the canonical concept id. The narrative layer composes
 * with the canonical fact via `composeNarrativeLesson`.
 */
import type { NarrativeContent } from '@stem-tuition/content-provider';

export const NARRATIVES: Record<string, NarrativeContent> = {
  'lhs:phys.force': {
    conceptId: 'lhs:phys.force',
    hook:
      'Every push you have ever given, every throw, every step you take is a force. But for thousands of years, nobody could say exactly what a force *was* — or how it was connected to motion.',
    history:
      'The ancient Greeks, led by Aristotle, thought force was something an object *needed* to keep moving. Shove a stone and it moves; stop shoving and, they reasoned, it stops. For almost two thousand years this "keep it moving" view felt obvious. Then Galileo and, later, Isaac Newton in his 1687 *Principia* overturned it: a moving object does not need a force to keep going — it needs a force to *change* how it goes. That single shift of viewpoint is why you are taught force as "an influence that changes motion" rather than "a helper that keeps things moving."',
    whatCameBefore:
      'Before you meet force formally, you need to be comfortable with mass (how much "stuff" there is), acceleration (how quickly velocity changes), and vectors (quantities with a direction, because force has both size and direction). You met all three earlier in your physics path.',
    connections: [
      'Newton’s three laws of motion (force is the heart of all three)',
      'Momentum (force is what changes momentum over time)',
      'Weight (a special force due to gravity)',
    ],
    applications: [
      'When a car brakes, the road exerts a force on the tyres that slows you — that is what the brake pedal ultimately controls.',
      'Bridges are engineered by checking that no force acting on them is big enough to make the structure fail.',
      'A rocket exerts a downward force on its exhaust gases, and the gases push the rocket upward — force is how a spacecraft climbs.',
    ],
    workedExamples: [
      'You push a 5 kg box with a net force of 20 N horizontally. Using F = m·a, a = F/m = 20 ÷ 5 = 4 m/s². Every second, the box gets 4 m/s faster. Square numbers, no magic — force, mass, and acceleration are tied together by one simple division.',
    ],
    analogies: [
      'Think of a football sitting still. A force is like a boot kicking it — nothing helps the ball *stay* moving after the kick; forces only change its motion. This is why a rolling ball slows: not because it "runs out of force," but because friction (a force) is pushing against it.',
    ],
    misconceptions: [
      'More force does not always mean more constant speed — a steady force actually gives steady *acceleration*, so speed keeps climbing.',
      'Force is not a property an object "has" on its own; it is always a push or pull between things.',
      'An object at rest is not free of forces — forces can be balanced so the net force is zero.',
    ],
    tryThis:
      'Place a book on a table and press your palm gently against it. Feel the book pushing back exactly as hard as you push in — you are meeting Newton’s third law by hand, before you even get there.',
    funFacts: [
      'Galileo never wrote down "force equals mass times acceleration" — that compact form came later. Newton actually wrote force as the rate of change of momentum.',
      'The newton, the SI unit of force, is about the weight of a small apple in your hand.',
    ],
    estimatedTimeMinutes: 14,
  },

  'lhs:phys.newtons-first-law': {
    conceptId: 'lhs:phys.newtons-first-law',
    hook:
      'A hockey puck glides across ice and keeps sliding long after you stop pushing it. Why does it not simply stop the way Aristotle said it should?',
    history:
      'Aristotle believed things stop because it is their *nature* to stop. Galileo disagreed with a beautiful thought experiment: roll a ball down a ramp, and it rolls further as the ramp at the bottom is made flatter. Make the bottom perfectly flat and frictionless, he argued, and the ball would roll forever. Newton folded this into the first of his laws in the *Principia* (1687): an object keeps its state of rest or steady straight-line motion unless a net external force changes it. The idea is so important it now has its own name — inertia.',
    whatCameBefore:
      'You already understand force — an influence that changes motion. The first law is what happens when forces are *balanced*: nothing changes at all.',
    connections: [
      'Newton’s second law (the first law is really the special case where the net force is zero)',
      'Inertia',
      'Friction (the everyday force that keeps "stopping" things, and the reason the law feels counterintuitive)',
    ],
    applications: [
      'A seatbelt exists because of the first law: when your car stops hard, you keep moving forward — the belt then provides the force to stop *you*.',
      'The classic tablecloth trick works because the dishes are at rest and, for an instant, stay at rest while the cloth slips away.',
      'A spacecraft with its engines off coasts through deep space for years — nothing is there to slow it.',
    ],
    workedExamples: [
      'A train coasts along a straight level track at a steady 80 km/h. According to the first law, no net horizontal force is needed to keep it at 80 km/h — it would do this forever if friction and air resistance (which are forces) were absent. The engine is only needed to *overcome* those opposing forces, not to "maintain" the speed.',
    ],
    analogies: [
      'Balance a spinning top. The first law is that stubbornness to keep going: a body stays as it is until something forces a change. The spinning top only falls when friction provides that something.',
    ],
    misconceptions: [
      'Moving objects do not naturally come to rest — friction is the outside force that stops them.',
      'No motion does not mean no forces; forces can balance so the net force is zero.',
      'A constant force is not needed to keep constant velocity — zero net force keeps velocity constant.',
    ],
    tryThis:
      'Put a coin on an index card resting on a cup. Flick the card sideways quickly. The coin drops straight into the cup — at rest, it wanted to stay at rest. That is the first law live.',
    funFacts: [
      'This law is why your coffee spills when a car starts moving suddenly: the coffee in the cup wants to stay still while the cup jerks forward.',
      'Galileo’s "flat ramp" experiment was purely in his imagination — no real surface was ever perfectly frictionless.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.newtons-second-law': {
    conceptId: 'lhs:phys.newtons-second-law',
    hook:
      'Push a supermarket trolley gently and it drifts; shove it hard and it bolts. What exactly does that extra effort change? Newton’s second law is the single, precise answer: force changes motion, and it changes it in a measurable way.',
    history:
      'Newton stated his second law in the *Principia* (1687), but not as "F = m·a." He wrote that force is the rate of change of momentum. The neat form you learn — F = m·a — assumes the mass does not change, which is usually (but not always) true in everyday physics. That careful original wording matters: it is why the same law also explains rockets, whose mass changes as fuel is ejected.',
    whatCameBefore:
      'You know force from the earlier lesson, and acceleration as the rate of change of velocity. The second law is the bridge between them: it says exactly how much force produces exactly how much acceleration.',
    connections: [
      'Momentum (the general form, F = dp/dt, is the definition of momentum change)',
      'Weight (your weight is literally m·g — mass times free-fall acceleration)',
      'Newton’s first law (a special case: when F = 0, acceleration is zero)',
    ],
    applications: [
      'Car engineers choose engine size by deciding how much acceleration a given mass needs — the law guides the design.',
      'Landing a plane safely is about controlling the forces so the acceleration brings it gently to a stop.',
      'Rockets flaming off the launchpad use F = dp/dt because their mass keeps shrinking as fuel burns.',
    ],
    workedExamples: [
      'A 1,000 kg car produces a net forward force of 4,000 N. Using F = m·a: a = 4,000 ÷ 1,000 = 4 m/s². From rest, after 5 seconds its speed is v = a·t = 4 × 5 = 20 m/s (about 72 km/h). One equation connects the engine, the mass, and how quickly the car moves.',
    ],
    analogies: [
      'Picture a rowing boat: the more effort (force) you apply, the faster it accelerates; the heavier the boat (mass), the slower it responds to the same effort. Force, mass, and acceleration are like three ends of the same lever.',
    ],
    misconceptions: [
      'F = m·a is not a property of the object — F is the *net external* force acting on it from outside.',
    ],
    tryThis:
      'Fill two bottles — one empty, one full — and roll both with the same push. The empty one speeds away and the full one barely moves: same force, different mass, visibly different acceleration.',
    funFacts: [
      'This law explains why a cricket ball can be hit so fast with a relatively short swing — acceleration depends on both force and the small time over which it acts.',
      'The "m" in F = m·a is inertial mass, and every test so far says it equals gravitational mass to astonishing precision.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.newtons-third-law': {
    conceptId: 'lhs:phys.newtons-third-law',
    hook:
      'You can only jump by pushing the ground down, and swim only by pushing water backward. Newton’s third law is the reason every action in the universe comes paired with an opposite reaction.',
    history:
      'The third law appears in the *Principia* (1687) as: to every action there is always opposed an equal reaction. Newton used it to explain recoil and even designed a thought-experiment "cannon" on a cart to illustrate how forces always come in pairs. It is the least intuitive of the three laws, because we rarely notice that the ground is pushing back.',
    whatCameBefore:
      'You have learned that forces always act *between* things. The third law tells you those two-sided interactions have a strict symmetry: if A pushes B, B pushes A equally and oppositely — at the very same instant.',
    connections: [
      'Force (the concept this law completes)',
      'Momentum (force pairs are the mechanism by which momentum is transferred between bodies)',
      'Rocket propulsion (a real-world icon of the third law)',
    ],
    applications: [
      'Rockets: exhaust gases are shoved backward, and the gases shove the rocket forward — no air needed.',
      'Walking: your foot pushes the ground backward; the ground pushes you forward.',
      'Swimming: you push water backward; the water pushes you ahead.',
      'A gun recoils backward because the bullet is pushed forward.',
    ],
    workedExamples: [
      'You stand on ice and push a friend (mass 60 kg) away with a force of 30 N. By F = m·a, your friend accelerates at 30 ÷ 60 = 0.5 m/s². But you feel the *same* 30 N pushing back on you, so you accelerate at 30 ÷ your mass — if your mass is 60 kg, you too slide backward at 0.5 m/s². Equal force, opposite direction, both of you. That is the third law, and it is exactly why pushing something away on ice pushes you back as well.',
    ],
    analogies: [
      'A tug-of-war between two people pulling equally hard: neither wins because the forces on the rope are equal and opposite. But notice — those two forces are not "cancelling each other" on the same person; each person feels only the pull from the other.',
    ],
    misconceptions: [
      'Action–reaction forces do not cancel because they act on *different* objects — each feels only one side of the pair.',
      'The "stronger" object does not win the force battle; the pair is always exactly equal.',
      'The two forces are simultaneous — no delay between action and reaction.',
    ],
    tryThis:
      'Sit on a wheeled chair and push firmly against a wall. The chair rolls away from the wall — you pushed the wall backward, and the wall pushed you forward. You just felt the third law in your own back.',
    funFacts: [
      'A rocket works *better* in the vacuum of space because there is no air to slow it — the third law needs nothing to push against except its own exhaust.',
      'When you step off a boat onto a dock, the boat moves backward because of this law — sooner or later everyone learns it the wet way.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.work': {
    conceptId: 'lhs:phys.work',
    hook:
      'Carry a heavy suitcase across a flat platform floor and you will feel exhausted — yet physics insists you have done *no work* on it. That surprising statement is the key to a powerful tool: work is how energy moves.',
    history:
      'The word "work" crept into physics in the 1820s through French engineer Gaspard-Gustave de Coriolis, who used it to describe force acting over a distance. The idea matured as engineers studied machines: what makes a machine useful is how much *work* it can do, force times the distance moved in the direction of that force. The suitcase puzzle comes straight from that definition: force and the direction of motion matter together.',
    whatCameBefore:
      'You meet work right after force and motion because it needs both: a force (F) acting through a distance (d). Work is where mechanics starts paying you back the effort of learning force and distance.',
    connections: [
      'Energy (work is the *transfer* of energy) — the two concepts are inseparable',
      'Power (power is how fast work is done)',
      'The angle cosine in W = F·d·cos(θ) (why only the force in the direction of motion counts)',
    ],
    applications: [
      'Lifting a box against gravity does positive work; life is full of it.',
      'Friction does negative work — it is why pushed objects slow and why brakes heat up.',
      'Your electricity bill is measured in kilowatt-hours — which is really a unit of work/energy.',
    ],
    workedExamples: [
      'You push a 10 kg box 5 m across the floor with a horizontal force of 40 N. Work = force × distance = 40 × 5 = 200 J. Now push it the same distance but at a 60° angle to the floor: only the horizontal part counts, so W = 40 × cos(60°) × 5 = 40 × 0.5 × 5 = 100 J. Same push, half the useful work — because half the effort was "wasted" vertically.',
    ],
    analogies: [
      'Work is like paying for fuel: energy is the fuel in the tank, work is the motion you buy with it. You spend energy to get work done, and the "price" is force multiplied by how far (in the force’s direction) you move.',
    ],
    misconceptions: [
      'Holding a suitcase still does no work, however tired your arm — no displacement in the direction of the force means zero work.',
      'Work is not energy itself; it is the process by which energy is transferred.',
      'More force does not always mean more work — the distance and the angle matter too.',
    ],
    tryThis:
      'Hold a book at arm’s length for a minute, then lower it slowly. Physics says holding did no work but lowering did (gravity pulled it through a distance). Feel the difference — that is the definition speaking.',
    funFacts: [
      'The joule, the unit of work, is tiny: lifting a single apple one metre is roughly one joule. That is why kilojoules appear on food labels.',
      'Coriolis, who named "work," is better known for the Coriolis force that affects weather systems.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.energy': {
    conceptId: 'lhs:phys.energy',
    hook:
      'A falling rock, a burning log, a moving car, the battery in your phone — physics bundles wildly different things under one word: energy. The idea is so powerful that a whole conservation law rides on it.',
    history:
      'The modern idea of energy took centuries to pin down. The physician Thomas Young introduced the word "energy" in the early 1800s, building on earlier ideas of "vis viva" (living force) from Leibniz. The breakthrough was the *conservation of energy*: James Prescott Joule showed heat, mechanical motion, and electrical work are interchangeable currencies, and Mayer and Helmholtz drew the same conclusion. Energy is not a substance and it is not "used up" — it simply changes form. That one insight unified mechanics, heat, and electricity.',
    whatCameBefore:
      'Energy builds directly on work — work is how energy moves from one object or form to another. You have already met force and motion, so you have all the tools to see energy as the stored capacity that work transfers.',
    connections: [
      'Work (its twin — energy is the quantity, work is the transfer)',
      'Kinetic energy (energy of motion)',
      'Potential energy (stored energy)',
      'Conservation of energy (the law that nothing is created or destroyed)',
    ],
    applications: [
      'Power stations convert one form of energy (chemical, nuclear, kinetic of flowing water) into electricity.',
      'Your food stores chemical energy your cells turn into motion and heat.',
      'A car converts chemical energy → heat → kinetic energy to move you.',
      'Solar and wind systems tap energy arriving from the Sun.',
    ],
    workedExamples: [
      'A 2 kg stone raised 5 m up has gravitational potential energy E = m·g·h = 2 × 10 × 5 = 100 J. Drop it, and just before impact that potential energy has become kinetic energy (all 100 J, friction ignored). Nothing vanished — it only changed form. That trade-off is the conservation law in miniature.',
    ],
    analogies: [
      'Think of energy as money. You do not destroy money by spending it — it moves from your pocket to the shop. Energy does the same: it is never created or destroyed, only moved and converted.',
    ],
    misconceptions: [
      'Energy is not a material or substance you "have" — it is a property of a system.',
      'Energy is never used up; it only changes form.',
      'Only moving objects do not have energy — stored (potential) energy exists without motion.',
      'Energy is not the same as heat or temperature; heat is a transfer, temperature measures motion of particles.',
    ],
    tryThis:
      'Bounce a ball and watch: at its highest point it has maximum potential and zero kinetic; at the bottom it is the reverse. You are watching energy trade places with itself, dozens of times in a minute.',
    funFacts: [
      'A single gram of matter, if fully converted, holds an unfathomable 90 trillion joules — E = mc² in real numbers.',
      'The Sun converts 4 million tonnes of mass into energy every second — that is the light you see.',
    ],
    estimatedTimeMinutes: 14,
  },
};