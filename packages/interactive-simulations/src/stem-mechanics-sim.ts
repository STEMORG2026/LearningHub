/**
 * stem-mechanics-sim Web Component — interactive mechanics simulation.
 *
 * Learners adjust force, mass, and observe resulting acceleration (F=ma).
 * Predict → Observe → Explain flow: ask prediction, run sim, show result.
 */

const STYLES = `:host{display:block;font-family:'Segoe UI',system-ui,sans-serif;color:#e0e0e0}
@keyframes simObjectMove {
  from { left: 50px; }
  to { left: var(--end-pos, 400px); }
}
@keyframes particleMove {
  0% { transform: translateX(0); opacity:1; }
  100% { transform: translateX(150px); opacity:0; }
}
.sim-wrap{max-width:700px;margin:0 auto;padding:1rem}
.sim-title{font-size:1.4rem;color:#fff;margin-bottom:.3rem}
.sim-sub{color:#888;font-size:.9rem;margin-bottom:1.2rem}
.predict-section{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:1.2rem;margin-bottom:1.2rem}
.predict-title{font-size:1rem;color:#0ff;margin-bottom:.8rem}
.predict-question{font-size:.95rem;margin-bottom:1rem;line-height:1.5}
.predict-options{display:flex;flex-wrap:wrap;gap:.5rem}
.predict-btn{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#d0d0d0;padding:.5rem 1rem;border-radius:10px;cursor:pointer;font-size:.9rem;transition:all .2s}
.predict-btn:hover{background:rgba(0,255,255,0.08)}
.predict-btn.selected{background:rgba(0,255,255,0.15);border-color:#0ff;color:#0ff}
.predict-btn.correct{background:rgba(0,255,136,0.15);border-color:#0f8;color:#0f8}
.predict-btn.incorrect{background:rgba(255,68,68,0.15);border-color:#f44;color:#f44}
.controls{display:grid;gap:1rem;margin-bottom:1.2rem}
.control-row{display:flex;align-items:center;gap:1rem}
.control-label{width:80px;font-size:.9rem;color:#888}
.control-input{flex:1;-webkit-appearance:none;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;outline:none}
.control-input::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#0ff;cursor:pointer}
.control-value{width:60px;text-align:right;font-family:monospace;color:#0ff}
.run-btn{background:linear-gradient(135deg,rgba(0,255,255,0.15),rgba(0,255,136,0.15));border:1px solid rgba(0,255,255,0.3);color:#0ff;padding:.7rem 1.5rem;border-radius:12px;cursor:pointer;font-size:1rem;font-weight:600;width:100%;transition:all .2s;margin-bottom:1.2rem}
.run-btn:hover:not(:disabled){background:linear-gradient(135deg,rgba(0,255,255,0.25),rgba(0,255,136,0.25))}
.run-btn:disabled{opacity:.5;cursor:not-allowed}
.sim-area{position:relative;width:100%;height:200px;background:rgba(0,0,0,0.3);border-radius:12px;overflow:hidden;margin-bottom:1.2rem;border:1px solid rgba(255,255,255,0.1)}
.sim-ground{position:absolute;bottom:0;left:0;right:0;height:4px;background:rgba(255,255,255,0.2)}
.sim-object{position:absolute;bottom:20px;left:50px;width:60px;height:60px;background:linear-gradient(135deg,#0ff,#0f8);border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.7rem;color:#000;z-index:2}
.sim-object.animating{animation:simObjectMove var(--duration,2s) linear forwards}
.force-arrow{position:absolute;bottom:40px;left:110px;height:4px;background:#f44;transform-origin:left center;opacity:0;transition:opacity .3s;z-index:1}
.force-arrow.visible{opacity:1}
.velocity-readout{position:absolute;top:10px;right:10px;font-family:monospace;font-size:.8rem;color:#0ff;background:rgba(0,0,0,0.5);padding:.3rem .6rem;border-radius:8px}
.particle{position:absolute;width:6px;height:6px;background:#0ff;border-radius:50%;box-shadow:0 0 8px #0ff;opacity:0;z-index:3}
.particle.active{animation:particleMove .6s linear infinite}
.results{background:rgba(0,255,255,0.04);border:1px solid rgba(0,255,255,0.1);border-radius:12px;padding:1.2rem;display:none}
.results.visible{display:block}
.results-title{font-size:1rem;color:#0ff;margin-bottom:.8rem}
.result-value{font-size:1.5rem;font-weight:700;color:#0ff;margin:.5rem 0}
.result-comparison{margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.1);font-size:.9rem}
.feedback-correct{color:#0f8}
.feedback-incorrect{color:#f44}
`;
const template = document.createElement('template');
template.innerHTML = `<style>${STYLES}</style>
<div class="sim-wrap" id="simWrap">
  <h2 class="sim-title">Force, Mass, and Acceleration</h2>
  <p class="sim-sub">Adjust force and mass, then predict what happens to acceleration.</p>
  <div class="predict-section">
    <div class="predict-title">Predict</div>
    <div class="predict-question" id="predictQuestion">If you double the force while keeping mass constant, what happens to the acceleration?</div>
    <div class="predict-options" id="predictOptions"></div>
  </div>
  <div class="controls">
    <div class="control-row">
      <span class="control-label">Force (N)</span>
      <input type="range" class="control-input" id="forceInput" min="1" max="100" value="50">
      <span class="control-value" id="forceValue">50</span>
    </div>
    <div class="control-row">
      <span class="control-label">Mass (kg)</span>
      <input type="range" class="control-input" id="massInput" min="1" max="50" value="10">
      <span class="control-value" id="massValue">10</span>
    </div>
  </div>
  <button class="run-btn" id="runBtn">Run Simulation</button>
  <div class="sim-area" id="simArea">
    <div class="sim-ground"></div>
    <div class="sim-object" id="simObject">m=10</div>
    <div class="force-arrow" id="forceArrow"></div>
    <div class="velocity-readout" id="velocityDisplay">v = 0.0 m/s</div>
  </div>
  <div class="results" id="results">
    <div class="results-title">Results</div>
    <div class="result-value" id="accelerationResult"></div>
    <div class="result-comparison" id="comparison"></div>
  </div>
</div>`;

