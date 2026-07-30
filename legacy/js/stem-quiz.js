/* ==========================================
   STEM Tuition - Pokhara
   Interactive STEM Quiz System
   ========================================== */

const STEM_QUIZ_DATA = {
  physics: [
    {
      question: "Which of Newton's Laws states that 'For every action, there is an equal and opposite reaction'?",
      options: ["First Law", "Second Law", "Third Law", "Law of Gravitation"],
      correct: 2,
      explanation: "Newton's 3rd Law of Motion dictates that forces always occur in equal and opposite action-reaction pairs!"
    },
    {
      question: "What is the Speed of Light in a vacuum?",
      options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "1.5 × 10⁸ m/s", "300,000 m/s"],
      correct: 0,
      explanation: "Light travels at approximately 300,000,000 meters per second (3 × 10⁸ m/s) in a vacuum, represented by the constant 'c'!"
    },
    {
      question: "According to Ohm's Law, what is the relation between Voltage (V), Current (I), and Resistance (R)?",
      options: ["V = I / R", "V = I × R", "I = V × R", "R = V × I"],
      correct: 1,
      explanation: "Ohm's Law states that Voltage equals Current multiplied by Resistance (V = I × R)."
    },
    {
      question: "Which particle in an atom carries a negative electric charge?",
      options: ["Proton", "Neutron", "Electron", "Photon"],
      correct: 2,
      explanation: "Electrons carry a negative charge (-1.6 × 10⁻¹⁹ C) and orbit around the atomic nucleus."
    }
  ],

  chemistry: [
    {
      question: "What is the most abundant gas in Earth's atmosphere?",
      options: ["Oxygen (O₂)", "Carbon Dioxide (CO₂)", "Nitrogen (N₂)", "Argon (Ar)"],
      correct: 2,
      explanation: "Nitrogen gas (N₂) makes up approximately 78% of Earth's atmosphere by volume!"
    },
    {
      question: "What is the pH value of pure distilled water at 25°C?",
      options: ["0", "7", "14", "5.5"],
      correct: 1,
      explanation: "Pure water has a neutral pH of 7. Values below 7 are acidic, while values above 7 are basic/alkaline."
    },
    {
      question: "Who developed the Periodic Table of Elements in 1869?",
      options: ["Antoine Lavoisier", "Dmitri Mendeleev", "John Dalton", "Ernest Rutherford"],
      correct: 1,
      explanation: "Dmitri Mendeleev organized chemical elements by atomic mass and predicted the properties of elements yet to be discovered."
    },
    {
      question: "Which chemical bond involves the sharing of electron pairs between atoms?",
      options: ["Ionic Bond", "Covalent Bond", "Metallic Bond", "Hydrogen Bond"],
      correct: 1,
      explanation: "Covalent bonding occurs when atoms share valence electrons to achieve stable electronic configurations."
    }
  ],

  math: [
    {
      question: "What is the derivative of x² with respect to x?",
      options: ["x", "2x", "x³ / 3", "2"],
      correct: 1,
      explanation: "Using the Power Rule (d/dx [xⁿ] = n·xⁿ⁻¹), the derivative of x² is 2x¹ = 2x."
    },
    {
      question: "What is the value of Sin(90°) in trigonometry?",
      options: ["0", "0.5", "1", "√3/2"],
      correct: 2,
      explanation: "Sin(90°) = 1. On the unit circle, 90 degrees corresponds to the top point (0, 1)."
    },
    {
      question: "If a right-angled triangle has legs of length 3 and 4, what is the hypotenuse length?",
      options: ["5", "6", "7", "25"],
      correct: 0,
      explanation: "By the Pythagorean Theorem (a² + b² = c²): 3² + 4² = 9 + 16 = 25, so c = √25 = 5."
    },
    {
      question: "What is the value of 0! (zero factorial)?",
      options: ["0", "1", "Undefined", "Infinity"],
      correct: 1,
      explanation: "By mathematical definition, 0! = 1. This ensures consistency in combinatorics and probability formulas!"
    }
  ],

  computing: [
    {
      question: "What is the binary representation of the decimal number 10?",
      options: ["1001", "1010", "1100", "1110"],
      correct: 1,
      explanation: "In binary: 8 + 0 + 2 + 0 = 10, which corresponds to 1010 in base 2."
    },
    {
      question: "Who wrote the world's first computer algorithm?",
      options: ["Alan Turing", "Charles Babbage", "Ada Lovelace", "Grace Hopper"],
      correct: 2,
      explanation: "Ada Lovelace wrote the first computer algorithm in 1843 for Babbage's mechanical Analytical Engine!"
    },
    {
      question: "Which data structure follows the First-In, First-Out (FIFO) principle?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      correct: 1,
      explanation: "A Queue operates on FIFO (First In, First Out), similar to a line of people waiting for a ticket."
    },
    {
      question: "What does 'CPU' stand for in computer science?",
      options: ["Central Power Unit", "Central Processing Unit", "Computer Program Utility", "Core Process Unit"],
      correct: 1,
      explanation: "CPU stands for Central Processing Unit—the primary electronic circuit that executes instructions!"
    }
  ],

  pioneers: [
    {
      question: "Which female scientist won two Nobel Prizes in two different scientific fields?",
      options: ["Rosalind Franklin", "Marie Curie", "Chien-Shiung Wu", "Ada Lovelace"],
      correct: 1,
      explanation: "Marie Curie won Nobel Prizes in Physics (1903) and Chemistry (1911)!"
    },
    {
      question: "Which ancient mathematician introduced the concept of Zero and calculated Pi accurately?",
      options: ["Euclid", "Pythagoras", "Aryabhata", "Archimedes"],
      correct: 2,
      explanation: "Aryabhata in 499 CE introduced Zero as a place-value digit and calculated Pi to 3.1416!"
    },
    {
      question: "Who discovered Photo 51 which revealed the double-helix structure of DNA?",
      options: ["James Watson", "Francis Crick", "Rosalind Franklin", "Gregor Mendel"],
      correct: 2,
      explanation: "Rosalind Franklin captured Photo 51 using X-ray crystallography, proving DNA's double-helix structure."
    },
    {
      question: "Which mathematician calculated NASA's Apollo 11 moon mission trajectories?",
      options: ["Katherine Johnson", "Grace Hopper", "Margaret Hamilton", "Ada Lovelace"],
      correct: 0,
      explanation: "Katherine Johnson performed the critical orbital trajectory calculations for NASA's Mercury & Apollo moon missions!"
    }
  ]
};

