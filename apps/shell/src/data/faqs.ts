export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'How does LearningHub connect to STEMMA and PROFESSOR-J?',
    a: 'LearningHub imports canonical STEM facts directly from the STEMMA knowledge repository (224+ entities across Biology, Chemistry, Physics, Math, and CS) and provides interactive simulations and Web Components. PROFESSOR-J serves as the Socratic AI tutor that answers questions, guides learning, and analyzes highlighted text on the page.',
  },
  {
    q: 'How do I enroll in a tutoring program?',
    a: 'Contact us via WhatsApp or Phone to arrange a free consultation and level assessment session for STEM Tuition programs.',
  },
  {
    q: 'Are notes and practice papers provided?',
    a: 'Yes, full chapter revision notes, mock tests, and past paper solutions are provided to all enrolled students.',
  },
  {
    q: 'What are the class sizes for group batches?',
    a: 'We restrict group sizes to a maximum of 5–8 students to ensure every student receives personalized attention.',
  },
];
