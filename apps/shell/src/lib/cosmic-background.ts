import {
  createSun,
  createPlanet,
  createBlackhole,
  createSmallItem,
  updatePhysics,
  PLANET_CONFIGS,
  MATH_SYMBOLS,
  SMALL_ITEM_COUNT,
  DEFAULT_MOUSE_RADIUS,
  BLACKHOLE_RESET_DELAY_MS,
  COLLISION_SOUND_CHANCE,
  SUN_RADIUS,
  SUN_MASS_FACTOR,
  type CelestialBody,
  type MoonConfig,
  type BodyType,
} from '@stem-tuition/simulation-core';
import {
  playSpark,
  playCollision,
  playExplosion,
  playMotionHum,
  syncMutedState,
  getSimulationState,
  enableBackground,
  disableBackground,
} from '@stem-tuition/acl';

const STAR_COUNT = 140;
const NEBULA_COUNT = 3;
const MAX_PARTICLES = 240;
const IDLE_MS = 6000;
const WAVE_COOLDOWN_MS = 5000;
const SOUND_MIN_GAP_MS = 90;
const BLACKHOLE_MIN_GAP_MS = 18000;
const BLACKHOLE_MAX_GAP_MS = 42000;
const MOTION_SPEED = 0.6;
const SUN_SCALE = 2;
const ORBIT_SCALE = 1.6;
const ORBIT_SPEED_SCALE = 0.7;
const MOON_SPEED_SCALE = 0.25;
const BLACKHOLE_FADE_MS = 2400;
const BLACKHOLE_COPY_DELAY_MS = 9000;
const PASSIVE_BLACKHOLE_GROWTH = 0.15;
const FALLBACK_ITEM: [BodyType, string] = ['rocket', '🚀'];

interface Star {
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  dx: number;
  dy: number;
}

interface Particle {
  kind: 'spark' | 'debris' | 'ring';
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  rot: number;
  vRot: number;
}

interface MoonSim {
  config: MoonConfig;
  angle: number;
}

interface BlackholeSim extends CelestialBody {
  bornAt: number;
}

