/**
 * stem-circuit-sim Web Component — interactive circuit simulation.
 *
 * Learners adjust voltage and resistance, observe current (Ohm's law).
 * Series and parallel circuit exploration.
 */

const STYLES = `:host{display:block;font-family:'Segoe UI',system-ui,sans-serif;color:#e0e0e0}
.circuit-container{max-width:700px;margin:0 auto;padding:1rem}
.circuit-title{font-size:1.4rem;color:#fff;margin-bottom:1rem}
.circuit-display{position:relative;width:100%;height:250px;background:rgba(0,0,0,0.3);border-radius:12px;overflow:hidden;margin-bottom:1rem;border:1px solid rgba(255,255,255,0.1)}
.wire{position:absolute;background:rgba(0,255,255,0.4);height:3px}
.resistor{position:absolute;width:40px;height:15px;background:linear-gradient(90deg,#d9a05b,#a07040);border-radius:3px;top:50%;transform:translateY(-50%)}
.battery{position:absolute;width:30px;height:50px;background:linear-gradient(180deg,#0f8,#0ff);border-radius:4px;top:50%;transform:translateY(-50%)}
.battery::after{content:'';position:absolute;top:-8px;left:50%;transform:translateX(-50%);width:12px;height:8px;background:#0ff;border-radius:2px}
.current-flow{position:absolute;width:6px;height:6px;background:#0ff;border-radius:50%;box-shadow:0 0 8px #0ff;opacity:0}
.ammeter{position:absolute;background:rgba(0,0,0,0.7);border:1px solid #0ff;border-radius:8px;padding:.3rem .6rem;font-family:monospace;font-size:.8rem;color:#0ff}
.voltmeter{position:absolute;background:rgba(0,0,0,0.7);border:1px solid #0f8;border-radius:8px;padding:.3rem .6rem;font-family:monospace;font-size:.8rem;color:#0f8}
.controls{display:grid;gap:1rem;margin-bottom:1rem}
.control-row{display:flex;align-items:center;gap:1rem}
.control-label{width:100px;font-size:.9rem;color:#888}
.control-input{flex:1;-webkit-appearance:none;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;outline:none}
.control-input::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#0ff;cursor:pointer}
.control-value{width:70px;text-align:right;font-family:monospace;color:#0ff}
.run-btn{background:linear-gradient(135deg,rgba(0,255,255,0.15),rgba(0,255,136,0.15));border:1px solid rgba(0,255,255,0.3);color:#0ff;padding:.7rem 1.5rem;border-radius:12px;cursor:pointer;font-size:1rem;font-weight:600;width:100%;transition:all .2s;margin-bottom:1rem}
.run-btn:hover{background:linear-gradient(135deg,rgba(0,255,255,0.25),rgba(0,255,136,0.25))}
.formula-display{text-align:center;padding:1rem;background:rgba(0,255,255,0.04);border-radius:8px;margin-bottom:1rem;font-size:1.1rem}
.result-current{font-size:1.5rem;font-weight:700;color:#0ff;text-align:center;padding:1rem}
.glow{box-shadow:0 0 15px rgba(0,255,255,0.6),0 0 30px rgba(0,255,255,0.3)}
.dim{opacity:.3}`;

const template = document.createElement('template');
template.innerHTML = `<style>${STYLES}</style>
<div class="circuit-container">
  <h2 class="circuit-title">Ohm's Law Circuit</h2>
  <p style="color:#888;font-size:.9rem;margin-bottom:1rem;">Adjust voltage and resistance to see how current changes.</p>
  <div class="formula-display">V = I × R → I = V / R</div>
  <div class="controls">
    <div class="control-row">
      <span class="control-label">Voltage (V)</span>
      <input type="range" class="control-input" id="voltageInput" min="1" max="24" value="12">
      <span class="control-value" id="voltageValue">12 V</span>
    </div>
    <div class="control-row">
      <span class="control-label">Resistance (Ω)</span>
      <input type="range" class="control-input" id="resistanceInput" min="1" max="100" value="10">
      <span class="control-value" id="resistanceValue">10 Ω</span>
    </div>
  </div>
  <button class="run-btn" id="runBtn">Close Circuit</button>
  <div class="circuit-display" id="circuitDisplay">
    <div class="wire" style="top:60px;left:50px;right:50px"></div>
    <div class="wire" style="top:190px;left:50px;right:50px"></div>
    <div class="wire" style="top:60px;left:50px;height:130px;width:3px"></div>
    <div class="wire" style="top:60px;right:50px;height:130px;width:3px"></div>
    <div class="battery" style="left:55px"></div>
    <div class="resistor" style="right:55px"></div>
    <div class="ammeter" style="top:20px;left:50%">I = ?</div>
    <div class="voltmeter" style="bottom:20px;left:50%">V = ?</div>
    <div class="current-flow" id="currentParticle1" style="top:72px;left:80px"></div>
    <div class="current-flow" id="currentParticle2" style="top:202px;left:80px"></div>
    <div class="current-flow" id="currentParticle3" style="top:120px;left:52px"></div>
    <div class="current-flow" id="currentParticle4" style="top:120px;right:52px"></div>
  </div>
  <div class="result-current" id="resultDisplay"></div>
</div>`;

