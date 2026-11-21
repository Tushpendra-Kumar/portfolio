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
    let width = (canvas3d.width = window.innerWidth);
    let height = (canvas3d.height = window.innerHeight);

    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    let currentMode = "hourglass"; // Default to NASA Hourglass Nebula (Ref Image 1)
    let tick = 0;

    window.addEventListener("resize", () => {
      width = canvas3d.width = window.innerWidth;
      height = canvas3d.height = window.innerHeight;
      initCurrentMode();
    });

    window.addEventListener("mousemove", (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    });

    // Helper: Draw Hubble/James Webb 4-point or 6-point Diffraction Spike Star
    function drawDiffractionStar(x, y, size, color, spikeLen, alpha = 1, points = 4) {
      if (x < -50 || x > width + 50 || y < -50 || y > height + 50) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      // Core radial glow
      const g = ctx.createRadialGradient(x, y, 0, x, y, size * 2.8);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.3, color);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, size * 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Diffraction Spikes
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
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
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x - spikeLen * 0.45, y);
      ctx.lineTo(x + spikeLen * 0.45, y);
      ctx.moveTo(x, y - spikeLen * 0.45);
      ctx.lineTo(x, y + spikeLen * 0.45);
      ctx.stroke();

      ctx.restore();
    }

    // Persistent Cosmic Starfield
    let backgroundStars = [];
    function initStarfield() {
      backgroundStars = [];
      const count = Math.min(220, Math.floor(width / 7));
      const starColors = ["#ffffff", "#93c5fd", "#e0e7ff", "#fde047", "#fca5a5", "#38bdf8"];
      for (let i = 0; i < count; i++) {
        backgroundStars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.8 + 0.6,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          twinkleSpeed: Math.random() * 0.04 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
          hasSpikes: Math.random() > 0.82,
          spikeLen: Math.random() * 18 + 8
        });
      }
    }

    // 1. Hourglass Nebula State (Ref Image 1: MyCn 18)
    let hourglassDust = [];
    function initHourglass() {
      hourglassDust = [];
      const count = 120;
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const u = Math.random() * 2 - 1; // vertical coordinate
        const r = (1 + Math.abs(u) * 1.8) * (80 + Math.random() * 70);
        hourglassDust.push({
          u: u,
          angle: theta,
          dist: r,
          vAngle: (Math.random() - 0.5) * 0.008,
          size: Math.random() * 2.2 + 0.8,
          color: Math.random() > 0.4 ? "#f97316" : (Math.random() > 0.5 ? "#fb923c" : "#38bdf8")
        });
      }
    }

    // 2. Horsehead Nebula State (Ref Image 2: Barnard 33)
    let horseheadClouds = [];
    function initHorsehead() {
      horseheadClouds = [];
      for (let i = 0; i < 35; i++) {
        horseheadClouds.push({
          x: (Math.random() * 0.9 + 0.05) * width,
          y: (Math.random() * 0.7 + 0.3) * height,
          radius: Math.random() * 140 + 70,
          driftX: (Math.random() - 0.5) * 0.15,
          driftY: (Math.random() - 0.5) * 0.08,
          alpha: Math.random() * 0.45 + 0.3
        });
      }
    }

    // 3. Mystic Pillars State (Ref Image 3: Pillars of Creation)
    let pillarStars = [];
    function initPillars() {
      pillarStars = [];
      for (let i = 0; i < 16; i++) {
        pillarStars.push({
          x: width * 0.3 + (Math.random() - 0.5) * width * 0.45,
          y: height * 0.2 + Math.random() * height * 0.6,
          size: Math.random() * 3 + 1.5,
          spikeLen: Math.random() * 26 + 14,
          color: Math.random() > 0.3 ? "#fef08a" : "#f59e0b",
          pulse: Math.random() * Math.PI * 2
        });
      }
    }

    // 4. Butterfly Nebula State (Ref Image 4: NGC 6302)
    let butterflyParticles = [];
    function initButterfly() {
      butterflyParticles = [];
      const count = 160;
      for (let i = 0; i < count; i++) {
        const side = Math.random() > 0.5 ? 1 : -1;
        butterflyParticles.push({
          side: side,
          dist: Math.random() * 350 + 20,
          spreadAngle: (Math.random() - 0.5) * 1.1 + (side > 0 ? 0 : Math.PI),
          speed: Math.random() * 0.6 + 0.2,
          size: Math.random() * 2.5 + 0.8,
          color: Math.random() > 0.5 ? "#38bdf8" : (Math.random() > 0.5 ? "#c084fc" : "#2dd4bf")
        });
      }
    }

    // 5. Galaxy Spiral State
    let galaxyStars = [];
    function initGalaxy() {
      galaxyStars = [];
      const count = 300;
      for (let i = 0; i < count; i++) {
        const arm = (i % 2) * Math.PI;
        const dist = Math.pow(Math.random(), 1.5) * 360 + 15;
        const angle = arm + dist * 0.014 + (Math.random() - 0.5) * 0.4;
        galaxyStars.push({
          dist: dist,
          angle: angle,
          speed: 0.003 + (1 / (dist + 50)) * 0.3,
          size: Math.random() * 2 + 0.8,
          color: dist < 80 ? "#fef08a" : (dist < 220 ? "#93c5fd" : "#c4b5fd")
        });
      }
    }

    // 6. Stellar Nursery State
    let nurseryNodes = [];
    function initNursery() {
      nurseryNodes = [];
      for (let i = 0; i < 28; i++) {
        nurseryNodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 160 + 80,
          color: Math.random() > 0.6 ? "#06b6d4" : (Math.random() > 0.4 ? "#8b5cf6" : "#10b981")
        });
      }
    }

    // 7. Supernova Remnant State
    let supernovaFilaments = [];
    function initSupernova() {
      supernovaFilaments = [];
      const count = 48;
      for (let i = 0; i < count; i++) {
        const ang = (i / count) * Math.PI * 2;
        supernovaFilaments.push({
          ang: ang,
          len: Math.random() * 180 + 120,
          color: Math.random() > 0.5 ? "#38bdf8" : (Math.random() > 0.5 ? "#f97316" : "#e879f9"),
          waviness: Math.random() * 0.08 + 0.02
        });
      }
    }

    // 8. Event Horizon Black Hole State
    let accretionParticles = [];
    function initBlackHole() {
      accretionParticles = [];
      const count = 220;
      for (let i = 0; i < count; i++) {
        const dist = Math.random() * 220 + 85;
        accretionParticles.push({
          dist: dist,
          angle: Math.random() * Math.PI * 2,
          speed: (1 / Math.sqrt(dist)) * 1.8,
          size: Math.random() * 2.2 + 0.8,
          color: dist < 120 ? "#60a5fa" : (dist < 180 ? "#f59e0b" : "#ef4444")
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
      tick++;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Deep Space Void Base Gradient
      const baseGrad = ctx.createRadialGradient(
        width / 2 + (mouse.x - width / 2) * 0.1,
        height / 2 + (mouse.y - height / 2) * 0.1,
        100,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      baseGrad.addColorStop(0, "#080c18");
      baseGrad.addColorStop(0.5, "#04060d");
      baseGrad.addColorStop(1, "#020307");
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Twinkling Background Stars (Fixed in deep space)
      const parallaxX = (mouse.x - width / 2) * 0.03;
      const parallaxY = (mouse.y - height / 2) * 0.03;

      backgroundStars.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        const alpha = 0.4 + Math.sin(star.twinklePhase) * 0.4;
        const sx = star.x - parallaxX;
        const sy = star.y - parallaxY;

        if (star.hasSpikes && alpha > 0.6) {
          drawDiffractionStar(sx, sy, star.size, star.color, star.spikeLen * (0.8 + alpha * 0.4), alpha * 0.9, 4);
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
        // Outer concentric expanding amber rings
        const rings = [240, 190, 140, 95];
        const ringGlowGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 320);
        ringGlowGrad.addColorStop(0, "rgba(249, 115, 22, 0.2)");
        ringGlowGrad.addColorStop(0.5, "rgba(234, 88, 12, 0.08)");
        ringGlowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = ringGlowGrad;
        ctx.fillRect(0, 0, width, height);

        // Upper & Lower expanding cones
        [-1, 1].forEach((dir) => {
          rings.forEach((r, idx) => {
            const yOffset = dir * (idx * 55 + 60) + Math.sin(tick * 0.02 + idx) * 5;
            const rx = r * (1 + idx * 0.15);
            const ry = r * 0.38;

            ctx.save();
            ctx.translate(cx, cy + yOffset);
            ctx.beginPath();
            ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
            ctx.strokeStyle = idx === 0 ? "rgba(251, 146, 60, 0.75)" : "rgba(249, 115, 22, 0.55)";
            ctx.lineWidth = 2.2;
            ctx.shadowColor = "#f97316";
            ctx.shadowBlur = 18;
            ctx.stroke();
            ctx.restore();
          });
        });

        // Hourglass Stardust stream
        hourglassDust.forEach((p) => {
          p.angle += p.vAngle;
          const px = cx + Math.cos(p.angle) * p.dist;
          const py = cy + p.u * (height * 0.4) + Math.sin(tick * 0.02 + p.dist) * 15;
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fill();
        });
        ctx.shadowBlur = 0;

        // Central Cosmic Eye (Cyan / Emerald pupil with hot white star)
        const eyeGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 65);
        eyeGrad.addColorStop(0, "#ffffff");
        eyeGrad.addColorStop(0.2, "#06b6d4");
        eyeGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.6)");
        eyeGrad.addColorStop(0.85, "rgba(249, 115, 22, 0.4)");
        eyeGrad.addColorStop(1, "transparent");
        ctx.fillStyle = eyeGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 75, 42, 0, 0, Math.PI * 2);
        ctx.fill();

        // Central Pulsar with 6-point diffraction spikes
        drawDiffractionStar(cx, cy, 3.5, "#38bdf8", 45, 1, 6);
      }

      // ========================================================
      // 2. HORSEHEAD NEBULA (Ref Image 2: Barnard 33 - "Crimson Void")
      // ========================================================
      else if (currentMode === "horsehead") {
        // Dramatic Crimson H-Alpha Hydrogen Glow
        const crimsonGrad = ctx.createLinearGradient(0, 0, 0, height);
        crimsonGrad.addColorStop(0, "rgba(225, 29, 72, 0.45)");
        crimsonGrad.addColorStop(0.4, "rgba(190, 18, 60, 0.35)");
        crimsonGrad.addColorStop(0.75, "rgba(136, 19, 55, 0.2)");
        crimsonGrad.addColorStop(1, "rgba(6, 182, 212, 0.25)"); // Lower Cyan reflection base
        ctx.fillStyle = crimsonGrad;
        ctx.fillRect(0, 0, width, height);

        // Volumetric Dark Cosmic Dust Cloud Silhouettes (Barnard 33 Pillar)
        horseheadClouds.forEach((c, idx) => {
          c.x += c.driftX;
          c.y += c.driftY;
          if (c.x < -100) c.x = width + 100;
          if (c.x > width + 100) c.x = -100;

          const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.radius);
          g.addColorStop(0, "rgba(8, 6, 12, 0.85)");
          g.addColorStop(0.65, "rgba(15, 10, 20, 0.65)");
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        // Majestic Alnitak Supergiant Star (Top Left with 4-point spikes)
        drawDiffractionStar(width * 0.22, height * 0.18, 5, "#ffffff", 55, 0.95, 4);
        drawDiffractionStar(width * 0.78, height * 0.35, 4, "#93c5fd", 35, 0.85, 4);
        drawDiffractionStar(width * 0.15, height * 0.82, 4.5, "#06b6d4", 42, 0.9, 4);
      }

      // ========================================================
      // 3. MYSTIC PILLARS (Ref Image 3: Pillars of Creation)
      // ========================================================
      else if (currentMode === "pillars") {
        // Interstellar Bronze & Slate Dust Towers
        const pillarGrad = ctx.createRadialGradient(cx, cy * 0.8, 50, cx, cy, width * 0.6);
        pillarGrad.addColorStop(0, "rgba(217, 119, 6, 0.28)");
        pillarGrad.addColorStop(0.4, "rgba(180, 83, 9, 0.18)");
        pillarGrad.addColorStop(0.7, "rgba(30, 41, 59, 0.25)");
        pillarGrad.addColorStop(1, "transparent");
        ctx.fillStyle = pillarGrad;
        ctx.fillRect(0, 0, width, height);

        // Tower Columns rising from bottom
        const colWidths = [140, 180, 120];
        [-1, 0, 1].forEach((colIdx, i) => {
          const colX = cx + colIdx * 200;
          const colW = colWidths[i];
          const colGrad = ctx.createLinearGradient(colX, height, colX, height * 0.25);
          colGrad.addColorStop(0, "rgba(15, 10, 8, 0.9)");
          colGrad.addColorStop(0.4, "rgba(69, 26, 3, 0.7)");
          colGrad.addColorStop(0.75, "rgba(180, 83, 9, 0.45)");
          colGrad.addColorStop(1, "transparent");

          ctx.fillStyle = colGrad;
          ctx.beginPath();
          ctx.moveTo(colX - colW / 2, height);
          ctx.bezierCurveTo(
            colX - colW * 0.6, height * 0.6,
            colX - colW * 0.3, height * 0.4,
            colX, height * 0.22 + Math.sin(tick * 0.02 + i) * 10
          );
          ctx.bezierCurveTo(
            colX + colW * 0.3, height * 0.4,
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
        const wingGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, width * 0.55);
        wingGrad.addColorStop(0, "rgba(255, 255, 255, 0.5)");
        wingGrad.addColorStop(0.2, "rgba(6, 182, 212, 0.35)");
        wingGrad.addColorStop(0.5, "rgba(192, 132, 252, 0.25)");
        wingGrad.addColorStop(0.8, "rgba(244, 114, 182, 0.12)");
        wingGrad.addColorStop(1, "transparent");
        ctx.fillStyle = wingGrad;
        ctx.fillRect(0, 0, width, height);

        // Bilateral streaming wing particles
        butterflyParticles.forEach((p) => {
          p.dist += p.speed;
          if (p.dist > width * 0.55) p.dist = 15;
          const osc = Math.sin(tick * 0.025 + p.dist * 0.02) * 25;
          const px = cx + Math.cos(p.spreadAngle) * p.dist;
          const py = cy + Math.sin(p.spreadAngle) * p.dist * 0.65 + osc;

          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fill();
        });
        ctx.shadowBlur = 0;

        // Dark Equatorial Dust Waist
        ctx.save();
        ctx.translate(cx, cy);
        ctx.beginPath();
        ctx.ellipse(0, 0, 45, 110, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(4, 6, 12, 0.75)";
        ctx.fill();
        ctx.restore();

        // Central Dying Star with brilliant diffraction cross
        drawDiffractionStar(cx, cy, 4, "#ffffff", 48, 1, 6);
      }

      // ========================================================
      // 5. SPIRAL GALAXY (Andromeda Cosmic Nucleus)
      // ========================================================
      else if (currentMode === "galaxy") {
        // Galactic Core Warm Glow
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 95);
        coreGrad.addColorStop(0, "#ffffff");
        coreGrad.addColorStop(0.3, "#fef08a");
        coreGrad.addColorStop(0.65, "rgba(56, 189, 248, 0.4)");
        coreGrad.addColorStop(1, "transparent");
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 95, 0, Math.PI * 2);
        ctx.fill();

        // Rotating Spiral Arms
        galaxyStars.forEach((star) => {
          star.angle += star.speed;
          const rx = Math.cos(star.angle) * star.dist;
          const ry = Math.sin(star.angle) * star.dist * 0.45; // 3D tilt
          const px = cx + rx;
          const py = cy + ry;

          ctx.beginPath();
          ctx.arc(px, py, star.size, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.shadowColor = star.color;
          ctx.shadowBlur = 6;
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
          ctx.globalAlpha = 0.22;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        });

        // Trapezium Cluster in center
        [[-20, -10], [15, -18], [0, 22], [28, 12]].forEach(([ox, oy], idx) => {
          drawDiffractionStar(cx + ox, cy + oy, 3.5, "#93c5fd", 30 + idx * 4, 0.9, 4);
        });
      }

      // ========================================================
      // 7. SUPERNOVA REMNANT (Veil & Crab Filament Web)
      // ========================================================
      else if (currentMode === "supernova") {
        supernovaFilaments.forEach((f, i) => {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          const steps = 14;
          for (let s = 1; s <= steps; s++) {
            const progress = s / steps;
            const currentDist = f.len * progress + Math.sin(tick * 0.03 + i) * 15;
            const currentAng = f.ang + Math.sin(s * 0.5 + tick * 0.02) * f.waviness;
            const fx = cx + Math.cos(currentAng) * currentDist;
            const fy = cy + Math.sin(currentAng) * currentDist * 0.75;
            ctx.lineTo(fx, fy);
          }
          ctx.strokeStyle = f.color;
          ctx.lineWidth = 1.4;
          ctx.globalAlpha = 0.45;
          ctx.stroke();
          ctx.globalAlpha = 1;
        });

        // Central Pulsar with periodic relativistic flash
        const flash = (Math.sin(tick * 0.08) + 1) / 2;
        drawDiffractionStar(cx, cy, 3 + flash * 2, "#38bdf8", 35 + flash * 20, 0.8 + flash * 0.2, 6);
      }

      // ========================================================
      // 8. EVENT HORIZON BLACK HOLE (Gargantua Singularity)
      // ========================================================
      else if (currentMode === "blackhole") {
        // Gravitational Lensing Einstein Ring (Starlight halo)
        const lensGrad = ctx.createRadialGradient(cx, cy, 65, cx, cy, 140);
        lensGrad.addColorStop(0, "transparent");
        lensGrad.addColorStop(0.4, "rgba(254, 240, 138, 0.45)");
        lensGrad.addColorStop(0.7, "rgba(56, 189, 248, 0.35)");
        lensGrad.addColorStop(1, "transparent");
        ctx.fillStyle = lensGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 140, 0, Math.PI * 2);
        ctx.fill();

        // Relativistic Accretion Disk Particles
        accretionParticles.forEach((p) => {
          p.angle += p.speed;
          const rx = Math.cos(p.angle) * p.dist;
          const ry = Math.sin(p.angle) * (p.dist * 0.32); // Flattened orbital plane
          const px = cx + rx;
          const py = cy + ry;

          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fill();
        });
        ctx.shadowBlur = 0;

        // Velvet Black Event Horizon (The Singularity)
        ctx.beginPath();
        ctx.arc(cx, cy, 68, 0, Math.PI * 2);
        ctx.fillStyle = "#000000";
        ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
        ctx.shadowBlur = 30;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Thin photon sphere ring
        ctx.beginPath();
        ctx.arc(cx, cy, 70, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
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
