(() => {
  const blob = document.querySelector('.blur-blob');
  const nodes = document.querySelectorAll('.node');
  const hero = document.querySelector('.hero-card');
  const play = document.querySelector('.play');
  const logo = document.querySelector('.logo');
  const aboutIllustration = document.querySelector('.about-illustration');
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  let scrollTimeout;

  // About illustration scroll animation
  if (aboutIllustration) {
    window.addEventListener('scroll', () => {
      const elementRect = aboutIllustration.getBoundingClientRect();
      const elementCenter = elementRect.top + elementRect.height / 2;
      const windowCenter = window.innerHeight / 2;
      
      if (elementRect.top < window.innerHeight && elementRect.bottom > 0) {
        aboutIllustration.classList.add('scroll-animate');
      }
    });
  }

  // Logo scroll animation
  if (logo) {
    window.addEventListener('scroll', () => {
      logo.classList.add('scrolling');
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        logo.classList.remove('scrolling');
      }, 600);
    });
  }

  // Toggle mobile menu
  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      mainNav.classList.toggle('active');
    });
    
    // Close menu when link is clicked
    mainNav.querySelectorAll('a, button').forEach(item => {
      item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mainNav.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mainNav.contains(e.target)) {
        if (mainNav.classList.contains('active')) {
          hamburger.classList.remove('active');
          mainNav.classList.remove('active');
        }
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('active')) {
        hamburger.classList.remove('active');
        mainNav.classList.remove('active');
      }
    });
  }

  // Disable parallax on mobile
  const isMobile = window.innerWidth < 768;
  
  if (!isMobile) {
    // subtle parallax on mouse move (desktop only)
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      if (blob) blob.style.transform = `translate(${x * 30}px, ${y * 20}px) rotate(-10deg) scale(1.02)`;
      nodes.forEach((n, i) => {
        const mul = (i % 2 === 0) ? -1 : 1;
        n.style.transform = `translate(${x * 12 * mul}px, ${y * 8 * mul}px)`;
      });
      if (hero) hero.style.transform = `translate(${x * 35}px, ${y * 30}px)`;
    });
  }

  // small interaction handlers
  document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('click', () => {
      b.classList.add('pressed');
      setTimeout(() => b.classList.remove('pressed'), 180);
    });
  });

  if (play) {
    play.addEventListener('click', () => {
      play.animate([
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(0.9)', opacity: 0.7 },
        { transform: 'scale(1)', opacity: 1 }
      ], { duration: 420 });
      console.log('Play clicked — open intro video or demo');
    });
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    // Close mobile menu on resize
    if (window.innerWidth >= 768 && mainNav.classList.contains('active')) {
      hamburger.classList.remove('active');
      mainNav.classList.remove('active');
    }
  });

  // Why Choose Us Section - Interactive Functionality
  const whyChooseButtons = document.querySelectorAll('.why-choose-btn');
  const statementItems = document.querySelectorAll('.statement-item');
  const illustrations = document.querySelectorAll('.illustration');
  
  whyChooseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const service = button.getAttribute('data-service');
      
      // Update active button
      whyChooseButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update active statement
      statementItems.forEach(item => item.classList.remove('active'));
      document.querySelector(`.statement-item[data-service="${service}"]`).classList.add('active');
      
      // Update active illustration
      illustrations.forEach(ill => ill.style.display = 'none');
      const activeIllustration = document.getElementById(`${service}Illustration`);
      if (activeIllustration) {
        activeIllustration.style.display = 'block';
      }
    });
  });

  // Service Cards Scroll Animation
  const scrollFadeElements = document.querySelectorAll('.scroll-fade');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'slideUp 0.6s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  scrollFadeElements.forEach(el => {
    observer.observe(el);
  });

  // Process Steps Animation on Scroll
  const steps = document.querySelectorAll('.process-steps .step');
  const processObserverOptions = {
    threshold: 0.2
  };
  
  const processObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stepIndex = Array.from(steps).indexOf(entry.target);
        const animations = ['animate-bounce', 'animate-flip', 'animate-slide', 'animate-rotate'];
        entry.target.classList.add(animations[stepIndex % animations.length]);
        processObserver.unobserve(entry.target);
      }
    });
  }, processObserverOptions);
  
  steps.forEach(step => {
    processObserver.observe(step);
  });

  // Companies Carousel Navigation with Touch Support
  const carousel = document.getElementById('companiesCarousel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentPosition = 0;
  const isMobileCarousel = window.innerWidth < 768;
  const scrollAmount = isMobileCarousel ? 150 : 220; // Adjust scroll for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  function updateButtonStates() {
    const maxScroll = carousel.scrollWidth - carousel.parentElement.clientWidth;
    if (prevBtn && nextBtn) {
      prevBtn.disabled = currentPosition <= 0;
      nextBtn.disabled = currentPosition >= maxScroll;
    }
  }

  if (prevBtn && nextBtn && carousel) {
    // Initial button states
    updateButtonStates();

    prevBtn.addEventListener('click', () => {
      currentPosition = Math.max(currentPosition - scrollAmount, 0);
      carousel.style.transform = `translateX(-${currentPosition}px)`;
      updateButtonStates();
    });

    nextBtn.addEventListener('click', () => {
      const maxScroll = carousel.scrollWidth - carousel.parentElement.clientWidth;
      currentPosition = Math.min(currentPosition + scrollAmount, maxScroll);
      carousel.style.transform = `translateX(-${currentPosition}px)`;
      updateButtonStates();
    });

    // Touch swipe support for mobile
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, false);

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, false);

    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swiped left
        nextBtn.click();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swiped right
        prevBtn.click();
      }
    }

    // Update button states on window resize
    window.addEventListener('resize', updateButtonStates);
  }

})();