const PREDICT_OPTIONS = [
  { text: 'Acceleration doubles', correct: true },
  { text: 'Acceleration halves', correct: false },
  { text: 'Acceleration stays the same', correct: false },
  { text: 'Acceleration quadruples', correct: false },
];

export class StemMechanicsSim extends HTMLElement {
  #wrap: HTMLElement | null = null;
  #predictionMade = false;
  #predictionCorrect = false;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
    this.#wrap = shadow.getElementById('simWrap');
  }

  connectedCallback(): void {
    this.#setupControls();
    this.#setupPrediction();
    this.#setupRunButton();
  }

  #setupControls(): void {
    const forceInput = this.#wrap?.querySelector('#forceInput') as HTMLInputElement | null;
    const massInput = this.#wrap?.querySelector('#massInput') as HTMLInputElement | null;
    const forceValue = this.#wrap?.querySelector('#forceValue');
    const massValue = this.#wrap?.querySelector('#massValue');
    const simObject = this.#wrap?.querySelector('#simObject');

    forceInput?.addEventListener('input', () => {
      if (forceValue) forceValue.textContent = forceInput.value;
    });
    massInput?.addEventListener('input', () => {
      if (massValue) massValue.textContent = massInput.value;
      if (simObject) simObject.textContent = `m=${massInput.value}`;
    });
  }

  #setupPrediction(): void {
    const optionsContainer = this.#wrap?.querySelector('#predictOptions');
    if (!optionsContainer) return;

    PREDICT_OPTIONS.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'predict-btn';
      btn.textContent = opt.text;
      btn.addEventListener('click', () => {
        if (this.#predictionMade) return;
        optionsContainer.querySelectorAll('.predict-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
      optionsContainer.appendChild(btn);
    });
  }

  #setupRunButton(): void {
    const runBtn = this.#wrap?.querySelector('#runBtn') as HTMLButtonElement | null;
    runBtn?.addEventListener('click', () => this.#run());
  }

  #run(): void {
    const forceInput = this.#wrap?.querySelector('#forceInput') as HTMLInputElement | null;
    const massInput = this.#wrap?.querySelector('#massInput') as HTMLInputElement | null;
    if (!forceInput || !massInput) return;

    const force = parseFloat(forceInput.value);
    const mass = parseFloat(massInput.value);
    const acceleration = force / mass;

    this.#predictionMade = true;

    // Check prediction answer
    const selectedBtn = this.#wrap?.querySelector('.predict-btn.selected') as HTMLElement | null;
    if (selectedBtn) {
      const selectedText = selectedBtn.textContent;
      const correctOpt = PREDICT_OPTIONS.find(o => o.correct);
      this.#predictionCorrect = selectedText === correctOpt?.text;
      selectedBtn.classList.add(this.#predictionCorrect ? 'correct' : 'incorrect');
      if (!this.#predictionCorrect && correctOpt) {
        const correctIdx = PREDICT_OPTIONS.indexOf(correctOpt);
        const correctBtn = this.#wrap?.querySelectorAll('.predict-btn')[correctIdx] as HTMLElement | undefined;
        correctBtn?.classList.add('correct');
      }
    }

    // Animate the object
    const simObject = this.#wrap?.querySelector('#simObject') as HTMLElement | null;
    const forceArrow = this.#wrap?.querySelector('#forceArrow') as HTMLElement | null;
    const velocityDisplay = this.#wrap?.querySelector('#velocityDisplay');
    const results = this.#wrap?.querySelector('#results');
    const accelResult = this.#wrap?.querySelector('#accelerationResult');
    const comparison = this.#wrap?.querySelector('#comparison');

    if (simObject && forceArrow) {
      // Show force arrow
      forceArrow.classList.add('visible');
      forceArrow.style.width = `${Math.min(force * 1.5, 200)}px`;

      // Calculate animation parameters
      const duration = Math.max(1000, 3000 - acceleration * 20); // ms
      const endPos = Math.min(50 + acceleration * 18, 550); // px

      simObject.style.setProperty('--duration', `${duration}ms`);
      simObject.style.setProperty('--end-pos', `${endPos}px`);
      simObject.classList.add('animating');

      // Update velocity display during animation
      let elapsed = 0;
      const interval = setInterval(() => {
        elapsed += 100;
        const v = (acceleration * elapsed) / 1000;
        if (velocityDisplay) velocityDisplay.textContent = `v = ${v.toFixed(1)} m/s`;
        if (elapsed >= duration) clearInterval(interval);
      }, 100);
    }

    // Show results
    if (results && accelResult && comparison) {
      results.classList.add('visible');
      accelResult.textContent = `a = ${acceleration.toFixed(2)} m/s²`;
      comparison.innerHTML = `
        <div style="margin-bottom:.5rem;">F = ${force} N, m = ${mass} kg</div>
        <div style="margin-bottom:.5rem;">a = F/m = ${force}/${mass} = <strong>${acceleration.toFixed(2)} m/s²</strong></div>
        <div class="${this.#predictionCorrect ? 'feedback-correct' : 'feedback-incorrect'}">
          ${this.#predictionCorrect ? '✓ Your prediction was correct!' : '✗ Your prediction was incorrect. Acceleration is directly proportional to force.'}
        </div>
      `;
    }

    // Dispatch event
    this.dispatchEvent(new CustomEvent('simulation:complete', {
      detail: { force, mass, acceleration, predictionCorrect: this.#predictionCorrect },
      bubbles: true,
    }));
  }
}

if (!customElements.get('stem-mechanics-sim')) {
  customElements.define('stem-mechanics-sim', StemMechanicsSim);
}
