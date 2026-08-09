/* =====================================================================
   AMBER BEAUTY — ванильный JS
   ===================================================================== */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const isMobile = () => window.matchMedia('(max-width:760px)').matches;
  /* тач-устройства без hover (телефоны И планшеты 761–1024px) — раскрытие поповеров тапом */
  const canTap = () => window.matchMedia('(hover:none), (pointer:coarse)').matches;
  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* -------- год в футере -------- */
  $('#year').textContent = new Date().getFullYear();

  /* -------- УСЛУГИ: данные (легко добавить новую карточку) -------- */
  const SERVICES = [
    {
      icon: 'drop', title: 'Чистые волосы', price: '1 500 ₽', short: 'Мытьё головы и форма феном.',
      detail: 'Мытьё головы и придание формы волосам с помощью фена — без использования термоинструментов. Идеально как экспресс-освежение образа.'
    },
    {
      icon: 'wave', title: 'Укладки', price: 'от 2 000 ₽', short: 'От повседневных до коктейльных.',
      detail: 'Короткие и средние волосы — от 2 000 ₽. С термоинструментами — 2 500 ₽. Длинные волосы — 3 000 ₽. В стоимость входит мытьё головы и укладочные средства.'
    },
    {
      icon: 'scissors', title: 'Стрижки', price: 'от 3 000 ₽', short: 'Разной сложности.',
      detail: 'Стрижки разной сложности — от 3 000 ₽. Точная форма под структуру и образ жизни, с учётом типа волос.'
    },
    {
      icon: 'palette', title: 'Окрашивание в тон', price: 'от 6 000 ₽', short: 'Живой, ухоженный цвет.',
      detail: 'Окрашивание в тон — от 6 000 ₽. Ровный, естественный цвет с сохранением здоровья волос.'
    },
    {
      icon: 'sparkle', title: 'Airtouch', price: '15 000–20 000 ₽', short: 'Сложная растяжка цвета.',
      detail: 'Окрашивание в технике Airtouch — 15 000–20 000 ₽. Многоуровневая растяжка с плавными переходами и естественным сиянием.'
    },
    /* ДОБАВИТЬ УСЛУГУ: скопируйте объект выше и измените поля. Сетка подстроится сама. */
  ];
  const ICONS = {
    drop: '<path d="M12 3s6 6.6 6 11a6 6 0 1 1-12 0c0-4.4 6-11 6-11Z"/>',
    wave: '<path d="M3 8c3-3 6 3 9 0s6 3 9 0M3 14c3-3 6 3 9 0s6 3 9 0"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8.5 20 20M8.5 15.5 20 4"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.9 1.5-1.6 0-1.3-1-1.7-1-2.6 0-.6.5-1 1.2-1H15a5 5 0 0 0 5-5c0-4-3.6-6.8-8-6.8Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16.5" cy="11" r="1"/>',
    sparkle: '<path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18"/>'
  };
  const grid = $('#servicesGrid');
  grid.innerHTML = SERVICES.map(s => `
      <article class="service" tabindex="0">
        <div class="s-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[s.icon] || ''}</svg></div>
        <h3>${s.title}</h3>
        <p class="s-desc">${s.short}</p>
        <div class="s-price"><b>${s.price}</b></div>
        <span class="s-hint">
          <svg class="cursor" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m4 4 6 16 2.5-6.5L19 11 4 4Z"/></svg>
          Наведи, чтобы узнать больше
        </span>
        <div class="s-pop">
          <button class="s-close" aria-label="Закрыть" type="button">×</button>
          <h4>${s.title}</h4>
          <p>${s.detail}</p>
          <div class="s-price"><b>${s.price}</b></div>
        </div>
      </article>`).join('');

  /* на мобилке поповер услуги раскрывается тапом */
  $$('.service').forEach(card => {
    card.addEventListener('click', e => {
      if (!canTap()) return;
      if (e.target.closest('.s-close')) { card.classList.remove('active'); return; }
      $$('.service').forEach(c => c !== card && c.classList.remove('active'));
      card.classList.toggle('active');
    });
  });

  /* -------- ШАПКА: фон при скролле + прогресс + кнопка наверх -------- */
  const header = $('#header'), progress = $('#progress'), toTop = $('#toTop');
  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle('scrolled', y > 30);
    toTop.classList.toggle('show', y > 600);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h * 100) : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
});

  /* -------- плавный скролл с учётом высоты шапки -------- */
  function scrollToSel(sel) {
    const el = $(sel); if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  }
  $$('[data-scroll]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); scrollToSel(b.dataset.scroll); closeNav(); }));
  $$('.nav a.nav-link').forEach(a => a.addEventListener('click', e => { e.preventDefault(); scrollToSel(a.getAttribute('href')); closeNav(); }));
  $('#logo').addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
  

  /* -------- мобильное меню -------- */
  const burger = $('#burger'), nav = $('#nav');
  function closeNav() { nav.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  /* -------- МОДАЛКА «Запись» -------- */
  const modal = $('#bookingModal');
  const modalCard = $('.modal-card', modal);
  const landmarks = [$('#header'), $('main'), $('.site-footer')].filter(Boolean);
  let lastFocused = null;
  function focusables() {
    return $$('a[href], button, input, textarea, [tabindex]:not([tabindex="-1"])', modalCard)
      .filter(el => !el.disabled && el.offsetParent !== null);
  }
  function openModal() {
    lastFocused = document.activeElement;
    modal.removeAttribute('inert');           /* включаем интерактивность окна */
    modal.classList.add('open'); document.body.style.overflow = 'hidden';
    landmarks.forEach(el => el.setAttribute('aria-hidden', 'true')); /* фон изолируем от AT */
    var f = focusables(); (f[0] || modalCard).focus();
  }
  function closeModal() {
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open'); document.body.style.overflow = '';
    modal.setAttribute('inert', '');           /* убираем из tab/AT, когда закрыто */
    landmarks.forEach(el => el.removeAttribute('aria-hidden'));
    if (lastFocused && lastFocused.focus) lastFocused.focus(); /* возврат фокуса на триггер */
  }
  /* «Запись»: открыть окно + подвести страницу к контактам (по ТЗ) */
  $('#openBooking').addEventListener('click', () => { scrollToSel('#booking'); openModal(); closeNav(); });
  $$('[data-close]', modal).forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Tab') { /* фокус-ловушка внутри окна */
      var f = focusables(); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* -------- ПОДРОБНЕЕ (сворачивание текста) -------- */
  const aboutToggle = $('#aboutToggle'), extra = $('#rmExtra');
  aboutToggle.addEventListener('click', () => {
    const open = !extra.classList.contains('open');
    extra.classList.toggle('open', open); /* плавная анимация max-height/opacity */
    aboutToggle.querySelector('span').textContent = open ? 'Свернуть' : 'Читать далее';
    aboutToggle.classList.toggle('open', open);
    aboutToggle.setAttribute('aria-expanded', String(open));
  });

  /* -------- фото мастера / работ: тап-контакты на мобилке -------- */
  $$('[data-tap-info]').forEach(el => {
    el.addEventListener('click', () => { if (canTap()) el.classList.toggle('active'); });
    /* клавиатура: Enter/Space раскрывает у фокусируемых карточек (напр. фото мастера) */
    el.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && el.hasAttribute('tabindex')) { e.preventDefault(); el.classList.toggle('active'); }
    });
  });

  /* -------- ФОРМА (без БД, «отправка на почту» — заглушка) -------- */
  const form = $('#bookingForm'), success = $('#formSuccess');
  const submitBtn = form.querySelector('.btn-submit');
  let successTimer = null;
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    /* TODO: здесь будет реальная отправка заявки на e-mail владельца.
       Пока — заглушка: показываем подтверждение и полностью сбрасываем состояние. */
    success.classList.add('show');
    submitBtn.textContent = 'Отправлено ✓';
    clearTimeout(successTimer);
    setTimeout(() => { form.reset(); submitBtn.textContent = 'Оставить заявку'; }, 500);
    successTimer = setTimeout(() => { success.classList.remove('show'); }, 6000);
  });

  /* -------- МОДАЛКА «Позвонить» -------- */