class STEMQuizApp {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentSubject = 'physics';
    this.currentIndex = 0;
    this.score = 0;
    this.answered = false;

    this.render();
  }

  setSubject(subj) {
    this.currentSubject = subj;
    this.currentIndex = 0;
    this.score = 0;
    this.answered = false;
    this.render();
  }

  render() {
    const questions = STEM_QUIZ_DATA[this.currentSubject] || STEM_QUIZ_DATA.physics;
    const isCompleted = this.currentIndex >= questions.length;

    if (isCompleted) {
      this.renderResult(questions.length);
      return;
    }

    const q = questions[this.currentIndex];
    const progressPct = ((this.currentIndex) / questions.length) * 100;

    this.container.innerHTML = `
      <div class="quiz-header">
        <div>
          <span class="section-tag" style="margin-bottom:0;">⚡ Interactive STEM Quiz</span>
          <h3 style="margin-top:0.3rem;">Test Your STEM Knowledge</h3>
        </div>
        <div class="quiz-score-badge">
          <span>🏆 Score:</span>
          <span style="font-size:1.2rem;color:var(--green);">${this.score}</span>
        </div>
      </div>

      <div class="quiz-subject-tabs">
        <button class="quiz-tab-btn ${this.currentSubject === 'physics' ? 'active' : ''}" onclick="window.stemQuizApp.setSubject('physics')">⚛️ Physics</button>
        <button class="quiz-tab-btn ${this.currentSubject === 'chemistry' ? 'active' : ''}" onclick="window.stemQuizApp.setSubject('chemistry')">🧪 Chemistry</button>
        <button class="quiz-tab-btn ${this.currentSubject === 'math' ? 'active' : ''}" onclick="window.stemQuizApp.setSubject('math')">📐 Mathematics</button>
        <button class="quiz-tab-btn ${this.currentSubject === 'computing' ? 'active' : ''}" onclick="window.stemQuizApp.setSubject('computing')">💻 Computing</button>
        <button class="quiz-tab-btn ${this.currentSubject === 'pioneers' ? 'active' : ''}" onclick="window.stemQuizApp.setSubject('pioneers')">🧬 Pioneers</button>
      </div>

      <div class="quiz-progress-bar-bg">
        <div class="quiz-progress-bar-fill" style="width: ${progressPct}%"></div>
      </div>

      <div class="quiz-card">
        <div style="font-size:0.8rem;color:var(--cyan);font-weight:600;margin-bottom:0.5rem;">
          QUESTION ${this.currentIndex + 1} OF ${questions.length}
        </div>
        <div class="quiz-question-title">${q.question}</div>
        <div class="quiz-options">
          ${q.options.map((opt, idx) => `
            <button class="quiz-option-btn" id="opt-${idx}" onclick="window.stemQuizApp.selectOption(${idx})">
              <span class="quiz-option-prefix">${String.fromCharCode(65 + idx)}</span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
        <div class="quiz-explanation-box" id="quiz-explanation">
          <strong>💡 Explanation:</strong> <span id="quiz-explanation-text"></span>
        </div>
      </div>

      <div class="quiz-footer">
        <span style="font-size:0.85rem;color:var(--muted);">Select your answer above</span>
        <button class="quiz-next-btn" id="quiz-next-btn" style="display:none;" onclick="window.stemQuizApp.nextQuestion()">
          Next Question →
        </button>
      </div>
    `;
  }

  selectOption(optIdx) {
    if (this.answered) return;
    this.answered = true;

    const questions = STEM_QUIZ_DATA[this.currentSubject];
    const q = questions[this.currentIndex];
    const isCorrect = optIdx === q.correct;

    const selectedBtn = document.getElementById(`opt-${optIdx}`);
    const correctBtn = document.getElementById(`opt-${q.correct}`);

    if (isCorrect) {
      this.score += 10;
      if (selectedBtn) selectedBtn.classList.add('correct');
    } else {
      if (selectedBtn) selectedBtn.classList.add('incorrect');
      if (correctBtn) correctBtn.classList.add('correct');
    }

    // Disable all options
    q.options.forEach((_, idx) => {
      const btn = document.getElementById(`opt-${idx}`);
      if (btn) btn.disabled = true;
    });

    // Show Explanation
    const expBox = document.getElementById('quiz-explanation');
    const expText = document.getElementById('quiz-explanation-text');
    if (expBox && expText) {
      expText.textContent = q.explanation;
      expBox.style.display = 'block';
    }

    // Show Next Button
    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) nextBtn.style.display = 'block';
  }

  nextQuestion() {
    this.currentIndex++;
    this.answered = false;
    this.render();
  }

  renderResult(totalQuestions) {
    const maxScore = totalQuestions * 10;
    const pct = Math.round((this.score / maxScore) * 100);
    let title = "Great Attempt! 🚀";
    let message = "Keep learning and practicing STEM concepts every day.";

    if (pct === 100) {
      title = "STEM Genius Master! 🌟";
      message = "Outstanding! Perfect score across all questions.";
    } else if (pct >= 70) {
      title = "STEM Scholar! 🎓";
      message = "Impressive knowledge of core STEM concepts.";
    }

    this.container.innerHTML = `
      <div class="quiz-result-card">
        <div style="font-size:3rem;margin-bottom:0.5rem;">🎉</div>
        <h2 style="font-size:1.8rem;margin-bottom:0.4rem;">${title}</h2>
        <p style="color:var(--muted);max-width:450px;margin:0 auto 1.5rem;">${message}</p>
        <div class="quiz-result-score">${pct}%</div>
        <p style="font-size:1.1rem;color:var(--cyan);font-weight:600;margin-bottom:2rem;">
          Total Score: ${this.score} / ${maxScore}
        </p>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
          <button class="btn-primary" onclick="window.stemQuizApp.setSubject('${this.currentSubject}')">
            🔄 Retake Quiz
          </button>
          <button class="btn-secondary" onclick="window.stemQuizApp.setSubject('pioneers')">
            🧬 Try Pioneers Quiz
          </button>
        </div>
      </div>
    `;
  }
}

// Auto Initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('stem-quiz-hub')) {
    window.stemQuizApp = new STEMQuizApp('stem-quiz-hub');
  }
});
