/* ==========================================================================
   APPLE LIQUID GLASS INTERACTION ENGINE
   Smooth gestures, cursor spotlight, filter transitions & copy utilities
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Cursor Spotlight on Glass Cards
  const glassCards = document.querySelectorAll(".glass-spotlight");

  glassCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  // 2. Project Filtering System
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Toggle active button style
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");

        if (filterValue === "all" || category.includes(filterValue)) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0) scale(1)";
          }, 10);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(10px) scale(0.98)";
          setTimeout(() => {
            card.style.display = "none";
          }, 200);
        }
      });
    });
  });

  // 3. Navigation Active State on Scroll (Intersection Observer)
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -70% 0px",
    threshold: 0,
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => navObserver.observe(section));

  // 4. One-Click Copy to Clipboard & Toast Alert
  const copyButtons = document.querySelectorAll("[data-copy]");
  const toast = document.getElementById("toastNotice");

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const textToCopy = btn.getAttribute("data-copy");
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        });
      } else {
        // Fallback
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          showToast(`Copied to clipboard: ${textToCopy}`);
        } catch (err) {
          showToast("Failed to copy");
        }
        document.body.removeChild(textArea);
      }
    });
  });

  // 5. Parallax Mouse Reaction on Ambient Glow Orbs
  window.addEventListener("mousemove", (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.02;

    const orb1 = document.querySelector(".orb-1");
    const orb2 = document.querySelector(".orb-2");

    if (orb1) orb1.style.transform = `translate(${moveX * 1.5}px, ${moveY * 1.5}px)`;
    if (orb2) orb2.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
  });

  // 6. Floating Back to Top Button (Show when scrolled > 250px)
  const backToTopBtn = document.getElementById("backToTopBtn");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 250) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // 7. Mobile Navigation Toggle Drawer
  const mobileNavToggle = document.getElementById("mobileNavToggle");
  const navLinksList = document.getElementById("navLinks");

  if (mobileNavToggle && navLinksList) {
    mobileNavToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      navLinksList.classList.toggle("active");
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!navLinksList.contains(e.target) && !mobileNavToggle.contains(e.target)) {
        navLinksList.classList.remove("active");
      }
    });

    // Close when any navigation link is clicked
    navLinksList.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navLinksList.classList.remove("active");
      });
    });
  }

  // 8. Smooth Floating Stars & Blurred Glowing Particles Engine (CodeByTushu Style)
  initSmoothStarfield();

  function initSmoothStarfield() {
    const canvas = document.getElementById("particleStarfield");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Pre-rendered offscreen sprite canvases for 60fps performance & smooth blurred glows
    function createSprites() {
      const sprites = [];

      // Sprite 0: Tiny Sharp Star (White/Warm Ivory) - 16x16
      const s0 = document.createElement("canvas");
      s0.width = 16;
      s0.height = 16;
      const c0 = s0.getContext("2d");
      const g0 = c0.createRadialGradient(8, 8, 0, 8, 8, 8);
      g0.addColorStop(0, "rgba(255, 255, 255, 1)");
      g0.addColorStop(0.25, "rgba(255, 245, 210, 0.85)");
      g0.addColorStop(0.6, "rgba(255, 230, 150, 0.2)");
      g0.addColorStop(1, "rgba(255, 230, 150, 0)");
      c0.fillStyle = g0;
      c0.beginPath();
      c0.arc(8, 8, 8, 0, Math.PI * 2);
      c0.fill();
      sprites.push({ canvas: s0, baseSize: 8, kind: "star" });

      // Sprite 1: Golden Glowing Star (Core + Amber Corona) - 48x48
      const s1 = document.createElement("canvas");
      s1.width = 48;
      s1.height = 48;
      const c1 = s1.getContext("2d");
      const g1 = c1.createRadialGradient(24, 24, 0, 24, 24, 24);
      g1.addColorStop(0, "rgba(255, 255, 255, 1)");
      g1.addColorStop(0.12, "rgba(255, 238, 170, 0.95)");
      g1.addColorStop(0.3, "rgba(255, 195, 45, 0.75)");
      g1.addColorStop(0.65, "rgba(251, 191, 36, 0.25)");
      g1.addColorStop(1, "rgba(245, 158, 11, 0)");
      c1.fillStyle = g1;
      c1.beginPath();
      c1.arc(24, 24, 24, 0, Math.PI * 2);
      c1.fill();
      sprites.push({ canvas: s1, baseSize: 18, kind: "star" });

      // Sprite 2: Vibrant Golden Luminous Star with Broad Halo - 64x64
      const s2 = document.createElement("canvas");
      s2.width = 64;
      s2.height = 64;
      const c2 = s2.getContext("2d");
      const g2 = c2.createRadialGradient(32, 32, 0, 32, 32, 32);
      g2.addColorStop(0, "rgba(255, 255, 255, 1)");
      g2.addColorStop(0.08, "rgba(255, 242, 185, 0.95)");
      g2.addColorStop(0.22, "rgba(255, 192, 40, 0.8)");
      g2.addColorStop(0.55, "rgba(245, 158, 11, 0.3)");
      g2.addColorStop(0.85, "rgba(217, 119, 6, 0.08)");
      g2.addColorStop(1, "rgba(217, 119, 6, 0)");
      c2.fillStyle = g2;
      c2.beginPath();
      c2.arc(32, 32, 32, 0, Math.PI * 2);
      c2.fill();
      sprites.push({ canvas: s2, baseSize: 26, kind: "star" });

      // Sprite 3: Soft Blurred Golden Bokeh Particle (Deep Focus Blur) - 64x64
      const s3 = document.createElement("canvas");
      s3.width = 64;
      s3.height = 64;
      const c3 = s3.getContext("2d");
      const g3 = c3.createRadialGradient(32, 32, 0, 32, 32, 32);
      g3.addColorStop(0, "rgba(255, 215, 100, 0.42)");
      g3.addColorStop(0.35, "rgba(255, 190, 60, 0.3)");
      g3.addColorStop(0.7, "rgba(245, 158, 11, 0.12)");
      g3.addColorStop(1, "rgba(245, 158, 11, 0)");
      c3.fillStyle = g3;
      c3.beginPath();
      c3.arc(32, 32, 32, 0, Math.PI * 2);
      c3.fill();
      sprites.push({ canvas: s3, baseSize: 32, kind: "bokeh" });

      // Sprite 4: Soft Blurred Ivory Bokeh Particle - 56x56
      const s4 = document.createElement("canvas");
      s4.width = 56;
      s4.height = 56;
      const c4 = s4.getContext("2d");
      const g4 = c4.createRadialGradient(28, 28, 0, 28, 28, 28);
      g4.addColorStop(0, "rgba(255, 255, 255, 0.35)");
      g4.addColorStop(0.4, "rgba(241, 245, 249, 0.22)");
      g4.addColorStop(0.75, "rgba(226, 232, 240, 0.08)");
      g4.addColorStop(1, "rgba(226, 232, 240, 0)");
      c4.fillStyle = g4;
      c4.beginPath();
      c4.arc(28, 28, 28, 0, Math.PI * 2);
      c4.fill();
      sprites.push({ canvas: s4, baseSize: 28, kind: "bokeh" });

      // Sprite 5: Cyan Starlight Star (Apple Glass theme harmony) - 48x48
      const s5 = document.createElement("canvas");
      s5.width = 48;
      s5.height = 48;
      const c5 = s5.getContext("2d");
      const g5 = c5.createRadialGradient(24, 24, 0, 24, 24, 24);
      g5.addColorStop(0, "rgba(255, 255, 255, 1)");
      g5.addColorStop(0.15, "rgba(224, 242, 254, 0.9)");
      g5.addColorStop(0.35, "rgba(56, 189, 248, 0.6)");
      g5.addColorStop(0.7, "rgba(14, 165, 233, 0.2)");
      g5.addColorStop(1, "rgba(14, 165, 233, 0)");
      c5.fillStyle = g5;
      c5.beginPath();
      c5.arc(24, 24, 24, 0, Math.PI * 2);
      c5.fill();
      sprites.push({ canvas: s5, baseSize: 18, kind: "star" });

      return sprites;
    }

    const sprites = createSprites();

    // Particle distribution weights (Warm gold & blurred bokeh dominate)
    const spriteWeights = [
      0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 1,
      2, 2, 2,
      3, 3, 3, 3,
      4, 4,
      5
    ];

    let particles = [];
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targetCount = Math.min(90, Math.max(40, Math.floor((width * height) / 22000)));

      if (particles.length === 0) {
        for (let i = 0; i < targetCount; i++) {
          particles.push(createParticle(Math.random() * width, Math.random() * height));
        }
      } else if (particles.length < targetCount) {
        while (particles.length < targetCount) {
          particles.push(createParticle(Math.random() * width, Math.random() * height));
        }
      } else if (particles.length > targetCount) {
        particles.length = targetCount;
      }
    }

    function createParticle(initialX, initialY) {
      const spriteIdx = spriteWeights[Math.floor(Math.random() * spriteWeights.length)];
      const spriteInfo = sprites[spriteIdx];

      // Subtle scale variance
      const scaleVariance = 0.65 + Math.random() * 0.6;
      const drawSize = spriteInfo.baseSize * scaleVariance;

      return {
        x: initialX,
        y: initialY,
        spriteIdx,
        drawSize,
        // Smooth gentle upward flow (-0.18 to -0.48 px/frame)
        vy: -(0.18 + Math.random() * 0.3),
        // Subtle organic sway
        vx: (Math.random() - 0.5) * 0.08,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.006 + Math.random() * 0.012,
        swayAmp: 0.4 + Math.random() * 0.8,
        // Gentle breathing twinkle
        baseAlpha: 0.45 + Math.random() * 0.5,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        pulseAmp: 0.15 + Math.random() * 0.25,
      };
    }

    // Subtle mouse tracking
    let mouseX = -1000;
    let mouseY = -1000;
    let mouseActive = false;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseActive = true;
    }, { passive: true });

    window.addEventListener("mouseleave", () => {
      mouseActive = false;
    });

    let animationFrameId = null;
    let isRunning = true;

    function render() {
      ctx.clearRect(0, 0, width, height);

      const motionFactor = prefersReducedMotion ? 0.15 : 1.0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update movement
        p.y += p.vy * motionFactor;
        p.swayPhase += p.swaySpeed * motionFactor;
        p.pulsePhase += p.pulseSpeed * motionFactor;

        let curX = p.x + Math.sin(p.swayPhase) * p.swayAmp;
        let curY = p.y;

        // Subtle gentle mouse repulsion
        if (mouseActive) {
          const dx = curX - mouseX;
          const dy = curY - mouseY;
          const distSq = dx * dx + dy * dy;
          const maxDist = 110;
          if (distSq < maxDist * maxDist && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (maxDist - dist) / maxDist;
            p.x += (dx / dist) * force * 1.0;
            p.y += (dy / dist) * force * 1.0;
            curX = p.x;
            curY = p.y;
          }
        }

        // Screen boundary wrap
        const pad = p.drawSize + 15;
        if (p.y < -pad) {
          p.y = height + pad;
          p.x = Math.random() * width;
        } else if (p.y > height + pad) {
          p.y = -pad;
          p.x = Math.random() * width;
        }
        if (p.x < -pad) {
          p.x = width + pad;
        } else if (p.x > width + pad) {
          p.x = -pad;
        }

        // Calculate breathing opacity
        const alpha = Math.max(
          0.1,
          Math.min(1.0, p.baseAlpha * (1 - p.pulseAmp + p.pulseAmp * Math.sin(p.pulsePhase)))
        );

        const sprite = sprites[p.spriteIdx].canvas;
        const halfSize = p.drawSize / 2;

        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, curX - halfSize, curY - halfSize, p.drawSize, p.drawSize);
      }

      ctx.globalAlpha = 1.0;
    }

    function loop() {
      if (!isRunning) return;
      render();
      animationFrameId = requestAnimationFrame(loop);
    }

    window.addEventListener("resize", () => {
      resize();
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        isRunning = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        if (!isRunning) {
          isRunning = true;
          animationFrameId = requestAnimationFrame(loop);
        }
      }
    });

    resize();
    loop();
  }
});
