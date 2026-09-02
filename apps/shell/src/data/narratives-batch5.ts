/**
 * Batch 5 — senior-secondary electricity & magnetism narratives.
 *
 * Authored to the Master-Reviewer rubric (docs/guides/task-playbooks/narration/):
 * story-shaped prose, real people with recorded words + sources, a historical
 * timeline, respected/differing views given due weight, and a deep-dive that scales
 * Curious → Enthusiast → Professional → Nerd. Canonical facts stay consistent with the
 * vendored STEMMA export.
 */
import type { NarrativeContent } from '@learninghub/content-provider';

export const NARRATIVES_BATCH5: Record<string, NarrativeContent> = {
  'lhs:phys.electric-charge': {
    conceptId: 'lhs:phys.electric-charge',
    hook:
      'Rub a balloon on your hair and it leaps for the wall. Snap a wool sweater off in winter and you feel a sting on dry fingers. Both are the oldest electricity there is — before batteries, before wires, before power lines, humans met it as a spark and a crackle. That stubborn, invisible something is electric charge.',
    history:
      'Charge was discovered as static long before wires carried it. Thales of Miletus, around 600 BCE, knew that rubbed amber (Greek *elektron*, whence our word "electricity") attracts light objects. For two thousand years it stayed a curiosity. In the 1600s William Gilbert, physician to Queen Elizabeth, systematised the study of electric attraction and coined the very word. Around 1746, Benjamin Franklin — already a celebrated printer — performed famous experiments with a key, a kite and a storm, and proposed that electricity is a single fluid with positive (excess) and negative (deficit) states; his "+" and "−" stuck forever, even though it was his French contemporary Antoine du Fay who had argued for two kinds. The modern unit of charge, the coulomb, honours Charles-Augustin de Coulomb, whose 1785 law (batch-5 sibling) gave the force its precision. Only in 1897 did J.J. Thomson discover the electron, and in 1911 Robert Millikan measured its tiny charge — showing that charge comes in fixed, indivisible packets.',
    figures: [
      {
        name: 'Thales of Miletus',
        lifespan: 'c. 624–545 BCE',
        role: 'Greek philosopher',
        contribution:
          'Left the earliest recorded note that rubbed amber attracts light objects — the first spark of recorded electricity.',
        statement:
          'Amber, when rubbed, attracts straw and other light bodies.',
        statementSource: 'Paraphrase of Thales as reported by later Greek authors (c. 600 BCE)',
      },
      {
        name: 'William Gilbert',
        lifespan: '1544–1603',
        role: 'English physician and natural philosopher',
        contribution:
          'Systematically studied magnetic and electric attraction and coined the word "electric", separating the two phenomena experimentally.',
        statement:
          'The earth itself is a great magnet.',
        statementSource: 'William Gilbert, De Magnete (1600) — paraphrase of his thesis',
      },
      {
        name: 'Benjamin Franklin',
        lifespan: '1706–1790',
        role: 'American scientist, inventor and statesman',
        contribution:
          'Proposed that electricity is a single fluid described by surplus (+) and deficit (−) charge. His kite experiment helped show lightning is electrical in nature.',
        statement:
          'Electrical matter consists of particles extremely subtile, since it can permeate common matter, even the densest metals, with such ease and freedom as not to receive any perceptible resistance.',
        statementSource: 'Benjamin Franklin, letter of 11 July 1747 — paraphrase',
      },
      {
        name: 'J.J. Thomson',
        lifespan: '1856–1940',
        role: 'British physicist',
        contribution:
          'Discovered the electron in 1897, establishing that charge is carried by subatomic particles.',
        statement:
          '…we have in the cathode rays matter in a new state, in which the corpuscles are much smaller than the atoms.',
        statementSource: 'J.J. Thomson, "Cathode Rays" (1897) — paraphrase',
      },
    ],
    timeline: [
      {
        period: 'c. 600 BCE',
        event: 'Thales records that rubbed amber attracts light objects.',
        figure: 'Thales of Miletus',
      },
      {
        period: '1600',
        event: 'Gilbert publishes De Magnete, coining "electric" and separating electricity from magnetism.',
        figure: 'William Gilbert',
      },
      {
        period: '1740s–1752',
        event: 'Franklin proposes the +/− single-fluid model and experiments with lightning.',
        figure: 'Benjamin Franklin',
      },
      {
        period: '1785',
        event: 'Coulomb quantifies the force between charges.',
        figure: 'Charles-Augustin de Coulomb',
      },
      {
        period: '1897–1911',
        event: 'Thomson discovers the electron; Millikan measures its elementary charge.',
        figure: 'J.J. Thomson; Robert Millikan',
      },
    ],
    perspectives: [
      {
        figure: 'Benjamin Franklin (1747)',
        view: 'Electricity is a single fluid; excess is +, deficit is −.',
        standing: 'Historically decisive; the +/− labels still in use',
        note: 'Proved wrong in detail (charge carriers are electrons), right in scheme.',
      },
      {
        figure: 'Antoine du Fay (1733)',
        view: 'There are two kinds of electricity, "vitreous" and "resinous".',
        standing: 'Two-fluid idea; both approaches describe the same facts',
        note: 'Du Fay preceded Franklin in realising there are two opposite kinds.',
      },
      {
        figure: 'Modern atomic theory',
        view: 'Charge is carried by electrons and protons; the electron carries one elementary charge e ≈ 1.6×10⁻¹⁹ C.',
        standing: 'The current consensus',
        note: 'Charge is quantised and conserved.',
      },
    ],
    deepDive: {
      phenomenon: 'What charge is, and why it is quantised and conserved',
      intro:
        'Electric charge is a fundamental property of matter that creates forces across space. This deep-dive moves from rubbing a balloon to the quantised packets that build all matter.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Electric charge is a property of matter that makes it feel a force. There are two kinds — call them positive and negative. Like charges repel (two balloons rubbed the same way push apart), opposite charges attract (the balloon sticks to the wall). Rubbing transfers charge from one object to another — it is not made fresh. The unit is the coulomb (C), but a whole coulomb is a huge amount: you meet charge mostly by the invisible spark and crackle of static electricity.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with the basics',
          body:
            'Charge is conserved and quantised: it is neither created nor destroyed, only transferred, and it comes in whole multiples of the elementary charge e ≈ 1.6×10⁻¹⁹ C (the charge on one electron or proton). A charged object can attract a neutral one by polarisation — charges inside the neutral object shift. Charge is measured in coulombs; one electron carries about 1.6×10⁻¹⁹ C, so one coulomb is about 6.2×10¹⁸ electrons. Static buildup occurs when friction transfers charge between insulators.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied technologists',
          body:
            'In electrostatics you compute forces with Coulomb’s law and fields as force-per-unit-charge. Practical design manages charge: ESD (electrostatic discharge) protection grounds sensitive electronics because a tiny spark can destroy a chip; electrostatic precipitators charge smoke particles to remove them; photocopiers and laser printers transfer toner electrostatically. Capacitors store charge; their energy is U = ½CV². In conductors, free electrons carry current; in electrolytes and semiconductors, ions and holes matter too.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Charge is the source of the electromagnetic field, entering Maxwell’s equations through the charge density and current. It is exactly conserved (a consequence of gauge symmetry, by Noether’s theorem) and quantised, though why it is quantised — and why the proton charge exactly equals the electron charge in magnitude — is a deep open puzzle connected to anomalies and the Standard Model. Point-charge fields blow up classically; renormalisation in QED tames them. Millikan’s experiment showed charge granularity, but the "why" of e remains a mystery in particle physics.',
        },
      ],
    },
    whatCameBefore:
      'You need the idea of a force and of positive/negative. Charge is the "substance" that electric forces act on; Coulomb’s law and fields describe how it pushes and pulls.',
    connections: [
      'Coulomb’s law (the force between charges)',
      'Current (moving charge)',
      'Voltage and work (energy per charge)',
    ],
    applications: [
      'Lightning is a colossal discharge of separated static charge — a cloud’s rubbed ice and drops charge it like a giant battery.',
      'Electrostatic paint and powder coating use charged particles that stick to the metal part exactly.',
      'A photocopier uses charge patterns to attract toner wherever dark pixels should be.',
    ],
    workedExamples: [
      'A metal sphere gains 2.0×10⁻⁸ C of excess charge by conduction. The number of electrons added = Q/e = (2.0×10⁻⁸)/(1.6×10⁻¹⁹) ≈ 1.25×10¹¹ electrons. A tiny mass of extra electrons, yet an enormous count — which is why sparking from a charged object can discharge so suddenly.',
    ],
    analogies: [
      'Charge is like money in two colours: positives and negatives. Like colours repel, opposites attract, and rubbing is just handing coins from one pocket to another — nothing is minted, only moved.',
    ],
    misconceptions: [
      'Friction does not create charge — it transfers it.',
      'A charged object can attract a neutral one (via polarisation), not just other charged objects.',
      'Electrons are not the only carriers — ions and holes carry charge too.',
    ],
    tryThis:
      'Rub a balloon hard against your hair, then bring it near a thin stream of water from a tap. The stream bends toward the balloon — the charged balloon polarises the water and pulls the whole stream sideways.',
    funFacts: [
      'The word "electric" comes from the Greek *elektron*, meaning amber, because amber was the first material seen to attract things when rubbed.',
      'A bolt of lightning moves the same charge you build on a comb — but with a million times the voltage, which is why it is so destructive.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.coulombs-law': {
    conceptId: 'lhs:phys.coulombs-law',
    hook:
      'Two charges push or pull each other across empty space with a force that halves when you double the gap and quarters when you double it again. The rule is as simple as a taut string — yet this 1785 law quietly underlies everything electric, from the atom to the smartphone.',
    history:
      'Charles-Augustin de Coulomb, a French military engineer and physicist, spent his career on torsion balances — instruments that measure tiny forces by the twisting of a wire. In 1785 he published his law of electrostatics: the force between two point charges is proportional to the product of their charges and inversely proportional to the square of their separation, pointing along the line joining them. The inverse-square shape had been suspected — Joseph Priestley had hinted at it in 1767 — but Coulomb measured it. The inverse-square form is the same law that defines gravity, which is why physicists often remark that the Universe built both electricity and gravity from the same floor plan.',
    figures: [
      {
        name: 'Joseph Priestley',
        lifespan: '1733–1804',
        role: 'English chemist and natural philosopher',
        contribution:
          'Suggested that the electric force obeys an inverse-square law in 1767, before Coulomb’s precise measurements.',
        statement:
          '…the attraction of electricity is subject to the same law as that of gravitation.',
        statementSource: 'Paraphrase of Joseph Priestley, The History and Present State of Electricity (1767)',
      },
      {
        name: 'Charles-Augustin de Coulomb',
        lifespan: '1736–1806',
        role: 'French physicist and military engineer',
        contribution:
          'Measured the electrostatic force between small charged spheres with a torsion balance and stated the law that bears his name (1785).',
        statement:
          'The force of repulsion between two small charged spheres is inversely as the square of the distance.',
        statementSource: 'Charles Coulomb, "Premier Mémoire sur l’électricité" (1785) — paraphrase',
      },
      {
        name: 'Henry Cavendish',
        lifespan: '1731–1810',
        role: 'English scientist',
        contribution:
          'Independently inferred the inverse-square law of electrostatics and also measured gravitational attraction with a torsion balance.',
        statementSource: 'Cavendish’s unpublished electrical experiments (1770s) — paraphrased note',
      },
    ],
    timeline: [
      {
        period: '1767',
        event: 'Priestley suggests the electric force is inverse-square.',
        figure: 'Joseph Priestley',
      },
      {
        period: '1785',
        event: 'Coulomb precisely verifies the inverse-square law using a torsion balance.',
        figure: 'Charles-Augustin de Coulomb',
      },
      {
        period: '1770s',
        event: 'Cavendish independently derives the same law by a different method.',
        figure: 'Henry Cavendish',
      },
    ],
    perspectives: [
      {
        figure: 'Joseph Priestley (1767)',
        view: 'Electrical attraction follows the same inverse-square law as gravity.',
        standing: 'Correct and early — but not measured',
        note: 'Reasoned by analogy with conduction.',
      },
      {
        figure: 'Charles-Augustin de Coulomb (1785)',
        view: 'The force is exactly proportional to product of charges and inverse square of distance.',
        standing: 'The law used today (for point charges)',
        note: 'His torsion-balance measurement made the law quantitative.',
      },
      {
        figure: 'Henry Cavendish (1770s)',
        view: 'The force decays as the square of distance, confirmed by a different arrangement.',
        standing: 'Corroborating — published only later',
        note: 'Two independent routes reached the same result.',
      },
    ],
    deepDive: {
      phenomenon: 'The inverse-square law and what it makes possible',
      intro:
        'Coulomb’s law, F = k|q₁q₂|/r², is the electrostatic rulebook for point charges. This deep-dive unpacks why it matters and where it fails.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Coulomb’s law says the force between two point charges is bigger for bigger charges and smaller the farther apart they are. Double the distance and the force drops to a quarter. It is why you feel a spark strongly when you reach close, and not at all across the room. The k in F = k·q₁·q₂/r² is a constant (about 9×10⁹ N·m²/C²). The force pushes apart if the charges are alike and pulls together if they are opposite.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'F = k|q₁q₂|/r², with k ≈ 9×10⁹ N·m²/C² (equal to 1/(4πε₀)). It is an inverse-square law: the force is halved-doubled by the same fraction that the distance doubles. The direction is along the line joining the charges (repulsive for like signs, attractive for unlike). The constant k changes with the medium — it is smaller inside an insulator because the field is weakened, so the force drops. The law is exact for point charges and, like gravity, falls to zero only at infinite distance.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'In vector form, F = (k q₁q₂/r²) r̂. You use it to compute forces in electrostatics, in charge-array problems (superposition), and to derive the electric field E = F/q. The permittivity ε₀ and relative permittivity εᵣ tune k in different materials, which matters for capacitor design and insulation. The inverse-square geometry is why field lines from a point charge spread over area 4πr², giving E ∝ 1/r² — the same geometric dilution that makes gravity inverse-square.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Coulomb’s law emerges from Gauss’s law (∇·E = ρ/ε₀) in electrostatics; its 1/r² character reflects the divergence of a point source in three dimensions. It is not merely analogous to gravity — in Newtonian terms both are inverse-square, but electromagnetism is a vector field with two sources (charge and current) while gravity is spacetime geometry. The force law fails at atomic scale without quantum mechanics, where the Coulomb potential sits in the Schrödinger/Hamiltonian and creates the energy-level structure of atoms. Precision tests of the inverse-square exponent (better than 1 part in 10¹⁴) rule out a photon mass and underpin modern gauge theory.',
        },
      ],
    },
    whatCameBefore:
      'You need electric charge (positive/negative) and force. Coulomb’s law is the first precise "how much" of electrostatics.',
    connections: [
      'Electric charge (the property the law acts on)',
      'Newton’s law of gravitation (the same inverse-square form)',
      'Electric field (force per unit charge derived from the law)',
    ],
    applications: [
      'Inkjet printers and electrostatic precipitators rely on the law to steer and attract charged droplets or particles.',
      'The behaviour of capacitors and the design of insulator creep-age follow from the inverse-square force and permittivity.',
      'Particle accelerators use the Coulomb repulsion to shape beams of similarly charged ions.',
    ],
    workedExamples: [
      'Two point charges of +3 µC and −4 µC are 0.5 m apart. Force F = k·|q₁q₂|/r² = (9×10⁹)·(3×10⁻⁶·4×10⁻⁶)/(0.25) = (9×10⁹)·(1.2×10⁻¹¹)/0.25 ≈ 0.432 N, attractive (opposite signs). At 1.0 m the force falls to about 0.108 N — a quarter — because the distance doubled.',
    ],
    analogies: [
      'Picture two balls on a taut invisible sheet: bigger balls press harder, and moving them farther apart relaxes the tension. The inverse square is the "farther means weaker, fast" rule of any point source spreading in three dimensions.',
    ],
    misconceptions: [
      'Coulomb’s law is exact only for point charges, not for realistic finite objects of arbitrary shape (that needs integration).',
      'The force depends on the medium — the constant k (permittivity) changes it.',
      'It differs from gravity in key ways (gravity only attracts; electrostatics has no repulsion for unlike charge).',
    ],
    tryThis:
      'Charge a small balloon by rubbing, then bring it slowly toward a fixed charged balloon. Feel the repulsion grow sharply as you close the gap — that growing force is the inverse-square rule you can feel.',
    funFacts: [
      'Coulomb measured forces a thousand times smaller than a gram of weight using a wire’s twist — a stunningly delicate instrument.',
      'The same inverse-square law shape (1/r²) governs both the electric force on charges and the gravitational pull on masses, yet the constants differ by a factor of ~10⁴².',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.current': {
    conceptId: 'lhs:phys.current',
    hook:
      'Flip a switch and the lamp is bright before your finger leaves it — yet the electrons that light it barely crawl, inches a minute. What races down the wire is not the charge but the *signal*, and it is exactly that difference that makes electricity the most useful thing we have ever wired.',
    history:
      'The idea that electricity flows through wires emerged slowly. Luigi Galvani’s frog-leg twitches (1780s) led Alessandro Volta to the first true battery in 1800, a source of steady "current" rather than a momentary spark. The direction of flow was settled by convention before electrons were known: André-Marie Ampère, who named and studied the phenomenon, assigned current to flow from positive to negative — a choice that stuck and still guards the sign in every textbook, though actual electrons move the other way. Georg Ohm’s 1827 law made current quantitative, and workers from Faraday onward showed current does physical work — magnetising, heating, decomposing. The unit, the ampere, honours Ampère, whom Maxwell called "the Newton of electricity."',
    figures: [
      {
        name: 'Alessandro Volta',
        lifespan: '1745–1827',
        role: 'Italian physicist',
        contribution:
          'Invented the voltaic pile in 1800, the first battery to supply a steady electric current.',
        statement:
          'Some facts … have induced me to believe that I have found a means of obtaining … a perpetual circulation of the electric fluid.',
        statementSource: 'Alessandro Volta, letter to Sir Joseph Banks (20 March 1800) — paraphrase',
      },
      {
        name: 'André-Marie Ampère',
        lifespan: '1775–1836',
        role: 'French physicist',
        contribution:
          'Named and quantified current and its magnetic effects; the ampere and the unit of current bear his name.',
        statement:
          'The name I give to the electric state which can maintain a current … I call an electrodynamic state.',
        statementSource: 'Paraphrase of Ampère’s electrodynamics (1820s)',
      },
      {
        name: 'Georg Simon Ohm',
        lifespan: '1789–1854',
        role: 'German physicist',
        contribution:
          'Established the linear relation between current and voltage in a conductor — Ohm’s law — and defined resistance.',
        statement:
          'The force of the current is in every part of the circuit the same, whether in the wire or the electrolyte.',
        statementSource: 'Paraphrase of Georg Ohm, Die galvanische Kette (1827)',
      },
    ],
    timeline: [
      {
        period: '1800',
        event: 'Volta invents the voltaic pile, giving a steady current source.',
        figure: 'Alessandro Volta',
      },
      {
        period: '1820s',
        event: 'Ampère studies current and its magnetic effects; names the phenomenon.',
        figure: 'André-Marie Ampère',
      },
      {
        period: '1827',
        event: 'Ohm publishes his law linking current, voltage and resistance.',
        figure: 'Georg Simon Ohm',
      },
    ],
    perspectives: [
      {
        figure: 'Conventional flow (Ampère, 1820s)',
        view: 'Current flows from positive to negative (the arrow of conventional current).',
        standing: 'The sign convention used in all circuit analysis',
        note: 'Actual electron flow is opposite, but the mathematics is unaffected.',
      },
      {
        figure: 'Electron picture (post-1900)',
        view: 'In metals the moving charges are electrons, flowing from negative to positive.',
        standing: 'The physical consensus; coexists with conventional flow',
        note: 'Both render identical circuit behaviour.',
      },
      {
        figure: 'Georg Ohm (1827)',
        view: 'Current is proportional to electromotive force for a given conductor.',
        standing: 'Fundamental — Ohm’s law, for ohmic materials',
        note: 'Applies within limits; non-ohmic devices differ.',
      },
    ],
    deepDive: {
      phenomenon: 'Why the signal races while the electrons crawl',
      intro:
        'Current, I = Q/t, is the rate at which charge flows through a point in a circuit. The deep-dive explains the drift speed of individual charges versus the near-instant transmission of the signal.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Electric current is how much charge flows past a point each second. It is measured in amperes (A): one ampere is one coulomb per second. Think of a moving walkway at an airport — the belt (current) moves, and people (charge) ride on it. The unit and the name come from André-Marie Ampère. Current is the same all around a simple series loop — it does not get "used up" by the bulb; the bulb uses the energy the current carries.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'I = Q/t, with Q in coulombs and t in seconds. In a metal, free electrons drift slowly (millimetres per second) yet the current "arrives" nearly instantly because the electric field propagates at a large fraction of light speed, nudging the whole electron sea into motion at once. Conventional current (positive to negative) is opposite to electron flow. Current is conserved in a series circuit; in parallel, it splits. The direction you assign, + to −, is the convention that keeps VR = IR consistent.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied scientists',
          body:
            'You design with I = Q/t and Kirchhoff’s current law. Current density J relates current to area; drift velocity v_d = I/(n·A·e) where n is free-electron density. Power is P = IV. Circuit protection sizes breakers and fuses to the expected current; overcurrent is dangerous. AC and DC differ fundamentally — in DC charges drift one way; in AC (50/60 Hz) they oscillate in place, yet power still transfers. Semiconductors add holes and ions as carriers.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Current is the time-rate of charge transport, J = ρv in charge-density terms, and is the source term in Maxwell’s Ampère law (with displacement current). In metals the Drude model relates conductivity to electron mean free path; in quantum wires conduction is quantised in units of 2e²/h. The velocity of the *signal* is set by the transmission line’s permittivity and permeability, close to the speed of light — decoupled entirely from the sluggish drift velocity of individual carriers. In superconductors current flows without resistance; in quantum field theory, current is the Noether charge current of the theory’s U(1) gauge symmetry.',
        },
      ],
    },
    whatCameBefore:
      'You need electric charge. Current is simply moving charge — the rate charge flows, I = Q/t.',
    connections: [
      'Electric charge (what flows)',
      'Voltage (the push that drives current)',
      'Resistance (opposes current; Ohm’s law links all three)',
      'Heating effect (current through resistance heats)',
    ],
    applications: [
      'A fuse is a thin wire that heats and melts when too much current flows — a current-sensing safety cut.',
      'Power lines deliver current at very high voltage to cut resistive losses; your household runs at 120/230 V.',
      'A car battery supplies a large current to the starter motor for a few seconds — enough to spin the engine.',
    ],
    workedExamples: [
      'A small circuit carries 2.0 A for 30 s. Charge delivered Q = I·t = 2.0 × 30 = 60 C. That is 60 coulombs, or about 3.7×10²⁰ electrons — an enormous number moving through a single point in half a minute.',
    ],
    analogies: [
      'Current is the flow of the river; voltage is its height; resistance is the boulders in the bed. You can have a huge river (current) flowing slowly downhill (low voltage) or a thin violent one — both measures matter separately.',
    ],
    misconceptions: [
      'Current is not "used up" by components — it is the same around a series circuit.',
      'Conventional current flows positive to negative, opposite to electron drift.',
      'Higher voltage does not automatically mean higher current — resistance decides the ratio.',
    ],
    tryThis:
      'Connect a small bulb to a battery with a switch; watch it light instantly, then use a low-power microscope or slow video to compare how fast you must actually move a real charge — you will find the light appears before any single electron gets halfway around.',
    funFacts: [
      'Electrons in a household wire drift at about a tenth of a millimetre per second — slower than a crawling snail — yet the lamp lights instantly when you flip the switch.',
      'Lightning is a current of often tens of kiloamperes lasting milliseconds — orders of magnitude more than any household circuit.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.voltage': {
    conceptId: 'lhs:phys.voltage',
    hook:
      'Two ends of a wire, a different "tension" between them, and charge insists on flowing. Voltage is that difference — the push behind every electron. It is not energy, and it is not current; it is the reason either of them can do anything at all.',
    history:
      'For centuries electricity meant sparks and static. Alessandro Volta’s pile of 1800 changed everything by providing a steady *difference of potential* that could push current continuously. The concept of potential as "electrical height" was sharpened by Charles-Augustin de Coulomb and, most influentially, by the great mathematician Carl Friedrich Gauss and George Green, who gave the potential function its mathematical wings. Lord Kelvin built on these to treat circuits as flows driven by potential differences. The unit of potential difference, the volt, was named for Alessandro Volta. Ohm’s law then turned voltage, current and resistance into one family: V = IR.',
    figures: [
      {
        name: 'Alessandro Volta',
        lifespan: '1745–1827',
        role: 'Italian physicist',
        contribution:
          'Invented the voltaic pile in 1800, the first battery to sustain a potential difference and a steady current.',
        statement:
          'The pile is composed of a number of pairs of conductors of copper and zinc…',
        statementSource: 'Alessandro Volta, letter to Sir Joseph Banks (1800) — paraphrase',
      },
      {
        name: 'Carl Friedrich Gauss',
        lifespan: '1777–1855',
        role: 'German mathematician and physicist',
        contribution:
          'Advanced the mathematics of the electric potential and field (Gauss’s law, potential theory).',
        statementSource: 'Paraphrase of Gauss’s work on potential theory (1813–1839)',
      },
      {
        name: 'Lord Kelvin',
        lifespan: '1824–1907',
        role: 'British mathematical physicist',
        contribution:
          'Developed electrostatic potential theory and helped conceptualise electrical circuits in terms of potential differences.',
        statementSource: 'Paraphrase of Kelvin’s electrical research (1840s–1860s)',
      },
    ],
    timeline: [
      {
        period: '1800',
        event: 'Volta builds the voltaic pile, sustaining a potential difference.',
        figure: 'Alessandro Volta',
      },
      {
        period: '1813–1839',
        event: 'Gauss develops potential theory for electrostatic fields.',
        figure: 'Carl Friedrich Gauss',
      },
      {
        period: '1827',
        event: 'Ohm links voltage, current and resistance quantitatively.',
        figure: 'Georg Simon Ohm',
      },
    ],
    perspectives: [
      {
        figure: 'Alessandro Volta (1800)',
        view: 'A cell maintains an "electromotive force" that can drive a steady current.',
        standing: 'Foundational — the modern source of potential difference',
        note: 'His pile turned static electricity into usable power.',
      },
      {
        figure: 'Potential-theory workers (Gauss, Green, Kelvin)',
        view: 'Voltage is a potential function whose gradient makes a field — and in a circuit it is the potential difference that drives current.',
        standing: 'The mathematical consensus',
        note: 'Unified the field picture with the circuit picture.',
      },
      {
        figure: 'Georg Ohm (1827)',
        view: 'Current is proportional to the potential difference across a conductor.',
        standing: 'Quantitative — Ohm’s law, within limits',
        note: 'Voltage, current and resistance form one family.',
      },
    ],
    deepDive: {
      phenomenon: 'Voltage as energy per charge — and why it is always about a difference',
      intro:
        'Voltage is the work done per unit charge to move charge between two points, V = W/Q. The deep-dive explains why "potential difference" is the honest name and how voltage differs from energy.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Voltage is the "push" that drives current — think of the height difference between the top of a hill and the bottom. Higher voltage means more push for the same charge. A 1.5 V battery pushes gently; mains at 230 V pushes hard. Voltage is always a difference between two points, so we speak of it *across* a component, not at a single spot. It is measured in volts, named for Alessandro Volta.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'V = W/Q: the voltage between two points is the work per unit charge to move charge from one to the other. One volt means one joule per coulomb. A battery supplies an electromotive force (emf); the actual voltage *across* a loaded cell drops by the internal resistance (V = ε − Ir). Voltage drops across resistors in series (they add), and is the same across parallel branches. Ohm’s law V = IR ties voltage to current and resistance.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'You treat voltage as electric potential (units V = J/C). In circuit design, KVL (voltage drops sum to the emf), power P = VI, and energy E = V·It all derive from the potential picture. Ground is your zero reference; floating nodes are defined relative to it. Transformers and power conversion raise/lower voltage so that P = VI allows low-loss long-distance transmission. Semiconductor thresholds, rail voltages and ESD safety all hinge on precise potential-difference management.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Electric potential is V(r) = ∫−(E·dr), with E = −∇V. In electrostatics it is path-independent (conservative); in circuits, time-varying fields mean the "voltage" is the emf or line integral of E, subtle with induction (Faraday). In quantum transport, voltage differences set the Fermi-level splitting that drives tunnelling and current. The volt is defined metrologically via the Josephson effect (frequency × 2e/h), tying voltage measurement to a fundamental constant. In general relativity and superconductors, potential remains central yet takes on geometric or phase-mechanical meaning.',
        },
      ],
    },
    whatCameBefore:
      'You need charge and the idea of energy/work. Voltage is the work per unit charge — the "height" that pushes charge along.',
    connections: [
      'Current (voltage drives it)',
      'Resistance (V = IR)',
      'Work and energy (voltage is energy per charge)',
    ],
    applications: [
      'A standard AA battery is 1.5 V; car batteries 12 V; household sockets 230 V (Europe/Nepal) or 120 V (US).',
      'Step-up transformers raise voltage to tens of kilovolts for efficient long-distance power lines.',
      'Voltage regulators in electronics keep a steady supply despite varying load.',
    ],
    workedExamples: [
      'To move 3.0 C of charge between two points across which the potential difference is 9 V requires work W = V·Q = 9 × 3.0 = 27 J. That is the energy each 3.0 C of charge invests, and why a 9 V battery can drive meaningful power even if its charge storage is modest.',
    ],
    analogies: [
      'Voltage is the height of water in a tank; current is the flow through the pipe; resistance is how narrow the pipe is. You cannot have a strong flow without a height driving it, and the same flow at higher height carries more power.',
    ],
    misconceptions: [
      'Voltage is not current — voltage is the potential difference; current is the flow.',
      'A battery does not "create" current by itself; it provides a voltage, and the load resistance decides the current.',
      'Voltage is not "used up"; it drops across components, and energy is conserved.',
    ],
    tryThis:
      'Taste a 9 V battery briefly on your dry tongue (small, safe), then a 1.5 V one: the higher voltage gives a sharper sensation — you are literally feeling the potential difference pushing current through a slightly conducting path.',
    funFacts: [
      'The volt, ampere, ohm and farad are all named for scientists who shaped this story — a whole family on every battery label.',
      'Birds sit safely on high-voltage lines because there is no potential *difference* across their two feet — they are at the same potential.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.resistance': {
    conceptId: 'lhs:phys.resistance',
    hook:
      'The same battery makes a thick copper wire glow with a fat current and a thin nichrome wire merely warm — and a toaster gets hot because of one idea. Resistance is the friction of electricity, the reason conductors warm, fuses blow, and bulbs shine: the opposition that turns flowing charge into light and heat.',
    history:
      'The quantitative study of resistance began with Georg Simon Ohm. In 1827, working as a schoolteacher in Cologne, he published Die galvanische Kette, showing that the current in a circuit is proportional to the electromotive force and inversely proportional to a property he called resistance. His ideas were dismissed at first — the physics establishment of his day thought them unoriginal — and Ohm nearly gave up science. Recognition came only in the 1840s. Later, James Clerk Maxwell set resistance into the grand theory of electromagnetism, and precise standards tied the ohm to material constants. The unit of resistance, the ohm, honours Ohm. Resistance is not always unwanted: it is precisely what heats our kettles, glows our bulbs, and protects our circuits through fuses.',
    figures: [
      {
        name: 'Georg Simon Ohm',
        lifespan: '1789–1854',
        role: 'German physicist',
        contribution:
          'Established the linear relation V = IR between voltage, current and resistance (Ohm’s law) and defined resistance.',
        statement:
          'The magnitude of the current in a given circuit is proportional to the strength of the electromotive force.',
        statementSource: 'Paraphrase of Georg Ohm, Die galvanische Kette (1827)',
      },
      {
        name: 'James Clerk Maxwell',
        lifespan: '1831–1879',
        role: 'Scottish physicist',
        contribution:
          'Absorbed Ohm’s law and resistance into his unified theory of electromagnetism, showing the microscopic picture that explains resistance.',
        statement:
          'We are thus led to a new quantity … the electric resistance of the conductor.',
        statementSource: 'Paraphrase of Maxwell’s A Treatise on Electricity and Magnetism (1873)',
      },
    ],
    timeline: [
      {
        period: '1827',
        event: 'Ohm publishes Die galvanische Kette establishing V=IR.',
        figure: 'Georg Simon Ohm',
      },
      {
        period: '1873',
        event: 'Maxwell embeds resistance into electromagnetic theory.',
        figure: 'James Clerk Maxwell',
      },
      {
        period: '1880s+',
        event: 'Standard ohm artefacts and resistance boxes standardise measurement.',
        note: 'The ohm becomes a precise, reproducible unit.',
      },
    ],
    perspectives: [
      {
        figure: 'Georg Ohm (1827)',
        view: 'Resistance is a constant of a conductor linking current and voltage.',
        standing: 'Fundamental — Ohm’s law',
        note: 'Correct for ohmic materials.',
      },
      {
        figure: 'Microscopic / Maxwellian view',
        view: 'Resistance arises from collisions of charge carriers with the lattice; it is not a mythical "wearing out" of current.',
        standing: 'The physical consensus',
        note: 'Explains why thicker, shorter, better conductors have less resistance.',
      },
      {
        figure: 'Non-ohmic devices',
        view: 'Some materials (diodes, thermistors) do not obey V=IR with constant R.',
        standing: 'Important extension of Ohm’s model',
        note: 'Resistance then depends on temperature, light or voltage.',
      },
    ],
    deepDive: {
      phenomenon: 'What resistance actually is, and why materials differ',
      intro:
        'Resistance, R = V/I, opposes current and converts electrical energy to heat. This deep-dive explains the microscopic origin and the factors that set R.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Resistance is how much a conductor opposes the flow of current — the "friction" of electricity. A thick copper wire has low resistance; a thin resistance wire has high resistance. When current fights through resistance, energy turns into heat — that is why a toaster element glows and a bulb filament shines. Resistance is measured in ohms (Ω), named for Georg Ohm. Rubber has huge resistance (it insulates); metal has tiny resistance.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'R = V/I (ohms). Resistance depends on the material and geometry: R = ρL/A, where ρ is resistivity, L length and A cross-sectional area. Twice the length means twice the resistance; twice the area means half. In series, resistances add; in parallel they reduce. A resistor’s rating includes its power limit (P = I²R) — exceed it and it overheats. Ohm’s law holds for ohmic conductors; non-ohmic ones (diodes, thermistors) do not.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'You size resistors by resistance and power dissipation, R = V/I and P = I²R = V²/R. Temperature coefficient of resistance matters (thermistors use it as sensors). Circuit protection uses current-limiting and fusible elements that open at a rated I²R heating. In transmission, lower resistance (larger conductors, better materials, higher voltage to cut I) reduces I²R losses. Precision resistors and standard resistance boxes give reproducible ohms for measurement.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'At the microscopic level, R = ρL/A where ρ comes from electron–lattice scattering; the Drude model gives ρ = m/(ne²τ) with relaxation time τ. This is why conductors have low ρ, semiconductors moderate and tuneable ρ, and insulators enormous ρ. In quantum transport, resistance quantization (2e²/h conductance) appears in constrictions; the quantum Hall effect gives resistance in exact units of h/e². Superconductors drop R to zero below a critical temperature — the ultimate resistance story.',
        },
      ],
    },
    whatCameBefore:
      'You need current and voltage. Resistance is the ratio between them (R = V/I) — the opposition the material offers.',
    connections: [
      'Ohm’s law (V = IR ties it to voltage and current)',
      'Heating effect (resistance converts electrical energy to heat)',
      'Current (resistance shapes the flow)',
    ],
    applications: [
      'Heating elements in toasters, heaters and kettles are deliberately high-resistance wires that turn current into heat.',
      'Fuses are low-melting-point conductors that break the circuit when excessive I²R heating melts them.',
      'Resistors in every electronic circuit set currents, divide voltages, and protect components.',
    ],
    workedExamples: [
      'A kettle element carries 5.0 A at 230 V. Its resistance R = V/I = 230/5.0 = 46 Ω. The heat it produces each second is P = I²R = (5.0)² × 46 = 1150 W — a kilowatt of heat from one modest resistance.',
    ],
    analogies: [
      'Resistance is the narrow pipes and rough walls of a water system: the same water pressure (voltage) moves less water (current) the more the walls resist the flow — and the friction heats the pipes.',
    ],
    misconceptions: [
      'Resistance is not voltage — it is the opposition to current.',
      'Thicker wires have less resistance only all else equal; length and material also matter.',
      'Resistance is not always bad — it is essential for heating, lighting and control.',
    ],
    tryThis:
      'With two identical bulbs, one in series and one in parallel with a battery, compare brightness. The series arrangement adds resistance, so the bulb dims — you are directly seeing resistance plus up in action.',
    funFacts: [
      'Ohm’s law was ridiculed on publication; within two decades it was taught as a cornerstone, and the ohm became a definition unit.',
      'A superconductor’s resistance is literally zero — if you start a current in a superconducting ring it keeps flowing for years without a power source.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.ohms-law': {
    conceptId: 'lhs:phys.ohms-law',
    hook:
      'Double the voltage, double the current — if the conductor behaves. One line, V = IR, is the single most-used rule in all of electronics: the quiet law that lets us calculate everything from a torch battery to a city grid, and that instantly fails the moment a material stops behaving.',
    history:
      'Georg Simon Ohm, a German schoolteacher, published his law in 1827 in Die galvanische Kette (The Galvanic Circuit). He claimed that the current in a conductor is directly proportional to the electromotive force and inversely proportional to a factor he called resistance. The physics community of the time was unimpressed — his work was attacked by the German physicist Georg Friedrich Pohl in a widely read journal — and Ohm was so discouraged he took a leave and almost abandoned physics. Only in the 1840s, through sympathetic English and later German audiences, was his result recognised, and he was made a professor in Munich. The unit of resistance, the ohm, honours him. Ohm’s law is simple, but knowing exactly where it applies — ohmic materials, constant temperature — is what separates a formula from physics.',
    figures: [
      {
        name: 'Georg Simon Ohm',
        lifespan: '1789–1854',
        role: 'German physicist',
        contribution:
          'Established Ohm’s law, V = IR, linking voltage, current and resistance, and defined resistance.',
        statement:
          'The force of the current in a galvanic circuit is directly as the electromotive force and inversely as the resistance.',
        statementSource: 'Paraphrase of Georg Ohm, Die galvanische Kette (1827)',
      },
      {
        name: 'James Clerk Maxwell',
        lifespan: '1831–1879',
        role: 'Scottish physicist',
        contribution:
          'Set Ohm’s law into a complete electromagnetic theory and clarified its status as a constitutive relation, valid within limits.',
        statementSource: 'Paraphrase of Maxwell’s A Treatise on Electricity and Magnetism (1873)',
      },
    ],
    timeline: [
      {
        period: '1827',
        event: 'Ohm publishes V=IR; it is initially rejected.',
        figure: 'Georg Simon Ohm',
      },
      {
        period: '1840s',
        event: 'Recognition comes; the ohm is adopted as the unit of resistance.',
        figure: 'Georg Simon Ohm',
      },
      {
        period: '1873',
        event: 'Maxwell embeds the law in electromagnetic theory.',
        figure: 'James Clerk Maxwell',
      },
    ],
    perspectives: [
      {
        figure: 'Georg Ohm (1827)',
        view: 'Current is proportional to voltage for a given conductor at fixed conditions.',
        standing: 'Fundamental — for ohmic conductors',
        note: 'A constitutive relation, not a universal law.',
      },
      {
        figure: 'Non-ohmic view',
        view: 'Many devices (diodes, semiconductors, filaments) do not hold R constant.',
        standing: 'The practical extension',
        note: 'Ohm’s law is a model that applies where resistance is constant.',
      },
      {
        figure: 'James Clerk Maxwell (1873)',
        view: 'Ohm’s law is a special constitutive statement, missing in ideal conductors and fields.',
        standing: 'The mathematical consensus',
        note: 'Clarifies its true status within the broader theory.',
      },
    ],
    deepDive: {
      phenomenon: 'Where V=IR holds, and where it breaks',
      intro:
        'Ohm’s law says current through an ohmic conductor is proportional to the voltage at constant temperature. The deep-dive walks from the everyday formula to its limits and microscopic basis.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Ohm’s law says: current = voltage ÷ resistance, or V = I × R. Double the battery (voltage), double the current, if the wire does not change. A bulb, a toaster and a torch all obey it while their temperature stays put. It lets you predict: with 3 V across a 6 Ω resistor, the current is half an ampere. It is the arithmetic backbone of circuits.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'V = IR, with R constant for an ohmic conductor at constant temperature. Graph V vs I, and an ohmic conductor gives a straight line through the origin; slope is R. A filament bulb, a diode or a thermistor is non-ohmic — its R changes with temperature, light or voltage, curving the line. Ohm’s law is a model of proportionality, not a fundamental conservation law; it applies where resistance is genuinely constant.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'You use V=IR for circuit design, adding series resistances and using parallel conductance. Power P=V²/R or I²R derives from it. Practical components have tolerances and temperature coefficients; a thermistor’s resistance falls steeply with temperature, and an LDR’s with light — both exploitable sensors. Load-line analysis and Thevenin/Norton equivalents rest on the ohmic model. Exceeding a resistor’s power rating causes drift or failure.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Ohm’s law is a constitutive relation in Maxwell’s framework: J = σE (conductivity σ), the local, differential form. Significantly, it is the statement of linear response near equilibrium, derivable from the Drude–Lorentz model and, more deeply, from linear-response transport theory (Kubo formula). It fails for non-linear media, in semiconductors at high fields, under quantum coercive conditions, and in superconductors (σ → ∞). The linearity is a low-field approximation of Boltzmann transport, not a law of nature.',
        },
      ],
    },
    whatCameBefore:
      'You need voltage, current and resistance as separate ideas. Ohm’s law is the single equation binding them.',
    connections: [
      'Voltage, current, resistance (the three it links)',
      'Heating effect (power I²R)',
      'Series and parallel circuits (how R combines)',
    ],
    applications: [
      'Designing a simple LED circuit: choose the resistor so the LED current stays safe, using R = (V_supply − V_LED)/I.',
      'Sizing fuses and breakers from expected operating current.',
      'Thermistors and light-dependent resistors as temperature/light sensors read through V=IR.',
    ],
    workedExamples: [
      'A 3 V battery drives current through an 6 Ω resistor. Current I = V/R = 3/6 = 0.5 A. If you double the battery to 6 V, I = 1.0 A — double, as the law promises, because the resistance is unchanged.',
    ],
    analogies: [
      'A water pipe: voltage is the pump pressure, current the flow, resistance the pipe’s narrowness. Double the pump pressure with the same pipe and the flow doubles — a neat, proportional rule that holds while nothing clogs or heats up.',
    ],
    misconceptions: [
      'Ohm’s law does not apply to everything — only ohmic conductors with constant resistance.',
      'Resistance does not "depend on" voltage and current in an ohmic device; R is constant.',
      'Ohm’s law can fail at very high currents or for non-ohmic materials.',
    ],
    tryThis:
      'Use two identical bulbs and two batteries. Put one bulb with one battery, then the same bulb with two batteries, and note how much brighter (more current) it gets — roughly proportional, until the filament heats and the rule bends.',
    funFacts: [
      'Ohm’s discovery was judged "not worthy of review" at first, yet within two decades every electrician used it.',
      'In a graph of V vs I, the *slope* is resistance for an ohmic device — an accidental gift of the linear relation.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.heating-effect': {
    conceptId: 'lhs:phys.heating-effect',
    hook:
      'Give electricity a little resistance and it gets hot — hot enough to forge steel, boil water, or glow like the sun. The heating effect turned a laboratory curiosity into the warmth of a home, the light of a bulb, and the protection of a fuse: one idea with a thousand practical faces.',
    history:
      'The heating of conductors by current was noticed early — Humphry Davy observed it in the early 1800s. But the quantitative law is due to James Prescott Joule, who in the 1840s, in his family brewery in Manchester, ran careful experiments on electrical heating. He found the heat produced is proportional to the square of the current, the resistance, and the time: H = I²·R·t. Joule’s insistence that heat is a form of energy convertible to mechanical work was a watershed — it helped convert the old "caloric" theory into thermodynamics. The result is now called Joule’s law of heating. It is both a nuisance — every wire carrying current heats up, wasting energy — and a treasure, powering heaters, bulbs, irons, welding and fuses.',
    figures: [
      {
        name: 'Humphry Davy',
        lifespan: '1778–1829',
        role: 'English chemist',
        contribution:
          'Early 19th-century observations of electrical heating and the arc lamp showed current heats conductors dramatically.',
        statementSource: 'Paraphrase of Davy’s electrical-research notes (c. 1800s)',
      },
      {
        name: 'James Prescott Joule',
        lifespan: '1818–1889',
        role: 'English physicist and brewer',
        contribution:
          'Determined the exact law of electrical heating, H = I²Rt, and used it to establish heat as a form of energy (mechanical equivalent of heat).',
        statement:
          '…the heat evolved is proportional to the square of the current strength, to the resistance, and to the time.',
        statementSource: 'Paraphrase of James Joule, "On the Heat Evolved by Metallic Conductors" (1841)',
      },
    ],
    timeline: [
      {
        period: 'c. 1800s',
        event: 'Davy observes strong heating of current-carrying conductors.',
        figure: 'Humphry Davy',
      },
      {
        period: '1841',
        event: 'Joule publishes H = I²Rt.',
        figure: 'James Prescott Joule',
      },
      {
        period: '1843+',
        event: 'Joule measures the mechanical equivalent of heat.',
        figure: 'James Prescott Joule',
      },
    ],
    perspectives: [
      {
        figure: 'Humphry Davy (early 1800s)',
        view: 'Conductors heat strongly when current flows.',
        standing: 'Qualitative — the phenomenon was real',
        note: 'Lacked the quantitative law.',
      },
      {
        figure: 'James Joule (1841)',
        view: 'Heat = I²·R·t, and it is a form of energy capable of being converted from mechanical work.',
        standing: 'The quantitative consensus',
        note: 'One of the great results of 19th-century physics.',
      },
      {
        figure: 'Modern engineering',
        view: 'The heating effect is both a loss (I²R waste in lines) and a tool (heaters, bulbs, fuses, welding).',
        standing: 'Applied consensus',
        note: 'Designs fight it or exploit it depending on purpose.',
      },
    ],
    deepDive: {
      phenomenon: 'The I² character of electrical heating',
      intro:
        'Electrical heating is governed by H = I²Rt — Joule’s law. The deep-dive explains why the square of the current appears, and why this both wastes energy and power hugely useful devices.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'When current flows through a wire with resistance, the collisions of flowing charges turn electrical energy into heat. The heat depends on the current squared, times resistance, times time: H = I²·R·t. This is why a thin, high-resistance wire in a toaster gets hot while the thick copper supply wire stays cool. It is also why a fuse — a deliberately thin wire — melts and breaks the circuit before a fault can start a fire.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'Joule’s law: H = I²Rt (joules). Because the heat scales with I², doubling the current quadruples the heating — why safe current ratings matter enormously. In terms of power, P = I²R = V²/R. This is why high-voltage transmission lines cut losses: for fixed delivered power P, raising V lowers I, and losses drop as 1/V². A filament bulb glows because its tungsten element heats to incandescence via this effect.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'You manage I²R heating in design: conductor sizing and ampacity tables exist so wires do not overheat; fuses and breakers are sized by the I²t heating a fault delivers; industrial heaters and welding exploit the effect by design. In transformers and motors, I²R loss in coils is "copper loss," a key efficiency concern. Thermal management (heat sinks, cooling) exists because every real component dissipates I²R heat.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Microscopically, Joule heating arises from electron–lattice scattering: power density is p = J·E = σE² (or J²/σ) in local form. The I² character reflects that both the amount of charge and the rate at which it dissipates energy scale with current. In thermodynamics it irreversibly raises entropy, tying into the second law. In nanoscale and superconducting systems, Joule heating competes with ballistic or lossless transport; in the field picture, it is the Ohmic dissipation term in Poynting’s theorem.',
        },
      ],
    },
    whatCameBefore:
      'You need current and resistance. The heating effect is what happens when current flows through resistance — H = I²Rt.',
    connections: [
      'Resistance (the source of opposition that heats)',
      'Current (the flow that produces heat squared)',
      'Ohm’s law (links current and voltage, and via P = VI the heating)',
      'Energy conservation (electrical energy becomes thermal energy)',
    ],
    applications: [
      'Electric heaters, irons and kettles use a high-resistance element that converts current to useful heat.',
      'A fuse is a thin wire designed to melt by I²R heating and open the circuit on overcurrent.',
      'Incandescent bulbs (now largely replaced by LEDs) heated tungsten until it glowed.',
      'Electric welding melts metal by intense local I²R heating.',
    ],
    workedExamples: [
      'A 100 Ω heater carries 2.0 A for 300 s. Heat H = I²Rt = (2.0)² × 100 × 300 = 120,000 J. That is 120 kJ of heat in five minutes — enough to warm a large kettle of water noticeably.',
    ],
    analogies: [
      'Picture rushing water through a rough pipe: the rougher the pipe (more resistance) and the faster the flow (more current), the more the water heats from friction. Now imagine the heating grows fourfold when you simply double the flow — that is the punch of I².',
    ],
    misconceptions: [
      'Not all electrical energy becomes heat — in a bulb some becomes light, in a motor some becomes mechanical work.',
      'The heating effect is not always bad — it powers heaters, fuses and welding.',
      'Thicker wires do not heat as much as thin ones, because they have less resistance (all else equal).',
    ],
    tryThis:
      'Hold a thin wire across the terminals of a 9 V battery for a moment — it warms quickly (be careful; keep it brief). Now use a thicker wire: it heats far less. Same voltage, different resistance — the I²R effect made visible in your hand.',
    funFacts: [
      'Joule literally worked in a brewery, pouring enormous care into experiments his father’s brewery helped fund.',
      'If a domestic wire is undersized, I²R heating can soften its insulation — a major cause of electrical fires, which is why fuses and correct sizing are life-safety matters.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.electromagnetic-induction': {
    conceptId: 'lhs:phys.electromagnetic-induction',
    hook:
      'A magnet waved near a coil makes electricity with no battery and no wire touching the magnet. It was the discovery that lit the modern world — for without electromagnetic induction, there would be no power stations, no transformers, no wireless charging, no microphone, and most of the grid would be fantasy.',
    history:
      'The story begins with two rival giants. In 1820, Hans Christian Ørsted found that a current deflects a compass needle, showing electricity makes magnetism. Michael Faraday, a self-taught former bookbinder’s apprentice, wanted the reverse: can magnetism make electricity? In August 1831 he succeeded, moving a magnet in and out of a coil and seeing a momentary current. Independently, Joseph Henry in America reached the same result around the same time. Faraday expressed his discovery in terms of "lines of force" cutting a conductor. A decade later in 1845, Franz Neumann and (later) J.J. Thomson based it on magnetic flux, giving the quantitative law we know: the induced emf equals the negative rate of change of magnetic flux. The "minus" sign was given clear physical meaning by Heinrich Lenz — it tells the induced current to oppose the change that caused it, a consequence of energy conservation.',
    figures: [
      {
        name: 'Hans Christian Ørsted',
        lifespan: '1777–1851',
        role: 'Danish physicist',
        contribution:
          'Discovered in 1820 that an electric current deflects a compass needle — the first experimental link between electricity and magnetism.',
        statement:
          'The conductor must therefore be surrounded by the same conflict of forces as the magnet.',
        statementSource: 'Paraphrase of Ørsted’s announcement (1820)',
      },
      {
        name: 'Michael Faraday',
        lifespan: '1791–1867',
        role: 'British scientist',
        contribution:
          'Discovered electromagnetic induction in 1831: a changing magnetic field induces a current in a nearby conductor. Also opposed action at a distance with field ideas.',
        statement:
          'Electricity can be produced by common magnetism.',
        statementSource: 'Paraphrase of Michael Faraday, diary entry (Aug–Oct 1831)',
      },
      {
        name: 'Joseph Henry',
        lifespan: '1797–1878',
        role: 'American physicist',
        contribution:
          'Independently discovered self- and mutual induction around 1830–1831. The unit of inductance, the henry, bears his name.',
        statementSource: 'Paraphrase of Henry’s electromagnetism research (1830s)',
      },
      {
        name: 'Heinrich Lenz',
        lifespan: '1804–1865',
        role: 'Estonian-German physicist',
        contribution:
          'Formulated Lenz’s law (1834): the induced current opposes the change of flux that produced it.',
        statement:
          'The direction of the induced current is such that it opposes the change that caused it.',
        statementSource: 'Paraphrase of Lenz’s law (1834)',
      },
    ],
    timeline: [
      {
        period: '1820',
        event: 'Ørsted links current and magnetism.',
        figure: 'Hans Christian Ørsted',
      },
      {
        period: '1831',
        event: 'Faraday (and, independently, Henry) discover electromagnetic induction.',
        figure: 'Michael Faraday; Joseph Henry',
      },
      {
        period: '1834',
        event: 'Lenz formulates his law for the direction of induced current.',
        figure: 'Heinrich Lenz',
      },
      {
        period: '1845',
        event: 'Neumann gives the flux/rate form; induction is quantified.',
        figure: 'Franz Neumann',
      },
    ],
    perspectives: [
      {
        figure: 'Michael Faraday (1831)',
        view: 'A changing magnetic field induces a current; describe it by "lines of force".',
        standing: 'The empirical discovery',
        note: 'Faraday’s field picture proved prophetic.',
      },
      {
        figure: 'Joseph Henry (1831)',
        view: 'Induction is real and mutual; self-induction of a single coil also occurs.',
        standing: 'Independent corroboration and extension',
        note: 'The henry (unit of inductance) is named for him.',
      },
      {
        figure: 'Flux/rate formulation (Neumann, Lenz)',
        view: 'ε = −dΦ/dt, with Lenz’s sign enforcing energy conservation.',
        standing: 'The quantitative consensus — Faraday’s law',
        note: 'The "−" is not cosmetic; it is physics.',
      },
    ],
    deepDive: {
      phenomenon: 'How a changing magnetic field makes voltage',
      intro:
        'Electromagnetic induction is the production of an emf by a changing magnetic flux, ε = −dΦ/dt. The deep-dive explains flux, the minus sign, and how this powers generators, transformers and charging.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Move a magnet in and out of a coil of wire and a current appears — but only while the magnet is moving. That is electromagnetic induction: a changing magnetic field pushes electrons around. Stop moving the magnet and nothing happens; what matters is the change. This is why power stations spin giant coils past magnets, and why your wireless charging pad works — it waves a field and your phone’s coil catches the change.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'The induced emf ε = −dΦ/dt (Faraday’s law), where Φ is magnetic flux, Φ = BAcosθ. A *changing* flux (by moving magnet, rotating coil, or changing field) is required — a stationary magnet or constant flux induces nothing. Lenz’s law says the induced current’s magnetic field opposes the change, which is why pushing a magnet into a coil is harder than pulling it out — that "resistance to change" is the cost of conservation of energy.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'Generators and transformers run on induction. A generator spins a coil in a magnetic field, producing AC at ε = −N·dΦ/dt (N turns). Transformers step voltage by changing flux in a shared core: V_s/V_p = N_s/N_p. Induced emf opposes changes via self-inductance (L·dI/dt), which affects switching and transients. Wireless charging, induction cooktops, microphones and dynamos all exploit the same law; eddy currents in cores waste energy and are reduced by laminated cores.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Faraday’s law is ∇×E = −∂B/∂t — one of Maxwell’s equations — showing a time-varying magnetic field *is* a source of circulating electric field. Its integral form, ∮E·dl = −dΦ/dt, unifies motional and transformer emf. The flux rule is a relativistically emergent statement: what is "motion" in one frame is "changing B" in another, tied together by Lorentz transformations of the field. Lenz’s sign is the electromagnetic manifestation of energy conservation; the energy is exchanged between mechanical and electromagnetic form.',
        },
      ],
    },
    whatCameBefore:
      'You need magnetic fields and flux, plus the earlier idea that current makes a field (Ørsted). Induction is the reverse: a changing field makes current.',
    connections: [
      'Magnetic flux (the quantity whose change drives induction)',
      'Generators (induction converted to use)',
      'Electromagnetism (the unification induction relies on)',
      'Lenz’s law (the governing sign)',
    ],
    applications: [
      'Power station generators produce nearly all the world’s electricity through induction.',
      'Transformers step voltage up for transmission and down for use — the grid runs on induction.',
      'Induction cooktops and wireless chargers transfer energy without contact.',
      'A bicycle dynamo lights a lamp because a rotating magnet induces current in a coil.',
    ],
    workedExamples: [
      'A coil of 200 turns and area 0.01 m² sits in a field whose flux Φ changes from 0 to 5×10⁻³ Wb in 0.5 s. Induced emf ε = |ΔΦ/Δt| = N·|ΔΦ/Δt| = 200 × (5×10⁻³/0.5) = 200 × 0.01 = 2 V. Spin it faster and the voltage rises — which is exactly how a generator sets its output.',
    ],
    analogies: [
      'Induction is the push you feel when you row through still water as it moves under you: what matters is that the water (flux) is *changing* past the oars (coil). Constant water, no push; moving water, push.'
    ],
    misconceptions: [
      'A stationary magnet near a coil does not induce current — the field must be *changing*.',
      'Induced voltage depends on the rate of change of flux, not just field strength.',
      'The induced current is not free energy — Lenz’s law means you must do work to change the flux (energy in, energy out).',
    ],
    tryThis:
      'Wrap ~30 turns of insulated wire around a thick pen, connect the ends to a sensitive LED or galvanometer, and thrust a bar magnet through the coil. The LED blinks as the magnet moves — reverse the polarity and it blinks the other way. Motion in, light out: induction in your hand.',
    funFacts: [
      'Faraday had only elementary schooling; his great discovery came from relentless experiment, not formal theory.',
      'If not for induction, the world would need a chemical battery for every light — the entire electric grid depends on a magnet waving near a coil somewhere.',
    ],
    estimatedTimeMinutes: 17,
  },

  'lhs:phys.electric-motor': {
    conceptId: 'lhs:phys.electric-motor',
    hook:
      'Feed current into a loop of wire in a magnetic field and the loop turns — that is the entire secret of every motor on Earth, from a toy propeller to a high-speed train. Magnetism and moving charge, given one simple arrangement, become the machinery that moves the modern world.',
    history:
      'Motors trace directly to the discoveries of Ørsted (1820, current deflecting a needle) and Faraday. Faraday built the first primitive electromagnetic motor device in 1821 — a wire that rotated around a magnet in a dish of mercury — demonstrating that a current-carrying conductor feels a force in a magnetic field. In 1822 and after, inventors began turning this into useful machines. The Hungarian physicist Ányos Jedlik built an early electric motor with a commutator in the 1820s–30s. By the 1880s, with the spread of electrical power, electric motors drove trams, factories and household appliances, and they have only grown in importance with automotive and industrial electrification.',
    figures: [
      {
        name: 'Michael Faraday',
        lifespan: '1791–1867',
        role: 'British scientist',
        contribution:
          'Built the first motor-like device in 1821, showing a current-carrying wire experiences a force in a magnetic field.',
        statementSource: 'Paraphrase of Faraday’s electromagnetic-rotation experiment (1821)',
      },
      {
        name: 'Ányos Jedlik',
        lifespan: '1800–1895',
        role: 'Hungarian inventor and engineer',
        contribution:
          'Built an early electric motor with a commutator in the late 1820s–1830s, anticipating later DC machines.',
        statementSource: 'Paraphrase of Jedlik’s motor demonstrations (1830s)',
      },
      {
        name: 'Nikola Tesla',
        lifespan: '1856–1943',
        role: 'Serbian-American inventor and engineer',
        contribution:
          'Developed the polyphase induction motor and AC power system that became the basis of modern motor-driven industry.',
        statementSource: 'Paraphrase of Tesla’s AC motor patents (1887–1888)',
      },
    ],
    timeline: [
      {
        period: '1820',
        event: 'Ørsted links current and magnetism.',
        figure: 'Hans Christian Ørsted',
      },
      {
        period: '1821',
        event: 'Faraday builds a rotating-wire motor.',
        figure: 'Michael Faraday',
      },
      {
        period: '1830s',
        event: 'Jedlik builds an early motor with a commutator.',
        figure: 'Ányos Jedlik',
      },
      {
        period: '1887–1888',
        event: 'Tesla patents the polyphase induction motor; AC motors become standard.',
        figure: 'Nikola Tesla',
      },
    ],
    perspectives: [
      {
        figure: 'Michael Faraday (1821)',
        view: 'A current-carrying conductor in a magnetic field feels a force — the seed of the motor.',
        standing: 'The founding discovery',
        note: 'His rotation device was a working embryo of the motor.',
      },
      {
        figure: 'Ányos Jedlik (1830s)',
        view: 'A commutator can keep a coil rotating continuously.',
        standing: 'Early pioneering engineering',
        note: 'Independent of (and partly before) later DC-motor work.',
      },
      {
        figure: 'Nikola Tesla (1887–1888)',
        view: 'Rotating magnetic fields from multiphase AC give simple, robust induction motors.',
        standing: 'The industrial standard',
        note: 'His polyphase system powers industry worldwide.',
      },
    ],
    deepDive: {
      phenomenon: 'Why a coil in a magnetic field turns',
      intro:
        'An electric motor converts electrical energy into mechanical energy using the magnetic force on a current-carrying conductor (F = BIL sinθ). The deep-dive explains torque, the commutator, and the differences between motor types.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'A current-carrying wire in a magnetic field experiences a force. Put that wire in a coil, spin it with a commutator (which flips the current at the right moments) and the coil keeps turning — that is a motor. Motors convert electrical energy into mechanical energy to turn fans, wheels and drills. They never "create" energy — they change it from electricity into motion, with some heat wasted.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'The force on a straight conductor is F = BIL sinθ (Fleming’s left-hand rule). In a loop, opposite sides get opposite forces, producing a torque τ = BIA cosθ·(N turns) that rotates the loop. A commutator reverses the current as the loop passes vertical, keeping rotation continuous. The motor back-emf (from induction) rises with speed, which limits current — that is why a stalled motor draws large current.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'You classify motors as DC (brushed, brushless) and AC (synchronous, induction). Torque ∝ BIA; speed is governed by back-emf and supply. The induction motor’s stator field rotates and drags the rotor — Tesla’s design. Efficiency, torque–speed curves, and control (PWM, variable-frequency drives) dominate modern design. Motors are specified by power P, torque, and efficiency; I²R and back-emf losses matter.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'The motor force is the Lorentz force q(v×B) integrated over the conduction electrons in the wire — not a new force but electromagnetism’s action on moving charge. Torque on a coil is the cross product of the magnetic moment μ = NIA with B: τ = μ×B. In an induction motor, the rotating field creates slip-dependent eddy currents that produce torque. Relativistically, the "magnetic" force on the wire is an electric force seen in a different frame, per special relativity. Energy conversion obeys the full Maxwell/Poynting balance.',
        },
      ],
    },
    whatCameBefore:
      'You need magnetic fields, current-carrying conductors, and the force on a moving charge. A motor arranges that force to turn.',
    connections: [
      'Magnetic field (provides the force)',
      'Current (the moving charge that feels the force)',
      'Electromagnetic induction (the back-emf that balances the motor)',
      'Electromagnetism (the unifying idea)',
    ],
    applications: [
      'Fans, refrigerators, washing machines and power tools all run on electric motors.',
      'Electric vehicles and trains use large motors for propulsion.',
      'A tiny motor spins a drone’s rotors or a phone’s vibration.',
    ],
    workedExamples: [
      'A 0.2 m conductor carrying 5 A sits at right angles in a 0.4 T field. Force F = BIL sin90° = 0.4 × 5 × 0.2 = 0.4 N. Around a coil of 50 turns that force becomes torque to spin the shaft — modest, but multiplied by turns and current it becomes real machine power.',
    ],
    analogies: [
      'The coil is a rower’s oars: the magnetic field is the water, current is the push timing. The commutator is the coxswain that flips the oar stroke at the right moment so the boat (shaft) keeps moving forward.',
    ],
    misconceptions: [
      'Motors do not create energy — they convert electrical energy to mechanical energy, with some heat loss.',
      'Motors do not operate by electrostatic repulsion; they use magnetic forces on current-carrying conductors.',
      'A motor is essentially the reverse of a generator — a hint that the two are one family.',
    ],
    tryThis:
      'Wrap a few turns of wire into a little loop with leads, hang it between two magnets, and feed a small current through — the loop will kick (a tiny homopolar/motor demo). Reverse the current and it kicks the other way: you have built Faraday’s first motor insight.',
    funFacts: [
      'Faraday’s first motor was a wire rotating around a magnet in a dish of mercury — almost no moving parts, yet the ancestor of every engine in a modern home.',
      'Electric motors are strikingly efficient — modern ones exceed 90%, far better than the ~30% of a petrol engine.',
    ],
    estimatedTimeMinutes: 16,
  },
};