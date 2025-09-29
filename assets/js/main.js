const state = {
  config: null,
  testimonialIndex: 0,
  testimonialInterval: null,
  navOpen: false,
};

const selectors = {
  navLinks: '[data-nav-links]',
  menuToggle: '[data-menu-toggle]',
  themeToggle: '[data-theme-toggle]',
  metrics: '[data-metrics]',
  services: '[data-services]',
  process: '[data-process]',
  testimonialsTrack: '[data-testimonials-track]',
  testimonialsWrapper: '[data-testimonials]',
  portfolioPreview: '[data-portfolio-preview]',
  portfolio: '[data-portfolio]',
  portfolioFilters: '[data-portfolio-filters]',
  pricing: '[data-pricing]',
  maintenance: '[data-maintenance]',
  maintenanceFeatures: '[data-maintenance-features]',
  quoteForm: '[data-quote-form]',
  submitButton: '[data-submit-button]',
  formSelect: '[data-form-select]',
  formSuccess: '[data-form-success]',
  formError: '[data-form-error]',
  contactBlocks: '[data-contact]',
};

async function loadConfig() {
  try {
    const res = await fetch('/assets/data/site-config.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Impossible de charger la configuration');
    const data = await res.json();
    state.config = data;
    applyConfig();
  } catch (error) {
    console.warn('[Aurium] Config non chargée', error);
  }
}

function applyConfig() {
  if (!state.config) return;
  updateMeta();
  populateHeroBadges();
  populateMetrics();
  populateServices();
  populateProcess();
  populateTestimonials();
  populatePortfolioPreview();
  populatePortfolio();
  populatePortfolioFilters();
  populatePricing();
  populateMaintenance();
  populateFormSelects();
  populateContacts();
  setupCounters();
  setupAnimations();
}

function updateMeta() {
  const { seo } = state.config;
  if (!seo) return;
  const pathname = window.location.pathname;
  const isHome = pathname === '/' || pathname.endsWith('/index.html');
  if (isHome && seo.title) document.title = seo.title;
  if (isHome && seo.description) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', seo.description);
  }
}

function populateHeroBadges() {
  const heroMetrics = document.getElementById('hero-metrics');
  if (!heroMetrics || !state.config.metrics) return;
  heroMetrics.innerHTML = '';
  state.config.metrics.forEach((metric) => {
    const badge = document.createElement('div');
    badge.className = 'badge-pill';
    const prefix = metric.prefix ?? '';
    const suffix = metric.suffix ?? '';
    badge.innerHTML = `<strong>${prefix}${metric.value}${suffix}</strong> ${metric.label}`;
    heroMetrics.appendChild(badge);
  });
  const stats = state.config.testimonialsStats;
  if (stats) {
    const badge = document.createElement('div');
    badge.className = 'badge-pill';
    const average = stats.average.toString().replace('.', ',');
    badge.innerHTML = `<strong>★★★★★ ${average}/5</strong> (${stats.count}+ avis)`;
    heroMetrics.appendChild(badge);
  }
}

function populateMetrics() {
  const metricsContainers = document.querySelectorAll(selectors.metrics);
  if (!metricsContainers.length || !state.config.metrics) return;
  metricsContainers.forEach((container) => {
    container.innerHTML = '';
    state.config.metrics.forEach((metric) => {
      const card = document.createElement('div');
      card.className = 'metric-card fade-up';
      card.dataset.animate = '';
      card.innerHTML = `
        <div class="metric-value" data-counter data-target="${metric.value}" data-prefix="${metric.prefix ?? ''}" data-suffix="${metric.suffix ?? ''}">
          <span>${metric.prefix ?? ''}</span>
          <span class="metric-number">0</span>
          <span>${metric.suffix ?? ''}</span>
        </div>
        <div class="metric-label">${metric.label}</div>
      `;
      container.appendChild(card);
    });
  });
}

