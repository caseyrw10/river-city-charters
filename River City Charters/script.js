document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial trigger for elements already in view (like hero section)
    setTimeout(() => {
        document.querySelectorAll('.fade-in-up').forEach(el => {
            observer.observe(el);
        });
    }, 100);

    // --- Calendar Logic ---
    const calendarDays = document.getElementById('calendarDays');
    const monthYearDisplay = document.getElementById('monthYearDisplay');
    const prevButton = document.getElementById('prevMonth');
    const nextButton = document.getElementById('nextMonth');
    const bookingSlots = document.getElementById('bookingSlots');
    const confirmBooking = document.getElementById('confirmBooking');
    const halfDayBtn = document.getElementById('halfDayBtn');
    const fullDayBtn = document.getElementById('fullDayBtn');

    if (calendarDays && monthYearDisplay) {
        let currentDate = new Date();
        let selectedDate = null;
        let selectedSlot = null;

        function renderCalendar() {
            calendarDays.innerHTML = '';
            
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            monthYearDisplay.textContent = `${monthNames[month]} ${year}`;
            
            // Fill empty days
            for (let i = 0; i < firstDay.getDay(); i++) {
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'aspect-square';
                calendarDays.appendChild(emptyDiv);
            }
            
            // Fill days
            for (let i = 1; i <= lastDay.getDate(); i++) {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'aspect-square flex items-center justify-center font-bold relative transition-colors';
                dayDiv.textContent = i;
                
                // Randomly block some days to simulate unavailable dates
                const isBlocked = (i % 5 === 0 || i % 7 === 0);
                
                if (isBlocked) {
                    dayDiv.classList.add('text-muted', 'cursor-not-allowed', 'opacity-50');
                    dayDiv.style.textDecoration = 'line-through';
                } else {
                    dayDiv.classList.add('cursor-pointer', 'text-white');
                    dayDiv.addEventListener('click', () => selectDate(year, month, i));
                }
                
                // Highlight if it's the currently selected date
                if (selectedDate && selectedDate.year === year && selectedDate.month === month && selectedDate.day === i) {
                    dayDiv.classList.add('bg-custom', 'text-white');
                    dayDiv.style.borderRadius = '50%';
                } else if (!isBlocked) {
                    dayDiv.classList.add('hover:bg-white/10');
                    dayDiv.style.borderRadius = '50%';
                }
                
                calendarDays.appendChild(dayDiv);
            }
        }

        function selectDate(year, month, day) {
            selectedDate = { year, month, day };
            renderCalendar();
            
            // Show slots, reset slot selection
            bookingSlots.style.display = 'grid';
            confirmBooking.style.display = 'none';
            selectedSlot = null;
            updateSlotUI();
        }

        function selectSlot(slot) {
            selectedSlot = slot;
            updateSlotUI();
            confirmBooking.style.display = 'block';
        }

        function updateSlotUI() {
            // Reset classes
            halfDayBtn.className = 'py-4 border-2 border-transparent text-muted font-black italic hover:text-white transition-colors';
            halfDayBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            halfDayBtn.style.borderRadius = '12px';
            
            fullDayBtn.className = 'py-4 border-2 border-transparent text-muted font-black italic hover:text-white transition-colors';
            fullDayBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            fullDayBtn.style.borderRadius = '12px';

            if (selectedSlot === 'half') {
                halfDayBtn.className = 'py-4 border-2 text-custom font-black italic';
                halfDayBtn.style.borderColor = 'var(--color-custom)';
                halfDayBtn.style.backgroundColor = 'rgba(0, 168, 255, 0.1)';
            } else if (selectedSlot === 'full') {
                fullDayBtn.className = 'py-4 border-2 text-custom font-black italic';
                fullDayBtn.style.borderColor = 'var(--color-custom)';
                fullDayBtn.style.backgroundColor = 'rgba(0, 168, 255, 0.1)';
            }
        }

        prevButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        nextButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        halfDayBtn.addEventListener('click', () => selectSlot('half'));
        fullDayBtn.addEventListener('click', () => selectSlot('full'));

        // Initial render
        renderCalendar();
    }
});
