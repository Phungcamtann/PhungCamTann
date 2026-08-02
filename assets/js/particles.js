document.addEventListener("DOMContentLoaded", () => {
  // 1. Tạo thẻ Canvas và nhúng xuống dưới cùng (z-index: -2)
  const canvas = document.createElement("canvas");
  canvas.id = "network-canvas";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.zIndex = "-2";
  canvas.style.pointerEvents = "none"; // Click xuyên qua
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];

  // 2. Kích thước tự động co giãn theo màn hình
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // 3. Khai báo Lớp Hạt (Node mạng lưới)
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      // Tốc độ trôi dạt ngẫu nhiên
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.5 + 0.5; // Kích thước hạt như các vì sao
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Dội lại khi đụng cạnh màn hình
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 70, 150, 0.8)"; // Chấm màu Pink Neon
      ctx.fill();
    }
  }

  // Khởi tạo số lượng hạt (Tính toán tự động theo độ rộng màn hình để không lag mobile)
  const particleCount = Math.min(window.innerWidth / 15, 100);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // 4. Vòng lặp Animation tạo chuyển động và các vạch nối Internet
  function animate() {
    // Tô lại nền sau mỗi khung hình bằng màu Gradient đen ánh hồng nhẹ như hình mẫu
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#050508");
    gradient.addColorStop(1, "#15060b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Vẽ và cập nhật vị trí hạt
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    // Nối các tia khi 2 hạt gần nhau
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Nếu khoảng cách nhỏ hơn 130px thì nối tia
        if (distance < 130) {
          ctx.beginPath();
          // Tia mờ dần khi xa nhau
          ctx.strokeStyle = `rgba(255, 70, 150, ${1 - distance / 130})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  // Bắt đầu chạy Animation
  animate();
});
