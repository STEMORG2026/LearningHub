/**
 * stem-optics-sim Web Component — interactive optics simulation.
 *
 * Learners adjust the medium, the angle of incidence, and a lens's focal
 * length, then predict what happens to the refracted ray and the image.
 * Predict → Observe → Explain flow, matching the siblings.
 *
 * Unlike `stem-mechanics-sim` and `stem-circuit-sim`, all arithmetic lives in
 * `./optics-physics` as pure functions. That was mandated by ADR-015
 * Follow-up #3 for the third simulation: the pattern for embedding a formula
 * inline in `#run()` was set twice already, and optics has sign conventions
 * that need testing that a DOM click cannot provide.
 *
 * This file therefore does three things only:
 *   1. read inputs out of the shadow DOM,
 *   2. call the pure physics,
 *   3. render the result and emit the completion events.
 */

import { getDefaultEventBus } from '@learninghub/core';
import { Tracer } from '@learninghub/tracer';
import {
  angleOfRefraction,
  criticalAngle,
  thinLens,
  NO_SOLUTION,
  describeImage,
  type LensResult,
} from './optics-physics';

const STYLES = `:host{display:block;font-family:'Segoe UI',system-ui,sans-serif;color:#e0e0e0}
@keyframes rayTravel {
  0% { stroke-dashoffset: 120; opacity:.2; }
  100% { stroke-dashoffset: 0; opacity:1; }
}
.optics-wrap{max-width:700px;margin:0 auto;padding:1rem}
.optics-title{font-size:1.4rem;color:#fff;margin-bottom:.3rem}
.optics-sub{color:#888;font-size:.9rem;margin-bottom:1.2rem}
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
.control-label{width:120px;font-size:.9rem;color:#888}
.control-input{flex:1;-webkit-appearance:none;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;outline:none}
.control-input::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#0ff;cursor:pointer}
.control-value{width:70px;text-align:right;font-family:monospace;color:#0ff}
.run-btn{background:linear-gradient(135deg,rgba(0,255,255,0.15),rgba(0,255,136,0.15));border:1px solid rgba(0,255,255,0.3);color:#0ff;padding:.7rem 1.5rem;border-radius:12px;cursor:pointer;font-size:1rem;font-weight:600;width:100%;transition:all .2s;margin-bottom:1.2rem}
.run-btn:hover:not(:disabled){background:linear-gradient(135deg,rgba(0,255,255,0.25),rgba(0,255,136,0.25))}
.run-btn:disabled{opacity:.5;cursor:not-allowed}
.optics-display{position:relative;width:100%;height:220px;background:rgba(0,0,0,0.3);border-radius:12px;overflow:hidden;margin-bottom:1.2rem;border:1px solid rgba(255,255,255,0.1)}
.optics-svg{width:100%;height:100%;display:block}
.ray-line{stroke:#0ff;stroke-width:2;fill:none;stroke-dasharray:120;stroke-dashoffset:120}
.ray-line.animating{animation:rayTravel .8s ease-out forwards}
.normal-line{stroke:rgba(255,255,255,0.25);stroke-width:1;stroke-dasharray:4 4}
.medium-label{fill:#888;font-size:11px;font-family:monospace}
.readout{position:absolute;top:10px;right:10px;font-family:monospace;font-size:.78rem;color:#0ff;background:rgba(0,0,0,0.55);padding:.3rem .6rem;border-radius:8px;line-height:1.5}
.results{background:rgba(0,255,255,0.04);border:1px solid rgba(0,255,255,0.1);border-radius:12px;padding:1.2rem;display:none}
.results.visible{display:block}
.results-title{font-size:1rem;color:#0ff;margin-bottom:.8rem}
.result-value{font-size:1.5rem;font-weight:700;color:#0ff;margin:.5rem 0}
.result-comparison{margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.1);font-size:.9rem}
.result-comparison div{margin-bottom:.5rem}
.feedback-correct{color:#0f8}
.feedback-incorrect{color:#f44}
.warn{color:#fc0}
`;
const template = document.createElement('template');
template.innerHTML = `<style>${STYLES}</style>
<div class="optics-wrap" id="opticsWrap">
  <h2 class="optics-title">Refraction, Lenses, and Images</h2>
  <p class="optics-sub">Adjust the media, the angle of incidence, and the focal length, then predict what the light does.</p>
  <div class="predict-section">
    <div class="predict-title">Predict</div>
    <div class="predict-question" id="predictQuestion">Light passes from air into glass. As it enters the glass, the ray bends…</div>
    <div class="predict-options" id="predictOptions"></div>
  </div>
  <div class="controls">
    <div class="control-row">
      <span class="control-label">n₁ (from)</span>
      <input type="range" class="control-input" id="n1Input" min="1" max="2.5" step="0.01" value="1">
      <span class="control-value" id="n1Value">1.00</span>
    </div>
    <div class="control-row">
      <span class="control-label">n₂ (into)</span>
      <input type="range" class="control-input" id="n2Input" min="1" max="2.5" step="0.01" value="1.5">
      <span class="control-value" id="n2Value">1.50</span>
    </div>
    <div class="control-row">
      <span class="control-label">Angle (°)</span>
      <input type="range" class="control-input" id="angleInput" min="0" max="89" value="30">
      <span class="control-value" id="angleValue">30</span>
    </div>
    <div class="control-row">
      <span class="control-label">Focal f (cm)</span>
      <input type="range" class="control-input" id="focalInput" min="-40" max="40" value="10">
      <span class="control-value" id="focalValue">10</span>
    </div>
    <div class="control-row">
      <span class="control-label">Object u (cm)</span>
      <input type="range" class="control-input" id="objectInput" min="1" max="100" value="30">
      <span class="control-value" id="objectValue">30</span>
    </div>
  </div>
  <button class="run-btn" id="runBtn">Run Simulation</button>
  <div class="optics-display" id="opticsDisplay">
    <svg class="optics-svg" id="opticsSvg" viewBox="0 0 700 220" preserveAspectRatio="xMidYMid meet">
      <line class="normal-line" x1="350" y1="10" x2="350" y2="210"></line>
      <line id="boundaryLine" x1="0" y1="110" x2="700" y2="110" stroke="rgba(255,255,255,0.18)" stroke-width="1"></line>
      <line class="ray-line" id="incidentRay" x1="150" y1="30" x2="350" y2="110"></line>
      <line class="ray-line" id="refractedRay" x1="350" y1="110" x2="550" y2="190"></line>
      <text class="medium-label" id="label1" x="12" y="100">n₁ = 1.00</text>
      <text class="medium-label" id="label2" x="12" y="130">n₂ = 1.50</text>
    </svg>
    <div class="readout" id="readout">θ₁ = 30°</div>
  </div>
  <div class="results" id="results">
    <div class="results-title">Results</div>
    <div class="result-value" id="refractionResult"></div>
    <div class="result-value" id="lensResult"></div>
    <div class="result-comparison" id="comparison"></div>
  </div>
</div>`;

