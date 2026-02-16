// Tabs functionality
document.querySelectorAll('.tabs-container').forEach(tabsContainer => {
  const tabButtons = Array.from(tabsContainer.querySelectorAll('.tab-button'));
  const tabContents = Array.from(tabsContainer.querySelectorAll('.tab-content'));

  if (!tabButtons.length || !tabContents.length) {
    return;
  }

  const setActiveTab = (tabId) => {
    const targetPanel = tabContents.find(panel => panel.id === tabId);

    if (!targetPanel) {
      return;
    }

    tabButtons.forEach(button => {
      const isActive = button.getAttribute('data-tab') === tabId;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });

    tabContents.forEach(panel => {
      panel.classList.toggle('active', panel.id === tabId);
    });
  };

  tabButtons.forEach(button => {
    const tabId = button.getAttribute('data-tab');
    button.setAttribute('type', 'button');
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(button.classList.contains('active')));

    button.addEventListener('click', () => {
      if (!tabId) {
        return;
      }

      setActiveTab(tabId);
    });
  });

  const initialTabId =
    tabButtons.find(button => button.classList.contains('active'))?.getAttribute('data-tab') ||
    tabButtons[0].getAttribute('data-tab');

  if (initialTabId) {
    setActiveTab(initialTabId);
  }
});

// FAQ Toggle
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', function () {
    const faqItem = this.parentElement;
    const wasActive = faqItem.classList.contains('active');

    // Close all FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });

    // Open clicked FAQ if it wasn't active
    if (!wasActive) {
      faqItem.classList.add('active');
    }
  });
});

// Header background after first fold
const header = document.querySelector('.header');

if (header) {
  const updateHeaderScrollState = () => {
    const isPastFirstFold = window.scrollY >= window.innerHeight;
    header.classList.toggle('header-scrolled', isPastFirstFold);
  };

  updateHeaderScrollState();
  window.addEventListener('scroll', updateHeaderScrollState, { passive: true });
  window.addEventListener('resize', updateHeaderScrollState);
}

// Mobile menu toggle
const mobileMenuButton = document.querySelector('.mobile-menu-btn');
const mobileNavigation = document.querySelector('.nav');

if (mobileMenuButton && mobileNavigation) {
  const closeMobileMenu = () => {
    mobileMenuButton.classList.remove('is-open');
    mobileNavigation.classList.remove('is-open');
    mobileMenuButton.setAttribute('aria-expanded', 'false');
  };

  mobileMenuButton.addEventListener('click', () => {
    const shouldOpen = !mobileMenuButton.classList.contains('is-open');
    mobileMenuButton.classList.toggle('is-open', shouldOpen);
    mobileNavigation.classList.toggle('is-open', shouldOpen);
    mobileMenuButton.setAttribute('aria-expanded', String(shouldOpen));
  });

  mobileNavigation.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 968px)').matches) {
        closeMobileMenu();
      }
    });
  });

  document.addEventListener('click', event => {
    const clickInsideButton = mobileMenuButton.contains(event.target);
    const clickInsideMenu = mobileNavigation.contains(event.target);

    if (!clickInsideButton && !clickInsideMenu) {
      closeMobileMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width: 968px)').matches) {
      closeMobileMenu();
    }
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll animations (already existing in cards)
const animatedCards = document.querySelectorAll('.service-card, .step-card, .testimonial-card, .benefit-card, .step-card-new');

if (prefersReducedMotion) {
  animatedCards.forEach(element => {
    element.style.opacity = '1';
    element.style.transform = 'none';
    element.style.transition = 'none';
  });
} else {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  animatedCards.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });
}

// Global scroll reveal for areas without previous animations
const revealGroups = [
  { selector: '.services .section-header' },
  { selector: '.how-it-works .section-header' },
  { selector: '.how-it-works .tabs', delayStep: 80 },
  { selector: '#processo .pricing-box', delayStep: 80 },
  { selector: '.benefits .section-header' },
  { selector: '.benefits .cta-card' },
  { selector: '.testimonials .section-header' },
  { selector: '.faq .section-header' },
  { selector: '.faq .faq-item', delayStep: 70 }
];

const revealElements = [];

revealGroups.forEach(({ selector, delayStep = 60, directionClass = '' }) => {
  const elements = Array.from(document.querySelectorAll(selector));

  elements.forEach((element, index) => {
    element.classList.add('scroll-reveal');

    if (directionClass) {
      element.classList.add(directionClass);
    }

    const cappedDelay = Math.min(index * delayStep, 280);
    element.style.setProperty('--reveal-delay', `${cappedDelay}ms`);
    revealElements.push(element);
  });
});

if (prefersReducedMotion) {
  revealElements.forEach(element => {
    element.classList.add('is-visible');
  });
} else if (revealElements.length) {
  const globalRevealObserver = new IntersectionObserver((entries, sectionObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('is-visible');
      sectionObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -8% 0px'
  });

  revealElements.forEach(element => {
    globalRevealObserver.observe(element);
  });
}

// About section scroll reveal
const aboutSection = document.querySelector('.about');

if (aboutSection) {
  const aboutRevealConfig = [
    { selector: '.about-image', directionClass: 'from-left', delay: 60 },
    { selector: '.about-content', directionClass: 'from-right', delay: 140 },
    { selector: '.stats-grid', directionClass: 'from-up', delay: 220 }
  ];

  const aboutRevealElements = [];

  aboutRevealConfig.forEach(({ selector, directionClass, delay }) => {
    const element = aboutSection.querySelector(selector);

    if (!element) {
      return;
    }

    element.classList.add('about-reveal', directionClass);
    element.style.setProperty('--about-delay', `${delay}ms`);
    aboutRevealElements.push(element);
  });

  const aboutObserver = new IntersectionObserver((entries, sectionObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('is-visible');
      sectionObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -8% 0px'
  });

  aboutRevealElements.forEach(element => {
    aboutObserver.observe(element);
  });
}