function populateServices() {
  const servicesContainers = document.querySelectorAll(selectors.services);
  if (!servicesContainers.length || !state.config.services) return;
  servicesContainers.forEach((container) => {
    container.innerHTML = '';
    state.config.services.forEach((service) => {
      const card = document.createElement('article');
      card.className = 'card fade-up';
      card.dataset.animate = '';
      card.innerHTML = `
        <div class="card-icon"><i class="${service.icon}"></i></div>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
      `;
      container.appendChild(card);
    });
  });
}

function populateProcess() {
  const processContainer = document.querySelector(selectors.process);
  if (!processContainer || !state.config.process) return;
  processContainer.innerHTML = '';
  state.config.process.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'step-card fade-up';
    card.dataset.animate = '';
    card.dataset.step = item.step;
    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    `;
    processContainer.appendChild(card);
  });
}

function populateTestimonials() {
  const track = document.querySelector(selectors.testimonialsTrack);
  if (!track || !state.config.testimonials) return;
  track.innerHTML = '';
  state.config.testimonials.forEach((testimonial) => {
    const card = document.createElement('article');
    card.className = 'testimonial-card fade-up';
    card.dataset.animate = '';
    card.innerHTML = `
      <div class="testimonial-rating">${'★'.repeat(testimonial.rating)} ${state.config.testimonialsStats?.average ?? '5,0'}/5</div>
      <p class="testimonial-text">${testimonial.text}</p>
      <div class="testimonial-author">${testimonial.name} — ${testimonial.role}</div>
    `;
    track.appendChild(card);
  });
  startTestimonialCarousel();
}

function populatePortfolioPreview() {
  const container = document.querySelector(selectors.portfolioPreview);
  if (!container || !state.config.portfolio) return;
  container.innerHTML = '';
  state.config.portfolio.slice(0, 2).forEach((project) => {
    container.appendChild(createPortfolioCard(project));
  });
}

function populatePortfolio() {
  const container = document.querySelector(selectors.portfolio);
  if (!container || !state.config.portfolio) return;
  container.innerHTML = '';
  state.config.portfolio.forEach((project) => {
    container.appendChild(createPortfolioCard(project));
  });
}

function createPortfolioCard(project) {
  const card = document.createElement('article');
  card.className = 'portfolio-card fade-up';
  card.dataset.animate = '';
  card.dataset.tags = project.tags?.join(',') ?? '';
  card.innerHTML = `
    <img src="${project.image}" alt="${project.title}" loading="lazy" />
    <div class="portfolio-content">
      <span class="section-eyebrow">${project.type}</span>
      <h3>${project.title}</h3>
      <p class="section-description">${project.description}</p>
      <div class="portfolio-tags">
        ${(project.tags || [])
          .map((tag) => `<span class="tag">${tag}</span>`)
          .join('')}
      </div>
    </div>
  `;
  return card;
}

function populatePortfolioFilters() {
  const filtersContainer = document.querySelector(selectors.portfolioFilters);
  if (!filtersContainer || !state.config.portfolioFilters) return;
  filtersContainer.innerHTML = '';
  state.config.portfolioFilters.forEach((filter, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-button';
    button.textContent = filter;
    button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
    button.addEventListener('click', () => applyPortfolioFilter(filter, button));
    filtersContainer.appendChild(button);
  });
}

function applyPortfolioFilter(filter, button) {
  const cards = document.querySelectorAll('.portfolio-card');
  cards.forEach((card) => {
    if (filter === 'Tous') {
      card.classList.remove('hidden');
      return;
    }
    const tags = card.dataset.tags?.split(',') ?? [];
    if (tags.includes(filter)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });

  const buttons = button.parentElement?.querySelectorAll('.filter-button') ?? [];
  buttons.forEach((btn) => btn.setAttribute('aria-pressed', btn === button ? 'true' : 'false'));
}

function populatePricing() {
  const pricingContainer = document.querySelector(selectors.pricing);
  if (!pricingContainer || !state.config.pricing) return;
  pricingContainer.innerHTML = '';
  state.config.pricing.forEach((plan, index) => {
    const card = document.createElement('article');
    card.className = `price-card fade-up ${index === 1 ? 'highlight' : ''}`.trim();
    card.dataset.animate = '';
    card.innerHTML = `
      <span class="section-eyebrow">${plan.id.toUpperCase()}</span>
      <h3>${plan.name}</h3>
      <p class="section-description">${plan.description}</p>
      <div class="price"><span>${plan.price.toLocaleString('fr-FR')}</span><span>€</span></div>
      <ul class="price-features">
        ${plan.features.map((feature) => `<li>${feature}</li>`).join('')}
      </ul>
      <a class="btn btn-secondary" href="/devis.html">Choisir cette offre</a>
    `;
    pricingContainer.appendChild(card);
  });
}

function populateMaintenance() {
  const maintenance = document.querySelector(selectors.maintenance);
  if (!maintenance || !state.config.maintenance) return;
  const featuresList = maintenance.querySelector(selectors.maintenanceFeatures);
  maintenance.querySelector('p').innerHTML = state.config.maintenance.description;
  const priceHeading = maintenance.querySelector('h2');
  if (priceHeading) {
    priceHeading.innerHTML = `Maintenance évolutive dès ${state.config.maintenance.price}&nbsp;€/mois`;
  }
  if (featuresList) {
    featuresList.innerHTML = state.config.maintenance.features
      .map((feature) => `<li>${feature}</li>`)
      .join('');
  }
}

function populateFormSelects() {
  const form = document.querySelector(selectors.quoteForm);
  if (!form || !state.config.form) return;
  const selects = form.querySelectorAll(selectors.formSelect);
  selects.forEach((select) => {
    const type = select.dataset.formSelect;
    const options = state.config.form?.[type];
    if (!options) return;
    options.forEach((option) => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      select.appendChild(opt);
    });
  });

  const recaptchaKey = state.config.form?.recaptchaSiteKey;
  if (recaptchaKey) {
    const container = document.getElementById('recaptcha-container');
    if (container) {
      container.classList.remove('hidden');
      container.innerHTML = `<div class="g-recaptcha" data-sitekey="${recaptchaKey}"></div>`;
    }
  }
}

function populateContacts() {
  const blocks = document.querySelectorAll(selectors.contactBlocks);
  if (!blocks.length || !state.config.brand) return;
  const { email, phone, address } = state.config.brand;
  blocks.forEach((block) => {
    block.innerHTML = `
      <a href="mailto:${email}">${email}</a>
      <a href="tel:${phone?.replace(/\s+/g, '')}">${phone}</a>
      <span>${address}</span>
    `;
  });
}

function setupNavigation() {
  const menuToggle = document.querySelector(selectors.menuToggle);
  const nav = document.querySelector(selectors.navLinks);
  if (!menuToggle || !nav) return;
  menuToggle.addEventListener('click', () => {
    state.navOpen = !state.navOpen;
    nav.classList.toggle('is-open', state.navOpen);
    menuToggle.setAttribute('aria-expanded', state.navOpen ? 'true' : 'false');
  });

  nav.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      state.navOpen = false;
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    })
  );
}

function setupThemeToggle() {
  const toggle = document.querySelector(selectors.themeToggle);
  if (!toggle) return;
  const storedTheme = localStorage.getItem('aurium-theme');
  if (storedTheme === 'light') document.body.classList.add('theme-light');

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('theme-light');
    const isLight = document.body.classList.contains('theme-light');
    localStorage.setItem('aurium-theme', isLight ? 'light' : 'dark');
    toggle.innerHTML = `<span aria-hidden="true">${isLight ? '☀️' : '🌙'}</span>`;
  });

  const isLight = document.body.classList.contains('theme-light');
  toggle.innerHTML = `<span aria-hidden="true">${isLight ? '☀️' : '🌙'}</span>`;
}

function setupStickyHeader() {
  const header = document.querySelector('[data-component="header"]');
  if (!header) return;
  const handleScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

function setupAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '0px 0px -80px 0px',
    }
  );

  animatedElements.forEach((el) => observer.observe(el));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.4,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function setupCounters() {
  const counterElements = document.querySelectorAll('[data-counter]');
  if (!counterElements.length) return;
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );
  counterElements.forEach((counter) => counterObserver.observe(counter));
}

function animateCounter(counter) {
  const target = Number(counter.dataset.target || 0);
  const duration = 1500;
  const startTime = performance.now();
  const prefix = counter.dataset.prefix ?? '';
  const suffix = counter.dataset.suffix ?? '';
  const numberEl = counter.querySelector('.metric-number') || counter.querySelector('span:nth-child(2)');

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(progress * target);
    if (numberEl) numberEl.textContent = value.toString();
    counter.innerHTML = `${prefix ? `<span>${prefix}</span>` : ''}<span class="metric-number">${value}</span>${suffix ? `<span>${suffix}</span>` : ''}`;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counter.innerHTML = `${prefix ? `<span>${prefix}</span>` : ''}<span class="metric-number">${target}</span>${suffix ? `<span>${suffix}</span>` : ''}`;
    }
  }
  requestAnimationFrame(update);
}

function startTestimonialCarousel() {
  const wrapper = document.querySelector(selectors.testimonialsWrapper);
  const track = document.querySelector(selectors.testimonialsTrack);
  if (!wrapper || !track || track.children.length <= 1) return;

  const cards = Array.from(track.children);
  const cardWidth = cards[0].getBoundingClientRect().width + 24;

  function moveCarousel() {
    state.testimonialIndex = (state.testimonialIndex + 1) % cards.length;
    track.style.transform = `translateX(-${state.testimonialIndex * cardWidth}px)`;
  }

  if (state.testimonialInterval) clearInterval(state.testimonialInterval);
  state.testimonialInterval = setInterval(moveCarousel, 6000);

  wrapper.addEventListener('mouseenter', () => clearInterval(state.testimonialInterval));
  wrapper.addEventListener('mouseleave', () => {
    state.testimonialInterval = setInterval(moveCarousel, 6000);
  });
}

function setupForm() {
  const form = document.querySelector(selectors.quoteForm);
  if (!form) return;
  const submitButton = form.querySelector(selectors.submitButton);
  const success = form.querySelector(selectors.formSuccess);
  const error = form.querySelector(selectors.formError);
  const honeypot = form.querySelector('.honeypot');
  const defaultError = error?.textContent ?? '';

  setTimeout(() => {
    if (submitButton) submitButton.disabled = false;
  }, 2500);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitButton) submitButton.disabled = true;
    success?.classList.add('hidden');
    error?.classList.add('hidden');

    if (honeypot && honeypot.value) {
      if (submitButton) submitButton.disabled = false;
      return;
    }

    const formData = new FormData(form);
    const fileInput = form.querySelector('input[type="file"]');
    const file = fileInput?.files?.[0];
    if (file && file.size > 10 * 1024 * 1024) {
      if (error) {
        error.classList.remove('hidden');
        error.textContent = 'Le fichier dépasse la taille maximale de 10 Mo.';
      }
      if (submitButton) submitButton.disabled = false;
      return;
    } else if (error) {
      error.textContent = defaultError;
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) throw new Error('error');

      success?.classList.remove('hidden');
      form.reset();
      setTimeout(() => success?.classList.add('hidden'), 8000);
    } catch (err) {
      if (error) {
        error.classList.remove('hidden');
        error.textContent = defaultError || 'Une erreur est survenue. Merci de réessayer.';
        setTimeout(() => error.classList.add('hidden'), 8000);
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

function init() {
  setupNavigation();
  setupThemeToggle();
  setupStickyHeader();
  setupAnimations();
  setupForm();
  loadConfig();
}

document.addEventListener('DOMContentLoaded', init);
