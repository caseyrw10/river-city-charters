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

// Initialize application on load
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initRangeStatus();
  renderEvents();
  initForms();
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

        const data = await response.json();
        if (data.success) {
          showToast(data.message, 'success');
          if (data.previewUrl) {
            console.log("Mock SMTP Link:", data.previewUrl);
          }
          contactForm.reset();
        } else {
          showToast(data.error || 'Failed to submit inquiry.', 'error');
        }
      } catch (err) {
        showToast('Network error, please try again.', 'error');
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

        const data = await response.json();
        if (data.success) {
          showToast(data.message, 'success');
          if (data.previewUrl) {
            console.log("Mock SMTP Link:", data.previewUrl);
          }
          closeSignupModal();
        } else {
          showToast(data.error || 'Failed to complete registration.', 'error');
        }
      } catch (err) {
        showToast('Network error, please try again.', 'error');
      }
    });
  }
}
