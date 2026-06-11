/* ==========================================================================
   CLINIC WEBSITE — MAIN JAVASCRIPT
   ========================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. NAVIGATION — Scroll behavior & mobile menu
     -------------------------------------------------------------------------- */
  const nav = document.querySelector('.nav');
  const menuBtn = document.querySelector('.nav__menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav__close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');

  if (nav) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.add('nav--scrolled');
        nav.classList.remove('nav--transparent');
      } else if (nav.dataset.transparent === 'true') {
        // Only transparent-mode navs (e.g. the home hero) clear their background at the top.
        nav.classList.remove('nav--scrolled');
        nav.classList.add('nav--transparent');
      }
      // Solid navs (inner pages) keep their white background even at the top.
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  function openMobileNav() {
    if (mobileNav) {
      mobileNav.classList.add('mobile-nav--open');
      document.body.style.overflow = 'hidden';
    }
  }
  function closeMobileNav() {
    if (mobileNav) {
      mobileNav.classList.remove('mobile-nav--open');
      document.body.style.overflow = '';
    }
  }

  if (menuBtn) menuBtn.addEventListener('click', openMobileNav);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
  mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileNav));

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileNav(); });

  /* --------------------------------------------------------------------------
     2. REVEAL ON SCROLL — Intersection Observer
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('reveal--visible'));
  }

  /* --------------------------------------------------------------------------
     3. ACTIVE NAV LINK detection
     -------------------------------------------------------------------------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('nav__link--active');
    }
  });

  /* --------------------------------------------------------------------------
     4. SMOOTH SCROLL for anchor links
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 96;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --------------------------------------------------------------------------
     5. ACCORDION (FAQ)
     -------------------------------------------------------------------------- */
  document.querySelectorAll('.accordion__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion__item');
      const panel = item.querySelector('.accordion__panel');
      const isOpen = item.classList.contains('accordion--open');

      document.querySelectorAll('.accordion__item').forEach(i => {
        i.classList.remove('accordion--open');
        const p = i.querySelector('.accordion__panel');
        if (p) p.style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('accordion--open');
        if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* --------------------------------------------------------------------------
     6. COUNTER ANIMATION for statistics
     -------------------------------------------------------------------------- */
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    function update(time) {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased).toLocaleString() + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statNumbers = document.querySelectorAll('.stat-card__number[data-count]');
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target, parseInt(entry.target.dataset.count, 10));
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => statObserver.observe(el));
  }

  /* --------------------------------------------------------------------------
     7. TOAST NOTIFICATIONS
     -------------------------------------------------------------------------- */
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : '!'}</span><span>${message}</span>`;

    Object.assign(toast.style, {
      position: 'fixed', bottom: '24px', left: '50%',
      transform: 'translateX(-50%) translateY(8px)',
      background: type === 'success' ? '#0E4E86' : '#E23B44',
      color: 'white', padding: '14px 24px', borderRadius: '40px',
      fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '500',
      display: 'flex', alignItems: 'center', gap: '8px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)', zIndex: '9999',
      transition: 'opacity 0.3s ease, transform 0.3s ease', opacity: '0',
      maxWidth: 'calc(100vw - 48px)',
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(8px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
  window.showToast = showToast;

  /* --------------------------------------------------------------------------
     8. GENERIC FORM SUBMISSIONS — Simulated (replace with real backend)
     -------------------------------------------------------------------------- */
  function handleFormSubmit(formId, successMsg) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const original = btn ? btn.textContent : '';
      if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
      setTimeout(() => {
        showToast(successMsg || 'Submitted successfully!', 'success');
        form.reset();
        if (btn) { btn.textContent = original; btn.disabled = false; }
      }, 1200);
    });
  }

  handleFormSubmit('contact-form', 'Your message has been sent. Our team will respond shortly.');
  handleFormSubmit('newsletter-form', 'You\'re subscribed to our health newsletter!');
  handleFormSubmit('callback-form', 'Thank you! A care coordinator will call you back soon.');

  /* --------------------------------------------------------------------------
     9. EVENTS / SERVICES — Tab filter
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('[data-filter]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('btn--primary'));
      filterBtns.forEach(b => b.classList.add('btn--secondary'));
      btn.classList.add('btn--primary');
      btn.classList.remove('btn--secondary');

      document.querySelectorAll('[data-category]').forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
      });
    });
  });

  /* --------------------------------------------------------------------------
     10. DOCTOR / ARTICLE SEARCH
     -------------------------------------------------------------------------- */
  function wireSearch(inputId, cardSelector, fieldSelectors) {
    const input = document.querySelector(inputId);
    if (!input) return;
    const cards = document.querySelectorAll(cardSelector);
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      cards.forEach(card => {
        const text = fieldSelectors
          .map(s => card.querySelector(s)?.textContent.toLowerCase() || '')
          .join(' ');
        card.style.display = (!q || text.includes(q)) ? '' : 'none';
      });
    });
  }
  wireSearch('#doctor-search', '.doctor-card', ['.doctor-card__name', '.doctor-card__specialty']);
  wireSearch('#article-search', '.article-card', ['.article-card__title', '.article-card__excerpt']);

  /* --------------------------------------------------------------------------
     11. APPOINTMENT BOOKING — Multi-step engine (signature feature)
     -------------------------------------------------------------------------- */
  const booking = document.querySelector('.booking');
  if (booking) initBooking(booking);

  /* --------------------------------------------------------------------------
     12. FLOATING WHATSAPP — reveal after 2s with a gentle pop
     -------------------------------------------------------------------------- */
  const waFloat = document.querySelector('.whatsapp-float');
  if (waFloat) {
    setTimeout(() => waFloat.classList.add('whatsapp-float--show'), 2000);
  }

  /* --------------------------------------------------------------------------
     13. IMAGE FADE-IN ON LOAD
     -------------------------------------------------------------------------- */
  document.querySelectorAll('img[data-fade]').forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('is-loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('is-loaded'));
      img.addEventListener('error', () => img.classList.add('is-loaded'));
    }
  });

  function initBooking(root) {
    const panels = Array.from(root.querySelectorAll('.booking__panel'));
    const steps = Array.from(root.querySelectorAll('.booking__step'));
    const success = root.querySelector('.booking__success');
    const stepperWrap = root.querySelector('.booking__steps');
    const bodyWrap = root.querySelector('.booking__body');

    let current = 0;
    const state = { service: null, doctor: null, date: null, time: null,
                    name: '', phone: '', email: '', notes: '', newPatient: null };

    /* ---- Build date scroller dynamically (next 14 days, skip Sundays) ---- */
    const dateScroller = root.querySelector('.date-scroller');
    if (dateScroller) {
      const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const base = new Date();
      let added = 0, offset = 1;
      while (added < 12) {
        const d = new Date(base);
        d.setDate(base.getDate() + offset);
        offset++;
        // SkyHigh is open 24/7, every day — all dates are bookable.
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'date-pill';
        pill.dataset.date = `${dow[d.getDay()]}, ${mon[d.getMonth()]} ${d.getDate()}`;
        pill.innerHTML = `
          <div class="date-pill__dow">${dow[d.getDay()]}</div>
          <div class="date-pill__day">${d.getDate()}</div>
          <div class="date-pill__mon">${mon[d.getMonth()]}</div>`;
        pill.addEventListener('click', () => {
          dateScroller.querySelectorAll('.date-pill').forEach(p => p.classList.remove('date-pill--selected'));
          pill.classList.add('date-pill--selected');
          state.date = pill.dataset.date;
          revealTimes();
          validateStep();
        });
        dateScroller.appendChild(pill);
        added++;
      }
    }

    /* ---- Time slots ---- */
    const timeGrid = root.querySelector('.time-grid');
    const timeWrap = root.querySelector('[data-time-wrap]');
    function revealTimes() {
      if (timeWrap) timeWrap.style.display = 'block';
      if (!timeGrid) return;
      timeGrid.querySelectorAll('.time-slot--selected').forEach(s => s.classList.remove('time-slot--selected'));
      state.time = null;
    }
    if (timeGrid) {
      timeGrid.querySelectorAll('.time-slot').forEach(slot => {
        if (slot.classList.contains('time-slot--unavailable')) return;
        slot.addEventListener('click', () => {
          timeGrid.querySelectorAll('.time-slot').forEach(s => s.classList.remove('time-slot--selected'));
          slot.classList.add('time-slot--selected');
          state.time = slot.textContent.trim();
          validateStep();
        });
      });
    }

    /* ---- Option tiles (service + doctor steps) ---- */
    root.querySelectorAll('.option-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const group = tile.dataset.group; // 'service' or 'doctor'
        root.querySelectorAll(`.option-tile[data-group="${group}"]`)
            .forEach(t => t.classList.remove('option-tile--selected'));
        tile.classList.add('option-tile--selected');
        state[group] = tile.dataset.value;
        validateStep();
      });
    });

    /* ---- Detail inputs ---- */
    const fldName  = root.querySelector('#bk-name');
    const fldPhone = root.querySelector('#bk-phone');
    const fldEmail = root.querySelector('#bk-email');
    const fldNotes = root.querySelector('#bk-notes');
    [fldName, fldPhone, fldEmail, fldNotes].forEach(f => {
      if (f) f.addEventListener('input', () => {
        state.name = fldName?.value.trim() || '';
        state.phone = fldPhone?.value.trim() || '';
        state.email = fldEmail?.value.trim() || '';
        state.notes = fldNotes?.value.trim() || '';
        validateStep();
      });
    });
    root.querySelectorAll('input[name="bk-newpatient"]').forEach(r => {
      r.addEventListener('change', () => { state.newPatient = r.value; validateStep(); });
    });

    /* ---- Navigation buttons ---- */
    const nextBtns = root.querySelectorAll('[data-booking-next]');
    const prevBtns = root.querySelectorAll('[data-booking-prev]');
    nextBtns.forEach(b => b.addEventListener('click', () => goTo(current + 1)));
    prevBtns.forEach(b => b.addEventListener('click', () => goTo(current - 1)));

    const confirmBtn = root.querySelector('[data-booking-confirm]');
    if (confirmBtn) confirmBtn.addEventListener('click', () => {
      if (!validateStep()) return;
      confirmBtn.textContent = 'Confirming...';
      confirmBtn.disabled = true;
      setTimeout(() => {
        renderSummary();
        if (stepperWrap) stepperWrap.style.display = 'none';
        if (bodyWrap) bodyWrap.style.display = 'none';
        if (success) success.classList.add('booking__success--active');
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 1200);
    });

    /* ---- Step transitions ---- */
    function goTo(index) {
      if (index < 0 || index >= panels.length) return;
      if (index > current && !validateStep()) {
        showToast('Please complete this step before continuing.', 'error');
        return;
      }
      current = index;
      panels.forEach((p, i) => p.classList.toggle('booking__panel--active', i === current));
      steps.forEach((s, i) => {
        s.classList.toggle('booking__step--active', i === current);
        s.classList.toggle('booking__step--done', i < current);
      });
      if (current === panels.length - 1) renderSummary();
      validateStep();
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* ---- Per-step validation gates the Next/Confirm button ---- */
    function validateStep() {
      let ok = true;
      switch (current) {
        case 0: ok = !!state.service; break;
        case 1: ok = !!state.doctor; break;
        case 2: ok = !!state.date && !!state.time; break;
        case 3: ok = state.name && state.phone && state.email && state.newPatient; break;
        default: ok = true;
      }
      const activePanel = panels[current];
      if (activePanel) {
        const advance = activePanel.querySelector('[data-booking-next], [data-booking-confirm]');
        if (advance) {
          advance.disabled = !ok;
          advance.style.opacity = ok ? '1' : '0.5';
          advance.style.cursor = ok ? 'pointer' : 'not-allowed';
        }
      }
      return ok;
    }

    /* ---- Summary render ---- */
    function renderSummary() {
      const map = {
        '[data-sum-service]': state.service || '—',
        '[data-sum-doctor]': state.doctor || 'No preference',
        '[data-sum-date]': state.date || '—',
        '[data-sum-time]': state.time || '—',
        '[data-sum-name]': state.name || '—',
        '[data-sum-phone]': state.phone || '—',
        '[data-sum-email]': state.email || '—',
        '[data-sum-patient]': state.newPatient || '—',
      };
      Object.entries(map).forEach(([sel, val]) => {
        root.querySelectorAll(sel).forEach(el => el.textContent = val);
      });
    }

    validateStep();
  }

})();
