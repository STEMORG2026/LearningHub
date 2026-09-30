/**
 * Curriculum mapping data — consumer-owned layer.
 *
 * Maps canonical STEMMA physics concepts to specific curricula and grades.
 * This file is owned by LearningHub (consumer mapping layer), not STEMMA.
 *
 * Per CONSTITUTION.md §11 and §35: curriculum relationships are consumer-owned, never canonical.
 */

export type CurriculumId =
  | 'nepal_see'
  | 'neb_nepal'
  | 'cbse'
  | 'uk_gcse'
  | 'ngss'
  | 'ib_myp';

export interface CurriculumInfo {
  id: CurriculumId;
  name: string;
  region: string;
  description: string;
}

export interface MappedTopic {
  /** Canonical concept ID from STEMMA */
  canonicalId: string;
  /** Curriculum-specific reference or topic name */
  curriculumRef: string;
  /** Recommended sequence order (1-based) */
  sequence: number;
  /** Depth in this curriculum */
  depth: 'core' | 'extended' | 'optional';
  /** Additional curriculum-specific prerequisites (beyond canonical) */
  additionalPrereqs?: string[];
}

export interface GradeCurriculumMapping {
  curriculum: CurriculumId;
  grade: number;
  subject: string;
  topics: MappedTopic[];
}

export const CURRICULUMS: Record<CurriculumId, CurriculumInfo> = {
  nepal_see: {
    id: 'nepal_see',
    name: 'Nepal SEE',
    region: 'Nepal',
    description: 'Secondary Education Examination (Grade 10) — Nepal',
  },
  neb_nepal: {
    id: 'neb_nepal',
    name: 'Nepal NEB',
    region: 'Nepal',
    description: 'National Examinations Board — Senior Secondary Physics (Grades 11-12)',
  },
  cbse: {
    id: 'cbse',
    name: 'CBSE India',
    region: 'India',
    description: 'Central Board of Secondary Education — Class 9-10',
  },
  uk_gcse: {
    id: 'uk_gcse',
    name: 'UK GCSE',
    region: 'United Kingdom',
    description: 'General Certificate of Secondary Education — KS4',
  },
  ngss: {
    id: 'ngss',
    name: 'US NGSS',
    region: 'United States',
    description: 'Next Generation Science Standards — High School',
  },
  ib_myp: {
    id: 'ib_myp',
    name: 'IB MYP',
    region: 'International',
    description: 'International Baccalaureate Middle Years Programme — Years 4-5',
  },
};

/**
 * Nepal SEE Grade 10 Physics mapping.
 *
 * Based on Nepal CDC Science Curriculum (SEE level).
 * Covers all physics topics expected by end of Grade 10.
 */
