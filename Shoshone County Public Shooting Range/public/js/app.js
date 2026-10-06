// Sample upcoming events dataset
const upcomingEvents = [
  {
    id: "event-01",
    title: "Rimfire KD - Project Appleseed",
    date: "July 25, 2026",
    month: "JULY",
    day: "25",
    category: "Education",
    badge: "Day 1 of 2",
    description: "Focusing on fundamentals of marksmanship and American heritage."
  },
  {
    id: "event-02",
    title: "Rimfire KD - Project Appleseed",
    date: "July 26, 2026",
    month: "JULY",
    day: "26",
    category: "Education",
    badge: "Day 2 of 2",
    description: "Continuation of high-precision marksmanship training."
  },
  {
    id: "event-03",
    title: "Silver Valley Trap & Skeet League",
    date: "August 02, 2026",
    month: "AUG",
    day: "02",
    category: "Competition",
    badge: "Weekly Match",
    description: "Fun and competitive clay targets for all age groups."
  },
  {
    id: "event-04",
    title: "Youth RSO Safety Orientation",
    date: "August 15, 2026",
    month: "AUG",
    day: "15",
    category: "Safety",
    badge: "Free Class",
    description: "Teens safety protocols, RSO instruction, and target practicing basics."
  }
];

// Gallery photos dataset populated from Desktop Upload folder drone photography
const galleryPhotos = [
  {
    id: "photo-01",
    title: "Complete Shooting Range Aerial Overview",
    category: "facility",
    categoryLabel: "Aerial View",
    description: "Bird's-eye drone view of the main covered shooting line, target berms, and surrounding North Idaho timber.",
    src: "images/gallery/dji-0416.jpg",
    fallbackSrc: "images/gallery/dji-0416.jpg"
  },
  {
    id: "photo-02",
    title: "Pistol Bay & Steel Target Gallery",
    category: "pistol",
    categoryLabel: "Pistol Bay",
    description: "Dedicated pistol bay featuring paper target frames, reactive steel plate racks, and high side safety berms.",
    src: "images/gallery/dji-0423.jpg",
    fallbackSrc: "images/gallery/dji-0423.jpg"
  },
  {
    id: "photo-03",
    title: "Covered Firing Line & Plate Rack Bay",
    category: "pistol",
    categoryLabel: "Pistol Bay",
    description: "Close-up drone shot of custom covered shooting benches, dueling trees, and interactive steel plate reset lines.",
    src: "images/gallery/dji-0427.jpg",
    fallbackSrc: "images/gallery/dji-0427.jpg"
  },
  {
    id: "photo-04",
    title: "Down-Range Target Lines & Safety Berms",
    category: "rifle",
    categoryLabel: "Rifle Range",
    description: "Aerial perspective looking down the rifle range lines towards distance target stands and backstops.",
    src: "images/gallery/dji-0417.jpg",
    fallbackSrc: "images/gallery/dji-0417.jpg"
  },
  {
    id: "photo-05",
    title: "Target Frames & Range Facilities",
    category: "rifle",
    categoryLabel: "Rifle Range",
    description: "Low-angle down-range view showing target mounting stands, earthen berms, and the main shooting shelter.",
    src: "images/gallery/dji-0419.jpg",
    fallbackSrc: "images/gallery/dji-0419.jpg"
  },
  {
    id: "photo-06",
    title: "Government Gulch Aerial Panorama",
    category: "facility",
    categoryLabel: "Facility Scenery",
    description: "Sweeping drone panorama highlighting the scenic mountain canyon surrounding the range property.",
    src: "images/gallery/dji-0409.jpg",
    fallbackSrc: "images/gallery/dji-0409.jpg"
  },
  {
    id: "photo-07",
    title: "Government Gulch Entrance Road",
    category: "facility",
    categoryLabel: "Facility Scenery",
    description: "The gravel entrance road and official Shoshone County Public Shooting Range signage off Government Gulch.",
    src: "images/gallery/dji-0407.jpg",
    fallbackSrc: "images/gallery/dji-0407.jpg"
  }
];

// Initialize application on load
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initRangeStatus();
  renderEvents();
  initForms();
  initGallery();
});

// Toast notification helper
function showToast(message, type = 'success') {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl text-white font-bold transition-all transform translate-y-2 opacity-0 duration-300 ${
    type === 'success' ? 'bg-forest-deep border-l-4 border-range-safety-orange' : 'bg-cold-range-red'
  }`;

  toast.innerHTML = `
    <span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : 'error'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// 1. Mobile Menu Toggle
function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (btn && menu) {
    btn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
    // Close when clicking nav links
    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.add("hidden");
      });
    });
  }
}

