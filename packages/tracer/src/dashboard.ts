import { Tracer } from './tracer';
import type { Span } from './types';

const STYLES = `
  :host {
    all: initial;
    position: fixed;
    bottom: 16px;
    right: 16px;
    z-index: 2147483647;
    font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 12px;
    line-height: 1.5;
    color: #e2e8f0;
    width: 380px;
    max-height: 600px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    border: 1px solid #334155;
    display: block;
    background: #0f172a;
  }

  :host(.minimized) #body { display: none; }
  :host(.minimized) #header { border-bottom: none; }
  :host(.hidden) { display: none; }

  #header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #1e293b;
    border-bottom: 1px solid #334155;
    cursor: move;
    user-select: none;
  }

  #title {
    font-weight: 700;
    font-size: 13px;
    color: #818cf8;
    letter-spacing: 0.5px;
  }

  #stats {
    flex: 1;
    text-align: right;
    font-size: 11px;
    color: #94a3b8;
  }

  #toggle {
    background: none;
    border: 1px solid #475569;
    color: #94a3b8;
    border-radius: 4px;
    padding: 2px 8px;
    cursor: pointer;
    font-size: 12px;
    font-family: inherit;
  }

  #toggle:hover {
    background: #334155;
    color: #e2e8f0;
  }

  #body {
    overflow-y: auto;
    max-height: 520px;
  }

  #summary {
    padding: 8px 12px;
    background: #1e293b;
    border-bottom: 1px solid #334155;
    font-size: 11px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
  }

  .summary-label { color: #64748b; }
  .summary-value { text-align: right; color: #e2e8f0; }

  #tree {
    padding: 4px 0;
  }

  .span-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 3px 12px;
    cursor: default;
    transition: background 0.1s;
  }

  .span-row:hover { background: #1e293b; }

  .span-row.has-children { cursor: pointer; }

  .span-indent {
    display: inline-block;
    width: 16px;
    flex-shrink: 0;
  }

  .span-toggle {
    width: 14px;
    flex-shrink: 0;
    text-align: center;
    color: #64748b;
    font-size: 10px;
  }

  .span-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .span-duration {
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
    color: #94a3b8;
  }

  .status-badge {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .status-completed { background: #22c55e; }
  .status-running { background: #eab308; }
  .status-errored { background: #ef4444; }

  #clear-btn {
    display: block;
    width: 100%;
    padding: 6px;
    background: #1e293b;
    border: none;
    border-top: 1px solid #334155;
    color: #64748b;
    font-size: 11px;
    font-family: inherit;
    cursor: pointer;
  }

  #clear-btn:hover {
    background: #334155;
    color: #e2e8f0;
  }

  .drag-handle { cursor: move; }
`;

export class TracerDashboard extends HTMLElement {
  static observedAttributes = ['visible'];

  private shadow: ShadowRoot;
  private headerEl!: HTMLElement;
  private toggleBtn!: HTMLButtonElement;
  private treeEl!: HTMLElement;
  private clearBtn!: HTMLButtonElement;
  private minimized = false;
  private unsubscribe: (() => void) | null = null;
  private collapsedSpans: Set<string> = new Set();

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback(): void {
    const tracer = Tracer.getInstance();
    this.unsubscribe = tracer.on(() => this.refresh());

    this.toggleBtn.addEventListener('click', () => this.toggleMinimize());
    this.clearBtn.addEventListener('click', () => {
      Tracer.getInstance().reset();
      this.refresh();
    });

    this.makeDraggable();
    this.refresh();
  }

  disconnectedCallback(): void {
    this.unsubscribe?.();
  }

  private render(): void {
    this.shadow.innerHTML = `
      <style>${STYLES}</style>
      <div id="header" class="drag-handle">
        <span id="title">TRACER</span>
        <span id="stats"></span>
        <button id="toggle">_</button>
      </div>
      <div id="body">
        <div id="summary">
          <span class="summary-label">Trace ID</span>
          <span class="summary-value" id="trace-id">--</span>
          <span class="summary-label">Spans</span>
          <span class="summary-value" id="span-count">0</span>
          <span class="summary-label">Total time</span>
          <span class="summary-value" id="total-time">0ms</span>
          <span class="summary-label">Errors</span>
          <span class="summary-value" id="error-count">0</span>
        </div>
        <div id="tree"></div>
        <button id="clear-btn">Clear</button>
      </div>
    `;

    this.headerEl = this.shadow.getElementById('header')! as HTMLElement;
    this.toggleBtn = this.shadow.getElementById('toggle')! as HTMLButtonElement;
    this.treeEl = this.shadow.getElementById('tree')! as HTMLElement;
    this.clearBtn = this.shadow.getElementById('clear-btn')! as HTMLButtonElement;
  }

  private toggleMinimize(): void {
    this.minimized = !this.minimized;
    this.classList.toggle('minimized', this.minimized);
    this.toggleBtn.textContent = this.minimized ? '+' : '_';
  }

  private refresh(): void {
    const tracer = Tracer.getInstance();
    const spans = tracer.getAllSpans();
    const tree = tracer.getSpanTree();

    const statsEl = this.shadow.getElementById('stats');
    if (statsEl) statsEl.textContent = `${spans.length} spans`;
    this.renderSummary(tracer, spans);
    this.renderTree(tree, 0);
  }