export class StemCircuitSim extends HTMLElement {
  #root: HTMLElement | null = null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
    this.#root = shadow.querySelector('.circuit-container') as HTMLElement | null;
  }

  connectedCallback(): void {
    this.#setupControls();
  }

  #setupControls(): void {
    const voltageInput = this.#root?.querySelector('#voltageInput') as HTMLInputElement | null;
    const resistanceInput = this.#root?.querySelector('#resistanceInput') as HTMLInputElement | null;
    const voltageValue = this.#root?.querySelector('#voltageValue');
    const resistanceValue = this.#root?.querySelector('#resistanceValue');
    const runBtn = this.#root?.querySelector('#runBtn') as HTMLButtonElement | null;

    voltageInput?.addEventListener('input', () => {
      if (voltageValue) voltageValue.textContent = `${voltageInput.value} V`;
    });
    resistanceInput?.addEventListener('input', () => {
      if (resistanceValue) resistanceValue.textContent = `${resistanceInput.value} Ω`;
    });
    runBtn?.addEventListener('click', () => this.#run());
  }

  #run(): void {
    const voltageInput = this.#root?.querySelector('#voltageInput') as HTMLInputElement | null;
    const resistanceInput = this.#root?.querySelector('#resistanceInput') as HTMLInputElement | null;
    if (!voltageInput || !resistanceInput) return;

    const V = parseFloat(voltageInput.value);
    const R = parseFloat(resistanceInput.value);
    const I = V / R;

    const ammeter = this.#root?.querySelector('.ammeter');
    const voltmeter = this.#root?.querySelector('.voltmeter');
    const resultDisplay = this.#root?.querySelector('#resultDisplay');
    const battery = this.#root?.querySelector('.battery') as HTMLElement | null;
    const resistor = this.#root?.querySelector('.resistor') as HTMLElement | null;

    if (ammeter) ammeter.textContent = `I = ${I.toFixed(2)} A`;
    if (voltmeter) voltmeter.textContent = `V = ${V.toFixed(1)} V`;

    // Visual feedback: brighter glow for higher current
    const glowIntensity = Math.min(I / 2, 1);
    const particles = this.#root?.querySelectorAll('.current-flow');
    particles?.forEach(p => {
      const el = p as HTMLElement;
      el.style.opacity = glowIntensity > 0 ? '1' : '0';
      el.style.boxShadow = `0 0 ${8 * glowIntensity}px rgba(0,255,255,${glowIntensity})`;
      // Animate particles flowing
      el.style.animation = `currentFlow ${Math.max(0.5, 2 - I * 0.1)}s linear infinite`;
    });

    if (battery) {
      battery.style.boxShadow = `0 0 ${10 * glowIntensity}px rgba(0,255,255,${glowIntensity * 0.5})`;
    }
    if (resistor) {
      resistor.style.opacity = glowIntensity > 0.5 ? '1' : '0.5';
    }

    if (resultDisplay) {
      resultDisplay.innerHTML = `
        <div>I = V / R = ${V} / ${R} = <strong>${I.toFixed(2)} A</strong></div>
        <div style="margin-top:.5rem;font-size:.9rem;color:#888;">
          ${I > 1 ? '⚠️ High current! The resistor is getting warm.' : 'Current flowing steadily.'}
        </div>
      `;
    }

    // Dispatch event
    this.dispatchEvent(new CustomEvent('simulation:complete', {
      detail: { voltage: V, resistance: R, current: I },
      bubbles: true,
    }));
  }
}

// Add CSS animation for current flow
const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(`
  @keyframes currentFlow {
    0% { transform: translateX(0); }
    100% { transform: translateX(200px); }
  }
`);
if (document.adoptedStyleSheets) {
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
}

if (!customElements.get('stem-circuit-sim')) {
  customElements.define('stem-circuit-sim', StemCircuitSim);
}
