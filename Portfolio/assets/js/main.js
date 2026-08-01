// =========================================
// 1. XỬ LÝ LOADING SCREEN
// =========================================
document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");

  // Giả lập thời gian tải trang 2 giây
  setTimeout(() => {
    // Thêm class để kích hoạt hiệu ứng fade out (visibility & opacity đã setup ở layout.css)
    loadingScreen.style.opacity = "0";
    loadingScreen.style.visibility = "hidden";

    // Đợi transition CSS chạy xong (0.5s) rồi ẩn hẳn khỏi cấu trúc DOM
    setTimeout(() => {
      loadingScreen.style.display = "none";

      // Khởi động hiệu ứng gõ chữ sau khi loading kết thúc
      initTerminalTyping();
    }, 500);
  }, 2000);
});

// =========================================
// 2. HIỆU ỨNG TERMINAL TYPING (HOME PAGE)
// =========================================
function initTerminalTyping() {
  const terminalBody = document.getElementById("terminal-typing");
  if (!terminalBody) return;

  // Các dòng lệnh sẽ được gõ ra
  const lines = [
    "> initializing portfolio...",
    "> loading skills: [HTML, CSS, JS, C#, Python, Unity]...",
    "> access granted.",
    "> hello, world! I am Damian.",
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let currentLineElement = null;

  // Thiết lập tốc độ (ms)
  const typingSpeed = 50; // Tốc độ gõ từng ký tự
  const lineDelay = 600; // Thời gian nghỉ giữa các dòng

  function typeCharacter() {
    // Nếu bắt đầu một dòng mới, tạo một thẻ div mới
    if (charIndex === 0) {
      currentLineElement = document.createElement("div");
      currentLineElement.className = "terminal-line";

      // Highlight dòng cuối cùng (Lời chào) bằng màu Neon
      if (lineIndex === lines.length - 1) {
        currentLineElement.style.color = "var(--accent-glow)";
        currentLineElement.style.fontWeight = "bold";
      }
      terminalBody.appendChild(currentLineElement);
    }

    // Gõ từng ký tự
    if (charIndex < lines[lineIndex].length) {
      currentLineElement.textContent += lines[lineIndex].charAt(charIndex);
      charIndex++;
      setTimeout(typeCharacter, typingSpeed);
    } else {
      // Hết một dòng, chuyển sang dòng tiếp theo
      lineIndex++;
      charIndex = 0;

      if (lineIndex < lines.length) {
        setTimeout(typeCharacter, lineDelay);
      } else {
        // Khi gõ xong toàn bộ, thêm con trỏ nhấp nháy vào cuối
        addBlinkingCursor(currentLineElement);
      }
    }
  }

  // Khởi chạy hàm gõ
  typeCharacter();
}

// Hàm thêm hiệu ứng con trỏ nhấp nháy ở cuối dòng
function addBlinkingCursor(parentElement) {
  const cursor = document.createElement("span");
  cursor.textContent = " █";
  cursor.className = "blinking-cursor";
  parentElement.appendChild(cursor);
}
