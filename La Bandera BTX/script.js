/* ==========================================================================
   LA BANDERA BTX — INTERACTIVE & BILINGUAL ENGINE
   ========================================================================== */

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. STATE INITIALIZATION
  let currentLang = localStorage.getItem("laBanderaLang") || "en";
  let showParchment = localStorage.getItem("laBanderaParchment") !== "false"; // default true
  
  // Apply initial theme classes
  if (!showParchment) {
    document.body.classList.add("no-parchment");
    const pToggle = document.getElementById("parchmentToggle");
    if (pToggle) pToggle.classList.add("active");
  }
  
  // Set copyright year dynamically
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // Initialize Lucide Icons
  lucide.createIcons();

  // 2. LANGUAGE ENGINE
  const langSwitcher = document.getElementById("langSwitcher");
  const optEn = document.getElementById("lang-en");
  const optEs = document.getElementById("lang-es");

  function translatePage(lang) {
    document.querySelectorAll("[data-en]").forEach(el => {
      const translation = lang === "en" ? el.getAttribute("data-en") : el.getAttribute("data-es");
      // Use innerHTML to preserve formatted tags inside if necessary
      el.innerHTML = translation;
    });

    // Toggle switcher classes
    if (lang === "en") {
      optEn.classList.add("active");
      optEs.classList.remove("active");
      document.body.classList.remove("lang-es");
      document.body.classList.add("lang-en");
    } else {
      optEn.classList.remove("active");
      optEs.classList.add("active");
      document.body.classList.remove("lang-en");
      document.body.classList.add("lang-es");
    }

    currentLang = lang;
    localStorage.setItem("laBanderaLang", lang);
    
    // Refresh ScrollTrigger because heights might have shifted slightly due to text translations
    ScrollTrigger.refresh();
  }

  // Set initial language
  translatePage(currentLang);

  // Language switch listeners
  langSwitcher.addEventListener("click", () => {
    const nextLang = currentLang === "en" ? "es" : "en";
    translatePage(nextLang);
  });

  // 3. PARCHMENT GRID THEME TOGGLER
  const parchmentToggle = document.getElementById("parchmentToggle");
  if (parchmentToggle) {
    parchmentToggle.addEventListener("click", () => {
      document.body.classList.toggle("no-parchment");
      const isDeactivated = document.body.classList.contains("no-parchment");
      localStorage.setItem("laBanderaParchment", (!isDeactivated).toString());
      
      if (isDeactivated) {
        parchmentToggle.classList.add("active");
      } else {
        parchmentToggle.classList.remove("active");
      }
    });
  }

  // 4. MOBILE MENU OVERLAY
  const mobileMenuTrigger = document.getElementById("mobileMenuTrigger");
  const mobileNavMenu = document.getElementById("mobileNavMenu");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-item, .mobile-btn-cta");

  mobileMenuTrigger.addEventListener("click", () => {
    mobileMenuTrigger.classList.toggle("active");
    mobileNavMenu.classList.toggle("open");
    
    // Animate hamburger lines
    const spans = mobileMenuTrigger.querySelectorAll("span");
    if (mobileMenuTrigger.classList.contains("active")) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translate(6px, -6px)";
    } else {
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    }
  });

  // Close mobile nav when clicking a link
  mobileNavLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenuTrigger.classList.remove("active");
      mobileNavMenu.classList.remove("open");
      mobileMenuTrigger.querySelectorAll("span").forEach(s => s.style.transform = "none");
      mobileMenuTrigger.querySelector("span:nth-child(2)").style.opacity = "1";
    });
  });

  // 5. CUSTOM CURSOR
  const cursor = document.getElementById("customCursor");
  const cursorDot = document.getElementById("customCursorDot");

  document.addEventListener("mousemove", (e) => {
    // Center alignment offsets
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
    gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.02 });
  });

  // Cursor hover effects
  const hoverElements = document.querySelectorAll("a, button, .menu-card, .lang-switcher, .interactive-stamp-area");
  hoverElements.forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("hovered");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("hovered");
    });
  });

  // Hide cursor when leaving window
  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = 0;
    cursorDot.style.opacity = 0;
  });
  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = 1;
    cursorDot.style.opacity = 1;
  });

  // 6. DETECT & HIGHLIGHT TODAY'S OPERATING HOURS
  const dayElements = {
    0: "day-sun",
    1: "day-mon",
    2: "day-tue",
    3: "day-wed",
    4: "day-thu",
    5: "day-fri",
    6: "day-sat"
  };
  const currentDayIndex = new Date().getDay();
  const todayElementId = dayElements[currentDayIndex];
  const todayRow = document.getElementById(todayElementId);
  if (todayRow) {
    todayRow.classList.add("active-day");
    
    // Add "Today" tag in correct language
    const tag = document.createElement("span");
    tag.style.fontSize = "0.75rem";
    tag.style.backgroundColor = "var(--red)";
    tag.style.color = "var(--white)";
    tag.style.padding = "0.15rem 0.5rem";
    tag.style.borderRadius = "3px";
    tag.style.marginLeft = "0.75rem";
    tag.style.fontFamily = "var(--font-headings)";
    tag.style.fontWeight = "800";
    tag.setAttribute("data-en", "TODAY");
    tag.setAttribute("data-es", "HOY");
    tag.textContent = currentLang === "en" ? "TODAY" : "HOY";
    
    todayRow.querySelector(".day-name").appendChild(tag);
  }

  // 7. GSAP SCROLL ANIMATIONS (DESKTOP HORIZONTAL SCROLL)
  let scrollTween;

  function initHorizontalScroll() {
    const track = document.getElementById("horizontalScrollTrack");
    const container = document.getElementById("horizontalScrollContainer");
    
    // Clear any previous tween
    if (scrollTween) {
      scrollTween.scrollTrigger.kill();
      scrollTween.kill();
    }
    
    if (window.innerWidth >= 1024) {
      // Calculate how far horizontally the track needs to slide
      const scrollAmt = track.scrollWidth - window.innerWidth;
      
      scrollTween = gsap.to(track, {
        x: -scrollAmt,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 0.8,
          start: "top top",
          end: () => `+=${scrollAmt}`,
          invalidateOnRefresh: true,
        }
      });
    } else {
      // Mobile styling handles horizontal scroll natively via CSS, reset GSAP transform
      gsap.set(track, { clearProps: "transform" });
    }
  }

  // Initialize and handle resize
  initHorizontalScroll();
  window.addEventListener("resize", () => {
    initHorizontalScroll();
    ScrollTrigger.refresh();
  });

  // Navbar background change on scroll
  const navbar = document.getElementById("mainNavbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Subtle Parallax on Hero and About image
  gsap.to(".parallax-img", {
    yPercent: 12,
    ease: "none",
    scrollTrigger: {
      trigger: "#aboutImgWrapper",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });

  // Entry Reveals
  gsap.from(".hero-title .word-reveal", {
    y: 80,
    opacity: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: "power4.out"
  });

  gsap.from(".hero-subtitle, .hero-buttons", {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.6,
    stagger: 0.2,
    ease: "power3.out"
  });

  // Fade out scroll indicator on scroll past ticker banner
  gsap.to(".scroll-indicator", {
    opacity: 0,
    y: -30,
    scrollTrigger: {
      trigger: "#tickerBanner",
      start: "top bottom",
      end: "top center",
      scrub: true
    }
  });

  // 8. INTERACTIVE PARCHMENT STAMP CANVAS
  const stampArea = document.getElementById("stampArea");
  const clearStampsBtn = document.getElementById("clearStampsBtn");

  const slogans = [
    { text: "956", type: "serif" },
    { text: "ESTILO TIJUANA", type: "serif" },
    { text: "BIRRIA DE RES", type: "serif" },
    { text: "QUESABIRRIAS", type: "serif" },
    { text: "TACOS", type: "serif" },
    { text: "BURRITOS", type: "serif" },
    { text: "LA BANDERA BTX", type: "serif" },
    { text: "Agua Fresca", type: "cursive" },
    { text: "DELICIOSO!", type: "cursive" },
    { text: "IN-HOUSE MADE", type: "serif" }
  ];

  stampArea.addEventListener("click", (e) => {
    // Hide the instruction text on first click
    const instruction = stampArea.querySelector(".stamp-instruction");
    if (instruction && instruction.style.display !== "none") {
      instruction.style.opacity = "0.15";
    }

    // Get click coords relative to the stampArea box
    const rect = stampArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Pick a random slogan/style
    const randomSlogan = slogans[Math.floor(Math.random() * slogans.length)];
    
    // Create stamped element
    const stamp = document.createElement("div");
    stamp.classList.add("stamped-item");
    stamp.textContent = randomSlogan.text;

    // Apply styles
    if (randomSlogan.type === "cursive") {
      stamp.classList.add("stamp-cursive");
    }
    
    // Random red color 40% of the time
    if (Math.random() < 0.4) {
      stamp.classList.add("stamp-red");
    }

    // Random rotation and size scale
    const rot = Math.floor(Math.random() * 60) - 30; // -30deg to 30deg
    const size = Math.floor(Math.random() * 20) + 16; // 16px to 36px
    
    stamp.style.left = `${x}px`;
    stamp.style.top = `${y}px`;
    stamp.style.fontSize = `${size}px`;
    stamp.style.setProperty("--rot", `${rot}deg`);

    stampArea.appendChild(stamp);

    // Play a brief visual effect on custom cursor for click feedback
    cursor.style.transform = "translate(-50%, -50%) scale(0.6)";
    setTimeout(() => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
    }, 150);
  });

  // Clear Canvas
  clearStampsBtn.addEventListener("click", () => {
    // Remove all stamp items
    const items = stampArea.querySelectorAll(".stamped-item");
    items.forEach(item => item.remove());
    
    // Restore instructions opacity
    const instruction = stampArea.querySelector(".stamp-instruction");
    if (instruction) {
      instruction.style.opacity = "1";
    }
  });

  // Save Custom Parchment Design as PNG
  const saveStampBtn = document.getElementById("saveStampBtn");
  if (saveStampBtn) {
    saveStampBtn.addEventListener("click", () => {
      const stamps = stampArea.querySelectorAll(".stamped-item");
      if (stamps.length === 0) {
        const lang = localStorage.getItem("laBanderaLang") || "en";
        alert(lang === "en" ? "Please place some stamps on your wrapping paper design first!" : "¡Por favor coloca algunos estampados en tu envoltura primero!");
        return;
      }

      const rect = stampArea.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Create high-res canvas relative to screen device pixel ratio
      const canvas = document.createElement("canvas");
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      
      // Paint background matching active theme
      const isDark = document.body.classList.contains("no-parchment");
      ctx.fillStyle = isDark ? "#0c0c0e" : "#f5f4ed";
      ctx.fillRect(0, 0, width, height);
      
      // Draw subtle framing border
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.15)" : "rgba(24,24,27,0.15)";
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, width, height);

      // Render each stamp onto the canvas context
      stamps.forEach(stamp => {
        const computed = window.getComputedStyle(stamp);
        const text = stamp.textContent;
        const left = parseFloat(stamp.style.left);
        const top = parseFloat(stamp.style.top);
        const fontSize = computed.fontSize;
        const fontFamily = computed.fontFamily;
        const color = computed.color;
        
        // Retrieve rotation angle
        const rotStr = stamp.style.getPropertyValue("--rot") || "0deg";
        const angle = parseFloat(rotStr) * Math.PI / 180;
        
        ctx.save();
        
        // Transform canvas matrix to stamp center coordinate
        ctx.translate(left, top);
        ctx.rotate(angle);
        
        // Apply styling and write text
        ctx.font = `900 ${fontSize} ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        ctx.fillText(text, 0, 0);
        ctx.restore();
      });

      // Trigger PNG image download
      try {
        const dataUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "la-bandera-custom-wrap.png";
        downloadLink.href = dataUrl;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } catch (err) {
        console.error("Failed to generate custom wrap image download", err);
        alert("Sorry, could not generate image file in this browser.");
      }
    });
  }

});
