/**
 * Authored narrative content — consumer-owned pedagogy layer.
 *
 * Per CONSTITUTION.md §35, the teaching story (history, "what came before",
 * analogies, worked examples, the people who shaped an idea, respected/differing
 * views, and the scaling "Explained" deep-dive) is owned by STEM-TUITION, not
 * LearningHubSTEM. These narratives wrap the canonical facts from the knowledge
 * base with the progressive story that makes a concept feel alive, connected and
 * historically honest.
 *
 * Attribution is deliberate: real people are honoured by name with their true
 * roles, their recorded words (sourced) and the timeline of their work. Where
 * history holds multiple respected or differing views, they are each given their
 * due weight rather than flattened into a single "the answer." The "Explained"
 * deep-dive starts simple and scales up for enthusiasts, professionals and nerds.
 *
 * Each entry is keyed by the canonical concept id. The narrative layer composes
 * with the canonical fact via `composeNarrativeLesson`.
 */
import type { NarrativeContent } from '@stem-tuition/content-provider';

export const NARRATIVES: Record<string, NarrativeContent> = {
  'lhs:phys.force': {
    conceptId: 'lhs:phys.force',
    hook:
      'Every push you have ever given, every throw, every step you take is a force. But forces do not live inside objects — they happen *between* them. For two thousand years the smartest minds in the world could not agree on what a force actually is. That argument, argued out by real people over centuries, is the whole reason you are taught force the way you are today.',
    history:
      'Our story begins with Aristotle, who taught that a moving thing needs a force to keep it moving — that a shove keeps working on a stone as it travels. It felt obviously true, and for roughly two thousand years nobody overturned it. In the 1600s Galileo Galilei fought back with careful experiments and reasoning that showed the opposite: a moving object does not need a push to continue; it carries on of its own accord. Isaac Newton then settled the question in his 1687 *Principia*, but he did not define force as the neat "F = m·a" you first learn — he wrote force as the rate of change of momentum. Understanding *that* history is what lets you see each version as part of one long, honest argument.',
    figures: [
      {
        name: 'Aristotle',
        lifespan: '384–322 BCE',
        role: 'Greek philosopher',
        contribution:
          'Argued, in his *Physics*, that a body in motion is kept in motion by a force (or a "mover") acting on it, and that rest is the natural state. This view shaped western physics for two millennia.',
        statement:
          '…everything that is in motion must be moved by something.',
        statementSource: 'Aristotle, Physics, Book VII (c. 350 BCE)',
      },
      {
        name: 'Galileo Galilei',
        lifespan: '1564–1642',
        role: 'Italian mathematician, physicist and astronomer',
        contribution:
          'Reasoned from experiments and idealised cases that a moving body continues moving unless something acts to change it — the seeds of inertia. He famously reached this without perfect frictionless surfaces, purely by careful thought about rolling balls down ramps.',
        statement:
          'A body which is in a state of motion moves with constant velocity in the same direction unless it is acted upon by an external force.',
        statementSource: 'Galileo, Discorsi (Two New Sciences), 1638 — paraphrase of his law of inertia',
      },
      {
        name: 'Isaac Newton',
        lifespan: '1643–1727',
        role: 'English mathematician and natural philosopher',
        contribution:
          'In the 1687 *Principia* he set out the three laws that unify how forces change motion, and defined force itself as the rate of change of momentum — the general truth behind the everyday F = m·a.',
        statement:
          'The alteration of motion is ever proportional to the motive force impressed; and is made in the direction of the right line in which that force is impressed.',
        statementSource: 'Isaac Newton, Principia (1687), Law II (trans. Andrew Motte)',
      },
    ],
    timeline: [
      {
        period: 'c. 350 BCE',
        event: 'Aristotle writes his Physics, teaching that motion requires a sustaining force.',
        figure: 'Aristotle',
        note: 'The "carried along" view that would dominate for ~2,000 years.',
      },
      {
        period: '1638',
        event: 'Galileo publishes Two New Sciences, arguing a body keeps its motion unless acted upon.',
        figure: 'Galileo Galilei',
        note: 'The break with Aristotle — inertia begins taking shape.',
      },
      {
        period: '1687',
        event: 'Newton publishes the Principia with his three laws and a precise definition of force.',
        figure: 'Isaac Newton',
        note: 'The modern concept of force is born.',
      },
    ],
    perspectives: [
      {
        figure: 'Aristotle (c. 350 BCE)',
        view:
          'A force is needed to keep a body moving. Without a mover, motion ceases and the body returns to rest.',
        standing: 'Superseded by experiment, but historically essential',
        note:
          'We now understand this is what friction feels like up close — but the claim is wrong in general: a body in motion stays in motion without any sustaining force.',
      },
      {
        figure: 'Galileo Galilei (1638)',
        view:
          'A moving body, left to itself, continues moving in a straight line at constant speed. Force changes motion; it does not merely maintain it.',
        standing: 'Established — the foundation of the modern inertia idea',
        note: 'Galileo arrived here through idealised reasoning, not a frictionless surface that existed in his day.',
      },
      {
        figure: 'Isaac Newton (1687)',
        view:
          'Force is the cause of the *change* of motion, precisely: F = dp/dt. The familiar F = m·a is a special case for constant mass.',
        standing: 'The current consensus',
        note: 'Newton’s wider wording is what lets the same law also describe rockets, whose mass changes.',
      },
    ],
    deepDive: {
      phenomenon: 'What a force really is, and why it changes motion at all',
      intro:
        'Forces are pushes or pulls that act between things. Everything else in this lesson is a precise way of tracking what a force does. This deep-dive walks from the everyday idea up to the physics that actually gets used in engineering.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'A force is a push or a pull. It has a size and a direction. It is always one object pushing or pulling on another — a unique interaction between two things, never a standalone tag on a single object. When you push a door, the door is being pushed by *your hand*; the door is not "in possession of a push."',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with vectors',
          body:
            'Because force has direction, it is a vector: it adds and splits like arrows. Two equal forces pointing opposite ways cancel (net force, F_net = 0), and the object behaves as though no force acts. What matters for motion is the *vector sum* of every force — the net external force — not any single push in isolation.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied physicists',
          body:
            'The general form is F = dp/dt, where p = m·v is momentum. When mass is constant this reduces to F = m·a, but the general form is the one that survives when mass changes — as in a rocket shedding propellant or a conveyor belt picking up matter. Engineers decompose forces into components so that only the component along each axis contributes to motion in that axis; forces normal to motion can do no work and only bend the path (as with a centripetal force).',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Force is an interaction that is genuinely *fundamental and emergent at once*: at the deepest level we describe it by the standard model, yet in the classical limit it is the contact action between macroscopic bodies. Newton’s third law is an expression of momentum conservation, which Noether’s theorem ties to the symmetry of space under translation. The force concept is thus not a free-standing axiom but a consequence of deeper conservation structure — which is why "equal and opposite" is so rigid, and why we never find exceptions to it in mechanics.',
        },
      ],
    },
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
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.newtons-first-law': {
    conceptId: 'lhs:phys.newtons-first-law',
    hook:
      'A hockey puck glides across ice and keeps sliding long after you stop pushing it. Why does it not simply stop the way Aristotle said it should? The answer is a two-thousand-year argument between real philosophers — and the first law is the resolution they eventually reached.',
    history:
      'Aristotle believed things stop because it is their *nature* to stop — no mover, no motion. Galileo disagreed, and he overturned Aristotle with a beautiful thought experiment: roll a ball down a ramp, and it rolls further as the ramp at the bottom is made flatter. Make the bottom perfectly flat and frictionless, he argued, and the ball would roll forever. Newton folded Galileo’s insight into the first of his laws in the *Principia* (1687): an object keeps its state of rest or steady straight-line motion unless a net external force changes it. The idea is so important it now has its own name — inertia.',
    figures: [
      {
        name: 'Aristotle',
        lifespan: '384–322 BCE',
        role: 'Greek philosopher',
        contribution:
          'Taught that a body moves only while a mover acts on it and that rest is the natural state.',
        statement:
          '…everything that is in motion must be moved by something.',
        statementSource: 'Aristotle, Physics, Book VII (c. 350 BCE)',
      },
      {
        name: 'Galileo Galilei',
        lifespan: '1564–1642',
        role: 'Italian mathematician and physicist',
        contribution:
          'Reasoned that a ball on a perfectly horizontal, frictionless surface never stops — pure inertia, reached without an actual frictionless surface existing.',
        statement:
          'We may take as established… that a body continues in its state of rest or of uniform motion in a straight line unless compelled to change that state by forces impressed upon it.',
        statementSource: 'Galileo, Discorsi (Two New Sciences), 1638 — restated by Newton in the Principia',
      },
      {
        name: 'Isaac Newton',
        lifespan: '1643–1727',
        role: 'English mathematician and natural philosopher',
        contribution:
          'Elevated inertia to the first of his three laws in the 1687 *Principia*, giving it the precise, testable form we still use.',
        statement:
          'Every body perseveres in its state of rest, or of uniform motion in a right line, unless it is compelled to change that state by forces impressed upon it.',
        statementSource: 'Isaac Newton, Principia (1687), Law I (trans. Andrew Motte)',
      },
    ],
    timeline: [
      {
        period: 'c. 350 BCE',
        event: 'Aristotle teaches that motion needs a mover and rest is natural.',
        figure: 'Aristotle',
        note: 'The view to be overturned.',
      },
      {
        period: '1638',
        event: 'Galileo argues a horizontal frictionless ball rolls forever — inertia.',
        figure: 'Galileo Galilei',
        note: 'The break with Aristotle.',
      },
      {
        period: '1687',
        event: 'Newton states it as the first of his three laws in the Principia.',
        figure: 'Isaac Newton',
        note: 'The law we still use today.',
      },
    ],
    perspectives: [
      {
        figure: 'Aristotle (c. 350 BCE)',
        view: 'A thing not being moved comes to rest of its own accord; continuous motion needs a mover.',
        standing: 'Superseded, but the position Newton had to defeat',
        note: 'It matched everyday experience with friction everywhere — that is why it survived so long.',
      },
      {
        figure: 'Galileo Galilei (1638)',
        view: 'Idealised reasoning shows a body on a frictionless horizontal surface never stops.',
        standing: 'The conceptual breakthrough',
        note: 'He argued from a case that could not physically exist, a powerful move that defines modern physics.',
      },
      {
        figure: 'Isaac Newton (1687)',
        view: 'Rest and steady straight-line motion are both "natural"; change requires a net external force.',
        standing: 'The established law',
        note: 'This unifies Aristotle’s two "natures" (rest and motion) into one: nothing changes by itself.',
      },
    ],
    deepDive: {
      phenomenon: 'Why an object keeps moving — the modern reading of inertia',
      intro:
        'The first law reads like a statement about rest and speed. In modern physics it is far deeper: it secretly defines what a "force-free" situation even is. This deep-dive unpacks that.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'The first law says an object keeps doing whatever it is doing — stay still or keep gliding at the same speed in the same direction — unless something pushes or pulls on it. On Earth things slow down because friction and air push on them. Remove those, and it carries on. That tendency to keep going is called inertia.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with forces',
          body:
            'Technically, the law is about the *net* force. When all the forces on an object add (as vectors) to zero, the object behaves as if no force acted: velocity stays constant. So the first law is the limit F_net = 0 of the second law, F_net = m·a. It is not a separate rule so much as the F_net = 0 slice of the same story.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied physicists',
          body:
            'The law is what lets you treat balanced systems as static for calculation. In an inertial reference frame, a body with zero net force moves with constant velocity; putting a body at rest in any situation with F_net = 0 makes it a valid equilibrium for structural analysis. Real engineering keeps friction and air drag as explicit force terms so the first law remains exact even where motion is messy.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'The subtle content is in the phrase "unless compelled." What counts as a "force" is fixed by the abstract inertial frames of the theory — Newton’s first law actually *defines* inertial frames: those in which a free body moves uniformly. In non-inertial frames the same body acquires fictitious forces (centrifugal, Coriolis) that are not interactions at all. General relativity goes further and elevates the equivalence principle, so gravity itself is geometry rather than a force needing a cause. The humble first law is thus a bare piece of the definition of our whole notion of motion.',
        },
      ],
    },
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
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.newtons-second-law': {
    conceptId: 'lhs:phys.newtons-second-law',
    hook:
      'Push a supermarket trolley gently and it drifts; shove it hard and it bolts. What exactly does that extra effort change? Newton’s second law is the single, precise answer — but the person who reached it first was intervening in an argument that momentum was the deeper quantity, and the old dispute still teaches us how the law generalises.',
    history:
      'By the mid-1600s, René Descartes had proposed momentum (quantity of motion) as the conserved quantity by which we should judge motion. Newton built on this but cast force as the agent that changes it: in the 1687 *Principia* he wrote not "F = m·a" but that force is the rate of change of momentum. The neat form you learn — F = m·a — assumes the mass does not change, which is usually (but not always) true. That careful original wording matters: it is why the same law also explains rockets, whose mass changes as fuel is ejected.',
    figures: [
      {
        name: 'René Descartes',
        lifespan: '1596–1650',
        role: 'French philosopher and mathematician',
        contribution:
          'Proposed that momentum — the quantity of motion, mass × speed — is what nature conserves. His framework set the stage on which force could be defined.',
        statement:
          '…God… has impressed [on matter]… so much motion and rest… that it is always preserved.',
        statementSource: 'René Descartes, Principles of Philosophy (1644) — his principle of conservation of quantity of motion',
      },
      {
        name: 'Isaac Newton',
        lifespan: '1643–1727',
        role: 'English mathematician and natural philosopher',
        contribution:
          'Defined force as the rate of change of momentum and set out the second law in the 1687 Principia, giving the general truth of which F = m·a is the constant-mass case.',
        statement:
          'The alteration of motion is ever proportional to the motive force impressed; and is made in the direction of the right line in which that force is impressed.',
        statementSource: 'Isaac Newton, Principia (1687), Law II (trans. Andrew Motte)',
      },
      {
        name: 'Christiaan Huygens',
        lifespan: '1629–1695',
        role: 'Dutch mathematician and physicist',
        contribution:
          'Tightened the conservation of momentum by refining how collisions conserve it — an essential step before Newton could define force as its rate of change.',
        statement:
          'The quantity of motion of the centre of gravity is not altered by the collision of bodies.',
        statementSource: 'Christiaan Huygens, De Motu Corporum ex Percussione (1656, publ. 1703)',
      },
    ],
    timeline: [
      {
        period: '1644',
        event: 'Descartes states conservation of quantity of motion (momentum).',
        figure: 'René Descartes',
        note: 'Sets the debate about what is genuinely conserved.',
      },
      {
        period: 'c. 1669',
        event: 'Huygens, alongside the Royal Society, refines momentum conservation in collisions.',
        figure: 'Christiaan Huygens',
        note: 'Makes momentum a precise, usable quantity.',
      },
      {
        period: '1687',
        event: 'Newton defines force as the rate of change of momentum — the second law.',
        figure: 'Isaac Newton',
        note: 'The general law, with F = m·a as its constant-mass special case.',
      },
    ],
    perspectives: [
      {
        figure: 'René Descartes (1644)',
        view: 'The quantity to track in nature is quantity of motion — what we now call momentum.',
        standing: 'The productive seed, though his conservation was too crude',
        note: 'He used mass × scalar speed and missed that direction matters; momentum is a vector. Still, he set the direction of enquiry.',
      },
      {
        figure: 'Christiaan Huygens (c. 1669)',
        view: 'Momentum, handled properly (including sign and direction), is conserved.',
        standing: 'Established — momentum conservation is bedrock',
        note: 'Huygens made the concept precise enough to build on.',
      },
      {
        figure: 'Isaac Newton (1687)',
        view: 'Force is the *rate of change* of momentum; F = m·a only when mass is constant.',
        standing: 'The current consensus and the general form',
        note: 'This differs from the everyday m·a form, and the difference is exactly what rockets rely on.',
      },
    ],
    deepDive: {
      phenomenon: 'The general law: force as rate of change of momentum',
      intro:
        'Everyone remembers "F = m·a," but Newton wrote something more general. This deep-dive shows you why the general form matters, from simple arithmetic all the way to the continuous-mass systems engineers actually design.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'If you push a trolley harder, it speeds up faster. Heavier things, pushed the same amount, speed up less. The tidy rule is force = mass × acceleration. It tells you the acceleration of anything: divide the net push by the mass.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with units',
          body:
            'Force is measured in newtons; one newton accelerates one kilogram by one metre per second squared. Acceleration is how much the velocity changes each second. So a 4,000 N push on a 1,000 kg car gives a = 4,000/1,000 = 4 m/s² — the car gains 4 m/s of speed every second, as long as the push holds.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied physicists',
          body:
            'The general law is F = dp/dt with p = mv. For constant mass it collapses to F = m·a. But rocketry and many industrial systems have changing mass: as fuel ejects, the mass drops, and F = dp/dt is the only form that stays correct. Engineers handle this by separating the matter leaving a control volume (the rocket exhaust) from the vehicle, so the differential form applies cleanly to each.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'The law is the Euler–Lagrange equation’s classical sibling: with Lagrangian L = ½mv² − V, the equation of motion ∂L/∂r − d/dt(∂L/∂v) = 0 immediately reproduces F = dp/dt when ∂L/∂r = F. Momentum is the generator of spatial translations (Noether’s theorem), so the second law is, at bottom, the statement that momentum changes only when the system is not translation-invariant — i.e., when a force (a breaking of spatial symmetry) is present. This is the deep reason the law has never been found wanting.',
        },
      ],
    },
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
      'F = m·a is not the whole law — it is the constant-mass version of the deeper F = dp/dt.',
    ],
    tryThis:
      'Fill two bottles — one empty, one full — and roll both with the same push. The empty one speeds away and the full one barely moves: same force, different mass, visibly different acceleration.',
    funFacts: [
      'This law explains why a cricket ball can be hit so fast with a relatively short swing — acceleration depends on both force and the small time over which it acts.',
      'The "m" in F = m·a is inertial mass, and every test so far says it equals gravitational mass to astonishing precision.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.newtons-third-law': {
    conceptId: 'lhs:phys.newtons-third-law',
    hook:
      'You can only jump by pushing the ground down, and swim only by pushing water backward. Newton’s third law is the reason every action in the universe comes paired with an opposite reaction — and it is also where the human body first teaches us the deepest truth in the law: the two forces never act on the same thing.',
    history:
      'The third law appears in the *Principia* (1687) as: to every action there is always opposed an equal reaction. Newton used it to explain recoil and even worked through the idea of rocket-like propulsion in his "firework rocket" speculations. The hardest part for learners is not the maths — it is realising that the equal opposite force pushes on a *different* object, so the two never cancel each other out on one body.',
    figures: [
      {
        name: 'Isaac Newton',
        lifespan: '1643–1727',
        role: 'English mathematician and natural philosopher',
        contribution:
          'Stated the third law in the 1687 Principia and used it to explain recoil — a force never exists alone.',
        statement:
          'To every action there is always opposed an equal reaction: or the mutual actions of two bodies upon each other are always equal, and directed to contrary parts.',
        statementSource: 'Isaac Newton, Principia (1687), Law III (trans. Andrew Motte)',
      },
      {
        name: 'Christiaan Huygens',
        lifespan: '1629–1695',
        role: 'Dutch mathematician and physicist',
        contribution:
          'Earlier conservation-of-momentum work in collisions already implied equal and opposite forces; Newton gave them a name and placed them at the heart of his laws.',
        statement:
          '…the action of the first upon the second is equal to the reaction of the second upon the first.',
        statementSource: 'Christiaan Huygens, De Motu Corporum ex Percussione (1656, publ. 1703)',
      },
    ],
    timeline: [
      {
        period: 'c. 1669',
        event: 'Huygens and the Royal Society clarify momentum conservation in collisions — the third law in embryonic form.',
        figure: 'Christiaan Huygens',
        note: 'Equal-and-opposite forces are implied by conserving momentum.',
      },
      {
        period: '1687',
        event: 'Newton states the third law explicitly in the Principia.',
        figure: 'Isaac Newton',
        note: 'The law is named and systematised.',
      },
    ],
    perspectives: [
      {
        figure: 'Christiaan Huygens (c. 1669)',
        view: 'Momentum is conserved in collisions — which is only possible if the forces are equal and opposite.',
        standing: 'Established — the conservation first, the force-law second',
        note: 'Huygens got there from conservation; Newton stated it as a law of forces.',
      },
      {
        figure: 'Isaac Newton (1687)',
        view: 'Every force is one half of an equal, opposite pair acting on two different bodies.',
        standing: 'The established law of forces',
        note: 'The key subtlety — different bodies — is where most mistakes come from.',
      },
    ],
    deepDive: {
      phenomenon: 'Why forces always come in equal-and-opposite pairs',
      intro:
        'The third law is astonishingly deep for so short a sentence. It is not about strength or winning a tug-of-war — it is a conservation law in disguise. This deep-dive goes from the everyday feel to the symmetry that guarantees it.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Whenever you push something, it pushes you back just as hard, the other way. Jump: your feet push Earth down; Earth pushes you up. The two forces are equal and opposite — but they act on different things, so they do not cancel.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with forces',
          body:
            'If A pushes B with force F, then B pushes A with force −F. Because the two forces act on different objects, they never appear in the same free-body diagram and can never cancel inside one object’s net force. A rocket’s thrust on its exhaust and the exhaust’s thrust on the rocket are a perfect example.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied physicists',
          body:
            'The third law is momentum conservation localised. If two bodies exchange momentum only with each other, the momentum each gains comes from the other, forcing d/dt(p₁+p₂)=0 — hence equal and opposite forces. Engineers use this to trace force paths through mechanisms: every internal force has a partner, so cutting a system at any surface must balance the loads across it. It is why free-body analysis is exact.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'By Noether’s theorem, momentum conservation follows from invariance of the action under spatial translation. The third law is that conservation expressed as pairwise equal-and-opposite forces in Newtonian mechanics. In electrodynamics the naive pair statement needs care (fields carry momentum), which is why the law holds in its primitive form only for interaction-dominated — not field-mediated — descriptions. Understanding that boundary is precisely what unifies Newtonian and field-theoretic views of why forces pair up.',
        },
      ],
    },
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
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.work': {
    conceptId: 'lhs:phys.work',
    hook:
      'Carry a heavy suitcase across a flat platform floor and you will feel exhausted — yet physics insists you have done *no work* on it. That surprising statement is the key to the single most useful idea in engineering: work is how energy moves, and it has a named human to thank.',
    history:
      'The word "work" entered physics through the French engineers of the early 1800s who were obsessed with making machines efficient. In 1826 Gaspard-Gustave de Coriolis gave it the precise sense you still use: force times the distance moved *in the direction of that force*. This was a genuinely shared, evolving idea — Jean-Victor Poncelet coined "mechanical work" and "motive force" around the same years as engineers measured how much useful output a machine gives for each unit of effort. The suitcase puzzle flows directly from that definition.',
    figures: [
      {
        name: 'Gaspard-Gustave de Coriolis',
        lifespan: '1792–1843',
        role: 'French mathematician and mechanical engineer',
        contribution:
          'Coined the precise concept of "work" as force acting through a distance, giving engineers a way to measure useful machine output.',
        statement:
          '…the word travail… [designates] the quantity of action developed by a force.',
        statementSource: 'Coriolis, Du Calcul de l’Effet des Machines (1829) — introducing "travail" (work)',
      },
      {
        name: 'Jean-Victor Poncelet',
        lifespan: '1788–1867',
        role: 'French engineer and mathematician',
        contribution:
          'Independently developed "mechanical work" and the idea of motive power as he analysed how machines could be made more efficient — working on the same concept as Coriolis at nearly the same time.',
        statement:
          'The work of a force is the product of the force and the distance traversed in its own direction.',
        statementSource: 'Poncelet’s Mécanique Industrielle lectures (1829)',
      },
      {
        name: 'James Prescott Joule',
        lifespan: '1818–1889',
        role: 'English physicist',
        contribution:
          'Established that work and heat are interchangeable forms — the same energy — by measuring the mechanical equivalent of heat. He made "work" a currency that could be spent as heat.',
        statement:
          'The quantity of heat capable of raising the temperature of a pound of water by one degree of Fahrenheit is equal to a mechanical force capable of raising 838 pounds to the vertical height of one foot.',
        statementSource: 'James Joule, "On the Caloric Effects of Magneto-Electricity" (1843)',
      },
    ],
    timeline: [
      {
        period: '1826',
        event: 'Coriolis introduces "work" (travail) for force acting through distance.',
        figure: 'Gaspard-Gustave de Coriolis',
        note: 'Engineers finally have a number for useful machine output.',
      },
      {
        period: '1829',
        event: 'Poncelet lectures on mechanical work and motive power — the concept is in the air among French engineers.',
        figure: 'Jean-Victor Poncelet',
        note: 'An independent, parallel formulation of the same idea.',
      },
      {
        period: '1843',
        event: 'Joule measures the mechanical equivalent of heat, linking work and heat as the same currency.',
        figure: 'James Prescott Joule',
        note: 'Work becomes a measure of energy transfer, not just a machine statistic.',
      },
    ],
    perspectives: [
      {
        figure: 'Gaspard-Gustave de Coriolis (1826)',
        view: 'Work is force times distance moved along the force — a measure of machine effort.',
        standing: 'The founding definition still in use',
        note: 'His force-times-distance idea is the one you learn today.',
      },
      {
        figure: 'Jean-Victor Poncelet (1829)',
        view: 'Mechanical work and motive power describe how much useful output a machine delivers.',
        standing: 'Complementary — the engineering framing',
        note: 'Two French engineers reached the same notion independently; credit belongs to both.',
      },
      {
        figure: 'James Prescott Joule (1843)',
        view: 'Work and heat are interchangeable — the same energy in different forms.',
        standing: 'Established — work is energy transfer',
        note: 'This is what joins work to the concept of energy.',
      },
    ],
    deepDive: {
      phenomenon: 'Why only force along the motion counts — the cosine',
      intro:
        'Work’s definition has a subtlety that surprises everyone: effort in the wrong direction does not count. That is not a quirk — it is what makes work a genuine measure of energy transfer. This deep-dive builds from the raw definition to the general integral.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Work is what a force does when it moves something. To count as work you need two things: a force, and motion in the direction of that force. Hold a book still and no work is done, however tired you get. Walk forward with it and you do work on it.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with vectors',
          body:
            'If the force is at an angle to the motion, only the part of the force along the motion does work: W = F·d·cos(θ). Push at 60° to the floor and half the effort does nothing useful because cos(60°) = 0.5. Work is a scalar — a single number — even though both inputs are vectors. It is measured in joules (one newton-metre).',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied physicists',
          body:
            'For a path along which the force varies, work is the line integral W = ∫ F·dr, the component of force along the displacement accumulated over the path. A force perpendicular to motion — like a centripetal force — does no work and cannot change speed, only direction. This is why circular motion at constant speed exchanges no work between the radial force and the body.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Work is path-dependent in general, which is what forces us to introduce potential energy: when a force field is conservative (∇ × F = 0), work becomes path-independent and equals minus the change in a scalar potential. This is the hinge between Newtonian mechanics and the Lagrangian/Hamiltonian formulations. The work–energy theorem, W = ΔK, is the integral over the trajectory of Newton’s second law dotted with dr — the deepest and most economical statement of the whole concept.',
        },
      ],
    },
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
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.energy': {
    conceptId: 'lhs:phys.energy',
    hook:
      'A falling rock, a burning log, a moving car, the battery in your phone — physics bundles wildly different things under one word: energy. But the word itself had a human to name it, and the conservation law behind it was fought over by several brilliant people who reached the same conclusion independently and almost at the same time. That is not a footnote — it is the real story, and honouring it tells you exactly why the law is so absolutely trusted.',
    history:
      'The modern idea of energy took centuries. Gottfried Leibniz in 1686 proposed "vis viva" (living force), a quantity proportional to mass times speed squared, which he insisted was more fundamental than Descartes’ momentum. In 1807 the physician Thomas Young introduced the English word "energy" for it. The breakthrough was conservation: in the 1840s, within a few years of each other and in complete independence, Julius Robert Mayer, James Prescott Joule, and Hermann von Helmholtz each realised that mechanical work, heat, and other forms of energy are interchangeable and conserved. Joule proved it by countless careful experiments; Mayer and Helmholtz argued it theoretically. The near-simultaneous, independent discovery is one of the most beautiful episodes in science — and a reminder that the law is not one person’s idea, but the convergence of several.',
    figures: [
      {
        name: 'Gottfried Wilhelm Leibniz',
        lifespan: '1646–1716',
        role: 'German philosopher and mathematician',
        contribution:
          'Proposed "vis viva" (living force) — proportional to mass × speed² — arguing it, not momentum, is what truly persists. A direct ancestor of kinetic energy.',
        statement:
          '…the force of a body… is measured by the product of its mass and the square of its speed.',
        statementSource: 'Leibniz, Brevis Demonstratio Erroris Memorabilis Cartesii (1686)',
      },
      {
        name: 'Thomas Young',
        lifespan: '1773–1829',
        role: 'English physician and physicist',
        contribution:
          'Introduced the English word "energy" for the concept, bringing clarity to the slowly forming conservation idea.',
        statement:
          'The term energy may be applied, with great propriety, to the product of the mass or weight of a body, into the square of the number expressing its velocity.',
        statementSource: 'Thomas Young, A Course of Lectures on Natural Philosophy (1807) — where he introduced the term',
      },
      {
        name: 'James Prescott Joule',
        lifespan: '1818–1889',
        role: 'English physicist and brewer',
        contribution:
          'Measured the mechanical equivalent of heat with meticulous experiments, proving work and heat are interchangeable forms of the conserved quantity.',
        statement:
          'It is… certain that the quantity of heat… is exactly proportional to the living force expended in producing it.',
        statementSource: 'James Joule, "On the Mechanical Equivalent of Heat" (1843–1850)',
      },
      {
        name: 'Hermann von Helmholtz',
        lifespan: '1821–1894',
        role: 'German physician and physicist',
        contribution:
          'Independently formulated the conservation of energy ("conservation of force") in 1847, grounding it in mechanics.',
        statement:
          '…the quantity of force in nature… can neither be increased nor diminished.',
        statementSource: 'Hermann von Helmholtz, Über die Erhaltung der Kraft (1847)',
      },
    ],
    timeline: [
      {
        period: '1686',
        event: 'Leibniz publishes "vis viva" (living force, ~mv²), challenging Descartes’ momentum.',
        figure: 'Gottfried Wilhelm Leibniz',
        note: 'The ancestor of kinetic energy is born.',
      },
      {
        period: '1807',
        event: 'Thomas Young introduces the English word "energy."',
        figure: 'Thomas Young',
        note: 'The concept gets its name.',
      },
      {
        period: '1842–1843',
        event: 'Mayer and Joule independently connect mechanical work and heat.',
        figure: 'Julius Robert Mayer & James Prescott Joule',
        note: 'The two threads converge.',
      },
      {
        period: '1847',
        event: 'Helmholtz states the general conservation of energy.',
        figure: 'Hermann von Helmholtz',
        note: 'The law is now general.',
      },
    ],
    perspectives: [
      {
        figure: 'René Descartes (1644)',
        view: 'The persistent quantity of motion is momentum (mass × speed).',
        standing: 'Partly superseded',
        note: 'Momentum is conserved too — but it is not the whole story; energy is a different, equally conserved quantity.',
      },
      {
        figure: 'Gottfried Leibniz (1686)',
        view: 'The truly persistent quantity is vis viva, mass × speed² — live force, the seed of kinetic energy.',
        standing: 'The productive correction',
        note: 'History settled that both momentum and energy are conserved; Leibniz was right that Descartes missed the second.',
      },
      {
        figure: 'Julius Robert Mayer, James Joule, Hermann von Helmholtz (1842–1847)',
        view: 'Work, heat, and other forms of energy are interchangeable and conserved — the principle of conservation of energy.',
        standing: 'Established — one of the bedrock laws of physics',
        note: 'Three people, three paths, one law. Honour belongs to all three, and priority disputes between them remain a historical subtlety.',
      },
    ],
    deepDive: {
      phenomenon: 'Conservation of energy: why the ledger never loses a joule',
      intro:
        'Energy is a conserved quantity that can change form but never be created or destroyed. The phrase "never be destroyed" hides a surprising amount of subtlety — this deep-dive follows the idea from a schoolbook example to the theorem that underwrites modern physics.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Energy is like money for motion and change. It comes in forms: moving things have kinetic energy, raised things have potential energy, hot things have heat, and so on. It never vanishes — it just turns from one form into another. A dropped ball trades potential for kinetic energy as it falls.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with the basics',
          body:
            'The key is to count every form. For a falling stone, E = mgh (potential) turns into K = ½mv² (kinetic), and if you ignore drag they trade exactly: mgh = ½mv² at impact. Add friction and the "missing" mechanical energy shows up as heat — nothing is lost, only converted. This is why the law is never violated: the bookkeeping always includes heat, sound, and other forms.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied physicists',
          body:
            'Engineers track energy across a control volume with the first law of thermodynamics: ΔU = Q − W, heat in minus work out changes the internal energy. Systems that rely on energy balance — turbines, engines, refrigerators, power grids — are designed so that every joule is accounted for, with losses (irreversibility) counted as entropy generation rather than disappearance of energy.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Noether’s theorem makes energy conservation exact and *unconditional* for any system whose dynamics are invariant under time translation. That is what makes it so robust — it does not depend on the details of the forces, only on time symmetry. In general relativity, naive energy conservation becomes subtle because time translation may not be a global symmetry of a curved spacetime, which is why gravitational-wave emission and the cosmological expansion complicate the naive "total energy" bookkeeping. The Newtonian conservation law you learn here is a profound, deep consequence of symmetry — not a convenient bookkeeping rule.',
        },
      ],
    },
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
    estimatedTimeMinutes: 16,
  },
};