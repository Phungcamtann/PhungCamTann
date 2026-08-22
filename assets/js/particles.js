document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("network-canvas")) return;

  const canvas = document.createElement("canvas");
  canvas.id = "network-canvas";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "-2";
  canvas.style.pointerEvents = "none";
  document.body.prepend(canvas);

  const context = canvas.getContext("2d");
  if (!context) {
    canvas.remove();
    return;
  }

  const MAX_PARTICLES = 100;
  const DENSITY_DIVISOR = 15;
  const CONNECTION_DISTANCE = 130;
  const CONNECTION_DISTANCE_SQUARED = CONNECTION_DISTANCE ** 2;
  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  let width = 0;
  let height = 0;
  let gradient = null;
  let particles = [];
  let animationFrameId = null;
  let resizeFrameId = null;

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.5 + 0.5;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fillStyle = "rgba(255, 70, 150, 0.8)";
      context.fill();
    }
  }

  function getTargetParticleCount() {
    return Math.min(Math.ceil(width / DENSITY_DIVISOR), MAX_PARTICLES);
  }

  function syncParticles() {
    const targetCount = getTargetParticleCount();

    while (particles.length < targetCount) {
      particles.push(new Particle());
    }
    if (particles.length > targetCount) {
      particles = particles.slice(0, targetCount);
    }

    particles.forEach((particle) => {
      particle.x = Math.min(Math.max(particle.x, 0), width);
      particle.y = Math.min(Math.max(particle.y, 0), height);
    });
  }

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#050508");
    gradient.addColorStop(1, "#15060b");
    syncParticles();
  }

  function drawScene(updateParticles) {
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    particles.forEach((particle) => {
      if (updateParticles) particle.update();
      particle.draw();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared < CONNECTION_DISTANCE_SQUARED) {
          const distance = Math.sqrt(distanceSquared);
          context.beginPath();
          context.strokeStyle = `rgba(255, 70, 150, ${1 - distance / CONNECTION_DISTANCE})`;
          context.lineWidth = 0.5;
          context.moveTo(particles[i].x, particles[i].y);
          context.lineTo(particles[j].x, particles[j].y);
          context.stroke();
        }
      }
    }
  }

  function animate() {
    animationFrameId = null;
    if (document.hidden || reducedMotionQuery.matches) return;

    drawScene(true);
    animationFrameId = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (
      animationFrameId === null &&
      !document.hidden &&
      !reducedMotionQuery.matches
    ) {
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  function stopAnimation() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function queueResize() {
    if (resizeFrameId !== null) return;

    resizeFrameId = requestAnimationFrame(() => {
      resizeFrameId = null;
      resizeCanvas();
      if (reducedMotionQuery.matches) drawScene(false);
    });
  }

  window.addEventListener("resize", queueResize);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAnimation();
      if (resizeFrameId !== null) {
        cancelAnimationFrame(resizeFrameId);
        resizeFrameId = null;
      }
      return;
    }

    resizeCanvas();
    if (reducedMotionQuery.matches) {
      drawScene(false);
    } else {
      startAnimation();
    }
  });

  reducedMotionQuery.addEventListener("change", (event) => {
    if (event.matches) {
      stopAnimation();
      drawScene(false);
    } else {
      startAnimation();
    }
  });

  resizeCanvas();
  if (reducedMotionQuery.matches) {
    drawScene(false);
  } else {
    startAnimation();
  }
});
