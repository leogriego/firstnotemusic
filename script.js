// Contact modal
const contactModal = document.getElementById('contact-modal');

function openContactModal(e) {
  e.preventDefault();
  contactModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeContactModal() {
  contactModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.open-contact-modal').forEach(btn => {
  btn.addEventListener('click', openContactModal);
});

document.querySelector('.modal-close').addEventListener('click', closeContactModal);

contactModal.addEventListener('click', (e) => {
  if (e.target === contactModal) closeContactModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeContactModal();
});

document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value;
  const email = form.email.value;
  const phone = form.phone.value || 'Not provided';
  const interest = form.interest.value;
  const message = form.message.value;
  const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nInterested in: ${interest}\n\nMessage:\n${message}`;
  window.location.href = `mailto:hello@firstnotemusiclab.com?subject=New inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(body)}`;
  closeContactModal();
});

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