const PREDICT_OPTIONS = [
  { text: 'It bends toward the normal', correct: true },
  { text: 'It bends away from the normal', correct: false },
  { text: 'It continues straight through', correct: false },
  { text: 'It reflects back into the air', correct: false },
];

/** SVG geometry constants — the viewBox is 700x220 with the boundary at y=110. */
const BOUNDARY_Y = 110;
const ORIGIN_X = 350;
const RAY_LENGTH = 220;

export class StemOpticsSim extends HTMLElement {
  #wrap: HTMLElement | null = null;
  #predictionMade = false;
  #predictionCorrect = false;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
    this.#wrap = shadow.getElementById('opticsWrap');
  }

  connectedCallback(): void {
    this.#setupControls();
    this.#setupPrediction();
    this.#setupRunButton();
  }

  #setupControls(): void {
    const bind = (inputId: string, valueId: string, fmt: (v: string) => string) => {
      const input = this.#wrap?.querySelector(`#${inputId}`) as HTMLInputElement | null;
      const value = this.#wrap?.querySelector(`#${valueId}`);
      input?.addEventListener('input', () => {
        if (value) value.textContent = fmt(input.value);
      });
    };
    bind('n1Input', 'n1Value', (v) => parseFloat(v).toFixed(2));
    bind('n2Input', 'n2Value', (v) => parseFloat(v).toFixed(2));
    bind('angleInput', 'angleValue', (v) => v);
    bind('focalInput', 'focalValue', (v) => v);
    bind('objectInput', 'objectValue', (v) => v);
  }

  #setupPrediction(): void {
    const optionsContainer = this.#wrap?.querySelector('#predictOptions');
    if (!optionsContainer) return;

    PREDICT_OPTIONS.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'predict-btn';
      btn.textContent = opt.text;
      btn.addEventListener('click', () => {
        // Selections lock once the simulation has run, so the feedback the
        // learner sees cannot be gamed by clicking afterwards. Matches the
        // mechanics widget deliberately.
        if (this.#predictionMade) return;
        optionsContainer.querySelectorAll('.predict-btn').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
      optionsContainer.appendChild(btn);
    });
  }

  #setupRunButton(): void {
    const runBtn = this.#wrap?.querySelector('#runBtn') as HTMLButtonElement | null;
    runBtn?.addEventListener('click', () => this.#run());
  }

  #readInputs() {
    const num = (id: string, fallback: number): number => {
      const el = this.#wrap?.querySelector(`#${id}`) as HTMLInputElement | null;
      const v = el ? parseFloat(el.value) : NaN;
      return Number.isFinite(v) ? v : fallback;
    };
    return {
      n1: num('n1Input', 1),
      n2: num('n2Input', 1.5),
      angle: num('angleInput', 30),
      focal: num('focalInput', 10),
      object: num('objectInput', 30),
    };
  }

  #run(): void {
    const { n1, n2, angle, focal, object } = this.#readInputs();

    // ── Pure computation (no DOM) ──────────────────────────────────────────
    const refraction = angleOfRefraction(n1, n2, angle);
    const crit = criticalAngle(n1, n2);
    const lens = thinLens(focal, object);

    this.#predictionMade = true;
    this.#scorePrediction();

    // ── Render: refraction ray ─────────────────────────────────────────────
    const refractedRay = this.#wrap?.querySelector('#refractedRay') as SVGLineElement | null;
    const label1 = this.#wrap?.querySelector('#label1');
    const label2 = this.#wrap?.querySelector('#label2');
    const readout = this.#wrap?.querySelector('#readout');

    if (label1) label1.textContent = `n₁ = ${n1.toFixed(2)}`;
    if (label2) label2.textContent = `n₂ = ${n2.toFixed(2)}`;

    if (refractedRay) {
      refractedRay.classList.remove('animating');
      // Force a reflow so the animation restarts on repeated runs; without this
      // the class re-add is coalesced and the ray appears frozen.
      void refractedRay.getBoundingClientRect();

      if (refraction.totalInternalReflection) {
        // No transmitted ray: draw the reflected ray going back up-left, at the
        // same angle above the normal as the incident ray is below it.
        const rad = (angle * Math.PI) / 180;
        const dx = -Math.cos(rad) * RAY_LENGTH;
        const dy = -Math.sin(rad) * RAY_LENGTH;
        refractedRay.setAttribute('x1', String(ORIGIN_X));
        refractedRay.setAttribute('y1', String(BOUNDARY_Y));
        refractedRay.setAttribute('x2', String(ORIGIN_X + dx));
        refractedRay.setAttribute('y2', String(BOUNDARY_Y + dy));
        refractedRay.setAttribute('stroke', '#fc0');
      } else {
        // Refracted ray, drawn from the boundary into the lower medium. The
        // 90° offset accounts for measuring the angle from the normal (which is
        // vertical here) rather than from the horizontal boundary.
        const rad = (refraction.angleDeg * Math.PI) / 180;
        const dx = Math.sin(rad) * RAY_LENGTH;
        const dy = Math.cos(rad) * RAY_LENGTH;
        refractedRay.setAttribute('x1', String(ORIGIN_X));
        refractedRay.setAttribute('y1', String(BOUNDARY_Y));
        refractedRay.setAttribute('x2', String(ORIGIN_X + dx));
        refractedRay.setAttribute('y2', String(BOUNDARY_Y + dy));
        refractedRay.setAttribute('stroke', '#0ff');
      }
      refractedRay.classList.add('animating');
    }

    if (readout) {
      readout.textContent = refraction.totalInternalReflection
        ? `θ₁ = ${angle}°  ⚠ TIR`
        : `θ₁ = ${angle}°  θ₂ = ${refraction.angleDeg.toFixed(1)}°`;
    }

    // ── Render: results panel ──────────────────────────────────────────────
    const results = this.#wrap?.querySelector('#results');
    const refractionResult = this.#wrap?.querySelector('#refractionResult');
    const lensResultEl = this.#wrap?.querySelector('#lensResult');
    const comparison = this.#wrap?.querySelector('#comparison');

    if (refractionResult) {
      if (refraction.totalInternalReflection) {
        refractionResult.textContent = 'Total internal reflection — no refracted ray';
      } else {
        refractionResult.textContent = `Refraction: θ₂ = ${refraction.angleDeg.toFixed(2)}°`;
      }
    }

    if (lensResultEl) {
      if (lens === NO_SOLUTION) {
        lensResultEl.textContent = 'No image — object is at the focal point';
      } else {
        lensResultEl.textContent = `Image: v = ${lens.imageDistance.toFixed(2)} cm (${describeImage(lens)})`;
      }
    }

    if (comparison) {
      const critLine =
        crit === null
          ? '<div>No critical angle (n₁ ≤ n₂): light always refracts.</div>'
          : `<div>Critical angle for this pair: <strong>${crit.toFixed(2)}°</strong></div>`;
      const lensLine =
        lens === NO_SOLUTION
          ? '<div>The object sits exactly at the focal point, so the emergent rays are parallel and the image is at infinity.</div>'
          : `<div>Thin lens: 1/v = 1/f − 1/u = 1/${focal} − 1/${object} → v = <strong>${lens.imageDistance.toFixed(2)} cm</strong>, m = <strong>${lens.magnification.toFixed(2)}</strong></div>`;
      comparison.innerHTML = `
        <div>n₁ = ${n1.toFixed(2)}, n₂ = ${n2.toFixed(2)}, θ₁ = ${angle}°</div>
        ${critLine}
        ${lensLine}
        <div class="${this.#predictionCorrect ? 'feedback-correct' : 'feedback-incorrect'}">
          ${this.#predictionCorrect
            ? '✓ Your prediction was correct!'
            : '✗ Your prediction was incorrect. Entering a denser medium (higher n) the ray bends toward the normal.'}
        </div>
      `;
    }

    if (results) results.classList.add('visible');

    // ── Instrumentation ────────────────────────────────────────────────────
    const payload = {
      type: 'optics' as const,
      n1,
      n2,
      angle,
      angleOfRefraction: refraction.totalInternalReflection ? null : refraction.angleDeg,
      totalInternalReflection: refraction.totalInternalReflection,
      criticalAngle: crit,
      focal,
      objectDistance: object,
      imageDistance: lens === NO_SOLUTION ? null : lens.imageDistance,
      magnification: lens === NO_SOLUTION ? null : lens.magnification,
      predictionCorrect: this.#predictionCorrect,
    };

    const tracer = Tracer.getInstance();
    const spanId = tracer.startSpan('stem-optics-sim:run', { metadata: payload });
    getDefaultEventBus().publish('simulation:complete', {
      data: payload,
      timestamp: new Date().toISOString(),
      schemaVersion: '1.0',
    });
    if (spanId) tracer.endSpan(spanId);

    // The siblings emit BOTH an EventBus publish and a bubbling DOM event.
    // That duplication is intentional and pre-existing; it is preserved here so
    // the three widgets present an identical integration surface.
    this.dispatchEvent(
      new CustomEvent('simulation:complete', {
        detail: payload,
        bubbles: true,
      }),
    );
  }

  #scorePrediction(): void {
    const selectedBtn = this.#wrap?.querySelector('.predict-btn.selected') as HTMLElement | null;
    const correctOpt = PREDICT_OPTIONS.find((o) => o.correct);
    if (!selectedBtn) {
      // No prediction made: treat as incorrect but do not decorate anything,
      // matching the mechanics widget's behaviour.
      this.#predictionCorrect = false;
      return;
    }
    this.#predictionCorrect = selectedBtn.textContent === correctOpt?.text;
    selectedBtn.classList.add(this.#predictionCorrect ? 'correct' : 'incorrect');
    if (!this.#predictionCorrect && correctOpt) {
      const correctIdx = PREDICT_OPTIONS.indexOf(correctOpt);
      const correctBtn = this.#wrap?.querySelectorAll('.predict-btn')[correctIdx] as HTMLElement | undefined;
      correctBtn?.classList.add('correct');
    }
  }

  /** Exposed for tests: the pure lens result for the current inputs. */
  computeLens(): LensResult | typeof NO_SOLUTION {
    const { focal, object } = this.#readInputs();
    return thinLens(focal, object);
  }
}

if (!customElements.get('stem-optics-sim')) {
  customElements.define('stem-optics-sim', StemOpticsSim);
}
