(function () {
  'use strict';

  // ── constants ─────────────────────────────────────────────────────────────
  const MOBILE_BREAKPOINT     = 768;
  const SCROLL_HIDE_THRESHOLD = 180;
  const SCROLL_OFFSET         = 80;
  const REVEAL_THRESHOLD      = 0.1;
  const ERROR_BORDER_COLOR    = 'var(--color-error)';
  const REQUIRED_FIELDS = ['f-first','f-last','f-phone','f-year','f-make','f-model','f-service','f-issue','f-date','f-time'];

  // ── data ──────────────────────────────────────────────────────────────────
  const REVIEWS = [
    {
      name: 'Dillon', avatar: 'avatar-1', featured: true,
      text: 'Brought my car in because it had a whining noise. They diagnosed it as the transmission and helped source a good quality replacement at a reasonable price. The turnaround time for the install was quick and they kept me updated throughout the process.'
    },
    {
      name: 'Arpit', avatar: 'avatar-2', featured: true,
      text: 'Great service, fair pricing, and they got my car back on the road quickly — highly recommend!'
    },
    {
      name: 'Patrick', avatar: 'avatar-3', featured: true,
      text: 'The team was great, they took their time with reviewing my Honda Ridgeline’s engine noise and then explaining it.'
    },
    {
      name: 'Aesha', avatar: 'avatar-5', featured: false,
      text: 'Best in the business!!'
    },
    {
      name: 'Sehaj', avatar: 'avatar-6', featured: false,
      text: 'Best place to get any services done to your vehicle. The team is exceptional and know what they are doing.'
    },
  ];

  const ISSUE_CARDS = [
    {
      title: 'Car making a noise',
      desc: 'Whining, grinding, clunking, rattling, or humming sounds while driving or turning.',
      service: 'Diagnostics / Not sure', analytics: 'revworks_issue_noise_click', cta: 'Start with a diagnostic',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"/><path d="M17.5 3.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 7.5-7.5z"/></svg>',
    },
    {
      title: 'Warning light is on',
      desc: 'Check engine light, battery light, oil light, ABS, or other dashboard warnings.',
      service: 'Diagnostics / Not sure', analytics: 'revworks_issue_warning_light_click', cta: 'Check the warning light',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    },
    {
      title: 'Brakes feel off',
      desc: 'Squeaking, shaking, soft pedal, grinding, or longer stopping distance.',
      service: 'Brakes', analytics: 'revworks_issue_brakes_click', cta: 'Inspect my brakes',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',
    },
    {
      title: 'Car shaking or pulling',
      desc: 'Vibration, pulling to one side, rough ride, or steering feel changes.',
      service: 'Suspension', analytics: 'revworks_issue_shaking_click', cta: 'Check steering/suspension',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>',
    },
    {
      title: 'A/C or heat not working',
      desc: 'A/C not cold, heat not warm, weak airflow, or unusual cabin smells.',
      service: 'A/C & Heating', analytics: 'revworks_issue_ac_heat_click', cta: 'Fix A/C or heat',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
    },
    {
      title: 'Leak under the car',
      desc: 'Oil, coolant, transmission fluid, or unknown fluid showing under the vehicle.',
      service: 'Diagnostics / Not sure', analytics: 'revworks_issue_leak_click', cta: 'Find the leak',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
    },
    {
      title: 'Due for maintenance',
      desc: 'Oil change, filters, spark plugs, fluids, belts, or seasonal maintenance.',
      service: 'Oil Change', analytics: 'revworks_issue_maintenance_click', cta: 'Book maintenance',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    },
    {
      title: 'Not sure what’s wrong',
      desc: 'Describe what you’re feeling, hearing, seeing, or smelling. We’ll help from there.',
      service: 'Diagnostics / Not sure', analytics: 'revworks_issue_unsure_click', cta: 'Help me figure it out',
      highlighted: true,
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    },
  ];

  const SERVICE_CARDS = [
    {
      heading: 'Diagnostics',
      desc: 'Warning lights, noises, leaks, and drivability checks.',
      img: './images/service-diagnostics.jpg',
      imgAlt: 'Mechanic using diagnostic scanner on a vehicle',
      service: 'Diagnostics / Not sure', analytics: 'revworks_service_diagnostics_click', cta: 'Start with diagnostics',
      icon: '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="22" height="15" rx="2"/><path d="M8 25H20M14 20V25"/><path d="M7.5 14.5l3-4 4 5 3-4 3 2.5"/></svg>',
    },
    {
      heading: 'Oil Changes',
      desc: 'Routine oil and filter maintenance.',
      img: null,
      service: 'Oil Change', analytics: 'revworks_service_oil_change_click', cta: 'Book oil change',
      icon: '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2C14 2 6 11 6 17a8 8 0 0016 0c0-6-8-15-8-15z"/><path d="M10.5 19a3.5 3.5 0 003.5 2.5"/></svg>',
    },
    {
      heading: 'Brakes',
      desc: 'Brake inspections and repair work.',
      img: './images/service-brakes.jpg',
      imgAlt: 'Mechanic servicing brake components',
      service: 'Brakes', analytics: 'revworks_service_brakes_click', cta: 'Check my brakes',
      icon: '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="14" cy="14" r="11"/><circle cx="14" cy="14" r="4.5"/><path d="M14 3v4M14 21v4M3 14h4M21 14h4"/></svg>',
    },
    {
      heading: 'A/C &amp; Heating',
      desc: 'A/C and cabin heat performance checks.',
      img: null,
      service: 'A/C & Heating', analytics: 'revworks_service_ac_heating_click', cta: 'Fix A/C or heat',
      icon: '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14s0-6 10-6 10 6 10 6-4 6-10 6S4 14 4 14z"/><path d="M18 14l4-4M6 14l4-4M18 14l4 4M6 14l4 4"/></svg>',
    },
    {
      heading: 'Suspension',
      desc: 'Ride, steering, and suspension concerns.',
      img: null,
      service: 'Suspension', analytics: 'revworks_service_suspension_click', cta: 'Check suspension',
      icon: '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 4.5a4.5 4.5 0 00-4.08 6.45L6 20.37A2.5 2.5 0 009.63 24l9.37-9.42A4.5 4.5 0 1019.5 4.5z"/><path d="M19.5 6.5l2 2"/></svg>',
    },
    {
      heading: 'Inspections',
      desc: 'Pre-purchase and safety-focused inspections.',
      img: null,
      service: 'Inspection', analytics: 'revworks_service_inspection_click', cta: 'Request inspection',
      icon: '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="16" height="22" rx="2"/><path d="M10 3v3h8V3"/><path d="M10 15l3 3 6-6"/></svg>',
    },
    {
      heading: 'General Repairs',
      desc: 'Common repair and replacement work.',
      img: null,
      service: 'General Repair', analytics: 'revworks_service_general_repairs_click', cta: 'Request repair',
      icon: '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 4.5a4.5 4.5 0 00-4.08 6.45L6 20.37A2.5 2.5 0 009.63 24l9.37-9.42A4.5 4.5 0 1019.5 4.5z"/><path d="M19.5 6.5l2 2"/></svg>',
    },
  ];

  // ── render functions ──────────────────────────────────────────────────────
  function renderReviews() {
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;
    grid.innerHTML = REVIEWS.map(r => {
      const initial = r.name[0];
      const starsClass = r.featured ? 'rcard-stars' : 'rcard-stars stars-small';
      const cardClass  = r.featured ? 'rcard rcard-featured' : 'rcard';
      return `
        <article class="${cardClass}" role="listitem" aria-label="Review by ${r.name}, 5 stars">
          <div class="${starsClass}" aria-label="5 out of 5 stars"><span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
          <p class="rcard-text">“${r.text}”</p>
          <footer class="rcard-footer">
            <div class="rcard-avatar ${r.avatar}" aria-hidden="true">${initial}</div>
            <div>
              <div class="rcard-name">${r.name}</div>
              <div class="rcard-source">&#9733;&#9733;&#9733;&#9733;&#9733; &middot; Google Review</div>
            </div>
          </footer>
        </article>`;
    }).join('');
  }

  function renderIssueCards() {
    const grid = document.querySelector('#panel-symptom .issues-grid');
    if (!grid) return;
    grid.innerHTML = ISSUE_CARDS.map(c => {
      const cardClass = c.highlighted ? 'issue-card issue-card-highlight' : 'issue-card';
      return `
        <div class="${cardClass}">
          <div class="issue-icon" aria-hidden="true">${c.icon}</div>
          <h3 class="issue-title">${c.title}</h3>
          <p class="issue-desc">${c.desc}</p>
          <a href="#booking" class="issue-cta" data-service="${c.service}"
             data-analytics="${c.analytics}">${c.cta} &rarr;</a>
        </div>`;
    }).join('');
  }

  function renderServiceCards() {
    const grid = document.querySelector('#panel-service .services-grid');
    if (!grid) return;
    grid.innerHTML = SERVICE_CARDS.map(c => {
      const imgStrip = c.img
        ? `<div class="svc-img-strip">
             <img src="${c.img}" alt="${c.imgAlt || ''}" width="1260" height="840" loading="lazy" decoding="async" />
           </div>`
        : '';
      return `
        <div class="service-card">
          ${imgStrip}
          <div class="svc-icon" aria-hidden="true">${c.icon}</div>
          <h3>${c.heading}</h3>
          <p>${c.desc}</p>
          <a href="#booking" class="svc-cta" data-service="${c.service}"
             data-analytics="${c.analytics}">${c.cta} &rarr;</a>
        </div>`;
    }).join('');
  }

  // run renders before any event listeners (DOM containers must exist)
  renderReviews();
  renderIssueCards();
  renderServiceCards();

  // ── year ──────────────────────────────────────────────────────────────────
  document.getElementById('yr').textContent = new Date().getFullYear();

  // ── hamburger / drawer ────────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('nav-drawer');
  const overlay   = document.getElementById('nav-overlay');

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

  // ── defensive internal anchor scrolling ───────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      if (drawer.classList.contains('open')) closeDrawer();

      const nav = document.getElementById('nav');
      const offset = nav ? nav.offsetHeight + 12 : SCROLL_OFFSET;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', targetId);
    });
  });

  // ── service CTA: scroll to booking + preselect ────────────────────────────
  function scrollToBookingWithService(serviceValue) {
    const section = document.getElementById('booking');
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
    if (serviceValue) {
      const select = document.getElementById('f-service');
      if (select) {
        const match = Array.from(select.options).find(o => o.value === serviceValue);
        if (match) select.value = serviceValue;
      }
    }
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-service]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href && href.startsWith('#booking')) {
      e.preventDefault();
      scrollToBookingWithService(link.dataset.service);
    }
  });

  // ── booking form ──────────────────────────────────────────────────────────
  document.getElementById('form-submit').addEventListener('click', () => {
    const activeBtn = document.querySelector('.drive-btn.active');
    let valid = !!activeBtn;

    REQUIRED_FIELDS.forEach(id => {
      const el = document.getElementById(id);
      const empty = !el.value.trim();
      el.style.borderColor = empty ? ERROR_BORDER_COLOR : '';
      if (empty) valid = false;
    });

    if (!activeBtn) {
      document.querySelectorAll('.drive-btn').forEach(b => {
        b.style.outlineColor = ERROR_BORDER_COLOR;
        b.style.outlineWidth = '1px';
        b.style.outlineStyle = 'solid';
      });
    }

    if (!valid) return;

    document.getElementById('form-body').style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
    const top = document.getElementById('booking').offsetTop - SCROLL_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  });

  document.getElementById('form-reset').addEventListener('click', () => {
    document.getElementById('form-body').style.display = 'block';
    document.getElementById('form-success').style.display = 'none';
    REQUIRED_FIELDS.forEach(id => {
      const el = document.getElementById(id);
      el.value = '';
      el.style.borderColor = '';
    });
    const email = document.getElementById('f-email');
    if (email) { email.value = ''; }
    document.querySelectorAll('.drive-btn').forEach(b => {
      b.classList.remove('active');
      b.style.outlineColor = '';
      b.style.outlineWidth = '';
      b.style.outlineStyle = '';
    });
  });

  document.querySelectorAll('.drive-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.drive-btn').forEach(b => {
        b.classList.toggle('active', b === btn);
        b.style.outlineColor = '';
        b.style.outlineWidth = '';
        b.style.outlineStyle = '';
      });
    });
  });

  // clear red border on input
  document.querySelectorAll('.field-input').forEach(el => {
    el.addEventListener('input', () => { el.style.borderColor = ''; });
  });

  // ── sticky bar: hide on scroll down (mobile) ──────────────────────────────
  const stickyBar = document.getElementById('sticky-bar');
  stickyBar.style.transition = 'transform 0.25s ease';
  let prevY = window.scrollY;

  let _scrollTimer;
  function handleScroll() {
    if (window.innerWidth > MOBILE_BREAKPOINT) return;
    const y = window.scrollY;
    stickyBar.style.transform = (y > prevY && y > SCROLL_HIDE_THRESHOLD) ? 'translateY(100%)' : '';
    prevY = y;
  }

  window.addEventListener('scroll', function () {
    clearTimeout(_scrollTimer);
    _scrollTimer = setTimeout(handleScroll, 10);
  }, { passive: true });

  // ── reveal on scroll ──────────────────────────────────────────────────────
  const revealElements = Array.from(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: REVEAL_THRESHOLD,
    });
    revealElements.forEach((el) => obs.observe(el));
    window.setTimeout(() => {
      revealElements.forEach((el) => el.classList.add('visible'));
    }, 1500);
  } else {
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  // ── tab navigation ────────────────────────────────────────────────────────
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
        activateTab(next); next.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
        activateTab(prev); prev.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateTab(tab);
      }
    });
  });

  // ── FAQ accordion ─────────────────────────────────────────────────────────
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
