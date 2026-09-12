/* Satyajeet Behera Portfolio JavaScript - Animations, Canvas, Interactive Controls & Theme Toggle */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Theme Toggle & Mobile Menu Controls
  const themeBtn = document.querySelector("#theme");
  const menuBtn = document.querySelector("#menu");
  const nav = document.querySelector(".nav");

  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    if (themeBtn) themeBtn.textContent = "☾";
  }

  if (themeBtn) {
    themeBtn.onclick = () => {
      document.body.classList.toggle("light");
      const isLight = document.body.classList.contains("light");
      localStorage.setItem("theme", isLight ? "light" : "dark");
      themeBtn.textContent = isLight ? "☾" : "☼";
    };
  }

  if (menuBtn && nav) {
    menuBtn.onclick = () => nav.classList.toggle("open");
    document.querySelectorAll("#nav a").forEach((a) => {
      a.onclick = () => nav.classList.remove("open");
    });
  }

  // 2. Scroll Progress Bar Update
  const progressBar = document.querySelector("#scroll-progress");
  window.addEventListener("scroll", () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });

  // 3. Ambient Particle Canvas Animation (GPU Lightweight)
  const canvas = document.querySelector("#bg-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];
    let animationFrameId;
    let isTabActive = true;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.5 + 0.8;
        this.alpha = Math.random() * 0.4 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        const isLight = document.body.classList.contains("light");
        ctx.fillStyle = isLight
          ? `rgba(27, 138, 90, ${this.alpha * 0.6})`
          : `rgba(99, 234, 170, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particleCount = Math.min(Math.floor(window.innerWidth / 35), 40);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function drawConnections() {
      const isLight = document.body.classList.contains("light");
      const maxDist = 135;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.18;
            ctx.strokeStyle = isLight
              ? `rgba(27, 138, 90, ${alpha * 0.7})`
              : `rgba(99, 234, 170, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function renderCanvas() {
      if (!isTabActive) return;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawConnections();
      animationFrameId = requestAnimationFrame(renderCanvas);
    }

    renderCanvas();

    document.addEventListener("visibilitychange", () => {
      isTabActive = !document.hidden;
      if (isTabActive) renderCanvas();
      else cancelAnimationFrame(animationFrameId);
    });
  }

  // 4. Spotlight Mouse Follower on Cards
  const spotlightCards = document.querySelectorAll(".spotlight-card");
  spotlightCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  // 5. 3D Tilt Effect on Hero Terminal
  const terminalCard = document.querySelector("#terminal-card");
  if (terminalCard && window.innerWidth > 950) {
    const heroSection = document.querySelector("#home");
    heroSection.addEventListener("mousemove", (e) => {
      const rect = terminalCard.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      const rotateX = (e.clientY - cardCenterY) * -0.025;
      const rotateY = (e.clientX - cardCenterX) * 0.025;
      terminalCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    heroSection.addEventListener("mouseleave", () => {
      terminalCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  }

  // 6. Terminal Typewriter Animation
  function initTypewriter() {
    const targets = document.querySelectorAll(".type-target");
    targets.forEach((target) => {
      const fullText = target.getAttribute("data-text") || target.textContent;
      target.textContent = "";
      let charIndex = 0;
      const speed = 30 + Math.random() * 20;

      function typeChar() {
        if (charIndex < fullText.length) {
          target.textContent += fullText.charAt(charIndex);
          charIndex++;
          setTimeout(typeChar, speed);
        }
      }
      setTimeout(typeChar, 300);
    });
  }
  initTypewriter();

  // 7. Animated Counter for Stat Numbers
  function animateCounter(el) {
    const targetValue = parseFloat(el.getAttribute("data-target"));
    const suffix = el.getAttribute("data-suffix") || "";
    const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    const duration = 1600;
    const startTime = performance.now();

    function updateNumber(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = easeProgress * targetValue;
      el.textContent = `${currentValue.toFixed(decimals)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        el.textContent = `${targetValue.toFixed(decimals)}${suffix}`;
      }
    }
    requestAnimationFrame(updateNumber);
  }

  // 8. IntersectionObserver for Reveal Animations & Stats
  const animatedCounters = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");

        // Stat Counter animation trigger
        const counters = entry.target.querySelectorAll(".counter");
        counters.forEach((c) => {
          if (!animatedCounters.has(c)) {
            animatedCounters.add(c);
            animateCounter(c);
          }
        });
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".section, .hero .copy, .terminal, .reveal, .timeline article").forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });

  // 9. Gallery Lightbox Modal Interaction
  const lightbox = document.querySelector("#image-lightbox");
  const lightboxImg = document.querySelector("#lightbox-img");
  const lightboxCaption = document.querySelector("#lightbox-caption");
  const lightboxClose = document.querySelector("#lightbox-close");
  const lightboxOverlay = document.querySelector(".lightbox-overlay");

  if (lightbox && lightboxImg) {
    document.querySelectorAll(".gallery-card").forEach((card) => {
      card.addEventListener("click", () => {
        const src = card.getAttribute("data-src");
        const caption = card.getAttribute("data-caption");
        lightboxImg.src = src;
        if (lightboxCaption) lightboxCaption.textContent = caption || "";
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("open")) {
        closeLightbox();
      }
    });
  }
});