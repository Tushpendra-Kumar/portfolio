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

  // 8. Terminal Copy JSON Action
  const copyTermBtn = document.getElementById("copyTermJsonBtn");
  const termCodeElement = document.getElementById("termCode");

  if (copyTermBtn && termCodeElement) {
    copyTermBtn.addEventListener("click", () => {
      const cleanJson = termCodeElement.innerText;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(cleanJson).then(() => {
          showToast("Developer profile JSON copied!");
        });
      } else {
        const ta = document.createElement("textarea");
        ta.value = cleanJson;
        ta.style.position = "fixed";
        ta.style.left = "-999999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToast("Developer profile JSON copied!");
      }
    });
  }

  // 9. Spotlight Command Palette (Ctrl + K / ⌘K)
  const cmdPalette = document.getElementById("cmdPalette");
  const cmdPaletteTrigger = document.getElementById("cmdPaletteTrigger");
  const cmdInput = document.getElementById("cmdInput");
  const cmdCloseBtn = document.getElementById("cmdCloseBtn");
  const cmdItems = document.querySelectorAll(".cmd-item");
  const cmdGroupLabels = document.querySelectorAll(".cmd-group-label");

  function openCommandPalette() {
    if (!cmdPalette) return;
    cmdPalette.classList.add("open");
    if (cmdInput) {
      cmdInput.value = "";
      cmdInput.focus();
    }
    filterCommandItems("");
    setFocusedIndex(0);
  }

  function closeCommandPalette() {
    if (!cmdPalette) return;
    cmdPalette.classList.remove("open");
    if (cmdInput) cmdInput.blur();
  }

  if (cmdPaletteTrigger) {
    cmdPaletteTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      openCommandPalette();
    });
  }

  if (cmdCloseBtn) {
    cmdCloseBtn.addEventListener("click", closeCommandPalette);
  }

  if (cmdPalette) {
    cmdPalette.addEventListener("click", (e) => {
      if (e.target === cmdPalette) {
        closeCommandPalette();
      }
    });
  }

  // Global Keyboard Shortcuts (Ctrl + K / Cmd + K and ESC)
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (cmdPalette && cmdPalette.classList.contains("open")) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    } else if (e.key === "Escape") {
      closeCommandPalette();
    }
  });

  // Filter Command Palette Items Dynamically
  function filterCommandItems(query) {
    const q = query.trim().toLowerCase();
    let visibleCount = 0;

    cmdItems.forEach((item) => {
      const title = (item.getAttribute("data-title") || "").toLowerCase();
      const text = item.textContent.toLowerCase();

      if (!q || title.includes(q) || text.includes(q)) {
        item.style.display = "flex";
        visibleCount++;
      } else {
        item.style.display = "none";
      }
    });

    // Hide empty group labels if user is actively searching
    if (q.length > 0) {
      cmdGroupLabels.forEach((label) => (label.style.display = "none"));
    } else {
      cmdGroupLabels.forEach((label) => (label.style.display = "block"));
    }

    resetFocusToFirstVisible();
  }

  if (cmdInput) {
    cmdInput.addEventListener("input", (e) => {
      filterCommandItems(e.target.value);
    });

    // Keyboard Navigation within Palette (Arrow Up / Down, Enter)
    cmdInput.addEventListener("keydown", (e) => {
      const visibleItems = Array.from(cmdItems).filter(
        (item) => item.style.display !== "none"
      );

      if (visibleItems.length === 0) return;

      const currentFocusedIndex = visibleItems.findIndex((item) =>
        item.classList.contains("focused")
      );

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex =
          currentFocusedIndex < visibleItems.length - 1
            ? currentFocusedIndex + 1
            : 0;
        setFocusedIndexOnList(visibleItems, nextIndex);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex =
          currentFocusedIndex > 0
            ? currentFocusedIndex - 1
            : visibleItems.length - 1;
        setFocusedIndexOnList(visibleItems, prevIndex);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const activeItem =
          visibleItems[currentFocusedIndex >= 0 ? currentFocusedIndex : 0];
        if (activeItem) {
          activeItem.click();
        }
      }
    });
  }

  function setFocusedIndexOnList(list, index) {
    list.forEach((item) => item.classList.remove("focused"));
    if (list[index]) {
      list[index].classList.add("focused");
      list[index].scrollIntoView({ block: "nearest" });
    }
  }

  function resetFocusToFirstVisible() {
    const visibleItems = Array.from(cmdItems).filter(
      (item) => item.style.display !== "none"
    );
    cmdItems.forEach((item) => item.classList.remove("focused"));
    if (visibleItems.length > 0) {
      visibleItems[0].classList.add("focused");
    }
  }

  function setFocusedIndex(idx) {
    resetFocusToFirstVisible();
  }

  // Handle Action Item Clicks (Copy Email, Copy Phone, Anchors)
  cmdItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const action = item.getAttribute("data-action");
      if (action === "copy-email") {
        e.preventDefault();
        if (navigator.clipboard) {
          navigator.clipboard.writeText("tushpendrakumar@gmail.com");
        }
        showToast("Email copied to clipboard: tushpendrakumar@gmail.com");
        closeCommandPalette();
      } else if (action === "copy-phone") {
        e.preventDefault();
        if (navigator.clipboard) {
          navigator.clipboard.writeText("+917055072196");
        }
        showToast("Phone copied to clipboard: +91-7055072196");
        closeCommandPalette();
      } else {
        // Normal link, close palette after click
        setTimeout(closeCommandPalette, 150);
      }
    });
  });

  // 10. Live NASA Space Universe 3D Engine (8 Real-Time Deep Space Themes)
  const canvas3d = document.getElementById("bg3dCanvas");
  if (canvas3d) {
    const ctx = canvas3d.getContext("2d");
    
    // Ensure canvas styles are strictly enforced in DOM
    canvas3d.style.position = "fixed";
    canvas3d.style.top = "0";
    canvas3d.style.left = "0";
    canvas3d.style.width = "100vw";
    canvas3d.style.height = "100vh";
    canvas3d.style.zIndex = "0";
    canvas3d.style.pointerEvents = "none";
    canvas3d.style.display = "block";

    let width = (canvas3d.width = window.innerWidth);
    let height = (canvas3d.height = window.innerHeight);

    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    let currentMode = "hourglass"; // Default to NASA Hourglass Nebula (Ref Image 1)
    let tick = 0;

    console.log("🌌 NASA 3D Space Universe Engine Initializing: Default Mode =", currentMode);

    function resizeCanvas() {
      width = canvas3d.width = window.innerWidth;
      height = canvas3d.height = window.innerHeight;
      initCurrentMode();
    }
    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("mousemove", (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    });

    // Helper: Draw Hubble/James Webb 4-point or 6-point Diffraction Spike Star
    function drawDiffractionStar(x, y, size, color, spikeLen, alpha = 1, points = 4) {
      if (isNaN(x) || isNaN(y) || isNaN(size) || isNaN(spikeLen)) return;
      if (x < -80 || x > width + 80 || y < -80 || y > height + 80) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      // Core radial glow
      const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(2, size * 3));
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.35, color);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(2, size * 3), 0, Math.PI * 2);
      ctx.fill();

      // Diffraction Spikes
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x - spikeLen, y);
      ctx.lineTo(x + spikeLen, y);
      ctx.moveTo(x, y - spikeLen);
      ctx.lineTo(x, y + spikeLen);
      if (points === 6) {
        const diag = spikeLen * 0.7;
        ctx.moveTo(x - diag, y - diag);
        ctx.lineTo(x + diag, y + diag);
        ctx.moveTo(x + diag, y - diag);
        ctx.lineTo(x - diag, y + diag);
      }
      ctx.stroke();

      // Sharp white inner cross
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(x - spikeLen * 0.45, y);
      ctx.lineTo(x + spikeLen * 0.45, y);
      ctx.moveTo(x, y - spikeLen * 0.45);
      ctx.lineTo(x, y + spikeLen * 0.45);
      ctx.stroke();

      ctx.restore();
    }

    // Persistent Cosmic Starfield (Visible Across Entire Screen)
    let backgroundStars = [];
    function initStarfield() {
      backgroundStars = [];
      const count = Math.min(260, Math.floor(width / 6));
      const starColors = ["#ffffff", "#93c5fd", "#e0e7ff", "#fde047", "#fca5a5", "#38bdf8"];
      for (let i = 0; i < count; i++) {
        backgroundStars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.8,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          twinkleSpeed: Math.random() * 0.04 + 0.015,
          twinklePhase: Math.random() * Math.PI * 2,
          hasSpikes: Math.random() > 0.8,
          spikeLen: Math.random() * 22 + 10
        });
      }
    }

    // 1. Hourglass Nebula State (Ref Image 1: MyCn 18)
    let hourglassDust = [];
    function initHourglass() {
      hourglassDust = [];
      const count = 180;
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const u = Math.random() * 2 - 1; // vertical coordinate (-1 to 1)
        const r = (1 + Math.abs(u) * 2.2) * (140 + Math.random() * 180);
        hourglassDust.push({
          u: u,
          angle: theta,
          dist: r,
          vAngle: (Math.random() - 0.5) * 0.009,
          size: Math.random() * 2.6 + 1,
          color: Math.random() > 0.4 ? "#f97316" : (Math.random() > 0.5 ? "#fb923c" : "#38bdf8")
        });
      }
    }

    // 2. Horsehead Nebula State (Ref Image 2: Barnard 33)
    let horseheadClouds = [];
    function initHorsehead() {
      horseheadClouds = [];
      for (let i = 0; i < 40; i++) {
        horseheadClouds.push({
          x: Math.random() * width,
          y: (Math.random() * 0.75 + 0.25) * height,
          radius: Math.random() * 180 + 90,
          driftX: (Math.random() - 0.5) * 0.18,
          driftY: (Math.random() - 0.5) * 0.09,
          alpha: Math.random() * 0.5 + 0.35
        });
      }
    }

    // 3. Mystic Pillars State (Ref Image 3: Pillars of Creation)
    let pillarStars = [];
    function initPillars() {
      pillarStars = [];
      for (let i = 0; i < 20; i++) {
        pillarStars.push({
          x: width * 0.25 + (Math.random() - 0.5) * width * 0.6,
          y: height * 0.15 + Math.random() * height * 0.65,
          size: Math.random() * 3.5 + 1.8,
          spikeLen: Math.random() * 30 + 16,
          color: Math.random() > 0.3 ? "#fef08a" : "#f59e0b",
          pulse: Math.random() * Math.PI * 2
        });
      }
    }

    // 4. Butterfly Nebula State (Ref Image 4: NGC 6302)
    let butterflyParticles = [];
    function initButterfly() {
      butterflyParticles = [];
      const count = 220;
      for (let i = 0; i < count; i++) {
        const side = Math.random() > 0.5 ? 1 : -1;
        butterflyParticles.push({
          side: side,
          dist: Math.random() * (width * 0.55) + 30,
          spreadAngle: (Math.random() - 0.5) * 1.3 + (side > 0 ? 0 : Math.PI),
          speed: Math.random() * 0.8 + 0.3,
          size: Math.random() * 2.8 + 1,
          color: Math.random() > 0.5 ? "#38bdf8" : (Math.random() > 0.5 ? "#c084fc" : "#2dd4bf")
        });
      }
    }

    // 5. Galaxy Spiral State
    let galaxyStars = [];
    function initGalaxy() {
      galaxyStars = [];
      const count = 380;
      for (let i = 0; i < count; i++) {
        const arm = (i % 2) * Math.PI;
        const dist = Math.pow(Math.random(), 1.4) * (width * 0.45) + 20;
        const angle = arm + dist * 0.012 + (Math.random() - 0.5) * 0.4;
        galaxyStars.push({
          dist: dist,
          angle: angle,
          speed: 0.003 + (1 / (dist + 60)) * 0.35,
          size: Math.random() * 2.4 + 0.9,
          color: dist < 100 ? "#fef08a" : (dist < 260 ? "#93c5fd" : "#c4b5fd")
        });
      }
    }

    // 6. Stellar Nursery State
    let nurseryNodes = [];
    function initNursery() {
      nurseryNodes = [];
      for (let i = 0; i < 32; i++) {
        nurseryNodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 200 + 100,
          color: Math.random() > 0.6 ? "#06b6d4" : (Math.random() > 0.4 ? "#8b5cf6" : "#10b981")
        });
      }
    }

    // 7. Supernova Remnant State
    let supernovaFilaments = [];
    function initSupernova() {
      supernovaFilaments = [];
      const count = 60;
      for (let i = 0; i < count; i++) {
        const ang = (i / count) * Math.PI * 2;
        supernovaFilaments.push({
          ang: ang,
          len: Math.random() * 260 + 160,
          color: Math.random() > 0.5 ? "#38bdf8" : (Math.random() > 0.5 ? "#f97316" : "#e879f9"),
          waviness: Math.random() * 0.09 + 0.03
        });
      }
    }

    // 8. Event Horizon Black Hole State
    let accretionParticles = [];
    function initBlackHole() {
      accretionParticles = [];
      const count = 280;
      for (let i = 0; i < count; i++) {
        const dist = Math.random() * 280 + 95;
        accretionParticles.push({
          dist: dist,
          angle: Math.random() * Math.PI * 2,
          speed: (1 / Math.sqrt(dist)) * 2.0,
          size: Math.random() * 2.4 + 0.9,
          color: dist < 140 ? "#60a5fa" : (dist < 210 ? "#f59e0b" : "#ef4444")
        });
      }
    }

    function initCurrentMode() {
      initStarfield();
      if (currentMode === "hourglass") initHourglass();
      else if (currentMode === "horsehead") initHorsehead();
      else if (currentMode === "pillars") initPillars();
      else if (currentMode === "butterfly") initButterfly();
      else if (currentMode === "galaxy") initGalaxy();
      else if (currentMode === "nursery") initNursery();
      else if (currentMode === "supernova") initSupernova();
      else if (currentMode === "blackhole") initBlackHole();
    }

    initCurrentMode();

    // MAIN 60 FPS RENDER LOOP
    function renderLoop() {
      try {
        tick++;
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        ctx.clearRect(0, 0, width, height);

        // Deep Space Void Base Gradient (Velvet Cosmic Black)
        const baseGrad = ctx.createRadialGradient(
          width / 2 + (mouse.x - width / 2) * 0.1,
          height / 2 + (mouse.y - height / 2) * 0.1,
          80,
          width / 2,
          height / 2,
          Math.max(width, height) * 0.85
        );
        baseGrad.addColorStop(0, "#070b16");
        baseGrad.addColorStop(0.5, "#03050c");
        baseGrad.addColorStop(1, "#010206");
        ctx.fillStyle = baseGrad;
        ctx.fillRect(0, 0, width, height);

        // Twinkling Background Stars (Fixed in deep space)
        const parallaxX = (mouse.x - width / 2) * 0.025;
        const parallaxY = (mouse.y - height / 2) * 0.025;

        backgroundStars.forEach((star) => {
          star.twinklePhase += star.twinkleSpeed;
          const alpha = 0.45 + Math.sin(star.twinklePhase) * 0.45;
          const sx = star.x - parallaxX;
          const sy = star.y - parallaxY;

          if (star.hasSpikes && alpha > 0.6) {
            drawDiffractionStar(sx, sy, star.size, star.color, star.spikeLen * (0.8 + alpha * 0.4), alpha * 0.95, 4);
          } else {
            ctx.beginPath();
            ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        });

        const cx = width / 2 + (mouse.x - width / 2) * 0.08;
        const cy = height / 2 + (mouse.y - height / 2) * 0.08;

        // ========================================================
        // 1. HOURGLASS NEBULA (Ref Image 1: MyCn 18 - "Cosmic Eye")
        // ========================================================
        if (currentMode === "hourglass") {
          // Broad Luminous Amber/Orange Nebula Glow (Wide & Expansive)
          const ringGlowGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, width * 0.55);
          ringGlowGrad.addColorStop(0, "rgba(249, 115, 22, 0.28)");
          ringGlowGrad.addColorStop(0.35, "rgba(234, 88, 12, 0.15)");
          ringGlowGrad.addColorStop(0.7, "rgba(251, 146, 60, 0.06)");
          ringGlowGrad.addColorStop(1, "transparent");
          ctx.fillStyle = ringGlowGrad;
          ctx.fillRect(0, 0, width, height);

          // Expansive Concentric Expanding Amber Rings (Spanning wide across viewport)
          const rings = [520, 410, 310, 220, 130];
          [-1, 1].forEach((dir) => {
            rings.forEach((r, idx) => {
              const yOffset = dir * (idx * 65 + 75) + Math.sin(tick * 0.02 + idx) * 6;
              const rx = r * (1 + idx * 0.12);
              const ry = r * 0.36;

              ctx.save();
              ctx.translate(cx, cy + yOffset);
              ctx.beginPath();
              ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
              ctx.strokeStyle = idx === 0 ? "rgba(251, 146, 60, 0.85)" : "rgba(249, 115, 22, 0.65)";
              ctx.lineWidth = 2.4;
              ctx.shadowColor = "#f97316";
              ctx.shadowBlur = 20;
              ctx.stroke();
              ctx.restore();
            });
          });

          // Hourglass Stardust Stream
          hourglassDust.forEach((p) => {
            p.angle += p.vAngle;
            const px = cx + Math.cos(p.angle) * p.dist;
            const py = cy + p.u * (height * 0.45) + Math.sin(tick * 0.02 + p.dist) * 16;
            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.fill();
          });
          ctx.shadowBlur = 0;

          // Central Cosmic Eye (Cyan / Emerald pupil with brilliant white star core)
          const eyeGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 110);
          eyeGrad.addColorStop(0, "#ffffff");
          eyeGrad.addColorStop(0.2, "#06b6d4");
          eyeGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.65)");
          eyeGrad.addColorStop(0.8, "rgba(249, 115, 22, 0.45)");
          eyeGrad.addColorStop(1, "transparent");
          ctx.fillStyle = eyeGrad;
          ctx.beginPath();
          ctx.ellipse(cx, cy, 115, 62, 0, 0, Math.PI * 2);
          ctx.fill();

          // Central Pulsar with 6-point diffraction spikes
          drawDiffractionStar(cx, cy, 4.5, "#38bdf8", 55, 1, 6);
        }

        // ========================================================
        // 2. HORSEHEAD NEBULA (Ref Image 2: Barnard 33 - "Crimson Void")
        // ========================================================
        else if (currentMode === "horsehead") {
          // Dramatic Full-Screen Crimson H-Alpha Hydrogen Glow
          const crimsonGrad = ctx.createLinearGradient(0, 0, 0, height);
          crimsonGrad.addColorStop(0, "rgba(225, 29, 72, 0.55)");
          crimsonGrad.addColorStop(0.4, "rgba(190, 18, 60, 0.42)");
          crimsonGrad.addColorStop(0.75, "rgba(136, 19, 55, 0.28)");
          crimsonGrad.addColorStop(1, "rgba(6, 182, 212, 0.32)"); // Lower Cyan reflection base
          ctx.fillStyle = crimsonGrad;
          ctx.fillRect(0, 0, width, height);

          // Volumetric Dark Cosmic Dust Cloud Silhouettes (Barnard 33 Pillars)
          horseheadClouds.forEach((c) => {
            c.x += c.driftX;
            c.y += c.driftY;
            if (c.x < -120) c.x = width + 120;
            if (c.x > width + 120) c.x = -120;

            const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.radius);
            g.addColorStop(0, "rgba(8, 6, 12, 0.9)");
            g.addColorStop(0.65, "rgba(15, 10, 20, 0.7)");
            g.addColorStop(1, "transparent");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
            ctx.fill();
          });

          // Bright Alnitak Supergiant Star (Top Left with 4-point spikes)
          drawDiffractionStar(width * 0.18, height * 0.16, 5.5, "#ffffff", 60, 1, 4);
          drawDiffractionStar(width * 0.82, height * 0.32, 4.5, "#93c5fd", 42, 0.9, 4);
          drawDiffractionStar(width * 0.12, height * 0.85, 5, "#06b6d4", 48, 0.95, 4);
        }

        // ========================================================
        // 3. MYSTIC PILLARS (Ref Image 3: Pillars of Creation)
        // ========================================================
        else if (currentMode === "pillars") {
          // Volumetric Bronze & Golden Dust Lighting
          const pillarGrad = ctx.createRadialGradient(cx, cy * 0.8, 60, cx, cy, width * 0.65);
          pillarGrad.addColorStop(0, "rgba(217, 119, 6, 0.35)");
          pillarGrad.addColorStop(0.4, "rgba(180, 83, 9, 0.22)");
          pillarGrad.addColorStop(0.7, "rgba(30, 41, 59, 0.3)");
          pillarGrad.addColorStop(1, "transparent");
          ctx.fillStyle = pillarGrad;
          ctx.fillRect(0, 0, width, height);

          // Giant Dust Columns rising from bottom
          const colWidths = [190, 240, 170];
          [-1, 0, 1].forEach((colIdx, i) => {
            const colX = cx + colIdx * 250;
            const colW = colWidths[i];
            const colGrad = ctx.createLinearGradient(colX, height, colX, height * 0.22);
            colGrad.addColorStop(0, "rgba(14, 9, 7, 0.95)");
            colGrad.addColorStop(0.4, "rgba(69, 26, 3, 0.75)");
            colGrad.addColorStop(0.75, "rgba(180, 83, 9, 0.5)");
            colGrad.addColorStop(1, "transparent");

            ctx.fillStyle = colGrad;
            ctx.beginPath();
            ctx.moveTo(colX - colW / 2, height);
            ctx.bezierCurveTo(
              colX - colW * 0.6, height * 0.6,
              colX - colW * 0.3, height * 0.38,
              colX, height * 0.2 + Math.sin(tick * 0.02 + i) * 12
            );
            ctx.bezierCurveTo(
              colX + colW * 0.3, height * 0.38,
              colX + colW * 0.6, height * 0.6,
              colX + colW / 2, height
            );
            ctx.fill();
          });

          // Protostars bursting through dust crests
          pillarStars.forEach((star) => {
            star.pulse += 0.03;
            const a = 0.7 + Math.sin(star.pulse) * 0.3;
            drawDiffractionStar(star.x, star.y, star.size, star.color, star.spikeLen * a, a, 6);
          });
        }

        // ========================================================
        // 4. BUTTERFLY NEBULA (Ref Image 4: NGC 6302 - "Twin Jet Wings")
        // ========================================================
        else if (currentMode === "butterfly") {
          // Supersonic Bilateral Wings (Turquoise, Cyan & Lavender)
          const wingGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, width * 0.6);
          wingGrad.addColorStop(0, "rgba(255, 255, 255, 0.6)");
          wingGrad.addColorStop(0.25, "rgba(6, 182, 212, 0.42)");
          wingGrad.addColorStop(0.55, "rgba(192, 132, 252, 0.3)");
          wingGrad.addColorStop(0.85, "rgba(244, 114, 182, 0.15)");
          wingGrad.addColorStop(1, "transparent");
          ctx.fillStyle = wingGrad;
          ctx.fillRect(0, 0, width, height);

          // Bilateral streaming wing particles
          butterflyParticles.forEach((p) => {
            p.dist += p.speed;
            if (p.dist > width * 0.6) p.dist = 20;
            const osc = Math.sin(tick * 0.025 + p.dist * 0.02) * 30;
            const px = cx + Math.cos(p.spreadAngle) * p.dist;
            const py = cy + Math.sin(p.spreadAngle) * p.dist * 0.65 + osc;

            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 12;
            ctx.fill();
          });
          ctx.shadowBlur = 0;

          // Dark Equatorial Dust Waist
          ctx.save();
          ctx.translate(cx, cy);
          ctx.beginPath();
          ctx.ellipse(0, 0, 55, 130, 0, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(4, 6, 12, 0.85)";
          ctx.fill();
          ctx.restore();

          // Central Dying Star with brilliant diffraction cross
          drawDiffractionStar(cx, cy, 4.8, "#ffffff", 55, 1, 6);
        }

        // ========================================================
        // 5. SPIRAL GALAXY (Andromeda Cosmic Nucleus)
        // ========================================================
        else if (currentMode === "galaxy") {
          const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 130);
          coreGrad.addColorStop(0, "#ffffff");
          coreGrad.addColorStop(0.35, "#fef08a");
          coreGrad.addColorStop(0.7, "rgba(56, 189, 248, 0.45)");
          coreGrad.addColorStop(1, "transparent");
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, 130, 0, Math.PI * 2);
          ctx.fill();

          galaxyStars.forEach((star) => {
            star.angle += star.speed;
            const rx = Math.cos(star.angle) * star.dist;
            const ry = Math.sin(star.angle) * star.dist * 0.45;
            const px = cx + rx;
            const py = cy + ry;

            ctx.beginPath();
            ctx.arc(px, py, star.size, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.shadowColor = star.color;
            ctx.shadowBlur = 8;
            ctx.fill();
          });
          ctx.shadowBlur = 0;
        }

        // ========================================================
        // 6. STELLAR NURSERY (Orion Multi-Spectral Nebula)
        // ========================================================
        else if (currentMode === "nursery") {
          nurseryNodes.forEach((node) => {
            node.x += node.vx;
            node.y += node.vy;
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;

            const g = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r);
            g.addColorStop(0, node.color);
            g.addColorStop(0.7, "rgba(4, 6, 14, 0.05)");
            g.addColorStop(1, "transparent");
            ctx.fillStyle = g;
            ctx.globalAlpha = 0.28;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          });

          // Trapezium Cluster in center
          [[-30, -15], [20, -25], [0, 28], [35, 18]].forEach(([ox, oy], idx) => {
            drawDiffractionStar(cx + ox, cy + oy, 4, "#93c5fd", 38 + idx * 5, 0.95, 4);
          });
        }

        // ========================================================
        // 7. SUPERNOVA REMNANT (Veil & Crab Filament Web)
        // ========================================================
        else if (currentMode === "supernova") {
          supernovaFilaments.forEach((f, i) => {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            const steps = 16;
            for (let s = 1; s <= steps; s++) {
              const progress = s / steps;
              const currentDist = f.len * progress + Math.sin(tick * 0.03 + i) * 18;
              const currentAng = f.ang + Math.sin(s * 0.5 + tick * 0.02) * f.waviness;
              const fx = cx + Math.cos(currentAng) * currentDist;
              const fy = cy + Math.sin(currentAng) * currentDist * 0.75;
              ctx.lineTo(fx, fy);
            }
            ctx.strokeStyle = f.color;
            ctx.lineWidth = 1.6;
            ctx.globalAlpha = 0.55;
            ctx.stroke();
            ctx.globalAlpha = 1;
          });

          const flash = (Math.sin(tick * 0.08) + 1) / 2;
          drawDiffractionStar(cx, cy, 3.5 + flash * 2, "#38bdf8", 45 + flash * 25, 0.85 + flash * 0.15, 6);
        }

        // ========================================================
        // 8. EVENT HORIZON BLACK HOLE (Gargantua Singularity)
        // ========================================================
        else if (currentMode === "blackhole") {
          const lensGrad = ctx.createRadialGradient(cx, cy, 75, cx, cy, 180);
          lensGrad.addColorStop(0, "transparent");
          lensGrad.addColorStop(0.4, "rgba(254, 240, 138, 0.5)");
          lensGrad.addColorStop(0.7, "rgba(56, 189, 248, 0.4)");
          lensGrad.addColorStop(1, "transparent");
          ctx.fillStyle = lensGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, 180, 0, Math.PI * 2);
          ctx.fill();

          accretionParticles.forEach((p) => {
            p.angle += p.speed;
            const rx = Math.cos(p.angle) * p.dist;
            const ry = Math.sin(p.angle) * (p.dist * 0.32);
            const px = cx + rx;
            const py = cy + ry;

            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.fill();
          });
          ctx.shadowBlur = 0;

          // Event Horizon (Velvet Singularity)
          ctx.beginPath();
          ctx.arc(cx, cy, 78, 0, Math.PI * 2);
          ctx.fillStyle = "#000000";
          ctx.shadowColor = "rgba(0, 0, 0, 0.98)";
          ctx.shadowBlur = 35;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Thin photon sphere ring
          ctx.beginPath();
          ctx.arc(cx, cy, 80, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
      } catch (err) {
        console.error("Canvas render error:", err);
      }

      requestAnimationFrame(renderLoop);
    }

    renderLoop();

    // Switcher Buttons Click Handler
    const switcherBtns = document.querySelectorAll(".switcher-btn");
    switcherBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        switcherBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentMode = btn.getAttribute("data-mode");
        initCurrentMode();
        console.log("✨ Active Space Theme Switched to:", currentMode);
        showToast(`Active Space Theme: ${btn.textContent}`);
      });
    });

    // Minimize / Expand Switcher Dock
    const switcherToggleBtn = document.getElementById("switcherToggleBtn");
    const switcherDock = document.getElementById("themeSwitcherDock");
    if (switcherToggleBtn && switcherDock) {
      switcherToggleBtn.addEventListener("click", () => {
        switcherDock.classList.toggle("minimized");
        switcherToggleBtn.innerHTML = switcherDock.classList.contains("minimized") ? "+" : "&minus;";
      });
    }
  }
});