export const NEPAL_SEE_GRADE10: GradeCurriculumMapping = {
  curriculum: 'nepal_see',
  grade: 10,
  subject: 'science',
  topics: [
    { canonicalId: 'lhs:phys.measurement', curriculumRef: 'Units and Measurement', sequence: 1, depth: 'core' },
    { canonicalId: 'lhs:phys.physical-quantity', curriculumRef: 'Physical Quantities', sequence: 2, depth: 'core' },
    { canonicalId: 'lhs:phys.unit', curriculumRef: 'SI Units', sequence: 3, depth: 'core' },
    { canonicalId: 'lhs:phys.distance', curriculumRef: 'Motion — Distance and Displacement', sequence: 4, depth: 'core' },
    { canonicalId: 'lhs:phys.displacement', curriculumRef: 'Motion — Distance and Displacement', sequence: 5, depth: 'core' },
    { canonicalId: 'lhs:phys.speed', curriculumRef: 'Motion — Speed', sequence: 6, depth: 'core' },
    { canonicalId: 'lhs:phys.velocity', curriculumRef: 'Motion — Velocity', sequence: 7, depth: 'core' },
    { canonicalId: 'lhs:phys.acceleration', curriculumRef: 'Motion — Acceleration', sequence: 8, depth: 'core' },
    { canonicalId: 'lhs:phys.free-fall', curriculumRef: 'Free Fall', sequence: 9, depth: 'core' },
    { canonicalId: 'lhs:phys.force', curriculumRef: 'Forces', sequence: 10, depth: 'core' },
    { canonicalId: 'lhs:phys.newtons-first-law', curriculumRef: "Newton's First Law", sequence: 11, depth: 'core' },
    { canonicalId: 'lhs:phys.newtons-second-law', curriculumRef: "Newton's Second Law", sequence: 12, depth: 'core' },
    { canonicalId: 'lhs:phys.newtons-third-law', curriculumRef: "Newton's Third Law", sequence: 13, depth: 'core' },
    { canonicalId: 'lhs:phys.momentum', curriculumRef: 'Momentum', sequence: 14, depth: 'core' },
    { canonicalId: 'lhs:phys.work', curriculumRef: 'Work', sequence: 15, depth: 'core' },
    { canonicalId: 'lhs:phys.energy', curriculumRef: 'Energy', sequence: 16, depth: 'core' },
    { canonicalId: 'lhs:phys.kinetic-energy', curriculumRef: 'Kinetic Energy', sequence: 17, depth: 'core' },
    { canonicalId: 'lhs:phys.potential-energy', curriculumRef: 'Potential Energy', sequence: 18, depth: 'core' },
    { canonicalId: 'lhs:phys.conservation-of-energy', curriculumRef: 'Conservation of Energy', sequence: 19, depth: 'core' },
    { canonicalId: 'lhs:phys.power', curriculumRef: 'Power', sequence: 20, depth: 'core' },
    { canonicalId: 'lhs:phys.heat', curriculumRef: 'Heat and Temperature', sequence: 21, depth: 'core' },
    { canonicalId: 'lhs:phys.temperature', curriculumRef: 'Heat and Temperature', sequence: 22, depth: 'core' },
    { canonicalId: 'lhs:phys.specific-heat', curriculumRef: 'Specific Heat', sequence: 23, depth: 'core' },
    { canonicalId: 'lhs:phys.change-of-state', curriculumRef: 'Change of State', sequence: 24, depth: 'core' },
    { canonicalId: 'lhs:phys.wave', curriculumRef: 'Waves', sequence: 25, depth: 'core' },
    { canonicalId: 'lhs:phys.sound', curriculumRef: 'Sound', sequence: 26, depth: 'core' },
    { canonicalId: 'lhs:phys.light', curriculumRef: 'Light', sequence: 27, depth: 'core' },
    { canonicalId: 'lhs:phys.reflection', curriculumRef: 'Reflection of Light', sequence: 28, depth: 'core' },
    { canonicalId: 'lhs:phys.refraction', curriculumRef: 'Refraction of Light', sequence: 29, depth: 'core' },
    { canonicalId: 'lhs:phys.lens', curriculumRef: 'Lenses', sequence: 30, depth: 'core' },
    { canonicalId: 'lhs:phys.electric-charge', curriculumRef: 'Electricity — Charge', sequence: 31, depth: 'core' },
    { canonicalId: 'lhs:phys.current', curriculumRef: 'Electricity — Current', sequence: 32, depth: 'core' },
    { canonicalId: 'lhs:phys.voltage', curriculumRef: 'Electricity — Voltage', sequence: 33, depth: 'core' },
    { canonicalId: 'lhs:phys.resistance', curriculumRef: 'Electricity — Resistance', sequence: 34, depth: 'core' },
    { canonicalId: 'lhs:phys.ohms-law', curriculumRef: "Ohm's Law", sequence: 35, depth: 'core' },
    { canonicalId: 'lhs:phys.magnetism', curriculumRef: 'Magnetism', sequence: 36, depth: 'core' },
    { canonicalId: 'lhs:phys.electromagnetism', curriculumRef: 'Electromagnetism', sequence: 37, depth: 'core' },
    { canonicalId: 'lhs:phys.electromagnetic-induction', curriculumRef: 'Electromagnetic Induction', sequence: 38, depth: 'core' },
    { canonicalId: 'lhs:phys.gravitation', curriculumRef: 'Gravitation', sequence: 39, depth: 'core' },
    { canonicalId: 'lhs:phys.pressure', curriculumRef: 'Pressure', sequence: 40, depth: 'core' },
    { canonicalId: 'lhs:phys.density', curriculumRef: 'Density', sequence: 41, depth: 'core' },
    { canonicalId: 'lhs:phys.buoyancy', curriculumRef: "Archimedes' Principle", sequence: 42, depth: 'core' },
    { canonicalId: 'lhs:phys.mechanical-advantage', curriculumRef: 'Machines', sequence: 43, depth: 'core' },
    { canonicalId: 'lhs:phys.atomic-structure', curriculumRef: 'Atomic Structure', sequence: 44, depth: 'core' },
    { canonicalId: 'lhs:phys.radioactivity', curriculumRef: 'Radioactivity', sequence: 45, depth: 'core' },
    { canonicalId: 'lhs:phys.energy-sources', curriculumRef: 'Sources of Energy', sequence: 46, depth: 'core' },
    // Chemistry
    { canonicalId: 'lhs:chem.matter', curriculumRef: 'Matter and States', sequence: 47, depth: 'core' },
    { canonicalId: 'lhs:chem.atom', curriculumRef: 'Atomic Structure and Electrons', sequence: 48, depth: 'core' },
    { canonicalId: 'lhs:chem.proton', curriculumRef: 'Subatomic Particles — Protons', sequence: 49, depth: 'core' },
    { canonicalId: 'lhs:chem.electron', curriculumRef: 'Subatomic Particles — Electrons', sequence: 50, depth: 'core' },
    { canonicalId: 'lhs:chem.element', curriculumRef: 'Chemical Elements', sequence: 51, depth: 'core' },
    { canonicalId: 'lhs:chem.periodic-table', curriculumRef: 'Periodic Table of Elements', sequence: 52, depth: 'core' },
    { canonicalId: 'lhs:chem.compound', curriculumRef: 'Chemical Compounds', sequence: 53, depth: 'core' },
    { canonicalId: 'lhs:chem.ionic-bond', curriculumRef: 'Chemical Bonding — Ionic', sequence: 54, depth: 'core' },
    { canonicalId: 'lhs:chem.covalent-bond', curriculumRef: 'Chemical Bonding — Covalent', sequence: 55, depth: 'core' },
    { canonicalId: 'lhs:chem.chemical-reaction', curriculumRef: 'Chemical Reactions and Equations', sequence: 56, depth: 'core' },
    { canonicalId: 'lhs:chem.acid', curriculumRef: 'Acids, Bases and Salts — Acids', sequence: 57, depth: 'core' },
    { canonicalId: 'lhs:chem.base', curriculumRef: 'Acids, Bases and Salts — Bases', sequence: 58, depth: 'core' },
    { canonicalId: 'lhs:chem.ph-scale', curriculumRef: 'pH Scale and Indicators', sequence: 59, depth: 'core' },
    { canonicalId: 'lhs:chem.neutralization', curriculumRef: 'Acid-Base Neutralization', sequence: 60, depth: 'core' },
    // Biology
    { canonicalId: 'lhs:bio.cell', curriculumRef: 'Cell — Basic Unit of Life', sequence: 61, depth: 'core' },
    { canonicalId: 'lhs:bio.plant-cell', curriculumRef: 'Plant Cell Structure', sequence: 62, depth: 'core' },
    { canonicalId: 'lhs:bio.animal-cell', curriculumRef: 'Animal Cell Structure', sequence: 63, depth: 'core' },
    { canonicalId: 'lhs:bio.photosynthesis', curriculumRef: 'Photosynthesis', sequence: 64, depth: 'core' },
    { canonicalId: 'lhs:bio.cellular-respiration', curriculumRef: 'Cellular Respiration', sequence: 65, depth: 'core' },
    { canonicalId: 'lhs:bio.enzyme', curriculumRef: 'Enzymes and Biocatalysis', sequence: 66, depth: 'core' },
    { canonicalId: 'lhs:bio.dna', curriculumRef: 'DNA Structure and Heredity', sequence: 67, depth: 'core' },
    { canonicalId: 'lhs:bio.gene', curriculumRef: 'Genes and Traits', sequence: 68, depth: 'core' },
    { canonicalId: 'lhs:bio.natural-selection', curriculumRef: 'Evolution and Natural Selection', sequence: 69, depth: 'core' },
    { canonicalId: 'lhs:bio.ecosystem', curriculumRef: 'Ecosystems and Environment', sequence: 70, depth: 'core' },
    // Earth & Space
    { canonicalId: 'lhs:earth.earth-system', curriculumRef: 'Earth Spheres and Systems', sequence: 71, depth: 'core' },
    { canonicalId: 'lhs:earth.atmosphere', curriculumRef: 'Atmosphere and Weather', sequence: 72, depth: 'core' },
    { canonicalId: 'lhs:earth.plate-tectonics', curriculumRef: 'Geology and Plate Tectonics', sequence: 73, depth: 'core' },
    { canonicalId: 'lhs:earth.greenhouse-effect', curriculumRef: 'Greenhouse Effect and Climate', sequence: 74, depth: 'core' },
    { canonicalId: 'lhs:earth.seasons-cause', curriculumRef: 'Earth Axis and Seasons', sequence: 75, depth: 'core' },
    { canonicalId: 'lhs:earth.big-bang-theory', curriculumRef: 'Universe and Big Bang Theory', sequence: 76, depth: 'core' },
    // Practices & Engineering
    { canonicalId: 'lhs:practice.scientific-observation', curriculumRef: 'Scientific Practice — Observation', sequence: 77, depth: 'core' },
    { canonicalId: 'lhs:epist.observation-vs-inference', curriculumRef: 'Nature of Science — Inference', sequence: 78, depth: 'core' },
    { canonicalId: 'lhs:eng.engineering-design-process', curriculumRef: 'Engineering Design Process', sequence: 79, depth: 'core' },
  ],
};

