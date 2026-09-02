/**
 * Batch 6 — senior-secondary waves/optics, thermo and modern/nuclear narratives.
 *
 * Authored to the Master-Reviewer rubric (docs/guides/task-playbooks/narration/):
 * story-shaped prose, real people with recorded words + sources, a historical
 * timeline, respected/differing views given due weight, and a deep-dive that scales
 * Curious → Enthusiast → Professional → Nerd. Canonical facts stay consistent with the
 * vendored STEMMA export.
 */
import type { NarrativeContent } from '@stem-tuition/content-provider';

export const NARRATIVES_BATCH6: Record<string, NarrativeContent> = {
  'lhs:phys.wave': {
    conceptId: 'lhs:phys.wave',
    hook:
      'A ripple crosses a pond while the water merely bobs; a shout crosses a room while the air stays put. Something travels, yet nothing rides along with it. That restless, self-propagating disturbance — a wave — is how sound, light, music and Wi-Fi all reach us.',
    history:
      'The idea that energy travels without matter dates to careful observation of water and string. In the 1700s, Christiaan Huygens proposed that light itself is a wave spreading in all directions from every point, and in 1800–1804 Thomas Young’s double-slit experiment demonstrated interference — the decisive wave signature — for light. For sound, Hermann von Helmholtz and others built the wave theory of acoustics in the 1800s. Newton, remarkably, had championed a particle (corpuscular) theory of light, and the two views fought for over a century. By the time James Clerk Maxwell showed in 1865 that light is an electromagnetic wave, the wave picture had won — and it was perfected later by the quantum theory, where waves and particles are two faces of one deeper reality.',
    figures: [
      {
        name: 'Christiaan Huygens',
        lifespan: '1629–1695',
        role: 'Dutch physicist and mathematician',
        contribution:
          'Proposed the wave theory of light and the principle that every point on a wavefront is a source of new wavelets (Huygens’ principle).',
        statement:
          'Light propagates … by the successive spherical waves emitted from each point of the medium.',
        statementSource: 'Paraphrase of Christiaan Huygens, Treatise on Light (1690)',
      },
      {
        name: 'Thomas Young',
        lifespan: '1773–1829',
        role: 'English polymath',
        contribution:
          'Demonstrated the interference of light with his double-slit experiment (c. 1801), giving decisive evidence for the wave nature of light.',
        statement:
          'The experiments … are such as to make it very probable that light is a wave.',
        statementSource: 'Paraphrase of Thomas Young’s Bakerian lectures (1801–1803)',
      },
      {
        name: 'James Clerk Maxwell',
        lifespan: '1831–1879',
        role: 'Scottish physicist',
        contribution:
          'Showed light is an electromagnetic wave travelling at c, unifying light, radio and radiant energy in one theory.',
        statement:
          'Light itself … we may hope to explain by this theory. Light is an electromagnetic wave.',
        statementSource: 'Paraphrase of James Clerk Maxwell, A Dynamical Theory of the Electromagnetic Field (1865)',
      },
    ],
    timeline: [
      {
        period: '1690',
        event: 'Huygens publishes the wave theory of light.',
        figure: 'Christiaan Huygens',
      },
      {
        period: 'c. 1801',
        event: 'Young demonstrates interference of light (double slit).',
        figure: 'Thomas Young',
      },
      {
        period: '1865',
        event: 'Maxwell shows light is an electromagnetic wave.',
        figure: 'James Clerk Maxwell',
      },
      {
        period: 'early 1900s',
        event: 'Quantum theory reconciles wave and particle pictures.',
        note: 'Both are now understood as facets of a deeper whole.',
      },
    ],
    perspectives: [
      {
        figure: 'Isaac Newton (corpuscular model)',
        view: 'Light is a stream of tiny particles (corpuscles).',
        standing: 'Downplayed but partially revived by quantum theory',
        note: 'Newton was persuasive; experiment eventually preferred waves — until photons.',
      },
      {
        figure: 'Christiaan Huygens (1690)',
        view: 'Light is a wave spreading from every point.',
        standing: 'Correct for classical optics',
        note: 'Explained reflection, refraction and diffraction.',
      },
      {
        figure: 'Modern quantum view',
        view: 'Light and matter exhibit both wave and particle behaviour; the wavefunction is probability.',
        standing: 'The current consensus',
        note: 'The wave–particle duality unifies the old debate.',
      },
    ],
    deepDive: {
      phenomenon: 'What a wave is, and how it carries energy without matter',
      intro:
        'A wave is a disturbance that transfers energy and information without permanently displacing the medium. The deep-dive distinguishes wave and matter transport and the two main wave types.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'A wave is a moving disturbance — a pulse of energy — that travels through a medium (or space) without carrying matter along. Drop a stone and the ripple spreads; the water itself mostly bobs up and down. Waves carry energy and information. Sound is a wave in air; light is a wave in empty space. A wave has a speed, a frequency (how often it bobs), a wavelength (the distance between crests) and an amplitude (how big the disturbance is).',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'Waves are transverse (particles move perpendicular to travel, as on a string) or longitudinal (parallel, as in sound). Characteristic quantities: amplitude A (energy ∝ A²), wavelength λ, frequency f, and speed v = fλ. A wave transfers energy and momentum; the medium oscillates about equilibrium but does not translate with the wave. Interference, diffraction and reflection are wave signatures. Electromagnetic waves need no medium; mechanical waves (sound, water) do.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and applied scientists',
          body:
            'You work with wave fundamentals in acoustics, optics, RF/communications, seismic analysis and vibration. The wave equation, superposition and Fourier decomposition underpin signal analysis and design. Impedance matching, reflection coefficients and transmission-line theory all derive from waves. For EM waves, c = fλ with frequency set by the source and λ changing in different media. Undersea cables, antennas, loudspeakers and ultrasound transducers are engineered around wave physics.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Waves satisfy the wave equation, ∂²ψ/∂t² = v²∇²ψ, with many solutions in modes. Quantum mechanics generalises to matter waves: the de Broglie relation λ = h/p and the Schrödinger equation treat particles as waves of probability. EM waves are solutions of Maxwell’s equations; photons are their quanta. Superposition, standing waves, dispersion (v depends on λ) and group vs phase velocity are advanced essentials. Wave packets localise energy where phase velocity differs from group velocity — the physics behind pulses in fibre and matter waves in electron microscopy.',
        },
      ],
    },
    whatCameBefore:
      'You need oscillation/period and frequency. A wave is just an oscillation that travels, carrying energy.',
    connections: [
      'Frequency, wavelength and wave-speed (v = fλ)',
      'Sound and light (specific waves)',
      'Energy (waves carry it with no net matter transport)',
    ],
    applications: [
      'Radio, mobile phones and Wi-Fi transmit by modulating electromagnetic waves.',
      'Ultrasound imaging uses high-frequency sound waves that echo off tissues.',
      'Seismology reads earthquake waves to map Earth’s interior.',
    ],
    workedExamples: [
      'A wave has frequency 500 Hz and wavelength 0.68 m in air. Speed v = fλ = 500 × 0.68 = 340 m/s — close to the speed of sound. Change the medium and λ changes, but if the source is fixed, f stays the same.',
    ],
    analogies: [
      'Shake one end of a rope: the kink runs along the rope, but the rope’s strands only jump up and down. The kink is the wave; the strands are the medium that stays put.',
    ],
    misconceptions: [
      'Waves do not carry matter — they carry energy; the medium oscillates in place.',
      'Not all waves need a medium — electromagnetic waves travel through vacuum.',
      'Waves do not always travel in straight lines — they diffract and refract.',
    ],
    tryThis:
      'Tie one end of a long rope to a table leg and flick the other end sideways. A pulse runs down and back — watch that a single rope piece just moves sideways while the pulse covers the whole length: energy travels, matter does not.',
    funFacts: [
      'The wave theory of light was briefly rejected because Nature "disliked" a double-slit explanation — until Young’s experiment made it undeniable.',
      'The same wave equation that models a guitar string also appears, with extensions, in qubits and quantum field theory.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.wavelength': {
    conceptId: 'lhs:phys.wavelength',
    hook:
      'Red light and blue light differ in one way: the distance between their crests. That small "wavelength" — a fraction of a micrometre — decides what colour you see, what pitch you hear, and how far a radio signal can reach.',
    history:
      'Wavelength became the key to measuring waves once it was clear that light and sound are wave phenomena. Thomas Young measured the wavelengths of coloured light by interference in the early 1800s — an astonishing achievement, since a light wave crest can be a ten-thousandth of a millimetre apart. Joseph von Fraunhofer mapped dark lines across the solar spectrum, launching spectroscopy where wavelength identifies substances. By the 1800s, the visible range (about 400–700 nanometres) was well known, and wavelength tied colours of light and pitches of sound to a single measurable number.',
    figures: [
      {
        name: 'Joseph von Fraunhofer',
        lifespan: '1787–1826',
        role: 'German optician and physicist',
        contribution:
          'Mapped the dark absorption lines (Fraunhofer lines) of the solar spectrum, launching wavelength-resolved spectroscopy.',
        statementSource: 'Paraphrase of Fraunhofer’s spectral measurements (1814–1817)',
      },
      {
        name: 'Anders Ångström',
        lifespan: '1814–1874',
        role: 'Swedish physicist',
        contribution:
          'Produced precise wavelength tables of atomic spectral lines; the ångström unit (10⁻¹⁰ m) is named for him.',
        statementSource: 'Paraphrase of Ångström’s wavelength work (1868)',
      },
    ],
    timeline: [
      {
        period: 'c. 1801',
        event: 'Young measures light wavelengths via interference.',
        figure: 'Thomas Young',
      },
      {
        period: '1814–1817',
        event: 'Fraunhofer maps spectral lines.',
        figure: 'Joseph von Fraunhofer',
      },
      {
        period: '1868',
        event: 'Ångström publishes precise wavelength tables.',
        figure: 'Anders Ångström',
      },
    ],
    perspectives: [
      {
        figure: 'Thomas Young (c. 1801)',
        view: 'The wavelength of light is measurable from interference fringes.',
        standing: 'Foundational measurement',
        note: 'Established wavelength as a physical quantity for optics.',
      },
      {
        figure: 'Spectroscopists (Fraunhofer, Ångström)',
        view: 'Wavelength is the fingerprint with which to identify matter.',
        standing: 'The practical consensus',
        note: 'Every element leaves its own wavelength pattern.',
      },
      {
        figure: 'de Broglie / quantum view',
        view: 'Wavelength belongs to particles too: λ = h/p.',
        standing: 'Modern quantum consensus',
        note: 'The wavelength idea extends to matter.',
      },
    ],
    deepDive: {
      phenomenon: 'The distance between wave crests and what it controls',
      intro:
        'Wavelength (λ) is the distance between two consecutive points in phase — crest to crest. Together with speed and frequency it satisfies v = fλ. The deep-dive explains why λ matters for sound, light and even matter.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Wavelength is the distance between one wave crest and the next. A long wavelength means a stretched-out, low-frequency wave; short wavelength means a tight, high-frequency one. In sound, longer wavelength is a lower pitch; in light, longer wavelength is redder and shorter is bluer. It is measured in metres, but light wavelengths are tiny — a few hundred nanometres, or a hundred-thousandth of a millimetre.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'λ is the spatial period of a wave, linked to speed and frequency by v = fλ. For a fixed medium and wave type, f and λ are inversely related: double the frequency, halve the wavelength (v constant). Sound: λ = v/f. Light: λ = c/f. The visible range roughly 400 (violet) to 700 nm (red). Skin-depth, diffraction and antenna sizing all depend on λ.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'Antenna length and cable sizing scale with wavelength: a half-wave dipole is ~λ/2. Fibre optics, Bragg gratings and optical filters select specific λ. In acoustics, room modes and speaker design involve wavelengths of metres; in RF, millimetres to kilometres. Resolution and imaging are fundamentally set by λ (diffraction limit). Spectrometers identify materials by their emission/absorption λ.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'λ relates to wavenumber k = 2π/λ, the spatial frequency in Fourier optics. In quantum mechanics, de Broglie’s λ = h/p means wavelength measures momentum; a confined wave’s λ shapes energy levels. Photon energy E = hf = hc/λ: shorter λ is higher energy, hence gamma vs radio. Interferometry resolves distances far below λ, and modern frequency combs tie optical λ to atomic clocks.',
        },
      ],
    },
    whatCameBefore:
      'You need the idea of a wave and its frequency. Wavelength is the companion quantity linked by v = fλ.',
    connections: [
      'Wave-speed (v = fλ) and frequency',
      'Sound (pitch from wavelength)',
      'Light (colour from wavelength)',
      'Energy (for photons, E = hc/λ)',
    ],
    applications: [
      'Spectrometers read the wavelengths of light from stars and materials to identify what is there.',
      'Radio antennas are sized to the wavelength of the broadcast.',
      'Ultrasound resolution depends on the acoustic wavelength.',
    ],
    workedExamples: [
      'A sound wave of frequency 500 Hz in air (v ≈ 340 m/s) has wavelength λ = v/f = 340/500 = 0.68 m. Its neighbour at 1000 Hz squeezes to 0.34 m — higher pitch, shorter wavelength, same speed.',
    ],
    analogies: [
      'Wavelength is the distance between fence posts: the same speed of walking sets the rhythm (frequency) by how far apart the posts are. Closer posts — shorter wavelength — mean a faster rhythm, higher pitch.',
    ],
    misconceptions: [
      'Wavelength is not the wave’s height — that is amplitude.',
      'The wavelength of a wave can be kilometres (radio) or fractions of a nanometre (gamma rays).',
      'Wavelength is not fixed by the source alone — it changes with the medium at constant frequency.',
    ],
    tryThis:
      'Dip your finger in still water at different rates. Slow pokes give widely spaced ripples (long wavelength); fast pokes give tight ripples (short wavelength) — the ripple spacing is literally visible wavelength.',
    funFacts: [
      'The ångström unit, named from a surname, is 10⁻¹⁰ m — about the size of an atom’s width, and the unit of choice for optical wavelengths.',
      'Your eye can separate two things only when they are much farther apart than the wavelength of the light it sees — that is the diffraction limit of vision.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.frequency': {
    conceptId: 'lhs:phys.frequency',
    hook:
      'Press the middle C of a piano and the air pulses 261 times a second; tune to a station and the radio receives a million pulses a second. There is no colour in a wave and no tone in air alone — frequency is the invisible metronome that turns one vibration into a note and another into a colour.',
    history:
      'The quantitative study of frequency began with music. In the 1600s, Marin Mersenne measured the frequencies of musical notes and linked pitch to the rate of vibration. Then, in 1861, Albert A. Michelson began precise measurements of the speed of light; later, physicists tied frequency to light. In the 20th century, the development of radio and electronics made frequency a central tool, and the idea of resonance (Heinrich Hertz demonstrating radio waves in 1888) depended on tuning to frequency. Today the hertz (one cycle per second) is the SI unit named for Hertz, and the definition of the second itself is tied to a specific atomic frequency.',
    figures: [
      {
        name: 'Marin Mersenne',
        lifespan: '1588–1648',
        role: 'French theologian and mathematician',
        contribution:
          'Was among the first to quantify the frequency of sound and relate pitch to the vibration rate.',
        statementSource: 'Paraphrase of Mersenne’s Harmonice Universelle (1636)',
      },
      {
        name: 'Heinrich Hertz',
        lifespan: '1857–1894',
        role: 'German physicist',
        contribution:
          'Generated and detected electromagnetic radio waves in 1888, confirming Maxwell’s theory; the hertz (Hz) is named for him.',
        statement:
          'We can produce … electric and magnetic fields spreading out as waves and moving with the speed of light.',
        statementSource: 'Paraphrase of Heinrich Hertz’s radio-wave experiments (1888)',
      },
    ],
    timeline: [
      {
        period: '1636',
        event: 'Mersenne measures sound frequencies and their link to pitch.',
        figure: 'Marin Mersenne',
      },
      {
        period: '1865',
        event: 'Maxwell writes light as an electromagnetic oscillation.',
        figure: 'James Clerk Maxwell',
      },
      {
        period: '1888',
        event: 'Hertz generates and detects radio waves.',
        figure: 'Heinrich Hertz',
      },
    ],
    perspectives: [
      {
        figure: 'Marin Mersenne (1636)',
        view: 'Pitch corresponds to a measurable number of vibrations per second.',
        standing: 'Foundational for acoustics',
        note: 'Frequency became measurable.',
      },
      {
        figure: 'Heinrich Hertz (1888)',
        view: 'Electromagnetic oscillations of definite frequency propagate as waves.',
        standing: 'The experimental basis',
        note: 'Confirmed Maxwell and opened wireless.',
      },
      {
        figure: 'Modern metrology',
        view: 'Time and frequency are measured to extraordinary precision (atomic clocks); the hertz defines the second.',
        standing: 'The current consensus',
        note: 'Frequency is the most precisely known physical quantity.',
      },
    ],
    deepDive: {
      phenomenon: 'The beat of a wave, and what it controls',
      intro:
        'Frequency (f) is the number of complete cycles per second (Hz), f = 1/T. The deep-dive explains how frequency sets sound pitch, light colour and energy, and how it is measured to atomic precision.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Frequency is how many times a wave repeats in one second, measured in hertz (Hz). One hertz is one cycle per second. Higher frequency means a faster wiggle: it makes sound higher-pitched and light bluer (toward violet). Middle C of a piano is about 261 Hz — its air pulses 261 times a second. Frequency is set by the source; when a wave crosses into a new material, its speed and wavelength change but its frequency does not.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'f = 1/T, where T is the period. The wave relation v = fλ ties frequency to speed and wavelength. Pitch of sound ∝ f (higher f, higher pitch); light colour ∝ f (higher f, toward violet and UV). Photon energy E = hf is directly proportional to frequency. AC mains is typically 50 or 60 Hz; FM broadcast is ~88–108 MHz; visible light is ~4–8×10¹⁴ Hz.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'Frequency is central to RF, acoustics and instrumentation. You design around carrier frequencies, use frequency analysis (FFT) for signals, and rely on resonance: a system driven near its natural frequency resonates, as in tuning circuits. Doppler shift quantifies motion via frequency change. Atomic clocks exploit hyperfine transition frequencies near 9.19 GHz for the caesium second. Spectrum allocation (licensed bands) is frequency management.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Frequency is the time-rate of a harmonic component; in Fourier analysis any signal is a sum of frequencies. In quantum mechanics, f relates to energy E = hf and angular frequency ω = 2πf to energy via E = ħω. The caesium hyperfine frequency defines the SI second. In relativistic contexts, frequency Doppler-shifts with motion and gravitational potential — the physics behind GPS time corrections. Frequency combs measure optical frequencies of ~10¹⁴ Hz to many digits, connecting them to the atomic-clock microwave standard.',
        },
      ],
    },
    whatCameBefore:
      'You need period (time for one cycle). Frequency is its reciprocal, f = 1/T — the "how often" of a wave.',
    connections: [
      'Period (T = 1/f)',
      'Wave-speed and wavelength (v = fλ)',
      'Sound pitch and light colour',
      'Energy (E = hf for photons)',
    ],
    applications: [
      'Radio and mobile-phone channels are separated by assigned frequencies.',
      'Ultrasound imaging uses frequencies of million-hz and above.',
      'Musical tuning sets instrument frequencies; atomic clocks keep time by frequency.',
    ],
    workedExamples: [
      'A pendulum completes 30 swings in 60 s. Frequency f = 30/60 = 0.5 Hz; period T = 1/f = 2 s — one full swing every two seconds. Radio stations broadcast at, say, 97.5 MHz = 97,500,000 cycles per second.',
    ],
    analogies: [
      'Frequency is how fast a drummer’s hand beats: the same tap count per second yields a rhythm, and each wave is one tap. Tune the tap rate and you change the musical note of the whole performance.',
    ],
    misconceptions: [
      'Higher frequency means shorter wavelength, not larger waves.',
      'Frequency is set by the source and does not change when a wave enters a denser medium — only speed and wavelength change.',
      'Frequency is not the same as pitch by a loose rule — pitch follows f directly.',
    ],
    tryThis:
      'Hum a low note, then a high note, while watching a candle flame barely move. You are generating different frequencies of air vibration — the pitch you hear is literally the number of air pulses per second.',
    funFacts: [
      'The hertz was named only in the 20th century, in Heinrich Hertz’s honour, and is now the unit that defines the SI second.',
      'Middle C is not 256 Hz but ~261.6 Hz on modern tuning — a history of tuning standards baked into the number.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.amplitude': {
    conceptId: 'lhs:phys.amplitude',
    hook:
      'Shout and whisper: same pitch, same wavelength — yet one rattles windows and the other barely stirs air. The difference you actually hear is amplitude, the bigness of the wave. It is the loudness of sound, the brightness of light, and the energy that a wave truly carries.',
    history:
      'The idea that a wave’s "size" — its amplitude — determines its energy grew with the mathematical theory of waves. Christiaan Huygens tracked amplitude in his wave geometry, and by the 1800s Helmholtz and others showed acoustic energy scales with the square of amplitude. In optics, the intensity of light was shown to be proportional to the square of the electric-field amplitude. Today amplitude modulation (AM) radio literally encodes information in the amplitude of a carrier wave, a technique first developed in the early 1900s.',
    figures: [
      {
        name: 'Hermann von Helmholtz',
        lifespan: '1821–1894',
        role: 'German physicist and physiologist',
        contribution:
          'Developed the mathematical theory of sound and waves, connecting amplitude and energy in acoustics and colour vision.',
        statementSource: 'Paraphrase of Helmholtz, On the Sensations of Tone (1863)',
      },
      {
        name: 'Reginald Fessenden',
        lifespan: '1866–1932',
        role: 'Canadian-American inventor',
        contribution:
          'Pioneered amplitude modulation (AM) radio, encoding a voice signal in a carrier wave’s amplitude.',
        statementSource: 'Paraphrase of Fessenden’s radio transmission work (early 1900s)',
      },
    ],
    timeline: [
      {
        period: '1690',
        event: 'Huygens uses wave geometry that tracks amplitude.',
        figure: 'Christiaan Huygens',
      },
      {
        period: '1863',
        event: 'Helmholtz connects wave amplitude to acoustic energy.',
        figure: 'Hermann von Helmholtz',
      },
      {
        period: 'early 1900s',
        event: 'AM radio encodes information in amplitude.',
        figure: 'Reginald Fessenden',
      },
    ],
    perspectives: [
      {
        figure: 'Classical wave theory',
        view: 'Amplitude is the maximum displacement; energy is proportional to amplitude squared.',
        standing: 'The mechanical consensus',
        note: 'Holds for mechanical and EM waves in their classical range.',
      },
      {
        figure: 'Quantum/optics view',
        view: 'For light, intensity ∝ A² is realised as photon flux; the wave amplitude is the field strength.',
        standing: 'The quantum consensus',
        note: 'Amplitude and photon number relate through the field.',
      },
      {
        figure: 'Audio engineering',
        view: 'In sound, amplitude sets loudness (roughly), and recording/playback preserves amplitude dynamics.',
        standing: 'Applied consensus',
        note: 'Dynamic range, peak vs RMS, and clipping all concern amplitude.',
      },
    ],
    deepDive: {
      phenomenon: 'Why the "bigness" of a wave controls its energy',
      intro:
        'Amplitude (A) is the maximum displacement from equilibrium. The deep-dive explains why energy ∝ A² and how that governs sound loudness, light intensity and AM radio.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Amplitude is how big a wave is — the height of its crest above the still line. A big push of the rope gives a large amplitude; a small one gives a small amplitude. Larger amplitude means the wave carries more energy, so a louder sound or brighter light. It is different from wavelength: wavelength is how far apart crests are; amplitude is how tall they are. It is measured in metres.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'Amplitude A is the maximum displacement of the oscillating quantity. For a mechanical wave, energy is proportional to A² (a stretched spring’s PE ∝ A²). Sound intensity (W/m²) ∝ A²; light intensity ∝ square of the electric-field amplitude. The amplitude does not affect wave speed — that depends on the medium. Doubling amplitude quadruples energy. In AM radio, the message is encoded in the carrier amplitude.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'In acoustics, you work with sound pressure amplitude and SPL (decibels, which compress the A² intensity range). In electronics, signal amplitude, peak and RMS, clipping and dynamic range are fundamental; AM modulation varies carrier amplitude. In optics, field amplitude vs intensity (∝ |E|²) separates coherent and incoherent descriptions. Structural and vibration engineering guards against resonance-driven amplitude growth that can damage systems.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Energy density of a wave is ∝ A²: for a string, power P ∝ ½μω²A²v; for an EM wave, intensity I = ½ε₀cE₀². In quantum optics the classical amplitude maps to the field operator; the "amplitude" of a coherent state determines its photon statistics, and amplitude noise sets the shot-noise limit. In nonlinear acoustics, large amplitudes break linearity; in relativity, field amplitude is tied to energy density in the stress–energy tensor.',
        },
      ],
    },
    whatCameBefore:
      'You need the basic wave measures (wavelength, frequency). Amplitude is the third independent one — the "size" of the disturbance.',
    connections: [
      'Wave energy (∝ A²)',
      'Sound loudness and light brightness',
      'Wave-speed (amplitude does not change it)',
    ],
    applications: [
      'AM radio varies a carrier wave’s amplitude to carry speech and music.',
      'Loudness control and audio compression manage amplitude to protect hearing and hardware.',
      'Vibration damping limits structural amplitude build-up at resonance.',
    ],
    workedExamples: [
      'If a wave’s amplitude doubles from 2 cm to 4 cm, its energy quadruples: E ∝ A² means (4/2)² = 4. A sound carrying four times the energy is noticeably louder — that is why a slightly bigger vibration is a much stronger wave.',
    ],
    analogies: [
      'Amplitude is the height of the swing of a pendulum you set in motion: a harder push makes a bigger swing (larger amplitude) with more energy, while the rhythm (frequency) stays the same.',
    ],
    misconceptions: [
      'Amplitude is not wavelength — amplitude is height, wavelength is crest-to-crest distance.',
      'Amplitude does not change wave speed — that depends on the medium.',
      'A larger amplitude does not necessarily mean a faster wave; it means more energy.',
    ],
    tryThis:
      'Pluck a violin string gently, then hard. The pitch (frequency) is the same, but the string swings farther (larger amplitude) and the sound is louder — you are watching amplitude raise the energy by eye and ear.',
    funFacts: [
      'A sound wave’s amplitude is so tiny that the loudest tolerable noise compresses air by only about a thousandth of ambient pressure.',
      'The word "amplitude" is also used for the peak of an oscillating circuit — the same idea from a guitar to a radio transmitter.',
    ],
    estimatedTimeMinutes: 14,
  },

  'lhs:phys.wave-speed': {
    conceptId: 'lhs:phys.wave-speed',
    hook:
      'See lightning, hear thunder — the light is there instantly, the sound arrives seconds later. The gap is a speed difference. Wave speed tells us whether a ripple, a shout, or a beam of light will arrive now or later, and it depends not on how big the wave is but on what it travels through.',
    history:
      'The finite speed of light was established by Ole Rømer in 1676 using the eclipses of Jupiter’s moon Io — he showed light is not instantaneous. Sound’s speed had been measured by Marin Mersenne and, more precisely, later workers in the 1600s–1700s. Isaac Newton estimated the speed of sound, and Pierre-Simon Laplace corrected Newton’s derivation with the adiabatic condition. By the 1800s the wave relation v = fλ was standard. In 1865 Maxwell showed the speed of electromagnetic waves equals the measured speed of light, uniting the two. The speed of a mechanical wave depends on the properties of the medium; that of light, on vacuum constants.',
    figures: [
      {
        name: 'Ole Rømer',
        lifespan: '1644–1710',
        role: 'Danish astronomer',
        contribution:
          'First demonstrated the speed of light is finite (c. 1676) by timing the eclipses of Jupiter’s moon Io.',
        statement:
          'Light … takes time to travel the immense distance of the solar system.',
        statementSource: 'Paraphrase of Rømer’s report (1676)',
      },
      {
        name: 'Pierre-Simon Laplace',
        lifespan: '1749–1827',
        role: 'French mathematician and astronomer',
        contribution:
          'Corrected Newton’s formula for the speed of sound by accounting for adiabatic compression.',
        statementSource: 'Paraphrase of Laplace’s speed-of-sound correction (1816)',
      },
      {
        name: 'James Clerk Maxwell',
        lifespan: '1831–1879',
        role: 'Scottish physicist',
        contribution:
          'Derived the speed of electromagnetic waves from vacuum constants and showed it equals c.',
        statement:
          'The velocity of light … that determined by the electrical experiments … agree [with theory].',
        statementSource: 'Paraphrase of Maxwell’s electromagnetic theory (1865)',
      },
    ],
    timeline: [
      {
        period: '1676',
        event: 'Rømer shows light has finite speed.',
        figure: 'Ole Rømer',
      },
      {
        period: '1816',
        event: 'Laplace corrects the adiabatic speed of sound.',
        figure: 'Pierre-Simon Laplace',
      },
      {
        period: '1865',
        event: 'Maxwell derives c from EM theory.',
        figure: 'James Clerk Maxwell',
      },
    ],
    perspectives: [
      {
        figure: 'Ole Rømer (1676)',
        view: 'Light travels at a finite, measurable speed.',
        standing: 'The founding measurement',
        note: 'Almost a century before direct terrestrial measurements.',
      },
      {
        figure: 'Newton–Laplace for sound',
        view: 'Sound speed depends on the medium’s elasticity and density; Laplace added the adiabatic factor.',
        standing: 'The correct mechanical consensus',
        note: 'v_sound = √(γRT/M) in a gas.',
      },
      {
        figure: 'Maxwell / relativity',
        view: 'Light speed c is fixed by vacuum constants and is the same for all observers.',
        standing: 'The modern consensus',
        note: 'Einstein made c a postulate of special relativity.',
      },
    ],
    deepDive: {
      phenomenon: 'Why wave speed belongs to the medium, not the wave',
      intro:
        'Wave speed v is how fast energy propagates: for a wave v = fλ. The deep-dive explains why speed depends on the medium and not on amplitude or frequency.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Wave speed is how fast a wave travels, in metres per second. Sound travels about 343 m/s through air; light travels 3×10⁸ m/s (300 million metres per second). The speed is set by what the wave moves through, not by how big or how frequent it is. That is why a loud sound and a soft one, a high note and a low note, all cross a room in the same time.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'For a wave, v = fλ and v = λ/T. In the same medium, all sound waves of the same type have (nearly) the same speed regardless of frequency or amplitude. Speed depends on medium properties: sound in a gas v = √(γRT/M); on a string v = √(T/μ). Light speed v = c/n in a medium of refractive index n. Temperature changes the gas speed of sound.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'You use wave speed in propagation and delay calculations: cables, acoustic path lengths, fibre and seismic travel times. Material and geometric dispersion (v depends on λ) matter in fibre optical pulses and antenna arrays. Mach number compares flow speed to local sound speed. In transmission lines, phase velocity and group velocity differ; in EM, v = c/n depends on ε and μ. Seismic velocity models image Earth’s interior.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Mechanical waves: v = √(elastic modulus/density) for longitudinal, v = √(T/μ) for a string. In gas v = √(γRT/M). For EM waves, c = 1/√(ε₀μ₀), and in media v = c/√(εᵣμᵣ) ≈ c/n. In relativity, c is invariant and the universal speed limit; nothing carrying information exceeds it. Group velocity (energy transport) v_g = dω/dk differs from phase velocity when dispersive, and can even exceed c without carrying information — a subtle but real distinction.',
        },
      ],
    },
    whatCameBefore:
      'You need the wave picture and its measures. Wave speed binds frequency and wavelength, v = fλ.',
    connections: [
      'Wavelength and frequency (v = fλ)',
      'Sound and light (their different speeds)',
      'Medium properties (they set the speed)',
    ],
    applications: [
      'Thunder and lightning timing lets you estimate distance: count seconds after the flash, divide by ~3 to get kilometres.',
      'Sonar and echo-sounding use measured sound speed to find distances underwater.',
      'Seismic velocity analysis images the Earth from earthquake waves.',
    ],
    workedExamples: [
      'Sound travels 340 m/s in air. You see lightning and hear thunder 5 s later. Distance ≈ speed × time = 340 × 5 = 1700 m — roughly a kilometre away. If instead you drove to see a speedboat’s wake crossing a pond of 50 m in 3.1 s, the wave speed would be 50/3.1 ≈ 16 m/s.',
    ],
    analogies: [
      'Wave speed is like the pace of a marching band: the tune (frequency) and step size (wavelength) can change, but how fast the parade advances is set by the ground and the band, not by the song.',
    ],
    misconceptions: [
      'Higher-frequency waves do not automatically travel faster than lower ones in the same medium.',
      'Wave speed is never infinite — even light has a finite 3×10⁸ m/s.',
      'Amplitude does not set wave speed; the medium does.',
    ],
    tryThis:
      'Watch a long rope: shake it fast (high frequency) and slow (low frequency) — the pulse arrives at the far end in basically the same time. The speed is set by the rope’s tension and mass, not by how fast you shake.',
    funFacts: [
      'Sound travels about four-and-a-half times faster in water than in air — why whales can "talk" across whole oceans.',
      'Maxwell deduced light’s speed was electromagnetic purely from the constants ε₀ and μ₀ — a spectacular prediction from theory alone.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.sound': {
    conceptId: 'lhs:phys.sound',
    hook:
      'Clap in a cave and the walls clap back; tap a fork and the table hums. Every sound is a push-and-pull of matter — a wave of compression — and it needs air (or metal or water) to ride on. In the vacuum of space, the grandest explosion would be utterly silent.',
    history:
      'The physics of sound grew from the experience of music. Pythagoras, around 500 BCE, found that halving a string doubles its pitch, launching the study of sound as math. Aristotle correctly held that sound is carried through air as motion of matter. In 1636 Marin Mersenne published Harmonie Universelle, measuring the speed of sound and relating pitch to frequency. In the 1800s Hermann von Helmholtz wrote the foundation of acoustics, and later workers measured speed precisely, applied the adiabatic correction of Laplace, and used sound waves (ultrasound, sonar) practically. The science extends from a vibrating violin string to the sonar of oceanographers.',
    figures: [
      {
        name: 'Pythagoras',
        lifespan: 'c. 570–495 BCE',
        role: 'Greek philosopher and mathematician',
        contribution:
          'Discovered the numerical relationships between the lengths of vibrating strings and the musical intervals they produce.',
        statementSource: 'Paraphrase of the Pythagorean account of string ratios',
      },
      {
        name: 'Marin Mersenne',
        lifespan: '1588–1648',
        role: 'French theologian and mathematician',
        contribution:
          'Measured the speed of sound and quantified pitch in terms of vibration frequency (Harmonie Universelle, 1636).',
        statementSource: 'Paraphrase of Mersenne’s Harmonie Universelle (1636)',
      },
      {
        name: 'Hermann von Helmholtz',
        lifespan: '1821–1894',
        role: 'German physicist and physiologist',
        contribution:
          'Wrote On the Sensations of Tone (1863), founding modern acoustics and explaining resonators.',
        statementSource: 'Paraphrase of Helmholtz, On the Sensations of Tone (1863)',
      },
    ],
    timeline: [
      {
        period: 'c. 500 BCE',
        event: 'Pythagoras links string length to musical pitch.',
        figure: 'Pythagoras',
      },
      {
        period: '1636',
        event: 'Mersenne measures sound speed and formalises pitch.',
        figure: 'Marin Mersenne',
      },
      {
        period: '1863',
        event: 'Helmholtz founds modern acoustics.',
        figure: 'Hermann von Helmholtz',
      },
    ],
    perspectives: [
      {
        figure: 'Aristotle',
        view: 'Sound travels as motion of the air.',
        standing: 'Qualitatively correct',
        note: 'He saw sound needs a medium — a lasting insight.',
      },
      {
        figure: 'Pythagoras / Mersenne',
        view: 'Pitch corresponds to a measurable vibration rate.',
        standing: 'Foundational for acoustics',
        note: 'Sound was quantified.',
      },
      {
        figure: 'Helmholtz / modern',
        view: 'Sound is a longitudinal mechanical wave with frequency, amplitude and speed; it cannot cross vacuum.',
        standing: 'The modern consensus',
        note: 'Acoustics, ultrasonics and sonar all follow.',
      },
    ],
    deepDive: {
      phenomenon: 'Sound as a compression wave that cannot cross a vacuum',
      intro:
        'Sound is a longitudinal mechanical wave — regions of compression and rarefaction — that needs a medium. The deep-dive explains its production, propagation, speed, and the barrier of the vacuum.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Sound is a wave that squeezes and stretches air (or water, or metal) as it travels. A vibrating speaker cone pushes air, making compressions that reach your ear. Sound needs matter to move through — it cannot cross a vacuum, which is why space is silent no matter how loud. Sound travels about 343 m/s in air, and is slower at high altitude, faster in water. Pitch goes with frequency; loudness with amplitude.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'Sound is longitudinal: particles vibrate parallel to propagation, alternately compressed and rarefied. Speed in a gas v = √(γRT/M); in water and solids it is faster. v = fλ ties frequency and wavelength. Sound intensity (W/m²) ∝ amplitude² and is measured logarithmically in decibels. A vibrating source sets up compressions; the medium transmits the disturbance as waves, not as the movement of air from source to ear.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'Acoustic design handles reflection, absorption and transmission: room acoustics, speakers and microphones, and noise control. Ultrasound uses high-frequency (MHz) waves to image tissue or detect flaws; sonar measures water depth and objects by pulse-echo time. Acoustic impedance matching governs energy transfer at boundaries. In helicopters and aircraft, noise is a key engineering constraint; in materials, acoustic inspection finds cracks. Speed variation with temperature, pressure and medium must be accounted.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Sound is pressure/density waves governed by the wave equation with speed c_s = √(K/ρ) (K is the adiabatic bulk modulus). In gases c_s = √(γRT/M). It is a mechanical excitation of the medium’s degrees of freedom, so in a vacuum or empty space there is no medium and no sound. Standing waves and normal modes shape instruments and rooms; the Doppler effect shifts pitch with relative motion; nonlinear acoustics (shock waves, acoustofluidics) extend the linear regime. Surface acoustic waves, phonons in solids, are quantised sound — central to modern microelectronics and heat conduction in materials.',
        },
      ],
    },
    whatCameBefore:
      'You need the wave picture (frequency, amplitude, wave-speed). Sound is a specific wave: longitudinal, needing a medium.',
    connections: [
      'Wave-speed (v = fλ) and frequency (pitch)',
      'Amplitude (loudness)',
      'Energy (sound carries it as mechanical wave energy)',
    ],
    applications: [
      'Ultrasound imaging builds pictures from echoes of high-frequency sound.',
      'Sonar uses sound to map the seabed and detect objects underwater.',
      'Musical instruments are engineered resonant sources of sound waves.',
    ],
    workedExamples: [
      'A sound wave in air at 20°C has speed ≈ 343 m/s. A 440 Hz tuning fork (the A above middle C) has wavelength λ = v/f = 343/440 ≈ 0.78 m. In water (v ≈ 1500 m/s) the same frequency gives λ ≈ 3.4 m — a much longer wave.',
    ],
    analogies: [
      'Sound is a line of people doing "the wave" in a stadium: each person just stands up and sits (oscillating), but the ripple (compression) travels around the whole crowd. No single person moves with the ripple — like air, which does not travel across the room with your voice.',
    ],
    misconceptions: [
      'Sound cannot travel through a vacuum — it needs a medium.',
      'Sound is far slower than light (343 m/s vs 3×10⁸ m/s).',
      'Sound speed is not fixed; it changes with the medium and temperature.',
    ],
    tryThis:
      'Strike a metal spoon and put the handle to your forehead: you hear a bright buzz on the bone contact far louder than through air — because sound travels faster and carries differently in solid matter.',
    funFacts: [
      'The loudest sound recorded, the 1883 Krakatoa eruption, was heard roughly 5,000 km away.',
      'Bats hear up to ~100 kHz; humans top out around 20 kHz — much of the sound world is beyond our ears.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.light': {
    conceptId: 'lhs:phys.light',
    hook:
      'It arrives from a star ninety million miles away to warm your cheek, yet a candle a metre off barely does. Light is the fastest messenger in the Universe, and the only one your eye can read at all — a sliver of an enormous invisible spectrum your ancestors never knew existed.',
    history:
      'The nature of light is one of the oldest and deepest threads in physics. The Greeks debated whether it is rays from the eye or pulses in the air. In the 1600s, René Descartes and Pierre de Fermat worked out the ray model, and Isaac Newton championed a particle (corpuscular) theory, using it to explain reflection. Christiaan Huygens argued for waves. Thomas Young’s 1801 interference experiments and Augustin-Jean Fresnel’s diffraction gave waves the edge. In 1865 James Clerk Maxwell showed light is an electromagnetic wave, and in 1905 Albert Einstein proposed quanta (photons) to explain the photoelectric effect, winning him the Nobel Prize. Light is now understood as both wave and photon: electromagnetic radiation in the visible sliver.',
    figures: [
      {
        name: 'Isaac Newton',
        lifespan: '1643–1727',
        role: 'English mathematician and natural philosopher',
        contribution:
          'Proposed the corpuscular theory of light and showed white light splits into colours with a prism (Opticks, 1704).',
        statement:
          'Light itself is a Heterogeneous mixture of differently refrangible rays.',
        statementSource: 'Isaac Newton, Opticks (1704) — paraphrase',
      },
      {
        name: 'Thomas Young',
        lifespan: '1773–1829',
        role: 'English polymath',
        contribution:
          'Demonstrated the wave nature of light by interference (double-slit experiment).',
        statementSource: 'Paraphrase of Young’s interference experiments (1801)',
      },
      {
        name: 'Albert Einstein',
        lifespan: '1879–1955',
        role: 'German-born theoretical physicist',
        contribution:
          'Proposed the light quantum (photon) in 1905 to explain the photoelectric effect, for which he won the 1921 Nobel Prize in Physics.',
        statement:
          'The energy of a light ray … is distributed not continuously but in discrete quanta.',
        statementSource: 'Paraphrase of Einstein, "On a Heuristic Point of View Concerning the Production and Transformation of Light" (1905)',
      },
    ],
    timeline: [
      {
        period: '1687–1704',
        event: 'Newton publishes Opticks; corpuscular theory and colour.',
        figure: 'Isaac Newton',
      },
      {
        period: '1801',
        event: 'Young’s double-slit shows light interference — waves.',
        figure: 'Thomas Young',
      },
      {
        period: '1865',
        event: 'Maxwell: light is an electromagnetic wave.',
        figure: 'James Clerk Maxwell',
      },
      {
        period: '1905',
        event: 'Einstein proposes the photon.',
        figure: 'Albert Einstein',
      },
    ],
    perspectives: [
      {
        figure: 'Isaac Newton (corpuscles)',
        view: 'Light is a stream of tiny particles.',
        standing: 'Valuable for rays and reflection; superseded classically',
        note: 'The particle picture returned with photons.',
      },
      {
        figure: 'Huygens–Young–Fresnel (waves)',
        view: 'Light is a wave that interferes and diffracts.',
        standing: 'Correct classically',
        note: 'Interference proved it.',
      },
      {
        figure: 'Einstein / quantum (photons)',
        view: 'Light behaves as both wave and particle; quanta carry energy hf.',
        standing: 'The modern consensus',
        note: 'The wave–particle duality defines quantum optics.',
      },
    ],
    deepDive: {
      phenomenon: 'Light as electromagnetic radiation, wave and photon',
      intro:
        'Light is electromagnetic radiation the eye can see — a sliver of the full spectrum. The deep-dive unpacks its dual nature, its speed, and today’s applications.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Light is what makes things visible: a form of energy that travels in waves from a source to your eye. It can move through empty space (sunlight reaches you across a vacuum), travels very fast (300,000 km/s), and comes in colours that together make white light. Light is electromagnetic radiation — a wave of electric and magnetic fields — and only a tiny slice of the whole spectrum is visible to you.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'Light obeys c = fλ, with c = 3×10⁸ m/s in vacuum. Colour is set by wavelength/frequency; the visible range is ~400–700 nm. Light travels through vacuum, needs no medium, and has speed c (that is why thunder lags lightning). Intensity is power per area; the photon model adds E = hf. Reflection, refraction, dispersion and interference are its wave behaviours; the photoelectric effect reveals its particle nature.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'In optics you use ray tracing and wave/EM optics; refractive index n sets speed in media and Snell’s law for refraction. Design of lenses, lasers, fibre and detectors uses wavelength-dependent behaviour and coherence. Photonics, solar cells and optical communications exploit E = hf and photon flux. Radiometry/Photometry distinguish physical power from human-perceived brightness. Diffraction limits resolution, so telescope and microscopy design respects λ.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Light is an electromagnetic wave solving Maxwell’s equations, with energy ∝ |E|² and quantised photons of energy E = hf. In vacuum, c = 1/√(ε₀μ₀) is an invariant constant — the basis of relativity. The photon is a gauge boson of U(1) electromagnetism; its exchange mediates EM force. Modern experiments test quantum-optical phenomena (entanglement, photon statistics, squeezing), and in materials the photon couples to matter as polaritons. The "colour" we see is a narrow evolutionary window into a vast spectrum of radio to gamma.',
        },
      ],
    },
    whatCameBefore:
      'You need the wave ideas (frequency, wavelength, speed). Light is the archetype of an electromagnetic wave that needs no medium.',
    connections: [
      'Electromagnetic spectrum (light is the visible sliver)',
      'Wave behaviour (reflection, refraction, interference)',
      'Speed of light (c) and relativity',
    ],
    applications: [
      'Fibre optics carry phone and internet data as pulses of light.',
      'Solar cells convert light’s energy into electricity.',
      'Cameras, microscopes and telescopes are engineered around light’s behaviour.',
    ],
    workedExamples: [
      'Green light has wavelength λ = 500 nm = 5.0×10⁻⁷ m. Its frequency f = c/λ = (3×10⁸)/(5.0×10⁻⁷) = 6.0×10¹⁴ Hz. Each photon carries E = hf ≈ (6.63×10⁻³⁴)(6.0×10¹⁴) ≈ 4.0×10⁻¹⁹ J — a tiny packet, but enough to trigger your eye’s rod cells.',
    ],
    analogies: [
      'Light is a messenger that can ride either as a wave (rippling in the field) or arrive as a packet (photon) — like a message that can be delivered as a long continuous wave or as discrete courier drops, depending on how you ask.',
    ],
    misconceptions: [
      'Light does not need a medium — it travels through vacuum.',
      'Light is not instantaneous; it has finite speed c.',
      'Light is far more than what you see — visible is one small band of the EM spectrum.',
    ],
    tryThis:
      'Hold a prism (or a CD edge) to sunlight and cast a spectrum on a wall: white light is bending into its component colours — refraction plus dispersion revealing the colours hidden in "white".',
    funFacts: [
      'Sunlight takes about 8 minutes and 20 seconds to reach Earth — you always see the Sun as it was, never as it "is".',
      'A single photon is the dimmest possible light, and an eye’s rod cell can barely respond to one — your night vision is literally single-photon sensitive.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.reflection': {
    conceptId: 'lhs:phys.reflection',
    hook:
      'Stand before a mirror and you see yourself — not because the glass is special, but because at that instant light simply refuses to change direction, bouncing back at exactly the angle it came. The law is one sentence and touches every reflection you have ever seen.',
    history:
      'Reflection was studied in antiquity for mirrors and for metre markers. The law of reflection — that angle of incidence equals angle of reflection — appears in the writings of Greek science and was codified in the Middle Ages by figures such as the scholar Alhazen (Ibn al-Haytham), often called the father of optics, in his Book of Optics (c. 1011–1021). Hero of Alexandria and the Stoics discussed it. In the 1600s Descartes and Fermat derived it from the principle of least time. Later, plane, convex and concave mirrors found uses from makeup mirrors to telescopes. The law is so robust that it follows from the wave nature of light (Huygens’ principle) as well as from ray optics.',
    figures: [
      {
        name: 'Alhazen (Ibn al-Haytham)',
        lifespan: 'c. 965–1040',
        role: 'Arab polymath',
        contribution:
          'Systematic study and explanation of reflection and refraction in his Book of Optics; helped establish that light enters the eye from objects.',
        statement:
          'Natural bodies … reflect light in every direction, but the reflected ray obeys fixed angles.',
        statementSource: 'Paraphrase of Ibn al-Haytham, Kitab al-Manazir (Book of Optics, c. 1011)',
      },
      {
        name: 'Hero of Alexandria',
        lifespan: 'c. 10–70 CE',
        role: 'Greek engineer and geometer',
        contribution:
          'Proved (by geometry) that the angle of incidence equals the angle of reflection from paths of least distance.',
        statementSource: 'Paraphrase of Hero’s optics (Catoptrics)',
      },
    ],
    timeline: [
      {
        period: 'c. 10–70 CE',
        event: 'Hero shows equal angles for reflection.',
        figure: 'Hero of Alexandria',
      },
      {
        period: 'c. 1011',
        event: 'Alhazen systematically studies reflection.',
        figure: 'Ibn al-Haytham',
      },
      {
        period: '1650s',
        event: 'Descartes and Fermat derive reflection and refraction from least-time principles.',
        figure: 'René Descartes; Pierre de Fermat',
      },
    ],
    perspectives: [
      {
        figure: 'Hero of Alexandria',
        view: 'Reflection follows equal angles; equivalent to least distance.',
        standing: 'Early and correct',
        note: 'Geometric proof before modern wave optics.',
      },
      {
        figure: 'Alhazen (c. 1011)',
        view: 'Reflection is a systematic phenomenon in ray optics, with light coming from objects to the eye.',
        standing: 'Foundational',
        note: 'Established the modern (correct) direction of sight.',
      },
      {
        figure: 'Wave optics',
        view: 'The law of reflection emerges from Huygens’ construction — every reflection is wave behaviour.',
        standing: 'The modern consensus',
        note: 'Unifies ray and wave accounts.',
      },
    ],
    deepDive: {
      phenomenon: 'The law of reflection and why every surface reflects',
      intro:
        'Reflection is the bouncing back of light from a surface; the law is that angle of incidence equals angle of reflection, both measured from the normal. The deep-dive covers specular vs diffuse reflection.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Reflection is light bouncing off a surface. The rule is simple: the angle at which light comes in (measured from an imaginary line perpendicular to the surface, called the normal) equals the angle at which it leaves. That is why a mirror shows your image straight back — the light obeys equal angles for every ray. Almost every surface reflects a little light; that is how you see a table or a face.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'The law of reflection: θ_i = θ_r, both measured from the normal to the surface, with incident and reflected rays lying in the same plane. A smooth surface gives specular reflection (a clear image), because all reflected rays stay parallel; a rough surface gives diffuse reflection, scattering each ray in its own direction. The law holds for plane, concave and convex mirrors, and follows from both ray and wave models.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'You apply the law in optical design: mirror equations (1/f = 1/v + 1/u), ray tracing for image formation, and in sensors/telecom via total internal reflection, retroreflectors and fibre. Signal reflection in transmission lines and radar also obeys it. Polarisation by reflection (Brewster’s angle) is exploited in polarising filters. Fresnel reflection coefficients quantify how much light reflects at dielectric interfaces.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Reflection is a boundary condition solution of the wave equation; the Fresnel equations give amplitude reflection coefficients dependent on angle and refractive index, including the phase flip of π on reflection from a denser medium. Total internal reflection (θ_c = arcsin(n₂/n₁)) underpins fibre optics. By Fermat’s principle, the law of reflection is the stationary optical path of light. Retroreflectors exploit it to send signals back to their source — used on the Moon for laser ranging.',
        },
      ],
    },
    whatCameBefore:
      'You need the ray model of light and the idea of the normal. Reflection is the simplest consequence of light striking a surface.',
    connections: [
      'Light (ray model)',
      'Mirrors (they are surfaces that reflect well)',
      'Total internal reflection (an extreme of reflection)',
    ],
    applications: [
      'Mirrors show images because reflection obeys equal angles.',
      'Periscopes use angled plane mirrors to let you see over obstacles.',
      'Retroreflectors on roads and bicycles return light straight back to the driver’s eyes.',
    ],
    workedExamples: [
      'A light ray hits a flat mirror at 30° to the normal. By the law of reflection, the reflected ray leaves at 30° to the normal on the other side. The ray turns through 60° in total — a single mirror always turns light by 2θ.',
    ],
    analogies: [
      'Reflection is a billiard ball off the cushion: ignore friction, and the ball leaves at the same angle it came — the cushion’s normal is the imaginary line at which you measure that equal angle.',
    ],
    misconceptions: [
      'Reflection does not happen only in mirrors — every surface reflects some light (diffusely if rough).',
      'The angle of incidence is measured from the normal, not from the surface itself.',
      'Rough surfaces do reflect, just diffusely — scattering rather than forming an image.',
    ],
    tryThis:
      'Angle a small mirror so a sunbeam (or torch beam) reflects off it, and watch how moving the mirror by a little turns the reflected spot by twice as much — the equal-angle rule (and the ×2 mirror magnification) in action.',
    funFacts: [
      'Laser-ranging reflectors left on the Moon by Apollo missions let scientists measure the Earth–Moon distance to centimetres, by simple reflection.',
      'A periscope in a submarine uses two parallel plane mirrors; because each obeys reflection, you see over the waterline while staying under it.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.refraction': {
    conceptId: 'lhs:phys.refraction',
    hook:
      'Dip a straw in a glass of water and it appears to bend at the surface — but nothing actually moved. The straw is straight; it is the light, slowing as it enters the water, that dog-legs. That innocent-looking bend is the whole secret behind lenses, telescopes, mirages and fibre optics.',
    history:
      'Refraction was known to the ancients — Ptolemy and Alhazen studied how light bends entering water. The quantitative law was a triumph of early modern science. Around 1621, the Dutch astronomer Willebrord Snell (Snellius) discovered the sine law, later published by René Descartes in 1637; it is known in much of the world as Snell’s law. Pierre de Fermat then derived it in 1657–1661 from his principle of least time, showing light takes the quickest (not shortest) path. In 1800s, the refractive index and dispersion were measured precisely (Fraunhofer), and fibre optics, mirages and lenses followed. Modern optics, from eyeglasses to telescopes and internet fibres, rests on Snell’s law.',
    figures: [
      {
        name: 'Willebrord Snell',
        lifespan: '1580–1626',
        role: 'Dutch astronomer and mathematician',
        contribution:
          'Discovered the law of refraction (c. 1621) relating the sines of the angles to the indices of the two media.',
        statementSource: 'Paraphrase of Snell’s unpublished law of refraction (c. 1621)',
      },
      {
        name: 'René Descartes',
        lifespan: '1596–1650',
        role: 'French philosopher and mathematician',
        contribution:
          'Published the sine law of refraction in 1637 (Dioptrics), independently reaching the same relation.',
        statementSource: 'Paraphrase of Descartes’ Dioptrique (1637)',
      },
      {
        name: 'Pierre de Fermat',
        lifespan: '1607–1665',
        role: 'French mathematician',
        contribution:
          'Derived refraction from the principle of least time (1657–1661), grounding Snell’s law in a variational principle.',
        statementSource: 'Paraphrase of Fermat’s principle of least time',
      },
    ],
    timeline: [
      {
        period: 'c. 1621',
        event: 'Snell discovers the sine law of refraction.',
        figure: 'Willebrord Snell',
      },
      {
        period: '1637',
        event: 'Descartes publishes the law independently.',
        figure: 'René Descartes',
      },
      {
        period: '1657–1661',
        event: 'Fermat derives it from least time.',
        figure: 'Pierre de Fermat',
      },
    ],
    perspectives: [
      {
        figure: 'Snell / Descartes (1621–1637)',
        view: 'The sine of the angles of incidence and refraction obey a fixed ratio (the refractive index ratio).',
        standing: 'The governing law',
        note: 'n₁ sinθ₁ = n₂ sinθ₂.',
      },
      {
        figure: 'Pierre de Fermat (1657)',
        view: 'Light takes the path that minimises travel time, from which the law follows.',
        standing: 'A deeper principle',
        note: 'Grounds the law without assuming a mechanism.',
      },
      {
        figure: 'Wave optics',
        view: 'Refraction reflects the change in light speed (and wavelength) between media, with Huygens’ construction.',
        standing: 'The modern consensus',
        note: 'Explains *why* light bends toward the normal in a denser medium.',
      },
    ],
    deepDive: {
      phenomenon: 'Why light bends when it slows down',
      intro:
        'Refraction is the bending of light as it changes speed between media, governed by Snell’s law. The deep-dive covers the refractive index, total internal reflection and everyday effects like mirages and apparent depth.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Refraction is light bending when it passes into a new material — like air into water or glass. It happens because light travels at different speeds in different materials. If it enters a denser material at an angle, it slows and bends toward the normal; leaving, it speeds up and bends away. That is why a straw looks bent in water and a swimming pool looks shallower than it is. The law: n₁ sinθ₁ = n₂ sinθ₂.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'Snell’s law: n₁ sinθ₁ = n₂ sinθ₂, where n = c/v is the refractive index. Light bends toward the normal entering a denser medium (n larger), away when leaving. The wavelength changes with the medium, frequency stays fixed. Total internal reflection occurs beyond the critical angle θ_c = arcsin(n₂/n₁) when going to a less dense medium. Dispersion separates colours because n varies with wavelength — the cause of prisms and rainbows.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'Ray tracing uses Snell’s law and the lens formula; refractive index of materials determines lens power and fibre acceptance. Optical fibres rely on total internal reflection. In atmospheric optics, continuous index variation (density/temperature) bends light, giving mirages and astronomical refraction. Measuring index precisely (refractometry) fingerprints materials. Imaging and fiber-optic communication budgets hinge on the index profile.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Refraction follows from the wave equation across a boundary and is tied to permittivity/permeability: n = √(εᵣμᵣ). The Fresnel equations give reflected/transmitted amplitudes, including the phase on reflection. Fermat’s principle (variational) generalises to arbitrary index profiles; the eikonal equation of geometric optics is the short-wavelength limit of wave optics. Negative-index "metamaterials" reverse the bending direction. In relativity, the speed of light in a medium is frame-dependent, altering refraction for a moving observer.',
        },
      ],
    },
    whatCameBefore:
      'You need the wave picture and speed of light. Refraction is the consequence of light changing speed when it changes medium.',
    connections: [
      'Light (the wave being bent)',
      'Lenses and prisms (they exploit refraction)',
      'Total internal reflection (a limiting case)',
    ],
    applications: [
      'Eyeglasses, cameras and microscopes use lenses that bend light by refraction.',
      'Optical fibres guide light by repeated total internal reflection.',
      'Mirages and apparent pool depth are refraction at work.',
    ],
    workedExamples: [
      'Light passes from air (n₁=1) into glass (n₂=1.5) at 30°. Snell’s law: 1·sin30° = 1.5·sinθ₂ ⇒ sinθ₂ = 0.5/1.5 ≈ 0.333 ⇒ θ₂ ≈ 19.5° — the ray bends toward the normal by about 10°.',
    ],
    analogies: [
      'Refraction is a shopping cart crossing from smooth pavement onto grass at an angle: the wheel on the grass slows first, so the cart turns toward the slow side — much as light, slowing in the denser medium, turns toward the normal.',
    ],
    misconceptions: [
      'Light bends systematically per Snell’s law — not randomly.',
      'Refraction occurs at any boundary between different media, not only in glass.',
      'Refraction itself does not change light’s colour — dispersion (wavelength-dependent index) separates colours, and that is a separate effect.',
    ],
    tryThis:
      'Drop a coin in an empty cup and back away until the rim hides it. Pour in water and the coin "appears" — the water refacts light so it now reaches your eye. A classic that becomes real the moment you do it.',
    funFacts: [
      'The "bent straw" effect is why divers misjudge depth — your brain assumes light travels straight, even when it does not.',
      'Snell never published his law; it was Descartes who made it famous — one of optics’ quiet ironies.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.lens': {
    conceptId: 'lhs:phys.lens',
    hook:
      'A curved bit of glass a finger wide can start a fire, magnify an ant, or bring a distant galaxy into focus. Lenses work by one principle — bending light through refraction — yet they put the entire visible Universe, and a billion spectacles, on our eyes.',
    history:
      'Lenses have been known since antiquity as magnifying "burning glasses," used to concentrate sunlight. The word lens comes from the Latin for lentil — the shape of the seeds resembles a lens. Around 1608 people were already combining lenses into telescopes; Galileo Galilei turned one to the heavens in 1609–1610 and saw Jupiter’s moons and craters on our Moon. Johannes Kepler analysed lens optics and proposed the Keplerian telescope. In the 1600s Descartes and Fermat gave the geometric theory, and the lens-maker’s and lens equations took shape. Later, microscopes, cameras, and corrective lenses for vision evolved. Today, lenses shape the light in everything from a phone camera to a laser.',
    figures: [
      {
        name: 'Galileo Galilei',
        lifespan: '1564–1642',
        role: 'Italian astronomer',
        contribution:
          'Used a refracting telescope of lenses to observe Jupiter’s moons, the Moon’s craters and more, transforming astronomy.',
        statement:
          'I have discovered … four planets [moons] revolving round the star of Jupiter.',
        statementSource: 'Paraphrase of Galileo’s Sidereus Nuncius (1610)',
      },
      {
        name: 'Johannes Kepler',
        lifespan: '1571–1630',
        role: 'German astronomer and mathematician',
        contribution:
          'Analysed the optics of lenses and proposed the keplerian (convex–convex) telescope design.',
        statementSource: 'Paraphrase of Kepler’s Dioptrice (1611)',
      },
      {
        name: 'Carbon copy of an early practitioner',
        role: 'landmark',
        contribution:
          'The lens-maker’s equation and lens equation were developed over the 17th–18th centuries into the form used today (1/f = 1/v + 1/u).',
        statementSource: 'Paraphrase of the classical lens equation formalism',
      },
    ],
    timeline: [
      {
        period: 'c. 1000s',
        event: 'Reading stones and burning glasses use single lenses.',
        note: 'Lenses served aiding vision and fire.',
      },
      {
        period: '1608–1610',
        event: 'Galileo turns a telescope to the heavens.',
        figure: 'Galileo Galilei',
      },
      {
        period: '1611',
        event: 'Kepler analyses lens optics and the keplerian telescope.',
        figure: 'Johannes Kepler',
      },
      {
        period: '17th–18th c.',
        event: 'Lens-maker’s and thin-lens equations formalised.',
      },
    ],
    perspectives: [
      {
        figure: 'Galileo (1610)',
        view: 'Lens telescopes open a new scale of the Universe.',
        standing: 'The observational watershed',
        note: 'Established lens telescopes as scientific instruments.',
      },
      {
        figure: 'Kepler (1611)',
        view: 'Lens combinations can form magnified real images; the keplerian design is better for astronomy.',
        standing: 'The optical design standard',
        note: 'His convex–convex telescope inverted but bright.',
      },
      {
        figure: 'Modern optical engineering',
        view: 'Lens systems are engineered for focus, magnification and aberration control using 1/f = 1/v + 1/u and ray tracing.',
        standing: 'The applied consensus',
        note: 'From spectacles to telescope arrays.',
      },
    ],
    deepDive: {
      phenomenon: 'How a lens focuses light by refraction',
      intro:
        'A lens is a transparent device that refracts light to converge or diverge rays, described by the lens formula 1/f = 1/v + 1/u. The deep-dive covers converging vs diverging lenses, image formation and applications.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'A lens is a piece of glass or plastic shaped to bend light. A convex (bulging) lens brings parallel light to a focus — like a magnifying glass that burns a leaf in sunlight. A concave (thinner in the middle) lens spreads light, which is how it corrects short-sightedness. Lenses can magnify, focus, or shrink an image, and nearly every eye-helping device — spectacles, cameras, telescopes — uses them.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'The lens formula 1/f = 1/v + 1/u relates focal length f, image distance v, and object distance u (with sign conventions). A convex lens converges parallel light to a real focal point; a concave diverges such that virtual rays meet. Magnification m = v/u (with sign). Lenses obey refraction, so dispersion can colour the edges (chromatic aberration) which designers correct. The lens-maker’s equation ties f to curvature and refractive index.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'Optical systems are designed by ray tracing, the thin-lens/power equations (P = 1/f dioptres), and aberration control (spherical, chromatic, coma). Camera objectives combine several lenses. Corrective lens power is prescribed in dioptres. Laser collimators, microscopes and telescopes place lenses per design. In fibre and photonics, graded-index lenses and aspherics improve focus. Image sensors require alignment at the focal plane.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'The paraxial thin-lens equation is the geometric-optics limit of the wave front propagation; f depends on curvature and index via the lens-maker’s equation. Real lenses are aberrated because ideal focusing is only paraxial — Fourier optics treats a lens as performing a spatial Fourier transform of the field, the basis of imaging theory. Diffraction limits resolution to ~λ/(NA). Modern optics adds freeform lenses, metamaterial lenses, and adaptive optics that correct wavefronts in real time — as in large telescopes.',
        },
      ],
    },
    whatCameBefore:
      'You need refraction (light bending between media). A lens is a carefully shaped surface that uses refraction to focus rays.',
    connections: [
      'Refraction (the lens bends light)',
      'Light (the wave travelling through)',
      'Mirrors (the analogous reflecting devices for images)',
    ],
    applications: [
      'Eyeglasses and contact lenses correct focus using convex/concave power.',
      'Cameras, microscopes and telescopes are assemblies of lenses (and mirrors).',
      'A magnifying glass concentrates sunlight to a point hot enough to start a fire.',
    ],
    workedExamples: [
      'A magnifying glass with focal length 10 cm is held so an object is 5 cm in front of it. Lens formula: 1/v = 1/f − 1/u = 1/10 − 1/(-5)? Using the standard sign convention for a real object, 1/v = 1/10 + 1/5 = 0.3 ⇒ v ≈ 3.33 cm (magnified, upright virtual image).',
    ],
    analogies: [
      'A convex lens is like a funnel for light: parallel beams flowing in are gathered to one spout (focus); a concave lens is an inverted funnel that spreads them — the same pipework, opposite funnel.',
    ],
    misconceptions: [
      'Not all lenses magnify — concave lenses shrink images.',
      'Lenses work by refraction, not reflection.',
      'Thicker lenses do not always have a shorter focal length — curvature and refractive index decide f.',
    ],
    tryThis:
      'Use a magnifying glass outdoors to focus sunlight onto a scrap of dark paper — keep it brief and safe. You get a sharp dot (focus) that smokes; pull back and the dot grows and cools, showing you where (and only where) the rays converge.',
    funFacts: [
      'The word "lens" is Latin for lentil, because early glass lenses resembled the little seeds.',
      'Galileo’s best telescope magnified only about 30×, yet it overturned 2,000 years of astronomy.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.mirror': {
    conceptId: 'lhs:phys.mirror',
    hook:
      'A single flat sheet of glass backed with silver returns the world to you — but that is just the start. Curve the sheet and it can shrink a car into a side mirror, magnify a face into a shaving mirror, or gather starlight into a telescope. Every image, real or virtual, comes from the humble law of reflection.',
    history:
      'Mirrors are among the oldest optics. Hand mirrors of polished obsidian and metal date to ancient Egypt and Mesopotamia; the Greeks and Romans had bronze mirrors. The modern silvered-glass mirror appeared in Venice in the 1500s and spread across Europe. Curved mirrors — concave to concentrate light — were used as burning mirrors in antiquity. Concave mirrors also became the heart of reflecting telescopes; Isaac Newton built his famous reflecting telescope in 1668 to avoid the chromatic problems of lenses, and today’s largest observatories use concave primary mirrors. The science is the law of reflection (equal angles) applied to plane, concave and convex surfaces.',
    figures: [
      {
        name: 'Isaac Newton',
        lifespan: '1643–1727',
        role: 'English mathematician and natural philosopher',
        contribution:
          'Built the first practical reflecting telescope (1668) using a concave primary mirror to avoid lens colour errors.',
        statementSource: 'Paraphrase of Newton’s telescope construction (1668)',
      },
      {
        name: 'Venetian glass-makers (1500s)',
        role: 'artisans and inventors',
        contribution:
          'Developed silvered-glass mirrors at Murano, replacing polished-metal ones with brighter, clearer reflections.',
        statementSource: 'Paraphrase of Murano glass-mirror lore (16th century)',
      },
    ],
    timeline: [
      {
        period: 'c. 1000 BCE',
        event: 'Polished metal and stone where mirrors appear.',
        note: 'Ancient handmade mirrors.',
      },
      {
        period: '1500s',
        event: 'Venetian silvered-glass mirrors spread across Europe.',
      },
      {
        period: '1668',
        event: 'Newton builds a reflecting telescope.',
        figure: 'Isaac Newton',
      },
    ],
    perspectives: [
      {
        figure: 'Classical optics',
        view: 'Mirrors form images obeying equal-angle reflection; plane mirrors give same-size virtual images.',
        standing: 'The governing law',
        note: 'Both curved and plane cases follow.',
      },
      {
        figure: 'Isaac Newton (1668)',
        view: 'A concave mirror can gather light and form an image without the chromatic errors of lenses.',
        standing: 'Reflecting telescopes became the standard',
        note: 'All major modern observatories use curved mirrors.',
      },
      {
        figure: 'Modern optical engineering',
        view: 'Curved mirrors control image size and whether it is real or virtual using 1/f = 1/v + 1/u.',
        standing: 'The applied consensus',
        note: 'Convex for wide views, concave for magnification and collection.',
      },
    ],
    deepDive: {
      phenomenon: 'How flat and curved mirrors make images',
      intro:
        'A mirror is a surface that reflects light; plane mirrors give same-size virtual images, while concave and convex mirrors can give real or virtual images using 1/f = 1/v + 1/u. The deep-dive covers all three.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'A mirror is a surface that reflects light to form an image. A flat (plane) mirror shows a same-size image that looks as far behind the glass as you are in front — a *virtual* image, because the light never actually comes from behind the mirror. A concave mirror (curved in) magnifies or shrinks depending on distance; a convex mirror (curved out) shrinks and widens the view — why car side mirrors say "objects are closer than they appear."',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'Plane mirrors: virtual, upright, same size, apparently the same distance behind the surface. Concave mirrors converge parallel light to the focal point (real focus); convex mirrors diverge (virtual focus). Mirror formula 1/f = 1/v + 1/u, with magnification m = v/u (sign conventions applied). A concave mirror can form a real, inverted image (for distant objects) or an upright virtual one (object inside focus) — the basis of shaving/makeup mirrors. Newton’s reflecting telescope uses a concave primary.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'You design with the mirror equation and ray tracing, choosing plane/concave/convex for the job. Concave mirrors concentrate and collect — used in headlamps, solar concentrators and telescope primaries. Convex mirrors give wide fields on vehicles and in security. Spherical aberration plagues simple spherical mirrors; telescopes use paraboloids and correctors. Coated dielectric mirrors control reflection in lasers and fibre; mirror alignment and wavefront control matter in large instruments.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Mirror imaging is ray optics from reflection; curved mirrors are analysed paraxially (1/f = 1/v+1/u) with sign conventions, but real mirrors suffer spherical aberration unless shaped paraboloid/aspheric. The "virtual image" from a plane mirror is a parity-changed reconstruction — reflection flips handedness, hence mirrored writing looks odd. In modern optics, deformable mirrors and segmented primaries correct wavefronts (adaptive optics), and cavity mirrors in lasers must satisfy stability conditions for modes. Retroreflector corner cubes return light along its path, essential for ranging and safety.',
        },
      ],
    },
    whatCameBefore:
      'You need the law of reflection. A mirror is simply a reflective surface; curving it changes the image it forms.',
    connections: [
      'Reflection (the underlying law)',
      'Light (what mirrors reflect)',
      'Lenses (the refracting counterparts that also form images)',
    ],
    applications: [
      'Rear-view mirrors are convex to widen the field and shrink images.',
      'Shaving/makeup mirrors are concave to magnify your face.',
      'Telescope primaries are large concave mirrors that gather starlight.',
      'Security mirrors are convex for broad visibility.',
    ],
    workedExamples: [
      'An object 5 cm in front of a concave mirror of focal length 10 cm. Using 1/f = 1/v + 1/u with the near-side normal convention (u = −5 cm), 1/v = 1/10 − 1/(-5)? In the common school convention, 1/v = 1/f + 1/u with u positive in front: 1/v = 1/10 + 1/5 = 0.3 ⇒ v ≈ 3.33 cm → upright, virtual, magnified ~1.5×.',
    ],
    analogies: [
      'A plane mirror is a perfectly still pond: your reflection floats at the same depth. Cup the water concave and it magnifies like a basin; arch it convex and the whole sky shrinks into your view.',
    ],
    misconceptions: [
      'Not all mirrors form the same type of image — it depends on the shape and object position.',
      'Curved mirrors do not always magnify — a convex mirror shrinks everything.',
      'A virtual image is not "behind" the glass in any physical sense; you only see the light as if it came from there.',
    ],
    tryThis:
      'Stand a spoon upright. The inside (concave) face shows you upside-down from far and right-side-up magnified from near; the outside (convex) face shrinks the world always. One spoon, three mirrors.',
    funFacts: [
      'Concave "burning mirrors" were described in antiquity for focusing sunlight to start fires.',
      'The James Webb and Hubble telescopes are enormous concave mirrors — the same law of reflection Newton used in 1668, scaled to space.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.heat': {
    conceptId: 'lhs:phys.heat',
    hook:
      'Touch a coal and it burns your finger; it is not that the coal is "full of heat" but that heat is moving into you. Heat is not a substance you store — it is energy on the move, and the whole weather, every engine and every recipe is a story of that movement.',
    history:
      'For centuries heat was believed to be an invisible fluid called caloric, which flowed from hot to cold. This idea explained some things but failed to explain why rubbing warms, or why cannon-boring produced endless heat. Benjamin Thompson (Count Rumford) in the 1790s showed that boring a cannon produced heat without end, arguing heat is not a material. James Prescott Joule then measured, in the 1840s, the mechanical equivalent of heat — that a fixed amount of work equals a fixed amount of heat — providing the quantitative proof. Together, Rumford and Joule overturned caloric and established heat as energy in transit. Today heat Q is energy that flows from a hotter to a colder body; the stored energy is internal energy, governed by the first law of thermodynamics.',
    figures: [
      {
        name: 'Benjamin Thompson (Count Rumford)',
        lifespan: '1753–1814',
        role: 'British-American physicist',
        contribution:
          'Showed cannon boring produced nearly unlimited heat, arguing heat is motion (not a fluid) and discrediting caloric theory.',
        statement:
          'It appears to me to be extremely difficult, if not quite impossible, to form any distinct idea of anything capable of being excited and communicated in the manner the Heat was excited … unless it be MOTION.',
        statementSource: 'Paraphrase of Rumford, "An Inquiry Concerning the Source of the Heat Which Is Excited by Friction" (1798)',
      },
      {
        name: 'James Prescott Joule',
        lifespan: '1818–1889',
        role: 'English physicist',
        contribution:
          'Determined the mechanical equivalent of heat, showing heat and work are interchangeable forms of energy.',
        statement:
          '…magnetism, electricity, and heat … are, if I may so say, different modes of motion.',
        statementSource: 'Paraphrase of Joule’s publications (1843–1850)',
      },
    ],
    timeline: [
      {
        period: 'c. 1700s',
        event: 'Caloric theory holds heat as a fluid.',
        note: 'Explains some flows but not friction-warmth.',
      },
      {
        period: '1798',
        event: 'Rumford’s cannon-boring shows heat is motion.',
        figure: 'Count Rumford',
      },
      {
        period: '1843+',
        event: 'Joule measures the mechanical equivalent of heat.',
        figure: 'James Prescott Joule',
      },
    ],
    perspectives: [
      {
        figure: 'Caloric theorists (1700s)',
        view: 'Heat is an invisible fluid that flows from hot to cold.',
        standing: 'Superseded',
        note: 'Could not explain friction-generated heat.',
      },
      {
        figure: 'Benjamin Thompson / Count Rumford (1798)',
        view: 'Heat is a form of motion, produced by work (friction).',
        standing: 'Correct — decisive for the energy picture',
        note: 'His cannon experiment was a turning point.',
      },
      {
        figure: 'James Joule (1843)',
        view: 'Heat and work are convertible forms of energy in fixed proportion.',
        standing: 'The quantitative consensus',
        note: 'Established the mechanical equivalent of heat.',
      },
    ],
    deepDive: {
      phenomenon: 'Heat as energy in transit, not a stored fluid',
      intro:
        'Heat (Q) is energy transferred between bodies due to a temperature difference — energy in transit, not stored. The deep-dive clarifies heat vs internal energy and temperature, and the three transfer mechanisms.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Heat is energy that flows from a hotter thing to a colder one. It is not a substance a body "holds"; a warm body holds internal energy, and heat is the energy *moving* out of it. Temperature measures how fast its particles jiggle, not how much heat it has. Heat flows by touching (conduction), through moving fluid (convection) and by radiation. This is why a metal spoon in hot soup warms your hand — heat is travelling to you.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'Heat Q is energy in transit due to ΔT, distinct from internal energy U. The first law, ΔU = Q − W, ties them. Heating a mass: Q = mcΔT (specific heat) or Q = mL (latent heat). Transfer modes: conduction (Fourier), convection, and radiation (∝ T⁴). Heat flows hot to cold; it is never "stored as heat" in a body — the body stores internal (kinetic + potential) energy. That is why Rumford’s endless friction-warmth made sense only once energy was conserved.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'You do heat-transfer design: conduction (k, resistances in series), convection (h), radiation (emissivity), and combined heat exchangers. The first law balances energy budgets (ΔU = Q − W). Specific heat and latent heats size heaters, coolers and thermal storage. Engine and HVAC efficiency is limited by the need to reject waste heat to a cold reservoir. Thermal insulation R-values and heat-sinking are everyday applications. Phase-change and second-law (temperature) limits govern real systems.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Heat is energy transferred across a boundary between systems not in thermal contact equilibrium; in statistical mechanics, heat transfer is the exchange of energy associated with entropy change (δQ = T dS for reversible processes). Joule’s mechanical equivalent establishes the conversion factor between work and heat. Conduction obeys Fourier’s law; radiation follows Stefan–Boltzmann, with blackbody spectra explained by quantum statistics (Planck). The first law states energy conservation; the second law bounds efficiency (Carnot). In kinetic theory, temperature is proportional to mean molecular kinetic energy — heat as energy in transit, not a fluid, is the foundational modern view.',
        },
      ],
    },
    whatCameBefore:
      'You need temperature and energy/work. Heat is the energy transferred because of a temperature difference.',
    connections: [
      'Temperature (the driver of heat flow)',
      'Specific heat and latent heat (how much heats things)',
      'Internal energy and the first law of thermodynamics',
    ],
    applications: [
      'Cooking transfers heat to food by conduction, convection (boiling) and radiation (grilling).',
      'Engine cooling systems reject heat to keep the metal from overheating.',
      'Home insulation slows heat flow, keeping buildings warm or cool.',
    ],
    workedExamples: [
      'To warm 1.0 kg of water (c ≈ 4200 J/(kg·°C)) from 20°C to 60°C: Q = mcΔT = 1.0 × 4200 × 40 = 168,000 J ≈ 168 kJ of heat must flow in. The same 168 kJ, spent as work by a paddle wheel, raises the temperature identically — Joule’s equivalence.',
    ],
    analogies: [
      'Heat is a courier between neighbours: it is the package (energy) in transit, decided by who is hotter; once delivered it becomes storage (internal energy) at the new place, not a permanent "heat" in anyone’s hands.',
    ],
    misconceptions: [
      'Heat and temperature are different — heat is energy transfer, temperature is a measure of average particle motion.',
      'Heat is not stored in an object — internal energy is stored.',
      '"Cold" is not a kind of energy; it is simply the absence of heat, which always flows hot to cold.',
    ],
    tryThis:
      'Hold one hand on a metal spoon and the other in the air at the same temperature: the metal feels colder, not because it is colder, but because it conducts heat out of your hand faster. That perceived difference is conduction, one face of heat transfer.',
    funFacts: [
      'Count Rumford bored cannons by the metre and the water they cooled boiled — endless warmth from "motion", the fatal blow to caloric theory.',
      'A cup of tea cools according to Newton’s law, and only because heat flows faster when the temperature gap is bigger.',
    ],
    estimatedTimeMinutes: 16,
  },

  'lhs:phys.specific-heat': {
    conceptId: 'lhs:phys.specific-heat',
    hook:
      'The sea warms slowly in summer and the desert sand burns in a day — because the same joule heats sand much faster than water. That quirk is specific heat, the "specific" appetite each material has for energy before it warms by one degree.',
    history:
      'The idea that different substances need different amounts of heat to warm by the same degree was recognised when scientists studied calorimetry in the 1700s. Joseph Black, a Scottish chemist and physician, systematically investigated latent heat and specific heat in the 1760s, distinguishing heat capacity from temperature and establishing the concept that became specific heat capacity. Later work (Dulong and Petit in 1819) found, remarkably, that for solid elements atomic heat is roughly constant — an early hint that specific heat connects to atoms. Modern kinetic theory and quantum theory (Einstein and Debye models) explained why specific heat varies and falls at low temperatures.',
    figures: [
      {
        name: 'Joseph Black',
        lifespan: '1728–1799',
        role: 'Scottish physician and chemist',
        contribution:
          'Pioneered the study of heat capacity and latent heat, distinguishing heat (capacity) from temperature.',
        statement:
          'Different bodies … require different quantities of heat to raise their temperature equally.',
        statementSource: 'Paraphrase of Joseph Black’s lectures on heat (1760s)',
      },
      {
        name: 'Pierre Dulong & Alexis Petit',
        lifespan: '1785–1838 / 1791–1820',
        role: 'French physicists',
        contribution:
          'Found (1819) that the heat capacity per mole of solid elements is roughly constant (Dulong–Petit law).',
        statementSource: 'Paraphrase of Dulong and Petit’s law (1819)',
      },
    ],
    timeline: [
      {
        period: '1760s',
        event: 'Black studies heat capacity and latent heat.',
        figure: 'Joseph Black',
      },
      {
        period: '1819',
        event: 'Dulong and Petit state their law for solid elements.',
        figure: 'Dulong; Petit',
      },
      {
        period: '20th century',
        event: 'Einstein and Debye models explain specific heat variation with temperature.',
        note: 'Quantum theory completed the picture.',
      },
    ],
    perspectives: [
      {
        figure: 'Joseph Black (1760s)',
        view: 'Heat capacity is distinct from temperature, and differs by substance.',
        standing: 'The founding concept',
        note: 'Gave us the quantity used daily.',
      },
      {
        figure: 'Dulong & Petit (1819)',
        view: 'Elements’ molar heat capacity is approximately constant.',
        standing: 'Valuable approximation; quantum-corrected at low T',
        note: 'Hinted at atomicity.',
      },
      {
        figure: 'Quantum kinetic theory',
        view: 'Specific heat arises from the quantised energy of atoms/molecules; it varies and trends to zero at low temperature.',
        standing: 'The modern consensus',
        note: 'Explains departures from Dulong–Petit.',
      },
    ],
    deepDive: {
      phenomenon: 'Why each material takes a different joule count per degree',
      intro:
        'Specific heat capacity c is the heat needed to raise 1 kg of a substance by 1 K: c = Q/(mΔT). The deep-dive covers water’s remarkable role and the kinetic/quantum origin.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Specific heat is how much energy a substance needs to warm up by one degree per kilogram. Water needs a lot; metals need little. That is why the sea warms slowly (high specific heat) while a pan heats instantly (low). It is a property of the material itself — a kilogram of water always needs ~4,200 J to rise 1°C, whatever the pan. It does not depend on how much water you have; that is the "per kilogram" part.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'c = Q/(mΔT), in J/(kg·K). Heat Q = mcΔT. Water has c ≈ 4,200 J/(kg·K) — extraordinarily high, which is why oceans moderate coastal climate and car radiators use water. Metals are low (aluminium ~900, iron ~450). Specific heat is mass-independent as a material property; it varies with temperature, more so for gases at constant pressure vs volume (c_p vs c_v, c_p = c_v + R for ideal gases). High c means the substance "resists" temperature change for a given energy input.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'You use c in thermal budgets and heat-exchanger design, Q = mcΔT. High-c fluids (water) are coolants; low-c metals are quick-heating cooking surfaces. Calorimetry (mixing methods) measures c. In CV vs CP for gases (γ = c_p/c_v), acoustic speed and thermodynamics rely on c_v. Phase-change adds latent heat. Thermal storage (molten salt, water) exploits high c to store energy. For continuous flows, heat rate Q̇ = ṁcΔT governs sizing.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Specific heat is a response function: c = (∂U/∂T) (per unit). In kinetic theory, c_v for an ideal gas is (f/2)R per mole (f degrees of freedom). Quantum theory rescues why solids deviate from Dulong–Petit at low T: Einstein’s model (single quantised oscillator) and Debye’s model (phonon spectrum) make c_v vanish as T³ at low temperature. Electronic and lattice contributions combine in metals. In heat capacity of a system with many scales, c captures the density of accessible thermal states, linking thermodynamics to statistical mechanics.',
        },
      ],
    },
    whatCameBefore:
      'You need heat and temperature as separate ideas. Specific heat quantifies how hard it is to warm a substance.',
    connections: [
      'Heat (Q = mcΔT)',
      'Temperature (what specific heat raises)',
      'Latent heat (the phase-change partner)',
    ],
    applications: [
      'Water’s high specific heat makes car radiators and engine coolants effective.',
      'Oceans and large lakes moderate coastal temperatures because it takes huge heat to warm the water.',
      'Cooking utensils use low-specific-heat metals that heat quickly.',
      'Thermal storage (e.g. water or phase-change stores) banks energy.',
    ],
    workedExamples: [
      'A 2.0 kg block of iron (c ≈ 450 J/(kg·K)) warms from 20°C to 30°C (ΔT = 10 K): Q = mcΔT = 2.0 × 450 × 10 = 9,000 J. The same 9,000 J would warm only about 2.1 kg of water by 1°C — illustrating how different the "specific" appetites are.',
    ],
    analogies: [
      'Specific heat is the warmth of a bath: water clings to temperature, so refilling a big bath of water needs far more hot water than a small metal tub — the same energy, hugely different temperature change.',
    ],
    misconceptions: [
      'Every substance has its own specific heat — water’s is especially high.',
      'High specific heat does not mean "hot" — it means it resists temperature change.',
      'Specific heat is independent of mass; it is a per-kilogram property of the substance.',
    ],
    tryThis:
      'Set a metal pan and a ceramic plate near a flame or on a warm stove at the same setting; the metal gets hot almost instantly, the ceramic lags — low vs high appetite for heat per degree.',
    funFacts: [
      'Water’s high specific heat is why coastal cities have milder winters and summers than inland ones at the same latitude.',
      'The ratio of water’s specific heat to most metals is why a hot pan burns you long after the water next to it is cool.',
    ],
    estimatedTimeMinutes: 15,
  },

  'lhs:phys.radioactivity': {
    conceptId: 'lhs:phys.radioactivity',
    hook:
      'Atoms you cannot see quietly shatter, throwing out rays you cannot feel. Discovered by accident through a fogged photographic plate, radioactivity revealed that seemingly solid matter is restless, decaying — and it became both a medical saving grace and a power source for the planet.',
    history:
      'In 1896 Henri Becquerel found that uranium salts fogged a photographic plate even in darkness — radiation without any stimulus. Marie and Pierre Curie then isolated new radioactive elements, polonium and radium, coining the term "radioactivity"; Marie Curie won two Nobel Prizes for her work. Ernest Rutherford, with Frederick Soddy, showed radioactivity is atomic *disintegration* — one element changing into another — and identified the alpha and beta rays (and, with others, gamma). In 1903 Rutherford and Soddy proposed radioactive decay and half-life. Advances followed: artificial radioactivity (Irène and Frédéric Joliot-Curie, 1934), nuclear fission (Otto Hahn, Lise Meitner, 1938), and the uses of radioisotopes in medicine, industry and (later) power. The field reshaped physics and medicine.',
    figures: [
      {
        name: 'Henri Becquerel',
        lifespan: '1852–1908',
        role: 'French physicist',
        contribution:
          'Discovered natural radioactivity in 1896 when uranium salts fogged a photographic plate.',
        statement:
          'The rays emitted by the uranium salts produce photographic impressions …',
        statementSource: 'Paraphrase of Becquerel’s report (1896)',
      },
      {
        name: 'Marie Curie',
        lifespan: '1867–1934',
        role: 'Polish-French physicist and chemist',
        contribution:
          'Coined "radioactivity," isolated polonium and radium, and won Nobel Prizes in Physics (1903) and Chemistry (1911).',
        statement:
          'It is … possible to discover new bodies, extremely radio-active.',
        statementSource: 'Paraphrase of Marie Curie’s research on radium (1898–1902)',
      },
      {
        name: 'Ernest Rutherford',
        lifespan: '1871–1937',
        role: 'New Zealand-born physicist',
        contribution:
          'With Soddy, explained radioactive decay as atomic disintegration and introduced the concept of half-life; identified alpha and beta rays.',
        statement:
          'Radioactivity is shown to be accompanied by chemical changes … of a new kind.',
        statementSource: 'Paraphrase of Rutherford and Soddy’s disintegration theory (1902–1903)',
      },
    ],
    timeline: [
      {
        period: '1896',
        event: 'Becquerel discovers natural radioactivity.',
        figure: 'Henri Becquerel',
      },
      {
        period: '1898',
        event: 'Marie and Pierre Curie isolate polonium and radium.',
        figure: 'Marie Curie; Pierre Curie',
      },
      {
        period: '1902–1903',
        event: 'Rutherford and Soddy propose atomic disintegration and half-life.',
        figure: 'Ernest Rutherford; Frederick Soddy',
      },
      {
        period: '1934',
        event: 'Irène and Frédéric Joliot-Curie produce artificial radioactivity.',
        figure: 'Joliot-Curie',
      },
      {
        period: '1938',
        event: 'Hahn–Meitner–Strassmann discover fission.',
        figure: 'Otto Hahn; Lise Meitner',
      },
    ],
    perspectives: [
      {
        figure: 'Henri Becquerel (1896)',
        view: 'Uranium emits penetrating rays without external stimulus.',
        standing: 'The founding discovery',
        note: 'Opened the study of radioactivity.',
      },
      {
        figure: 'Rutherford & Soddy (1902)',
        view: 'Radioactivity is the spontaneous transformation (disintegration) of an unstable nucleus.',
        standing: 'The core correct model',
        note: 'Introduced half-life and transmutation.',
      },
      {
        figure: 'Modern view',
        view: 'Radioactivity arises from nuclear disintegration of unstable isotopes; some is natural, some artificial.',
        standing: 'The current consensus',
        note: 'Alpha/beta/gamma and other decay modes are characterised quantum-mechanically.',
      },
    ],
    deepDive: {
      phenomenon: 'Unstable nuclei emitting radiation, with a half-life',
      intro:
        'Radioactivity is the spontaneous emission of radiation from an unstable nucleus, with alpha, beta and gamma emissions and an exponential half-life. The deep-dive covers decay types, half-life, and uses.',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Radioactivity is when unstable atoms break down by themselves, giving off energy and sometimes particles. It happens in nature all the time — you are bathed in low-level background radiation. There are three main kinds: alpha (heavy but easily stopped), beta (lighter, can pass skin) and gamma (very penetrating). The time for half a sample to decay is the half-life. Because it is invisible and dangerous, shielding and distance protect us, but it is also useful in medicine.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with equations',
          body:
            'Decay follows N = N₀(1/2)^(t/T½), with T½ the half-life. Alpha (α) is a helium nucleus (²He⁴), beta (β⁻) an electron from neutron→proton conversion, beta⁺ a positron, and gamma (γ) high-energy photons. Each reduces the atomic number appropriately. Activity A = λN (Bq), with λ = ln2/T½. Radioacive decay is statistical but deterministic in bulk; exposure is measured in sieverts/grays. Carbon-14 dating uses the 5,730-year half-life.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'You work with decay chains, activity, shielding (half-value layers), and dose limits. Nuclear power extracts energy from fission, which produces radioactive fission products needing management. Radiotherapy and brachytherapy use controlled sources; imaging (PET, SPECT) uses short-lived radiotracers. Geochronology uses decay pairs. Safety: time, distance, shielding, and contamination control. Decay heat must be managed during reactor shutdown.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'Decay is governed by the quantum tunnelling/transition of nuclei, with λ related to the barrier (Gamow factor) for alpha decay and to weak-interaction matrix elements for beta decay. The exponential law is the ensemble result of identical quantum states decaying with constant probability per unit time. Gamma decay changes nuclear energy levels via photon emission. Modern theory uses the nuclear shell model and QED/EW interactions; decay rates are sensitive to fundamental constants, and "double beta decay" probes neutrino mass. Radiometric dating, geochemistry and astrophysics (nucleosynthesis producing radioactive species) all rest on nuclear kinetics.',
        },
      ],
    },
    whatCameBefore:
      'You need atomic structure (protons, neutrons) and energy. Radioactivity is the spontaneous change of an unstable nucleus.',
    connections: [
      'Atomic structure (unstable nuclei)',
      'Nuclear fission and fusion (energy from nuclei)',
      'Half-life (the decay clock)',
    ],
    applications: [
      'Nuclear power stations extract energy from controlled fission.',
      'Medical imaging (PET) and cancer radiotherapy use radioisotopes.',
      'Carbon dating determines the age of fossils and artifacts.',
      'Sterilising medical equipment uses gamma irradiation.',
    ],
    workedExamples: [
      'A sample of a radioisotope with half-life 12.0 h starts at 80 µg. After 12 h it is 40 µg; after 24 h, 20 µg; after 36 h, 10 µg — it halves each period, never reaching zero, in an exponential fashion. Activity A = λN ≈ (ln2/T½)·N.',
    ],
    analogies: [
      'Radioactive decay is like a container of popcorn kernels popping: each kernel pops at an unpredictable instant, but in a big batch a constant fraction pops per second — the "half of what remains" rule is always obeyed on average. An individual kernel’s moment is random; the batch’s half-life is stable.',
    ],
    misconceptions: [
      'Radioactivity is not always man-made — it occurs naturally in rocks, air, food and you.',
      'Not all radiation is harmful — we live with natural background radiation daily; effect depends on dose and type.',
      'Radioactive materials do not glow green — they are invisible; only detectors (or protective markers) reveal them.',
    ],
    tryThis:
      'You cannot see or feel radiation, but you can detect counts with a simple Geiger counter app or a dosimeter near a smoke detector containing a small americium source — with proper caution, watch the count rate jump and then decay back at the source’s half-life character.',
    funFacts: [
      'Marie Curie is the only person to win Nobel Prizes in two different sciences.',
      'Your body contains naturally radioactive potassium-40 — you are, very mildly, a source of radiation.',
    ],
    estimatedTimeMinutes: 17,
  },

  'lhs:phys.atomic-structure': {
    conceptId: 'lhs:phys.atomic-structure',
    hook:
      'Everything you can touch is made of tiny structures that are mostly empty space, with a dense heart a hundred-thousandth of the atom’s size. The word "atom" once meant "uncuttable" — and the journey to find the truth inside it is one of the great detective stories of science.',
    history:
      'The idea of the atom is ancient — Democritus and Leucippus in the 5th century BCE proposed indivisible atoms, and Lucretius wrote of them in verse. John Dalton gave the modern atomic theory in 1803–1808, explaining chemical combination. In 1897 J.J. Thomson discovered the electron and proposed a "plum pudding" atom. Ernest Rutherford’s 1911 gold-foil experiment showed most of the atom is empty space with a tiny positive nucleus — overturning the plum pudding. Niels Bohr added quantised electron orbits in 1913. Later developments — Schrödinger (1926) replacing orbits with probability orbitals, James Chadwick finding the neutron (1932), and the discovery of quarks in the late 20th century — completed the modern picture: a dense nucleus of protons and neutrons surrounded by electron probability clouds.',
    figures: [
      {
        name: 'J.J. Thomson',
        lifespan: '1856–1940',
        role: 'British physicist',
        contribution:
          'Discovered the electron in 1897 and proposed the plum-pudding model of the atom.',
        statement:
          'We have in the cathode rays matter in a new state, in which the corpuscles are smaller than the atoms.',
        statementSource: 'Paraphrase of J.J. Thomson, "Cathode Rays" (1897)',
      },
      {
        name: 'Ernest Rutherford',
        lifespan: '1871–1937',
        role: 'New Zealand-born physicist',
        contribution:
          'Gold-foil experiment (1911) revealed the tiny, dense nucleus and the atom’s mostly-empty structure.',
        statement:
          'It was quite the most incredible event that has ever happened to me in my life.',
        statementSource: 'Paraphrase of Rutherford on the reflected alpha particle (1911)',
      },
      {
        name: 'Niels Bohr',
        lifespan: '1885–1962',
        role: 'Danish physicist',
        contribution:
          'Model of quantised electron orbits (1913) that explained atomic spectra and hydrogen emission lines.',
        statementSource: 'Paraphrase of Bohr’s hydrogen-atom model (1913)',
      },
      {
        name: 'James Chadwick',
        lifespan: '1891–1974',
        role: 'British physicist',
        contribution:
          'Discovered the neutron in 1932, completing the proton–neutron picture of the nucleus.',
        statementSource: 'Paraphrase of Chadwick’s neutron discovery (1932)',
      },
    ],
    timeline: [
      {
        period: 'c. 400 BCE',
        event: 'Democritus proposes indivisible atoms.',
        figure: 'Democritus',
      },
      {
        period: '1803–1808',
        event: 'Dalton gives the modern atomic theory.',
        figure: 'John Dalton',
      },
      {
        period: '1897',
        event: 'Thomson discovers the electron (plum pudding).',
        figure: 'J.J. Thomson',
      },
      {
        period: '1911',
        event: 'Rutherford reveals the nucleus.',
        figure: 'Ernest Rutherford',
      },
      {
        period: '1913',
        event: 'Bohr’s quantised orbits explain spectra.',
        figure: 'Niels Bohr',
      },
      {
        period: '1932',
        event: 'Chadwick discovers the neutron.',
        figure: 'James Chadwick',
      },
    ],
    perspectives: [
      {
        figure: 'Democritus / Dalton',
        view: 'Matter is made of indivisible atoms, all of an element alike.',
        standing: 'The founding idea; atoms are further divisible',
        note: 'Dalton made it quantitative for chemistry.',
      },
      {
        figure: 'Thomson (1897)',
        view: 'Atoms contain electrons embedded in a positive "pudding."',
        standing: 'Superseded by Rutherford',
        note: 'First atomic model to include electrons.',
      },
      {
        figure: 'Rutherford (1911)',
        view: 'Atoms are mostly empty space with a tiny, dense, positive nucleus.',
        standing: 'The correct broad structure',
        note: 'Electrons orbit at great distances compared to nucleus size.',
      },
      {
        figure: 'Bohr / quantum (1913+)',
        view: 'Electrons occupy quantised energy levels and probability orbitals, not fixed orbits.',
        standing: 'The modern consensus',
        note: 'Schrödinger replaced orbits with orbitals.',
      },
    ],
    deepDive: {
      phenomenon: 'The atom: dense nucleus, empty space, and electron clouds',
      intro:
        'The atom is a dense nucleus of protons and neutrons surrounded by electrons in orbitals; the number of protons defines the element. The deep-dive unpacks the scale, the models, and why it is mostly "empty."',
      rungs: [
        {
          level: 'Curious',
          audience: 'For anyone starting out',
          body:
            'Everything around you is made of atoms, and each atom is mostly empty space with a tiny, heavy nucleus at the centre and even tinier electrons racing around it. The nucleus holds protons (positive) and neutrons (neutral); the electrons (negative) balance the positive. The number of protons decides which element it is — one proton is hydrogen, two is helium, and so on. If an atom were a stadium, the nucleus would be a marble at the centre.',
        },
        {
          level: 'Enthusiast',
          audience: 'For those comfortable with the basics',
          body:
            'The nucleus occupies roughly 10⁻¹⁵ m while the atom is ~10⁻¹⁰ m — the nucleus is about 100,000× smaller than the atom, yet carries nearly all the mass. Electrons orbit in quantised shells/orbitals; the number of protons (atomic number Z) defines the element, and isotopes differ in neutron number (same Z, different mass number A). Bohr’s orbits explained spectra; quantum mechanics replaced them with orbitals (probability distributions). Ions form when electrons are gained or lost.',
        },
        {
          level: 'Professional',
          audience: 'For engineers and technologists',
          body:
            'Atomic structure underpins chemistry and materials: electron configuration determines bonding, and the shell structure sets the periodic table. Ionisation energy, electron affinity and atomic radius derive from the electron distribution. Nuclear structure (Z, A, binding energy) governs isotopes, stability and radioactivity. Semiconductors, doping and quantum dots rely on precise atomic arrangement; nuclear energy and radiochemistry operate at the nucleus. Spectroscopy identifies matter by atomic energy levels.',
        },
        {
          level: 'Nerd',
          audience: 'For physicists and the mathematically fearless',
          body:
            'The hydrogen atom is solved by the Schrödinger equation with Coulomb potential, giving quantum numbers (n, l, m, s) and energy levels En = −13.6 eV/n². Multi-electron atoms require approximate and many-body methods (Hartree–Fock, density-functional theory). The nucleus is composed of protons and neutrons (nucleons) made of quarks held by the strong force, with residual nuclear forces and shell structure. The strong interaction binds nucleons; the weak interaction drives beta decay. Modern physics probes deeper (quarks, gluons, the Higgs) beyond what Grade-12 nuclear/atomic structure treats classically.',
        },
      ],
    },
    whatCameBefore:
      'You need the idea of protons/neutrons/electrons and charge. The atomic model gives them a home in a dense nucleus and surrounding orbitals.',
    connections: [
      'Radioactivity (instability in the nucleus)',
      'Nuclear fission & fusion (nuclear energy)',
      'Chemical bonding (electron structure drives chemistry)',
    ],
    applications: [
      'Nuclear power and nuclear medicine flow from nucleus structure.',
      'Semiconductor and nano-technology design depends on atoms and electrons.',
      'Medical imaging (PET) uses atomic/nuclear phenomena; radiometric dating uses decay.',
    ],
    workedExamples: [
      'A carbon-14 atom has Z = 6 protons and A = 14 nucleons, so neutrons = A − Z = 8. Its atomic number 6 makes it carbon; the extra 2 neutrons (vs carbon-12) make it radioactive carbon-14, used for dating fossils.',
    ],
    analogies: [
      'The atom is a tiny solar system in miniature: a dense "sun" (nucleus) with "planets" (electrons) far away. But unlike planets, electrons are waves of probability, not little balls on rails — the better picture is a fuzzy cloud around a bright centre.',
    ],
    misconceptions: [
      'Electrons do not orbit in fixed paths like planets — they occupy probability clouds (orbitals).',
      'The atom is mostly empty space, not solid matter.',
      'Atoms of the same element can differ in neutron count (isotopes).',
    ],
    tryThis:
      'Look up an interactive "atom builder" (or use a scaled drawing): place a proton, add a neutron, add an electron, and watch the identity change from hydrogen to helium — proof that the proton count, not electrons or neutrons, sets the element.',
    funFacts: [
      'The word "atom" comes from Greek, meaning "uncuttable" — though the atom turned out to be very cuttable indeed.',
      'If all the empty space were squeezed out of your atoms, you would fit into a space smaller than a grain of rice.',
    ],
    estimatedTimeMinutes: 17,
  },
};