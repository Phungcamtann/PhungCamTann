document.addEventListener("DOMContentLoaded", () => {
  const app = window.DamianApp;

  if (!app || typeof app.initLoader !== "function") return;

  const onReady =
    typeof app.initTerminalTyping === "function"
      ? app.initTerminalTyping
      : undefined;

  app.initLoader(onReady);
});