const callModal = $('#callModal');
const openCallBtn = $('#openCall');

function openCallModal() {
  callModal.removeAttribute('inert');
  callModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCallModal() {
  if (!callModal.classList.contains('open')) return;
  callModal.classList.remove('open');
  callModal.setAttribute('inert', '');
  document.body.style.overflow = '';
}

openCallBtn.addEventListener('click', openCallModal);

$$('[data-close-call]', callModal).forEach(el => {
  el.addEventListener('click', closeCallModal);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && callModal.classList.contains('open')) {
    closeCallModal();
  }
});

  /* -------- REVEAL при скролле (IntersectionObserver) -------- */
  const reveals = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* -------- анимированные счётчики -------- */
  const counters = $$('[data-count]');
  const runCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const span = el.querySelector('span') || el;
    const dur = reduce ? 0 : 1400; const t0 = performance.now();
    const fmt = n => Math.round(n).toLocaleString('ru-RU');
    function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      span.textContent = fmt(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { runCount(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.5 });
    counters.forEach(el => co.observe(el));
  } else { counters.forEach(runCount); }

  /* -------- SCROLL-SPY (активный пункт меню) -------- */
  const sections = ['about', 'works', 'services', 'masters', 'booking'].map(id => $('#' + id)).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const id = en.target.id;
        $$('.nav a.nav-link').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      }
    });
  }, { threshold: 0.4, rootMargin: '-20% 0px -40% 0px' });
  sections.forEach(s => spy.observe(s));

  /* -------- ПАРАЛЛАКС фоновых фигур (пассивная scroll-анимация) -------- */
  const parallax = $$('[data-parallax]');
  if (!reduce && !isMobile()) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        if (isMobile()) { ticking = false; return; } /* на мобилке параллакс отключаем на лету */
        const y = window.scrollY;
        parallax.forEach(el => { el.style.transform = `translateY(${y * parseFloat(el.dataset.parallax)}px)`; });
        ticking = false;
      });
    }, { passive: true });
  }
})();