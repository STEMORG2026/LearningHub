import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { StemLesson } from '../src/stem-lesson';
import type { LessonContent } from '@stem-tuition/content-provider';

describe('StemLesson Web Component', () => {
  let element: StemLesson;
  let shadowRoot: ShadowRoot;

  const mockLesson: LessonContent = {
    id: 'lesson-1',
    metadata: {
      displayName: 'Newton\'s Laws of Motion',
      subject: 'Physics',
      estimatedTimeMinutes: 45,
      gradeLevels: ['9', '10'],
      prerequisites: ['Vectors', 'Forces'],
      commonMisconceptions: ['Objects at rest stay at rest', 'Heavier objects fall faster'],
      tags: ['mechanics', 'forces', 'kinematics'],
    },
    sections: [
      {
        id: 'sec-1',
        kind: 'text',
        heading: 'Introduction',
        body: 'Newton\'s first law states that an object at rest stays at rest.',
        symbol: undefined,
      },
      {
        id: 'sec-2',
        kind: 'equation',
        heading: 'Force Equation',
        body: 'F = ma',
        symbol: 'Newton\'s Second Law',
      },
      {
        id: 'sec-3',
        kind: 'example',
        heading: 'Real World Example',
        body: 'A car accelerates at 5 m/s².',
        symbol: undefined,
      },
      {
        id: 'sec-4',
        kind: 'misconception',
        heading: 'Common Error',
        body: 'Many students think heavier objects fall faster.',
        symbol: undefined,
      },
      {
        id: 'sec-5',
        kind: 'story',
        heading: 'Historical Context',
        body: 'Isaac Newton discovered these laws in 1687.',
        symbol: undefined,
      },
      {
        id: 'sec-6',
        kind: 'analogy',
        heading: 'Helpful Comparison',
        body: 'Think of force like pushing a shopping cart.',
        symbol: undefined,
      },
      {
        id: 'sec-7',
        kind: 'try-this',
        heading: 'Hands-On Activity',
        body: 'Roll a ball on different surfaces.',
        symbol: undefined,
      },
      {
        id: 'sec-8',
        kind: 'fun-fact',
        heading: 'Did You Know?',
        body: 'Gravity is always 9.8 m/s² on Earth.',
        symbol: undefined,
      },
      {
        id: 'sec-9',
        kind: 'narrative',
        heading: 'The Story Continues',
        body: 'This understanding changed physics forever.',
        symbol: undefined,
      },
      {
        id: 'sec-10',
        kind: 'context',
        heading: 'Historical Background',
        body: '17th century scientific revolution',
        symbol: undefined,
      },
    ],
    questions: [
      {
        id: 'q-1',
        prompt: 'What is the formula for force?',
        options: ['F = ma', 'F = mv', 'F = m/a', 'F = a/m'],
        correctIndex: 0,
        explanation: 'Newton\'s second law states F = ma.',
      },
      {
        id: 'q-2',
        prompt: 'Which object falls faster in a vacuum?',
        options: ['Heavy object', 'Light object', 'Same speed', 'Depends on color'],
        correctIndex: 2,
        explanation: 'In a vacuum, all objects fall at the same rate.',
      },
    ],
  };

  beforeEach(() => {
    element = new StemLesson();
    document.body.appendChild(element);
    shadowRoot = element.shadowRoot!;
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  describe('Component Initialization', () => {
    it('should create a StemLesson element', () => {
      expect(element).toBeInstanceOf(StemLesson);
    });

    it('should have a shadow root in open mode', () => {
      expect(shadowRoot).toBeTruthy();
      expect(shadowRoot.mode).toBe('open');
    });

    it('should have an initial root div', () => {
      const root = shadowRoot.getElementById('stem-lesson-root');
      expect(root).toBeTruthy();
    });

    it('should display loading message when no lesson data', () => {
      const root = shadowRoot.querySelector('.lesson');
      expect(root?.textContent).toContain('Loading lesson');
    });

    it('should observe lesson-id attribute', () => {
      expect(StemLesson.observedAttributes).toContain('lesson-id');
    });
  });

  describe('Lesson Data Loading', () => {
    it('should set lesson data via setLessonData method', () => {
      element.setLessonData(mockLesson);
      const title = shadowRoot.querySelector('.lesson-title');
      expect(title?.textContent).toBe('Newton\'s Laws of Motion');
    });

    it('should render lesson metadata', () => {
      element.setLessonData(mockLesson);
      const metaPills = shadowRoot.querySelectorAll('.meta-pill');
      expect(metaPills.length).toBeGreaterThan(0);
      expect(shadowRoot.textContent).toContain('Physics');
      expect(shadowRoot.textContent).toContain('45 min');
    });

    it('should render prerequisites', () => {
      element.setLessonData(mockLesson);
      const prereqTags = shadowRoot.querySelectorAll('.prereq-tag');
      expect(prereqTags.length).toBe(2);
      expect(shadowRoot.textContent).toContain('Vectors');
      expect(shadowRoot.textContent).toContain('Forces');
    });

    it('should clear answered questions when new lesson is set', () => {
      element.setLessonData(mockLesson);
      const button = shadowRoot.querySelector('.option-btn') as HTMLButtonElement;
      button?.click();
      
      element.setLessonData(mockLesson);
      const buttons = shadowRoot.querySelectorAll('.option-btn:disabled');
      expect(buttons.length).toBe(0);
    });
  });

  describe('Section Rendering', () => {
    beforeEach(() => {
      element.setLessonData(mockLesson);
    });

    it('should render all sections', () => {
      const sections = shadowRoot.querySelectorAll('.section');
      expect(sections.length).toBe(10);
    });

    it('should render text sections with body', () => {
      const textSection = shadowRoot.querySelector('.section-text');
      expect(textSection).toBeTruthy();
      expect(textSection?.textContent).toContain('Newton\'s first law');
    });

    it('should render equation sections with special styling', () => {
      const eqSection = shadowRoot.querySelector('.section-equation');
      expect(eqSection).toBeTruthy();
      const eqDisplay = eqSection?.querySelector('.equation-display');
      expect(eqDisplay?.textContent).toBe('F = ma');
    });

    it('should render misconception sections with badge', () => {
      const miscSection = shadowRoot.querySelector('.section-misconception');
      const badge = miscSection?.querySelector('.misconception-badge');
      expect(badge).toBeTruthy();
      expect(badge?.textContent).toContain('Common Misconception');
    });

    it('should render story sections with story-intro badge', () => {
      const storySection = shadowRoot.querySelector('.section-story');
      const badge = storySection?.querySelector('.story-intro');
      expect(badge).toBeTruthy();
      expect(badge?.textContent).toContain('The Setup');
    });

    it('should render analogy sections with analogy-badge', () => {
      const analogySection = shadowRoot.querySelector('.section-analogy');
      const badge = analogySection?.querySelector('.analogy-badge');
      expect(badge).toBeTruthy();
      expect(badge?.textContent).toContain('Think of It This Way');
    });

    it('should render try-this sections with try-this-badge', () => {
      const trySection = shadowRoot.querySelector('.section-try-this');
      const badge = trySection?.querySelector('.try-this-badge');
      expect(badge).toBeTruthy();
      expect(badge?.textContent).toContain('Try This');
    });

    it('should render fun-fact sections with fun-fact-badge', () => {
      const factSection = shadowRoot.querySelector('.section-fun-fact');
      const badge = factSection?.querySelector('.fun-fact-badge');
      expect(badge).toBeTruthy();
      expect(badge?.textContent).toContain('Mind-Blowing Fact');
    });

    it('should render narrative sections', () => {
      const narrativeSection = shadowRoot.querySelector('.section-narrative');
      expect(narrativeSection).toBeTruthy();
      expect(narrativeSection?.textContent).toContain('forever');
    });

    it('should render context sections with italic style', () => {
      const contextSection = shadowRoot.querySelector('.section-context');
      expect(contextSection).toBeTruthy();
      expect(contextSection?.textContent).toContain('17th century');
    });

    it('should render section headings for all section types', () => {
      const headings = shadowRoot.querySelectorAll('.section-heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should render symbol display when section has symbol', () => {
      const symbolDisplay = shadowRoot.querySelector('.symbol-display');
      expect(symbolDisplay?.textContent).toBe('Newton\'s Second Law');
    });
  });

  describe('Question Rendering', () => {
    beforeEach(() => {
      element.setLessonData(mockLesson);
    });

    it('should render questions section', () => {
      const qaSection = shadowRoot.querySelector('.qa-section');
      expect(qaSection).toBeTruthy();
      expect(qaSection?.querySelector('.qa-title')?.textContent).toBe('Check Your Understanding');
    });

    it('should render all questions as cards', () => {
      const cards = shadowRoot.querySelectorAll('.question-card');
      expect(cards.length).toBe(2);
    });

    it('should render question text', () => {
      const questionText = shadowRoot.querySelector('.question-text');
      expect(questionText?.textContent).toContain('What is the formula for force?');
    });

    it('should render all options for a question', () => {
      const buttons = shadowRoot.querySelectorAll('.option-btn');
      expect(buttons.length).toBe(8); // 4 options × 2 questions
    });

    it('should render option prefixes (A, B, C, D)', () => {
      const prefixes = shadowRoot.querySelectorAll('.option-prefix');
      const firstPrefix = prefixes[0]?.textContent;
      expect(['A', 'B', 'C', 'D']).toContain(firstPrefix);
    });

    it('should render explanation boxes', () => {
      const explanations = shadowRoot.querySelectorAll('.explanation-box');
      expect(explanations.length).toBe(2);
    });

    it('should render feedback messages in explanation boxes', () => {
      const feedbackMsgs = shadowRoot.querySelectorAll('.feedback-msg');
      expect(feedbackMsgs.length).toBe(2);
    });
  });

  describe('Question Interaction', () => {
    beforeEach(() => {
      element.setLessonData(mockLesson);
    });

    it('should handle correct answer selection', async () => {
      const correctButton = shadowRoot.querySelectorAll('.option-btn')[0] as HTMLButtonElement;
      correctButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(correctButton.disabled).toBe(true);
      expect(correctButton.classList.contains('correct')).toBe(true);
    });

    it('should handle incorrect answer selection', async () => {
      const incorrectButton = shadowRoot.querySelectorAll('.option-btn')[1] as HTMLButtonElement;
      incorrectButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(incorrectButton.disabled).toBe(true);
      expect(incorrectButton.classList.contains('incorrect')).toBe(true);
    });

    it('should show explanation after answering', async () => {
      const button = shadowRoot.querySelectorAll('.option-btn')[0] as HTMLButtonElement;
      button.click();
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const explanationBox = shadowRoot.querySelector('.explanation-box');
      expect(explanationBox?.classList.contains('visible')).toBe(true);
    });

    it('should display correct feedback message', async () => {
      const button = shadowRoot.querySelectorAll('.option-btn')[0] as HTMLButtonElement;
      button.click();
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const feedbackMsg = shadowRoot.querySelector('.feedback-msg');
      expect(feedbackMsg?.textContent).toContain('✓ Correct');
      expect(feedbackMsg?.classList.contains('correct')).toBe(true);
    });

    it('should display incorrect feedback message', async () => {
      const button = shadowRoot.querySelectorAll('.option-btn')[1] as HTMLButtonElement;
      button.click();
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const feedbackMsg = shadowRoot.querySelector('.feedback-msg');
      expect(feedbackMsg?.textContent).toContain('✗ Incorrect');
      expect(feedbackMsg?.classList.contains('incorrect')).toBe(true);
    });

    it('should disable all buttons in question card after answering', async () => {
      const buttons = Array.from(shadowRoot.querySelectorAll('.option-btn')).slice(0, 4) as HTMLButtonElement[];
      buttons[0].click();
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      buttons.forEach(btn => {
        expect(btn.disabled).toBe(true);
      });
    });

    it('should prevent answering the same question twice', async () => {
      const button = shadowRoot.querySelectorAll('.option-btn')[0] as HTMLButtonElement;
      button.click();
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const disabledCount1 = Array.from(shadowRoot.querySelectorAll('.option-btn')).filter(
        btn => (btn as HTMLButtonElement).disabled
      ).length;
      
      button.click();
      
      const disabledCount2 = Array.from(shadowRoot.querySelectorAll('.option-btn')).filter(
        btn => (btn as HTMLButtonElement).disabled
      ).length;
      
      expect(disabledCount1).toBe(disabledCount2);
    });

    it('should dispatch custom event when question is answered', async () => {
      const eventSpy = vi.fn();
      element.addEventListener('lesson:question-answered', eventSpy);
      
      const button = shadowRoot.querySelectorAll('.option-btn')[0] as HTMLButtonElement;
      button.click();
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(eventSpy).toHaveBeenCalled();
      const event = eventSpy.mock.calls[0][0] as CustomEvent;
      expect(event.detail.questionId).toBe('q-1');
      expect(event.detail.isCorrect).toBe(true);
      expect(event.detail.selectedIndex).toBe(0);
    });

    it('should highlight correct answer even when incorrect is selected', async () => {
      const buttons = Array.from(shadowRoot.querySelectorAll('.option-btn')).slice(0, 4) as HTMLButtonElement[];
      buttons[1].click(); // Select wrong answer
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const correctButton = buttons[0];
      expect(correctButton.classList.contains('correct')).toBe(true);
    });
  });

  describe('Common Misconceptions Section', () => {
    beforeEach(() => {
      element.setLessonData(mockLesson);
    });

    it('should render misconceptions section', () => {
      const appSection = shadowRoot.querySelector('.applications');
      expect(appSection).toBeTruthy();
    });

    it('should render misconceptions title', () => {
      const title = shadowRoot.querySelector('.applications-title');
      expect(title?.textContent).toContain('Common Misconceptions');
    });

    it('should render all misconceptions', () => {
      const items = shadowRoot.querySelectorAll('.app-item');
      expect(items.length).toBe(2);
    });

    it('should not render misconceptions section if empty', () => {
      const lessonWithoutMisconceptions = { ...mockLesson, metadata: { ...mockLesson.metadata, commonMisconceptions: [] } };
      element.setLessonData(lessonWithoutMisconceptions);
      
      const appSection = shadowRoot.querySelector('.applications');
      expect(appSection).toBeFalsy();
    });
  });

  describe('Tags Section', () => {
    beforeEach(() => {
      element.setLessonData(mockLesson);
    });

    it('should render tags section', () => {
      const tagsDiv = shadowRoot.querySelector('.tags');
      expect(tagsDiv).toBeTruthy();
    });

    it('should render all tags', () => {
      const tags = shadowRoot.querySelectorAll('.tag');
      expect(tags.length).toBe(3);
    });

    it('should display tag content', () => {
      const tagsText = shadowRoot.textContent;
      expect(tagsText).toContain('mechanics');
      expect(tagsText).toContain('forces');
      expect(tagsText).toContain('kinematics');
    });

    it('should not render tags section if empty', () => {
      const lessonWithoutTags = { ...mockLesson, metadata: { ...mockLesson.metadata, tags: [] } };
      element.setLessonData(lessonWithoutTags);
      
      const tagsDiv = shadowRoot.querySelector('.tags');
      expect(tagsDiv).toBeFalsy();
    });
  });

  describe('Custom Element Registration', () => {
    it('should register the custom element globally', () => {
      expect(customElements.get('stem-lesson')).toBeDefined();
      const customEl = document.createElement('stem-lesson');
      expect(customEl).toBeInstanceOf(StemLesson);
    });

    it('should not register the element twice', () => {
      const first = customElements.get('stem-lesson');
      const second = customElements.get('stem-lesson');
      expect(first).toBe(second);
    });
  });
});
