/**
 * NOOR MADINAH PHOTOGRAPHY — CLIENT PORTAL (PRODUCTION READY)
 */

const clientPortal = {
  currentBooking: null,

  searchBooking(forcedId = null) {
    const input = document.getElementById('client-search-booking-id');
    const bookingId = (forcedId || (input ? input.value.trim() : '')).toUpperCase();

    if (!bookingId) {
      app.showToast('Please enter your Booking Reference ID.', 'error');
      return;
    }

    const saved = JSON.parse(localStorage.getItem('madinah_bookings') || '[]');
    const booking = saved.find(b => b.id === bookingId);

    if (!booking) {
      app.showToast('No booking found with Reference ID: ' + bookingId, 'error');
      return;
    }

    this.currentBooking = booking;
    this.renderBookingDetails(booking);
    app.showToast('Booking details retrieved successfully.', 'success');
  },

  renderBookingDetails(b) {
    const container = document.getElementById('client-booking-detail-card');
    if (!container) return;

    container.style.display = 'block';

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
            <div style="font-size: 0.84rem; color: var(--text-secondary);">Lead Madinah Artist</div>
          </div>

          <div>
            <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted);">Meeting Location</span>
            <div style="font-size: 1.1rem; font-weight: 700;">📍 ${b.location_name}</div>
          </div>

          <div>
            <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted);">Package</span>
            <div style="font-size: 1.1rem; font-weight: 700;">📸 ${b.package_name}</div>
            <div style="font-size: 0.84rem; color: var(--status-confirmed);">Deposit Paid: SAR ${b.deposit_paid_sar}</div>
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 12px; padding-top: 20px; border-top: 1px solid var(--border-subtle);">
          <a href="${b.whatsapp_url || `https://wa.me/${b.client_whatsapp.replace(/[^0-9]/g, '')}`}" target="_blank" class="btn btn-primary btn-sm" style="background: #25D366; color: #fff; border: none;">
            💬 Chat with Studio / Photographer
          </a>
          <button onclick="window.print()" class="btn btn-secondary btn-sm">
            🖨️ Print Receipt
          </button>
        </div>
      </div>
    `;
  }
};