/**
 * CBSE India Class 9-10 Physics mapping.
 *
 * Based on CBSE Science curriculum (Physics portion).
 */
export const CBSE_GRADE10: GradeCurriculumMapping = {
  curriculum: 'cbse',
  grade: 10,
  subject: 'physics',
  topics: [
    { canonicalId: 'lhs:phys.motion', curriculumRef: 'Motion', sequence: 1, depth: 'core' },
    { canonicalId: 'lhs:phys.distance', curriculumRef: 'Motion — Distance and Displacement', sequence: 2, depth: 'core' },
    { canonicalId: 'lhs:phys.displacement', curriculumRef: 'Motion — Distance and Displacement', sequence: 3, depth: 'core' },
    { canonicalId: 'lhs:phys.speed', curriculumRef: 'Motion — Speed', sequence: 4, depth: 'core' },
    { canonicalId: 'lhs:phys.velocity', curriculumRef: 'Motion — Velocity', sequence: 5, depth: 'core' },
    { canonicalId: 'lhs:phys.acceleration', curriculumRef: 'Motion — Acceleration', sequence: 6, depth: 'core' },
    { canonicalId: 'lhs:phys.graphical-analysis', curriculumRef: 'Graphical Representation of Motion', sequence: 7, depth: 'core' },
    { canonicalId: 'lhs:phys.force', curriculumRef: 'Force and Laws of Motion', sequence: 8, depth: 'core' },
    { canonicalId: 'lhs:phys.newtons-first-law', curriculumRef: 'Newton\'s First Law', sequence: 9, depth: 'core' },
    { canonicalId: 'lhs:phys.inertia', curriculumRef: 'Inertia', sequence: 10, depth: 'core' },
    { canonicalId: 'lhs:phys.newtons-second-law', curriculumRef: 'Newton\'s Second Law', sequence: 11, depth: 'core' },
    { canonicalId: 'lhs:phys.momentum', curriculumRef: 'Momentum', sequence: 12, depth: 'core' },
    { canonicalId: 'lhs:phys.impulse', curriculumRef: 'Impulse', sequence: 13, depth: 'extended' },
    { canonicalId: 'lhs:phys.newtons-third-law', curriculumRef: 'Newton\'s Third Law', sequence: 14, depth: 'core' },
    { canonicalId: 'lhs:phys.gravitation', curriculumRef: 'Gravitation', sequence: 15, depth: 'core' },
    { canonicalId: 'lhs:phys.free-fall', curriculumRef: 'Free Fall', sequence: 16, depth: 'core' },
    { canonicalId: 'lhs:phys.work', curriculumRef: 'Work and Energy', sequence: 17, depth: 'core' },
    { canonicalId: 'lhs:phys.energy', curriculumRef: 'Work and Energy', sequence: 18, depth: 'core' },
    { canonicalId: 'lhs:phys.kinetic-energy', curriculumRef: 'Kinetic Energy', sequence: 19, depth: 'core' },
    { canonicalId: 'lhs:phys.potential-energy', curriculumRef: 'Potential Energy', sequence: 20, depth: 'core' },
    { canonicalId: 'lhs:phys.conservation-of-energy', curriculumRef: 'Conservation of Energy', sequence: 21, depth: 'core' },
    { canonicalId: 'lhs:phys.power', curriculumRef: 'Power', sequence: 22, depth: 'core' },
    { canonicalId: 'lhs:phys.sound', curriculumRef: 'Sound', sequence: 23, depth: 'core' },
    { canonicalId: 'lhs:phys.wave', curriculumRef: 'Sound — Wave Nature', sequence: 24, depth: 'core' },
    { canonicalId: 'lhs:phys.electric-charge', curriculumRef: 'Electricity — Charge', sequence: 25, depth: 'core' },
    { canonicalId: 'lhs:phys.current', curriculumRef: 'Electricity — Current', sequence: 26, depth: 'core' },
    { canonicalId: 'lhs:phys.voltage', curriculumRef: 'Electricity — Potential Difference', sequence: 27, depth: 'core' },
    { canonicalId: 'lhs:phys.resistance', curriculumRef: 'Electricity — Resistance', sequence: 28, depth: 'core' },
    { canonicalId: 'lhs:phys.ohms-law', curriculumRef: 'Ohm\'s Law', sequence: 29, depth: 'core' },
    { canonicalId: 'lhs:phys.heating-effect', curriculumRef: 'Heating Effect of Current', sequence: 30, depth: 'core' },
    { canonicalId: 'lhs:phys.magnetic-field', curriculumRef: 'Magnetic Effects of Current', sequence: 31, depth: 'core' },
    { canonicalId: 'lhs:phys.electromagnetism', curriculumRef: 'Electromagnetism', sequence: 32, depth: 'core' },
    { canonicalId: 'lhs:phys.electromagnetic-induction', curriculumRef: 'Electromagnetic Induction', sequence: 33, depth: 'core' },
    { canonicalId: 'lhs:phys.light', curriculumRef: 'Light — Reflection and Refraction', sequence: 34, depth: 'core' },
    { canonicalId: 'lhs:phys.reflection', curriculumRef: 'Reflection of Light', sequence: 35, depth: 'core' },
    { canonicalId: 'lhs:phys.refraction', curriculumRef: 'Refraction of Light', sequence: 36, depth: 'core' },
    { canonicalId: 'lhs:phys.lens', curriculumRef: 'Refraction by Lenses', sequence: 37, depth: 'core' },
    { canonicalId: 'lhs:phys.mirror', curriculumRef: 'Reflection by Spherical Mirrors', sequence: 38, depth: 'core' },
    { canonicalId: 'lhs:phys.atomic-structure', curriculumRef: 'Structure of Atom', sequence: 39, depth: 'core' },
    { canonicalId: 'lhs:phys.energy-sources', curriculumRef: 'Sources of Energy', sequence: 40, depth: 'core' },
  ],
};

