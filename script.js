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
  const confirm = document.getElementById('form-confirm');
  const form = document.getElementById('contact-form');
  if (confirm && !confirm.hidden) {
    confirm.hidden = true;
    form.style.display = '';
    contactModal.querySelector('.modal-sub').style.display = '';
    contactModal.querySelector('#modal-title').style.display = '';
    form.reset();
    const submitBtn = document.getElementById('cf-submit');
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
  }
}

document.querySelectorAll('.open-contact-modal').forEach(btn => {
  btn.addEventListener('click', openContactModal);
});

document.querySelector('.modal-close')?.addEventListener('click', closeContactModal);

contactModal?.addEventListener('click', (e) => {
  if (e.target === contactModal) closeContactModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeContactModal();
});

document.getElementById('contact-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const submitBtn = document.getElementById('cf-submit');
  const status = document.getElementById('cf-status');

  status.className = 'form-status';
  status.textContent = '';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    const formData = new FormData(form);
    formData.append('_subject', `New inquiry from ${form.name.value}`);

    const response = await fetch('https://formspree.io/f/mqejylbl', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      form.style.display = 'none';
      contactModal.querySelector('.modal-sub').style.display = 'none';
      contactModal.querySelector('#modal-title').style.display = 'none';
      document.getElementById('form-confirm').hidden = false;
    } else {
      throw new Error('Submission failed');
    }
  } catch (error) {
    status.className = 'form-status error';
    status.innerHTML = 'Something went wrong. Please try again or email <a href="mailto:hello@firstnotemusiclab.com">hello@firstnotemusiclab.com</a> directly.';
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
  }
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
  document.querySelector('.nav-toggle').classList.toggle('open');
});

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
    document.querySelector('.nav-toggle').classList.remove('open');
  });
});

// Close mobile nav on outside click
document.addEventListener('click', (e) => {
  if (!document.querySelector('.nav').contains(e.target)) {
    document.querySelector('.nav-links').classList.remove('open');
    document.querySelector('.nav-toggle').classList.remove('open');
  }
});

// Scroll fade-in animations
const faders = document.querySelectorAll(
  '.release-card, .program-header, .timeline-item, .program-result, ' +
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

// Carousel initialization — handles all .carousel-wrapper instances
function initCarousel(wrapper) {
  const track = wrapper.querySelector('.carousel-track');
  if (!track) return;
  const slides = track.querySelectorAll('.carousel-slide');
  if (!slides.length) return;
  const prevBtn = wrapper.querySelector('.carousel-btn--prev');
  const nextBtn = wrapper.querySelector('.carousel-btn--next');
  const nextSibling = wrapper.nextElementSibling;
  const dotsContainer = nextSibling?.classList.contains('carousel-dots') ? nextSibling : null;
  let current = 0;

  function stopCardMedia(index) {
    const slide = slides[index];
    if (!slide) return;
    slide.querySelectorAll('.release-audio').forEach(audio => { audio.pause(); audio.currentTime = 0; });
    slide.querySelectorAll('.release-embed').forEach(iframe => { const s = iframe.src; iframe.src = ''; iframe.src = s; });
  }

  const dots = Array.from(slides).map((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'carousel-dot' + (i === 0 ? ' carousel-dot--active' : '');
    dot.addEventListener('click', () => { stopCardMedia(current); current = i; updateCarousel(); });
    dotsContainer?.appendChild(dot);
    return dot;
  });

  function updateCarousel() {
    track.style.transform = `translateX(-${current * 100}%)`;
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === slides.length - 1;
    dots.forEach((dot, i) => dot.classList.toggle('carousel-dot--active', i === current));
  }

  prevBtn?.addEventListener('click', () => { if (current > 0) { stopCardMedia(current); current--; updateCarousel(); } });
  nextBtn?.addEventListener('click', () => { if (current < slides.length - 1) { stopCardMedia(current); current++; updateCarousel(); } });

  const viewport = track.closest('.carousel-viewport');
  let touchStartX = 0;
  let swipeBlocked = false;
  viewport.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    swipeBlocked = e.target.closest('audio') !== null;
  }, { passive: true });
  viewport.addEventListener('touchend', e => {
    if (swipeBlocked) { swipeBlocked = false; return; }
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && current < slides.length - 1) { stopCardMedia(current); current++; updateCarousel(); }
      if (diff < 0 && current > 0) { stopCardMedia(current); current--; updateCarousel(); }
    }
  }, { passive: true });

  updateCarousel();
}

document.querySelectorAll('.carousel-wrapper').forEach(initCarousel);

// Demo/Final toggles on release cards
document.querySelectorAll('.release-toggle').forEach(toggle => {
  toggle.querySelectorAll('.release-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = toggle.closest('.release-card');
      const target = btn.dataset.panel;
      const spotifyPanel = card.querySelector('.release-panel[data-panel="final"]');
      const audioPanel = card.querySelector('.release-panel[data-panel="demo"]');

      toggle.querySelectorAll('.release-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (target === 'demo') {
        audioPanel.classList.add('panel-visible');
        spotifyPanel.classList.remove('panel-visible');
        const iframe = spotifyPanel.querySelector('iframe');
        if (iframe) iframe.src = iframe.src;
      } else {
        spotifyPanel.classList.add('panel-visible');
        audioPanel.classList.remove('panel-visible');
        const audio = audioPanel.querySelector('audio');
        if (audio) { audio.pause(); audio.currentTime = 0; }
      }
    });
  });
});

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
