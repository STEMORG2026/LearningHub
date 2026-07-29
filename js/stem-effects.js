/* ==========================================================================
   SUPERMASSIVE COSMIC PHYSICS & COLOSSAL BIG BOY SUN SPAWNER ENGINE:
   - Web Audio API Procedural Synthesizer & Sound FX Engine
   - Dynamic 6-Hover Animation Engine with 4-Cycle Cooldown Protocol (RULES.md Section 2.3)
   - Interactive Estimator & Course Calculator Logic
   - 3D Physics Universe Canvas Engine (Colossal Sun, 8 Planets, Moons, Blackhole, Symbols)
   - Floating Visual Control Panel (⚙️ Visuals Widget & Non-Intrusive Toast System)
   ========================================================================== */

(function () {
  'use strict';

  // Global Engine Controls & Default States (RULES.md Section 2.4)
  let stemTimeScale = 1.0;
  let audioCtx = null; // Web Audio Context handle
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let isAudioMuted = true;        // SOUND OFF BY DEFAULT
  let isBlackholeDisabled = true; // BLACKHOLE OFF BY DEFAULT
  let isBackgroundDisabled = true;// BACKGROUND ANIMATION OFF BY DEFAULT
  let isHalfIntensity = true;     // INTENSITY 50% BY DEFAULT
  let lastChaosTime = Date.now();
  let lastSunSpawnTime = Date.now();
  let updateCornerPanelUI = () => {};

  /* ==========================================================================
     1. WEB AUDIO API PROCEDURAL SOUND SYNTHESIZER
     ========================================================================== */
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSparkSound() {
    if (isAudioMuted || isBackgroundDisabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    const now = ctx.currentTime;
    const volMult = isHalfIntensity ? 0.5 : 1.0;
    
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.12);

    gain.gain.setValueAtTime(0.18 * volMult, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  function playCollisionSound(isGiant = false) {
    if (isAudioMuted || isBackgroundDisabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = isGiant ? 'triangle' : 'sine';
    const now = ctx.currentTime;
    const duration = isGiant ? 0.45 : 0.18;
    const volMult = isHalfIntensity ? 0.5 : 1.0;

    osc.frequency.setValueAtTime(isGiant ? 160 : 280, now);
    osc.frequency.exponentialRampToValueAtTime(isGiant ? 35 : 80, now + duration);

    gain.gain.setValueAtTime((isGiant ? 0.35 : 0.15) * volMult, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  function playExplosionSound() {
    if (isAudioMuted || isBackgroundDisabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const volMult = isHalfIntensity ? 0.5 : 1.0;

    // Sub-bass Boom
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(140, now);
    osc1.frequency.exponentialRampToValueAtTime(18, now + 1.6);
    gain1.gain.setValueAtTime(0.25 * volMult, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 1.6);

    // Noise Blast Rumble
    const bufferSize = Math.floor(ctx.sampleRate * 1.2);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(50, now + 1.2);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18 * volMult, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 1.2);
  }

  function playMotionHum() {
    if (isAudioMuted || isBackgroundDisabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const now = ctx.currentTime;
    const volMult = isHalfIntensity ? 0.5 : 1.0;

    osc.frequency.setValueAtTime(75, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

    gain.gain.setValueAtTime(0.08 * volMult, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  /* ==========================================================================
     2. COLOR UTILITIES & SPECTRUM GENERATORS
     ========================================================================== */
  function getProbabilisticHSL(minSat = 70, maxSat = 90, minLight = 38, maxLight = 52) {
    const roll = Math.random();
    let hue;
    if (roll < 0.35) hue = 180 + Math.random() * 40;
    else if (roll < 0.60) hue = 25 + Math.random() * 25;
    else if (roll < 0.80) hue = 125 + Math.random() * 25;
    else hue = 270 + Math.random() * 60;

    const sat = minSat + Math.random() * (maxSat - minSat);
    const light = minLight + Math.random() * (maxLight - minLight);

    return {
      hue: Math.floor(hue),
      sat: Math.floor(sat),
      light: Math.floor(light),
      hsl: `hsl(${Math.floor(hue)}, ${Math.floor(sat)}%, ${Math.floor(light)}%)`,
      hsla: (a) => `hsla(${Math.floor(hue)}, ${Math.floor(sat)}%, ${Math.floor(light)}%, ${a})`
    };
  }

  function getDeepSpaceHSL() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 35%, 6%)`;
  }

  /* ==========================================================================
     3. DOM READY ENGINE INITIALIZATION
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initSVGDisplacementFilter();
    initPerHoverRandomizer();
    initRealtimeBackgroundMorphing();
    initComfortableSpectrumRandomizer();
    initElectricSparks();
    initComputerProcessing();
    initPhysicsUniverseCanvas();
    initRandomBackgroundClickAnimations();
  });

  function initSVGDisplacementFilter() {
    if (document.getElementById('stem-lightning-svg-filter')) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'stem-lightning-svg-filter';
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    svg.style.overflow = 'hidden';
    svg.innerHTML = `
      <filter id="lightningDistort">
        <feTurbulence type="fractalNoise" baseFrequency="0.04 0.9" numOctaves="2" result="noise" id="lightningTurbulence" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    `;
    document.body.appendChild(svg);

    let seed = 0;
    setInterval(() => {
      seed = (seed + 1) % 1000;
      const turb = document.getElementById('lightningTurbulence');
      if (turb) turb.setAttribute('seed', seed);
    }, 60);
  }

  /* ==========================================================================
     4. DYNAMIC 6-HOVER ENGINE WITH 4-CYCLE COOLDOWN PROTOCOL (RULES.md Section 2.3)
     ========================================================================== */
  function initPerHoverRandomizer() {
    const cardSelectorStr = '.card, .class-card, .why-card, .contact-card, .timing-card, .step, .resource-card, .video-card, .review-card, .quiz-container, .quiz-option, .faq-item, .pioneer-card, .info-panel, .form-container, .social-panel, .grade-selector-card, .subject-card, .curriculum-card, .resource-item, .stat, .stat-card, .detail-block, .class-resources, .hero-banner-card, .section-header-card, .stem-widget, .modal-card, .social-banner, .soft-card, .calc-card';
    const hoverStyles = ['hover-effect-glow', 'hover-effect-tint', 'hover-effect-electric', 'hover-effect-borderless', 'hover-effect-warp', 'hover-effect-plasma'];
    const hoverCooldownQueue = []; // 4-cycle cooldown queue

    document.addEventListener('mouseover', (evt) => {
      const card = evt.target ? evt.target.closest(cardSelectorStr) : null;
      if (!card) return;
      const related = evt.relatedTarget;
      if (!related || !card.contains(related)) {
        hoverStyles.forEach((cls) => card.classList.remove(cls));

        // Filter out styles currently in 4-cycle cooldown
        const availableStyles = hoverStyles.filter((style) => !hoverCooldownQueue.includes(style));
        const pool = availableStyles.length > 0 ? availableStyles : hoverStyles;

        const chosenStyle = pool[Math.floor(Math.random() * pool.length)];
        card.classList.add(chosenStyle);

        // Track in 4-cycle cooldown queue (max 4 recent styles)
        hoverCooldownQueue.push(chosenStyle);
        if (hoverCooldownQueue.length > 4) {
          hoverCooldownQueue.shift();
        }
      }
    });

    document.addEventListener('mouseout', (evt) => {
      const card = evt.target ? evt.target.closest(cardSelectorStr) : null;
      if (!card) return;
      const related = evt.relatedTarget;
      if (!related || !card.contains(related)) {
        hoverStyles.forEach((cls) => card.classList.remove(cls));
      }
    });
  }

  /* INTERACTIVE GRADE & SUBJECT ESTIMATOR LOGIC */
  window.currentSelectedGrade = 'g1_8';
  window.selectGrade = function(gradeKey, btnEl) {
    document.querySelectorAll('.grade-opt-btn').forEach(btn => btn.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    window.currentSelectedGrade = gradeKey;
    window.updateCalcSummary();
  };

  window.updateCalcSummary = function() {
    const gradeTitleEl = document.getElementById('calcGradeTitle');
    const detailsTextEl = document.getElementById('calcDetailsText');
    const whatsappBtn = document.getElementById('whatsappCalcBtn');
    if (!gradeTitleEl || !detailsTextEl) return;

    const checkedBoxes = Array.from(document.querySelectorAll('#subjectBtnGroup input[type="checkbox"]:checked')).map(cb => cb.parentNode.textContent.trim());
    const subjectsStr = checkedBoxes.length > 0 ? checkedBoxes.join(', ') : 'General STEM Curriculum';

    let gradeName = 'Grade 1 – 8 (Foundation)';
    if (window.currentSelectedGrade === 'g9_10') gradeName = 'Grade 9 – 10 (SEE Board Prep)';
    if (window.currentSelectedGrade === 'g11_12') gradeName = 'Grade 11 – 12 (NEB Science & Math)';
    if (window.currentSelectedGrade === 'alevel') gradeName = 'Cambridge A-Levels (AS & A2)';

    gradeTitleEl.textContent = `Selected: ${gradeName}`;
    detailsTextEl.textContent = `Subjects: ${subjectsStr} | Available Modes: Home Tuition, Group Batches & Online`;

    const encodedMsg = encodeURIComponent(`Hi STEM Tuition, I would like to enroll in ${gradeName} for the following subjects: ${subjectsStr}`);
    if (whatsappBtn) {
      whatsappBtn.href = `https://wa.me/9779768021317?text=${encodedMsg}`;
    }
  };

  function initRealtimeBackgroundMorphing() {
    function morphBackgroundGradients() {
      document.documentElement.style.setProperty('--bg-gradient-1', getDeepSpaceHSL());
      document.documentElement.style.setProperty('--bg-gradient-2', getDeepSpaceHSL());
      document.documentElement.style.setProperty('--bg-gradient-3', getDeepSpaceHSL());
    }
    morphBackgroundGradients();
    setInterval(morphBackgroundGradients, 4500);
  }

  function initComfortableSpectrumRandomizer() {
    function cycleElementColors() {
      const accent1 = getProbabilisticHSL(75, 90, 42, 52);
      const accent2 = getProbabilisticHSL(75, 90, 42, 52);

      document.documentElement.style.setProperty('--dynamic-accent-1', accent1.hsl);
      document.documentElement.style.setProperty('--dynamic-accent-2', accent2.hsl);

      document.querySelectorAll('.class-card, .contact-card, .why-card, .card, .timing-card, .resource-card, .video-card, .review-card, .quiz-container').forEach((card) => {
        const cardColor = getProbabilisticHSL(70, 85, 40, 50);
        const icon = card.querySelector('.class-icon, .contact-card-icon, .notes-icon, .card-icon, .resource-icon');
        if (icon) {
          icon.style.backgroundColor = cardColor.hsla(0.14);
          icon.style.color = cardColor.hsl;
        }
      });
    }
    cycleElementColors();
    setInterval(cycleElementColors, 3500);
  }

  function initElectricSparks() {
    document.addEventListener('click', (e) => {
      if (Math.random() > 0.5) return;
      createSparkCluster(e.clientX, e.clientY);
      playSparkSound();
    });
  }

  function createSparkCluster(x, y) {
    const sparkCount = 10;
    const container = document.createElement('div');
    container.className = 'stem-spark-container';
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;

    const flashColor = getProbabilisticHSL(80, 95, 45, 55);
    const flash = document.createElement('div');
    flash.className = 'stem-spark-flash';
    flash.style.background = `radial-gradient(circle, #ffffff 0%, ${flashColor.hsl} 70%, transparent 100%)`;
    container.appendChild(flash);

    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('div');
      spark.className = 'stem-spark-particle';
      const angle = (i / sparkCount) * Math.PI * 2;
      const distance = 30 + Math.random() * 40;
      const size = 3 + Math.random() * 4;
      const pColor = getProbabilisticHSL(80, 95, 45, 55).hsl;

      spark.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
      spark.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.backgroundColor = pColor;
      spark.style.boxShadow = `0 0 8px ${pColor}`;
      container.appendChild(spark);
    }
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 550);
  }

  /* ==========================================================================
     5. UNIFIED CORNER VISUAL CONTROLS & FLOATING TOAST WIDGET
     ========================================================================== */
  function initRandomIntervalBackgroundToast(canvas) {
    if (localStorage.getItem('stem_bg_prompt_choice') === 'yes') {
      isBackgroundDisabled = false;
      if (canvas) {
        canvas.style.display = 'block';
        canvas.classList.remove('bg-disabled');
      }
      return;
    }

    isBackgroundDisabled = true;
    if (canvas) {
      canvas.style.display = 'none';
      canvas.classList.add('bg-disabled');
    }

    function showRandomToast() {
      if (!isBackgroundDisabled) return;
      if (document.querySelector('.stem-bg-toast')) return;

      const toast = document.createElement('div');
      toast.className = 'stem-bg-toast';
      toast.innerHTML = `
        <span>💡 Tip: Interactive 3D physics background animation is available!</span>
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <button class="stem-toast-btn" id="stemToastEnable">✨ Turn On</button>
          <button class="stem-toast-close" id="stemToastClose">✕</button>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.classList.add('visible'), 50);

      document.getElementById('stemToastEnable').addEventListener('click', () => {
        isBackgroundDisabled = false;
        if (canvas) {
          canvas.style.display = 'block';
          canvas.classList.remove('bg-disabled');
        }
        localStorage.setItem('stem_bg_prompt_choice', 'yes');
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
        updateCornerPanelUI();
      });

      document.getElementById('stemToastClose').addEventListener('click', () => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
      });

      setTimeout(() => {
        if (document.body.contains(toast)) {
          toast.classList.remove('visible');
          setTimeout(() => toast.remove(), 300);
        }
      }, 8000);
    }

    setTimeout(() => {
      showRandomToast();
      setInterval(showRandomToast, 45000 + Math.random() * 30000);
    }, 12000);
  }

  const initBackgroundPromptModal = initRandomIntervalBackgroundToast;

  function initUnifiedCornerControlPanel(canvas) {
    const container = document.createElement('div');
    container.className = 'stem-corner-widget';
    container.innerHTML = `
      <button class="stem-corner-trigger" id="stemCornerTrigger">⚙️ <span>Visuals</span></button>
      <div class="stem-corner-popover" id="stemCornerPopover" style="display:none;">
        <div class="stem-popover-title">
          <span>🎨 Visual Controls</span>
          <span style="cursor:pointer;font-size:1rem;" id="stemCornerClose">×</span>
        </div>
        <div class="stem-control-row">
          <span>🌌 Background:</span>
          <button class="stem-control-btn" id="ctrlBgBtn">OFF</button>
        </div>
        <div class="stem-control-row">
          <span>⚡ Intensity:</span>
          <button class="stem-control-btn" id="ctrlIntensityBtn">100%</button>
        </div>
        <div class="stem-control-row">
          <span>🔊 Sound:</span>
          <button class="stem-control-btn" id="ctrlSoundBtn">ON</button>
        </div>
        <div class="stem-control-row">
          <span>🕳️ Blackhole:</span>
          <button class="stem-control-btn" id="ctrlBlackholeBtn">OFF</button>
        </div>
        <div class="stem-control-row" style="margin-top:0.3rem;">
          <button class="stem-control-btn" style="width:100%;text-align:center;background:linear-gradient(135deg,#ff007f,#00d4ff);border:none;color:#fff;" id="ctrlCosmicViewBtn">🔭 Watch Fullscreen</button>
        </div>
      </div>
    `;
    document.body.appendChild(container);

    const trigger = document.getElementById('stemCornerTrigger');
    const popover = document.getElementById('stemCornerPopover');
    const closeBtn = document.getElementById('stemCornerClose');
    const ctrlBgBtn = document.getElementById('ctrlBgBtn');
    const ctrlIntensityBtn = document.getElementById('ctrlIntensityBtn');
    const ctrlSoundBtn = document.getElementById('ctrlSoundBtn');
    const ctrlBlackholeBtn = document.getElementById('ctrlBlackholeBtn');
    const ctrlCosmicViewBtn = document.getElementById('ctrlCosmicViewBtn');

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isCosmicActive = document.body.classList.contains('cosmic-view-active');

      if (isCosmicActive) {
        document.body.classList.remove('cosmic-view-active');
        popover.style.display = 'none';
        popover.classList.remove('active');
        updateCornerPanelUI();
        return;
      }

      const isHidden = popover.style.display === 'none' || getComputedStyle(popover).display === 'none';
      popover.style.display = isHidden ? 'flex' : 'none';
      popover.classList.toggle('active', isHidden);
    });

    trigger.addEventListener('mouseenter', () => {
      popover.style.display = 'none';
      popover.classList.remove('active');
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      popover.style.display = 'none';
      popover.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        popover.style.display = 'none';
        popover.classList.remove('active');
      }
    });

    updateCornerPanelUI = function() {
      const isCosmicActive = document.body.classList.contains('cosmic-view-active');

      trigger.querySelector('span').innerText = isCosmicActive ? 'Exit Fullscreen' : 'Visuals';
      trigger.innerHTML = isCosmicActive ? '❌ <span>Exit Fullscreen</span>' : '⚙️ <span>Visuals</span>';

      ctrlCosmicViewBtn.innerText = isCosmicActive ? '❌ Exit Fullscreen' : '🔭 Watch Fullscreen';

      ctrlBgBtn.innerText = isBackgroundDisabled ? 'OFF' : 'ON';
      ctrlBgBtn.classList.toggle('active', !isBackgroundDisabled);

      ctrlIntensityBtn.innerText = isHalfIntensity ? '50%' : '100%';
      ctrlIntensityBtn.classList.toggle('active', isHalfIntensity);

      ctrlSoundBtn.innerText = isAudioMuted ? 'OFF' : 'ON';
      ctrlSoundBtn.classList.toggle('active', !isAudioMuted);

      ctrlBlackholeBtn.innerText = isBlackholeDisabled ? 'OFF' : 'ON';
      ctrlBlackholeBtn.classList.toggle('active', !isBlackholeDisabled);
    };

    ctrlBgBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isBackgroundDisabled = !isBackgroundDisabled;
      if (canvas) {
        canvas.classList.toggle('bg-disabled', isBackgroundDisabled);
        canvas.style.display = isBackgroundDisabled ? 'none' : 'block';
      }
      localStorage.setItem('stem_bg_prompt_choice', isBackgroundDisabled ? 'no' : 'yes');
      updateCornerPanelUI();
    });

    ctrlIntensityBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isHalfIntensity = !isHalfIntensity;
      updateCornerPanelUI();
    });

    ctrlSoundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      getAudioContext();
      isAudioMuted = !isAudioMuted;
      updateCornerPanelUI();
    });

    ctrlBlackholeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      getAudioContext();
      isBlackholeDisabled = !isBlackholeDisabled;
      updateCornerPanelUI();
    });

    ctrlCosmicViewBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      getAudioContext();
      popover.style.display = 'none';
      popover.classList.remove('active');
      const isEntering = !document.body.classList.contains('cosmic-view-active');
      document.body.classList.toggle('cosmic-view-active');
      if (isEntering) {
        isBackgroundDisabled = false;
        if (canvas) {
          canvas.classList.remove('bg-disabled');
          canvas.style.display = 'block';
          canvas.style.opacity = '1';
          canvas.style.visibility = 'visible';
        }
      }
      updateCornerPanelUI();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'z' || e.key === 'Z' || e.key === 'Escape') {
        if (document.body.classList.contains('cosmic-view-active') || e.key === 'z' || e.key === 'Z') {
          getAudioContext();
          const isEntering = !document.body.classList.contains('cosmic-view-active');
          document.body.classList.toggle('cosmic-view-active');
          if (isEntering) {
            isBackgroundDisabled = false;
            if (canvas) {
              canvas.classList.remove('bg-disabled');
              canvas.style.display = 'block';
              canvas.style.opacity = '1';
              canvas.style.visibility = 'visible';
            }
          }
          popover.style.display = 'none';
          popover.classList.remove('active');
          updateCornerPanelUI();
        }
      } else if (e.key === 'b' || e.key === 'B') {
        getAudioContext();
        isBlackholeDisabled = !isBlackholeDisabled;
        updateCornerPanelUI();
      }
    });

    updateCornerPanelUI();
  }

  /* ==========================================================================
     6. BIG BANG SUPERNOVA EXPLOSION & CLICK ANIMATIONS
     ========================================================================== */
  function triggerMassiveDestruction(x, y, labelText = '💥 BIG BANG!', isSlowMo = true) {
    if (isBackgroundDisabled) return;

    playExplosionSound();

    // 1. FLASH OVERLAY
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.left = '0';
    flash.style.top = '0';
    flash.style.width = '100vw';
    flash.style.height = '100vh';
    flash.style.background = 'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255, 255, 255, 0.95) 0%, rgba(0, 212, 255, 0.6) 40%, rgba(255, 0, 127, 0.3) 70%, transparent 100%)';
    flash.style.pointerEvents = 'none';
    flash.style.zIndex = '9999';
    flash.style.opacity = '1';
    flash.style.transition = 'opacity ' + (isSlowMo ? '1.8s' : '0.6s') + ' cubic-bezier(0.1, 0.8, 0.3, 1)';
    document.body.appendChild(flash);

    requestAnimationFrame(() => {
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), isSlowMo ? 1800 : 600);
    });

    // 2. SHOCKWAVE RINGS
    const ringCount = isHalfIntensity ? 2 : 4;
    for (let i = 0; i < ringCount; i++) {
      setTimeout(() => {
        const ring = document.createElement('div');
        ring.className = `stem-shockwave-ring ${isSlowMo ? 'slow-mo' : ''}`;
        ring.style.left = `${x}px`;
        ring.style.top = `${y}px`;
        const ringColor = getProbabilisticHSL(80, 95, 45, 55).hsl;
        ring.style.borderColor = ringColor;
        ring.style.boxShadow = `0 0 40px ${ringColor}`;
        document.body.appendChild(ring);
        setTimeout(() => ring.remove(), isSlowMo ? 2200 : 850);
      }, i * 130);
    }

    // 3. FORMULAS & PARTICLES
    const container = document.createElement('div');
    container.className = 'stem-math-explosion';
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;

    const formulas = [labelText, 'SUPERNOVA!', 'DESTRUCTION!', 'E=mc²', '∫f(x)dx', 'π', '√x', 'H₂O', 'CO₂', 'F=ma', 'λ', '0101'];
    const count = isHalfIntensity ? 9 : 18;
    const distMult = isHalfIntensity ? 0.55 : 1.0;

    for (let i = 0; i < count; i++) {
      const item = document.createElement('span');
      item.className = `stem-exploded-formula ${isSlowMo ? 'slow-mo' : ''}`;
      item.innerText = formulas[Math.floor(Math.random() * formulas.length)];

      const angle = (i / count) * Math.PI * 2;
      const dist = (120 + Math.random() * 140) * distMult;
      item.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
      item.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
      
      const formulaColor = getProbabilisticHSL(90, 100, 55, 75).hsl;
      item.style.color = formulaColor;
      item.style.fontSize = '1.35rem';
      item.style.fontWeight = '800';
      item.style.textShadow = `0 0 24px ${formulaColor}`;

      container.appendChild(item);
    }

    document.body.appendChild(container);
    setTimeout(() => container.remove(), isSlowMo ? 2400 : 1050);
  }

  function initRandomBackgroundClickAnimations() {
    document.addEventListener('click', (e) => {
      if (isBackgroundDisabled) return;
      const isInteractive = e.target.closest('a, button, input, textarea, select, .btn, .class-card, .quiz-container, .stem-corner-widget, .stem-bg-modal-overlay');
      if (isInteractive) return;

      const x = e.clientX;
      const y = e.clientY;
      const randomEffectIndex = Math.floor(Math.random() * 5);

      switch (randomEffectIndex) {
        case 0: triggerMassiveDestruction(x, y, '💥 BOOM!', true); break;
        case 1: effectBinaryMatrixCascade(x, y); playMotionHum(); break;
        case 2: effectAtomicFusionOrbit(x, y); playMotionHum(); break;
        case 3: triggerMassiveDestruction(x, y, '⚡ COSMIC!', true); break;
        case 4: effectMachineryCogRotation(x, y); playCollisionSound(true); break;
      }
    });
  }

  function effectBinaryMatrixCascade(x, y) {
    const container = document.createElement('div');
    container.className = 'stem-binary-cascade';
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
    const bits = ['0101', '1010', '1100', 'CPU', '01101', '<stem/>'];
    bits.forEach((bitStr, i) => {
      const bit = document.createElement('span');
      bit.className = 'stem-cascade-bit';
      bit.innerText = bitStr;
      bit.style.color = getProbabilisticHSL(80, 95, 45, 55).hsl;
      bit.style.left = `${(i - 2.5) * 24}px`;
      bit.style.animationDelay = `${i * 0.05}s`;
      container.appendChild(bit);
    });
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 900);
  }

  function effectAtomicFusionOrbit(x, y) {
    const atom = document.createElement('div');
    atom.className = 'stem-atomic-fusion';
    atom.style.left = `${x}px`;
    atom.style.top = `${y}px`;
    const c1 = getProbabilisticHSL(80, 95, 45, 55).hsl;
    const c2 = getProbabilisticHSL(80, 95, 45, 55).hsl;
    atom.innerHTML = `
      <div class="fusion-ring ring-1" style="border-color:${c1}"></div>
      <div class="fusion-ring ring-2" style="border-color:${c2}"></div>
      <div class="fusion-core" style="background:${c1};box-shadow:0 0 20px ${c1}"></div>
    `;
    document.body.appendChild(atom);
    setTimeout(() => atom.remove(), 1000);
  }

  function effectMachineryCogRotation(x, y) {
    const gear = document.createElement('div');
    gear.className = 'stem-machinery-burst';
    gear.style.left = `${x}px`;
    gear.style.top = `${y}px`;
    const gearColor = getProbabilisticHSL(80, 95, 45, 55).hsl;
    gear.innerHTML = `
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="${gearColor}" stroke-width="2">
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    `;
    document.body.appendChild(gear);
    setTimeout(() => gear.remove(), 900);
  }

  function initComputerProcessing() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.btn, .btn-primary, .btn-secondary, .class-card, .why-card, .card, .timing-card, .contact-card, .resource-card, .video-card');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      createBinaryPulse(target, e.clientX - rect.left, e.clientY - rect.top);
    });
  }

  function createBinaryPulse(element, x, y) {
    const pulse = document.createElement('div');
    pulse.className = 'stem-binary-pulse';
    pulse.style.left = `${x}px`;
    pulse.style.top = `${y}px`;
    const binaryBits = ['0101', '1010', '1100', 'CPU', '011', '1001', '<stem/>', 'E=mc²'];
    const bitLabel = document.createElement('span');
    bitLabel.className = 'stem-binary-text';
    bitLabel.innerText = binaryBits[Math.floor(Math.random() * binaryBits.length)];
    bitLabel.style.color = getProbabilisticHSL(80, 95, 45, 55).hsl;
    pulse.appendChild(bitLabel);
    element.appendChild(pulse);
    setTimeout(() => pulse.remove(), 700);
  }

  /* ==========================================================================
     7. COLOSSAL BIG BOY SUN, PLANETS, BLACKHOLE & 3D PHYSICS CANVAS ENGINE
     ========================================================================== */
  function initPhysicsUniverseCanvas() {
    const canvas = document.getElementById('stemBackgroundCanvas') || document.createElement('canvas');
    canvas.id = 'stemBackgroundCanvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none'; // pointer-events: none
    canvas.style.zIndex = '0';
    canvas.style.opacity = '0.75';
    canvas.style.display = isBackgroundDisabled ? 'none' : 'block';
    canvas.classList.toggle('bg-disabled', isBackgroundDisabled);
    if (!document.getElementById('stemBackgroundCanvas')) {
      document.body.prepend(canvas);
    }

    initUnifiedCornerControlPanel(canvas);
    initBackgroundPromptModal(canvas);
    updateCornerPanelUI();

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('❌ Failed to acquire 2D rendering context for background canvas.');
      return;
    }
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: -1000, y: -1000, radius: 180 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    }, { passive: true });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    const mathSymbols = [
      'E=mc²', '∫f(x)dx', 'π', '√x', 'H₂O', 'CO₂', 'F=ma', 
      'λ', 'Ω', '0101', 'sin(θ)', 'Δx', '∞', '∇×B', 'pH', 'C₆H₁₂O₆',
      'a=dv/dt', '∑xᵢ', 'd/dx', 'eⁱᵖ+1=0', 'Au', '⚡'
    ];

    const bodies = [];

    // 1. ONE PRIMARY SUN (75px)
    bodies.push({
      id: 'primary_sun_1',
      name: 'Sun',
      type: 'big_sun',
      x: 0.5 * width,
      y: 0.45 * height,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      radius: 75,
      mass: 75 * 75 * 1.5,
      charge: 1,
      color: '#ff9900',
      glowColor: 'rgba(255, 153, 0, 0.85)',
      rotation: 0,
      vRot: 0.002
    });

    // 2. ALL 8 PLANETS WITH MULTIPLE SATELLITES & MOONS
    const planetConfigs = [
      { name: 'Mercury', radius: 16, color: '#a8a8a8', glow: 'rgba(168, 168, 168, 0.7)', moons: [{ name: 'Mariner', dist: 1.7, speed: 0.035, size: 2.2, icon: '🛰️' }] },
      { name: 'Venus', radius: 22, color: '#e6c280', glow: 'rgba(230, 194, 128, 0.75)', moons: [{ name: 'Akatsuki', dist: 1.7, speed: 0.03, size: 2.2, icon: '🛰️' }] },
      { name: 'Earth', radius: 26, color: '#2b82c5', glow: 'rgba(43, 130, 197, 0.8)', moons: [{ name: 'Moon', dist: 2.0, speed: 0.025, size: 4.5, color: '#e0e0e0' }, { name: 'ISS', dist: 1.5, speed: 0.045, size: 2.2, icon: '🛰️' }] },
      { name: 'Mars', radius: 20, color: '#c85232', glow: 'rgba(200, 82, 50, 0.8)', moons: [{ name: 'Phobos', dist: 1.7, speed: 0.038, size: 3.0, color: '#a08070' }, { name: 'Deimos', dist: 2.4, speed: 0.022, size: 2.5, color: '#807060' }] },
      { name: 'Jupiter', radius: 48, color: '#d9a05b', glow: 'rgba(217, 160, 91, 0.85)', moons: [{ name: 'Io', dist: 1.7, speed: 0.032, size: 4.0, color: '#ffff80' }, { name: 'Europa', dist: 2.2, speed: 0.025, size: 3.5, color: '#e6f2ff' }, { name: 'Ganymede', dist: 2.7, speed: 0.019, size: 5.0, color: '#c2b280' }, { name: 'Callisto', dist: 3.2, speed: 0.014, size: 4.2, color: '#808080' }] },
      { name: 'Saturn', radius: 42, color: '#e8cd8c', glow: 'rgba(232, 205, 140, 0.85)', hasRings: true, moons: [{ name: 'Titan', dist: 2.1, speed: 0.022, size: 4.8, color: '#ffb366' }, { name: 'Enceladus', dist: 1.6, speed: 0.035, size: 3.2, color: '#ffffff' }, { name: 'Mimas', dist: 1.3, speed: 0.042, size: 2.8, color: '#b3b3b3' }] },
      { name: 'Uranus', radius: 32, color: '#5cc8d4', glow: 'rgba(92, 200, 212, 0.85)', hasRings: true, moons: [{ name: 'Titania', dist: 1.9, speed: 0.026, size: 3.8, color: '#d9f2f5' }, { name: 'Oberon', dist: 2.5, speed: 0.018, size: 3.6, color: '#b3d9e0' }] },
      { name: 'Neptune', radius: 30, color: '#2649cf', glow: 'rgba(38, 73, 207, 0.85)', moons: [{ name: 'Triton', dist: 2.0, speed: -0.022, size: 4.0, color: '#cce6ff' }, { name: 'Nereid', dist: 2.7, speed: 0.014, size: 2.8, color: '#9999b3' }] }
    ];

    planetConfigs.forEach((p, idx) => {
      const angle = (idx / planetConfigs.length) * Math.PI * 2;
      const orbitRadius = 135 + idx * 42;
      const speed = 0.18 + Math.random() * 0.15;

      bodies.push({
        id: `planet_${p.name.toLowerCase()}`,
        name: p.name,
        type: 'giant_planet',
        x: (0.5 * width) + Math.cos(angle) * orbitRadius,
        y: (0.45 * height) + Math.sin(angle) * orbitRadius,
        vx: -Math.sin(angle) * speed,
        vy: Math.cos(angle) * speed,
        radius: p.radius,
        mass: p.radius * p.radius,
        charge: idx % 2 === 0 ? 1 : -1,
        color: p.color,
        glowColor: p.glow,
        hasRings: p.hasRings || false,
        moons: p.moons || [],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.012
      });
    });

    // 3. SUPERMASSIVE BLACKHOLE
    bodies.push({
      id: 'super_blackhole_1',
      name: 'Supermassive Black Hole',
      type: 'super_blackhole',
      x: 0.22 * width,
      y: 0.3 * height,
      vx: 0.08,
      vy: -0.05,
      radius: 40,
      mass: 14000,
      charge: -1,
      color: '#000000',
      glowColor: 'rgba(0, 212, 255, 0.95)',
      rotation: 0,
      vRot: 0.02,
      isExploded: false
    });

    // 4. SATELLITES, ROCKETS, CIRCUITS & FORMULAS
    const smallTypes = ['rocket', 'satellite', 'circuit', 'math_symbol'];
    const totalSmallItems = 16;

    for (let i = 0; i < totalSmallItems; i++) {
      const selectedType = smallTypes[i % smallTypes.length];
      const r = 12 + Math.random() * 8;
      const colorObj = getProbabilisticHSL(80, 95, 45, 55);

      bodies.push({
        id: `small_item_${i}`,
        type: selectedType,
        text: selectedType === 'math_symbol' ? mathSymbols[i % mathSymbols.length] : '',
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: r,
        mass: r * r * 0.5,
        charge: Math.random() > 0.5 ? 1 : -1,
        color: colorObj.hsl,
        glowColor: colorObj.hsla(0.65),
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.03
      });
    }

    function updatePhysicsAndCollisions() {
      const isCosmicActive = document.body.classList.contains('cosmic-view-active');
      const forceMult = (isHalfIntensity ? 0.5 : 1.0) * (isCosmicActive ? 1.35 : 1.0);

      // ELECTROMAGNETIC TANGLE & ORBITAL PHYSICS
      for (let i = 0; i < bodies.length; i++) {
        const b1 = bodies[i];
        if (b1.isExploded) continue;

        b1.x += b1.vx * stemTimeScale;
        b1.y += b1.vy * stemTimeScale;
        b1.rotation += (b1.vRot || 0.005) * stemTimeScale;

        // Bouncing Boundaries
        if (b1.x - b1.radius < 0) { b1.x = b1.radius; b1.vx *= -0.85; }
        if (b1.x + b1.radius > width) { b1.x = width - b1.radius; b1.vx *= -0.85; }
        if (b1.y - b1.radius < 0) { b1.y = b1.radius; b1.vy *= -0.85; }
        if (b1.y + b1.radius > height) { b1.y = height - b1.radius; b1.vy *= -0.85; }

        // Mouse Gravitational Interaction
        const mdx = mouse.x - b1.x;
        const mdy = mouse.y - b1.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < mouse.radius && mDist > 5) {
          const mForce = (1 - mDist / mouse.radius) * 0.45 * forceMult;
          b1.vx += (mdx / mDist) * mForce;
          b1.vy += (mdy / mDist) * mForce;
        }

        // Body-to-Body Coulomb & Gravity Interaction
        for (let j = i + 1; j < bodies.length; j++) {
          const b2 = bodies[j];
          if (b2.isExploded) continue;

          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 10 && dist < 320) {
            const force = (b1.charge * b2.charge < 0 ? -1 : 1) * (18 / (dist * dist)) * forceMult;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            b1.vx += fx / (b1.radius * 0.2);
            b1.vy += fy / (b1.radius * 0.2);
            b2.vx -= fx / (b2.radius * 0.2);
            b2.vy -= fy / (b2.radius * 0.2);
          }

          // Elastic Collision Response
          const minDist = b1.radius + b2.radius;
          if (dist < minDist && dist > 0) {
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            b1.x -= nx * overlap * 0.5;
            b1.y -= ny * overlap * 0.5;
            b2.x += nx * overlap * 0.5;
            b2.y += ny * overlap * 0.5;

            const kx = b1.vx - b2.vx;
            const ky = b1.vy - b2.vy;
            const p = 2 * (nx * kx + ny * ky) / (b1.mass + b2.mass);

            b1.vx -= p * b2.mass * nx;
            b1.vy -= p * b2.mass * ny;
            b2.vx += p * b1.mass * nx;
            b2.vy += p * b1.mass * ny;

            if (Math.random() < 0.25) {
              playCollisionSound(b1.radius > 35 || b2.radius > 35);
            }
          }
        }
      }

      // BLACKHOLE DEVOUR ENGINE
      const blackhole = bodies.find((b) => b.type === 'super_blackhole' && !b.isExploded);
      if (blackhole && !isBlackholeDisabled) {
        bodies.forEach((other) => {
          if (other.id !== blackhole.id && !other.isExploded) {
            const dx = blackhole.x - other.x;
            const dy = blackhole.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 420 && dist > 10) {
              const pull = (blackhole.radius * 0.5) * (180 / (dist * dist));
              other.vx += (dx / dist) * Math.min(pull, 4.0);
              other.vy += (dy / dist) * Math.min(pull, 4.0);
            }

            if (dist < blackhole.radius + other.radius * 0.5) {
              blackhole.radius += Math.min(other.radius * 0.05, 4);
              playMotionHum();

              other.x = Math.random() > 0.5 ? -other.radius : width + other.radius;
              other.y = Math.random() * height;
              other.vx = (Math.random() - 0.5) * 1.2;
              other.vy = (Math.random() - 0.5) * 1.2;

              if (blackhole.radius > Math.min(width, height) * 0.7) {
                triggerMassiveDestruction(blackhole.x, blackhole.y, '💥 ULTIMATE BIG BANG!', true);
                blackhole.isExploded = true;
                setTimeout(() => {
                  blackhole.radius = 40;
                  blackhole.isExploded = false;
                }, 60000);
              }
            }
          }
        });
      }
    }

    function drawBigBoySun(ctx, body, frameCount) {
      ctx.save();
      ctx.translate(body.x, body.y);
      ctx.rotate(body.rotation);

      const r = body.radius;
      const sunGradient = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.6);
      sunGradient.addColorStop(0, '#ffffff');
      sunGradient.addColorStop(0.3, '#ffcc00');
      sunGradient.addColorStop(0.7, '#ff6600');
      sunGradient.addColorStop(1, 'rgba(255, 51, 0, 0)');

      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffaa00';
      ctx.shadowBlur = isHalfIntensity ? 20 : 45;
      ctx.shadowColor = '#ffaa00';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // Solar Corona Rays
      const rayCount = 12;
      ctx.strokeStyle = 'rgba(255, 170, 0, 0.45)';
      ctx.lineWidth = 3;
      for (let i = 0; i < rayCount; i++) {
        const rayAngle = (i / rayCount) * Math.PI * 2 + frameCount * 0.01;
        const rayLen = r * (1.2 + Math.sin(frameCount * 0.05 + i) * 0.15);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(rayAngle) * rayLen, Math.sin(rayAngle) * rayLen);
        ctx.stroke();
      }

      ctx.restore();
    }

    function drawGiantPlanet(ctx, body, frameCount) {
      ctx.save();
      ctx.translate(body.x, body.y);
      ctx.rotate(body.rotation);

      const r = body.radius;

      // Saturn / Uranus Rings
      if (body.hasRings) {
        ctx.strokeStyle = body.glowColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 1.85, r * 0.65, Math.PI / 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Main Body
      ctx.fillStyle = body.color;
      ctx.shadowBlur = isHalfIntensity ? 12 : 28;
      ctx.shadowColor = body.glowColor;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // Orbiting Moons
      if (body.moons && body.moons.length > 0) {
        body.moons.forEach((moon, mIdx) => {
          const moonAngle = frameCount * (moon.speed || 0.02) * stemTimeScale + (mIdx * Math.PI * 0.6);
          const mDist = r * (moon.dist || 1.8);
          const mx = Math.cos(moonAngle) * mDist;
          const my = Math.sin(moonAngle) * mDist * 0.5;

          ctx.save();
          if (moon.icon) {
            ctx.font = `${moon.size * 5}px sans-serif`;
            ctx.fillText(moon.icon, mx - 6, my + 4);
          } else {
            ctx.fillStyle = moon.color || '#e0e0e0';
            ctx.shadowBlur = 6;
            ctx.shadowColor = moon.color || '#ffffff';
            ctx.beginPath();
            ctx.arc(mx, my, moon.size || 3, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });
      }

      ctx.restore();
    }

    function drawSupermassiveBlackhole(ctx, body, frameCount) {
      if (body.isExploded) return;

      ctx.save();
      ctx.translate(body.x, body.y);
      const r = body.radius;

      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 4.5;
      ctx.shadowBlur = isHalfIntensity ? 15 : 40;
      ctx.shadowColor = '#00d4ff';
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.45, r * 0.5, frameCount * 0.02 * stemTimeScale, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#ff007f';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ff007f';
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.25, r * 0.4, -frameCount * 0.025 * stemTimeScale, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    function drawSmallItem(ctx, body) {
      ctx.save();
      ctx.translate(body.x, body.y);
      ctx.rotate(body.rotation);

      ctx.font = `800 ${body.radius * 1.45}px 'Syne', sans-serif`;
      ctx.fillStyle = body.color;
      ctx.shadowBlur = isHalfIntensity ? 6 : 16;
      ctx.shadowColor = body.glowColor;

      let symbolStr = body.text || '🚀';
      if (body.type === 'rocket') symbolStr = '🚀';
      else if (body.type === 'satellite') symbolStr = '🛰️';
      else if (body.type === 'circuit') symbolStr = '⚡';

      ctx.fillText(symbolStr, -body.radius * 0.5, body.radius * 0.4);
      ctx.restore();
    }

    function drawLightningArc(ctx, x1, y1, x2, y2, color) {
      ctx.save();
      ctx.strokeStyle = color || '#00d4ff';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = color || '#00d4ff';

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      const steps = 6;
      for (let s = 1; s < steps; s++) {
        const t = s / steps;
        const px = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 16;
        const py = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 16;
        ctx.lineTo(px, py);
      }
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    }

    function drawMilkyWayGalaxy(ctx, frameCount, width, height) {
      ctx.save();
      const centerX = width * 0.5;
      const centerY = height * 0.45;
      const galaxyRadius = Math.max(width, height) * 0.65;
      const galaxyGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, galaxyRadius);
      galaxyGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
      galaxyGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.04)');
      galaxyGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = galaxyGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    let frameCount = 0;

    function render() {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      if (isBackgroundDisabled) {
        requestAnimationFrame(render);
        return;
      }

      if (document.body.classList.contains('cosmic-view-active')) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
      }

      drawMilkyWayGalaxy(ctx, frameCount, width, height);
      updatePhysicsAndCollisions();

      // Electric Lightning Arcs
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const b1 = bodies[i];
          const b2 = bodies[j];
          if (b1.isExploded || b2.isExploded) continue;

          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (b1.radius <= 65 && b2.radius <= 65 && b1.charge * b2.charge < 0 && dist < 125) {
            drawLightningArc(ctx, b1.x, b1.y, b2.x, b2.y, b1.color);
          } else if (dist < 110 && Math.random() < 0.15) {
            drawLightningArc(ctx, b1.x, b1.y, b2.x, b2.y, b1.color);
          }
        }
      }

      const isCosmicActive = document.body.classList.contains('cosmic-view-active');
      const alphaMult = isCosmicActive ? 1.0 : 0.30;

      bodies.forEach((body) => {
        if (body.isExploded) return;
        if (body.type === 'super_blackhole' && isBlackholeDisabled) return;

        ctx.save();
        const baseAlpha = body.type === 'super_blackhole' ? 0.95 : body.radius > 60 ? 0.52 : 0.68;
        ctx.globalAlpha = baseAlpha * alphaMult;

        switch (body.type) {
          case 'big_sun':
            drawBigBoySun(ctx, body, frameCount);
            break;
          case 'giant_planet':
            drawGiantPlanet(ctx, body, frameCount);
            break;
          case 'super_blackhole':
            drawSupermassiveBlackhole(ctx, body, frameCount);
            break;
          default:
            drawSmallItem(ctx, body);
            break;
        }

        ctx.restore();
      });

      requestAnimationFrame(render);
    }

    render();
  }

})();
