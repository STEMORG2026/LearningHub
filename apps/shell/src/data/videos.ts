export interface VideoLesson {
  icon: string;
  subject: string;
  subjectColor: string;
  title: string;
  desc: string;
  href: string;
}

export interface NoteResource {
  icon: string;
  grade: string;
  gradeColor: string;
  title: string;
  desc: string;
  href: string;
}

export const VIDEO_LESSONS: VideoLesson[] = [
  {
    icon: 'calc',
    subject: 'MATHEMATICS',
    subjectColor: 'cyan',
    title: 'Quadratic Equations',
    desc: 'SEE & Grade 10 algebra concept walkthroughs.',
    href: 'https://www.youtube.com/@LearningHubSTEM',
  },
  {
    icon: 'bolt',
    subject: 'PHYSICS',
    subjectColor: 'green',
    title: 'Circular Motion',
    desc: 'NEB Grade 11 derivation breakdown.',
    href: 'https://www.youtube.com/@LearningHubSTEM',
  },
  {
    icon: 'flask',
    subject: 'CHEMISTRY',
    subjectColor: 'purple',
    title: 'Organic Mechanisms',
    desc: 'IUPAC naming and reaction mechanisms.',
    href: 'https://www.youtube.com/@LearningHubSTEM',
  },
];

export const NOTE_RESOURCES: NoteResource[] = [
  {
    icon: 'calc',
    grade: 'GRADE 9-10',
    gradeColor: 'cyan',
    title: 'C.Math Solutions',
    desc: 'Algebra and geometry past question sets.',
    href: '#',
  },
  {
    icon: 'flask',
    grade: 'GRADE 9-10',
    gradeColor: 'green',
    title: 'Science Exam Notes',
    desc: 'Physics, Chemistry, and Biology summaries.',
    href: '#',
  },
  {
    icon: 'bolt',
    grade: 'GRADE 11-12',
    gradeColor: 'purple',
    title: 'Physics Derivations',
    desc: 'Mechanics, Waves, and Optics derivations.',
    href: '#',
  },
];
