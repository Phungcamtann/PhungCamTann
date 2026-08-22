(() => {
  const TERMINAL_LINES = [
    "> initializing portfolio...",
    "> loading skills: [HTML, CSS, JS, C#, Python, Unity]...",
    "> access granted.",
    "> hello, world! I am Damian.",
  ];
  const TYPING_SPEED = 20;
  const LINE_DELAY = 300;

  function createTerminalLine(terminalBody, lineIndex) {
    const lineElement = document.createElement("div");
    lineElement.className = "terminal-line";

    if (lineIndex === TERMINAL_LINES.length - 1) {
      lineElement.style.color = "var(--accent-glow)";
      lineElement.style.fontWeight = "bold";
    }

    terminalBody.appendChild(lineElement);
    return lineElement;
  }

  function addBlinkingCursor(parentElement) {
    const cursor = document.createElement("span");
    cursor.textContent = " █";
    cursor.className = "blinking-cursor";
    parentElement.appendChild(cursor);
  }

  function renderTerminalImmediately(terminalBody) {
    let finalLine = null;

    TERMINAL_LINES.forEach((line, lineIndex) => {
      finalLine = createTerminalLine(terminalBody, lineIndex);
      finalLine.textContent = line;
    });

    addBlinkingCursor(finalLine);
  }

  function initTerminalTyping() {
    const terminalBody = document.getElementById("terminal-typing");
    if (!terminalBody) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      renderTerminalImmediately(terminalBody);
      return;
    }

    let lineIndex = 0;
    let charIndex = 0;
    let currentLineElement = null;

    function typeCharacter() {
      if (charIndex === 0) {
        currentLineElement = createTerminalLine(terminalBody, lineIndex);
      }

      if (charIndex < TERMINAL_LINES[lineIndex].length) {
        currentLineElement.textContent += TERMINAL_LINES[lineIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeCharacter, TYPING_SPEED);
        return;
      }

      lineIndex++;
      charIndex = 0;

      if (lineIndex < TERMINAL_LINES.length) {
        setTimeout(typeCharacter, LINE_DELAY);
      } else {
        addBlinkingCursor(currentLineElement);
      }
    }

    typeCharacter();
  }

  window.DamianApp = window.DamianApp || {};
  window.DamianApp.initTerminalTyping = initTerminalTyping;
})();
