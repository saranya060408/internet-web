// ============================================================
//  app.js  —  Sakthi Internet Service Portal
//  Interactive Engine: 3D Network BG, Live Speed Test,
//  Download Calculator, Plan Finder Wizard, GST Engine & Modal
// ============================================================

'use strict';

const $ = id => document.getElementById(id);
const $$ = sel => [...document.querySelectorAll(sel)];

let currentDuration = 'monthly';
let includeGst = false;
let speedTestRunning = false;

/* ═══════════════════════════════════════════════════════════════
   1. 3D NETWORK CANVAS BACKGROUND WITH CYBER FIBER OPTICS
═══════════════════════════════════════════════════════════════ */
function initNetworkCanvas() {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, nodes, packets, animId;
  let mouseX = 0, mouseY = 0;

  const isMobile = window.innerWidth < 768;
  const NODE_COUNT   = isMobile ? 32 : 70;
  const HUB_COUNT    = isMobile ? 4 : 7;
  const CONN_DIST    = isMobile ? 150 : 230;
  const COLORS = {
    cyan: '#ff8c00',
    purple: '#3b82f6',
    gold: '#ffb300',
    green: '#fb923c',
    pink: '#60a5fa'
  };
  const COLOR_POOL = [COLORS.cyan, COLORS.purple, COLORS.gold, COLORS.green, COLORS.pink];

  // Mouse tracking for 3D parallax
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeNodes() {
    nodes = [];
    // Regular nodes
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random() * 0.7 + 0.2,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 2.2 + 0.8,
        color: COLOR_POOL[Math.floor(Math.random() * COLOR_POOL.length)],
        pulse: Math.random() * Math.PI * 2,
        isHub: false
      });
    }
    // Hub / Core Optical Routers
    for (let i = 0; i < HUB_COUNT; i++) {
      nodes.push({
        x: W * (0.15 + Math.random() * 0.7),
        y: H * (0.15 + Math.random() * 0.7),
        z: Math.random() * 0.3 + 0.65,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 2 + 3.8,
        color: Math.random() > 0.5 ? COLORS.cyan : COLORS.purple,
        pulse: Math.random() * Math.PI * 2,
        isHub: true
      });
    }
    packets = [];
  }

  function spawnPacket() {
    const candidates = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const maxDist = (nodes[i].isHub || nodes[j].isHub) ? CONN_DIST * 1.35 : CONN_DIST;
        if (Math.hypot(dx, dy) < maxDist) candidates.push([i, j]);
      }
    }
    if (!candidates.length) return;
    const [a, b] = candidates[Math.floor(Math.random() * candidates.length)];
    packets.push({
      from: a, to: b, t: 0,
      speed: Math.random() * 0.009 + 0.004,
      color: COLOR_POOL[Math.floor(Math.random() * COLOR_POOL.length)],
      trail: []
    });
  }

  function drawPerspectiveGrid() {
    const vanishX = W * 0.5 + mouseX * 45;
    const vanishY = H * 0.25 + mouseY * 25;
    const gridLines = isMobile ? 10 : 20;

    ctx.save();
    ctx.globalAlpha = 0.035;
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 0.6;

    // Horizontal receding lines
    for (let i = 0; i <= gridLines; i++) {
      const t = i / gridLines;
      const y = vanishY + (H - vanishY) * Math.pow(t, 1.45);
      const spread = t * W * 0.85;
      ctx.beginPath();
      ctx.moveTo(vanishX - spread, y);
      ctx.lineTo(vanishX + spread, y);
      ctx.stroke();
    }

    // Vertical converging lines
    for (let i = -10; i <= 10; i++) {
      const x = vanishX + i * (W / 14);
      ctx.beginPath();
      ctx.moveTo(vanishX, vanishY);
      ctx.lineTo(x, H);
      ctx.globalAlpha = 0.022;
      ctx.stroke();
    }

    ctx.restore();
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    if (frame % 40 === 0 && packets.length < 28) spawnPacket();

    drawPerspectiveGrid();

    const parallaxFactor = 22;

    for (const n of nodes) {
      n.x += n.vx * n.z;
      n.y += n.vy * n.z;
      n.pulse += 0.02;
      if (n.x < -40) n.x = W + 40;
      if (n.x > W + 40) n.x = -40;
      if (n.y < -40) n.y = H + 40;
      if (n.y > H + 40) n.y = -40;
    }

    function getPos(n) {
      return {
        x: n.x + mouseX * parallaxFactor * n.z,
        y: n.y + mouseY * parallaxFactor * n.z
      };
    }

    // Draw optical fiber connection mesh
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const ni = nodes[i], nj = nodes[j];
        const pi = getPos(ni), pj = getPos(nj);
        const dist = Math.hypot(pi.x - pj.x, pi.y - pj.y);
        const maxDist = (ni.isHub || nj.isHub) ? CONN_DIST * 1.35 : CONN_DIST;
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.22 * ni.z * nj.z;
          ctx.beginPath();
          ctx.moveTo(pi.x, pi.y);
          ctx.lineTo(pj.x, pj.y);

          if (ni.isHub || nj.isHub) {
            const grad = ctx.createLinearGradient(pi.x, pi.y, pj.x, pj.y);
            grad.addColorStop(0, `rgba(0,245,155,${alpha * 1.6})`);
            grad.addColorStop(1, `rgba(14,165,233,${alpha * 1.6})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.1 * Math.min(ni.z, nj.z);
          } else {
            ctx.strokeStyle = `rgba(0,245,155,${alpha})`;
            ctx.lineWidth = 0.6 * Math.min(ni.z, nj.z);
          }
          ctx.stroke();
        }
      }
    }

    // Draw nodes with photonic aura
    for (const n of nodes) {
      const glow = Math.sin(n.pulse) * 0.5 + 0.5;
      const r = n.r * n.z;
      const p = getPos(n);

      if (n.isHub) {
        const ringR = r * 6.5 + glow * 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = n.color === COLORS.cyan
          ? `rgba(0,245,155,${0.09 + glow * 0.07})`
          : `rgba(14,165,233,${0.09 + glow * 0.07})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const glowR = n.isHub ? r * 8 : r * 5;
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
      const glowAlpha = n.isHub ? 0.28 * glow * n.z : 0.16 * glow * n.z;
      grad.addColorStop(0, n.color === COLORS.cyan ? `rgba(0,245,155,${glowAlpha})` : `rgba(14,165,233,${glowAlpha})`);
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.fill();

      if (n.isHub) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.4 + glow * 0.3})`;
        ctx.fill();
      }
    }

    // Draw high-speed data packets
    for (let i = packets.length - 1; i >= 0; i--) {
      const pk = packets[i];
      pk.t += pk.speed;
      if (pk.t >= 1) { packets.splice(i, 1); continue; }

      const from = nodes[pk.from], to = nodes[pk.to];
      const pf = getPos(from), pt = getPos(to);
      const px = pf.x + (pt.x - pf.x) * pk.t;
      const py = pf.y + (pt.y - pf.y) * pk.t;

      pk.trail.push({ x: px, y: py });
      if (pk.trail.length > 14) pk.trail.shift();

      for (let ti = 0; ti < pk.trail.length - 1; ti++) {
        const trailAlpha = (ti / pk.trail.length) * 0.45;
        ctx.beginPath();
        ctx.moveTo(pk.trail[ti].x, pk.trail[ti].y);
        ctx.lineTo(pk.trail[ti + 1].x, pk.trail[ti + 1].y);
        ctx.strokeStyle = `rgba(0,240,255,${trailAlpha})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(px, py, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = pk.color;
      ctx.fill();
    }

    animId = requestAnimationFrame(draw);
  }

  resize();
  makeNodes();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animId);
      resize();
      makeNodes();
      draw();
    }, 200);
  });
}

