export type ClassCategory = 'foundation' | 'see' | 'neb' | 'alevel';

export interface ClassOffering {
  id: string;
  cat: ClassCategory;
  icon: string;
  grade: string;
  title: string;
  desc: string;
  subjects: string[];
  seats: string;
}

export interface LearningMode {
  icon: string;
  title: string;
  desc: string;
  href?: string;
  action?: string;
}

export interface BatchTiming {
  time: string;
  label: string;
  color: string;
  desc: string;
}

export interface ClassDetail {
  id: string;
  icon: string;
  pill: string;
  title: string;
  desc: string;
  subjects: string[];
  resources: { label: string; href: string }[];
  enrollLabel: string;
}

export const CLASS_OFFERINGS: ClassOffering[] = [
  {
    id: 'g1_8',
    cat: 'foundation',
    icon: 'calc',
    grade: 'Grade 1 – 8',
    title: 'Foundation Level',
    desc: 'Conceptual tutoring in Math, Science & English for young learners.',
    subjects: ['Math', 'Science', 'English'],
    seats: '4 seats left',
  },
  {
    id: 'g9_10',
    cat: 'see',
    icon: 'flask',
    grade: 'Grade 9 – 10',
    title: 'SEE Board Prep',
    desc: 'Rigorous prep for Comp Math, Opt Math, Physics & Chemistry.',
    subjects: ['Comp. Math', 'Opt. Math', 'Science'],
    seats: '2 seats left',
  },
  {
    id: 'g11_12',
    cat: 'neb',
    icon: 'atom',
    grade: 'Grade 11 – 12',
    title: 'NEB Science',
    desc: 'In-depth Physics, Chemistry, Biology & Math coaching for NEB boards.',
    subjects: ['Physics', 'Chemistry', 'Math', 'Bio'],
    seats: '3 seats left',
  },
  {
    id: 'alevel',
    cat: 'alevel',
    icon: 'graduation',
    grade: 'A-Level',
    title: 'Cambridge A-Level',
    desc: 'Coaching for AS & A2 exams in Physics, Chemistry, Math & CS.',
    subjects: ['A-Level Math', 'Physics 9702', 'Chemistry 9701'],
    seats: '2 seats left',
  },
];

export const LEARNING_MODES: LearningMode[] = [
  { icon: 'home', title: 'Home Tuition', desc: 'Direct 1-on-1 personalized instruction at your home in Pokhara for individual progress.' },
  { icon: 'users', title: 'Group Batches', desc: 'Small peer groups (max 8 students) encouraging collaboration and interactive problem solving.' },
  { icon: 'laptop', title: 'Live Online Sessions', desc: 'Interactive HD live online sessions with digital whiteboard notes and recorded archives.' },
  { icon: 'file', title: 'Notes & Exam Materials', desc: 'Chapter revision notes, past paper practice sets, and formula sheets included with every class.', href: 'videos.html' },
];

export const BATCH_TIMINGS: BatchTiming[] = [
  { time: '6:00 AM – 8:00 AM', label: 'Morning Batch', color: 'cyan', desc: 'Ideal for students who focus best early in the morning before school hours.' },
  { time: '4:00 PM – 6:00 PM', label: 'After-School Batch', color: 'green', desc: 'Most popular slot — perfect transition immediately following school classes.' },
  { time: '6:00 PM – 8:00 PM', label: 'Evening Batch', color: 'purple', desc: 'Great for Grade 11–12 and A-Level students with busier daytime schedules.' },
];

export const CLASS_DETAILS: ClassDetail[] = [
  {
    id: 'g1_8',
    icon: 'calc',
    pill: 'Grade 1 – 8',
    title: 'Foundation STEM',
    desc: 'Building fundamental problem-solving concepts across Science, Mathematics, English, and Nepali.',
    subjects: ['Mathematics', 'Physics & Chem', 'Biology', 'English'],
    resources: [
      { label: 'Official Syllabus', href: 'https://moecdc.gov.np' },
      { label: 'Video Lessons', href: 'videos.html' },
    ],
    enrollLabel: 'Enroll Grade 1-8 →',
  },
  {
    id: 'g9_10',
    icon: 'flask',
    pill: 'Grade 9 – 10',
    title: 'SEE Board Preparation',
    desc: 'Targeted board preparation for Science, C.Math, Opt. Math, and Computer Science with past paper drills.',
    subjects: ['C. Math', 'Opt. Math', 'Science', 'Computer'],
    resources: [
      { label: 'Past Papers', href: 'videos.html' },
      { label: 'Mock Tests', href: 'videos.html' },
    ],
    enrollLabel: 'Enroll SEE Batch →',
  },
  {
    id: 'g11_12',
    icon: 'atom',
    pill: 'Grade 11 – 12',
    title: 'NEB Science Stream',
    desc: 'Advanced Physics, Chemistry, Biology, and Calculus coaching with IOE & IOM entrance orientation.',
    subjects: ['Physics', 'Chemistry', 'Calculus', 'Biology'],
    resources: [
      { label: 'Full Notes', href: 'videos.html' },
      { label: 'Derivations Sheet', href: 'videos.html' },
    ],
    enrollLabel: 'Enroll NEB Batch →',
  },
  {
    id: 'alevel',
    icon: 'graduation',
    pill: 'Cambridge A-Level',
    title: 'A-Level Programme',
    desc: 'Rigorous instruction for Cambridge AS & A2 exams in Mathematics, Physics (9702), Chemistry (9701), and CS.',
    subjects: ['A-Level Math', 'Physics 9702', 'Chemistry 9701'],
    resources: [
      { label: 'Past Papers', href: 'videos.html' },
      { label: 'Uni Prep', href: 'videos.html' },
    ],
    enrollLabel: 'Enroll A-Level →',
  },
];

export const GRADE_MAP: Record<string, string> = {
  g1_8: 'Grade 1 – 8 (Foundation)',
  g9_10: 'Grade 9 – 10 (SEE)',
  g11_12: 'Grade 11 – 12 (NEB)',
  alevel: 'Cambridge A-Level',
};
