/* ==========================================
   STEM Tuition - Pokhara
   Pioneers & Forefathers Interactive Wall
   ========================================== */

const STEM_PIONEERS = [
  {
    id: "newton",
    name: "Sir Isaac Newton",
    era: "1643 – 1727",
    icon: "🍎",
    field: "Physics & Mathematics",
    famousFor: "Formulated the 3 Laws of Motion, Universal Gravitation, and Calculus.",
    didYouKnow: "Did you know? Newton invented calculus in 1665 during a pandemic lockdown (The Great Plague of London) while staying at his home in Woolsthorpe!",
    quote: "If I have seen further it is by standing on the shoulders of Giants."
  },
  {
    id: "curie",
    name: "Marie Curie",
    era: "1867 – 1934",
    icon: "☢️",
    field: "Physics & Chemistry",
    famousFor: "Discovered Polonium and Radium; pioneer of Radioactivity research.",
    didYouKnow: "Did you know? Marie Curie is the ONLY person to win Nobel Prizes in two different scientific fields (Physics in 1903 & Chemistry in 1911)!",
    quote: "Nothing in life is to be feared, it is only to be understood."
  },
  {
    id: "einstein",
    name: "Albert Einstein",
    era: "1879 – 1955",
    icon: "⚡",
    field: "Theoretical Physics",
    famousFor: "Developed the Theory of Relativity (Special & General) and E = mc².",
    didYouKnow: "Did you know? Einstein won his 1921 Nobel Prize NOT for Relativity, but for explaining the Photoelectric Effect, which laid the foundation for Quantum Physics!",
    quote: "Imagination is more important than knowledge. Knowledge is limited."
  },
  {
    id: "lovelace",
    name: "Ada Lovelace",
    era: "1815 – 1852",
    icon: "💻",
    field: "Computer Science & Mathematics",
    famousFor: "Written the world's very first computer algorithm for Babbage's Analytical Engine.",
    didYouKnow: "Did you know? Ada Lovelace foresaw in 1843 that computers wouldn't just calculate numbers, but could compose music, create art, and process complex ideas!",
    quote: "That brain of mine is something more than merely mortal; as time will show."
  },
  {
    id: "turing",
    name: "Alan Turing",
    era: "1912 – 1954",
    icon: "🧩",
    field: "Computer Science & Cryptanalysis",
    famousFor: "Created the Turing Machine concept and broke the Nazi Enigma Code in WWII.",
    didYouKnow: "Did you know? Turing's work at Bletchley Park saved an estimated 14 million lives and shortened WWII by over two years!",
    quote: "Sometimes it is the people no one imagines anything of who do the things that no one can imagine."
  },
  {
    id: "gauss",
    name: "Carl Friedrich Gauss",
    era: "1777 – 1855",
    icon: "📐",
    field: "Mathematics & Astronomy",
    famousFor: "Known as the 'Prince of Mathematicians'. Contributions to Number Theory, Statistics, and Magnetism.",
    didYouKnow: "Did you know? As an 8-year-old schoolboy, Gauss instantly summed numbers 1 to 100 in seconds by discovering the formula n(n+1)/2!",
    quote: "Mathematics is the queen of sciences, and number theory is the queen of mathematics."
  },
  {
    id: "aryabhata",
    name: "Aryabhata",
    era: "476 – 550 CE",
    icon: "🌌",
    field: "Mathematics & Astronomy",
    famousFor: "Introduced the concept of Zero, accurate value of Pi (3.1416), and Earth's rotation on its axis.",
    didYouKnow: "Did you know? Aryabhata calculated the solar year to 365.2586 days in 499 CE—within minutes of modern measurements!",
    quote: "By the grace of God, the sunken jewel of true knowledge has been drawn up by me."
  },
  {
    id: "katherine_johnson",
    name: "Katherine Johnson",
    era: "1918 – 2020",
    icon: "🚀",
    field: "Mathematics & Aerospace Science",
    famousFor: "Calculated trajectory mechanics for NASA's Mercury & Apollo 11 moon landing missions.",
    didYouKnow: "Did you know? Astronaut John Glenn refused to fly into space unless Katherine Johnson manually verified the flight orbital equations computed by NASA's new IBM computers!",
    quote: "Like what you do, and then you will do your best."
  },
  {
    id: "rosalind_franklin",
    name: "Rosalind Franklin",
    era: "1920 – 1958",
    icon: "🧬",
    field: "Biophysics & Chemistry",
    famousFor: "Captured Photo 51—the critical X-ray diffraction image demonstrating DNA's double-helix structure.",
    didYouKnow: "Did you know? Franklin's high-precision X-ray crystallography also mapped the structures of viruses like Tobacco Mosaic Virus and Polio!",
    quote: "Science and everyday life cannot and should not be separated."
  },
  {
    id: "maxwell",
    name: "James Clerk Maxwell",
    era: "1831 – 1879",
    icon: "🧲",
    field: "Physics & Electromagnetism",
    famousFor: "Formulated Maxwell's Equations, unifying Electricity, Magnetism, and Light into one electromagnetic spectrum.",
    didYouKnow: "Did you know? Maxwell created the world's very first durable color photograph in 1861 by combining red, green, and blue filtered images!",
    quote: "The work which has been done... has given us a new technique of thought."
  },
  {
    id: "tesla",
    name: "Nikola Tesla",
    era: "1856 – 1943",
    icon: "⚡",
    field: "Electrical & Mechanical Engineering",
    famousFor: "Invented the Alternating Current (AC) electrical system, Induction Motor, and Tesla Coil.",
    didYouKnow: "Did you know? Tesla holds over 300 patents worldwide and accurately predicted wireless smartphones and Wi-Fi as early as 1926!",
    quote: "The present is theirs; the future, for which I really worked, is mine."
  },
  {
    id: "ramanujan",
    name: "Srinivasa Ramanujan",
    era: "1887 – 1920",
    icon: "🔢",
    field: "Mathematics",
    famousFor: "Formulated nearly 3,900 mathematical identities, infinite series, and mock theta functions without formal training.",
    didYouKnow: "Did you know? The famous Hardy-Ramanujan number 1729 is the smallest number expressible as the sum of two cubes in two different ways (1³+12³ and 9³+10³)!",
    quote: "An equation for me has no meaning unless it expresses a thought of God."
  },
  {
    id: "galileo",
    name: "Galileo Galilei",
    era: "1564 – 1642",
    icon: "🔭",
    field: "Physics & Observational Astronomy",
    famousFor: "Father of Modern Observational Astronomy; discovered Jupiter's moons, Saturn's rings, and sunspots.",
    didYouKnow: "Did you know? Galileo demonstrated that objects of different masses fall with equal acceleration by dropping spheres from the Leaning Tower of Pisa!",
    quote: "Measure what is measurable, and make measurable what is not so."
  },
  {
    id: "archimedes",
    name: "Archimedes of Syracuse",
    era: "c. 287 – c. 212 BCE",
    icon: "🌊",
    field: "Physics & Engineering",
    famousFor: "Discovered the Law of Buoyancy (Archimedes' Principle) and invented the Archimedes Screw.",
    didYouKnow: "Did you know? Archimedes famously leaped out of his bathtub yelling 'Eureka!' ('I found it!') after realizing displacement of water could measure an irregular object's volume!",
    quote: "Give me a lever long enough and a fulcrum on which to place it, and I shall move the world."
  },
  {
    id: "faraday",
    name: "Michael Faraday",
    era: "1791 – 1867",
    icon: "🔌",
    field: "Physics & Chemistry",
    famousFor: "Discovered Electromagnetic Induction, Diamagnetism, and Laws of Electrolysis.",
    didYouKnow: "Did you know? Faraday had almost no formal schooling and worked as a bookbinder's apprentice, learning science by reading books brought in for binding!",
    quote: "Nothing is too wonderful to be true if it be consistent with the laws of nature."
  },
  {
    id: "mendeleev",
    name: "Dmitri Mendeleev",
    era: "1834 – 1907",
    icon: "🧪",
    field: "Chemistry",
    famousFor: "Created the Periodic Table of Elements, predicting unknown elements and their atomic properties.",
    didYouKnow: "Did you know? Mendeleev left blank spots in his periodic table for undiscovered elements like Gallium & Germanium, and correctly predicted their mass and properties before they were found!",
    quote: "I saw in a dream a table where all elements fell into place as required."
  },
  {
    id: "hopper",
    name: "Grace Hopper",
    era: "1906 – 1992",
    icon: "👾",
    field: "Computer Science & US Navy Rear Admiral",
    famousFor: "Created the first computer compiler (A-0) and coined the term 'debugging' after finding a real moth in a computer relay.",
    didYouKnow: "Did you know? Grace Hopper kept a 11.8-inch piece of wire on her desk to demonstrate a 'nanosecond'—the exact distance light travels in one billionth of a second!",
    quote: "The most dangerous phrase in the language is, 'We've always done it this way.'"
  },
  {
    id: "feynman",
    name: "Richard Feynman",
    era: "1918 – 1988",
    icon: "⚛️",
    field: "Quantum Physics",
    famousFor: "Formulated Feynman Diagrams, Quantum Electrodynamics (QED), and pioneered Nanotechnology concepts.",
    didYouKnow: "Did you know? Feynman was also an accomplished bongo player, codebreaker, and safe-cracker during the Manhattan Project at Los Alamos!",
    quote: "If you want to master something, teach it."
  },
  {
    id: "wu",
    name: "Chien-Shiung Wu",
    era: "1912 – 1997",
    icon: "🔬",
    field: "Experimental Nuclear Physics",
    famousFor: "Disproved the Law of Parity Conservation in weak nuclear interactions (The Wu Experiment).",
    didYouKnow: "Did you know? Wu was known as the 'First Lady of Physics' and the 'Chinese Marie Curie' for her legendary experimental precision in nuclear physics!",
    quote: "There is only one response to defeat: to start again."
  },
  {
    id: "zewail",
    name: "Ahmed Zewail",
    era: "1946 – 2016",
    icon: "⏱️",
    field: "Physical Chemistry",
    famousFor: "Father of Femtochemistry; invented ultra-fast laser spectroscopy to capture chemical reactions in real-time.",
    didYouKnow: "Did you know? Zewail's laser cameras take snapshots at one femtosecond (10⁻¹⁵ seconds)—allowing scientists to watch chemical bonds break and form as if in slow motion!",
    quote: "The world is full of wonders, and science is the key that opens the door."
  }
];