function wrapCoord(value: number, max: number): number {
  return ((value % max) + max) % max;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function initCosmicBackground(): void {
  const found = document.getElementById('stemBackgroundCanvas') as HTMLCanvasElement | null;
  if (!found || found.dataset.cosmicReady === '1') return;
  const canvas = found;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rawCtx = canvas.getContext('2d');
  if (!rawCtx) return;
  const ctx = rawCtx;

  const stage = document.createElement('div');
  stage.id = 'cosmicStage';
  stage.className = 'cosmic-stage';
  const parent = canvas.parentElement;
  if (parent) parent.replaceChild(stage, canvas);
  stage.appendChild(canvas);

  const controls = document.createElement('div');
  controls.id = 'cosmicControls';
  controls.className = 'cosmic-controls';
  controls.innerHTML = `
    <button type="button" class="cosmic-ctl active" id="ctrlBackgroundBtn" aria-pressed="true" aria-label="Toggle background" title="Background">
      <icon-monitor name="monitor"></icon-monitor>
    </button>
    <button type="button" class="cosmic-ctl active" id="ctrlSoundBtn" aria-pressed="true" aria-label="Toggle sound" title="Sound">
      <icon-volume name="volume"></icon-volume>
    </button>
    <button type="button" class="cosmic-ctl active" id="ctrlBlackholeBtn" aria-pressed="true" aria-label="Toggle black hole" title="Black hole">
      <icon-target name="target"></icon-target>
    </button>
    <button type="button" class="cosmic-ctl" id="ctrlFullscreenBtn" aria-label="Enter fullscreen" title="Fullscreen">
      <icon-maximize name="maximize"></icon-maximize>
    </button>
  `;
  stage.appendChild(controls);

  const bgBtn = controls.querySelector<HTMLButtonElement>('#ctrlBackgroundBtn');
  const soundBtn = controls.querySelector<HTMLButtonElement>('#ctrlSoundBtn');
  const bhBtn = controls.querySelector<HTMLButtonElement>('#ctrlBlackholeBtn');
  const fsBtn = controls.querySelector<HTMLButtonElement>('#ctrlFullscreenBtn');

  let viewW = 0;
  let viewH = 0;
  let dpr = 1;
  const PAD = 0.3;

  function resize(): void {
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(viewW * dpr);
    canvas.height = Math.floor(viewH * dpr);
    canvas.style.width = `${viewW}px`;
    canvas.style.height = `${viewH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);

  const physicsW = viewW * (1 + PAD * 2);
  const physicsH = viewH * (1 + PAD * 2);
  const offsetX = (physicsW - viewW) / 2;
  const offsetY = (physicsH - viewH) / 2;

  const centerX = viewW / 2 + offsetX;
  const centerY = viewH / 2 + offsetY;

  const smallItemTypes: Array<[BodyType, string]> = [
    ['rocket', '🚀'],
    ['rocket', '🚀'],
    ['satellite', '🛰️'],
    ['satellite', '🛰️'],
    ['circuit', '⚡'],
    ['circuit', '🔌'],
  ];

  let sun: CelestialBody = createSun(physicsW, physicsH);
  let planets: CelestialBody[] = [];
  let moons: MoonSim[][] = [];
  let items: CelestialBody[] = [];
  let blackholes: BlackholeSim[] = [];
  let nextBlackholeAt = performance.now() + randomBetween(BLACKHOLE_MIN_GAP_MS, BLACKHOLE_MAX_GAP_MS);

  function buildScene(): void {
    sun = createSun(physicsW, physicsH);
    sun.x = centerX;
    sun.y = centerY;
    sun.radius = SUN_RADIUS * SUN_SCALE;
    sun.mass = sun.radius * sun.radius * SUN_MASS_FACTOR;

    planets = PLANET_CONFIGS.map((config, i) => {
      const planet = createPlanet(config, i, PLANET_CONFIGS.length, centerX, centerY);
      const dx = planet.x - centerX;
      const dy = planet.y - centerY;
      planet.x = centerX + dx * ORBIT_SCALE;
      planet.y = centerY + dy * ORBIT_SCALE;
      planet.vx *= ORBIT_SPEED_SCALE;
      planet.vy *= ORBIT_SPEED_SCALE;
      return planet;
    });

    moons = PLANET_CONFIGS.map((config) =>
      config.moons.map((m) => ({ config: m, angle: Math.random() * Math.PI * 2 })),
    );

    items = [];
    for (const [type, text] of smallItemTypes) {
      items.push(createSmallItem(type, text, physicsW, physicsH));
    }
    const symbolPool = [...MATH_SYMBOLS].sort(() => Math.random() - 0.5);
    let poolIndex = 0;
    while (items.length < SMALL_ITEM_COUNT) {
      const symbol = symbolPool[poolIndex % symbolPool.length] ?? 'π';
      items.push(createSmallItem('math_symbol', symbol, physicsW, physicsH));
      poolIndex++;
    }
  }

  buildScene();

  let stars: Star[] = [];
  let nebulae: Nebula[] = [];
  let particles: Particle[] = [];
  let mouseX = centerX;
  let mouseY = centerY;
  let lastSoundAt = 0;
  let lastActivityAt = performance.now();
  let waveReadyAt = 0;
  let lastFrame = performance.now();

  function seedStars(): void {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * viewW,
      y: Math.random() * viewH,
      size: 0.4 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
    }));
  }

  function seedNebulae(): void {
    const palette = ['rgba(124,58,237,0.18)', 'rgba(0,212,255,0.14)', 'rgba(236,72,153,0.14)'];
    nebulae = Array.from({ length: NEBULA_COUNT }, (_, i) => ({
      x: Math.random() * viewW,
      y: Math.random() * viewH,
      radius: 180 + Math.random() * 220,
      color: palette[i % palette.length] ?? 'rgba(124,58,237,0.18)',
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
    }));
  }

  seedStars();
  seedNebulae();

  function spawnParticles(kind: Particle['kind'], count: number, x: number, y: number, color: string, power: number): void {
    for (let i = 0; i < count; i++) {
      if (particles.length >= MAX_PARTICLES) particles.shift();
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.3 + Math.random() * 1.4) * power;
      particles.push({
        kind,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 400 + Math.random() * 500,
        size: 1.5 + Math.random() * 2.5,
        color,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
      });
    }
  }

  function spawnRing(x: number, y: number, maxRadius: number, color: string, maxLife = 1400): void {
    particles.push({
      kind: 'ring',
      x,
      y,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife,
      size: maxRadius,
      color,
      rot: 0,
      vRot: 0,
    });
  }

  function maybePlaySound(fn: () => void): void {
    const now = performance.now();
    if (now - lastSoundAt < SOUND_MIN_GAP_MS) return;
    lastSoundAt = now;
    fn();
  }

  function blackholeExplodeRadius(): number {
    return 2.5 * Math.hypot(viewW, viewH);
  }

  function fireGravitationalWave(): void {
    const diag = Math.hypot(viewW, viewH);
    const edges: Array<[number, number, string]> = [
      [viewW * 0.5, 0, 'rgba(168,85,247,0.55)'],
      [viewW * 0.5, viewH, 'rgba(168,85,247,0.55)'],
      [0, viewH * 0.5, 'rgba(0,212,255,0.55)'],
      [viewW, viewH * 0.5, 'rgba(0,212,255,0.55)'],
      [viewW * 0.12, viewH * 0.12, 'rgba(236,72,153,0.45)'],
      [viewW * 0.88, viewH * 0.88, 'rgba(236,72,153,0.45)'],
    ];
    const [ex, ey, color] = edges[Math.floor(Math.random() * edges.length)] ?? edges[0]!;
    spawnRing(ex, ey, diag * 0.7, color, 1600);
    const cx = viewW / 2;
    const cy = viewH / 2;
    const impulse = 1.6;
    const movable = [sun, ...planets, ...items, ...blackholes].filter((b) => !b.isExploded);
    for (const body of movable) {
      const dx = cx - (body.x - offsetX);
      const dy = cy - (body.y - offsetY);
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const inward = Math.min(dist / (Math.max(viewW, viewH) * 0.5), 1);
      body.vx += (dx / dist) * impulse * inward;
      body.vy += (dy / dist) * impulse * inward;
      body.vx += (Math.random() - 0.5) * 0.5;
      body.vy += (Math.random() - 0.5) * 0.5;
    }
    maybePlaySound(() => playMotionHum());
  }

  function handlePointerDown(e: PointerEvent): void {
    if ((e.target as HTMLElement).closest('#cosmicControls')) return;
    lastActivityAt = performance.now();
    waveReadyAt = performance.now() + WAVE_COOLDOWN_MS;
    const x = e.clientX + offsetX;
    const y = e.clientY + offsetY;
    spawnParticles('spark', 14, e.clientX, e.clientY, '#7dd3fc', 1);
    spawnParticles('spark', 10, e.clientX, e.clientY, '#c4b5fd', 1);
    maybePlaySound(() => playSpark());
    const burst = 0.9;
    const movable = [sun, ...planets, ...items, ...blackholes].filter((b) => !b.isExploded);
    for (const body of movable) {
      const dx = body.x - x;
      const dy = body.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < DEFAULT_MOUSE_RADIUS && dist > 1) {
        body.vx += (dx / dist) * burst * (1 - dist / DEFAULT_MOUSE_RADIUS);
        body.vy += (dy / dist) * burst * (1 - dist / DEFAULT_MOUSE_RADIUS);
      }
    }
  }

  function handlePointerMove(e: PointerEvent): void {
    lastActivityAt = performance.now();
    mouseX = e.clientX + offsetX;
    mouseY = e.clientY + offsetY;
  }

  function handleActivity(): void {
    lastActivityAt = performance.now();
  }

  function blackholeEnabled(): boolean {
    return Boolean(bhBtn && bhBtn.classList.contains('active'));
  }

  function spawnBlackhole(): void {
    const bh = createBlackhole(physicsW, physicsH);
    bh.x = randomBetween(offsetX + 60, offsetX + viewW - 60);
    bh.y = randomBetween(offsetY + 60, offsetY + viewH - 60);
    bh.radius = SUN_RADIUS * 0.5;
    blackholes.push({ ...bh, bornAt: performance.now() });
  }

  function spawnBlackholeCopy(): void {
    const bh = createBlackhole(physicsW, physicsH);
    let x = 0;
    let y = 0;
    let tries = 0;
    do {
      x = randomBetween(offsetX + 60, offsetX + viewW - 60);
      y = randomBetween(offsetY + 60, offsetY + viewH - 60);
      tries++;
    } while (tries < 8 && blackholes.some((b) => Math.hypot(b.x - x, b.y - y) < viewW * 0.4));
    bh.x = x;
    bh.y = y;
    bh.radius = SUN_RADIUS * 0.5;
    blackholes.push({ ...bh, bornAt: performance.now() });
  }

  function explodeBlackhole(x: number, y: number): void {
    const diag = Math.hypot(viewW, viewH);
    spawnParticles('debris', 60, x, y, '#c4b5fd', 3);
    spawnParticles('spark', 50, x, y, '#ffffff', 2.8);
    spawnRing(x, y, diag * 2.5, 'rgba(216,180,254,0.8)', 1400);
    spawnRing(x, y, diag * 1.7, 'rgba(255,255,255,0.7)', 1200);
    spawnRing(x, y, diag * 1.0, 'rgba(255,170,0,0.7)', 1000);
    maybePlaySound(() => playExplosion());
    const movable = [sun, ...planets, ...items].filter((b) => !b.isExploded);
    for (const body of movable) {
      const dx = body.x - x;
      const dy = body.y - y;
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const kick = 2.4 * (1 - Math.min(dist / diag, 1));
      body.vx += (dx / dist) * kick + (Math.random() - 0.5) * 0.6;
      body.vy += (dy / dist) * kick + (Math.random() - 0.5) * 0.6;
    }
  }

  function wrapSmallItems(): void {
    for (const body of [sun, ...planets, ...items, ...blackholes]) {
      if (body.type === 'big_sun' || body.type === 'giant_planet' || body.type === 'super_blackhole') continue;
      if (body.isExploded) continue;
      const sx = wrapCoord(body.x - offsetX, viewW);
      const sy = wrapCoord(body.y - offsetY, viewH);
      body.x = sx + offsetX;
      body.y = sy + offsetY;
    }
  }

  function advanceMoons(dt: number): void {
    for (let p = 0; p < moons.length; p++) {
      for (let m = 0; m < moons[p]!.length; m++) {
        moons[p]![m]!.angle += (moons[p]![m]!.config.speed ?? 0.02) * dt * MOON_SPEED_SCALE;
      }
    }
  }

  function drawElectricField(now: number): void {
    const near = [sun, ...planets, ...items, ...blackholes];
    for (let i = 0; i < near.length; i++) {
      for (let j = i + 1; j < near.length; j++) {
        const a = near[i]!;
        const b = near[j]!;
        if (a.isExploded || b.isExploded) continue;
        const ax = a.x - offsetX;
        const ay = a.y - offsetY;
        const bx = b.x - offsetX;
        const by = b.y - offsetY;
        const dx = bx - ax;
        const dy = by - ay;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 260 || dist < 20) continue;
        if (a.charge * b.charge >= 0) continue;
        const alpha = (1 - dist / 260) * 0.22;
        const wobble = Math.sin(now * 0.003 + i * 1.3) * 8;
        const mx = (ax + bx) / 2 + (dy / dist) * wobble;
        const my = (ay + by) / 2 - (dx / dist) * wobble;
        ctx.strokeStyle = `rgba(103,232,249,${alpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.quadraticCurveTo(mx, my, bx, by);
        ctx.stroke();
      }
    }
  }

  function drawMagneticRings(now: number): void {
    const charged = [sun, ...planets, ...items];
    for (let i = 0; i < charged.length; i++) {
      const body = charged[i]!;
      if (body.isExploded) continue;
      const x = body.x - offsetX;
      const y = body.y - offsetY;
      if (x < -60 || x > viewW + 60 || y < -60 || y > viewH + 60) continue;
      const ringRadius = body.radius + 14 + Math.sin(now * 0.002 + i) * 4;
      const color = body.charge < 0 ? 'rgba(192,132,252,0.28)' : 'rgba(103,232,249,0.28)';
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      const dash = 3 + (i % 3);
      ctx.setLineDash([dash, dash + 3]);
      ctx.beginPath();
      ctx.ellipse(x, y, ringRadius, ringRadius * 0.5, now * 0.0004 + i, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  function drawSun(now: number): void {
    const x = sun.x - offsetX;
    const y = sun.y - offsetY;
    const pulse = 1 + Math.sin(now * 0.0012) * 0.04;
    const glow = ctx.createRadialGradient(x, y, sun.radius * 0.2, x, y, sun.radius * 3.2 * pulse);
    glow.addColorStop(0, 'rgba(255,220,150,0.55)');
    glow.addColorStop(0.35, 'rgba(255,160,60,0.28)');
    glow.addColorStop(1, 'rgba(255,120,40,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, sun.radius * 3.2 * pulse, 0, Math.PI * 2);
    ctx.fill();

    const disc = ctx.createRadialGradient(x - 8, y - 8, 4, x, y, sun.radius);
    disc.addColorStop(0, '#fff7cc');
    disc.addColorStop(0.55, '#ffc94d');
    disc.addColorStop(1, '#ff7b1c');
    ctx.fillStyle = disc;
    ctx.beginPath();
    ctx.arc(x, y, sun.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,200,80,0.4)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const arc = (i / 5) * Math.PI * 2 + now * 0.0003;
      ctx.beginPath();
      ctx.arc(x, y, sun.radius + 10 + (i % 2) * 14, arc, arc + 1.1);
      ctx.stroke();
    }
  }

  function drawPlanet(body: CelestialBody, index: number): void {
    const config = PLANET_CONFIGS[index];
    if (!config) return;
    const x = body.x - offsetX;
    const y = body.y - offsetY;
    if (x < -120 || x > viewW + 120 || y < -120 || y > viewH + 120) return;

    const glow = ctx.createRadialGradient(x, y, body.radius * 0.2, x, y, body.radius * 2.4);
    glow.addColorStop(0, config.glow);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, body.radius * 2.4, 0, Math.PI * 2);
    ctx.fill();

    if (config.hasRings) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-0.4);
      ctx.strokeStyle = 'rgba(255,235,190,0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, body.radius * 1.7, body.radius * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,235,190,0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, body.radius * 1.95, body.radius * 0.52, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    const disc = ctx.createRadialGradient(x - body.radius * 0.3, y - body.radius * 0.3, 2, x, y, body.radius);
    disc.addColorStop(0, '#ffffff');
    disc.addColorStop(0.35, config.color);
    disc.addColorStop(1, '#000000');
    ctx.fillStyle = disc;
    ctx.beginPath();
    ctx.arc(x, y, body.radius, 0, Math.PI * 2);
    ctx.fill();

    drawMoons(body, index, x, y);
  }

  function drawMoons(parent: CelestialBody, index: number, px: number, py: number): void {
    const sims = moons[index];
    if (!sims) return;
    for (const sim of sims) {
      const dist = (parent.radius + sim.config.size) * sim.config.dist;
      const mx = px + Math.cos(sim.angle) * dist;
      const my = py + Math.sin(sim.angle) * dist;
      if (sim.config.icon) {
        ctx.save();
        ctx.translate(mx, my);
        ctx.font = `${sim.config.size * 1.8}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sim.config.icon, 0, 0);
        ctx.restore();
      } else {
        ctx.fillStyle = sim.config.color ?? '#e0e0e0';
        ctx.beginPath();
        ctx.arc(mx, my, sim.config.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawSmallItem(body: CelestialBody): void {
    const x = body.x - offsetX;
    const y = body.y - offsetY;
    if (x < -60 || x > viewW + 60 || y < -60 || y > viewH + 60) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(body.rotation);
    ctx.shadowColor = 'rgba(0,212,255,0.55)';
    ctx.shadowBlur = 8;
    ctx.font = '600 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (body.type === 'math_symbol') {
      ctx.fillStyle = '#a5f3fc';
      ctx.font = '600 15px "JetBrains Mono", monospace';
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.font = '15px sans-serif';
    }
    ctx.fillText(body.text ?? '', 0, 0);
    ctx.restore();
  }

  function drawBlackhole(body: CelestialBody, now: number): void {
    const x = body.x - offsetX;
    const y = body.y - offsetY;
    if (x < -160 || x > viewW + 160 || y < -160 || y > viewH + 160) return;

    const pullGlow = ctx.createRadialGradient(x, y, body.radius * 0.4, x, y, body.radius * 3.4);
    pullGlow.addColorStop(0, 'rgba(139,92,246,0.5)');
    pullGlow.addColorStop(0.4, 'rgba(76,29,149,0.22)');
    pullGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = pullGlow;
    ctx.beginPath();
    ctx.arc(x, y, body.radius * 3.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(now * 0.0006);
    const accretion = ctx.createRadialGradient(0, 0, body.radius * 0.6, 0, 0, body.radius * 1.5);
    accretion.addColorStop(0, 'rgba(30,0,60,0)');
    accretion.addColorStop(0.55, 'rgba(255,120,60,0.55)');
    accretion.addColorStop(1, 'rgba(168,85,247,0.3)');
    ctx.strokeStyle = accretion;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(0, 0, body.radius * 1.5, body.radius * 0.7, 0.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x, y, body.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(216,180,254,0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function updateParticles(dt: number): void {
    particles = particles.filter((p) => p.life < p.maxLife);
    for (const p of particles) {
      p.life += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.rot += p.vRot * dt;
    }
  }

  function drawParticles(): void {
    for (const p of particles) {
      const t = p.life / p.maxLife;
      const alpha = 1 - t;
      if (p.kind === 'ring') {
        const radius = (t * 0.9 + 0.05) * p.size;
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (p.kind === 'spark') {
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        const len = 10;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * len, p.y - p.vy * len);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else {
        ctx.globalAlpha = alpha * 0.9;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.5 + t), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  }

  function drawScene(now: number): void {
    ctx.clearRect(0, 0, viewW, viewH);
    ctx.fillStyle = 'rgba(4,8,22,0.55)';
    ctx.fillRect(0, 0, viewW, viewH);

    for (const n of nebulae) {
      n.x += n.dx;
      n.y += n.dy;
      if (n.x < -n.radius) n.x = viewW + n.radius;
      if (n.x > viewW + n.radius) n.x = -n.radius;
      if (n.y < -n.radius) n.y = viewH + n.radius;
      if (n.y > viewH + n.radius) n.y = -n.radius;
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
      g.addColorStop(0, n.color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const s of stars) {
      const twinkle = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(now * 0.001 * s.speed + s.phase));
      ctx.globalAlpha = twinkle * 0.9;
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    drawElectricField(now);
    drawMagneticRings(now);
    if (!sun.isExploded) {
      drawSun(now);
    }
    for (let i = 0; i < planets.length; i++) {
      if (planets[i]!.isExploded) continue;
      drawPlanet(planets[i]!, i);
    }
    for (const body of items) {
      drawSmallItem(body);
    }
    for (const bh of blackholes) {
      const fade = Math.min((now - bh.bornAt) / BLACKHOLE_FADE_MS, 1);
      ctx.globalAlpha = fade;
      drawBlackhole(bh, now);
      ctx.globalAlpha = 1;
    }
    drawParticles();
  }

  function frame(now: number): void {
    if (canvas.style.display === 'none') {
      requestAnimationFrame(frame);
      return;
    }
    const dt = Math.min(now - lastFrame, 50);
    lastFrame = now;
    const timeScale = (dt / 16.667) * MOTION_SPEED;

    if (blackholeEnabled()) {
      if (blackholes.length === 0 && now > nextBlackholeAt) {
        spawnBlackhole();
      } else if (blackholes.length === 1 && now - blackholes[0]!.bornAt > BLACKHOLE_COPY_DELAY_MS) {
        spawnBlackholeCopy();
      }
    } else if (blackholes.length > 0) {
      blackholes = [];
      if (sun.isExploded) buildScene();
    }

    const bodies: CelestialBody[] = [sun, ...planets, ...items, ...blackholes];

    const result = updatePhysics({
      bodies,
      width: physicsW,
      height: physicsH,
      mouseX,
      mouseY,
      mouseRadius: DEFAULT_MOUSE_RADIUS,
      timeScale,
      halfIntensity: false,
      blackholeDisabled: blackholes.length === 0,
      cosmicViewActive: true,
      blackholeExplodeRadius: blackholeExplodeRadius(),
    });

    sun = result.bodies.find((b) => b.id === sun.id) ?? sun;
    planets = planets.map((p) => result.bodies.find((b) => b.id === p.id) ?? p);
    items = items.map((i) => result.bodies.find((b) => b.id === i.id) ?? i);
    blackholes = blackholes.map((bh) => {
      const synced = result.bodies.find((b) => b.id === bh.id);
      return synced ? { ...(synced as CelestialBody), bornAt: bh.bornAt } : bh;
    });

    for (const collision of result.collisions) {
      const chance = Math.random();
      if (chance < COLLISION_SOUND_CHANCE) {
        maybePlaySound(() => playCollision(collision.isGiant));
      }
      if (collision.isGiant) {
        const a = result.bodies.find((b) => b.id === collision.bodyAId);
        const b = result.bodies.find((b) => b.id === collision.bodyBId);
        const cx = a && b ? (a.x + b.x) / 2 - offsetX : mouseX - offsetX;
        const cy = a && b ? (a.y + b.y) / 2 - offsetY : mouseY - offsetY;
        spawnParticles('debris', 10, cx, cy, '#fb923c', 1.4);
      }
    }

    for (const evt of result.devours) {
      const devouringBh = blackholes.find((bh) => bh.id === evt.blackholeId);
      if (devouringBh) {
        spawnParticles('spark', 2, devouringBh.x - offsetX, devouringBh.y - offsetY, '#e9d5ff', 0.8);
      }
    }

    let explodedAny = false;
    for (const bh of blackholes) {
      if (bh.isExploded || bh.radius >= blackholeExplodeRadius()) {
        explodeBlackhole(bh.x - offsetX, bh.y - offsetY);
        explodedAny = true;
      }
    }
    if (explodedAny) {
      blackholes = [];
      buildScene();
      nextBlackholeAt = now + BLACKHOLE_RESET_DELAY_MS;
    } else {
      for (const bh of blackholes) {
        bh.radius += dt * PASSIVE_BLACKHOLE_GROWTH;
      }
      items = items.filter((i) => !i.isExploded);
      while (items.length < SMALL_ITEM_COUNT) {
        const pick = smallItemTypes[Math.floor(Math.random() * smallItemTypes.length)] ?? FALLBACK_ITEM;
        items.push(createSmallItem(pick[0], pick[1], physicsW, physicsH));
      }
    }

    wrapSmallItems();
    advanceMoons(dt);

    const idleMs = now - lastActivityAt;
    if (idleMs > IDLE_MS && now > waveReadyAt) {
      fireGravitationalWave();
      waveReadyAt = now + WAVE_COOLDOWN_MS;
    }

    updateParticles(dt);
    drawScene(now);

    requestAnimationFrame(frame);
  }

  bgBtn?.addEventListener('click', () => {
    const disabled = getSimulationState().backgroundDisabled;
    if (disabled) {
      enableBackground();
      bgBtn.classList.add('active');
      bgBtn.setAttribute('aria-pressed', 'true');
    } else {
      disableBackground();
      bgBtn.classList.remove('active');
      bgBtn.setAttribute('aria-pressed', 'false');
    }
  });

  soundBtn?.addEventListener('click', () => {
    const w = window as unknown as Record<string, unknown>;
    const current = w.isAudioMuted as boolean | undefined;
    const nowMuted = current === undefined ? true : !current;
    w.isAudioMuted = nowMuted;
    syncMutedState();
    soundBtn.classList.toggle('active', !nowMuted);
    soundBtn.setAttribute('aria-pressed', String(!nowMuted));
    const icon = soundBtn.querySelector('icon-volume, icon-volumeOff');
    if (icon) {
      const name = nowMuted ? 'volumeOff' : 'volume';
      icon.setAttribute('name', name);
      icon.innerHTML = '';
      soundBtn.innerHTML = `<icon-${name} name="${name}"></icon-${name}>`;
    }
  });

  bhBtn?.addEventListener('click', () => {
    bhBtn.classList.toggle('active');
    bhBtn.setAttribute('aria-pressed', String(bhBtn.classList.contains('active')));
    if (!bhBtn.classList.contains('active') && blackholes.length > 0) {
      blackholes = [];
      if (sun.isExploded) buildScene();
    }
  });

  function updateFsButton(): void {
    const isFs = document.fullscreenElement === stage;
    fsBtn?.setAttribute('aria-label', isFs ? 'Exit fullscreen' : 'Enter fullscreen');
    fsBtn?.setAttribute('title', isFs ? 'Exit fullscreen' : 'Fullscreen');
    if (fsBtn) {
      const name = isFs ? 'minimize' : 'maximize';
      fsBtn.innerHTML = `<icon-${name} name="${name}"></icon-${name}>`;
    }
  }

  fsBtn?.addEventListener('click', () => {
    if (document.fullscreenElement === stage) {
      void document.exitFullscreen().catch(() => undefined);
    } else {
      void stage.requestFullscreen().catch(() => undefined);
    }
  });
  document.addEventListener('fullscreenchange', updateFsButton);
  updateFsButton();

  window.addEventListener('pointerdown', handlePointerDown);
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('scroll', handleActivity, { passive: true });
  window.addEventListener('wheel', handleActivity, { passive: true });
  window.addEventListener('keydown', handleActivity);

  canvas.dataset.cosmicReady = '1';

  if (prefersReduced) {
    drawScene(performance.now());
    return;
  }

  requestAnimationFrame(frame);
}
