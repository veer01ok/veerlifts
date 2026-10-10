/* ------------------------------------------------------------
   Motion, and the sticky buy bar.

   Nothing here is load-bearing. The class that hides a block is
   only added once this file is running, and the sticky bar's
   resting state is visible — so with JavaScript off, or if this
   throws, the page is whole and the buy button is still there.
   ------------------------------------------------------------ */

(function () {
  var root = document.documentElement;

  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (still && still.matches) return;
  if (!('IntersectionObserver' in window)) return;

  /* ---------- the sticky bar ----------
     While the cover's own buy button is on screen the bar repeats
     it — two orange blocks saying the same thing. So it waits
     until that button has scrolled past. */
  var bar = document.querySelector('.sticky');
  var coverBuy = document.querySelector('.cover .buy');
  if (bar && coverBuy) {
    new IntersectionObserver(function (e) {
      bar.classList.toggle('is-down', e[0].isIntersecting);
    }, {
      /* The whole button must be clear of the bar's own strip before
         the bar stands down. With threshold 0 a button half cut off
         at the fold still counted as visible, so on a short phone
         the bar hid and the price was nowhere on the first screen. */
      threshold: 1,
      rootMargin: '0px 0px -72px 0px'
    }).observe(coverBuy);
  }

  /* ---------- blocks lifting in ---------- */
  var blocks = [].slice.call(document.querySelectorAll(
    '.meat .wrap > *, .close .wrap > *, .receipts li, .six li, .gets li'
  ));
  if (!blocks.length) return;

  root.classList.add('reveal-ready');

  /* Anything already on screen is shown at once — the reader did
     not scroll to it, so it should not arrive. */
  blocks.forEach(function (el) {
    el.classList.add('reveal');
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add('is-in');
  });

  var seen = new WeakMap();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var n = seen.get(el.parentNode) || 0;
      seen.set(el.parentNode, n + 1);
      if (n) el.style.transitionDelay = Math.min(n, 4) * 50 + 'ms';
      el.classList.add('is-in');
      io.unobserve(el);        // once only; re-animating on the way back up is nausea
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  blocks.forEach(function (el) { if (!el.classList.contains('is-in')) io.observe(el); });
})();
