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
      name: 'Dillon M.', featured: true,
      text: 'Brought my car in because it had a whining noise. They diagnosed it as the transmission and helped source a good quality replacement at a reasonable price. The turnaround time for the install was quick and they kept me updated throughout the process.'
    },
    {
      name: 'Arpit S.', featured: true,
      text: 'Great service, fair pricing, and they got my car back on the road quickly — highly recommend!'
    },
    {
      name: 'Patrick D.', featured: true,
      text: 'The team was great, they took their time with reviewing my Honda Ridgeline’s engine noise and then explaining it.'
    },
  ];

  const ISSUE_CARDS = [
    {
      title: 'Warning light is on',
      desc: 'Check engine, ABS, battery, or oil light.',
      service: 'Diagnostics / Not sure', analytics: 'revworks_issue_warning_light_click', cta: 'Warning light',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    },
    {
      title: 'Brake noise',
      desc: 'Squealing, scraping, or grinding when braking.',
      service: 'Brakes', analytics: 'revworks_issue_brakes_click', cta: 'Brake noise',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',
    },
    {
      title: 'Vibration',
      desc: 'Shaking in the wheel, seat, or pedal.',
      service: 'Suspension', analytics: 'revworks_issue_shaking_click', cta: 'Vibration',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>',
    },
    {
      title: 'Fluid leak',
      desc: 'Spots or drips under the car.',
      service: 'Diagnostics / Not sure', analytics: 'revworks_issue_leak_click', cta: 'Fluid leak',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
    },
    {
      title: 'Whining or grinding noise',
      desc: 'Noise while accelerating, turning, or idling.',
      service: 'Diagnostics / Not sure', analytics: 'revworks_issue_noise_click', cta: 'Whining or grinding',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"/><path d="M17.5 3.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 7.5-7.5z"/></svg>',
    },
    {
      title: 'AC not cold',
      desc: 'Weak cooling or warm air from vents.',
      service: 'A/C & Heating', analytics: 'revworks_issue_ac_heat_click', cta: 'AC not cold',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
    },
    {
      title: 'Car won’t start',
      desc: 'No crank, slow crank, or clicking.',
      service: 'Diagnostics / Not sure', analytics: 'revworks_issue_no_start_click', cta: 'Car won’t start',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/><circle cx="12" cy="12" r="10"/></svg>',
    },
    {
      title: 'Not sure what’s wrong',
      desc: 'We can start with diagnostics.',
      service: 'Diagnostics / Not sure', analytics: 'revworks_issue_unsure_click', cta: 'Not sure / diagnostics',
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
      heading: 'Oil changes',
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
      heading: 'General repair',
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
      const starsClass = r.featured ? 'rcard-stars' : 'rcard-stars stars-small';
      const cardClass  = r.featured ? 'rcard rcard-featured' : 'rcard';
      return `
        <article class="${cardClass}" role="listitem" aria-label="Review by ${r.name}, 5 stars">
          <div class="rcard-name">${r.name}</div>
          <div class="${starsClass}" aria-label="5 out of 5 stars"><span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
          <p class="rcard-text">“${r.text}”</p>
          <footer class="rcard-footer">
            <div class="rcard-source">Google review</div>
          </footer>
        </article>`;
    }).join('');
  }

  function renderIssueCards() {
    const grid = document.querySelector('#services .issues-grid');
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
    const grid = document.querySelector('#services .services-grid');
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
      const issueInput = document.getElementById('f-issue');
      if (select) {
        const match = Array.from(select.options).find(o => o.value === serviceValue);
        if (match) select.value = serviceValue;
      }
      if (issueInput && !issueInput.value.trim()) {
        issueInput.placeholder = `Tell us more about: ${serviceValue.toLowerCase()}.`;
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

    const formBody = document.getElementById('form-body');
    const success = document.getElementById('form-success');
    formBody.style.display = 'none';
    success.hidden = false;
    success.setAttribute('aria-hidden', 'false');
    success.focus();
    const top = document.getElementById('booking').offsetTop - SCROLL_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  });

  document.getElementById('form-reset').addEventListener('click', () => {
    const formBody = document.getElementById('form-body');
    const success = document.getElementById('form-success');
    formBody.style.display = 'block';
    success.hidden = true;
    success.setAttribute('aria-hidden', 'true');
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