  private renderSummary(tracer: Tracer, spans: Span[]): void {
    const running = spans.filter((s) => s.status === 'running').length;
    const errored = spans.filter((s) => s.status === 'errored').length;
    const completed = spans.filter((s) => s.status === 'completed' && s.duration !== null);
    const totalTime = completed.length > 0
      ? Math.max(...completed.map((s) => s.duration!))
      : 0;

    const traceIdEl = this.shadow.getElementById('trace-id');
    const spanCountEl = this.shadow.getElementById('span-count');
    const totalTimeEl = this.shadow.getElementById('total-time');
    const errorCountEl = this.shadow.getElementById('error-count');
    if (traceIdEl) traceIdEl.textContent = tracer.getCurrentTraceId()?.slice(0, 8) ?? '--';
    if (spanCountEl) spanCountEl.textContent = `${spans.length} (${running} running)`;
    if (totalTimeEl) totalTimeEl.textContent = `${totalTime.toFixed(1)}ms`;
    if (errorCountEl) errorCountEl.textContent = `${errored}`;
  }

  private renderTree(spans: Span[], depth: number): void {
    const fragment = document.createDocumentFragment();

    for (const span of spans) {
      const row = document.createElement('div');
      const spanWithChildren = span as Span & { children?: Span[] };
      const hasChildren = spanWithChildren.children && spanWithChildren.children.length > 0;

      row.className = `span-row${hasChildren ? ' has-children' : ''}`;
      row.style.paddingLeft = `${12 + depth * 16}px`;

      const badge = document.createElement('span');
      badge.className = `status-badge status-${span.status}`;
      row.appendChild(badge);

      if (hasChildren) {
        const toggle = document.createElement('span');
        toggle.className = 'span-toggle';
        toggle.textContent = this.collapsedSpans.has(span.spanId) ? '+' : '-';
        row.appendChild(toggle);
      } else {
        const spacer = document.createElement('span');
        spacer.className = 'span-toggle';
        spacer.textContent = '';
        row.appendChild(spacer);
      }

      const nameEl = document.createElement('span');
      nameEl.className = 'span-name';
      nameEl.textContent = span.name;
      row.appendChild(nameEl);

      const durationEl = document.createElement('span');
      durationEl.className = 'span-duration';
      durationEl.textContent = span.duration !== null ? `${span.duration.toFixed(1)}ms` : '...';
      row.appendChild(durationEl);

      if (hasChildren) {
        row.addEventListener('click', () => {
          if (this.collapsedSpans.has(span.spanId)) {
            this.collapsedSpans.delete(span.spanId);
          } else {
            this.collapsedSpans.add(span.spanId);
          }
          this.refresh();
        });
      }

      fragment.appendChild(row);

      if (hasChildren && !this.collapsedSpans.has(span.spanId)) {
        this.renderTreeTo(spanWithChildren.children!, depth + 1, fragment);
      }
    }

    this.treeEl.innerHTML = '';
    this.treeEl.appendChild(fragment);
  }

  private renderTreeTo(spans: Span[], depth: number, parent: DocumentFragment): void {
    for (const span of spans) {
      const row = document.createElement('div');
      const spanWithChildren = span as Span & { children?: Span[] };
      const hasChildren = spanWithChildren.children && spanWithChildren.children.length > 0;

      row.className = `span-row${hasChildren ? ' has-children' : ''}`;
      row.style.paddingLeft = `${12 + depth * 16}px`;

      const badge = document.createElement('span');
      badge.className = `status-badge status-${span.status}`;
      row.appendChild(badge);

      if (hasChildren) {
        const toggle = document.createElement('span');
        toggle.className = 'span-toggle';
        toggle.textContent = this.collapsedSpans.has(span.spanId) ? '+' : '-';
        row.appendChild(toggle);
      } else {
        const spacer = document.createElement('span');
        spacer.className = 'span-toggle';
        row.appendChild(spacer);
      }

      const nameEl = document.createElement('span');
      nameEl.className = 'span-name';
      nameEl.textContent = span.name;
      row.appendChild(nameEl);

      const durationEl = document.createElement('span');
      durationEl.className = 'span-duration';
      durationEl.textContent = span.duration !== null ? `${span.duration.toFixed(1)}ms` : '...';
      row.appendChild(durationEl);

      if (hasChildren) {
        row.addEventListener('click', () => {
          if (this.collapsedSpans.has(span.spanId)) {
            this.collapsedSpans.delete(span.spanId);
          } else {
            this.collapsedSpans.add(span.spanId);
          }
          this.refresh();
        });
      }

      parent.appendChild(row);

      if (hasChildren && !this.collapsedSpans.has(span.spanId)) {
        this.renderTreeTo(spanWithChildren.children!, depth + 1, parent);
      }
    }
  }

  private makeDraggable(): void {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let origX = 0;
    let origY = 0;

    const onStart = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('#toggle, #clear-btn, .span-row')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = this.getBoundingClientRect();
      origX = rect.left;
      origY = rect.top;
    };

    const onMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      this.style.left = `${origX + dx}px`;
      this.style.top = `${origY + dy}px`;
      this.style.right = 'auto';
      this.style.bottom = 'auto';
    };

    const onEnd = () => {
      isDragging = false;
    };

    this.headerEl.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
  }
}

export function registerDashboard(): void {
  if (!customElements.get('stem-tracer-dashboard')) {
    customElements.define('stem-tracer-dashboard', TracerDashboard);
  }
}

export function showDashboard(): void {
  registerDashboard();
  const existing = document.querySelector('stem-tracer-dashboard');
  if (existing) {
    existing.classList.remove('hidden');
    return;
  }
  const el = document.createElement('stem-tracer-dashboard');
  document.body.appendChild(el);
}

export function hideDashboard(): void {
  const el = document.querySelector('stem-tracer-dashboard');
  if (el) {
    el.classList.add('hidden');
  }
}
