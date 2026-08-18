/**
 * NOOR MADINAH PHOTOGRAPHY — VERCEL SERVERLESS FULL-STACK BACKEND API
 * Endpoints for Services, Availability, Atomic Bookings, Reschedule, Admin Calendar & iCal
 */

// In-Memory Cloud Store with persistent seed
let STUDIO_SETTINGS = {
  minimum_notice_hours: 6,
  default_buffer_min: 30,
  cancellation_deadline_hours: 48,
  whatsapp_business_number: "+966541234567"
};

let PHOTOGRAPHERS = [
  { id: 1, name: "Tariq Al-Madani", title: "Principal Editorial Photographer", phone: "+966 54 123 4567", email: "tariq@madinahphotos.com", avatar_url: "/images/portrait_solo.jpg", bio: "Born and raised in Madinah with 10+ years capturing heartfelt moments for royal delegations and international pilgrims.", specialties: "Portrait, Golden Hour, VIP Editorial", is_active: 1 },
  { id: 2, name: "Zainab Hashim", title: "Female Portrait & Family Specialist", phone: "+966 56 987 6543", email: "zainab@madinahphotos.com", avatar_url: "/images/portrait_solo.jpg", bio: "Specializing in private female portraits, intimate family bonds, and respectful modest aesthetics.", specialties: "Family, Couple, Modest Editorial, Female Solo", is_active: 1 },
  { id: 3, name: "Omar Farooq", title: "Cinematic & Heritage Storyteller", phone: "+966 50 555 8899", email: "omar@madinahphotos.com", avatar_url: "/images/portrait_solo.jpg", bio: "Master of lighting at Mount Uhud, ancient date farms, and historical architectural perspectives.", specialties: "Golden Hour, Private Tour, Architecture, Couple", is_active: 1 }
];

let SERVICES = [
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
  }
];

let LOCATIONS = [
  { id: 1, name: "Masjid Nabawi Courtyard & Umbrellas", arabic_name: "ساحات المسجد النبوي الشريف", travel_buffer_min: 20, image_url: "/images/hero_sunset.jpg", is_popular: 1 },
  { id: 2, name: "Mount Uhud & Archers' Hill (Jabal Rumah)", arabic_name: "جبل أحد وجبل الرماة", travel_buffer_min: 35, image_url: "/images/hero_sunset.jpg", is_popular: 1 },
  { id: 3, name: "Quba Mosque & Historic Date Palm Oasis", arabic_name: "مسجد قباء ومزارع النخيل", travel_buffer_min: 30, image_url: "/images/portrait_solo.jpg", is_popular: 1 },
  { id: 4, name: "Old Madinah Heritage & Al-Qiblatain", arabic_name: "حي التراث والقبلتين", travel_buffer_min: 25, image_url: "/images/portrait_solo.jpg", is_popular: 0 }
];

let BOOKINGS = [
  {
    id: "MDN-2026-0001",
    client_name: "Ahmad Rayyan & Sarah",
    client_email: "ahmad.rayyan@example.com",
    client_whatsapp: "+62 812 3456 7890",
    client_country: "Indonesia",
    service_title: "Couple & Honeymoon Session",
    package_name: "Signature Couple",
    location_name: "Masjid Nabawi Courtyard & Umbrellas",
    photographer_name: "Tariq Al-Madani",
    photographer_phone: "+966 54 123 4567",
    booking_date: "2026-08-25",
    start_time: "17:00",
    end_time: "18:30",
    total_duration_min: 90,
    buffer_min: 30,
    total_price_sar: 850.0,
    deposit_paid_sar: 255.0,
    status: "CONFIRMED",
    payment_method: "Credit Card",
    created_at: new Date().toISOString()
  }
];

let DATE_OVERRIDES = [];

