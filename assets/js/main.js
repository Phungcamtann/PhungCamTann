// =========================================
// 1. XỬ LÝ LOADING SCREEN
// =========================================
document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");

  // Nếu trang hiện tại không có loading screen thì bỏ qua
  if (!loadingScreen) {
    initTerminalTyping();
    return;
  }

  // Kiểm tra xem đã hiển thị loading trong phiên truy cập này chưa
  if (!sessionStorage.getItem("hasVisited")) {
    // Lần đầu vào web: Chạy hiệu ứng Loading 2 giây
    setTimeout(() => {
      loadingScreen.style.opacity = "0";
      loadingScreen.style.visibility = "hidden";

      // Đợi transition CSS chạy xong (0.5s) rồi ẩn hẳn
      setTimeout(() => {
        loadingScreen.style.display = "none";

        // Đánh dấu là đã xem loading
        sessionStorage.setItem("hasVisited", "true");

        // Khởi động hiệu ứng gõ chữ
        initTerminalTyping();
      }, 500);
    }, 2000);
  } else {
    // Các lần sau (chuyển tab): Ẩn ngay lập tức loading screen
    loadingScreen.style.display = "none";

    // Chạy luôn hiệu ứng gõ chữ ngay lập tức
    initTerminalTyping();
  }
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
  const typingSpeed = 20; // Tốc độ gõ từng ký tự
  const lineDelay = 300; // Thời gian nghỉ giữa các dòng

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