/**
 * UK GCSE (KS4) Physics mapping.
 *
 * Based on AQA/OCR GCSE Physics specification.
 */
export const UK_GCSE_GRADE10: GradeCurriculumMapping = {
  curriculum: 'uk_gcse',
  grade: 10,
  subject: 'physics',
  topics: [
    { canonicalId: 'lhs:phys.energy', curriculumRef: 'Energy', sequence: 1, depth: 'core' },
    { canonicalId: 'lhs:phys.kinetic-energy', curriculumRef: 'Energy — Kinetic Store', sequence: 2, depth: 'core' },
    { canonicalId: 'lhs:phys.potential-energy', curriculumRef: 'Energy — Gravitational Potential Store', sequence: 3, depth: 'core' },
    { canonicalId: 'lhs:phys.conservation-of-energy', curriculumRef: 'Energy — Conservation', sequence: 4, depth: 'core' },
    { canonicalId: 'lhs:phys.power', curriculumRef: 'Energy — Power', sequence: 5, depth: 'core' },
    { canonicalId: 'lhs:phys.work', curriculumRef: 'Energy — Work Done', sequence: 6, depth: 'core' },
    { canonicalId: 'lhs:phys.efficiency', curriculumRef: 'Energy — Efficiency', sequence: 7, depth: 'core' },
    { canonicalId: 'lhs:phys.density', curriculumRef: 'Particle Model — Density', sequence: 8, depth: 'core' },
    { canonicalId: 'lhs:phys.thermal-energy', curriculumRef: 'Particle Model — Internal Energy', sequence: 9, depth: 'core' },
    { canonicalId: 'lhs:phys.specific-heat', curriculumRef: 'Particle Model — Specific Heat', sequence: 10, depth: 'core' },
    { canonicalId: 'lhs:phys.change-of-state', curriculumRef: 'Particle Model — Change of State', sequence: 11, depth: 'core' },
    { canonicalId: 'lhs:phys.pressure', curriculumRef: 'Particle Model — Gas Pressure', sequence: 12, depth: 'core' },
    { canonicalId: 'lhs:phys.atomic-structure', curriculumRef: 'Atomic Structure', sequence: 13, depth: 'core' },
    { canonicalId: 'lhs:phys.radioactivity', curriculumRef: 'Atomic Structure — Radiation', sequence: 14, depth: 'core' },
    { canonicalId: 'lhs:phys.nuclear-fission', curriculumRef: 'Atomic Structure — Fission', sequence: 15, depth: 'core' },
    { canonicalId: 'lhs:phys.nuclear-fusion', curriculumRef: 'Atomic Structure — Fusion', sequence: 16, depth: 'core' },
    { canonicalId: 'lhs:phys.electric-charge', curriculumRef: 'Electricity — Charge', sequence: 17, depth: 'core' },
    { canonicalId: 'lhs:phys.current', curriculumRef: 'Electricity — Current', sequence: 18, depth: 'core' },
    { canonicalId: 'lhs:phys.voltage', curriculumRef: 'Electricity — Potential Difference', sequence: 19, depth: 'core' },
    { canonicalId: 'lhs:phys.resistance', curriculumRef: 'Electricity — Resistance', sequence: 20, depth: 'core' },
    { canonicalId: 'lhs:phys.ohms-law', curriculumRef: "Ohm's Law", sequence: 21, depth: 'core' },
    { canonicalId: 'lhs:phys.magnetism', curriculumRef: 'Magnetism', sequence: 22, depth: 'core' },
    { canonicalId: 'lhs:phys.magnetic-field', curriculumRef: 'Magnetism — Fields', sequence: 23, depth: 'core' },
    { canonicalId: 'lhs:phys.electromagnetism', curriculumRef: 'Electromagnetism', sequence: 24, depth: 'core' },
    { canonicalId: 'lhs:phys.electromagnetic-induction', curriculumRef: 'Electromagnetic Induction', sequence: 25, depth: 'core' },
    { canonicalId: 'lhs:phys.force', curriculumRef: 'Forces', sequence: 26, depth: 'core' },
    { canonicalId: 'lhs:phys.newtons-first-law', curriculumRef: 'Forces — First Law', sequence: 27, depth: 'core' },
    { canonicalId: 'lhs:phys.newtons-second-law', curriculumRef: 'Forces — Second Law', sequence: 28, depth: 'core' },
    { canonicalId: 'lhs:phys.newtons-third-law', curriculumRef: 'Forces — Third Law', sequence: 29, depth: 'core' },
    { canonicalId: 'lhs:phys.momentum', curriculumRef: 'Forces — Momentum', sequence: 30, depth: 'core' },
    { canonicalId: 'lhs:phys.wave', curriculumRef: 'Waves', sequence: 31, depth: 'core' },
    { canonicalId: 'lhs:phys.wavelength', curriculumRef: 'Waves — Wavelength', sequence: 32, depth: 'core' },
    { canonicalId: 'lhs:phys.frequency', curriculumRef: 'Waves — Frequency', sequence: 33, depth: 'core' },
    { canonicalId: 'lhs:phys.electromagnetic-spectrum', curriculumRef: 'Waves — EM Spectrum', sequence: 34, depth: 'core' },
    { canonicalId: 'lhs:phys.light', curriculumRef: 'Waves — Light', sequence: 35, depth: 'core' },
    { canonicalId: 'lhs:phys.reflection', curriculumRef: 'Waves — Reflection', sequence: 36, depth: 'core' },
    { canonicalId: 'lhs:phys.refraction', curriculumRef: 'Waves — Refraction', sequence: 37, depth: 'core' },
    { canonicalId: 'lhs:phys.sound', curriculumRef: 'Waves — Sound', sequence: 38, depth: 'core' },
    { canonicalId: 'lhs:phys.gravitation', curriculumRef: 'Space Physics', sequence: 39, depth: 'extended' },
    { canonicalId: 'lhs:phys.free-fall', curriculumRef: 'Space Physics — Gravitational Field', sequence: 40, depth: 'extended' },
  ],
};

