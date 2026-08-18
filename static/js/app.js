/**
 * NOOR MADINAH PHOTOGRAPHY — CORE APPLICATION (SECURE & PRODUCTION READY)
 */

const app = {
  currentView: 'public',
  currentCurrency: 'SAR',
  rates: { SAR: 1.0, USD: 0.27, IDR: 4150 },
  
  services: [
    {
      id: 1,
      slug: "madinah-portrait",
      title: "Madinah Solo Portrait",
      subtitle: "Individual Fine-Art Photography",
      description: "Timeless, deeply personal portraits set against the peaceful limestone arches, marble courtyards, and radiant light of Madinah.",
      cover_image: "/images/portrait_solo.jpg",
      starting_price_sar: 350.0,
      is_popular: 1,
      packages: [
        { id: 1, name: "Essential Portrait", badge: "Popular", duration_min: 45, price_sar: 350.0, price_usd: 95.0, price_idr: 1450000.0, edited_photos_count: 12, raw_photos_included: 0, deposit_percentage: 30.0, description: "Short & refined individual session at a single iconic landmark.", features: ["45-minute private photoshoot", "12 professionally retouched fine-art photos", "1 prime Madinah location", "High-resolution digital delivery in 48 hours", "Outfit & pose guidance in Arabic/English/Indonesian"] },
        { id: 2, name: "Signature Portrait", badge: "Best Value", duration_min: 75, price_sar: 550.0, price_usd: 150.0, price_idr: 2300000.0, edited_photos_count: 25, raw_photos_included: 1, deposit_percentage: 30.0, description: "Extended portrait session with two distinct backdrops and outfit switch.", features: ["75-minute private photoshoot", "25 master-retouched fine-art photos", "All RAW original digital files included", "2 nearby scenic locations", "Express 24-hour turnaround option"] },
        { id: 3, name: "Editorial Prestige", badge: "Luxury", duration_min: 100, price_sar: 850.0, price_usd: 230.0, price_idr: 3500000.0, edited_photos_count: 45, raw_photos_included: 1, deposit_percentage: 30.0, description: "Comprehensive editorial session with full creative direction.", features: ["100-minute luxury photoshoot", "45 high-end color-graded photos", "All RAW original files included", "3 iconic Madinah locations", "Priority VIP 24-hour delivery", "Includes 1 short 4K cinematic video reel"] }
      ]
    },
    {
      id: 2,
      slug: "couple-session",
      title: "Couple & Honeymoon Session",
      subtitle: "Romantic & Modest Editorial",
      description: "Graceful, romantic moments celebrating your marriage or anniversary amidst the serene ambience and historical heritage of Madinah.",
      cover_image: "/images/hero_sunset.jpg",
      starting_price_sar: 550.0,
      is_popular: 1,
      packages: [
        { id: 4, name: "Essential Couple", badge: null, duration_min: 60, price_sar: 550.0, price_usd: 150.0, price_idr: 2300000.0, edited_photos_count: 20, raw_photos_included: 0, deposit_percentage: 30.0, description: "Intimate session celebrating your bond in Madinah.", features: ["60-minute couple photoshoot", "20 retouched fine-art portraits", "1 prime location (Nabawi Perimeter / Quba)", "Private online gallery delivery in 48 hours"] },
        { id: 5, name: "Signature Couple", badge: "Most Chosen", duration_min: 90, price_sar: 850.0, price_usd: 230.0, price_idr: 3500000.0, edited_photos_count: 35, raw_photos_included: 1, deposit_percentage: 30.0, description: "Our most loved couple session with golden hour timing and dual locations.", features: ["90-minute couple session", "35 master-retouched photos + all RAWs", "2 picturesque Madinah spots", "1 cinematic social media highlight clip (4K)"] }
      ]
    },
    {
      id: 3,
      slug: "family-session",
      title: "Family & Pilgrimage Gathering",
      subtitle: "Heirloom Family Documentaries",
      description: "Capture three generations together in the City of the Prophet. Natural, joyful group compositions created to be cherished forever.",
      cover_image: "/images/hero_sunset.jpg",
      starting_price_sar: 750.0,
      is_popular: 1,
      packages: [
        { id: 6, name: "Signature Family", badge: "Top Choice", duration_min: 75, price_sar: 750.0, price_usd: 200.0, price_idr: 3100000.0, edited_photos_count: 30, raw_photos_included: 1, deposit_percentage: 30.0, description: "Heartwarming family moments for up to 6 members.", features: ["75-minute family photoshoot", "30 high-resolution edited photos + all RAWs", "Up to 6 family members included", "Private digital download gallery"] },
        { id: 7, name: "Grand Family Heirloom", badge: "Extended", duration_min: 120, price_sar: 1200.0, price_usd: 320.0, price_idr: 4950000.0, edited_photos_count: 60, raw_photos_included: 1, deposit_percentage: 30.0, description: "Extended gathering for multi-generation families (up to 12 members).", features: ["120-minute comprehensive session", "60 retouched images + all RAW files", "Up to 12 family members", "2 locations with dedicated transport coordination"] }
      ]
    },
    {
      id: 4,
      slug: "umrah-memory",
      title: "Umrah Memory Session",
      subtitle: "Sacred Pilgrimage Milestones",
      description: "Commemorate your sacred journey to the Holy Land with respectful, emotive photography in Ihram or traditional attire.",
      cover_image: "/images/portrait_solo.jpg",
      starting_price_sar: 450.0,
      is_popular: 1,
      packages: [
        { id: 8, name: "Sacred Umrah Memoir", badge: "Pilgrim Favorite", duration_min: 60, price_sar: 450.0, price_usd: 120.0, price_idr: 1850000.0, edited_photos_count: 20, raw_photos_included: 1, deposit_percentage: 30.0, description: "Dedicated pilgrimage documentary session around the Holy Sanctuary.", features: ["60-minute documentary photo session", "20 timeless edited images + all RAW files", "Guidance on respectful etiquette and prayerful poses", "Fast 24-hour turnaround for departing pilgrims"] }
      ]
    },
    {
      id: 5,
      slug: "golden-hour",
      title: "Madinah Golden Hour Experience",
      subtitle: "Sunset & Sunrise Radiance",
      description: "Conducted strictly during magical golden light at Mount Uhud or Prophet's Mosque perimeter for cinematic glow and dramatic skies.",
      cover_image: "/images/hero_sunset.jpg",
      starting_price_sar: 650.0,
      is_popular: 1,
      packages: [
        { id: 9, name: "Golden Hour Radiance", badge: "Exclusive", duration_min: 60, price_sar: 650.0, price_usd: 175.0, price_idr: 2700000.0, edited_photos_count: 25, raw_photos_included: 1, deposit_percentage: 30.0, description: "Exclusive sunset/sunrise session timed with Madinah's golden lighting.", features: ["60-minute golden hour shoot (Sunset / Sunrise)", "25 master-graded golden hour photos + all RAWs", "Dramatic sky and sun-flare compositions"] }
      ]
    },
    {
      id: 6,
      slug: "private-tour-shoot",
      title: "Private Heritage Tour + Photoshoot",
      subtitle: "3-Hour Guided Storytelling",
      description: "An exclusive immersive photography experience traveling through historical date palm groves, Quba, and hidden Madinah vantage points.",
      cover_image: "/images/hero_sunset.jpg",
      starting_price_sar: 1500.0,
      is_popular: 0,
      packages: [
        { id: 10, name: "The Royal Madinah Journey", badge: "VIP VIP", duration_min: 180, price_sar: 1500.0, price_usd: 400.0, price_idr: 6200000.0, edited_photos_count: 80, raw_photos_included: 1, deposit_percentage: 30.0, description: "Comprehensive 3-hour private guided city tour and editorial photo experience.", features: ["3 full hours of private photography & local guidance", "80 high-end retouched photos + all RAW files", "4 iconic historic locations across Madinah", "Private luxury vehicle transfer between spots included"] }
      ]
    }
  ],

  locations: [
    { id: 1, name: "Masjid Nabawi Courtyard & Umbrellas", arabic_name: "ساحات المسجد النبوي الشريف", travel_buffer_min: 20, image_url: "/images/hero_sunset.jpg" },
    { id: 2, name: "Mount Uhud & Archers' Hill (Jabal Rumah)", arabic_name: "جبل أحد وجبل الرماة", travel_buffer_min: 35, image_url: "/images/hero_sunset.jpg" },
    { id: 3, name: "Quba Mosque & Historic Date Palm Oasis", arabic_name: "مسجد قباء ومزارع النخيل", travel_buffer_min: 30, image_url: "/images/portrait_solo.jpg" },
    { id: 4, name: "Old Madinah Heritage & Al-Qiblatain", arabic_name: "حي التراث والقبلتين", travel_buffer_min: 25, image_url: "/images/portrait_solo.jpg" }
  ],

  photographers: [
    { id: 1, name: "Tariq Al-Madani", title: "Principal Editorial Photographer", phone: "+966 54 123 4567", email: "tariq@madinahphotos.com", avatar_url: "/images/portrait_solo.jpg", bio: "Born and raised in Madinah with 10+ years capturing heartfelt moments for royal delegations and international pilgrims.", specialties: "Portrait, Golden Hour, VIP Editorial" },
    { id: 2, name: "Zainab Hashim", title: "Female Portrait & Family Specialist", phone: "+966 56 987 6543", email: "zainab@madinahphotos.com", avatar_url: "/images/portrait_solo.jpg", bio: "Specializing in private female portraits, intimate family bonds, and respectful modest aesthetics.", specialties: "Family, Couple, Modest Editorial, Female Solo" },
    { id: 3, name: "Omar Farooq", title: "Cinematic & Heritage Storyteller", phone: "+966 50 555 8899", email: "omar@madinahphotos.com", avatar_url: "/images/portrait_solo.jpg", bio: "Master of lighting at Mount Uhud, ancient date farms, and historical architectural perspectives.", specialties: "Golden Hour, Private Tour, Architecture, Couple" }
  ],

  portfolio: [
    { id: 1, title: "Golden Hour at the Sanctuary", category: "Golden Hour", image_url: "/images/hero_sunset.jpg", location_tag: "Masjid Nabawi Perimeter", photographer_name: "Tariq Al-Madani" },
    { id: 2, title: "Serenity of Faith", category: "Portrait", image_url: "/images/portrait_solo.jpg", location_tag: "Quba Heritage Gardens", photographer_name: "Tariq Al-Madani" },
    { id: 3, title: "Eternal Love in the Holy City", category: "Couple", image_url: "/images/hero_sunset.jpg", location_tag: "Historical Date Groves", photographer_name: "Zainab Hashim" },
    { id: 4, title: "Pilgrim Reflection at Sunrise", category: "Umrah Memories", image_url: "/images/portrait_solo.jpg", location_tag: "Masjid Nabawi Courtyard", photographer_name: "Omar Farooq" },
    { id: 5, title: "Generations of Gratitude", category: "Family", image_url: "/images/hero_sunset.jpg", location_tag: "Mount Uhud Scenic View", photographer_name: "Zainab Hashim" }
  ],

  init() {
    this.startMadinahClock();
    this.loadCustomizedSettings();
    this.loadCustomData();
    this.loadCustomPortfolio();
    this.renderPortfolio(this.portfolio);
    this.renderServices(this.services);
    this.renderLocations(this.locations);
    this.renderPhotographers(this.photographers);
    this.updateAdminNavButton();
    this.handleInitialRouting();
  },

  loadCustomData() {
    try {
      const customServices = localStorage.getItem('madinah_custom_services');
      if (customServices) this.services = JSON.parse(customServices);

      const customLocations = localStorage.getItem('madinah_custom_locations');
      if (customLocations) this.locations = JSON.parse(customLocations);

      const customPhotogs = localStorage.getItem('madinah_custom_photographers');
      if (customPhotogs) this.photographers = JSON.parse(customPhotogs);
    } catch(e) {}
  },

  loadCustomizedSettings() {
    const saved = localStorage.getItem('madinah_studio_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.whatsapp) this.ownerWhatsApp = parsed.whatsapp;

        // Apply Custom Brand Name
        if (parsed.brandName) {
          const brandEl = document.querySelector('.brand-title');
          if (brandEl) brandEl.textContent = parsed.brandName;
          const footerBrand = document.querySelector('.footer-col-title');
          if (footerBrand) footerBrand.textContent = parsed.brandName;
          document.title = `${parsed.brandName} — Luxury Photography in Madinah`;
        }

        // Apply Custom Tagline
        if (parsed.brandTagline) {
          const tagEl = document.querySelector('.brand-subtitle');
          if (tagEl) tagEl.textContent = parsed.brandTagline;
        }

        // Apply Custom Hero Title
        if (parsed.heroTitle) {
          const heroEl = document.querySelector('.hero-title');
          if (heroEl) heroEl.textContent = parsed.heroTitle;
        }

        // Apply Custom Lead Photographer
        if (parsed.leadPhotog && this.photographers.length > 0) {
          this.photographers[0].name = parsed.leadPhotog;
          this.photographers[0].title = "Lead Studio Photographer & Owner";
        }

        // Apply Custom Instagram & Footer
        if (parsed.instagram) {
          const igBtn = document.getElementById('footer-ig-btn');
          if (igBtn) {
            const cleanIg = parsed.instagram.replace('@', '');
            igBtn.href = parsed.instagram.startsWith('http') ? parsed.instagram : `https://instagram.com/${cleanIg}`;
            igBtn.textContent = `📸 Instagram (${parsed.instagram})`;
          }
        }

        if (parsed.studioEmail) {
          const el = document.getElementById('footer-email-val');
          if (el) el.textContent = parsed.studioEmail;
        }

        if (parsed.studioAddress) {
          const el = document.getElementById('footer-address-text');
          if (el) el.textContent = `📍 ${parsed.studioAddress}`;
        }

        if (parsed.footerBio) {
          const el = document.getElementById('footer-bio-desc');
          if (el) el.textContent = parsed.footerBio;
        }

        if (parsed.whatsapp) {
          const el = document.getElementById('footer-whatsapp-val');
          if (el) el.textContent = parsed.whatsapp;
          const btn = document.getElementById('footer-whatsapp-btn');
          if (btn) btn.href = `https://wa.me/${parsed.whatsapp.replace(/[^0-9]/g, '')}`;
        }
      } catch (e) {}
    }
  },

  // ---------------- QR CODE & SHARE MODALS ---------------- //
  openQrModal() {
    const currentUrl = window.location.origin;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(currentUrl)}&color=141312&bgcolor=FAF7F2`;

    this.openModal(`
      <div style="text-align: center; max-width: 380px; margin: 0 auto;">
        <span class="section-subtitle">Official Studio Barcode</span>
        <h3 style="font-size: 1.5rem; margin: 4px 0 14px;">Scan & Share Website</h3>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 20px;">
          Scan with your smartphone camera to immediately open and book fine-art photography in Madinah.
        </p>

        <div style="background: var(--bg-primary); padding: 18px; border-radius: var(--radius-md); border: 2px solid var(--gold-border); display: inline-block; margin-bottom: 20px; box-shadow: var(--shadow-sm);">
          <img src="${qrApiUrl}" alt="Madinah Photography QR Code" style="width: 220px; height: 220px; border-radius: 8px; display: block;">
        </div>

        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <a href="${qrApiUrl}" download="madinah-photography-qr.png" target="_blank" class="btn btn-primary btn-sm">
            💾 Download Barcode / QR
          </a>
          <button onclick="app.copyWebsiteLink()" class="btn btn-secondary btn-sm">
            📋 Copy Website Link
          </button>
        </div>
      </div>
    `);
  },

  openShareModal() {
    const currentUrl = window.location.origin;
    const shareText = `🌟 NOOR MADINAH — Luxury Fine Art Photography in Madinah, Saudi Arabia. Book your sacred memories & Umrah photoshoot here: ${currentUrl}`;

    this.openModal(`
      <div style="text-align: center; max-width: 420px; margin: 0 auto;">
        <span class="section-subtitle">Spread The Beauty</span>
        <h3 style="font-size: 1.5rem; margin: 4px 0 14px;">Share Studio Website</h3>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 24px;">
          Share directly with family, friends, or Umrah pilgrimage groups:
        </p>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <a href="https://wa.me/?text=${encodeURIComponent(shareText)}" target="_blank" class="btn btn-primary" style="background: #25D366; color: #fff; border: none;">
            💬 Share to WhatsApp
          </a>
          <a href="https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent('Noor Madinah Fine Art Photography')}" target="_blank" class="btn btn-secondary" style="background: #229ED9; color: #fff; border: none;">
            ✈️ Share to Telegram
          </a>
          <button onclick="app.copyWebsiteLink()" class="btn btn-dark">
            📋 Copy Link to Clipboard
          </button>
          <button onclick="app.openQrModal()" class="btn btn-secondary">
            📱 Show Barcode / QR Code
          </button>
        </div>
      </div>
    `);
  },

  // ---------------- GIFT A PHOTOSHOOT MODAL ---------------- //
  openGiftModal() {
    this.openModal(`
      <div style="max-width: 480px; margin: 0 auto; text-align: left;">
        <div style="text-align: center; margin-bottom: 20px;">
          <span class="section-subtitle">Sacred Pilgrimage Gift</span>
          <h3 style="font-size: 1.5rem; margin: 4px 0 8px;">🎁 Gift an Umrah Photoshoot</h3>
          <p style="font-size: 0.86rem; color: var(--text-secondary);">
            Surprise your parents, spouse, or family who are currently in Madinah with a VIP fine-art photoshoot session voucher.
          </p>
        </div>

        <div style="background: linear-gradient(135deg, #1C1A17 0%, #2A2620 100%); border: 2px solid var(--gold-hover); border-radius: var(--radius-md); padding: 20px; color: #fff; margin-bottom: 20px; position: relative; box-shadow: var(--shadow-md);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
            <div>
              <span style="font-size: 0.72rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gold-light);">VIP Gift Certificate</span>
              <h4 style="font-size: 1.2rem; margin-top: 4px; color: #fff;" id="gift-cert-recipient">For: Beloved Family</h4>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 0.75rem; color: var(--gold-light);">Voucher Code:</span>
              <div style="font-size: 0.95rem; font-weight: 700; color: #fff; letter-spacing: 0.08em;">MDN-GIFT-2026</div>
            </div>
          </div>

          <p style="font-size: 0.84rem; color: rgba(255,255,255,0.8); line-height: 1.5; font-style: italic; border-left: 2px solid var(--gold-hover); padding-left: 12px; margin-bottom: 16px;">
            "May your sacred journey to the Radiant City of Madinah be blessed with peace and cherished milestones preserved forever."
          </p>

          <div style="display: flex; justify-content: space-between; font-size: 0.76rem; color: rgba(255,255,255,0.6);">
            <span>Valid for any 2026/2027 Season</span>
            <span>Madinah, Kingdom of Saudi Arabia</span>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group" style="grid-column: 1 / -1;">
            <label class="form-label">Recipient Name (Nama Penerima Hadiah)</label>
            <input type="text" id="gift-input-name" class="form-input" placeholder="e.g. Bapak Hendra & Ibu Nuraini" oninput="document.getElementById('gift-cert-recipient').textContent = 'For: ' + (this.value || 'Beloved Family')">
          </div>
        </div>

        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button onclick="app.startBooking(2)" class="btn btn-primary" style="flex: 1;">
            💳 Book & Pay Voucher
          </button>
          <button onclick="app.shareGiftVoucher()" class="btn btn-secondary">
            💬 Send via WhatsApp
          </button>
        </div>
      </div>
    `);
  },

  shareGiftVoucher() {
    const name = document.getElementById('gift-input-name') ? (document.getElementById('gift-input-name').value || 'Keluarga Tercinta') : 'Keluarga';
    const text = `🎁 *VIP GIFT VOUCHER — MADINAH PHOTOSHOOT*\n\nAssalamu'alaikum Warahmatullahi Wabarakatuh,\n\nSpesial untuk: *${name}*\n\nAnda mendapatkan Hadiah Voucher Sesi Pemotretan Fine-Art di Masjid Nabawi & Landmark Madinah.\n\nSilakan pilih jadwal dan fotografer favorit Anda di sini:\n👉 https://madinah-photography.vercel.app\n\nKode Voucher: *MDN-GIFT-2026*\n\n_Semoga ibadah Umrah Anda mabrur dan penuh berkah!_ ✨`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  },

  loadCustomPortfolio() {
    const saved = localStorage.getItem('madinah_custom_portfolio');
    if (saved) {
      try {
        const customItems = JSON.parse(saved);
        if (Array.isArray(customItems) && customItems.length > 0) {
          this.portfolio = [...customItems, ...this.portfolio];
        }
      } catch (e) {}
    }
  },

  // ---------------- AUTHENTICATION ---------------- //
  isAdminLoggedIn() {
    return sessionStorage.getItem('madinah_admin_authenticated') === 'true';
  },

  updateAdminNavButton() {
    const btn = document.getElementById('admin-nav-btn');
    if (!btn) return;
    if (this.isAdminLoggedIn()) {
      btn.textContent = '👑 Admin Panel (Logged In)';
      btn.onclick = () => this.switchView('admin');
    } else {
      btn.textContent = '🔒 Admin Login';
      btn.onclick = () => this.openAdminLoginModal();
    }
  },

  openAdminLoginModal() {
    if (this.isAdminLoggedIn()) {
      this.switchView('admin');
      return;
    }

    this.openModal(`
      <div style="max-width: 360px; margin: 0 auto; text-align: center;">
        <div style="font-size: 2.4rem; margin-bottom: 8px;">🔒</div>
        <span class="section-subtitle">Owner & Studio Access</span>
        <h3 style="font-size: 1.6rem; margin: 6px 0 20px;">Admin Authentication</h3>

        <form onsubmit="app.handleAdminLogin(event)" style="display: flex; flex-direction: column; gap: 14px; text-align: left;">
          <div class="form-group">
            <label class="form-label">Username</label>
            <input type="text" id="admin-login-user" class="form-input" placeholder="admin" required autofocus>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" id="admin-login-pass" class="form-input" placeholder="••••••••" required>
          </div>
          <button type="submit" class="btn btn-primary" style="margin-top: 10px; width: 100%;">Sign In to Control Center</button>
        </form>
      </div>
    `);
  },

  handleAdminLogin(e) {
    e.preventDefault();
    const userInput = document.getElementById('admin-login-user').value.trim();
    const passInput = document.getElementById('admin-login-pass').value.trim();

    const savedSettings = JSON.parse(localStorage.getItem('madinah_studio_settings') || '{}');
    const validUser = savedSettings.adminUser || 'admin';
    const validPass = savedSettings.adminPass || 'madinah2026';

    if (userInput === validUser && passInput === validPass) {
      sessionStorage.setItem('madinah_admin_authenticated', 'true');
      this.closeModal();
      this.updateAdminNavButton();
      this.switchView('admin');
      this.showToast('Welcome back, Admin!', 'success');
    } else {
      this.showToast('Invalid username or password.', 'error');
    }
  },

  adminLogout() {
    sessionStorage.removeItem('madinah_admin_authenticated');
    this.updateAdminNavButton();
    this.switchView('public');
    this.showToast('You have been logged out.', 'info');
  },

  handleInitialRouting() {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');
    const bookingId = urlParams.get('booking_id') || urlParams.get('id');

    if (bookingId) {
      this.switchView('client-portal');
      document.getElementById('client-search-booking-id').value = bookingId;
      clientPortal.searchBooking(bookingId);
    } else if (view === 'admin') {
      if (this.isAdminLoggedIn()) {
        this.switchView('admin');
      } else {
        this.openAdminLoginModal();
      }
    } else if (view === 'book') {
      this.startBooking();
    } else {
      this.switchView('public');
    }
  },

  startMadinahClock() {
    const updateClock = () => {
      const options = { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      const timeStr = new Intl.DateTimeFormat([], options).format(new Date());
      const el = document.getElementById('madinah-live-clock');
      if (el) el.textContent = `Madinah Time (UTC+3): ${timeStr}`;
    };
    updateClock();
    setInterval(updateClock, 1000);
  },

  setCurrency(curr) {
    this.currentCurrency = curr;
    this.renderServices(this.services);
    if (typeof bookingWizard !== 'undefined') bookingWizard.updateSummaryBar();
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
    if (viewName === 'admin' && !this.isAdminLoggedIn()) {
      this.openAdminLoginModal();
      return;
    }

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

  startBooking(serviceId = null, packageId = null, photographerId = null) {
    this.switchView('booking');
    if (typeof bookingWizard !== 'undefined') {
      bookingWizard.init(serviceId, packageId, photographerId);
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
            <img src="${s.cover_image || '/images/hero_sunset.jpg'}" alt="${s.title}" class="service-card-img" loading="lazy">
            ${s.is_popular ? '<span class="service-popular-badge">Top Pilgrim Choice</span>' : ''}
          </div>
          <div class="service-card-body">
            <span class="service-card-subtitle">${s.subtitle || 'Fine Art Photography'}</span>
            <h3 class="service-card-title">${s.title}</h3>
            <p class="service-card-desc">${s.description}</p>
            <div class="service-packages-list">${pkgsHtml}</div>
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
        <img src="${loc.image_url || '/images/hero_sunset.jpg'}" alt="${loc.name}" class="location-card-img" loading="lazy">
        <div class="location-card-overlay">
          <span class="location-arabic">${loc.arabic_name || ''}</span>
          <h3 class="location-name">${loc.name}</h3>
          <div><span class="location-buffer-tag">⏱️ ${loc.travel_buffer_min}m Travel Buffer Protected</span></div>
        </div>
      </div>
    `).join('');
  },

  renderPhotographers(photographers) {
    const container = document.getElementById('photographers-grid-container');
    if (!container) return;

    container.innerHTML = photographers.map(p => `
      <div class="photographer-card">
        <img src="${p.avatar_url || '/images/portrait_solo.jpg'}" alt="${p.name}" class="photographer-avatar" loading="lazy">
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
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : type === 'success' ? 'toast-success' : ''}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

window.addEventListener('DOMContentLoaded', () => app.init());
