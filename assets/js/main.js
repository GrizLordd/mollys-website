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

  // ---- Live open/closed status (cart hours 6pm to 10pm, India time) ----
  // Always computed in Asia/Kolkata, so a tourist with a foreign phone sees Jaipur time.
  var OPEN_MIN = 18 * 60, CLOSE_MIN = 22 * 60;
  function istMinutes() {
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date());
    var h = 0, m = 0;
    parts.forEach(function (p) {
      if (p.type === 'hour') h = parseInt(p.value, 10);
      if (p.type === 'minute') m = parseInt(p.value, 10);
    });
    return h * 60 + m;
  }
  function updateStatus() {
    var now, text, open;
    try { now = istMinutes(); } catch (e) { return; } // leave default text if Intl unavailable
    if (now >= OPEN_MIN && now < CLOSE_MIN) {
      open = true;
      text = (CLOSE_MIN - now <= 30) ? 'Open now · closing soon' : 'Open now · until 10pm';
    } else if (now < OPEN_MIN) {
      open = false;
      text = 'Closed · opens today at 6pm';
    } else {
      open = false;
      text = 'Closed · opens tomorrow, 6pm';
    }
    document.querySelectorAll('[data-status]').forEach(function (el) {
      el.classList.toggle('is-open', open);
      var t = el.querySelector('.status-text');
      if (t) t.textContent = text;
    });
  }
  updateStatus();
  setInterval(updateStatus, 60000);

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
