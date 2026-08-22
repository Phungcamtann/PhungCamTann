document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal");

  if (!reveals.length) return;

  const revealOptions = {
    threshold: 0.15, // Kích hoạt khi 15% phần tử xuất hiện
    rootMargin: "0px 0px -50px 0px",
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        // Ngừng theo dõi sau khi đã xuất hiện (để không bị lặp lại)
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  reveals.forEach((reveal) => {
    revealObserver.observe(reveal);
  });
});
