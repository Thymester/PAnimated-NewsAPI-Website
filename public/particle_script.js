const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const particles = [];
const rippleParticles = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor(x, y, ripple) {
    this.x = x;
    this.y = y;
    this.size = ripple ? 1 : Math.random() * 5 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.ripple = ripple;
    this.maxSize = ripple ? 50 : this.size + Math.random() * 20;
    this.opacity = ripple ? 0.5 : 1;
  }

  update() {
    if (this.ripple) {
      this.size += 2;
      this.opacity -= 0.02;
    } else {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.size > 0.2) this.size -= 0.1;
    }
  }

  draw() {
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.ripple ? 'rgba(255, 255, 255, 0.5)' : 'white';
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function createParticles(x, y, ripple) {
  const numParticles = ripple ? 1 : Math.random() * 5 + 1;
  const particleArray = ripple ? rippleParticles : particles;

  for (let i = 0; i < numParticles; i++) {
    const particle = new Particle(x, y, ripple);
    particleArray.push(particle);
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].size <= 0.2) {
      particles.splice(i, 1);
      i--;
    }
  }

  for (let i = 0; i < rippleParticles.length; i++) {
    rippleParticles[i].update();
    rippleParticles[i].draw();

    if (rippleParticles[i].size >= rippleParticles[i].maxSize) {
      rippleParticles.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(animateParticles);
}

// Create background particles continuously
setInterval(() => {
  const randomX = Math.random() * canvas.width;
  const randomY = Math.random() * canvas.height;
  createParticles(randomX, randomY, false);
}, 25); // Adjust the interval as needed

window.addEventListener('mousemove', (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  createParticles(mouseX, mouseY, false); // Create regular particles
  createParticles(mouseX, mouseY, true); // Create ripple particles
});

animateParticles();
