/**
 * NOOR MADINAH PHOTOGRAPHY — ADMIN DASHBOARD & STUDIO MANAGEMENT
 */

const adminDashboard = {
  currentTab: 'calendar',
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(), // 0-indexed
  dashboardData: null,
  calendarEvents: [],
  allBookings: [],
  availabilityRules: [],
  dateOverrides: [],

  init() {
    this.refreshData();
    this.populatePhotographerOptions();
  },

  async refreshData() {
    try {
      const monthStr = `${this.calYear}-${String(this.calMonth + 1).padStart(2, '0')}`;
      
      const [dashRes, calRes, bookRes, rulesRes, overRes, setRes] = await Promise.all([
        fetch('/api/admin/dashboard').then(r => r.json()),
        fetch(`/api/admin/calendar?month=${monthStr}`).then(r => r.json()),
        fetch('/api/admin/bookings').then(r => r.json()),
        fetch('/api/admin/availability-rules').then(r => r.json()),
        fetch('/api/admin/date-overrides').then(r => r.json()),
        fetch('/api/admin/settings').then(r => r.json())
      ]);

      this.dashboardData = dashRes;
      this.calendarEvents = calRes.events || [];
      this.allBookings = bookRes || [];
      this.availabilityRules = rulesRes || [];
      this.dateOverrides = overRes || [];
      this.settings = setRes || {};

      this.renderKPIs();
      this.renderCalendar();
      this.renderBookingsTable();
      this.renderAvailabilityTab();
      this.renderWhatsAppTab();
      this.renderSettingsTab();

    } catch (err) {
      console.error('Admin data refresh failed:', err);
      app.showToast('Failed to fetch admin data.', 'error');
    }
  },

  populatePhotographerOptions() {
    const sel = document.getElementById('override-photog-select');
    if (!sel) return;
    sel.innerHTML = '<option value="all">All Photographers</option>' + 
      app.photographers.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
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
    if (!this.dashboardData || !this.dashboardData.metrics) return;
    const m = this.dashboardData.metrics;

    document.getElementById('kpi-today-shoots').textContent = m.today_shoots;
    document.getElementById('kpi-upcoming-shoots').textContent = m.upcoming_shoots;
    document.getElementById('kpi-revenue').textContent = `SAR ${Number(m.total_revenue_sar).toLocaleString()}`;
    document.getElementById('kpi-pending-payments').textContent = m.pending_payments;
    document.getElementById('kpi-cancellation-rate').textContent = `${m.cancellation_rate}%`;
  },

  // ---------------- TAB 1: VISUAL CALENDAR ---------------- //
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
      const dayBookings = this.calendarEvents.filter(b => b.booking_date === dateStr);

      const chipsHtml = dayBookings.map(b => `
        <div class="cal-booking-chip status-${b.status.toLowerCase()}" onclick="adminDashboard.openBookingDrawer('${b.id}')">
          <strong>${b.start_time}</strong> ${b.client_name.split(' ')[0]}
          <div style="font-size: 0.65rem; color: var(--text-muted);">${b.photographer_name.split(' ')[0]}</div>
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
    if (this.calMonth < 0) {
      this.calMonth = 11;
      this.calYear--;
    }
    this.refreshData();
  },

  nextMonth() {
    this.calMonth++;
    if (this.calMonth > 11) {
      this.calMonth = 0;
      this.calYear++;
    }
    this.refreshData();
  },

  // ---------------- TAB 2: BOOKINGS TABLE ---------------- //
  renderBookingsTable() {
    const tbody = document.getElementById('admin-bookings-tbody');
    if (!tbody) return;

    if (this.allBookings.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 24px;">No bookings found.</td></tr>';
      return;
    }

    tbody.innerHTML = this.allBookings.map(b => `
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
        <td>
          <span class="status-pill ${b.status}">${b.status}</span>
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button onclick="adminDashboard.openBookingDrawer('${b.id}')" class="btn btn-secondary btn-sm" style="padding: 4px 8px; font-size: 0.74rem;">Details</button>
            <a href="https://wa.me/${b.client_whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="btn btn-dark btn-sm" style="padding: 4px 8px; font-size: 0.74rem; background: #25D366; border: none;">WhatsApp</a>
          </div>
        </td>
      </tr>
    `).join('');
  },

  // ---------------- TAB 3: AVAILABILITY & DATE OVERRIDES ---------------- //
  renderAvailabilityTab() {
    // 1. Render Overrides List
    const overList = document.getElementById('admin-overrides-list');
    if (overList) {
      if (this.dateOverrides.length === 0) {
        overList.innerHTML = '<div style="font-size: 0.84rem; color: var(--text-muted);">No custom date overrides active.</div>';
      } else {
        overList.innerHTML = this.dateOverrides.map(o => `
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-primary); padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <div>
              <strong>${o.override_date}</strong>: ${o.is_off ? '<span style="color: #991B1B; font-weight: bold;">CLOSED (DAY OFF)</span>' : `Custom Hours (${o.custom_start_time} - ${o.custom_end_time})`}
              <div style="font-size: 0.76rem; color: var(--text-muted);">${o.photographer_name} • ${o.reason || 'No note'}</div>
            </div>
            <button onclick="adminDashboard.deleteOverride(${o.id})" class="btn btn-dark btn-sm" style="padding: 2px 8px; font-size: 0.72rem; color: #F87171;">Remove</button>
          </div>
        `).join('');
      }
    }

    // 2. Render Weekly Standard Rules
    const weekContainer = document.getElementById('admin-weekly-rules-container');
    if (weekContainer) {
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      weekContainer.innerHTML = this.availabilityRules.map(r => `
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem; padding: 6px 0; border-bottom: 1px solid var(--border-subtle);">
          <span><strong>${r.photographer_name.split(' ')[0]}</strong>: ${days[r.day_of_week]}</span>
          <span style="color: ${r.is_active ? 'var(--text-primary)' : '#991B1B'};">
            ${r.is_active ? `${r.start_time} – ${r.end_time}` : 'OFF'}
          </span>
        </div>
      `).join('');
    }
  },

  toggleOverrideHours(isOffVal) {
    const group = document.getElementById('override-hours-group');
    if (group) group.style.display = (isOffVal === '0') ? 'block' : 'none';
  },

  async createOverride(e) {
    e.preventDefault();
    const dateVal = document.getElementById('override-date-input').value;
    const photogVal = document.getElementById('override-photog-select').value;
    const isOffVal = document.getElementById('override-is-off').value === '1';
    const customStart = document.getElementById('override-start-time').value;
    const customEnd = document.getElementById('override-end-time').value;
    const reason = document.getElementById('override-reason').value;

    try {
      const res = await fetch('/api/admin/date-overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          override_date: dateVal,
          photographer_id: photogVal,
          is_off: isOffVal,
          custom_start_time: customStart,
          custom_end_time: customEnd,
          reason: reason
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        app.showToast(data.error || 'Failed to add override.', 'error');
        return;
      }

      app.showToast('Date override saved successfully.', 'success');
      document.getElementById('override-form').reset();
      this.refreshData();

    } catch (err) {
      console.error(err);
      app.showToast('Error creating override.', 'error');
    }
  },

  async deleteOverride(id) {
    if (!confirm('Remove this date override?')) return;
    try {
      await fetch('/api/admin/date-overrides/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      app.showToast('Override removed.', 'info');
      this.refreshData();
    } catch (err) {
      app.showToast('Error deleting override.', 'error');
    }
  },

  // ---------------- TAB 4: PORTFOLIO CMS ---------------- //
  async addPortfolioItem(e) {
    e.preventDefault();
    const title = document.getElementById('cms-port-title').value;
    const category = document.getElementById('cms-port-cat').value;
    const image_url = document.getElementById('cms-port-img').value;
    const location_tag = document.getElementById('cms-port-loc').value;

    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, image_url, location_tag })
      });
      const data = await res.json();
      if (data.success) {
        app.showToast('Portfolio image added.', 'success');
        app.fetchAllData();
      }
    } catch (err) {
      app.showToast('Failed to add portfolio.', 'error');
    }
  },

  // ---------------- TAB 5: WHATSAPP CENTER ---------------- //
  renderWhatsAppTab() {
    const container = document.getElementById('admin-whatsapp-templates-list');
    if (!container) return;

    const recent = this.allBookings.slice(0, 5);
    if (recent.length === 0) {
      container.innerHTML = '<p>No bookings available for notification dispatch.</p>';
      return;
    }

    container.innerHTML = recent.map(b => `
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
          <a href="https://wa.me/${b.client_whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`📸 NOOR MADINAH: Your high-resolution photo gallery for session #${b.id} is ready for download! View here: https://madinahphotos.com/my-booking?id=${b.id}`)}" target="_blank" class="btn btn-secondary btn-sm">
            🖼️ Send Gallery Delivery Link
          </a>
        </div>
      </div>
    `).join('');
  },

  // ---------------- TAB 6: SETTINGS ---------------- //
  renderSettingsTab() {
    if (!this.settings) return;
    if (this.settings.minimum_notice_hours) document.getElementById('setting-notice-hours').value = this.settings.minimum_notice_hours;
    if (this.settings.default_buffer_min) document.getElementById('setting-buffer-min').value = this.settings.default_buffer_min;
    if (this.settings.cancellation_deadline_hours) document.getElementById('setting-cancellation-hours').value = this.settings.cancellation_deadline_hours;
    if (this.settings.whatsapp_business_number) document.getElementById('setting-whatsapp-num').value = this.settings.whatsapp_business_number;
  },

  async saveSettings(e) {
    e.preventDefault();
    const payload = {
      minimum_notice_hours: document.getElementById('setting-notice-hours').value,
      default_buffer_min: document.getElementById('setting-buffer-min').value,
      cancellation_deadline_hours: document.getElementById('setting-cancellation-hours').value,
      whatsapp_business_number: document.getElementById('setting-whatsapp-num').value
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        app.showToast('Studio settings saved.', 'success');
      }
    } catch (err) {
      app.showToast('Failed to save settings.', 'error');
    }
  },

  // ---------------- BOOKING DRAWER MODAL ---------------- //
  async openBookingDrawer(bookingId) {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`);
      if (!res.ok) return;
      const b = await res.json();

      app.openModal(`
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div>
              <span class="section-subtitle">Booking Details</span>
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
            <div class="receipt-row"><span class="receipt-label">Package</span><span class="receipt-value">📸 ${b.service_title} — ${b.package_name}</span></div>
            <div class="receipt-row"><span class="receipt-label">Total Price</span><span class="receipt-value">SAR ${b.total_price_sar}</span></div>
            <div class="receipt-row"><span class="receipt-label">Deposit Paid</span><span class="receipt-value" style="color: var(--status-confirmed);">SAR ${b.deposit_paid_sar} (${b.payment_method})</span></div>
            <div class="receipt-row"><span class="receipt-label">Celebration & Notes</span><span class="receipt-value">${b.celebration_type || '-'} (${b.special_requests || 'No special requests'})</span></div>
          </div>

          <div style="margin-bottom: 20px;">
            <label class="form-label" style="margin-bottom: 6px; display: block;">Update Status:</label>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button onclick="adminDashboard.changeStatus('${b.id}', 'CONFIRMED')" class="btn btn-secondary btn-sm">Confirm</button>
              <button onclick="adminDashboard.changeStatus('${b.id}', 'COMPLETED')" class="btn btn-secondary btn-sm" style="color: #3730A3;">Mark Completed</button>
              <button onclick="adminDashboard.changeStatus('${b.id}', 'NO_SHOW')" class="btn btn-secondary btn-sm" style="color: #B45309;">Mark No Show</button>
              <button onclick="adminDashboard.changeStatus('${b.id}', 'CANCELLED')" class="btn btn-dark btn-sm" style="color: #F87171;">Cancel Booking</button>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end;">
            <button onclick="app.closeModal()" class="btn btn-secondary btn-sm">Close</button>
          </div>
        </div>
      `);
    } catch (err) {
      console.error(err);
    }
  },

  async changeStatus(bookingId, status) {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        app.showToast(`Status updated to ${status}.`, 'success');
        app.closeModal();
        this.refreshData();
      }
    } catch (err) {
      app.showToast('Failed to update status.', 'error');
    }
  }
};
