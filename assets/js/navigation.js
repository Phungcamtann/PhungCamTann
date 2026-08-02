// =========================================
// SIDEBAR MOBILE DRAWER LOGIC
// =========================================
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const appContainer = document.querySelector(".app-container");

  // 1. Tạo nút Toggle cho Mobile và thêm vào DOM
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "mobile-toggle-btn glass-panel";
  toggleBtn.innerHTML = "☰"; // Có thể thay bằng icon SVG sau
  document.body.appendChild(toggleBtn);

  // 2. Logic Đóng/Mở Sidebar
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    sidebar.classList.toggle("open");
  });

  // 3. Đóng Sidebar khi click ra ngoài vùng menu (chỉ áp dụng trên mobile)
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 992) {
      if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove("open");
      }
    }
  });

  // 4. Highlight Menu đang active dựa trên URL (tự động)
  const currentUrl = window.location.pathname.split("/").pop() || "index.html";
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    // Xóa class active cũ
    item.classList.remove("active");
    // Thêm class active nếu href trùng với currentUrl
    if (item.getAttribute("href") === currentUrl) {
      item.classList.add("active");
    }
  });
});
