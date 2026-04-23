/**
 * VoteWise — Timeline Component
 * Animates the timeline items on scroll using IntersectionObserver
 */

/**
 * Initializes scroll-triggered animations for the election timeline.
 * Falls back gracefully if IntersectionObserver is not supported.
 */
function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  // Add initial hidden state
  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
  });

  if (!('IntersectionObserver' in window)) {
    // Fallback: show all items if IntersectionObserver not supported
    items.forEach(item => {
      item.style.opacity = '1';
      item.style.transform = '';
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
  );

  items.forEach(item => observer.observe(item));
}

// Expose for app.js to call when timeline tab is activated
window.initTimeline = initTimeline;
