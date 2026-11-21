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

  // 10. Live 3D Background Engine with 8 Real-Time Switchable Modes
  const canvas3d = document.getElementById("bg3dCanvas");
  if (canvas3d) {
    const ctx = canvas3d.getContext("2d");
    let width = (canvas3d.width = window.innerWidth);
    let height = (canvas3d.height = window.innerHeight);

    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    let currentMode = "cosmic"; // Default mode

    window.addEventListener("resize", () => {
      width = canvas3d.width = window.innerWidth;
      height = canvas3d.height = window.innerHeight;
      initCurrentMode();
    });

    window.addEventListener("mousemove", (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    });

    // 1. Cosmic Mode State
    let stars = [];
    function initCosmic() {
      stars = [];
      const numStars = Math.min(160, Math.floor(width / 10));
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: (Math.random() - 0.5) * width * 1.8,
          y: (Math.random() - 0.5) * height * 1.8,
          z: Math.random() * 1000 + 100,
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.4 ? "#38bdf8" : (Math.random() > 0.5 ? "#a855f7" : "#34d399"),
          speed: Math.random() * 1.2 + 0.5
        });
      }
    }

    // 2. Neural Net State
    let nodes = [];
    function initNeural() {
      nodes = [];
      const numNodes = Math.min(65, Math.floor(width / 24));
      for (let i = 0; i < numNodes; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 2.5 + 1.5,
          color: Math.random() > 0.5 ? "rgba(56, 189, 248, " : "rgba(168, 85, 247, "
        });
      }
    }

    // 3. Gyroscope Rings State
    let gyroAngle = 0;

    // 4. Cyber Grid State
    let gridOffset = 0;

    // 5. 3D Crystals State
    let crystals = [];
    function initCrystals() {
      crystals = [];
      const numCrystals = 7;
      for (let i = 0; i < numCrystals; i++) {
        crystals.push({
          x: (Math.random() - 0.5) * width * 0.9 + width / 2,
          y: (Math.random() - 0.5) * height * 0.9 + height / 2,
          size: Math.random() * 35 + 25,
          rotX: Math.random() * Math.PI,
          rotY: Math.random() * Math.PI,
          rotZ: Math.random() * Math.PI,
          vRotX: (Math.random() - 0.5) * 0.015,
          vRotY: (Math.random() - 0.5) * 0.015,
          color: Math.random() > 0.5 ? "#38bdf8" : "#818cf8"
        });
      }
    }

    // 6. Particle Wave State
    let waveStep = 0;

    // 7. Matrix State
    let matrixCols = [];
    function initMatrix() {
      matrixCols = [];
      const colWidth = 24;
      const count = Math.floor(width / colWidth);
      for (let i = 0; i < count; i++) {
        matrixCols.push({
          x: i * colWidth,
          y: Math.random() * -height,
          speed: Math.random() * 4 + 2,
          chars: "0101101001<>{}[]/=".split("")
        });
      }
    }

    // 8. Aurora Liquid State
    let auroraTick = 0;

    function initCurrentMode() {
      if (currentMode === "cosmic") initCosmic();
      else if (currentMode === "neural") initNeural();
      else if (currentMode === "crystals") initCrystals();
      else if (currentMode === "matrix") initMatrix();
    }

    initCosmic();

    // Main 60 FPS Render Loop
    function renderLoop() {
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const fov = 400;

      if (currentMode === "cosmic") {
        // Mode 1: 3D Cosmic Space
        const offsetX = (mouse.x - width / 2) * 0.2;
        const offsetY = (mouse.y - height / 2) * 0.2;

        stars.forEach((star) => {
          star.z -= star.speed;
          if (star.z <= 0) star.z = 1000;

          const k = fov / star.z;
          const sx = (star.x - offsetX) * k + width / 2;
          const sy = (star.y - offsetY) * k + height / 2;

          if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
            const alpha = Math.min(1, (1000 - star.z) / 400);
            const r = Math.max(0.8, (1 - star.z / 1000) * star.size * 2.5);

            ctx.beginPath();
            ctx.arc(sx, sy, r, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = alpha * 0.85;
            ctx.shadowBlur = 8;
            ctx.shadowColor = star.color;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
          }
        });
      } else if (currentMode === "neural") {
        // Mode 2: AI Neural Synapse Network
        nodes.forEach((node) => {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;

          // Mouse attraction
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            node.x += (dx / dist) * 1.5;
            node.y += (dy / dist) * 1.5;
          }
        });

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
            if (d < 130) {
              const alpha = (1 - d / 130) * 0.45;
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }

        // Draw nodes
        nodes.forEach((node) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = node.color + "0.85)";
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#38bdf8";
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      } else if (currentMode === "gyroscope") {
        // Mode 3: Quantum Gyroscope Rings
        gyroAngle += 0.015;
        const cx = width / 2 + (mouse.x - width / 2) * 0.15;
        const cy = height / 2 + (mouse.y - height / 2) * 0.15;
        const ringRadii = [180, 140, 100, 60];

        ringRadii.forEach((r, idx) => {
          const speedFactor = (idx + 1) * 0.8;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(gyroAngle * (idx % 2 === 0 ? 1 : -1) * 0.5);

          ctx.beginPath();
          ctx.ellipse(0, 0, r, r * Math.abs(Math.cos(gyroAngle * speedFactor)), gyroAngle * 0.7, 0, Math.PI * 2);
          ctx.strokeStyle = idx % 2 === 0 ? "rgba(56, 189, 248, 0.45)" : "rgba(168, 85, 247, 0.45)";
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 12;
          ctx.shadowColor = idx % 2 === 0 ? "#38bdf8" : "#c084fc";
          ctx.stroke();
          ctx.restore();
        });

        // Glowing Core
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.shadowBlur = 24;
        ctx.shadowColor = "#38bdf8";
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (currentMode === "grid") {
        // Mode 4: Cybernetic Wireframe Grid
        gridOffset = (gridOffset + 1.2) % 40;
        const horizon = height * 0.55;
        const gridW = width * 1.5;
        const perspective = 300;

        ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
        ctx.lineWidth = 1;

        // Vertical converging lines
        const linesCount = 24;
        for (let i = -linesCount / 2; i <= linesCount / 2; i++) {
          const xBottom = width / 2 + i * (gridW / linesCount);
          ctx.beginPath();
          ctx.moveTo(width / 2 + (mouse.x - width / 2) * 0.2, horizon);
          ctx.lineTo(xBottom, height);
          ctx.stroke();
        }

        // Horizontal moving lines
        for (let z = 0; z < 500; z += 40) {
          const adjustedZ = (z + gridOffset) % 500;
          const k = perspective / (perspective + adjustedZ);
          const y = horizon + (height - horizon) * (1 - k);
          const alpha = (1 - adjustedZ / 500) * 0.4;
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else if (currentMode === "crystals") {
        // Mode 5: 3D Floating Crystals (Polyhedra)
        crystals.forEach((c) => {
          c.rotX += c.vRotX;
          c.rotY += c.vRotY;

          // Wireframe Octahedron vertices
          const s = c.size;
          const verts = [
            { x: 0, y: -s, z: 0 },
            { x: s, y: 0, z: 0 },
            { x: 0, y: 0, z: s },
            { x: -s, y: 0, z: 0 },
            { x: 0, y: 0, z: -s },
            { x: 0, y: s, z: 0 }
          ];

          // 3D rotation
          const proj = verts.map((v) => {
            let y1 = v.y * Math.cos(c.rotX) - v.z * Math.sin(c.rotX);
            let z1 = v.y * Math.sin(c.rotX) + v.z * Math.cos(c.rotX);
            let x2 = v.x * Math.cos(c.rotY) + z1 * Math.sin(c.rotY);
            let z2 = -v.x * Math.sin(c.rotY) + z1 * Math.cos(c.rotY);
            return { x: c.x + x2, y: c.y + y1 };
          });

          const edges = [
            [0, 1], [0, 2], [0, 3], [0, 4],
            [5, 1], [5, 2], [5, 3], [5, 4],
            [1, 2], [2, 3], [3, 4], [4, 1]
          ];

          ctx.strokeStyle = c.color;
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = 0.45;
          ctx.beginPath();
          edges.forEach(([p1, p2]) => {
            ctx.moveTo(proj[p1].x, proj[p1].y);
            ctx.lineTo(proj[p2].x, proj[p2].y);
          });
          ctx.stroke();
          ctx.globalAlpha = 1;
        });
      } else if (currentMode === "wave") {
        // Mode 6: Fluid 3D Particle Wave Ribbon
        waveStep += 0.025;
        const points = 70;
        const spacing = width / points;

        for (let row = 0; row < 3; row++) {
          ctx.beginPath();
          ctx.strokeStyle = row === 0 ? "rgba(56, 189, 248, 0.4)" : (row === 1 ? "rgba(168, 85, 247, 0.35)" : "rgba(52, 211, 153, 0.3)");
          ctx.lineWidth = 2;

          for (let i = 0; i <= points; i++) {
            const x = i * spacing;
            const y = height * 0.5 + Math.sin(i * 0.15 + waveStep + row * 1.2) * 60 + Math.cos(i * 0.08 - waveStep) * 40 + (mouse.y - height / 2) * 0.15;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else if (currentMode === "matrix") {
        // Mode 7: Cyber Matrix Stream
        ctx.fillStyle = "rgba(56, 189, 248, 0.65)";
        ctx.font = "12px monospace";
        matrixCols.forEach((col) => {
          col.y += col.speed;
          if (col.y > height) col.y = -50;
          const char = col.chars[Math.floor(Math.random() * col.chars.length)];
          ctx.fillText(char, col.x, col.y);
        });
      } else if (currentMode === "aurora") {
        // Mode 8: Apple Aurora Liquid
        auroraTick += 0.015;
        const grad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          50,
          width / 2 + Math.sin(auroraTick) * 200,
          height / 2 + Math.cos(auroraTick) * 150,
          width * 0.6
        );
        grad.addColorStop(0, "rgba(56, 189, 248, 0.18)");
        grad.addColorStop(0.5, "rgba(168, 85, 247, 0.12)");
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
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
        showToast(`Active 3D Theme: ${btn.textContent}`);
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
