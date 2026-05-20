// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// Mobile nav toggle
document.querySelector('.nav-toggle')?.addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  });
});

// Scroll fade-in animations
const faders = document.querySelectorAll(
  '.showcase-inner, .program-header, .timeline-item, .program-result, ' +
  '.about-photo, .about-text, .pricing-header, .pricing-card, ' +
  '.detail-item, .faq-inner, .cta-inner'
);

faders.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

faders.forEach(el => observer.observe(el));

// Nav background on scroll
const nav = document.querySelector('.nav');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const scroll = window.scrollY;
  if (scroll > 100) {
    nav.style.borderBottomColor = 'rgba(200, 169, 81, 0.2)';
  } else {
    nav.style.borderBottomColor = '';
  }
  lastScroll = scroll;
}, { passive: true });