class STEMPioneersWidget {
  constructor() {
    this.currentIndex = Math.floor(Math.random() * STEM_PIONEERS.length);
    this.isMinimized = localStorage.getItem('stem_dyk_minimized') === 'true';
    this.autoRotateInterval = null;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.mountFloatingWidget());
    } else {
      this.mountFloatingWidget();
    }
  }

  mountFloatingWidget() {
    if (document.getElementById('stem-dyk-widget')) return;

    const widget = document.createElement('div');
    widget.id = 'stem-dyk-widget';
    widget.className = `stem-didyouknow-floating ${this.isMinimized ? 'minimized' : ''}`;
    
    this.renderWidgetContent(widget);
    document.body.appendChild(widget);

    this.startAutoRotation();
  }

  renderWidgetContent(container) {
    const p = STEM_PIONEERS[this.currentIndex];
    container.innerHTML = `
      <div class="stem-dyk-header" onclick="window.stemPioneersWidget.toggleMinimize()">
        <span class="stem-dyk-tag">💡 STEM Did You Know!?</span>
        <div class="stem-dyk-controls">
          <button class="stem-dyk-btn-icon" title="${this.isMinimized ? 'Expand' : 'Collapse'}">
            ${this.isMinimized ? '▲' : '▼'}
          </button>
        </div>
      </div>
      <div class="stem-dyk-pioneer">
        <div class="stem-dyk-avatar">${p.icon}</div>
        <div class="stem-dyk-info">
          <div class="stem-dyk-name">${p.name} <span style="font-size:0.75rem;color:var(--muted);font-weight:normal;">(${p.era})</span></div>
          <div class="stem-dyk-field">🏷️ ${p.field}</div>
          <div class="stem-dyk-fact">${p.didYouKnow}</div>
        </div>
      </div>
      <div class="stem-dyk-footer">
        <button class="stem-dyk-random-btn" onclick="window.stemPioneersWidget.nextRandomPioneer(event)">
          🎲 Next Pioneer Fact →
        </button>
        <span style="font-size:0.75rem;color:var(--muted);">STEM Pioneer Spotlight</span>
      </div>
    `;
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    localStorage.setItem('stem_dyk_minimized', this.isMinimized);
    const widget = document.getElementById('stem-dyk-widget');
    if (widget) {
      widget.classList.toggle('minimized', this.isMinimized);
      const btn = widget.querySelector('.stem-dyk-btn-icon');
      if (btn) btn.innerHTML = this.isMinimized ? '▲' : '▼';
    }
  }

  nextRandomPioneer(e) {
    if (e) e.stopPropagation();
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * STEM_PIONEERS.length);
    } while (nextIdx === this.currentIndex && STEM_PIONEERS.length > 1);

    this.currentIndex = nextIdx;
    const widget = document.getElementById('stem-dyk-widget');
    if (widget) {
      this.renderWidgetContent(widget);
    }
  }

  startAutoRotation() {
    if (this.autoRotateInterval) clearInterval(this.autoRotateInterval);
    this.autoRotateInterval = setInterval(() => {
      if (!this.isMinimized) {
        this.nextRandomPioneer();
      }
    }, 28000);
  }
}

// Function to render full Pioneers Wall inside any page container
function renderSTEMPioneersWall(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="pioneers-grid">
      ${STEM_PIONEERS.slice(0, 8).map(p => `
        <div class="pioneer-card reveal">
          <div class="pioneer-header">
            <div class="pioneer-icon">${p.icon}</div>
            <div class="pioneer-meta">
              <div class="pioneer-title">${p.name}</div>
              <div class="pioneer-era">${p.era}</div>
            </div>
          </div>
          <span class="pioneer-field-badge">🔬 ${p.field}</span>
          <div class="pioneer-famous-for"><strong>Famous for:</strong> ${p.famousFor}</div>
          <div class="pioneer-quote">"${p.quote}"</div>
        </div>
      `).join('')}
    </div>
  `;
}

// Auto Instantiate Floating Widget
window.stemPioneersWidget = new STEMPioneersWidget();
window.renderSTEMPioneersWall = renderSTEMPioneersWall;
