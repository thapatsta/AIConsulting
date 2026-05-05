(function () {
  'use strict';

  // ── year ────────────────────────────────────────────────────────────────
  document.getElementById('yr').textContent = new Date().getFullYear();

  // ── hamburger / drawer ──────────────────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const drawer     = document.getElementById('nav-drawer');
  const overlay    = document.getElementById('nav-overlay');

  function openDrawer() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () =>
    drawer.classList.contains('open') ? closeDrawer() : openDrawer()
  );
  overlay.addEventListener('click', closeDrawer);
  document.querySelectorAll('[data-close-drawer]').forEach(el =>
    el.addEventListener('click', closeDrawer)
  );

  // ── service + issue CTA: scroll to booking + preselect service ──────────
  function scrollToBookingWithService(serviceValue) {
    const bookingSection = document.getElementById('booking');
    if (!bookingSection) return;
    const top = bookingSection.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
    if (serviceValue) {
      const select = document.getElementById('f-service');
      if (select) {
        // match option value (case-insensitive fallback)
        const options = Array.from(select.options);
        const match = options.find(o => o.value === serviceValue);
        if (match) select.value = serviceValue;
      }
    }
  }

  document.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#booking')) {
        e.preventDefault();
        scrollToBookingWithService(link.dataset.service);
      }
    });
  });

  // ── booking form ─────────────────────────────────────────────────────────
  let driveVal = '';

  document.querySelectorAll('.drive-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      driveVal = btn.dataset.val;
      document.querySelectorAll('.drive-btn').forEach(b =>
        b.classList.toggle('active', b === btn)
      );
    });
  });

  document.getElementById('form-submit').addEventListener('click', () => {
    const first = document.getElementById('f-first').value.trim();
    const last  = document.getElementById('f-last').value.trim();
    const phone = document.getElementById('f-phone').value.trim();
    const year  = document.getElementById('f-year').value.trim();
    const make  = document.getElementById('f-make').value.trim();
    const model = document.getElementById('f-model').value.trim();
    const service = document.getElementById('f-service').value.trim();
    const issue = document.getElementById('f-issue').value.trim();
    const date = document.getElementById('f-date').value.trim();
    const time = document.getElementById('f-time').value.trim();

    if (!first || !last || !phone || !year || !make || !model || !service || !issue || !date || !time || !driveVal) {
      [
        ['f-first', first], ['f-last', last], ['f-phone', phone],
        ['f-year', year],   ['f-make', make],
        ['f-model', model], ['f-service', service], ['f-issue', issue], ['f-date', date], ['f-time', time],
      ].forEach(([id, val]) => {
        const el = document.getElementById(id);
        el.style.borderColor = val ? '' : '#e05555';
      });
      return;
    }

    document.getElementById('form-body').style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
    const bookingTop = document.getElementById('booking').offsetTop - 80;
    window.scrollTo({ top: bookingTop, behavior: 'smooth' });
  });

  document.getElementById('form-reset').addEventListener('click', () => {
    document.getElementById('form-body').style.display = 'block';
    document.getElementById('form-success').style.display = 'none';
    ['f-first','f-last','f-phone','f-email','f-year','f-make','f-model','f-issue','f-date'].forEach(id => {
      const el = document.getElementById(id);
      el.value = '';
      el.style.borderColor = '';
    });
    document.getElementById('f-service').value = '';
    document.getElementById('f-time').value = '';
    driveVal = '';
    document.querySelectorAll('.drive-btn').forEach(b => b.classList.remove('active'));
  });

  // clear red border on input
  document.querySelectorAll('.field-input').forEach(el => {
    el.addEventListener('input', () => { el.style.borderColor = ''; });
  });

  // ── sticky bar hide on scroll down (mobile) ──────────────────────────────
  const stickyBar = document.getElementById('sticky-bar');
  stickyBar.style.transition = 'transform 0.25s ease';
  let prevY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (window.innerWidth > 768) return;
    const y = window.scrollY;
    stickyBar.style.transform = (y > prevY && y > 180) ? 'translateY(100%)' : '';
    prevY = y;
  }, { passive: true });

  // ── reveal on scroll ─────────────────────────────────────────────────────
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  // ── tab navigation ───────────────────────────────────────────────────────
  const tabs   = Array.from(document.querySelectorAll('[role="tab"]'));
  const panels = document.querySelectorAll('[role="tabpanel"]');

  function activateTab(tab) {
    tabs.forEach(t => {
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    panels.forEach(p => p.setAttribute('hidden', ''));

    tab.setAttribute('aria-selected', 'true');
    tab.removeAttribute('tabindex');
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (panel) panel.removeAttribute('hidden');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (e) => {
      const idx = tabs.indexOf(tab);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = tabs[(idx + 1) % tabs.length];
        activateTab(next);
        next.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
        activateTab(prev);
        prev.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateTab(tab);
      }
    });
  });

  // ── FAQ accordion ──────────────────────────────────────────────────────
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-q').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.classList.add('open');
      }
    });
  });

})();
