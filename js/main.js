/* ==========================================
   STEM Tuition - Pokhara
   Main Interactive Logic
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Reveal animations on scroll
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach((el) => observer.observe(el));
  }

  // Non-Locking Mouse Wheel Carousel Logic (RULES.md Section 2.2 #4)
  document.querySelectorAll('.h-scroll-container').forEach(container => {
    container.addEventListener('wheel', (evt) => {
      const atRightEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
      const atLeftEnd = container.scrollLeft <= 0;

      if ((evt.deltaY > 0 && !atRightEnd) || (evt.deltaY < 0 && !atLeftEnd)) {
        evt.preventDefault();
        container.scrollBy({ left: evt.deltaY * 1.5, behavior: 'smooth' });
      }
    }, { passive: false });
  });
});

// Mobile Navigation Toggle
function toggleNav() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    navLinks.classList.toggle('open');
  }
}

// FAQ Accordion Toggle
function toggleFaq(element) {
  if (element && element.parentElement) {
    element.parentElement.classList.toggle('active');
  }
}

// Star Rating Helper (Videos & Review section)
function setRating(rating) {
  const ratingInput = document.getElementById('ratingValue');
  if (ratingInput) ratingInput.value = rating;

  const stars = document.querySelectorAll('.star-btn');
  stars.forEach((star, i) => {
    if (i < rating) star.classList.add('active');
    else star.classList.remove('active');
  });
}

// Review Submission Helper
function submitReview(e) {
  e.preventDefault();
  alert('Thank you for your review! It will be posted shortly.');
  e.target.reset();
  document.querySelectorAll('.star-btn').forEach((s) => s.classList.remove('active'));
  const ratingInput = document.getElementById('ratingValue');
  if (ratingInput) ratingInput.value = 5;
}

// Video / Note Tab Switcher
function switchTab(tabName) {
  const contents = document.querySelectorAll('.tab-content');
  const buttons = document.querySelectorAll('.tab-btn');
  
  contents.forEach(c => c.classList.remove('active'));
  buttons.forEach(b => b.classList.remove('active'));
  
  const targetTab = document.getElementById(tabName);
  if (targetTab) targetTab.classList.add('active');
  if (window.event && window.event.target) {
    window.event.target.classList.add('active');
  }
}

window.toggleNav = toggleNav;
window.toggleFaq = toggleFaq;
window.setRating = setRating;
window.submitReview = submitReview;
window.switchTab = switchTab;