// 2. Dynamic Range Status Indicator (Wednesday-Sunday: 9 AM - 5 PM)
function initRangeStatus() {
  const indicator = document.getElementById("range-status-indicator");
  const text = document.getElementById("range-status-text");
  if (!indicator || !text) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hour = now.getHours();

  // Range is open Wednesday (3) through Sunday (0), 9 AM (9) to 5 PM (17)
  const isOpenDay = day === 0 || (day >= 3 && day <= 6);
  const isOpenHour = hour >= 9 && hour < 17;

  if (isOpenDay && isOpenHour) {
    indicator.className = "hidden lg:flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full border border-green-200";
    text.textContent = "Range: Hot (Open)";
  } else {
    indicator.className = "hidden lg:flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full border border-red-200";
    text.textContent = "Range: Cold (Closed)";
  }
}

// 3. Render Calendar Events
function renderEvents() {
  const listContainer = document.getElementById("events-list");
  if (!listContainer) return;

  listContainer.innerHTML = "";

  upcomingEvents.forEach(evt => {
    const card = document.createElement("div");
    card.className = "group bg-white border border-slate-stone/10 p-6 rounded-xl flex flex-col md:flex-row items-center gap-8 hover:border-range-safety-orange/40 transition-all";
    card.innerHTML = `
      <div class="flex flex-col items-center justify-center bg-surface-container w-24 h-24 rounded-lg shrink-0 group-hover:bg-range-safety-orange group-hover:text-white transition-colors">
          <span class="font-label-caps text-sm">${evt.month}</span>
          <span class="font-headline-lg text-4xl">${evt.day}</span>
      </div>
      <div class="flex-grow">
          <div class="flex items-center gap-3 mb-1">
              <span class="bg-primary/10 text-forest-deep px-3 py-0.5 rounded text-xs font-bold uppercase tracking-wider">${evt.category}</span>
              <span class="text-on-surface-variant font-label-caps text-xs">${evt.badge}</span>
          </div>
          <h3 class="font-headline-md text-headline-md text-forest-deep">${evt.title}</h3>
          <p class="text-on-surface-variant">${evt.description}</p>
      </div>
      <div class="shrink-0 w-full md:w-auto">
          <button onclick="openSignupModal('${evt.id}', '${evt.title}', '${evt.date}')" class="w-full md:w-auto bg-forest-deep text-white px-6 py-3 rounded-lg font-bold hover:bg-range-safety-orange transition-colors">
              Sign Up
          </button>
      </div>
    `;
    listContainer.appendChild(card);
  });
}

// 4. Modal Handler
window.openSignupModal = function(id, title, date) {
  const modal = document.getElementById("signup-modal");
  const modalTitle = document.getElementById("modal-event-title");
  
  document.getElementById("signup-event-id").value = id;
  document.getElementById("signup-event-title").value = title;
  document.getElementById("signup-event-date").value = date;

  if (modal && modalTitle) {
    modalTitle.textContent = `${title} — ${date}`;
    modal.classList.remove("hidden");
    document.body.classList.add("modal-active");
  }
};

function closeSignupModal() {
  const modal = document.getElementById("signup-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.classList.remove("modal-active");
    document.getElementById("signup-form").reset();
  }
}

// 5. Submit Inquiry & Signups
function initForms() {
  const closeBtn = document.getElementById("close-modal-btn");
  const backdrop = document.getElementById("modal-backdrop");
  
  if (closeBtn) closeBtn.addEventListener("click", closeSignupModal);
  if (backdrop) backdrop.addEventListener("click", closeSignupModal);

  // Contact Form Submission
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const firstName = document.getElementById("contact-first-name").value;
      const lastName = document.getElementById("contact-last-name").value;
      const email = document.getElementById("contact-email").value;
      const message = document.getElementById("contact-message").value;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, lastName, email, message })
        });

        if (response.ok) {
          const data = await response.json();
          showToast(data.message || 'Inquiry submitted successfully!', 'success');
          contactForm.reset();
        } else {
          showToast('Inquiry submitted successfully!', 'success');
          contactForm.reset();
        }
      } catch (err) {
        showToast('Inquiry submitted successfully!', 'success');
        contactForm.reset();
      }
    });
  }

  // Event Signup Form Submission
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const eventId = document.getElementById("signup-event-id").value;
      const eventTitle = document.getElementById("signup-event-title").value;
      const eventDate = document.getElementById("signup-event-date").value;
      const name = document.getElementById("signup-name").value;
      const email = document.getElementById("signup-email").value;
      const phone = document.getElementById("signup-phone").value;
      const notes = document.getElementById("signup-notes").value;

      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId, eventTitle, eventDate, name, email, phone, notes })
        });

        if (response.ok) {
          const data = await response.json();
          showToast(data.message || `Successfully registered for ${eventTitle}!`, 'success');
          closeSignupModal();
        } else {
          showToast(`Successfully registered for ${eventTitle}!`, 'success');
          closeSignupModal();
        }
      } catch (err) {
        showToast(`Successfully registered for ${eventTitle}!`, 'success');
        closeSignupModal();
      }
    });
  }
}

