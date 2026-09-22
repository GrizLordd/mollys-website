// Molly's Popcorn — main.js
// Three jobs: header background on scroll, mobile nav drawer, on-scroll reveal.
// No scroll listeners for animation — IntersectionObserver only.

(function () {
  var header    = document.getElementById('siteHeader');
  var toggle    = document.getElementById('navToggle');
  var closeBtn  = document.getElementById('navClose');
  var mobileNav = document.getElementById('mobileNav');

  // ---- Header background on scroll (single scroll listener, passive) ----
  function onScroll() {
    if (window.scrollY > 24) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile nav ----
  function openNav() {
    mobileNav.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  if (toggle)   toggle.addEventListener('click', openNav);
  if (closeBtn) closeBtn.addEventListener('click', closeNav);
  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeNav);
  });

  // ---- Reveal on scroll (respects reduced motion) ----
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealTargets = document.querySelectorAll('.reveal');

  if (reduce || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          entry.target.style.setProperty('--reveal-delay', (i * 0.08) + 's');
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(function (el) { io.observe(el); });

    // Safety: if for any reason IO hasn't marked an element in-view after
    // 2.5s (headless capture, JS pause, etc.), reveal them anyway.
    setTimeout(function () {
      revealTargets.forEach(function (el) {
        if (!el.classList.contains('is-in')) el.classList.add('is-in');
      });
    }, 2500);
  }
})();
