/**
 * NOOR MADINAH PHOTOGRAPHY — CLIENT SELF-SERVICE PORTAL
 */

const clientPortal = {
  currentBooking: null,

  async searchBooking(forcedId = null) {
    const input = document.getElementById('client-search-booking-id');
    const bookingId = (forcedId || (input ? input.value.trim() : '')).toUpperCase();

    if (!bookingId) {
      app.showToast('Please enter your Booking Reference ID.', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/bookings/${bookingId}`);
      if (!res.ok) {
        app.showToast('No booking found with this Reference ID.', 'error');
        return;
      }

      const booking = await res.json();
      this.currentBooking = booking;
      this.renderBookingDetails(booking);
      app.showToast('Booking details loaded.', 'success');

    } catch (err) {
      console.error(err);
      app.showToast('Failed to retrieve booking.', 'error');
    }
  },

  renderBookingDetails(b) {
    const container = document.getElementById('client-booking-detail-card');
    if (!container) return;

    container.style.display = 'block';

    const historyHtml = (b.reschedule_history || []).map(h => `
      <div style="font-size: 0.8rem; color: var(--text-muted); padding: 4px 0;">
        ⏱️ Previously scheduled: ${h.previous_date} (${h.previous_time})
      </div>
    `).join('');

    container.innerHTML = `
      <div class="selectable-card" style="border-color: var(--gold-border); margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 16px; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
          <div>
            <span class="section-subtitle">Reference #${b.id}</span>
            <h3 style="font-size: 1.6rem;">${b.service_title}</h3>
          </div>
          <div>
            <span class="status-pill ${b.status}">${b.status}</span>
          </div>
        </div>

        <div class="form-grid" style="margin-bottom: 24px;">
          <div>
            <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted);">Scheduled Date & Time</span>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">📅 ${b.booking_date}</div>
            <div style="font-size: 0.92rem; color: var(--gold-hover); font-weight: 600;">⏰ ${b.start_time} – ${b.end_time} (Asia/Riyadh)</div>
          </div>

          <div>
            <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted);">Assigned Photographer</span>
            <div style="font-size: 1.1rem; font-weight: 700;">👤 ${b.photographer_name}</div>
            <div style="font-size: 0.84rem; color: var(--text-secondary);">${b.photographer_title}</div>
          </div>

          <div>
            <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted);">Meeting Location</span>
            <div style="font-size: 1.1rem; font-weight: 700;">📍 ${b.location_name}</div>
            <div style="font-size: 0.84rem; color: var(--gold-hover);">${b.location_arabic || ''}</div>
          </div>

          <div>
            <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted);">Package & Deliverables</span>
            <div style="font-size: 1.1rem; font-weight: 700;">📸 ${b.package_name}</div>
            <div style="font-size: 0.84rem; color: var(--text-secondary);">${b.edited_photos_count} Retouched Photos ${b.raw_photos_included ? '+ All RAWs' : ''}</div>
          </div>
        </div>

        ${historyHtml ? `<div style="background: var(--bg-primary); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 20px;"><strong>Reschedule Audit Log:</strong>${historyHtml}</div>` : ''}

        <div style="display: flex; flex-wrap: wrap; gap: 12px; padding-top: 20px; border-top: 1px solid var(--border-subtle);">
          <a href="${b.whatsapp_links.confirmation_url}" target="_blank" class="btn btn-primary btn-sm" style="background: #25D366; color: #fff; border: none;">
            💬 Chat with Studio / Photographer
          </a>
          <a href="/api/bookings/${b.id}/ical" download class="btn btn-secondary btn-sm">
            📅 Download iCal (.ics)
          </a>
          ${b.status !== 'CANCELLED' ? `
            <button onclick="clientPortal.openRescheduleModal()" class="btn btn-secondary btn-sm">
              🗓️ Reschedule Date/Time
            </button>
            <button onclick="clientPortal.confirmCancelBooking()" class="btn btn-dark btn-sm" style="color: #F87171;">
              ✕ Cancel Session
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Madinah Preparation & Etiquette Guide -->
      <div class="selectable-card">
        <h4 style="font-size: 1.15rem; margin-bottom: 12px;">✦ Madinah Photoshoot Preparation & Etiquette</h4>
        <ul class="pkg-features-list">
          <li><strong>Punctuality:</strong> Please arrive 10 minutes before your slot time at the specified meeting spot.</li>
          <li><strong>Modesty & Dress Code:</strong> Respectful, modest attire is required across all Holy Sanctuary perimeters. Light earth tones and crisp white thobes/abayas photograph with stunning warmth.</li>
          <li><strong>Weather Comfort:</strong> Morning shoots enjoy cooler temperatures. Keep hydration handy.</li>
          <li><strong>Digital Delivery:</strong> Your color-graded high-resolution photos will be ready in 48 hours.</li>
        </ul>
      </div>
    `;
  },

  openRescheduleModal() {
    const b = this.currentBooking;
    if (!b) return;

    app.openModal(`
      <div>
        <h3 style="font-size: 1.4rem; margin-bottom: 6px;">Reschedule Session #${b.id}</h3>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 20px;">
          Select a new date and available slot. The schedule change will be processed immediately.
        </p>

        <div class="form-group" style="margin-bottom: 16px;">
          <label class="form-label">Select New Date *</label>
          <input type="date" id="reschedule-date-picker" class="form-input" onchange="clientPortal.loadRescheduleSlots(this.value)">
        </div>

        <div id="reschedule-slots-box" style="margin-bottom: 20px;">
          <label class="form-label">Available Slots (Asia/Riyadh):</label>
          <div id="reschedule-slots-grid" class="slots-grid" style="margin-top: 8px;">
            <span style="font-size: 0.84rem; color: var(--text-muted);">Please select a new date first.</span>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <button onclick="app.closeModal()" class="btn btn-secondary btn-sm">Close</button>
          <button id="reschedule-submit-btn" onclick="clientPortal.submitReschedule()" class="btn btn-primary btn-sm" disabled>Confirm Reschedule</button>
        </div>
      </div>
    `);
  },

  async loadRescheduleSlots(dateStr) {
    const b = this.currentBooking;
    const container = document.getElementById('reschedule-slots-grid');
    if (!container || !b) return;

    container.innerHTML = '<span style="font-size: 0.84rem; color: var(--text-muted);">Checking availability...</span>';

    try {
      const url = `/api/availability?date=${dateStr}&duration=${b.total_duration_min}&buffer=${b.buffer_min}&photographer_id=${b.photographer_id}&location_id=${b.location_id}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.slots || data.slots.length === 0) {
        container.innerHTML = '<span style="color: #991B1B; font-size: 0.84rem;">No free slots on this date for this photographer. Try another date.</span>';
        return;
      }

      container.innerHTML = data.slots.map(s => `
        <button type="button" class="slot-btn" onclick="clientPortal.selectRescheduleSlot(this, '${dateStr}', '${s.time}')">
          <span class="slot-time">${s.time}</span>
          ${s.golden_hour_badge ? `<span class="slot-badge">${s.golden_hour_badge}</span>` : ''}
        </button>
      `).join('');

    } catch (err) {
      container.innerHTML = '<span style="color: red; font-size: 0.84rem;">Failed to fetch slots.</span>';
    }
  },

  selectRescheduleSlot(btn, dateStr, timeStr) {
    const buttons = document.querySelectorAll('#reschedule-slots-grid .slot-btn');
    buttons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    this.newRescheduleDate = dateStr;
    this.newRescheduleTime = timeStr;

    const submitBtn = document.getElementById('reschedule-submit-btn');
    if (submitBtn) submitBtn.disabled = false;
  },

  async submitReschedule() {
    const b = this.currentBooking;
    if (!b || !this.newRescheduleDate || !this.newRescheduleTime) return;

    try {
      const res = await fetch(`/api/bookings/${b.id}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: this.newRescheduleDate,
          start_time: this.newRescheduleTime
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        app.showToast(data.error || 'Reschedule failed.', 'error');
        return;
      }

      app.closeModal();
      this.currentBooking = data.booking;
      this.renderBookingDetails(data.booking);
      app.showToast('Session successfully rescheduled!', 'success');

    } catch (err) {
      console.error(err);
      app.showToast('Network error while rescheduling.', 'error');
    }
  },

  async confirmCancelBooking() {
    const b = this.currentBooking;
    if (!b) return;

    if (!confirm(`Are you sure you want to cancel booking #${b.id}? This slot will be released immediately.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/bookings/${b.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Client requested cancellation via portal' })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        app.showToast(data.error || 'Cancellation failed.', 'error');
        return;
      }

      app.showToast('Booking cancelled.', 'info');
      this.searchBooking(b.id);

    } catch (err) {
      console.error(err);
      app.showToast('Error cancelling booking.', 'error');
    }
  }
};
