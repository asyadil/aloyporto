import { state, elements, CONFIG } from './initialization';

// DOM Elements
const navElements = {
  mobileToggle: document.querySelector('.mobile-nav-toggle'),
  mobileMenu: document.querySelector('.mobile-menu'),
  navItems: document.querySelectorAll('.nav-item'),
  navLinks: document.querySelectorAll('a[href^="#"]'),
};

/**
 * Initialize navigation functionality
 */
export function setupNavigation() {
  // Setup mobile menu toggle
  if (navElements.mobileToggle) {
    navElements.mobileToggle.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (state.isMobileMenuOpen && 
        !e.target.closest('nav') && 
        !e.target.closest('.mobile-nav-toggle')) {
      closeMobileMenu();
    }
  });

  // Smooth scrolling for anchor links
  setupSmoothScrolling();
  
  // Update active nav on scroll
  window.addEventListener('scroll', throttle(updateActiveNav, 100));
  
  // Initial active nav update
  updateActiveNav();
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu(e) {
  if (e) e.stopPropagation();
  
  state.isMobileMenuOpen = !state.isMobileMenuOpen;
  
  if (navElements.mobileToggle) {
    navElements.mobileToggle.classList.toggle('active');
    navElements.mobileToggle.setAttribute(
      'aria-expanded', 
      state.isMobileMenuOpen ? 'true' : 'false'
    );
  }
  
  if (navElements.mobileMenu) {
    navElements.mobileMenu.classList.toggle('show');
    navElements.mobileMenu.setAttribute(
      'aria-hidden', 
      state.isMobileMenuOpen ? 'false' : 'true'
    );
  }
  
  // Toggle body scroll
  document.body.style.overflow = state.isMobileMenuOpen ? 'hidden' : '';
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
  if (!state.isMobileMenuOpen) return;
  
  state.isMobileMenuOpen = false;
  
  if (navElements.mobileToggle) {
    navElements.mobileToggle.classList.remove('active');
    navElements.mobileToggle.setAttribute('aria-expanded', 'false');
  }
  
  if (navElements.mobileMenu) {
    navElements.mobileMenu.classList.remove('show');
    navElements.mobileMenu.setAttribute('aria-hidden', 'true');
  }
  
  // Re-enable body scroll
  document.body.style.overflow = '';
}

/**
 * Setup smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
  navElements.navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's not an anchor link
      if (href === '#' || !href.startsWith('#')) return;
      
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Close mobile menu if open
        if (state.isMobileMenuOpen) {
          closeMobileMenu();
        }
        
        // Scroll to target
        const headerOffset = CONFIG.scrollOffset;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Update active navigation item based on scroll position
 */
function updateActiveNav() {
  if (state.isScrolling) return;
  
  state.isScrolling = true;
  
  const scrollPosition = window.scrollY + CONFIG.scrollOffset;
  const sections = document.querySelectorAll('section[id]');
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  // Update active nav items
  if (currentSection) {
    navElements.navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href === `#${currentSection}`) {
        item.classList.add('active');
      } else if (href !== '#') { // Don't remove active class from home if no section is active
        item.classList.remove('active');
      }
    });
  }
  
  state.isScrolling = false;
}

/**
 * Throttle function to limit the rate of function calls
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
