(function () {
  'use strict';
  const here = window.location;
  const local = here.hostname === '127.0.0.1' || here.hostname === 'localhost';
  if ((!local && here.origin !== 'https://macrodiving.com') ||
      here.pathname !== '/learn-mask-snorkel-fin-fit.html') return;
  const template = document.getElementById('mask-film-template');
  const slot = document.getElementById('mask-film-slot');
  if (!template || !slot) return;
  let revision = 0;
  let following = false;
  const hide = () => {
    revision++;
    slot.replaceChildren();
  };
  async function active() {
    try {
      const response = await fetch('mask-film-status.json', {
        cache: 'no-store', credentials: 'omit', redirect: 'error', mode: 'same-origin'
      });
      if (!response.ok) return false;
      const state = await response.json();
      return state.active === true && state.approval === template.dataset.approval;
    } catch {
      return false;
    }
  }
  async function show() {
    hide();
    const current = revision;
    if (await active() && current === revision) {
      slot.append(template.content.cloneNode(true));
    }
  }
  slot.addEventListener('click', async event => {
    const link = event.target.closest('a');
    if (!link || following) return;
    event.preventDefault();
    const current = revision;
    if (await active() && current === revision && link.isConnected) {
      following = true;
      try { link.click(); } finally { following = false; }
    } else if (current === revision) {
      hide();
    }
  });
  window.addEventListener('pageshow', show);
  window.addEventListener('pagehide', hide);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hide();
    else show();
  });
})();
