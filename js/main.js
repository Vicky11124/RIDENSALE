/* ============================================
   RIDENSALE — MAIN JAVASCRIPT
   ============================================ */

(function () {
  "use strict";

  /* ── 1. LOADER & VIDEO CONTROL ───────────── */
  const loader = document.getElementById("loader");
  const rpmNeedle = document.getElementById("rpmNeedle");
  const rpmVal = document.getElementById("rpmVal");
  const heroVideo = document.getElementById("heroVideo");
  const heroSec = document.getElementById("hero");

  let rpm = 0;
  const maxRpm = 12000;
  const tachMinAngle = -90;
  const tachSweep = 180;
  let loaderCompleted = false;
  let domReady = document.readyState !== "loading";

  function setRpmDisplay(value) {
    rpm = Math.min(value, maxRpm);
    if (rpmVal) rpmVal.textContent = rpm.toLocaleString();
    if (rpmNeedle) {
      const angle = tachMinAngle + (rpm / maxRpm) * tachSweep;
      rpmNeedle.style.transform = `rotate(${angle}deg)`;
    }
  }

  if (!domReady) {
    document.addEventListener("DOMContentLoaded", () => { domReady = true; }, { once: true });
  }

  // Video error / fallback handling:
  // If the video fails to load, keep loading the page and hide the broken video element.
  if (heroVideo) {
    const handleVideoError = () => {
      console.warn("Hero video failed to load or autoplay was prevented. Applying visual fallback.");
      heroVideo.style.display = "none"; // Hide video, fallback to premium gradient background
    };
    heroVideo.addEventListener("error", handleVideoError, true);
    const sourceEl = heroVideo.querySelector("source");
    if (sourceEl) {
      sourceEl.addEventListener("error", handleVideoError);
    }
  }

  // Unified loader completion function
  function completeLoader() {
    if (loaderCompleted) return;
    loaderCompleted = true;

    // Clear animations/timers
    clearInterval(rpmInterval);
    clearTimeout(failsafeTimeout);

    setRpmDisplay(maxRpm);

    // Start transition
    setTimeout(() => {
      if (loader) {
        loader.style.transition = "opacity .45s ease";
        loader.style.opacity = "0";
      }
      setTimeout(() => {
        if (loader) loader.style.display = "none";
        document.body.style.overflow = "";

        initScrollAnimations();

        if (heroVideo) {
          heroVideo.play().catch((err) => {
            console.warn("Video playback was prevented by the browser:", err);
          });
        }
        if (heroSec) {
          heroSec.classList.add("loaded");
        }
      }, 450);
    }, 250);
  }

  // RPM tach animation — accelerates once DOM is ready.
  // Slightly decreased the loading speed to make the rev-up animation feel more premium and visible.
  const rpmInterval = setInterval(() => {
    const boost = domReady ? 1.0 : 0.6;
    setRpmDisplay(rpm + Math.floor((Math.random() * 300 + 250) * boost));
    if (rpm >= maxRpm) {
      completeLoader();
    }
  }, 35);

  const failsafeTimeout = setTimeout(completeLoader, 2500);

  document.body.style.overflow = "hidden";

  /* ── 2. CUSTOM CURSOR & SMOKE TRAIL ──────── */
  const dot = document.getElementById("cur-dot");

  // Inject premium motorcycle wheel SVG
  if (dot) {
    dot.innerHTML = `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Outer Tire -->
        <circle cx="50" cy="50" r="44" stroke="#161616" stroke-width="10" />
        <!-- Tire Tread details -->
        <circle cx="50" cy="50" r="44" stroke="#0a0a0a" stroke-width="3.5" stroke-dasharray="8,10" />
        <!-- Inner rim line -->
        <circle cx="50" cy="50" r="37" stroke="#FF6600" stroke-width="2" />
        <!-- Spokes (Alloy Wheel style) -->
        <g stroke="#FF6600" stroke-width="3" stroke-linecap="round">
          <line x1="50" y1="50" x2="50" y2="10" />
          <line x1="50" y1="50" x2="50" y2="90" />
          <line x1="50" y1="50" x2="10" y2="50" />
          <line x1="50" y1="50" x2="90" y2="50" />
          <line x1="50" y1="50" x2="22" y2="22" />
          <line x1="50" y1="50" x2="78" y2="78" />
          <line x1="50" y1="50" x2="22" y2="78" />
          <line x1="50" y1="50" x2="78" y2="22" />
        </g>
        <!-- Brake Disc Rotor -->
        <circle cx="50" cy="50" r="23" fill="rgba(30,30,30,0.9)" stroke="#555" stroke-width="1.5" />
        <circle cx="50" cy="50" r="18" stroke="#888" stroke-width="1" stroke-dasharray="3,4" />
        <!-- Hub axle -->
        <circle cx="50" cy="50" r="8" fill="#1e1e1e" stroke="#FF6600" stroke-width="2.5" />
        <circle cx="50" cy="50" r="3" fill="#ffffff" />
      </svg>
    `;
  }

  let mx = 0, my = 0, rx = 0, ry = 0;
  let lastMx = 0, lastMy = 0;
  let rotationAngle = 0;
  let smoke = [];

  // Mobile detection
  const isMobile = window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  const noParticleSections = [heroSec, document.getElementById("cta")].filter(Boolean);

  function getNoParticleRects() {
    return noParticleSections.map((el) => el.getBoundingClientRect());
  }

  function pointInNoParticleZone(x, y, rects) {
    for (let i = 0; i < rects.length; i++) {
      const r = rects[i];
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return true;
    }
    return false;
  }

  // Mouse Move listener
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;

    if (dot) {
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    }

    // Spawn smoke particles when moving (skip hero & CTA sections)
    if (!isMobile && !pointInNoParticleZone(mx, my, getNoParticleRects())) {
      let dx = mx - lastMx;
      let dy = my - lastMy;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 1.5) {
        // Calculate motion direction for realistic exhaust blast direction
        let angle = Math.atan2(dy, dx);
        let speed = Math.min(dist * 0.12, 4);

        // Spawn smoke puffs
        const numPuffs = dist > 8 ? 2 : 1;
        for (let i = 0; i < numPuffs; i++) {
          smoke.push({
            x: mx - (dx * (i / numPuffs)),
            y: my - (dy * (i / numPuffs)),
            vx: -Math.cos(angle) * speed + (Math.random() - 0.5) * 1.2,
            vy: -Math.sin(angle) * speed - (Math.random() * 0.6 + 0.3),
            r: Math.random() * 4 + 7,
            life: Math.random() * 25 + 30,
            maxLife: 55,
            growth: Math.random() * 0.15 + 0.22
          });
        }
      }
    }

    lastMx = mx;
    lastMy = my;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  // Custom cursor animation loop
  function animCursor() {
    // Rotation calculations
    let dx = mx - rx;
    let dy = my - ry;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0.1) {
      rotationAngle = (rotationAngle + dist * 0.75) % 360;
    }

    // Easing for wheel rotation calculations
    rx = lerp(rx, mx, 0.11);
    ry = lerp(ry, my, 0.11);

    if (dot) {
      dot.style.transform = `translate(-50%, -50%) rotate(${rotationAngle}deg)`;
    }

    requestAnimationFrame(animCursor);
  }
  animCursor();

  // Hover triggers for interactive elements
  document.querySelectorAll("a,button,.feat-card,.faq-item,.step,.stat,.soc-btn,.spec-card,.color-opt,.btn-ctrl").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      if (dot) dot.classList.add("big");
    });
    el.addEventListener("mouseleave", () => {
      if (dot) dot.classList.remove("big");
    });
  });

  /* ── 3. PARTICLES CANVAS ─────────────────── */
  const canvas = document.getElementById("ptx");
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function mkParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.1,
      alpha: Math.random() * 0.5 + 0.25,
    };
  }

  for (let i = 0; i < 120; i++) particles.push(mkParticle());

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    const excludeRects = getNoParticleRects();

    // Background particles
    particles.forEach((p) => {
      if (!pointInNoParticleZone(p.x, p.y, excludeRects)) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,102,0,${p.alpha * 0.9})`;
        ctx.fill();
      }
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
    });

    // Realistic smoke trail (accelerating superbike feel)
    if (!isMobile) {
      smoke = smoke.filter((p) => {
        p.life--;
        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.94;
        p.vy = p.vy * 0.94 - 0.05;
        p.r += p.growth;

        let lifePct = p.life / p.maxLife;
        let alpha = lifePct * 0.32;

        if (lifePct > 0 && !pointInNoParticleZone(p.x, p.y, excludeRects)) {
          if (p.isSpark) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 102, 0, ${lifePct * 0.95})`;
            ctx.fill();
          } else {
            let grad = ctx.createRadialGradient(p.x, p.y, p.r * 0.05, p.x, p.y, p.r);
            grad.addColorStop(0, `rgba(215, 215, 215, ${alpha})`);
            grad.addColorStop(0.35, `rgba(200, 200, 200, ${alpha * 0.55})`);
            grad.addColorStop(1, `rgba(180, 180, 180, 0)`);

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        return p.life > 0;
      });
    }

    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  /* ── 4. NAVBAR ───────────────────────────── */
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("stuck", window.scrollY > 60);
    updateScrollProgress();
    toggleScrollTop();
  });

  /* ── 5. SCROLL PROGRESS ──────────────────── */
  const prog = document.getElementById("scroll-progress");
  function updateScrollProgress() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (window.scrollY / total * 100) + "%";
  }

  /* ── 6. SCROLL TO TOP ────────────────────── */
  const scrollTopBtn = document.getElementById("scrollTop");
  function toggleScrollTop() {
    scrollTopBtn.classList.toggle("vis", window.scrollY > 600);
  }
  scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ── 7. HAMBURGER / MOBILE NAV ───────────── */
  const ham = document.getElementById("ham");
  const mobNav = document.getElementById("mobNav");
  const overlay = document.getElementById("navOverlay");

  ham.addEventListener("click", () => {
    ham.classList.toggle("open");
    mobNav.classList.toggle("open");
    overlay.style.display = mobNav.classList.contains("open") ? "block" : "none";
  });

  overlay.addEventListener("click", closeMob);
  mobNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMob));

  function closeMob() {
    ham.classList.remove("open");
    mobNav.classList.remove("open");
    overlay.style.display = "none";
  }

  /* ── 8. FAQ ACCORDION ────────────────────── */
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.querySelector(".faq-q").addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((o) => {
        o.classList.remove("open");
        o.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        item.querySelector(".faq-a").style.maxHeight = item.querySelector(".faq-a").scrollHeight + "px";
      }
    });
  });

  /* ── 9. SCROLL ANIMATIONS ────────────────── */
  function trackSlideSmoke(element, direction) {
    if (isMobile) return;
    
    // Select the paragraph text inside the container as requested, with fallback to headings
    let target = element.querySelector('p, .page-hero-sub');
    if (!target) {
      target = element.querySelector('h1, h2, .page-hero-title, .sec-title, .eyebrow');
    }
    if (!target) {
      target = element;
    }
    
    let lastRect = element.getBoundingClientRect();
    let startTime = performance.now();
    const duration = 1450; // matches var(--about-slide-duration)
    
    function update() {
      let now = performance.now();
      let elapsed = now - startTime;
      if (elapsed > duration) return;
      
      let rect = element.getBoundingClientRect();
      let dx = rect.left - lastRect.left;
      
      if (Math.abs(dx) > 0.5) {
        let tRect = target.getBoundingClientRect();
        if (tRect.width >= 5 && tRect.height >= 5) {
          // Spawn a dense, premium stream from the single target text element
          const count = 3;
          for (let i = 0; i < count; i++) {
            let pct = Math.random();
            let y = tRect.top + pct * tRect.height;
            let x, vx, vy;
            
            if (direction === "left-to-right") {
              x = tRect.left;
              vx = -dx * 0.22 - (Math.random() * 2 + 1);
              vy = (Math.random() - 0.5) * 1.5;
            } else {
              x = tRect.right;
              vx = -dx * 0.22 + (Math.random() * 2 + 1);
              vy = (Math.random() - 0.5) * 1.5;
            }
            
            // Spawn smoke puff
            smoke.push({
              x: x,
              y: y,
              vx: vx,
              vy: vy,
              r: Math.random() * 6 + 10,
              life: Math.random() * 25 + 30,
              maxLife: 60,
              growth: Math.random() * 0.18 + 0.25
            });
            
            // Spawn orange spark
            if (Math.random() < 0.45) {
              smoke.push({
                x: x,
                y: y,
                vx: vx * 1.3 + (Math.random() - 0.5) * 2.5,
                vy: vy * 1.3 + (Math.random() - 0.5) * 2.5,
                r: Math.random() * 2 + 1,
                life: Math.random() * 12 + 12,
                maxLife: 25,
                growth: -0.02,
                isSpark: true
              });
            }
          }
        }
      }
      
      lastRect = rect;
      requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function initScrollAnimations() {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("on"); obs.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".fadeUp, .slideRight, .slideLeftPop, .img-mask-reveal, .flowchart-step").forEach((el) => obs.observe(el));

    const aboutSlideObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("on");
          aboutSlideObs.unobserve(e.target);
          if (e.target.classList.contains("about-slide-left")) {
            trackSlideSmoke(e.target, "left-to-right");
          } else if (e.target.classList.contains("about-slide-right")) {
            trackSlideSmoke(e.target, "right-to-left");
          }
        }
      }),
      { threshold: 0, rootMargin: "0px 100% 0px 100%" }
    );
    document.querySelectorAll(".about-slide-left, .about-slide-right, .slideRightBorder").forEach((el) => aboutSlideObs.observe(el));
    requestAnimationFrame(() => {
      document.querySelectorAll(".page-hero .about-slide-left").forEach((el) => {
        el.classList.add("on");
        aboutSlideObs.unobserve(el);
        trackSlideSmoke(el, "left-to-right");
      });
    });

    const featGrid = document.querySelector(".feat-grid");
    const whySection = document.getElementById("why");
    if (featGrid) {
      const gridObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            if (whySection) whySection.classList.add("feat-burst");
            featGrid.querySelectorAll(".feat-pop-left, .feat-pop-up, .feat-pop-right").forEach((card) => {
              card.classList.add("on");
            });
            gridObs.unobserve(e.target);
          });
        },
        { threshold: 0.18 }
      );
      gridObs.observe(featGrid);
    }

    const faqCols = document.querySelector(".faq-cols");
    if (faqCols) {
      const faqObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            faqCols.querySelectorAll(".faq-pop-up").forEach((item) => item.classList.add("on"));
            faqObs.unobserve(e.target);
          });
        },
        { threshold: 0.15 }
      );
      faqObs.observe(faqCols);
    }
  }


  /* ── 11. SMOOTH SCROLL FOR ANCHORS ──────── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });



  /* ── 13. FEAT CARD TILT ──────────────────── */
  document.querySelectorAll(".feat-card").forEach((card) => {
    if (!card.querySelector(".feat-particle")) {
      const particle = document.createElement("span");
      particle.className = "feat-particle";
      particle.setAttribute("aria-hidden", "true");
      card.prepend(particle);
    }

    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });

  /* ── 14. MAGNETIC BUTTONS ────────────────── */
  document.querySelectorAll(".btn-p,.btn-s,.nav-cta").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.25;
      btn.style.transform = `translate(${x}px,${y}px) translateY(-2px)`;
    });
    btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
  });

  /* ── 15. VALUATION FORM SUBMIT ───────────── */
  const form = document.getElementById("valuationForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector(".btn-p");
      const orig = btn.innerHTML;
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> SUBMITTED!`;
      btn.style.background = "#22c55e";
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = "";
        form.reset();
      }, 3000);
    });
  }

  /* ── 16. SCROLL-LINKED PARALLAX & GLOW ──── */
  window.addEventListener("scroll", () => {
    const s = window.scrollY;

    // Parallax for hero content elements
    document.querySelectorAll(".parallax-element").forEach((el) => {
      const speed = parseFloat(el.dataset.speed || 0.1);
      el.style.transform = `translateY(${s * speed}px)`;
    });

    // Parallax for background video container
    const videoBg = document.querySelector(".hero-video-container");
    if (videoBg) {
      videoBg.style.transform = `translateY(${s * 0.25}px)`;
    }

    // Parallax/fade-out for glow orbs
    const orb1 = document.querySelector(".hero-glow-orb-1");
    const orb2 = document.querySelector(".hero-glow-orb-2");
    if (orb1) {
      orb1.style.transform = `translateY(${s * 0.12}px)`;
      orb1.style.opacity = Math.max(0, 0.18 - s / 1000);
    }
    if (orb2) {
      orb2.style.transform = `translateY(${s * -0.06}px)`;
      orb2.style.opacity = Math.max(0, 0.18 - s / 1000);
    }
  }, { passive: true });

  /* ── 17. HERO VIDEO FALLBACK ─────────────── */
  const vid = document.querySelector(".hero-video");
  if (vid) {
    vid.addEventListener("error", () => {
      vid.style.display = "none";
    });
  }

})();