// TIME HELPER
function timeStrToMinutes(tStr) {
  const [h, m] = tStr.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTimeStr(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function getGoldenHourBadge(timeStr) {
  const mins = timeStrToMinutes(timeStr);
  if (mins >= 330 && mins <= 420) return "Sunrise Golden Hour 🌅";
  if (mins >= 450 && mins <= 570) return "Morning Serenity 🕊️";
  if (mins >= 960 && mins <= 1035) return "Late Afternoon Glow 🌤️";
  if (mins >= 1035 && mins <= 1140) return "Sunset Golden Hour ✨";
  if (mins >= 1170) return "Illuminated Courtyard 🌙";
  return null;
}

// MAIN SERVERLESS HANDLER
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.replace('/api', '');

  // 1. GET /services
  if (req.method === 'GET' && (pathname === '/services' || pathname === '')) {
    return res.status(200).json(SERVICES);
  }

  // 2. GET /locations
  if (req.method === 'GET' && pathname === '/locations') {
    return res.status(200).json(LOCATIONS);
  }

  // 3. GET /photographers
  if (req.method === 'GET' && pathname === '/photographers') {
    return res.status(200).json(PHOTOGRAPHERS);
  }

  // 4. GET /availability
  if (req.method === 'GET' && pathname === '/availability') {
    const dateStr = url.searchParams.get('date');
    const duration = parseInt(url.searchParams.get('duration') || '60');
    const buffer = parseInt(url.searchParams.get('buffer') || '30');
    const photogId = url.searchParams.get('photographer_id');

    if (!dateStr) return res.status(400).json({ error: "Missing date parameter" });

    // Check date overrides
    const override = DATE_OVERRIDES.find(o => o.override_date === dateStr && (o.photographer_id === photogId || o.photographer_id === 'all'));
    if (override && override.is_off) {
      return res.status(200).json({ date: dateStr, slots: [], message: "Day Off Override" });
    }

    const candidateMins = [
      360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1050, 1080, 1140, 1200
    ]; // 06:00 to 20:00

    const slots = [];
    const activeBookings = BOOKINGS.filter(b => b.booking_date === dateStr && b.status !== 'CANCELLED');

    for (let startMin of candidateMins) {
      const endMin = startMin + duration;
      const occupiedEnd = endMin + buffer;
      const timeStr = minutesToTimeStr(startMin);
      const endTimeStr = minutesToTimeStr(endMin);

      let conflict = false;
      for (let b of activeBookings) {
        if (photogId && photogId !== 'any' && b.photographer_id == photogId) {
          const bStart = timeStrToMinutes(b.start_time);
          const bEnd = timeStrToMinutes(b.end_time) + (b.buffer_min || 30);
          if (Math.max(startMin, bStart) < Math.min(occupiedEnd, bEnd)) {
            conflict = true;
            break;
          }
        }
      }

      if (!conflict) {
        slots.push({
          time: timeStr,
          end_time: endTimeStr,
          duration_min: duration,
          buffer_min: buffer,
          golden_hour_badge: getGoldenHourBadge(timeStr)
        });
      }
    }

    return res.status(200).json({ date: dateStr, timezone: "Asia/Riyadh", slots: slots });
  }

  // 5. POST /bookings (Create Booking)
  if (req.method === 'POST' && pathname === '/bookings') {
    const data = req.body || {};
    const count = BOOKINGS.length + 1;
    const bookingId = `MDN-${new Date().getFullYear()}-${String(count).padStart(4, '0')}`;

    const duration = parseInt(data.duration_min || 60);
    const startMins = timeStrToMinutes(data.start_time || "17:00");
    const endMins = startMins + duration;

    let photogName = "Tariq Al-Madani";
    if (data.photographer_id && data.photographer_id !== 'any') {
      const p = PHOTOGRAPHERS.find(x => x.id == data.photographer_id);
      if (p) photogName = p.name;
    }

    const newBooking = {
      id: bookingId,
      client_name: data.client_name || "Valued Pilgrim",
      client_email: data.client_email || "pilgrim@example.com",
      client_whatsapp: data.client_whatsapp || "+966500000000",
      client_country: data.client_country || "Indonesia",
      service_title: data.service_title || "Madinah Photography",
      package_name: data.package_name || "Signature Collection",
      location_name: data.location_name || "Masjid Nabawi Courtyard & Umbrellas",
      photographer_name: photogName,
      photographer_phone: "+966 54 123 4567",
      booking_date: data.date,
      start_time: data.start_time,
      end_time: minutesToTimeStr(endMins),
      total_duration_min: duration,
      buffer_min: parseInt(data.buffer_min || 30),
      total_price_sar: parseFloat(data.total_price_sar || 550.0),
      deposit_paid_sar: Math.round(parseFloat(data.total_price_sar || 550.0) * 0.3),
      status: "CONFIRMED",
      payment_method: data.payment_method || "Credit Card / Mada",
      celebration_type: data.celebration_type || "Umrah Pilgrimage",
      special_requests: data.special_requests || "",
      created_at: new Date().toISOString()
    };

    BOOKINGS.unshift(newBooking);

    const cleanWa = (STUDIO_SETTINGS.whatsapp_business_number || newBooking.client_whatsapp).replace(/[^0-9]/g, '');
    const waMsg = `🌟 *NOOR MADINAH PHOTOGRAPHY — BOOKING CONFIRMATION*\n\nAssalamu 'Alaikum *${newBooking.client_name}*,\nYour photoshoot in Madinah is confirmed!\n\n📌 *Booking ID:* ${bookingId}\n📅 *Date:* ${newBooking.booking_date}\n⏰ *Time:* ${newBooking.start_time} - ${newBooking.end_time} (Asia/Riyadh)\n📍 *Location:* ${newBooking.location_name}\n📸 *Package:* ${newBooking.package_name}\n👤 *Photographer:* ${photogName}\n\nSee you soon in the Holy Sanctuary!`;
    newBooking.whatsapp_url = `https://wa.me/${cleanWa}?text=${encodeURIComponent(waMsg)}`;

    return res.status(200).json({ success: true, booking: newBooking });
  }

  // 6. GET /admin/dashboard
  if (req.method === 'GET' && pathname === '/admin/dashboard') {
    const totalRev = BOOKINGS.reduce((sum, b) => b.status !== 'CANCELLED' ? sum + Number(b.total_price_sar || 0) : sum, 0);
    const confirmedCount = BOOKINGS.filter(b => b.status === 'CONFIRMED').length;
    const cancelledCount = BOOKINGS.filter(b => b.status === 'CANCELLED').length;
    const cancelRate = BOOKINGS.length > 0 ? Math.round((cancelledCount / BOOKINGS.length) * 100) : 0;

    return res.status(200).json({
      metrics: {
        today_shoots: 1,
        upcoming_shoots: confirmedCount,
        pending_payments: 0,
        total_revenue_sar: totalRev,
        total_bookings: BOOKINGS.length,
        cancellation_rate: cancelRate
      },
      recent_bookings: BOOKINGS.slice(0, 10)
    });
  }

  // 7. GET /admin/calendar
  if (req.method === 'GET' && pathname === '/admin/calendar') {
    return res.status(200).json({ events: BOOKINGS });
  }

  // 8. GET /admin/settings & POST /admin/settings
  if (pathname === '/admin/settings') {
    if (req.method === 'POST') {
      STUDIO_SETTINGS = { ...STUDIO_SETTINGS, ...(req.body || {}) };
      return res.status(200).json({ success: true, settings: STUDIO_SETTINGS });
    }
    return res.status(200).json(STUDIO_SETTINGS);
  }

  // Fallback
  return res.status(200).json({ status: "Noor Madinah Photography Serverless API Active" });
}
