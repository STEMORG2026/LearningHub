/**
 * Batch 3 — mastered exemplar narratives.
 *
 * These demonstrate the quality bar of the narration pipeline
 * (docs/guides/task-playbooks/narration/QUALITY-RUBRIC.md): textbook-grade, fully
 * story-shaped prose, an animation/interactive hook, etymology, order-of-magnitude
 * scale, honoured people and views, and a deep-dive that scales Curious → Nerd.
 */
import type { NarrativeContent } from '@stem-tuition/content-provider';

export const NARRATIVES_BATCH3: Record<string, NarrativeContent> = {
  'lhs:phys.mass': {
    conceptId: 'lhs:phys.mass',
    hook:
      'An astronaut on the Moon can lift a boulder that would crush them on Earth — yet the boulder is exactly as hard to *set moving* either place. That unchanging stubbornness, the amount of "you" that resists being pushed around, is mass. It is not weight. It is not size. It is the most intimate property you carry, and the most misunderstood.',
    history:
      'The ancient world had no clean idea of mass; weight served for both. Isaac Newton was among the first to separate the two. In the Principia (1687) he spoke of *quantity of matter* — a body’s inertia, "conjunctly arising from the greatness of the matter and the celerity of motion." He recognised that the same body, wherever it sits in the cosmos, offers a fixed resistance to being accelerated, and he called on two kinds of mass without quite having words for them: the one that resists motion (inertial mass) and the one that feels gravity (gravitational mass). Their equality — a remarkable coincidence he assumed but could not explain — became, two and a half centuries later, the seed of Einstein’s general relativity. The practical story is about measurement. France’s revolutionary kilogram (1795) fixed a unit of *mass*, not weight. By 1889 the prototype kilogram — a cylinder of platinum–iridium in a Paris vault — became the world’s reference. And in 2019, after decades of exacting electrical experiments, the world redefined the kilogram in terms of a constant of nature, Planck’s constant, severing mass from any physical artefact forever.',
    figures: [
      {
        name: 'Isaac Newton',
        lifespan: '1643–1727',
        role: 'English mathematician and natural philosopher',
        contribution:
          'Introduced "quantity of matter" as a fixed property of a body separate from weight, and implicitly distinguished inertial from gravitational mass through his laws of motion and law of gravitation.',
        statement:
          'The quantity of matter is the measure of the same, arising from its density and bulk conjunctly.',
        statementSource: 'Isaac Newton, Principia, Definitions I (1687, trans. Andrew Motte)',
      },
      {
        name: 'Ernst Mach',
        lifespan: '1838–1916',
        role: 'Austrian physicist and philosopher of science',
        contribution:
          'Argued sharply that "mass" is not an occult essence but a measurable ratio of accelerations between bodies, paving the way for a definition free of metaphysics.',
        statement:
          'The untroubled notion of mass as a property of matter owes more to habit than to evidence.',
        statementSource: 'Paraphrase of Ernst Mach, The Science of Mechanics (1883)',
      },
      {
        name: 'The BIPM and the 2019 redefinition',
        lifespan: '1889–2019',
        role: 'International Bureau of Weights and Measures (metrology community)',
        contribution:
          'Moved the kilogram from an artefact to a definition tied to Planck’s constant h, making the unit of mass universal and drift-free.',
        statementSource: 'BIPM, redefinition of the SI base units (decision effective 20 May 2019)',
      },
    ],
    timeline: [
      {
        period: '1687',
        event: 'Newton defines quantity of matter and separates inertia from weight in the Principia.',
        figure: 'Isaac Newton',
        note: 'The conceptual birth of mass as we use it.',
      },
      {
        period: '1883',
        event: 'Mach proposes defining mass by mutual acceleration, grounding it operationally.',
        figure: 'Ernst Mach',
      },
      {
        period: '1889',
        event: 'The platinum–iridium kilogram artefact (IPK) becomes the world standard.',
        note: 'A physical object as the definition of mass — stable, but not eternal.',
      },
      {
        period: '2019',
        event: 'The kilogram is redefined via Planck’s constant; the artefact is retired.',
        note: 'Mass is now tied to a constant of nature, not to a piece of metal.',
      },
    ],
    perspectives: [
      {
        figure: 'Isaac Newton (1687)',
        view:
          'Mass is the inherent quantity of matter, giving a body fixed inertia wherever it is; inertial and gravitational mass coincide.',
        standing: 'Foundational — still the working picture in everyday mechanics',
        note: 'He assumed their equality without being able to say why.',
      },
      {
        figure: 'Ernst Mach (1883)',
        view:
          'Mass is not a mysterious substance but a defined ratio of accelerations between two bodies; ultimately "inertia" is relative to the distant stars.',
        standing: 'Influential; shaped operationalism and Einstein’s thinking',
        note: 'Mach’s principle remains an open motivation in cosmology.',
      },
      {
        figure: 'Albert Einstein (1916)',
        view: 'Inertial and gravitational mass are exactly equal, and that equality is why falling is universal — gravity is geometry, not a force to be resisted by a "heavier" body.',
        standing: 'The modern consensus (the weak equivalence principle)',
        note: 'General relativity reinterprets the old coincidence as the heart of gravity.',
      },
    ],
    deepDive: {
      phenomenon: 'What mass actually is: inertia, gravity, and the kilogram redefinition',
      intro:
        'Mass resists acceleration, feels gravity, and — since 2019 — is defined by a constant of nature. This deep-dive walks from the everyday to the frontier of how mass is measured and understood.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Mass is how much a thing resists being sped up or slowed down. A loaded shopping trolley is hard to get rolling because it has more mass — more "stuff" that is comfortable staying put. It is not the same as weight: a biscuit tin has mass everywhere, but it weighs less on the Moon and more on Jupiter. On Earth your mass in kilograms and your weight in newtons are linked by gravity, W = m·g, where g ≈ 9.8, but they are different things. Mass is yours. Weight is what gravity does to your mass.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with forces',
          body:
            'Mass shows up in two roles. Inertial mass, m = F/a, measures resistance to acceleration in Newton’s second law. Gravitational mass, m = W/g, measures how strongly gravity pulls. That these two are equal (to extraordinary precision) is the weak equivalence principle — the reason a feather and a hammer fall together in a vacuum. In SI, mass is measured in kilograms; weight is a force in newtons. A spring balance reads weight; a balance compares masses by matching gravitational pull on both sides. The two scales you step on tell you different truths depending on what they physically measure.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and metrologists',
          body:
            'Since 20 May 2019 the kilogram is defined by fixing Planck’s constant h exactly and measuring mass through a Kibble balance or silicon-sphere count of atoms, eliminating drift from the old artefact. In engineering, inertial mass governs force and energy (F = ma, KE = ½mv²), while gravitational mass sets weight and structural load. In accelerometers and inertial navigation, you sense inertial mass directly; balances and scales that exploit weight must be calibrated for local g. These are not interchangeable in precision work — a mass measured by a balance is immune to g, a load measured by a strain gauge is not.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'The equality of inertial and gravitational mass is elevated in general relativity into the equivalence principle: local physics in free fall is that of flat spacetime, and gravity is the curvature encoded in the metric. "Mass" splits further in relativity — rest mass m₀ (invariant), relativistic mass (context-dependent), and mass–energy equivalence E = mc². In the Standard Model, most mass of ordinary matter arises not from fundamental particles but from the binding energy of quarks and gluons inside nucleons. Mach’s view that inertia is relational continues to motivate "Mach’s principle" in cosmology. And the 2019 SI redefinition ties the macroscopic kilogram to the Planck constant, so the unit no longer depends on any individual atom or artefact.',
        },
      ],
    },
    whatCameBefore:
      'You need force and acceleration to meet mass in Newton’s second law, and gravity to meet weight. Before that, mass is the intuitive "how much stuff" you can already feel when you push a loaded cart.',
    connections: [
      'Newton’s second law (mass is the proportionality between force and acceleration)',
      'Weight (the force gravity exerts on mass)',
      'Momentum and kinetic energy (both scale with mass)',
      'Free fall (the same mass that resists motion also feels gravity equally)',
    ],
    applications: [
      'A spacecraft’s propellant is budgeted by mass, not weight, because in orbit there is no weight to lean on — changing mass is the entire challenge of rocketry.',
      'Medicines are dosed by mass in milligrams, and the international prototype once literally defined global commerce — every "kilo" of rice or steel traces back to the kilogram standard.',
      'Inertial navigation inside phones, missiles and submarines works by sensing mass’s resistance to acceleration — the same m in F = ma.',
    ],
    workedExamples: [
      'A truck of mass 2000 kg accelerates at 2 m/s². Required force: F = m·a = 2000 × 2 = 4000 N. On the Moon, g ≈ 1.62, so its weight there is W = 2000 × 1.62 ≈ 3240 N — yet its mass is still 2000 kg, and it still needs 4000 N to accelerate at 2 m/s². Mass is the constant; force and weight vary with the situation.',
    ],
    analogies: [
      'Picture a heavy train and a light bicycle. Mass is how stubborn each is about changing speed — like a shy guest who will not leave the sofa. Weight is the shove gravity gives them. The train is stubborner (more mass) *and* heavier (more weight) on Earth, but on the Moon the train is still stubborner to push even though it weighs far less.',
    ],
    misconceptions: [
      'Mass and weight are not the same: weight is a force that changes with gravity; mass does not change.',
      'A kilogram measures mass, not weight — "I weigh 60 kg" is a friendly misuse; your weight in newtons is about 60 × 9.8.',
      'More mass is not "more gravity feeling per unit" — all masses fall together because inertial and gravitational mass are equal.',
      'An object in orbit is not "massless"; it is weightless (apparent weight zero) but its mass and inertia are unchanged.',
    ],
    tryThis:
      'Fill a rucksack with books and try to swing it gently side to side, then try to spin it overhead fast. Feel how the books resist *changing* your motion of the bag — that is mass, and it is why a heavy bag is tiring even when you are not lifting it.',
    funFacts: [
      'For 130 years, the kilogram was a single cylinder of metal in Paris — and its mass slowly changed as surface atoms rubbed off; that drift is exactly why scientists retired it in 2019.',
      'Your own mass is mostly not "you" — roughly 99% of it is binding energy inside the protons and neutrons of your atoms.',
      'A balance and a spring scale can disagree on the Moon, because one measures mass and the other measures weight.',
    ],
    estimatedTimeMinutes: 16,
  },
};