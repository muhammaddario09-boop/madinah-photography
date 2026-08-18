/**
 * NOOR MADINAH PHOTOGRAPHY — CORE APPLICATION ROUTER & DATA MANAGER
 */

const app = {
  currentView: 'public',
  currentCurrency: 'SAR',
  rates: { SAR: 1.0, USD: 0.27, IDR: 4150 },
  services: [],
  locations: [],
  photographers: [],
  portfolio: [],

  init() {
    this.startMadinahClock();
    this.fetchAllData();
    this.handleInitialRouting();
  },

  handleInitialRouting() {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');
    const bookingId = urlParams.get('booking_id');

    if (bookingId) {
      this.switchView('client-portal');
      document.getElementById('client-search-booking-id').value = bookingId;
      clientPortal.searchBooking(bookingId);
    } else if (view === 'admin') {
      this.switchView('admin');
    } else if (view === 'book') {
      this.startBooking();
    } else {
      this.switchView('public');
    }
  },

  startMadinahClock() {
    const updateClock = () => {
      const options = {
        timeZone: 'Asia/Riyadh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const timeStr = new Intl.DateTimeFormat([], options).format(new Date());
      const el = document.getElementById('madinah-live-clock');
      if (el) {
        el.textContent = `Madinah Time (UTC+3): ${timeStr}`;
      }
    };
    updateClock();
    setInterval(updateClock, 1000);
  },

  async fetchAllData() {
    try {
      const [resServices, resLocations, resPhotographers, resPortfolio] = await Promise.all([
        fetch('/api/services').then(r => r.json()),
        fetch('/api/locations').then(r => r.json()),
        fetch('/api/photographers').then(r => r.json()),
        fetch('/api/portfolio').then(r => r.json())
      ]);

      this.services = resServices;
      this.locations = resLocations;
      this.photographers = resPhotographers;
      this.portfolio = resPortfolio;

      this.renderPortfolio(this.portfolio);
      this.renderServices(this.services);
      this.renderLocations(this.locations);
      this.renderPhotographers(this.photographers);
    } catch (err) {
      console.error('Data initialization error:', err);
      this.showToast('Failed to load studio data. Please refresh.', 'error');
    }
  },

  setCurrency(curr) {
    this.currentCurrency = curr;
    this.renderServices(this.services);
    if (bookingWizard) {
      bookingWizard.updateSummaryBar();
    }
  },

  formatPrice(amountSar) {
    if (this.currentCurrency === 'USD') {
      const usd = Math.round(amountSar * this.rates.USD);
      return `$${usd.toLocaleString()}`;
    } else if (this.currentCurrency === 'IDR') {
      const idr = Math.round(amountSar * this.rates.IDR);
      return `Rp ${idr.toLocaleString('id-ID')}`;
    }
    return `SAR ${Number(amountSar).toLocaleString()}`;
  },

  switchView(viewName) {
    this.currentView = viewName;
    const views = ['public', 'booking', 'client-portal', 'admin'];
    views.forEach(v => {
      const el = document.getElementById(`view-${v}`);
      if (el) el.style.display = (v === viewName) ? 'block' : 'none';
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'admin' && typeof adminDashboard !== 'undefined') {
      adminDashboard.init();
    }
  },

  startBooking(serviceId = null, packageId = null) {
    this.switchView('booking');
    if (typeof bookingWizard !== 'undefined') {
      bookingWizard.init(serviceId, packageId);
    }
  },

  scrollToSection(sectionId) {
    if (this.currentView !== 'public') {
      this.switchView('public');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  },

  // ---------------- RENDERERS ---------------- //

  renderPortfolio(items) {
    const container = document.getElementById('portfolio-grid-container');
    if (!container) return;

    container.innerHTML = items.map(item => `
      <div class="portfolio-card" onclick="app.openPortfolioModal('${item.title}', '${item.category}', '${item.image_url}', '${item.location_tag}', '${item.photographer_name}')">
        <img src="${item.image_url}" alt="${item.title}" class="portfolio-card-img" loading="lazy">
        <div class="portfolio-overlay">
          <span class="portfolio-cat">${item.category}</span>
          <h3 class="portfolio-card-title">${item.title}</h3>
          <span class="portfolio-location">📍 ${item.location_tag || 'Madinah'} • By ${item.photographer_name || 'Studio'}</span>
        </div>
      </div>
    `).join('');
  },

  filterPortfolio(category) {
    const buttons = document.querySelectorAll('#portfolio-category-filters .filter-btn');
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim().toLowerCase().includes(category.toLowerCase()) || (category === 'All' && btn.textContent.includes('All')));
    });

    if (category === 'All') {
      this.renderPortfolio(this.portfolio);
    } else {
      const filtered = this.portfolio.filter(p => p.category.toLowerCase() === category.toLowerCase());
      this.renderPortfolio(filtered);
    }
  },

  renderServices(services) {
    const container = document.getElementById('services-grid-container');
    if (!container) return;

    container.innerHTML = services.map(s => {
      const startingPriceFormatted = this.formatPrice(s.starting_price_sar);
      const pkgsHtml = s.packages.map(p => `
        <div class="pkg-mini-pill">
          <span class="pkg-mini-name">${p.name} (${p.duration_min} min)</span>
          <span class="pkg-mini-price">${this.formatPrice(p.price_sar)}</span>
        </div>
      `).join('');

      return `
        <div class="service-card">
          <div class="service-card-image-wrap">
            <img src="${s.cover_image || '/static/images/hero_sunset.jpg'}" alt="${s.title}" class="service-card-img" loading="lazy">
            ${s.is_popular ? '<span class="service-popular-badge">Top Pilgrim Choice</span>' : ''}
          </div>
          <div class="service-card-body">
            <span class="service-card-subtitle">${s.subtitle || 'Fine Art Photography'}</span>
            <h3 class="service-card-title">${s.title}</h3>
            <p class="service-card-desc">${s.description}</p>
            
            <div class="service-packages-list">
              ${pkgsHtml}
            </div>

            <div class="service-card-footer">
              <div class="starting-price-box">
                <span class="starting-label">Starting From</span>
                <span class="starting-amount">${startingPriceFormatted}</span>
              </div>
              <button onclick="app.startBooking(${s.id})" class="btn btn-primary btn-sm">Book Session</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderLocations(locations) {
    const container = document.getElementById('locations-grid-container');
    if (!container) return;

    container.innerHTML = locations.map(loc => `
      <div class="location-card" onclick="app.startBooking()">
        <img src="${loc.image_url || '/static/images/hero_sunset.jpg'}" alt="${loc.name}" class="location-card-img" loading="lazy">
        <div class="location-card-overlay">
          <span class="location-arabic">${loc.arabic_name || ''}</span>
          <h3 class="location-name">${loc.name}</h3>
          <div>
            <span class="location-buffer-tag">⏱️ ${loc.travel_buffer_min}m Travel Buffer Protected</span>
          </div>
        </div>
      </div>
    `).join('');
  },

  renderPhotographers(photographers) {
    const container = document.getElementById('photographers-grid-container');
    if (!container) return;

    container.innerHTML = photographers.map(p => `
      <div class="photographer-card">
        <img src="${p.avatar_url || '/static/images/portrait_solo.jpg'}" alt="${p.name}" class="photographer-avatar" loading="lazy">
        <h3 class="photographer-name">${p.name}</h3>
        <div class="photographer-role">${p.title}</div>
        <p class="photographer-bio">${p.bio}</p>
        <div style="font-size: 0.78rem; color: var(--gold-hover); margin-bottom: 20px; font-weight: 600;">
          Specialties: ${p.specialties || 'Editorial, Heritage'}
        </div>
        <button onclick="app.startBooking(null, null, ${p.id})" class="btn btn-secondary btn-sm">Book with ${p.name.split(' ')[0]}</button>
      </div>
    `).join('');
  },

  // ---------------- MODAL & TOAST ---------------- //

  openModal(htmlContent) {
    const modal = document.getElementById('app-modal');
    const body = document.getElementById('modal-body-container');
    body.innerHTML = htmlContent;
    modal.classList.add('active');
  },

  closeModal() {
    const modal = document.getElementById('app-modal');
    modal.classList.remove('active');
  },

  openPortfolioModal(title, category, imgUrl, locTag, photographer) {
    this.openModal(`
      <div style="text-align: center;">
        <img src="${imgUrl}" alt="${title}" style="width: 100%; max-height: 480px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 20px;">
        <span class="section-subtitle">${category}</span>
        <h3 style="font-size: 1.8rem; margin: 6px 0 10px;">${title}</h3>
        <p style="color: var(--text-secondary); font-size: 0.92rem; margin-bottom: 24px;">📍 ${locTag} • Captured by ${photographer}</p>
        <button onclick="app.closeModal(); app.startBooking();" class="btn btn-primary">Book a Similar Shoot</button>
      </div>
    `);
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : type === 'success' ? 'toast-success' : ''}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

window.addEventListener('DOMContentLoaded', () => app.init());