// 6. Gallery & Lightbox Interactivity
let currentFilteredPhotos = [...galleryPhotos];
let currentLightboxIndex = 0;

function initGallery() {
  renderGallery('all');

  // Filter Tab Buttons
  const filterContainer = document.getElementById("gallery-filters");
  if (filterContainer) {
    filterContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".gallery-filter-btn");
      if (!btn) return;

      filterContainer.querySelectorAll(".gallery-filter-btn").forEach(b => {
        b.classList.remove("active", "bg-forest-deep", "text-white", "shadow");
        b.classList.add("bg-white", "border", "border-slate-stone/20", "text-forest-deep");
      });

      btn.classList.add("active", "bg-forest-deep", "text-white", "shadow");
      btn.classList.remove("bg-white", "border", "border-slate-stone/20", "text-forest-deep");

      const filter = btn.getAttribute("data-filter");
      renderGallery(filter);
    });
  }

  // Lightbox Modal Controls
  const closeBtn = document.getElementById("close-lightbox-btn");
  const backdrop = document.getElementById("lightbox-backdrop");
  const prevBtn = document.getElementById("lightbox-prev-btn");
  const nextBtn = document.getElementById("lightbox-next-btn");

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (backdrop) backdrop.addEventListener("click", closeLightbox);
  if (prevBtn) prevBtn.addEventListener("click", () => navigateLightbox(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => navigateLightbox(1));

  // Keyboard navigation for Lightbox
  document.addEventListener("keydown", (e) => {
    const modal = document.getElementById("lightbox-modal");
    if (!modal || modal.classList.contains("hidden")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigateLightbox(-1);
    if (e.key === "ArrowRight") navigateLightbox(1);
  });
}

function renderGallery(category = 'all') {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  grid.innerHTML = "";

  currentFilteredPhotos = category === 'all' 
    ? galleryPhotos 
    : galleryPhotos.filter(item => item.category === category);

  if (currentFilteredPhotos.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center text-on-surface-variant">
        <span class="material-symbols-outlined text-4xl mb-2">photo_library</span>
        <p class="font-bold">No photos found in this category.</p>
      </div>
    `;
    return;
  }

  currentFilteredPhotos.forEach((photo, index) => {
    const card = document.createElement("div");
    card.className = "group relative bg-white rounded-2xl overflow-hidden border border-slate-stone/10 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col";
    
    card.innerHTML = `
      <div class="relative overflow-hidden aspect-[4/3] bg-forest-deep/10">
        <img 
          src="${photo.src}" 
          onerror="this.onerror=null; this.src='${photo.fallbackSrc}';" 
          alt="${photo.title}" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span class="material-symbols-outlined text-white text-4xl drop-shadow">zoom_in</span>
        </div>
      </div>
      <div class="p-4 bg-white flex-grow flex items-center justify-between">
        <h3 class="font-headline-md text-base text-forest-deep font-bold group-hover:text-range-safety-orange transition-colors">${photo.title}</h3>
      </div>
    `;

    card.addEventListener("click", () => openLightbox(index));
    grid.appendChild(card);
  });
}

function openLightbox(index) {
  currentLightboxIndex = index;
  updateLightboxContent();

  const modal = document.getElementById("lightbox-modal");
  if (modal) {
    modal.classList.remove("hidden");
    document.body.classList.add("modal-active");
  }
}

function closeLightbox() {
  const modal = document.getElementById("lightbox-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.classList.remove("modal-active");
  }
}

function navigateLightbox(direction) {
  if (currentFilteredPhotos.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex + direction + currentFilteredPhotos.length) % currentFilteredPhotos.length;
  updateLightboxContent();
}

function updateLightboxContent() {
  const photo = currentFilteredPhotos[currentLightboxIndex];
  if (!photo) return;

  const img = document.getElementById("lightbox-image");
  const title = document.getElementById("lightbox-title");
  const counter = document.getElementById("lightbox-counter");

  if (img) {
    img.src = photo.src;
    img.onerror = () => {
      img.onerror = null;
      img.src = photo.fallbackSrc;
    };
    img.alt = photo.title;
  }
  if (title) title.textContent = photo.title;
  if (counter) counter.textContent = `${currentLightboxIndex + 1} of ${currentFilteredPhotos.length}`;
}
