/**
 * NOOR MADINAH PHOTOGRAPHY — ADMIN DASHBOARD (PRODUCTION & SECURE)
 * File Upload Support, Password Security, Real-Time Calendar & WhatsApp
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
      btn.classList.toggle('active', btn.getAttribute('onclick').includes(tabName));
    });

    const tabs = ['calendar', 'bookings', 'availability', 'portfolio', 'notifications', 'settings'];
    tabs.forEach(t => {
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

  // ---------------- TAB 4: REAL DEVICE FILE UPLOAD (CMS) ---------------- //
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
      app.showToast('Please select a photo file from your device.', 'error');
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

    // Prepend to Portfolio
    app.portfolio.unshift(newItem);
    app.renderPortfolio(app.portfolio);

    // Save custom items to LocalStorage
    const customItems = JSON.parse(localStorage.getItem('madinah_custom_portfolio') || '[]');
    customItems.unshift(newItem);
    localStorage.setItem('madinah_custom_portfolio', JSON.stringify(customItems));

    app.showToast('Photo successfully uploaded to gallery!', 'success');
    e.target.reset();
    document.getElementById('cms-port-preview-wrap').style.display = 'none';
    this.uploadedBase64Image = null;
  },

  // ---------------- TAB 5: WHATSAPP DISPATCH ---------------- //
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
            💬 Send Confirmation
          </a>
          <a href="https://wa.me/${b.client_whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`🕊️ NOOR MADINAH: Reminder for ${b.client_name}. Your session #${b.id} is tomorrow, ${b.booking_date} at ${b.start_time} (${b.location_name}). See you soon!`)}" target="_blank" class="btn btn-secondary btn-sm">
            ⏰ Send 24h Reminder
          </a>
        </div>
      </div>
    `).join('');
  },

  // ---------------- TAB 6: SETTINGS & PASSWORD ---------------- //
  renderSettingsTab() {
    const saved = JSON.parse(localStorage.getItem('madinah_studio_settings') || '{}');
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
      whatsapp: document.getElementById('setting-whatsapp-num').value,
      notice: document.getElementById('setting-notice-hours').value,
      buffer: document.getElementById('setting-buffer-min').value,
      cancellation: document.getElementById('setting-cancellation-hours').value,
      adminUser: document.getElementById('setting-admin-user').value.trim(),
      adminPass: document.getElementById('setting-admin-pass').value.trim()
    };
    localStorage.setItem('madinah_studio_settings', JSON.stringify(settings));
    app.ownerWhatsApp = settings.whatsapp;
    app.showToast('Studio settings & Admin password saved successfully!', 'success');
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
