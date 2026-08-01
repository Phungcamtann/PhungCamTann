// Khởi tạo Custom Cursor
document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.querySelector(".custom-cursor");
  const cursorGlow = document.querySelector(".cursor-glow");

  // Nếu đang dùng thiết bị touch (mobile), không chạy logic cursor
  if (window.matchMedia("(pointer: coarse)").matches) {
    cursor.style.display = "none";
    cursorGlow.style.display = "none";
    return;
  }

  document.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;

    // Điểm chấm nhỏ di chuyển tức thì
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    // Vòng sáng di chuyển có độ trễ tạo cảm giác mượt
    cursorGlow.style.transform = `translate3d(${x - 15}px, ${y - 15}px, 0)`;
  });

  // Hiệu ứng hover vào link/button
  const hoverables = document.querySelectorAll("a, button");
  hoverables.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorGlow.classList.add("active");
    });
    el.addEventListener("mouseleave", () => {
      cursorGlow.classList.remove("active");
    });
  });
});
