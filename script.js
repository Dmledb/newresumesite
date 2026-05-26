document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypingCarousel();
  initMobileMenu();
  initProjectFilters();
  initContactForm();
  initScrollEffectsFallbacks();
});

/* ==========================================================================
   1. Theme Management (Light / Dark Mode Toggle)
   ========================================================================== */

function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
  const html = document.documentElement;

  // Function to apply a specific theme
  function applyTheme(theme) {
    if (theme === 'dark' || theme === 'light') {
      html.setAttribute('data-theme', theme);
      metaColorScheme.content = theme;
      localStorage.setItem('color-scheme', theme);
    } else {
      // Reset to System theme
      html.removeAttribute('data-theme');
      metaColorScheme.content = 'light dark';
      localStorage.removeItem('color-scheme');
    }
  }

  // Toggle button click handler
  themeToggle.addEventListener('click', () => {
    // Determine the current effective theme
    let currentTheme = html.getAttribute('data-theme');
    if (!currentTheme) {
      // If no explicit override, check system preferences
      currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Toggle to the opposite theme
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });

  // Listen for changes in OS color-scheme preferences
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only update if the user has NOT set a manual override
    if (!localStorage.getItem('color-scheme')) {
      metaColorScheme.content = e.matches ? 'dark' : 'light';
    }
  });
}

/* ==========================================================================
   2. Typing Carousel Animation in Hero
   ========================================================================== */

function initTypingCarousel() {
  const roleText = document.getElementById('role-text');
  if (!roleText) return;

  const roles = [
    'Systems Architect',
    'IoT Edge Expert',
    'Linux Specialist',
    'Distributed Engineer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      // Erasing characters
      roleText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Erase faster
    } else {
      // Typing characters
      roleText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120; // Normal typing speed
    }

    // If word is completely typed
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at full word
    } 
    // If word is completely erased
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Brief pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  // Start typing loop
  setTimeout(type, 1000);
}

/* ==========================================================================
   3. Mobile Navigation Menu
   ========================================================================== */

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = navMenu.querySelectorAll('a');

  if (!menuToggle || !navMenu) return;

  function toggleMenu() {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
  }

  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('active');
  }

  // Toggle button click
  menuToggle.addEventListener('click', toggleMenu);

  // Close when clicking nav link
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close when clicking outside header
  document.addEventListener('click', (e) => {
    const header = document.getElementById('main-header');
    if (header && !header.contains(e.target) && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   4. Project Filtering Portfolio
   ========================================================================== */

function initProjectFilters() {
  const filters = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filters.forEach(tab => {
    tab.addEventListener('click', () => {
      // Set active tab class
      filters.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filterVal = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        // Apply visual fade animation during filtering
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        if (filterVal === 'all' || cardCategory === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   5. Form Validation & Submissions
   ========================================================================== */

function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');

  if (!form || !feedback || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset error displays
    resetErrors();

    // Verify fields
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
      const errorMsg = document.getElementById(`${input.id}-error`);
      
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('invalid');
        if (errorMsg) errorMsg.style.display = 'block';
      } 
      else if (input.type === 'email' && !validateEmail(input.value)) {
        isValid = false;
        input.classList.add('invalid');
        if (errorMsg) errorMsg.style.display = 'block';
      }
    });

    if (!isValid) {
      feedback.textContent = 'Please correct the highlighted errors.';
      feedback.className = 'form-feedback error';
      return;
    }

    // Show loading spinner state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    inputs.forEach(input => input.disabled = true);
    feedback.style.display = 'none';

    // Simulated API POST Fetch
    setTimeout(() => {
      // Re-enable controls
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      inputs.forEach(input => {
        input.disabled = false;
        input.value = ''; // Clear fields
      });

      // Show success feedback
      feedback.textContent = 'Thank you! Your message has been sent successfully.';
      feedback.className = 'form-feedback success';
      
      // Auto-hide feedback after 5 seconds
      setTimeout(() => {
        feedback.style.display = 'none';
      }, 5000);

    }, 1800);
  });

  function resetErrors() {
    const errorMsgs = form.querySelectorAll('.error-msg');
    const inputs = form.querySelectorAll('input, textarea');
    errorMsgs.forEach(msg => msg.style.display = 'none');
    inputs.forEach(input => input.classList.remove('invalid'));
    feedback.style.display = 'none';
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }
}

/* ==========================================================================
   6. Scroll Animations CSS Fallbacks (for unsupported browsers)
   ========================================================================== */

function initScrollEffectsFallbacks() {
  const header = document.getElementById('main-header');

  // A. Shrinking Header Fallback (e.g. Firefox or older WebKit)
  const isScrollDrivenSupported = CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)');
  if (!isScrollDrivenSupported && header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('shrunk');
      } else {
        header.classList.remove('shrunk');
      }
    }, { passive: true });
  }

  // B. Scroll Entry/Exit Animation Fallback (ViewTimeline)
  const isViewTimelineSupported = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
  const revealElements = document.querySelectorAll('.scroll-reveal');

  if (!isViewTimelineSupported && revealElements.length > 0) {
    const observerOptions = {
      root: null, // Viewport
      rootMargin: '0px',
      threshold: 0.15 // Trigger when 15% visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once animated, stop observing this item
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  }
}
