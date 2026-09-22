// Molly's Popcorn — main.js
// Two jobs only: header background on scroll, and the mobile nav drawer.

(function () {
  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('navToggle');
  var closeBtn = document.getElementById('navClose');
  var mobileNav = document.getElementById('mobileNav');

  function onScroll() {
    if (window.scrollY > 24) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function openNav() {
    mobileNav.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (toggle) toggle.addEventListener('click', openNav);
  if (closeBtn) closeBtn.addEventListener('click', closeNav);
  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeNav);
  });
})();

