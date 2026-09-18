/* =========================================================
   1. INITIALIZATION
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  initParticleCanvas();
  initCursor();
  initScrollAnimations();
  init3DTilt();
  initPortfolioFilter();
});

/* =========================================================
   2. SMOOTH TRAILING CURSOR
   ========================================================= */
function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  const clickableElements = document.querySelectorAll('a, button, input, select, textarea, .portfolio-item');
  clickableElements.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
  });
}

/* =========================================================
   3. BACKGROUND AMBIENT PARTICLES
   ========================================================= */
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height + height * 0.1;
      this.radius = Math.random() * 1.5 + 0.5;
      this.speedY = Math.random() * -0.3 - 0.1;
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.fade = Math.random() * 0.004 + 0.002;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.alpha -= this.fade;
      if (this.alpha <= 0 || this.y < -10) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 216, 160, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 35; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* =========================================================
   4. SCROLL REVEAL OBSERVER
   ========================================================= */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

/* =========================================================
   5. 3D CARD TILT EFFECT
   ========================================================= */
function init3DTilt() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

/* =========================================================
   6. BEFORE / AFTER COMPARISON SLIDER
   ========================================================= */
const sliderRange = document.getElementById('sliderRange');
const beforeContainer = document.getElementById('beforeContainer');
const sliderHandle = document.getElementById('sliderHandle');

if (sliderRange && beforeContainer && sliderHandle) {
  sliderRange.addEventListener('input', (e) => {
    const val = e.target.value;
    beforeContainer.style.width = `${val}%`;
    sliderHandle.style.left = `${val}%`;
  });
}

/* =========================================================
   7. PORTFOLIO FILTER & LIGHTBOX
   ========================================================= */
function initPortfolioFilter() {
  const buttons = document.querySelectorAll('.portfolio-filter');
  const items = document.querySelectorAll('.portfolio-item');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      items.forEach(item => {
        if (filter === 'all' || item.classList.contains(filter)) {
          item.style.display = 'block';
          setTimeout(() => item.style.opacity = '1', 10);
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.style.display = 'none', 200);
        }
      });
    });
  });
}

function openLightbox(imgSrc, title, category) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImage');
  const titleEl = document.getElementById('lightboxTitle');
  const catEl = document.getElementById('lightboxCategory');

  if (img) img.src = imgSrc;
  if (titleEl) titleEl.innerText = title;
  if (catEl) catEl.innerText = category;

  if (modal) modal.classList.remove('opacity-0', 'pointer-events-none');
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.classList.add('opacity-0', 'pointer-events-none');
}

/* =========================================================
   8. PRICING CALCULATOR
   ========================================================= */
function calculateTotal() {
  const calcBase = document.getElementById('calcBase');
  const calcAttendees = document.getElementById('calcAttendees');
  if (!calcBase || !calcAttendees) return;

  const basePrice = parseInt(calcBase.value, 10);
  const attendees = parseInt(calcAttendees.value, 10);
  const trial = document.getElementById('addonTrial')?.checked ? 220 : 0;
  const touchup = document.getElementById('addonTouchup')?.checked ? 300 : 0;
  const airbrush = document.getElementById('addonAirbrush')?.checked ? 80 : 0;

  const attendeeDisplay = document.getElementById('attendeeDisplay');
  if (attendeeDisplay) {
    attendeeDisplay.innerText = `${attendees} ${attendees === 1 ? 'Guest' : 'Guests'}`;
  }

  const grandTotal = basePrice + (attendees * 150) + trial + touchup + airbrush;
  const totalDisplay = document.getElementById('totalDisplay');
  if (totalDisplay) {
    totalDisplay.innerText = `$${grandTotal.toLocaleString()}`;
  }
}

function openBookingFromCalculator() {
  const calcBase = document.getElementById('calcBase');
  if (calcBase) {
    const selectedService = calcBase.options[calcBase.selectedIndex].text;
    openBookingModal(selectedService.split(' (')[0]);
  }
}

/* =========================================================
   9. MULTI-STEP BOOKING MODAL
   ========================================================= */
function openBookingModal(serviceName = 'Full Bridal Package') {
  const bookingModal = document.getElementById('bookingModal');
  const modalBox = document.getElementById('modalBox');
  const modalServiceInput = document.getElementById('modalServiceInput');

  if (modalServiceInput) modalServiceInput.value = serviceName;
  if (bookingModal && modalBox) {
    bookingModal.classList.remove('opacity-0', 'pointer-events-none');
    modalBox.classList.remove('scale-95');
    modalBox.classList.add('scale-100');
  }
}

function closeBookingModal() {
  const bookingModal = document.getElementById('bookingModal');
  const modalBox = document.getElementById('modalBox');
  if (bookingModal && modalBox) {
    bookingModal.classList.add('opacity-0', 'pointer-events-none');
    modalBox.classList.remove('scale-100');
    modalBox.classList.add('scale-95');
  }
  resetForm();
}

function nextFormStep() {
  const name = document.getElementById('custName')?.value.trim();
  const contact = document.getElementById('custContact')?.value.trim();

  if (!name || !contact) {
    alert('Please provide your name and contact info to continue.');
    return;
  }

  document.getElementById('formStep1')?.classList.add('hidden');
  document.getElementById('formStep2')?.classList.remove('hidden');
  document.getElementById('stepDot2')?.classList.remove('bg-white/20');
  document.getElementById('stepDot2')?.classList.add('bg-gold-400');
}

function prevFormStep() {
  document.getElementById('formStep2')?.classList.add('hidden');
  document.getElementById('formStep1')?.classList.remove('hidden');
  document.getElementById('stepDot2')?.classList.remove('bg-gold-400');
  document.getElementById('stepDot2')?.classList.add('bg-white/20');
}

function resetForm() {
  document.getElementById('bookingForm')?.reset();
  prevFormStep();
}

function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('custName')?.value || 'Valued Client';
  alert(`Thank you, ${name}. Your appointment request has been submitted. We will contact you within 24 hours to confirm your date.`);
  closeBookingModal();
}
