export function initScrollReveal(): void {
  const elements = document.querySelectorAll<HTMLElement>('.reveal-on-scroll');
  if (elements.length === 0) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  elements.forEach((el) => observer.observe(el));
}

export function initMouseWheelScroll(): void {
  document.querySelectorAll<HTMLElement>('.h-scroll-container').forEach((container) => {
    if (!container.hasAttribute('tabindex')) {
      container.setAttribute('tabindex', '0');
    }
    if (!container.hasAttribute('role')) {
      container.setAttribute('role', 'region');
    }
    if (!container.hasAttribute('aria-label')) {
      const id = container.id;
      container.setAttribute(
        'aria-label',
        id ? `Scrollable: ${id.replace(/([A-Z])/g, ' $1').toLowerCase()}` : 'Scrollable content',
      );
    }
    container.addEventListener(
      'wheel',
      (evt) => {
        const atRightEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
        const atLeftEnd = container.scrollLeft <= 0;
        if ((evt.deltaY > 0 && !atRightEnd) || (evt.deltaY < 0 && !atLeftEnd)) {
          evt.preventDefault();
          container.scrollBy({ left: evt.deltaY * 1.5, behavior: 'smooth' });
        }
      },
      { passive: false },
    );
  });
}

export function initScrollProgress(): void {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const update = (): void => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = height > 0 ? `${(winScroll / height) * 100}%` : '0%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}