/* ═══════════════════════════════════════════════════════════════
   2. BACKGROUND VIDEO MANAGER
═══════════════════════════════════════════════════════════════ */
function initBackgroundVideoManager() {
  const bgVideo = $('bg-video');
  if (!bgVideo) return;

  // Safe async play controller
  try {
    const promise = bgVideo.play();
    if (promise !== undefined && typeof promise.then === 'function') {
      promise.catch(() => {
        // Autoplay policy fallback
      });
    }
  } catch (err) {
    // Ignore immediate playback interruptions
  }
}

/* ═══════════════════════════════════════════════════════════════
   3. HEADER & MOBILE NAVIGATION
═══════════════════════════════════════════════════════════════ */
function initHeader() {
  const header = $('site-header');
  const hamburger = $('hamburger-btn');
  const nav = $('main-nav');

  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(open));
    });
  }

  $$('#main-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (nav) nav.classList.remove('open');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   4. HERO SPEEDOMETER INTRO
═══════════════════════════════════════════════════════════════ */
function initHeroSpeedometer() {
  const el = $('hero-speed-val');
  if (!el) return;
  let val = 0, target = 300;
  const interval = setInterval(() => {
    val = Math.min(val + Math.ceil((target - val) / 7) + 2, target);
    el.textContent = String(val);
    if (val >= target) clearInterval(interval);
  }, 35);
}

/* ═══════════════════════════════════════════════════════════════
   5. SPEED TEST CHECK (OOKLA SPEEDTEST GO HANDLER)
═══════════════════════════════════════════════════════════ */
function initSpeedTestEngine() {
  const heroQuickBtn = $('btn-quick-speedtest-hero');
  const btnGo = $('btn-speedtest-go');

  if (btnGo) {
    btnGo.addEventListener('click', () => {
      showToast('🚀 Launching Official Speedtest.net by Ookla...', 'info');
    });
  }

  if (heroQuickBtn) {
    heroQuickBtn.addEventListener('click', () => {
      const section = $('speedtest-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* ═══════════════════════════════════════════════════════════════
   6. PLANS GRID RENDERER & GST CALCULATOR
═══════════════════════════════════════════════════════════════ */
function initPlansAndGST() {
  const tabs = $$('.tab-btn');
  const gstToggle = $('gst-toggle-input');
  const labelExcl = $('label-gst-excl');
  const labelIncl = $('label-gst-incl');

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentDuration = btn.dataset.duration || 'monthly';
      renderPlans();
    });
  });

  if (gstToggle) {
    gstToggle.addEventListener('change', e => {
      includeGst = e.target.checked;
      if (labelExcl) labelExcl.classList.toggle('active', !includeGst);
      if (labelIncl) labelIncl.classList.toggle('active', includeGst);
      renderPlans();
      showToast(includeGst ? '📊 Switched to Final Price (with 18% GST)' : '📊 Switched to Base Price', 'info');
    });
  }
}

function renderPlans() {
  const grid = $('plans-grid');
  if (!grid) return;
  const plans = (typeof RECHARGE_PLANS !== 'undefined' && RECHARGE_PLANS[currentDuration]) ? RECHARGE_PLANS[currentDuration] : [];

  grid.innerHTML = '';

  plans.forEach((plan, idx) => {
    const card = document.createElement('article');
    card.className = `plan-card glass${plan.popular ? ' popular' : ''}`;
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', `${plan.name} - ${plan.speed} plan`);

    const rawPrice = plan.price;
    const finalPrice = includeGst ? Math.round(rawPrice * 1.18) : rawPrice;
    const gstTaxAmount = Math.round(rawPrice * 0.18);

    const speedColor = idx % 2 === 0 ? 'var(--cyan)' : 'var(--purple)';

    const ottHtml = (plan.ott && plan.ott.length)
      ? `<div class="ott-wrap">${plan.ott.map(o => `<span class="ott-tag">📺 ${o}</span>`).join('')}</div>`
      : '';

    const savingsHtml = plan.savings
      ? `<p class="plan-savings" style="color:var(--green);font-size:0.78rem;font-weight:700;margin-bottom:12px;">🎉 ${plan.savings}</p>`
      : '';

    card.innerHTML = `
      <div class="plan-badge" style="background:${plan.badgeColor}20;color:${plan.badgeColor};border:1px solid ${plan.badgeColor}40;">
        ⚡ ${plan.badge}
      </div>
      ${plan.popular ? '<span class="popular-crown font-orbitron">⭐ MOST POPULAR</span>' : ''}
      <div class="plan-speed" style="color:${speedColor};text-shadow:0 0 20px ${speedColor}88;">
        ${plan.speed.replace(' Mbps','')}
      </div>
      <div class="plan-speed-unit">Mbps Symmetrical</div>
      <div class="plan-name">${plan.name}</div>
      <div class="plan-divider"></div>
      <div class="plan-pricing">
        <span class="plan-currency">₹</span>
        <span class="plan-price font-orbitron">${finalPrice.toLocaleString()}</span>
        <span class="plan-period">/ ${plan.validity}</span>
      </div>
      <div class="plan-tax-note">
        ${includeGst ? `✓ Incl. 18% GST (Tax: ₹${gstTaxAmount})` : `+ 18% GST Applicable (₹${gstTaxAmount})`}
      </div>
      ${savingsHtml}
      <div class="plan-data">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        ${plan.data}
      </div>
      <div class="plan-benefits">
        ${plan.benefits.map(b => `
          <div class="benefit-item">
            <span class="benefit-icon">✓</span>
            <span>${b}</span>
          </div>
        `).join('')}
      </div>
      ${ottHtml}
      <div style="display:flex;gap:8px;margin-top:auto;">
        <a href="tel:9865396073" class="btn-select-plan cyan-border btn-book-plan-trigger" data-planname="${plan.name} (${plan.speed})" style="flex:1; text-decoration:none; display:inline-flex; align-items:center; justify-content:center;">
          ⚡ Connect
        </a>
        <a href="tel:9865396073" class="btn-select-plan purple-border" style="width:auto;padding:12px 14px; text-decoration:none; display:inline-flex; align-items:center; justify-content:center;" title="Call Support">
          📞
        </a>
      </div>
    `;

    grid.appendChild(card);

    // 3D Tilt Effect on Desktop
    if (window.innerWidth > 768) {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
        const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -12;
        card.style.transform = `translateY(-6px) perspective(600px) rotateY(${x}deg) rotateX(${y}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    }
  });

  // Attach phone call handler to newly rendered cards
  $$('.btn-book-plan-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'tel:9865396073';
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   6. INSTANT DOWNLOAD TIME CALCULATOR
═══════════════════════════════════════════════════════════ */
function initDownloadCalculator() {
  const slider = $('calc-filesize-slider');
  const display = $('calc-filesize-display');
  const container = $('calc-results-container');
  const presets = $$('.preset-btn');

  if (!slider || !display || !container) return;

  const speeds = [
    { speed: 50,  label: 'Starter Spark (50 Mbps)', color: 'var(--green)' },
    { speed: 100, label: 'Value Blaze (100 Mbps)',  color: 'var(--cyan)', popular: true },
    { speed: 200, label: 'Gaming Titan (200 Mbps)', color: 'var(--purple)' },
    { speed: 300, label: 'Ultra Storm (300 Mbps)',  color: 'var(--gold)', fastest: true }
  ];

  function formatTime(seconds) {
    if (seconds < 1) return '< 1 sec';
    if (seconds < 60) return `${Math.round(seconds)} sec`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    if (mins < 60) return `${mins}m ${secs}s`;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${remMins}m`;
  }

  function updateCalculator(fileSizeGB) {
    display.textContent = `${fileSizeGB} GB`;

    container.innerHTML = '';
    const fileBits = fileSizeGB * 8 * 1024; // Megabits

    speeds.forEach(sp => {
      const timeSeconds = fileBits / sp.speed;
      const formatted = formatTime(timeSeconds);

      const item = document.createElement('div');
      item.className = 'calc-result-box glass-sub';
      item.innerHTML = `
        <div class="calc-speed-badge font-orbitron" style="color:${sp.color};">
          ⚡ ${sp.speed} Mbps
        </div>
        <div class="calc-time-val font-orbitron" style="color:#fff;">
          ${formatted}
        </div>
        <div class="calc-plan-ref" style="font-size:0.75rem;color:var(--text-muted);">
          ${sp.label}
        </div>
        <div class="calc-progress-track" style="height:4px;background:rgba(255,255,255,0.08);border-radius:2px;margin-top:8px;overflow:hidden;">
          <div style="height:100%;background:${sp.color};width:${Math.min(100, (sp.speed / 300) * 100)}%;"></div>
        </div>
      `;
      container.appendChild(item);
    });
  }

  slider.addEventListener('input', e => {
    presets.forEach(p => p.classList.remove('active'));
    updateCalculator(parseInt(e.target.value, 10));
  });

  presets.forEach(btn => {
    btn.addEventListener('click', () => {
      presets.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const size = parseInt(btn.dataset.size, 10);
      slider.value = size;
      updateCalculator(size);
    });
  });

  // Initial calculation
  updateCalculator(4);
}

/* ═══════════════════════════════════════════════════════════
   7. SMART PLAN FINDER WIZARD
═══════════════════════════════════════════════════════════ */
function initPlanWizard() {
  const wizardOpts = $$('.wizard-opt-btn');
  const recName = $('rec-plan-name');
  const recReason = $('rec-plan-reason');
  const recPrice = $('rec-plan-price');
  const wizardBookBtn = $('btn-wizard-book');

  let selectedDevices = '1-2';
  let selectedActivity = 'browsing';

  function updateRecommendation() {
    let rec = {
      name: 'Value Blaze (100 Mbps)',
      reason: 'Optimal blend for high-speed streaming, Zoom WFH meetings & family browsing with zero buffering.',
      price: '₹649 / month',
      fullPlan: 'Value Blaze 100 Mbps - ₹649/mo'
    };

    if (selectedDevices === '1-2' && selectedActivity === 'browsing') {
      rec = {
        name: 'Starter Spark (50 Mbps)',
        reason: 'Most budget-friendly high-speed fiber for 1-2 users with seamless YouTube and everyday browsing.',
        price: '₹449 / month',
        fullPlan: 'Starter Spark 50 Mbps - ₹449/mo'
      };
    } else if (selectedActivity === 'gaming' || selectedDevices === '6+') {
      if (selectedDevices === '6+' && selectedActivity === 'gaming') {
        rec = {
          name: 'Ultra Storm (300 Mbps)',
          reason: 'Ultimate gigabit-class fiber with dedicated bandwidth priority for pro gaming, 8K streaming & smart homes.',
          price: '₹1049 / month',
          fullPlan: 'Ultra Storm 300 Mbps - ₹1049/mo'
        };
      } else {
        rec = {
          name: 'Gaming Titan (200 Mbps)',
          reason: 'Custom gaming DNS routing with <4ms latency, symmetric uploads & free Dual-Band Wi-Fi 6 router.',
          price: '₹849 / month',
          fullPlan: 'Gaming Titan 200 Mbps - ₹849/mo'
        };
      }
    } else if (selectedActivity === 'streaming') {
      rec = {
        name: 'Value Blaze (100 Mbps)',
        reason: 'Includes complimentary Disney+ Hotstar & SonyLIV bundles with crystal-clear 4K HDR playback.',
        price: '₹649 / month',
        fullPlan: 'Value Blaze 100 Mbps - ₹649/mo'
      };
    }

    if (recName) recName.textContent = rec.name;
    if (recReason) recReason.textContent = rec.reason;
    if (recPrice) recPrice.innerHTML = `${rec.price} <small>+ 18% GST</small>`;
    if (wizardBookBtn) {
      wizardBookBtn.href = 'tel:9865396073';
      wizardBookBtn.onclick = () => {
        window.location.href = 'tel:9865396073';
      };
    }
  }

  wizardOpts.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.wizard-options-grid');
      if (!parent) return;
      const q = parent.dataset.q;
      parent.querySelectorAll('.wizard-opt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (q === 'devices') selectedDevices = btn.dataset.val;
      if (q === 'activity') selectedActivity = btn.dataset.val;

      updateRecommendation();
    });
  });

  updateRecommendation();
}

/* ═══════════════════════════════════════════════════════════
   8. PROVIDER COMPARISON TABLE MATRIX
═══════════════════════════════════════════════════════════ */
function renderComparisonTable() {
  const tbody = $('comparison-tbody');
  const theadRow = $('comparison-thead-row');
  if (!tbody || !theadRow) return;

  if (typeof PROVIDER_MATRIX === 'undefined') return;

  const { speeds, providers, prices, valuePicks } = PROVIDER_MATRIX;

  // Build thead
  let theadHTML = `<th scope="col" style="text-align:left;padding-left:20px;min-width:100px;">Speed</th>`;
  for (const p of providers) {
    theadHTML += `
      <th scope="col">
        <div class="provider-th">
          <span class="provider-th-logo">${p.logo}</span>
          <span class="provider-th-name">${p.name}</span>
        </div>
      </th>`;
  }
  theadRow.innerHTML = theadHTML;

  // Build tbody
  tbody.innerHTML = '';
  speeds.forEach(speed => {
    const row = document.createElement('tr');
    const rowPrices = prices[speed];
    const speedValuePicks = (valuePicks && valuePicks[speed]) ? valuePicks[speed] : [];

    const vals = Object.values(rowPrices).filter(v => v !== null);
    const best = vals.length ? Math.min(...vals) : null;

    let html = `<td class="speed-cell font-orbitron">${speed} <span style="font-size:0.7rem;color:var(--text-muted);">Mbps</span></td>`;

    for (const p of providers) {
      const price = rowPrices[p.id];

      if (price === null) {
        html += `<td class="empty-cell">—</td>`;
      } else {
        const isBest  = price === best;
        const isValue = speedValuePicks.includes(p.id);

        let cellClass, prefix;
        if (isBest) {
          cellClass = 'price-cell best';
          prefix    = '🏆 ';
        } else if (isValue) {
          cellClass = 'price-cell value-pick';
          prefix    = '⭐ ';
        } else {
          cellClass = 'price-cell';
          prefix    = '';
        }

        html += `<td class="${cellClass}">${prefix}₹${price}/-</td>`;
      }
    }

    row.innerHTML = html;
    tbody.appendChild(row);
  });
}

/* ═══════════════════════════════════════════════════════════
   9. QUICK BOOKING MODAL & ACTIONS
═══════════════════════════════════════════════════════════ */
function openBookingModal(defaultPlan = '') {
  const modal = $('booking-modal');
  const planSelect = $('book-plan');
  if (!modal) return;

  if (planSelect && defaultPlan) {
    // Try matching option
    for (let opt of planSelect.options) {
      if (opt.value.includes(defaultPlan) || defaultPlan.includes(opt.value)) {
        opt.selected = true;
        break;
      }
    }
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  const firstInput = $('book-name');
  if (firstInput) setTimeout(() => firstInput.focus(), 100);
}

function closeBookingModal() {
  const modal = $('booking-modal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}

function initBookingModal() {
  const modal = $('booking-modal');
  const closeBtn = $('btn-modal-close');
  const form = $('booking-form');
  const quickBookNavBtn = $('btn-quick-book');
  const heroConnectBtn = $('btn-hero-connect');
  const whatsappBtn = $('btn-submit-whatsapp');

  if (heroConnectBtn) heroConnectBtn.addEventListener('click', () => { window.location.href = 'tel:9865396073'; });
  if (closeBtn) closeBtn.addEventListener('click', closeBookingModal);

  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeBookingModal();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeBookingModal();
  });

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const name = ($('book-name') || {}).value || 'Customer';
      const phone = ($('book-phone') || {}).value || 'Not provided';
      const plan = ($('book-plan') || {}).value || 'Value Blaze 100 Mbps';
      const address = ($('book-address') || {}).value || 'Tamil Nadu';

      const text = encodeURIComponent(
        `⚡ *New Sakthi Fiber Connection Request*\n\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Mobile:* ${phone}\n` +
        `📡 *Requested Plan:* ${plan}\n` +
        `📍 *Location/Area:* ${address}\n\n` +
        `Please confirm installation slot & setup schedule.`
      );

      window.open(`https://wa.me/919865396073?text=${text}`, '_blank');
      closeBookingModal();
      showToast('💬 Redirecting to WhatsApp for instant connection booking!', 'success');
    });
  }

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = ($('book-name') || {}).value || 'Valued Customer';
      const bookingId = 'SIS-' + Math.floor(1000 + Math.random() * 9000);

      closeBookingModal();
      form.reset();
      showToast(`🎉 Connection Booked! ID: ${bookingId}. Our engineer will call you shortly at 9865396073.`, 'success');
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   10. FLOATING QUICK DOCK & SCROLL TO TOP
═══════════════════════════════════════════════════════════ */
function initFloatingDock() {
  const scrollTopBtn = $('btn-scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   11. TOAST NOTIFICATION SYSTEM
═══════════════════════════════════════════════════════════ */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  const colors = { success: '#22c55e', error: '#ef4444', info: '#00f0ff', warning: '#f59e0b' };
  const color  = colors[type] || colors.info;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '80px',
    right: '24px',
    background: '#0d1117',
    border: `1px solid ${color}`,
    color: '#e6edf3',
    padding: '14px 22px',
    borderRadius: '12px',
    fontSize: '0.88rem',
    fontWeight: '500',
    zIndex: 4000,
    boxShadow: `0 0 24px ${color}55`,
    transform: 'translateY(20px)',
    opacity: '0',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    maxWidth: 'min(380px, calc(100vw - 40px))',
    backdropFilter: 'blur(16px)',
    fontFamily: '"Inter", sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  });

  toast.innerHTML = `<span>${message}</span>`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ═══════════════════════════════════════════════════════════
   12. SMOOTH SCROLL NAV LINKS
═══════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerH = ($('site-header') || {}).offsetHeight || 74;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   13. INITIALIZATION ON DOM READY
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNetworkCanvas();
  initBackgroundVideoManager();
  initHeader();
  initHeroSpeedometer();
  initSpeedTestEngine();
  initPlansAndGST();
  renderPlans();
  initDownloadCalculator();
  initPlanWizard();
  renderComparisonTable();
  initBookingModal();
  initFloatingDock();
  initSmoothScroll();
});