/**
 * US NGSS High School Physics mapping.
 *
 * Based on Next Generation Science Standards (Grades 9-12, through Grade 10 equivalent).
 */
export const NGSS_GRADE10: GradeCurriculumMapping = {
  curriculum: 'ngss',
  grade: 10,
  subject: 'physics',
  topics: [
    { canonicalId: 'lhs:phys.force', curriculumRef: 'Forces and Interactions', sequence: 1, depth: 'core' },
    { canonicalId: 'lhs:phys.newtons-first-law', curriculumRef: 'Forces and Interactions', sequence: 2, depth: 'core' },
    { canonicalId: 'lhs:phys.newtons-second-law', curriculumRef: 'Forces and Interactions', sequence: 3, depth: 'core' },
    { canonicalId: 'lhs:phys.newtons-third-law', curriculumRef: 'Forces and Interactions', sequence: 4, depth: 'core' },
    { canonicalId: 'lhs:phys.momentum', curriculumRef: 'Forces and Interactions — Momentum', sequence: 5, depth: 'core' },
    { canonicalId: 'lhs:phys.impulse', curriculumRef: 'Forces and Interactions — Impulse', sequence: 6, depth: 'core' },
    { canonicalId: 'lhs:phys.energy', curriculumRef: 'Energy', sequence: 7, depth: 'core' },
    { canonicalId: 'lhs:phys.kinetic-energy', curriculumRef: 'Energy — Kinetic', sequence: 8, depth: 'core' },
    { canonicalId: 'lhs:phys.potential-energy', curriculumRef: 'Energy — Potential', sequence: 9, depth: 'core' },
    { canonicalId: 'lhs:phys.conservation-of-energy', curriculumRef: 'Energy — Conservation', sequence: 10, depth: 'core' },
    { canonicalId: 'lhs:phys.work', curriculumRef: 'Energy — Work', sequence: 11, depth: 'core' },
    { canonicalId: 'lhs:phys.power', curriculumRef: 'Energy — Power', sequence: 12, depth: 'core' },
    { canonicalId: 'lhs:phys.wave', curriculumRef: 'Waves and EM Radiation', sequence: 13, depth: 'core' },
    { canonicalId: 'lhs:phys.wavelength', curriculumRef: 'Waves — Properties', sequence: 14, depth: 'core' },
    { canonicalId: 'lhs:phys.frequency', curriculumRef: 'Waves — Properties', sequence: 15, depth: 'core' },
    { canonicalId: 'lhs:phys.electromagnetic-spectrum', curriculumRef: 'Waves — EM Radiation', sequence: 16, depth: 'core' },
    { canonicalId: 'lhs:phys.atomic-structure', curriculumRef: 'Structure and Properties of Matter', sequence: 17, depth: 'core' },
    { canonicalId: 'lhs:phys.radioactivity', curriculumRef: 'Nuclear Processes', sequence: 18, depth: 'core' },
    { canonicalId: 'lhs:phys.nuclear-fission', curriculumRef: 'Nuclear Processes — Fission', sequence: 19, depth: 'core' },
    { canonicalId: 'lhs:phys.nuclear-fusion', curriculumRef: 'Nuclear Processes — Fusion', sequence: 20, depth: 'core' },
    { canonicalId: 'lhs:phys.electric-charge', curriculumRef: 'Electric and Magnetic Forces', sequence: 21, depth: 'core' },
    { canonicalId: 'lhs:phys.current', curriculumRef: 'Electric and Magnetic Forces', sequence: 22, depth: 'core' },
    { canonicalId: 'lhs:phys.voltage', curriculumRef: 'Electric and Magnetic Forces', sequence: 23, depth: 'core' },
    { canonicalId: 'lhs:phys.resistance', curriculumRef: 'Electric and Magnetic Forces', sequence: 24, depth: 'core' },
    { canonicalId: 'lhs:phys.ohms-law', curriculumRef: 'Electric and Magnetic Forces', sequence: 25, depth: 'core' },
    { canonicalId: 'lhs:phys.magnetic-field', curriculumRef: 'Electric and Magnetic Forces', sequence: 26, depth: 'core' },
    { canonicalId: 'lhs:phys.electromagnetism', curriculumRef: 'Electric and Magnetic Forces', sequence: 27, depth: 'core' },
    { canonicalId: 'lhs:phys.electromagnetic-induction', curriculumRef: 'Electric and Magnetic Forces', sequence: 28, depth: 'core' },
    { canonicalId: 'lhs:phys.gravitation', curriculumRef: 'Forces — Gravitational', sequence: 29, depth: 'core' },
    { canonicalId: 'lhs:phys.free-fall', curriculumRef: 'Forces — Free Fall', sequence: 30, depth: 'core' },
  ],
};

/**
 * IB MYP (Years 4-5) Physics mapping.
 *
 * Based on IB MYP Science framework (Physics strand).
 */
