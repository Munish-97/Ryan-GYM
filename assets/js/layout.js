// Shared Layout Script

const headerHTML = `
  <header class="header">
    <div class="container">
      <a href="index.html" class="logo" aria-label="Home">
        <img src="assets/images/ryan-logo-simple.svg" alt="The Ryan Gym Logo" class="logo-badge">
        <div class="logo-text-wrapper">
          <div class="logo-text">THE <span>RYAN</span> GYM</div>
          <div class="logo-subtext">MUBARIKPUR</div>
        </div>
      </a>
      <button class="hamburger" aria-label="Toggle navigation">
        <span class="hamburger-line line1"></span>
        <span class="hamburger-line line2"></span>
        <span class="hamburger-line line3"></span>
      </button>
      <nav class="nav-links">
        <a href="index.html">Home</a>
        <a href="about.html">About Us</a>
        <a href="programs.html">Programs</a>
        <a href="gallery.html">Gallery</a>
        <a href="memberships.html">Memberships</a>
        <a href="contact.html">Contact Us</a>
        <a href="contact.html" class="btn btn-primary" style="padding: 12px 24px; font-size: 0.9rem;">Join Now</a>
      </nav>
    </div>
  </header>
`;

const footerHTML = `
  <footer class="footer">
    <!-- Animated Abstract Background -->
    <div class="footer-bg-anim">
      <div class="footer-glow-1"></div>
      <div class="footer-glow-2"></div>
      <div class="footer-grid-overlay"></div>
      <div class="footer-noise"></div>
    </div>
    <div class="container" style="position: relative; z-index: 10;">
      <div class="footer-grid">
        <div class="footer-col" style="position: relative; z-index: 2;">
          <div class="logo" style="margin-bottom: 20px;">
            <img src="assets/images/ryan-logo-simple.svg" alt="The Ryan Gym Logo" class="logo-badge">
            <div class="logo-text-wrapper">
              <div class="logo-text">THE <span>RYAN</span> GYM</div>
              <div class="logo-subtext">MUBARIKPUR</div>
            </div>
          </div>
          <p class="footer-desc">A focused training space in Mubarikpur, built for strength, discipline and lasting results.</p>
          
          <div class="footer-badges">
            <span class="footer-badge">
              <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              Certified Trainers
            </span>
            <span class="footer-badge">
              <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              Premium Equipment
            </span>
          </div>

          <div class="footer-socials">
            <a href="#" aria-label="Facebook" title="Facebook">
              <i class="bi bi-facebook"></i>
            </a>
          
            <a href="#" aria-label="Instagram" title="Instagram">
              <i class="bi bi-instagram"></i>
            </a>
          
            <a href="#" aria-label="X" title="X">
              <i class="bi bi-twitter-x"></i>
            </a>
          
            <a href="#" aria-label="YouTube" title="YouTube">
              <i class="bi bi-youtube"></i>
            </a>
          </div>
        </div>
        <div class="footer-col">
          <h4>EXPLORE</h4>
          <a href="index.html">Home</a>
          <a href="about.html">About Us</a>
          <a href="gallery.html">Gallery</a>
          <a href="memberships.html">Memberships</a>
        </div>
        <div class="footer-col">
          <h4>PROGRAMS</h4>
          <a href="programs.html">Strength Training</a>
          <a href="programs.html">Weight Training</a>
          <a href="programs.html">Personal Training</a>
          <a href="programs.html">Fat Loss</a>
        </div>
        <div class="footer-col">
          <h4>CONTACT</h4>
          <a href="tel:+917018290692">+91 7018290692</a>
          <a href="tel:+919736363631">+91 9736363631</a>
          <a href="mailto:sohallalit@gmail.com">sohallalit@gmail.com</a>
          <p style="margin-top: 20px; color: var(--text-primary);">Basement, Opposite Post Office Mubarikpur,<br>Tehsil Amb, District Una, HP – 177202</p>
          <p style="color: var(--accent-yellow); margin-top: 10px; font-weight: 500;">MORNING: 4:00 AM - 11:00 AM<br>EVENING: 3:00 PM - 10:00 PM</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Ryan Gym. All rights reserved.</p>
        <p class="dev-credit">Designed and Developed by Honey Thakur <span class="heart">❤️</span></p>
      </div>
    </div>
  </footer>
`;

// Inject Header and Footer
const headerContainer = document.getElementById('site-header');
const footerContainer = document.getElementById('site-footer');

if (headerContainer) headerContainer.innerHTML = headerHTML;
if (footerContainer) footerContainer.innerHTML = footerHTML;

// Active Navigation Logic
const navLinksItems = document.querySelectorAll('.nav-links a');
const currentPath = window.location.pathname;

navLinksItems.forEach(link => {
  // Remove any pre-existing active classes
  link.classList.remove('active');
  
  const linkHref = link.getAttribute('href');
  
  // Exclude the 'Join Now' button from active state styling
  if (link.classList.contains('btn-primary')) return;

  if ((currentPath.endsWith('/') || currentPath.endsWith('index.html')) && linkHref === 'index.html') {
    link.classList.add('active');
  } else if (currentPath.endsWith(linkHref)) {
    link.classList.add('active');
  }
});

// Mobile Menu Toggle (re-initialized after DOM injection)
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  const closeMenu = () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    const isActive = hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMenu);

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      closeMenu();
    }
  });

  // Reset scroll on resize if crossing breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && navLinks.classList.contains('active')) {
      closeMenu();
    }
  });
}

// Sticky Header logic from script.js transferred here so it binds correctly to the newly injected header
const header = document.querySelector('.header');
if (header) {
  const checkScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial check in case of page reload halfway down
}
