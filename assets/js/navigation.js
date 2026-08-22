// =========================================
// NAVIGATION ACTIVE STATE
// =========================================
document.addEventListener("DOMContentLoaded", () => {
  const currentUrl = window.location.pathname.split("/").pop() || "index.html";
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    item.classList.remove("active");
    item.removeAttribute("aria-current");

    const itemUrl = item.getAttribute("href").split("/").pop();
    if (itemUrl === currentUrl) {
      item.classList.add("active");
      item.setAttribute("aria-current", "page");
    }
  });

  const mobileNavigation = document.getElementById("mobileNavigation");
  const desktopQuery = window.matchMedia("(min-width: 992px)");
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches && mobileNavigation && window.bootstrap) {
      const offcanvas = window.bootstrap.Offcanvas.getInstance(mobileNavigation);
      if (offcanvas) offcanvas.hide();
    }
  });
});