export const IB_MYP_GRADE10: GradeCurriculumMapping = {
  curriculum: 'ib_myp',
  grade: 10,
  subject: 'physics',
  topics: [
    { canonicalId: 'lhs:phys.force', curriculumRef: 'Forces and Motion', sequence: 1, depth: 'core' },
    { canonicalId: 'lhs:phys.newtons-first-law', curriculumRef: 'Forces and Motion', sequence: 2, depth: 'core' },
    { canonicalId: 'lhs:phys.newtons-second-law', curriculumRef: 'Forces and Motion', sequence: 3, depth: 'core' },
    { canonicalId: 'lhs:phys.newtons-third-law', curriculumRef: 'Forces and Motion', sequence: 4, depth: 'core' },
    { canonicalId: 'lhs:phys.momentum', curriculumRef: 'Forces and Motion', sequence: 5, depth: 'core' },
    { canonicalId: 'lhs:phys.energy', curriculumRef: 'Energy', sequence: 6, depth: 'core' },
    { canonicalId: 'lhs:phys.kinetic-energy', curriculumRef: 'Energy', sequence: 7, depth: 'core' },
    { canonicalId: 'lhs:phys.potential-energy', curriculumRef: 'Energy', sequence: 8, depth: 'core' },
    { canonicalId: 'lhs:phys.conservation-of-energy', curriculumRef: 'Energy', sequence: 9, depth: 'core' },
    { canonicalId: 'lhs:phys.work', curriculumRef: 'Energy', sequence: 10, depth: 'core' },
    { canonicalId: 'lhs:phys.power', curriculumRef: 'Energy', sequence: 11, depth: 'core' },
    { canonicalId: 'lhs:phys.wave', curriculumRef: 'Waves', sequence: 12, depth: 'core' },
    { canonicalId: 'lhs:phys.wavelength', curriculumRef: 'Waves', sequence: 13, depth: 'core' },
    { canonicalId: 'lhs:phys.frequency', curriculumRef: 'Waves', sequence: 14, depth: 'core' },
    { canonicalId: 'lhs:phys.electromagnetic-spectrum', curriculumRef: 'Waves', sequence: 15, depth: 'core' },
    { canonicalId: 'lhs:phys.light', curriculumRef: 'Waves', sequence: 16, depth: 'core' },
    { canonicalId: 'lhs:phys.reflection', curriculumRef: 'Waves', sequence: 17, depth: 'core' },
    { canonicalId: 'lhs:phys.refraction', curriculumRef: 'Waves', sequence: 18, depth: 'core' },
    { canonicalId: 'lhs:phys.sound', curriculumRef: 'Waves', sequence: 19, depth: 'core' },
    { canonicalId: 'lhs:phys.electric-charge', curriculumRef: 'Electricity and Magnetism', sequence: 20, depth: 'core' },
    { canonicalId: 'lhs:phys.current', curriculumRef: 'Electricity and Magnetism', sequence: 21, depth: 'core' },
    { canonicalId: 'lhs:phys.voltage', curriculumRef: 'Electricity and Magnetism', sequence: 22, depth: 'core' },
    { canonicalId: 'lhs:phys.resistance', curriculumRef: 'Electricity and Magnetism', sequence: 23, depth: 'core' },
    { canonicalId: 'lhs:phys.ohms-law', curriculumRef: 'Electricity and Magnetism', sequence: 24, depth: 'core' },
    { canonicalId: 'lhs:phys.magnetic-field', curriculumRef: 'Electricity and Magnetism', sequence: 25, depth: 'core' },
    { canonicalId: 'lhs:phys.electromagnetism', curriculumRef: 'Electricity and Magnetism', sequence: 26, depth: 'core' },
    { canonicalId: 'lhs:phys.electromagnetic-induction', curriculumRef: 'Electricity and Magnetism', sequence: 27, depth: 'core' },
    { canonicalId: 'lhs:phys.thermal-energy', curriculumRef: 'Thermal Physics', sequence: 28, depth: 'core' },
    { canonicalId: 'lhs:phys.heat', curriculumRef: 'Thermal Physics', sequence: 29, depth: 'core' },
    { canonicalId: 'lhs:phys.temperature', curriculumRef: 'Thermal Physics', sequence: 30, depth: 'core' },
    { canonicalId: 'lhs:phys.specific-heat', curriculumRef: 'Thermal Physics', sequence: 31, depth: 'core' },
    { canonicalId: 'lhs:phys.change-of-state', curriculumRef: 'Thermal Physics', sequence: 32, depth: 'core' },
    { canonicalId: 'lhs:phys.atomic-structure', curriculumRef: 'Atomic and Nuclear Physics', sequence: 33, depth: 'core' },
    { canonicalId: 'lhs:phys.radioactivity', curriculumRef: 'Atomic and Nuclear Physics', sequence: 34, depth: 'core' },
    { canonicalId: 'lhs:phys.nuclear-fission', curriculumRef: 'Atomic and Nuclear Physics', sequence: 35, depth: 'core' },
    { canonicalId: 'lhs:phys.nuclear-fusion', curriculumRef: 'Atomic and Nuclear Physics', sequence: 36, depth: 'core' },
    { canonicalId: 'lhs:phys.gravitation', curriculumRef: 'Space Physics', sequence: 37, depth: 'extended' },
    { canonicalId: 'lhs:phys.free-fall', curriculumRef: 'Space Physics', sequence: 38, depth: 'extended' },
  ],
};

/**
 * Nepal NEB Grade 11 Physics mapping (senior secondary — Science Faculty).
 *
 * Based on the NEB Curriculum Development Centre Science Syllabus (Physics).
 * Covers the mechanics, thermal, wave/optics and foundational electricity topics
 * expected in Grade 11.
 */
