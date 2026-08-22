document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.querySelector(".custom-cursor");
  const cursorGlow = document.querySelector(".cursor-glow");
  const supportsCustomCursor = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!cursor || !cursorGlow || !supportsCustomCursor || prefersReducedMotion) {
    return;
  }

  let pointerX = 0;
  let pointerY = 0;
  let animationFrameId = null;

  function renderCursor() {
    cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
    cursorGlow.style.transform = `translate3d(${pointerX - 15}px, ${pointerY - 15}px, 0)`;
    document.documentElement.classList.add("custom-cursor-enabled");
    animationFrameId = null;
  }

  document.addEventListener("mousemove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;

    if (animationFrameId === null) {
      animationFrameId = requestAnimationFrame(renderCursor);
    }
  });

  document.querySelectorAll("a, button").forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursorGlow.classList.add("active");
    });
    element.addEventListener("mouseleave", () => {
      cursorGlow.classList.remove("active");
    });
  });
});
