// Configuration
const CONFIG = {
  scrollOffset: 80,
  animationDuration: 600,
  scrollThreshold: 0,
};

// State management
const state = {
  isScrolling: false,
  isDarkMode: localStorage.getItem("theme") === "dark",
  isMobileMenuOpen: false,
};

// DOM Elements
const elements = {
  body: document.body,
  main: document.querySelector("main"),
  loader: document.querySelector(".loader"),
  nav: document.querySelector("nav"),
  homeText: document.querySelector("#home-text"),
  aliText: document.querySelector("#ali-text"),
};

/**
 * Initialize the page with proper theme and animations
 */
export function initializePage() {
  // Apply saved theme or default to light
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  
  // Hide loader and show content
  if (elements.loader) {
    elements.loader.style.display = "none";
  }
  
  if (elements.main) {
    elements.main.style.display = "block";
  }

  // Initialize animations
  initializeAnimations();
}

/**
 * Initialize page animations
 */
function initializeAnimations() {
  // Fade in navigation
  if (elements.nav) {
    elements.nav.classList.remove("opacity-0");
    elements.nav.classList.add("opacity-100", "transition-opacity", "duration-500");
  }

  // Fade in hero content
  const fadeInElements = [elements.homeText, elements.aliText];
  fadeInElements.forEach((el, index) => {
    if (el) {
      setTimeout(() => {
        el.classList.remove("opacity-0");
        el.classList.add("opacity-100", "transition-opacity", "duration-500");
      }, 100 * (index + 1));
    }
  });
}

// Export for other modules
export { CONFIG, state, elements };