export const NEPAL_NEB_GRADE11: GradeCurriculumMapping = {
  curriculum: 'neb_nepal',
  grade: 11,
  subject: 'physics',
  topics: [
    // Units & physical quantities
    { canonicalId: 'lhs:phys.physical-quantity', curriculumRef: 'Physical Quantities', sequence: 1, depth: 'core' },
    { canonicalId: 'lhs:phys.unit', curriculumRef: 'SI Units', sequence: 2, depth: 'core' },
    { canonicalId: 'lhs:phys.scalar', curriculumRef: 'Scalars and Vectors', sequence: 3, depth: 'core' },
    { canonicalId: 'lhs:phys.vector', curriculumRef: 'Scalars and Vectors', sequence: 4, depth: 'core' },
    // Kinematics
    { canonicalId: 'lhs:phys.distance', curriculumRef: 'Kinematics', sequence: 5, depth: 'core' },
    { canonicalId: 'lhs:phys.displacement', curriculumRef: 'Kinematics', sequence: 6, depth: 'core' },
    { canonicalId: 'lhs:phys.speed', curriculumRef: 'Kinematics', sequence: 7, depth: 'core' },
    { canonicalId: 'lhs:phys.velocity', curriculumRef: 'Kinematics', sequence: 8, depth: 'core' },
    { canonicalId: 'lhs:phys.acceleration', curriculumRef: 'Kinematics', sequence: 9, depth: 'core' },
    { canonicalId: 'lhs:phys.graphical-analysis', curriculumRef: 'Kinematics (graphs)', sequence: 10, depth: 'extended' },
    { canonicalId: 'lhs:phys.projectile-motion', curriculumRef: 'Projectile Motion', sequence: 11, depth: 'core' },
    // Dynamics
    { canonicalId: 'lhs:phys.force', curriculumRef: 'Dynamics', sequence: 12, depth: 'core' },
    { canonicalId: 'lhs:phys.inertia', curriculumRef: 'Dynamics', sequence: 13, depth: 'core' },
    { canonicalId: 'lhs:phys.newtons-first-law', curriculumRef: "Newton's Laws", sequence: 14, depth: 'core' },
    { canonicalId: 'lhs:phys.newtons-second-law', curriculumRef: "Newton's Laws", sequence: 15, depth: 'core' },
    { canonicalId: 'lhs:phys.newtons-third-law', curriculumRef: "Newton's Laws", sequence: 16, depth: 'core' },
    { canonicalId: 'lhs:phys.friction', curriculumRef: 'Dynamics — Friction', sequence: 17, depth: 'core' },
    { canonicalId: 'lhs:phys.momentum', curriculumRef: 'Dynamics — Momentum', sequence: 18, depth: 'core' },
    { canonicalId: 'lhs:phys.impulse', curriculumRef: 'Dynamics — Impulse', sequence: 19, depth: 'core' },
    // Work, energy & power
    { canonicalId: 'lhs:phys.work', curriculumRef: 'Work, Energy and Power', sequence: 20, depth: 'core' },
    { canonicalId: 'lhs:phys.kinetic-energy', curriculumRef: 'Work, Energy and Power', sequence: 21, depth: 'core' },
    { canonicalId: 'lhs:phys.potential-energy', curriculumRef: 'Work, Energy and Power', sequence: 22, depth: 'core' },
    { canonicalId: 'lhs:phys.conservation-of-energy', curriculumRef: 'Work, Energy and Power', sequence: 23, depth: 'core' },
    { canonicalId: 'lhs:phys.work-energy-theorem', curriculumRef: 'Work, Energy and Power', sequence: 24, depth: 'core' },
    { canonicalId: 'lhs:phys.power', curriculumRef: 'Work, Energy and Power', sequence: 25, depth: 'core' },
    { canonicalId: 'lhs:phys.efficiency', curriculumRef: 'Work, Energy and Power', sequence: 26, depth: 'extended' },
    // Gravitation
    { canonicalId: 'lhs:phys.gravitation', curriculumRef: 'Gravitation', sequence: 27, depth: 'core' },
    { canonicalId: 'lhs:phys.gravitational-acceleration', curriculumRef: 'Gravitation', sequence: 28, depth: 'core' },
    { canonicalId: 'lhs:phys.free-fall', curriculumRef: 'Gravitation — Free Fall', sequence: 29, depth: 'core' },
    { canonicalId: 'lhs:phys.newtons-law-of-gravitation', curriculumRef: 'Gravitation', sequence: 30, depth: 'core' },
    // Thermal / heat
    { canonicalId: 'lhs:phys.temperature', curriculumRef: 'Heat and Temperature', sequence: 31, depth: 'core' },
    { canonicalId: 'lhs:phys.heat', curriculumRef: 'Heat and Temperature', sequence: 32, depth: 'core' },
    { canonicalId: 'lhs:phys.thermal-energy', curriculumRef: 'Heat and Temperature', sequence: 33, depth: 'core' },
    { canonicalId: 'lhs:phys.specific-heat', curriculumRef: 'Heat and Temperature', sequence: 34, depth: 'core' },
    { canonicalId: 'lhs:phys.change-of-state', curriculumRef: 'Change of State', sequence: 35, depth: 'extended' },
    // Waves & sound
    { canonicalId: 'lhs:phys.wave', curriculumRef: 'Wave Motion', sequence: 36, depth: 'core' },
    { canonicalId: 'lhs:phys.wavelength', curriculumRef: 'Wave Motion', sequence: 37, depth: 'core' },
    { canonicalId: 'lhs:phys.frequency', curriculumRef: 'Wave Motion', sequence: 38, depth: 'core' },
    { canonicalId: 'lhs:phys.amplitude', curriculumRef: 'Wave Motion', sequence: 39, depth: 'core' },
    { canonicalId: 'lhs:phys.wave-speed', curriculumRef: 'Wave Motion', sequence: 40, depth: 'core' },
    { canonicalId: 'lhs:phys.sound', curriculumRef: 'Sound', sequence: 41, depth: 'core' },
    // Optics
    { canonicalId: 'lhs:phys.light', curriculumRef: 'Optics', sequence: 42, depth: 'core' },
    { canonicalId: 'lhs:phys.ray-model', curriculumRef: 'Optics', sequence: 43, depth: 'core' },
    { canonicalId: 'lhs:phys.reflection', curriculumRef: 'Optics', sequence: 44, depth: 'core' },
    { canonicalId: 'lhs:phys.refraction', curriculumRef: 'Optics', sequence: 45, depth: 'core' },
    { canonicalId: 'lhs:phys.mirror', curriculumRef: 'Optics', sequence: 46, depth: 'core' },
    { canonicalId: 'lhs:phys.lens', curriculumRef: 'Optics', sequence: 47, depth: 'core' },
    { canonicalId: 'lhs:phys.electromagnetic-spectrum', curriculumRef: 'Optics', sequence: 48, depth: 'extended' },
    // Electricity & magnetism
    { canonicalId: 'lhs:phys.electric-charge', curriculumRef: 'Electricity', sequence: 49, depth: 'core' },
    { canonicalId: 'lhs:phys.current', curriculumRef: 'Electricity', sequence: 50, depth: 'core' },
    { canonicalId: 'lhs:phys.resistance', curriculumRef: 'Electricity', sequence: 51, depth: 'core' },
    { canonicalId: 'lhs:phys.voltage', curriculumRef: 'Electricity', sequence: 52, depth: 'core' },
    { canonicalId: 'lhs:phys.ohms-law', curriculumRef: 'Electricity', sequence: 53, depth: 'core' },
    { canonicalId: 'lhs:phys.heating-effect', curriculumRef: 'Electricity', sequence: 54, depth: 'extended' },
    { canonicalId: 'lhs:phys.magnetism', curriculumRef: 'Magnetism', sequence: 55, depth: 'core' },
    { canonicalId: 'lhs:phys.magnetic-field', curriculumRef: 'Magnetism', sequence: 56, depth: 'core' },
    { canonicalId: 'lhs:phys.magnetic-flux', curriculumRef: 'Magnetism', sequence: 57, depth: 'extended' },
    { canonicalId: 'lhs:phys.electromagnetism', curriculumRef: 'Electromagnetism', sequence: 58, depth: 'extended' },
  ],
};

/**
 * Nepal NEB Grade 12 Physics mapping (senior secondary — Science Faculty).
 *
 * Continues the NEB senior-secondary syllabus into the harder dynamics,
 * electromagnetism, modern and nuclear physics topics expected in Grade 12.
 */
