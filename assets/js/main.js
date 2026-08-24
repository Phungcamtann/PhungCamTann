document.addEventListener("DOMContentLoaded", () => {
  const app = window.DamianApp;

  if (!app || typeof app.initLoader !== "function") return;

  if (typeof app.initCarouselDepth === "function") {
    try {
      app.initCarouselDepth();
    } catch {
      // Keep the CSS-only marquee available if depth enhancement cannot start.
    }
  }

  const onReady =
    typeof app.initTerminalTyping === "function"
      ? app.initTerminalTyping
      : undefined;

  app.initLoader(onReady);
});
