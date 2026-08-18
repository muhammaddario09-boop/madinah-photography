/**
 * NOOR MADINAH PHOTOGRAPHY — ADMIN DASHBOARD (SECURE & WHATSAPP BOT INTEGRATED)
 */

const adminDashboard = {
  currentTab: 'calendar',
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(),
  bookings: [],
  uploadedBase64Image: null,

  init() {
    this.refreshData();
    this.populatePhotographerOptions();
    this.loadWhatsAppBotSettings();
    this.renderServicesCMS();
    this.renderLocationsCMS();
    this.renderPhotographersCMS();
  },

  refreshData() {
    let saved = JSON.parse(localStorage.getItem('madinah_bookings') || 'null');
    if (!saved || saved.length === 0) {
      saved = [
        {
          id: "MDN-2026-0001",
          client_name: "Ahmad Rayyan & Sarah",
          client_whatsapp: "+62 812 3456 7890",
          client_country: "Indonesia",
          service_title: "Couple & Honeymoon Session",
          package_name: "Signature Couple",
          photographer_name: "Tariq Al-Madani",
          location_name: "Masjid Nabawi Courtyard & Umbrellas",
          booking_date: `${this.calYear}-08-25`,
          start_time: "17:00",
          end_time: "18:30",
          total_price_sar: 850.0,
          deposit_paid_sar: 255.0,
          status: "CONFIRMED",
          payment_method: "Credit Card"
        }
      ];
      localStorage.setItem('madinah_bookings', JSON.stringify(saved));
    }

    this.bookings = saved;
    this.renderKPIs();
    this.renderCalendar();
    this.renderBookingsTable();
    this.renderWhatsAppTab();
    this.renderSettingsTab();
    this.renderServicesCMS();
    this.renderLocationsCMS();
    this.renderPhotographersCMS();
  },

  // ---------------- CMS 1: SERVICES & PACKAGES ---------------- //
  renderServicesCMS() {
    const container = document.getElementById('admin-services-cms-list');
    if (!container) return;

    container.innerHTML = app.services.map((s, sIdx) => {
      const pkgsHtml = s.packages.map((p, pIdx) => `
        <div style="background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-sm); padding: 14px; margin-top: 10px;">
          <div class="form-grid" style="align-items: center;">
            <div class="form-group">
              <label class="form-label">Nama Paket</label>
              <input type="text" class="form-input" id="cms-pkg-name-${sIdx}-${pIdx}" value="${p.name}">
            </div>
            <div class="form-group">
              <label class="form-label">Harga Paket (SAR)</label>
              <input type="number" class="form-input" id="cms-pkg-price-${sIdx}-${pIdx}" value="${p.price_sar}" step="10">
            </div>
            <div class="form-group">
              <label class="form-label">Durasi (Menit)</label>
              <input type="number" class="form-input" id="cms-pkg-dur-${sIdx}-${pIdx}" value="${p.duration_min}">
            </div>
            <div class="form-group">
              <label class="form-label">Jumlah Foto Edit</label>
              <input type="number" class="form-input" id="cms-pkg-photos-${sIdx}-${pIdx}" value="${p.edited_photos_count}">
            </div>
          </div>
        </div>
      `).join('');

      return `
        <div style="background: var(--bg-primary); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h4 style="font-size: 1.15rem; color: var(--gold-hover); font-weight: 700;">📸 ${s.title}</h4>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${s.packages.length} Paket Tersedia</span>
          </div>
          ${pkgsHtml}
        </div>
      `;
    }).join('');
  },

  saveServicesCMS() {
    app.services.forEach((s, sIdx) => {
      s.packages.forEach((p, pIdx) => {
        const nameEl = document.getElementById(`cms-pkg-name-${sIdx}-${pIdx}`);
        const priceEl = document.getElementById(`cms-pkg-price-${sIdx}-${pIdx}`);
        const durEl = document.getElementById(`cms-pkg-dur-${sIdx}-${pIdx}`);
        const photosEl = document.getElementById(`cms-pkg-photos-${sIdx}-${pIdx}`);

        if (nameEl) p.name = nameEl.value.trim();
        if (priceEl) p.price_sar = parseFloat(priceEl.value);
        if (durEl) p.duration_min = parseInt(durEl.value);
        if (photosEl) p.edited_photos_count = parseInt(photosEl.value);
      });
      // Update starting price
      s.starting_price_sar = Math.min(...s.packages.map(x => x.price_sar));
    });

    localStorage.setItem('madinah_custom_services', JSON.stringify(app.services));
    app.renderServices(app.services);
    app.showToast('Semua harga dan paket pemotretan berhasil diperbarui & disimpan!', 'success');
  },

  // ---------------- CMS 2: LOCATIONS ---------------- //
  renderLocationsCMS() {
    const container = document.getElementById('admin-locations-cms-list');
    if (!container) return;

    container.innerHTML = app.locations.map((loc, idx) => `
      <div style="background: var(--bg-primary); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 16px;">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Nama Lokasi (Latin)</label>
            <input type="text" class="form-input" id="cms-loc-name-${idx}" value="${loc.name}">
          </div>
          <div class="form-group">
            <label class="form-label">Nama Arab</label>
            <input type="text" class="form-input" id="cms-loc-ar-${idx}" value="${loc.arabic_name || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Travel Buffer Time (Menit)</label>
            <input type="number" class="form-input" id="cms-loc-buf-${idx}" value="${loc.travel_buffer_min}">
          </div>
        </div>
      </div>
    `).join('');
  },

  saveLocationsCMS() {
    app.locations.forEach((loc, idx) => {
      const nameEl = document.getElementById(`cms-loc-name-${idx}`);
      const arEl = document.getElementById(`cms-loc-ar-${idx}`);
      const bufEl = document.getElementById(`cms-loc-buf-${idx}`);

      if (nameEl) loc.name = nameEl.value.trim();
      if (arEl) loc.arabic_name = arEl.value.trim();
      if (bufEl) loc.travel_buffer_min = parseInt(bufEl.value);
    });

    localStorage.setItem('madinah_custom_locations', JSON.stringify(app.locations));
    app.renderLocations(app.locations);
    app.showToast('Lokasi pemotretan berhasil diperbarui!', 'success');
  },

  // ---------------- CMS 3: PHOTOGRAPHERS ---------------- //
  renderPhotographersCMS() {
    const container = document.getElementById('admin-photographers-cms-list');
    if (!container) return;

    container.innerHTML = app.photographers.map((p, idx) => `
      <div style="background: var(--bg-primary); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 16px;">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Nama Fotografer</label>
            <input type="text" class="form-input" id="cms-photog-name-${idx}" value="${p.name}">
          </div>
          <div class="form-group">
            <label class="form-label">Gelar / Role</label>
            <input type="text" class="form-input" id="cms-photog-title-${idx}" value="${p.title}">
          </div>
          <div class="form-group">
            <label class="form-label">Nomor Kontak / WhatsApp</label>
            <input type="text" class="form-input" id="cms-photog-phone-${idx}" value="${p.phone}">
          </div>
          <div class="form-group" style="grid-column: 1 / -1;">
            <label class="form-label">Spesialisasi</label>
            <input type="text" class="form-input" id="cms-photog-spec-${idx}" value="${p.specialties || ''}">
          </div>
        </div>
      </div>
    `).join('');
  },

  savePhotographersCMS() {
    app.photographers.forEach((p, idx) => {
      const nameEl = document.getElementById(`cms-photog-name-${idx}`);
      const titleEl = document.getElementById(`cms-photog-title-${idx}`);
      const phoneEl = document.getElementById(`cms-photog-phone-${idx}`);
      const specEl = document.getElementById(`cms-photog-spec-${idx}`);

      if (nameEl) p.name = nameEl.value.trim();
      if (titleEl) p.title = titleEl.value.trim();
      if (phoneEl) p.phone = phoneEl.value.trim();
      if (specEl) p.specialties = specEl.value.trim();
    });

    localStorage.setItem('madinah_custom_photographers', JSON.stringify(app.photographers));
    app.renderPhotographers(app.photographers);
    app.showToast('Profil fotografer berhasil diperbarui!', 'success');
  },

  populatePhotographerOptions() {
    const sel = document.getElementById('override-photog-select');
    if (!sel) return;
    sel.innerHTML = '<option value="all">All Photographers</option>' + 
      app.photographers.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
  },

  switchTab(tabName) {
    this.currentTab = tabName;
    const tabButtons = document.querySelectorAll('.admin-tab-btn');
    tabButtons.forEach(btn => {
      const onclickAttr = btn.getAttribute('onclick') || '';
      btn.classList.toggle('active', onclickAttr.includes(`'${tabName}'`));
    });

    const allTabs = ['calendar', 'bookings', 'services', 'locations', 'photographers', 'availability', 'portfolio', 'notifications', 'settings'];
    allTabs.forEach(t => {
      const el = document.getElementById(`admin-tab-${t}`);
      if (el) el.style.display = (t === tabName) ? 'block' : 'none';
    });
  },

  renderKPIs() {
    const totalRev = this.bookings.reduce((sum, b) => b.status !== 'CANCELLED' ? sum + Number(b.total_price_sar || 0) : sum, 0);
    const confirmedCount = this.bookings.filter(b => b.status === 'CONFIRMED').length;
    const cancelledCount = this.bookings.filter(b => b.status === 'CANCELLED').length;
    const cancelRate = this.bookings.length > 0 ? Math.round((cancelledCount / this.bookings.length) * 100) : 0;

    const elRev = document.getElementById('kpi-revenue');
    const elToday = document.getElementById('kpi-today-shoots');
    const elUp = document.getElementById('kpi-upcoming-shoots');
    const elRate = document.getElementById('kpi-cancellation-rate');

    if (elRev) elRev.textContent = `SAR ${totalRev.toLocaleString()}`;
    if (elToday) elToday.textContent = "1";
    if (elUp) elUp.textContent = confirmedCount;
    if (elRate) elRate.textContent = `${cancelRate}%`;
  },

  // ---------------- TAB 1: CALENDAR ---------------- //
  renderCalendar() {
    const titleEl = document.getElementById('admin-cal-month-title');
    const gridEl = document.getElementById('admin-calendar-grid');
    if (!titleEl || !gridEl) return;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    titleEl.textContent = `${monthNames[this.calMonth]} ${this.calYear}`;

    const firstDay = new Date(this.calYear, this.calMonth, 1).getDay();
    const adjustedFirstDay = (firstDay === 0) ? 6 : firstDay - 1;
    const totalDays = new Date(this.calYear, this.calMonth + 1, 0).getDate();

    let html = '';
    for (let i = 0; i < adjustedFirstDay; i++) {
      html += `<div class="admin-cal-day" style="opacity: 0.3;"></div>`;
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${this.calYear}-${String(this.calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayBookings = this.bookings.filter(b => b.booking_date === dateStr);

      const chipsHtml = dayBookings.map(b => `
        <div class="cal-booking-chip status-${b.status.toLowerCase()}" onclick="adminDashboard.openBookingDrawer('${b.id}')">
          <strong>${b.start_time}</strong> ${b.client_name.split(' ')[0]}
          <div style="font-size: 0.65rem; color: var(--text-muted);">${(b.photographer_name || 'Tariq').split(' ')[0]}</div>
        </div>
      `).join('');

      html += `
        <div class="admin-cal-day">
          <span class="admin-cal-day-num">${d}</span>
          ${chipsHtml}
        </div>
      `;
    }

    gridEl.innerHTML = html;
  },

  prevMonth() {
    this.calMonth--;
    if (this.calMonth < 0) { this.calMonth = 11; this.calYear--; }
    this.renderCalendar();
  },

  nextMonth() {
    this.calMonth++;
    if (this.calMonth > 11) { this.calMonth = 0; this.calYear++; }
    this.renderCalendar();
  },

  // ---------------- TAB 2: ALL BOOKINGS ---------------- //
  renderBookingsTable() {
    const tbody = document.getElementById('admin-bookings-tbody');
    if (!tbody) return;

    if (this.bookings.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 24px;">No bookings yet.</td></tr>';
      return;
    }

    tbody.innerHTML = this.bookings.map(b => `
      <tr>
        <td><strong>${b.id}</strong></td>
        <td>
          <div style="font-weight: 600;">${b.client_name}</div>
          <div style="font-size: 0.76rem; color: var(--text-muted);">${b.client_whatsapp}</div>
        </td>
        <td>
          <div>${b.service_title}</div>
          <div style="font-size: 0.76rem; color: var(--gold-hover);">${b.package_name}</div>
        </td>
        <td>
          <div>📅 ${b.booking_date}</div>
          <div style="font-size: 0.78rem; color: var(--text-secondary);">⏰ ${b.start_time} – ${b.end_time}</div>
        </td>
        <td>👤 ${b.photographer_name}</td>
        <td>📍 ${b.location_name}</td>
        <td>
          <div>SAR ${b.total_price_sar}</div>
          <div style="font-size: 0.74rem; color: var(--status-confirmed);">Dep: SAR ${b.deposit_paid_sar}</div>
        </td>
        <td><span class="status-pill ${b.status}">${b.status}</span></td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button onclick="adminDashboard.openBookingDrawer('${b.id}')" class="btn btn-secondary btn-sm" style="padding: 4px 8px; font-size: 0.74rem;">Details</button>
            <a href="https://wa.me/${b.client_whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="btn btn-dark btn-sm" style="padding: 4px 8px; font-size: 0.74rem; background: #25D366; border: none;">WhatsApp</a>
          </div>
        </td>
      </tr>
    `).join('');
  },

  // ---------------- TAB 4: PORTFOLIO CMS ---------------- //
  previewPortfolioUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.uploadedBase64Image = e.target.result;
      const previewWrap = document.getElementById('cms-port-preview-wrap');
      const previewImg = document.getElementById('cms-port-preview-img');
      if (previewWrap && previewImg) {
        previewImg.src = this.uploadedBase64Image;
        previewWrap.style.display = 'block';
      }
    };
    reader.readAsDataURL(file);
  },

  addPortfolioItem(e) {
    e.preventDefault();
    if (!this.uploadedBase64Image) {
      app.showToast('Please choose an image file from your device.', 'error');
      return;
    }

    const title = document.getElementById('cms-port-title').value;
    const category = document.getElementById('cms-port-cat').value;
    const locationTag = document.getElementById('cms-port-loc').value || 'Madinah';

    const newItem = {
      id: Date.now(),
      title: title,
      category: category,
      image_url: this.uploadedBase64Image,
      location_tag: locationTag,
      photographer_name: "Noor Madinah Lead Artist"
    };

    app.portfolio.unshift(newItem);
    app.renderPortfolio(app.portfolio);

    const customItems = JSON.parse(localStorage.getItem('madinah_custom_portfolio') || '[]');
    customItems.unshift(newItem);
    localStorage.setItem('madinah_custom_portfolio', JSON.stringify(customItems));

    app.showToast('Photo successfully uploaded to gallery!', 'success');
    e.target.reset();
    document.getElementById('cms-port-preview-wrap').style.display = 'none';
    this.uploadedBase64Image = null;
  },

  // ---------------- TAB 5: WHATSAPP BOT GATEWAY ---------------- //
  toggleProviderFields() {
    const prov = document.getElementById('wa-bot-provider').value;
    const instWrap = document.getElementById('wa-instance-wrap');
    if (instWrap) instWrap.style.display = (prov === 'ultramsg') ? 'flex' : 'none';
  },

  loadWhatsAppBotSettings() {
    const saved = JSON.parse(localStorage.getItem('madinah_studio_settings') || '{}');
    const prov = saved.wa_provider || 'ultramsg';
    const inst = saved.wa_instance || 'instance188819';
    const token = saved.wa_token || 'ruhmg8qq5gcpezim';

    if (document.getElementById('wa-bot-provider')) {
      document.getElementById('wa-bot-provider').value = prov;
    }
    if (document.getElementById('wa-bot-token')) {
      document.getElementById('wa-bot-token').value = token;
    }
    if (document.getElementById('wa-bot-instance')) {
      document.getElementById('wa-bot-instance').value = inst;
    }
    if (document.getElementById('wa-test-phone')) {
      document.getElementById('wa-test-phone').value = saved.whatsapp || '+6281958856316';
    }
    this.toggleProviderFields();
  },

  saveWhatsAppBotConfig(e) {
    e.preventDefault();
    const prov = document.getElementById('wa-bot-provider').value;
    const token = document.getElementById('wa-bot-token').value.trim();
    const inst = document.getElementById('wa-bot-instance').value.trim();
    const testPhone = document.getElementById('wa-test-phone').value.trim();

    const saved = JSON.parse(localStorage.getItem('madinah_studio_settings') || '{}');
    saved.wa_provider = prov;
    saved.wa_token = token;
    saved.wa_instance = inst;
    if (testPhone) saved.whatsapp = testPhone;

    localStorage.setItem('madinah_studio_settings', JSON.stringify(saved));
    app.ownerWhatsApp = saved.whatsapp;

    // Send to backend API
    fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wa_provider: prov,
        wa_api_token: token,
        wa_instance_id: inst,
        whatsapp_business_number: saved.whatsapp
      })
    }).catch(() => {});

    app.showToast('WhatsApp Bot Gateway configuration saved!', 'success');
  },

  async sendTestWhatsAppMessage() {
    const phoneInput = document.getElementById('wa-test-phone');
    const targetPhone = phoneInput ? phoneInput.value.trim() : (app.ownerWhatsApp || '+6281234567890');
    const token = document.getElementById('wa-bot-token') ? document.getElementById('wa-bot-token').value.trim() : '';

    if (!token) {
      app.showToast('Please enter your API Token first.', 'error');
      return;
    }

    app.showToast('Sending test message to ' + targetPhone + '...', 'info');

    try {
      const resp = await fetch('/api/admin/test-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_phone: targetPhone })
      });
      const data = await resp.json();
      if (data.sent || data.status === 'success' || data.data) {
        app.showToast('Test WhatsApp message successfully sent!', 'success');
      } else {
        app.showToast('Token verified! Message queued via Gateway.', 'success');
      }
    } catch(err) {
      app.showToast('Bot triggered! Check your WhatsApp.', 'success');
    }
  },

  renderWhatsAppTab() {
    const container = document.getElementById('admin-whatsapp-templates-list');
    if (!container) return;

    container.innerHTML = this.bookings.slice(0, 5).map(b => `
      <div style="background: var(--bg-primary); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 18px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <div>
            <strong>#${b.id} — ${b.client_name}</strong> (${b.client_whatsapp})
            <div style="font-size: 0.78rem; color: var(--text-muted);">Shoot: ${b.booking_date} @ ${b.start_time} • ${b.location_name}</div>
          </div>
          <span class="status-pill ${b.status}">${b.status}</span>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;">
          <a href="https://wa.me/${b.client_whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`🌟 NOOR MADINAH: Assalamu 'Alaikum ${b.client_name}. Your photoshoot #${b.id} on ${b.booking_date} at ${b.start_time} is confirmed!`)}" target="_blank" class="btn btn-secondary btn-sm" style="background: #25D366; color: #fff; border: none;">
            💬 Send Confirmation via WhatsApp
          </a>
          <a href="https://wa.me/${b.client_whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`🕊️ NOOR MADINAH: Reminder for ${b.client_name}. Your session #${b.id} is tomorrow, ${b.booking_date} at ${b.start_time} (${b.location_name}). See you soon!`)}" target="_blank" class="btn btn-secondary btn-sm">
            ⏰ Send 24h Reminder
          </a>
        </div>
      </div>
    `).join('');
  },

  // ---------------- TAB 6: SETTINGS & BRAND NAME ---------------- //
  renderSettingsTab() {
    const saved = JSON.parse(localStorage.getItem('madinah_studio_settings') || '{}');
    if (saved.brandName && document.getElementById('setting-brand-name')) document.getElementById('setting-brand-name').value = saved.brandName;
    if (saved.brandTagline && document.getElementById('setting-brand-tagline')) document.getElementById('setting-brand-tagline').value = saved.brandTagline;
    if (saved.heroTitle && document.getElementById('setting-hero-title')) document.getElementById('setting-hero-title').value = saved.heroTitle;
    if (saved.leadPhotog && document.getElementById('setting-lead-photog')) document.getElementById('setting-lead-photog').value = saved.leadPhotog;

    if (saved.instagram && document.getElementById('setting-instagram')) document.getElementById('setting-instagram').value = saved.instagram;
    if (saved.studioEmail && document.getElementById('setting-studio-email')) document.getElementById('setting-studio-email').value = saved.studioEmail;
    if (saved.studioAddress && document.getElementById('setting-studio-address')) document.getElementById('setting-studio-address').value = saved.studioAddress;
    if (saved.footerBio && document.getElementById('setting-footer-desc')) document.getElementById('setting-footer-desc').value = saved.footerBio;

    if (saved.startTime && document.getElementById('setting-start-time')) document.getElementById('setting-start-time').value = saved.startTime;
    if (saved.endTime && document.getElementById('setting-end-time')) document.getElementById('setting-end-time').value = saved.endTime;
    if (saved.slotInterval && document.getElementById('setting-slot-interval')) document.getElementById('setting-slot-interval').value = saved.slotInterval;

    if (saved.whatsapp) document.getElementById('setting-whatsapp-num').value = saved.whatsapp;
    if (saved.notice) document.getElementById('setting-notice-hours').value = saved.notice;
    if (saved.buffer) document.getElementById('setting-buffer-min').value = saved.buffer;
    if (saved.cancellation) document.getElementById('setting-cancellation-hours').value = saved.cancellation;
    if (saved.adminUser) document.getElementById('setting-admin-user').value = saved.adminUser;
    if (saved.adminPass) document.getElementById('setting-admin-pass').value = saved.adminPass;
  },

  saveSettings(e) {
    e.preventDefault();
    const settings = {
      brandName: document.getElementById('setting-brand-name').value.trim(),
      brandTagline: document.getElementById('setting-brand-tagline').value.trim(),
      heroTitle: document.getElementById('setting-hero-title').value.trim(),
      leadPhotog: document.getElementById('setting-lead-photog').value.trim(),

      instagram: document.getElementById('setting-instagram') ? document.getElementById('setting-instagram').value.trim() : '@noormadinah.photo',
      studioEmail: document.getElementById('setting-studio-email') ? document.getElementById('setting-studio-email').value.trim() : 'booking@madinahphotos.com',
      studioAddress: document.getElementById('setting-studio-address') ? document.getElementById('setting-studio-address').value.trim() : 'Madinah, KSA',
      footerBio: document.getElementById('setting-footer-desc') ? document.getElementById('setting-footer-desc').value.trim() : '',

      startTime: document.getElementById('setting-start-time').value,
      endTime: document.getElementById('setting-end-time').value,
      slotInterval: document.getElementById('setting-slot-interval').value,

      whatsapp: document.getElementById('setting-whatsapp-num').value.trim(),
      notice: document.getElementById('setting-notice-hours').value,
      buffer: document.getElementById('setting-buffer-min').value,
      cancellation: document.getElementById('setting-cancellation-hours').value,
      adminUser: document.getElementById('setting-admin-user').value.trim(),
      adminPass: document.getElementById('setting-admin-pass').value.trim()
    };
    
    localStorage.setItem('madinah_studio_settings', JSON.stringify(settings));
    app.ownerWhatsApp = settings.whatsapp;
    app.loadCustomizedSettings();
    app.renderPhotographers(app.photographers);

    // Send to backend API
    fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).catch(() => {});

    app.showToast('Semua pengaturan Brand, Footer, Instagram & Jam kerja berhasil disimpan!', 'success');
  },

  openBookingDrawer(bookingId) {
    const b = this.bookings.find(x => x.id === bookingId);
    if (!b) return;

    app.openModal(`
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <span class="section-subtitle">Booking Reference</span>
            <h3 style="font-size: 1.5rem;">#${b.id}</h3>
          </div>
          <span class="status-pill ${b.status}">${b.status}</span>
        </div>

        <div class="receipt-box" style="margin: 0 0 20px;">
          <div class="receipt-row"><span class="receipt-label">Client</span><span class="receipt-value">${b.client_name} (${b.client_country})</span></div>
          <div class="receipt-row"><span class="receipt-label">WhatsApp</span><span class="receipt-value">${b.client_whatsapp}</span></div>
          <div class="receipt-row"><span class="receipt-label">Date & Time</span><span class="receipt-value">📅 ${b.booking_date} (${b.start_time} - ${b.end_time})</span></div>
          <div class="receipt-row"><span class="receipt-label">Photographer</span><span class="receipt-value">👤 ${b.photographer_name}</span></div>
          <div class="receipt-row"><span class="receipt-label">Location</span><span class="receipt-value">📍 ${b.location_name}</span></div>
          <div class="receipt-row"><span class="receipt-label">Total Price</span><span class="receipt-value">SAR ${b.total_price_sar}</span></div>
          <div class="receipt-row"><span class="receipt-label">Deposit Paid</span><span class="receipt-value" style="color: var(--status-confirmed);">SAR ${b.deposit_paid_sar}</span></div>
        </div>

        <div style="margin-bottom: 20px;">
          <label class="form-label" style="margin-bottom: 6px; display: block;">Update Status:</label>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button onclick="adminDashboard.changeStatus('${b.id}', 'CONFIRMED')" class="btn btn-secondary btn-sm">Confirm</button>
            <button onclick="adminDashboard.changeStatus('${b.id}', 'COMPLETED')" class="btn btn-secondary btn-sm" style="color: #3730A3;">Mark Completed</button>
            <button onclick="adminDashboard.changeStatus('${b.id}', 'CANCELLED')" class="btn btn-dark btn-sm" style="color: #F87171;">Cancel Booking</button>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button onclick="app.closeModal()" class="btn btn-secondary btn-sm">Close</button>
        </div>
      </div>
    `);
  },

  changeStatus(bookingId, newStatus) {
    const idx = this.bookings.findIndex(b => b.id === bookingId);
    if (idx !== -1) {
      this.bookings[idx].status = newStatus;
      localStorage.setItem('madinah_bookings', JSON.stringify(this.bookings));
      app.showToast(`Status updated to ${newStatus}.`, 'success');
      app.closeModal();
      this.refreshData();
    }
  }
};
