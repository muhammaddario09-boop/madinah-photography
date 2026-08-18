/**
 * NOOR MADINAH PHOTOGRAPHY — 8-STEP INTERACTIVE RESERVATION ENGINE
 */

const bookingWizard = {
  currentStep: 1,
  selectedService: null,
  selectedPackage: null,
  selectedLocation: null,
  selectedPhotographerId: 'any',
  selectedDateStr: null,
  selectedTimeSlot: null,
  selectedPaymentMethod: 'Credit Card / Mada',
  clientData: {},
  photoshootDetails: {},
  createdBooking: null,

  // Calendar State
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(), // 0-indexed

  init(preSelectedServiceId = null, preSelectedPackageId = null, preSelectedPhotographerId = null) {
    this.currentStep = 1;
    this.selectedTimeSlot = null;
    this.createdBooking = null;

    if (preSelectedPhotographerId) {
      this.selectedPhotographerId = preSelectedPhotographerId;
    }

    this.renderStepsIndicator();
    this.renderStep1Services(preSelectedServiceId, preSelectedPackageId);
    this.renderStep3LocationsAndPhotographers();
    this.renderCalendar();
    this.updateWizardView();
    this.updateSummaryBar();
  },

  renderStepsIndicator() {
    const labels = [
      '1. Service',
      '2. Package',
      '3. Location',
      '4. Date & Time',
      '5. Client',
      '6. Details',
      '7. Deposit',
      '8. Confirmed'
    ];

    const container = document.getElementById('wizard-steps-indicator');
    if (!container) return;

    container.innerHTML = labels.map((label, idx) => {
      const stepNum = idx + 1;
      const isActive = stepNum === this.currentStep;
      const isCompleted = stepNum < this.currentStep;
      return `
        <div class="wizard-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" onclick="bookingWizard.goToStep(${stepNum})">
          <div class="step-circle">${isCompleted ? '✓' : stepNum}</div>
          <span class="step-label">${label.split('. ')[1]}</span>
        </div>
      `;
    }).join('');
  },

  updateWizardView() {
    this.renderStepsIndicator();
    for (let i = 1; i <= 8; i++) {
      const pane = document.getElementById(`step-pane-${i}`);
      if (pane) pane.classList.toggle('active', i === this.currentStep);
    }

    const titles = [
      'Step 1: Select Photography Experience',
      'Step 2: Select Package & Inclusions',
      'Step 3: Select Location & Artist',
      'Step 4: Select Date & Available Slot (Asia/Riyadh)',
      'Step 5: Client Contact Details',
      'Step 6: Photoshoot Style & Celebration',
      'Step 7: Payment & Deposit Summary',
      'Step 8: Booking Confirmed'
    ];

    const titleEl = document.getElementById('wizard-step-title');
    if (titleEl) titleEl.textContent = titles[this.currentStep - 1];

    const prevBtn = document.getElementById('wizard-prev-btn');
    const nextBtn = document.getElementById('wizard-next-btn');
    const summaryBar = document.getElementById('wizard-summary-bar');

    if (this.currentStep === 8) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (summaryBar) summaryBar.style.display = 'none';
    } else {
      if (summaryBar) summaryBar.style.display = 'flex';
      if (prevBtn) prevBtn.style.display = (this.currentStep > 1) ? 'inline-flex' : 'none';
      if (nextBtn) {
        nextBtn.style.display = 'inline-flex';
        nextBtn.textContent = (this.currentStep === 7) ? 'Confirm & Pay Deposit' : 'Continue';
      }
    }
  },

  updateSummaryBar() {
    const sPill = document.getElementById('summary-pill-service');
    const slPill = document.getElementById('summary-pill-slot');
    const tPill = document.getElementById('summary-pill-total');

    if (sPill) {
      sPill.querySelector('span').textContent = this.selectedService ? `${this.selectedService.title} (${this.selectedPackage ? this.selectedPackage.name : ''})` : 'Not Selected';
    }
    if (slPill) {
      slPill.querySelector('span').textContent = (this.selectedDateStr && this.selectedTimeSlot) ? `${this.selectedDateStr} @ ${this.selectedTimeSlot.time}` : 'Not Selected';
    }
    if (tPill) {
      tPill.querySelector('span').textContent = this.selectedPackage ? app.formatPrice(this.selectedPackage.price_sar) : 'SAR 0';
    }
  },

  // ---------------- STEP 1: SERVICES ---------------- //
  renderStep1Services(preServiceId = null, prePackageId = null) {
    const container = document.getElementById('step1-services-grid');
    if (!container) return;

    container.innerHTML = app.services.map(s => {
      const isSelected = this.selectedService && this.selectedService.id === s.id;
      return `
        <div class="selectable-card ${isSelected ? 'selected' : ''}" onclick="bookingWizard.selectService(${s.id})">
          <span style="font-size: 0.76rem; color: var(--gold-hover); text-transform: uppercase; font-weight: 600;">${s.subtitle || ''}</span>
          <h4 style="font-size: 1.25rem; margin: 4px 0 8px;">${s.title}</h4>
          <p style="font-size: 0.86rem; color: var(--text-secondary); margin-bottom: 14px;">${s.description}</p>
          <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary);">
            From ${app.formatPrice(s.starting_price_sar)}
          </div>
        </div>
      `;
    }).join('');

    if (preServiceId) {
      this.selectService(preServiceId, false);
      if (prePackageId) {
        this.selectPackage(prePackageId);
      }
    }
  },

  selectService(serviceId, autoAdvance = true) {
    this.selectedService = app.services.find(s => s.id === serviceId);
    this.renderStep1Services();
    this.renderStep2Packages();
    this.updateSummaryBar();
    if (autoAdvance) {
      this.nextStep();
    }
  },

  // ---------------- STEP 2: PACKAGES ---------------- //
  renderStep2Packages() {
    const container = document.getElementById('step2-packages-grid');
    if (!container || !this.selectedService) return;

    container.innerHTML = this.selectedService.packages.map(p => {
      const isSelected = this.selectedPackage && this.selectedPackage.id === p.id;
      const featuresHtml = (p.features || []).map(f => `<li>${f}</li>`).join('');

      return `
        <div class="selectable-card ${isSelected ? 'selected' : ''}" onclick="bookingWizard.selectPackage(${p.id})">
          ${p.badge ? `<span style="position: absolute; top: 16px; right: 16px; background: var(--gold-light); color: var(--gold-hover); font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full);">${p.badge}</span>` : ''}
          <h4 style="font-size: 1.3rem; margin-bottom: 4px;">${p.name}</h4>
          <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 12px;">⏱️ Duration: ${p.duration_min} minutes • ${p.edited_photos_count} Edited Deliverables</div>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 16px;">${p.description || ''}</p>
          
          <ul class="pkg-features-list">
            ${featuresHtml}
          </ul>

          <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Package Price:</span>
            <span style="font-size: 1.25rem; font-weight: 700; color: var(--gold-hover);">${app.formatPrice(p.price_sar)}</span>
          </div>
        </div>
      `;
    }).join('');
  },

  selectPackage(packageId, autoAdvance = true) {
    if (!this.selectedService) return;
    this.selectedPackage = this.selectedService.packages.find(p => p.id === packageId);
    this.renderStep2Packages();
    this.updateSummaryBar();
    if (autoAdvance) {
      this.nextStep();
    }
  },

  // ---------------- STEP 3: LOCATION & PHOTOGRAPHER ---------------- //
  renderStep3LocationsAndPhotographers() {
    const locContainer = document.getElementById('step3-locations-grid');
    if (locContainer) {
      if (!this.selectedLocation && app.locations.length > 0) {
        this.selectedLocation = app.locations[0];
      }
      locContainer.innerHTML = app.locations.map(loc => {
        const isSelected = this.selectedLocation && this.selectedLocation.id === loc.id;
        return `
          <div class="selectable-card ${isSelected ? 'selected' : ''}" onclick="bookingWizard.selectLocation(${loc.id})">
            <span style="font-size: 0.8rem; color: var(--gold-hover); font-weight: 600;">${loc.arabic_name || ''}</span>
            <h4 style="font-size: 1.15rem; margin: 4px 0 6px;">${loc.name}</h4>
            <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 10px;">${loc.description}</p>
            <div style="font-size: 0.76rem; color: var(--text-muted);">⏱️ Travel Buffer: +${loc.travel_buffer_min}m</div>
          </div>
        `;
      }).join('');
    }

    const photogContainer = document.getElementById('step3-photographers-grid');
    if (photogContainer) {
      const anySelected = this.selectedPhotographerId === 'any';
      let html = `
        <div class="selectable-card ${anySelected ? 'selected' : ''}" onclick="bookingWizard.selectPhotographer('any')">
          <h4 style="font-size: 1.15rem; margin-bottom: 4px;">🌟 Any Available Master Photographer</h4>
          <p style="font-size: 0.84rem; color: var(--text-secondary);">Highest availability! System automatically assigns the best matched artist on duty.</p>
        </div>
      `;

      html += app.photographers.map(p => {
        const isSelected = this.selectedPhotographerId == p.id;
        return `
          <div class="selectable-card ${isSelected ? 'selected' : ''}" onclick="bookingWizard.selectPhotographer(${p.id})">
            <h4 style="font-size: 1.15rem; margin-bottom: 4px;">👤 ${p.name}</h4>
            <div style="font-size: 0.78rem; color: var(--gold-hover); font-weight: 600; margin-bottom: 6px;">${p.title}</div>
            <p style="font-size: 0.82rem; color: var(--text-secondary);">${p.specialties || ''}</p>
          </div>
        `;
      }).join('');

      photogContainer.innerHTML = html;
    }
  },

  selectLocation(locId) {
    this.selectedLocation = app.locations.find(l => l.id === locId);
    this.renderStep3LocationsAndPhotographers();
    if (this.selectedDateStr) {
      this.fetchAvailableSlots();
    }
  },

  selectPhotographer(pid) {
    this.selectedPhotographerId = pid;
    this.renderStep3LocationsAndPhotographers();
    if (this.selectedDateStr) {
      this.fetchAvailableSlots();
    }
  },

  // ---------------- STEP 4: DATE & LIVE TIME SLOTS ---------------- //
  renderCalendar() {
    const monthDisplay = document.getElementById('cal-month-display');
    const daysContainer = document.getElementById('cal-days-container');
    if (!monthDisplay || !daysContainer) return;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthDisplay.textContent = `${monthNames[this.calMonth]} ${this.calYear}`;

    const firstDay = new Date(this.calYear, this.calMonth, 1).getDay(); // 0 = Sun
    const adjustedFirstDay = (firstDay === 0) ? 6 : firstDay - 1; // Mon = 0
    const totalDays = new Date(this.calYear, this.calMonth + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let html = '';
    for (let i = 0; i < adjustedFirstDay; i++) {
      html += `<div class="cal-day-cell disabled"></div>`;
    }

    for (let d = 1; d <= totalDays; d++) {
      const cellDate = new Date(this.calYear, this.calMonth, d);
      const dateStr = `${this.calYear}-${String(this.calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      const isPast = cellDate < today;
      const isToday = cellDate.getTime() === today.getTime();
      const isSelected = this.selectedDateStr === dateStr;

      if (isPast) {
        html += `<div class="cal-day-cell disabled">${d}</div>`;
      } else {
        html += `
          <div class="cal-day-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" onclick="bookingWizard.selectDate('${dateStr}')">
            ${d}
          </div>
        `;
      }
    }

    daysContainer.innerHTML = html;
  },

  prevMonth() {
    this.calMonth--;
    if (this.calMonth < 0) {
      this.calMonth = 11;
      this.calYear--;
    }
    this.renderCalendar();
  },

  nextMonth() {
    this.calMonth++;
    if (this.calMonth > 11) {
      this.calMonth = 0;
      this.calYear++;
    }
    this.renderCalendar();
  },

  selectDate(dateStr) {
    this.selectedDateStr = dateStr;
    this.selectedTimeSlot = null;
    this.renderCalendar();

    const label = document.getElementById('slots-selected-date-label');
    if (label) label.textContent = `Available Slots on ${dateStr}`;

    this.fetchAvailableSlots();
  },

  async fetchAvailableSlots() {
    if (!this.selectedDateStr || !this.selectedPackage) return;

    const container = document.getElementById('slots-grid-container');
    const badge = document.getElementById('slots-count-badge');
    const calcInfo = document.getElementById('slot-calculation-info');

    container.innerHTML = '<div style="padding: 20px; color: var(--text-muted);">Checking Madinah photographer schedules...</div>';

    const duration = this.selectedPackage.duration_min;
    const buffer = this.selectedLocation ? this.selectedLocation.travel_buffer_min : 30;
    const photogId = this.selectedPhotographerId;
    const locId = this.selectedLocation ? this.selectedLocation.id : '';

    if (calcInfo) {
      calcInfo.textContent = `⚡ Session: ${duration}m | Travel Buffer: +${buffer}m`;
    }

    try {
      const url = `/api/availability?date=${this.selectedDateStr}&duration=${duration}&buffer=${buffer}&photographer_id=${photogId}&location_id=${locId}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.slots || data.slots.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1/-1; padding: 24px; background: #FEF2F2; border-radius: var(--radius-md); text-align: center; color: #991B1B;">
            <strong>No available slots on this date</strong><br>
            <span style="font-size: 0.84rem;">Please select another date or choose 'Any Available Photographer'.</span>
          </div>
        `;
        if (badge) badge.textContent = '0 slots';
        return;
      }

      if (badge) badge.textContent = `${data.slots.length} slots available`;

      container.innerHTML = data.slots.map(s => {
        const isSelected = this.selectedTimeSlot && this.selectedTimeSlot.time === s.time;
        return `
          <button type="button" class="slot-btn ${isSelected ? 'selected' : ''}" onclick='bookingWizard.selectSlot(${JSON.stringify(s)})'>
            <span class="slot-time">${s.time}</span>
            ${s.golden_hour_badge ? `<span class="slot-badge">${s.golden_hour_badge}</span>` : `<span style="font-size: 0.72rem; color: var(--text-muted);">${s.duration_min}m shoot</span>`}
          </button>
        `;
      }).join('');

    } catch (err) {
      container.innerHTML = '<div style="color: red; padding: 12px;">Failed to fetch slots.</div>';
    }
  },

  selectSlot(slotObj) {
    this.selectedTimeSlot = slotObj;
    this.fetchAvailableSlots();
    this.updateSummaryBar();
  },

  // ---------------- STEP 7: PAYMENT BREAKDOWN ---------------- //
  renderStep7Summary() {
    const container = document.getElementById('step7-pricing-summary');
    if (!container || !this.selectedPackage) return;

    const totalPrice = this.selectedPackage.price_sar;
    const depositPct = this.selectedPackage.deposit_percentage || 30;
    const depositAmount = Math.round(totalPrice * (depositPct / 100));
    const balanceAmount = totalPrice - depositAmount;

    container.innerHTML = `
      <div class="receipt-row">
        <span class="receipt-label">Photoshoot Collection</span>
        <span class="receipt-value">${this.selectedService.title} — ${this.selectedPackage.name}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Scheduled Date & Time (Asia/Riyadh)</span>
        <span class="receipt-value">${this.selectedDateStr} from ${this.selectedTimeSlot.time} to ${this.selectedTimeSlot.end_time}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Location</span>
        <span class="receipt-value">${this.selectedLocation ? this.selectedLocation.name : 'Madinah'}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Lead Client</span>
        <span class="receipt-value">${this.clientData.name} (${this.clientData.whatsapp})</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Total Package Price</span>
        <span class="receipt-value">${app.formatPrice(totalPrice)}</span>
      </div>
      <div class="receipt-row" style="background: rgba(197, 168, 128, 0.1); padding: 12px; border-radius: var(--radius-sm); margin-top: 8px;">
        <span class="receipt-label" style="font-weight: 700; color: var(--gold-hover);">Deposit Due Now (${depositPct}%)</span>
        <span class="receipt-value" style="font-size: 1.2rem; color: var(--gold-hover);">${app.formatPrice(depositAmount)}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Remaining Balance Due on Photoshoot Day</span>
        <span class="receipt-value">${app.formatPrice(balanceAmount)}</span>
      </div>
    `;
  },

  selectPaymentMethod(el, method) {
    this.selectedPaymentMethod = method;
    const cards = el.parentElement.querySelectorAll('.selectable-card');
    cards.forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
  },

  // ---------------- STEP 8: SUBMIT & CONFIRM ---------------- //
  async submitBooking() {
    const payload = {
      service_id: this.selectedService.id,
      package_id: this.selectedPackage.id,
      location_id: this.selectedLocation.id,
      photographer_id: this.selectedPhotographerId,
      date: this.selectedDateStr,
      start_time: this.selectedTimeSlot.time,
      client_name: this.clientData.name,
      client_email: this.clientData.email,
      client_whatsapp: this.clientData.whatsapp,
      client_country: this.clientData.country,
      celebration_type: this.photoshootDetails.celebration,
      people_count: this.photoshootDetails.people,
      photo_style: this.photoshootDetails.style,
      special_requests: this.photoshootDetails.notes,
      payment_method: this.selectedPaymentMethod
    };

    try {
      const nextBtn = document.getElementById('wizard-next-btn');
      if (nextBtn) {
        nextBtn.disabled = true;
        nextBtn.textContent = 'Locking Slot & Securing...';
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        app.showToast(data.error || 'This time slot is no longer available.', 'error');
        if (nextBtn) {
          nextBtn.disabled = false;
          nextBtn.textContent = 'Confirm & Pay Deposit';
        }
        // Jump back to step 4 so client can select an alternate slot
        this.goToStep(4);
        return;
      }

      this.createdBooking = data.booking;
      this.currentStep = 8;
      this.renderStep8Confirmation();
      this.updateWizardView();
      app.showToast('Reservation successfully confirmed!', 'success');

    } catch (err) {
      console.error(err);
      app.showToast('Server connection error. Please try again.', 'error');
    }
  },

  renderStep8Confirmation() {
    const container = document.getElementById('step8-confirmation-content');
    if (!container || !this.createdBooking) return;

    const b = this.createdBooking;

    container.innerHTML = `
      <div class="confirmation-icon-wrap">✓</div>
      <span class="section-subtitle">Official Reservation Confirmed</span>
      <h2 style="font-size: 2.2rem; margin-bottom: 8px;">We Look Forward to Seeing You in Madinah!</h2>
      <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 24px;">
        Your booking ID is <strong style="color: var(--gold-hover);">${b.id}</strong>. A full confirmation & preparation guide has been generated.
      </p>

      <div class="receipt-box">
        <div class="receipt-row">
          <span class="receipt-label">Booking ID</span>
          <span class="receipt-value">${b.id}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Assigned Photographer</span>
          <span class="receipt-value">👤 ${b.photographer_name}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Date & Time</span>
          <span class="receipt-value">📅 ${b.booking_date} (${b.start_time} – ${b.end_time})</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Meeting Point Location</span>
          <span class="receipt-value">📍 ${b.location_name}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Collection</span>
          <span class="receipt-value">📸 ${b.service_title} — ${b.package_name}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Deposit Paid</span>
          <span class="receipt-value" style="color: var(--status-confirmed);">SAR ${b.deposit_paid_sar} (Deposit Verified)</span>
        </div>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 30px;">
        <a href="${b.whatsapp_links.confirmation_url}" target="_blank" class="btn btn-primary" style="background: #25D366; color: #fff; border: none;">
          💬 Send Confirmation to WhatsApp
        </a>
        <a href="/api/bookings/${b.id}/ical" download class="btn btn-secondary">
          📅 Add to Apple / Google Calendar (.ics)
        </a>
        <button onclick="window.print()" class="btn btn-dark">
          🖨️ Print Receipt
        </button>
      </div>

      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--border-light);">
        <button onclick="app.switchView('client-portal'); document.getElementById('client-search-booking-id').value = '${b.id}'; clientPortal.searchBooking('${b.id}');" class="btn btn-secondary btn-sm">
          Open in "My Booking" Client Portal
        </button>
      </div>
    `;
  },

  // ---------------- NAVIGATION ---------------- //
  goToStep(stepNum) {
    if (stepNum > this.currentStep) {
      if (!this.validateStep(this.currentStep)) return;
    }
    this.currentStep = stepNum;
    if (stepNum === 7) {
      this.renderStep7Summary();
    }
    this.updateWizardView();
  },

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateWizardView();
    }
  },

  nextStep() {
    if (!this.validateStep(this.currentStep)) return;

    if (this.currentStep === 7) {
      this.submitBooking();
      return;
    }

    this.currentStep++;
    if (this.currentStep === 7) {
      this.renderStep7Summary();
    }
    this.updateWizardView();
  },

  validateStep(step) {
    if (step === 1) {
      if (!this.selectedService) {
        app.showToast('Please choose a photography service to continue.', 'error');
        return false;
      }
    } else if (step === 2) {
      if (!this.selectedPackage) {
        app.showToast('Please choose a package tier to continue.', 'error');
        return false;
      }
    } else if (step === 3) {
      if (!this.selectedLocation) {
        app.showToast('Please select a shoot location.', 'error');
        return false;
      }
    } else if (step === 4) {
      if (!this.selectedDateStr || !this.selectedTimeSlot) {
        app.showToast('Please select a date and an available time slot.', 'error');
        return false;
      }
    } else if (step === 5) {
      const name = document.getElementById('client-name-input').value.trim();
      const email = document.getElementById('client-email-input').value.trim();
      const whatsapp = document.getElementById('client-whatsapp-input').value.trim();
      const country = document.getElementById('client-country-input').value;

      if (!name || !email || !whatsapp) {
        app.showToast('Please enter your full name, email, and WhatsApp number.', 'error');
        return false;
      }

      this.clientData = { name, email, whatsapp, country };
    } else if (step === 6) {
      this.photoshootDetails = {
        celebration: document.getElementById('detail-celebration-input').value,
        people: document.getElementById('detail-people-input').value,
        style: document.getElementById('detail-style-input').value,
        notes: document.getElementById('detail-notes-input').value.trim()
      };
    }
    return true;
  }
};
