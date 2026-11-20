(function () {
  'use strict';
  function openGuide() {
    if (location.hash === '#/learn/compare-mask-snorkel-fin-fit') {
      location.replace('learn-mask-snorkel-fin-fit.html');
    }
  }
  window.addEventListener('hashchange', openGuide);
  openGuide();
})();
