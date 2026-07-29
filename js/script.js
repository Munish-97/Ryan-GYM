document.addEventListener('DOMContentLoaded', () => {
  
  

  // Reveal Animations on Scroll
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // Update Footer Year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Gallery Lightbox Logic
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const galleryItems = document.querySelectorAll('.masonry-item img');
  const lightboxCounter = document.getElementById('lightbox-counter');
  let currentImageIndex = 0;

  if (lightbox && galleryItems.length > 0) {
    const btnClose = document.getElementById('lightbox-close');
    const btnPrev = document.getElementById('lightbox-prev');
    const btnNext = document.getElementById('lightbox-next');

    function updateCounter() {
      if (lightboxCounter) {
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryItems.length}`;
      }
    }

    function openLightbox(index) {
      currentImageIndex = index;
      const targetImg = galleryItems[currentImageIndex];
      lightboxImg.src = targetImg.getAttribute('data-large-src') || targetImg.src;
      updateCounter();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      lightbox.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function showPrev() {
      currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
      const targetImg = galleryItems[currentImageIndex];
      lightboxImg.src = targetImg.getAttribute('data-large-src') || targetImg.src;
      updateCounter();
    }

    function showNext() {
      currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
      const targetImg = galleryItems[currentImageIndex];
      lightboxImg.src = targetImg.getAttribute('data-large-src') || targetImg.src;
      updateCounter();
    }

    galleryItems.forEach((img, index) => {
      img.parentElement.addEventListener('click', () => openLightbox(index));
    });

    btnClose.addEventListener('click', closeLightbox);
    btnPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    btnNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    
    // Close when clicking outside image
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    lightbox.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, {passive: true});

    function handleSwipe() {
      const threshold = 50;
      if (touchEndX < touchStartX - threshold) showNext();
      if (touchEndX > touchStartX + threshold) showPrev();
    }
  }

  // Contact Form Validation
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderBottomColor = 'red';
        } else {
          input.style.borderBottomColor = 'var(--border-muted)';
        }
      });

      if (isValid) {
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Enquiry Sent.';
        btn.style.backgroundColor = 'var(--accent-yellow)';
        btn.style.color = 'var(--bg-primary)';
        
        setTimeout(() => {
          contactForm.reset();
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
          btn.style.color = '';
        }, 4000);
      }
    });
  }

});