export const NEPAL_NEB_GRADE12: GradeCurriculumMapping = {
  curriculum: 'neb_nepal',
  grade: 12,
  subject: 'physics',
  topics: [
    // Mechanics (deeper)
    { canonicalId: 'lhs:phys.projectile-motion', curriculumRef: 'Mechanics — Projectile Motion', sequence: 1, depth: 'core' },
    { canonicalId: 'lhs:phys.momentum', curriculumRef: 'Mechanics — Momentum', sequence: 2, depth: 'core' },
    { canonicalId: 'lhs:phys.impulse', curriculumRef: 'Mechanics — Impulse', sequence: 3, depth: 'core' },
    { canonicalId: 'lhs:phys.work-energy-theorem', curriculumRef: 'Mechanics — Work and Energy', sequence: 4, depth: 'core' },
    { canonicalId: 'lhs:phys.conservation-of-energy', curriculumRef: 'Mechanics — Work and Energy', sequence: 5, depth: 'core' },
    { canonicalId: 'lhs:phys.gravitation', curriculumRef: 'Gravitation', sequence: 6, depth: 'core' },
    { canonicalId: 'lhs:phys.newtons-law-of-gravitation', curriculumRef: 'Gravitation', sequence: 7, depth: 'core' },
    // Electrostatics & current electricity
    { canonicalId: 'lhs:phys.electric-charge', curriculumRef: 'Electrostatics', sequence: 8, depth: 'core' },
    { canonicalId: 'lhs:phys.coulombs-law', curriculumRef: 'Electrostatics', sequence: 9, depth: 'core' },
    { canonicalId: 'lhs:phys.current', curriculumRef: 'Current Electricity', sequence: 10, depth: 'core' },
    { canonicalId: 'lhs:phys.resistance', curriculumRef: 'Current Electricity', sequence: 11, depth: 'core' },
    { canonicalId: 'lhs:phys.voltage', curriculumRef: 'Current Electricity', sequence: 12, depth: 'core' },
    { canonicalId: 'lhs:phys.ohms-law', curriculumRef: 'Current Electricity', sequence: 13, depth: 'core' },
    { canonicalId: 'lhs:phys.heating-effect', curriculumRef: 'Current Electricity', sequence: 14, depth: 'core' },
    // Magnetism & electromagnetic induction
    { canonicalId: 'lhs:phys.magnetic-field', curriculumRef: 'Magnetism', sequence: 15, depth: 'core' },
    { canonicalId: 'lhs:phys.magnetic-flux', curriculumRef: 'Magnetism', sequence: 16, depth: 'core' },
    { canonicalId: 'lhs:phys.electromagnetism', curriculumRef: 'Electromagnetism', sequence: 17, depth: 'core' },
    { canonicalId: 'lhs:phys.electromagnetic-induction', curriculumRef: 'Electromagnetic Induction', sequence: 18, depth: 'core' },
    { canonicalId: 'lhs:phys.generator', curriculumRef: 'Electromagnetic Induction', sequence: 19, depth: 'core' },
    { canonicalId: 'lhs:phys.electric-motor', curriculumRef: 'Electromagnetic Induction', sequence: 20, depth: 'extended' },
    // Modern & nuclear physics
    { canonicalId: 'lhs:phys.atomic-structure', curriculumRef: 'Atomic and Nuclear Physics', sequence: 21, depth: 'core' },
    { canonicalId: 'lhs:phys.radioactivity', curriculumRef: 'Atomic and Nuclear Physics', sequence: 22, depth: 'core' },
    { canonicalId: 'lhs:phys.nuclear-fission', curriculumRef: 'Atomic and Nuclear Physics', sequence: 23, depth: 'core' },
    { canonicalId: 'lhs:phys.nuclear-fusion', curriculumRef: 'Atomic and Nuclear Physics', sequence: 24, depth: 'core' },
    { canonicalId: 'lhs:phys.energy-sources', curriculumRef: 'Energy Sources', sequence: 25, depth: 'core' },
    // Waves & optics (senior)
    { canonicalId: 'lhs:phys.wave', curriculumRef: 'Wave and Optics', sequence: 26, depth: 'core' },
    { canonicalId: 'lhs:phys.wave-speed', curriculumRef: 'Wave and Optics', sequence: 27, depth: 'core' },
    { canonicalId: 'lhs:phys.electromagnetic-spectrum', curriculumRef: 'Wave and Optics', sequence: 28, depth: 'extended' },
  ],
};

/**
 * All curriculum mappings, keyed by curriculum ID. NEB senior secondary has dedicated
 * Grade 11 and Grade 12 mappings; other curricula currently carry a single mapping.
 */
export const CURRICULUM_MAPPINGS: Record<CurriculumId, GradeCurriculumMapping[]> = {
  nepal_see: [NEPAL_SEE_GRADE10],
  neb_nepal: [NEPAL_NEB_GRADE11, NEPAL_NEB_GRADE12],
  cbse: [CBSE_GRADE10],
  uk_gcse: [UK_GCSE_GRADE10],
  ngss: [NGSS_GRADE10],
  ib_myp: [IB_MYP_GRADE10],
};

/**
 * Get mapping for a specific curriculum and grade.
 *
 * Grades 11–12 (senior secondary / A-Level) are being expanded topic-by-topic. Until a
 * dedicated higher-grade mapping exists we fall back to the closest mapping at-or-below
 * the requested grade so a learner is never left with an empty path. Callers can check
 * `mapping.grade !== grade` to surface a "senior-secondary coverage in progress" note.
 */
export function getCurriculumMapping(curriculum: CurriculumId, grade: number): GradeCurriculumMapping | undefined {
  const mappings = CURRICULUM_MAPPINGS[curriculum];
  if (!mappings || mappings.length === 0) return undefined;
  // Exact grade match wins.
  const exact = mappings.find((m) => m.grade === grade);
  if (exact) return exact;
  // Fall back to the closest available mapping at-or-below the requested grade so a
  // learner is never left with an empty path. Callers can check `mapping.grade !== grade`
  // to surface a "senior-secondary coverage in progress" note.
  const below = mappings
    .filter((m) => m.grade <= grade)
    .sort((a, b) => b.grade - a.grade)[0];
  if (below) return below;
  // Requested grade is below every mapping we have: use the lowest one.
  return [...mappings].sort((a, b) => a.grade - b.grade)[0];
}

/**
 * Get all available curricula.
 */
export function getAvailableCurricula(): CurriculumInfo[] {
  return Object.values(CURRICULUMS);
}
