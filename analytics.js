/* Pat Miazga — GA4 custom events. No personal information is ever sent. */
(function () {
  function ev(name, params) {
    if (typeof gtag !== 'function') return;
    params = params || {};
    params.page_path = location.pathname;
    gtag('event', name, params);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a,button');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0) return ev('contact_click', { method: 'phone' });
    if (href.indexOf('sms:') === 0) return ev('contact_click', { method: 'text' });
    if (href.indexOf('mailto:') === 0) return ev('contact_click', { method: 'email' });
    if (a.classList.contains('nav-cta')) return ev('nav_cta_click', { link_url: href });
    if (a.classList.contains('start-card')) return ev('start_here_click', { link_url: href });
    if (a.classList.contains('dev-chip')) return ev('filter_developments', { filter: (a.textContent || '').trim().slice(0, 40) });
    if (a.classList.contains('dev-tab')) return ev('developments_town_tab', { town: (a.textContent || '').trim().slice(0, 40) });
  }, true);
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || f.tagName !== 'FORM') return;
    ev('generate_lead', { form_id: f.id || f.className || 'form', transport_type: 'beacon' });
  }, true);
})();
