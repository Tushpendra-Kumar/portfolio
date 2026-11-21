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
});
