import { state, elements } from './initialization';

// Theme configuration
const THEMES = {
  light: {
    name: 'light',
    bgClass: 'bg-gray-50',
    textClass: 'text-gray-900',
    navActiveClass: 'bg-primary text-white',
  },
  dark: {
    name: 'dark',
    bgClass: 'bg-gray-900',
    textClass: 'text-white',
    navActiveClass: 'bg-yellow-400 text-gray-900',
  },
};

/**
 * Initialize theme functionality
 */
export function setupTheme() {
  // Set initial theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme === 'dark');
  
  // Setup theme toggle event listeners
  const themeToggles = document.querySelectorAll('[data-theme-toggle]');
  themeToggles.forEach(toggle => {
    toggle.addEventListener('change', handleThemeToggle);
    // Set initial checked state
    toggle.checked = state.isDarkMode;
  });
}

/**
 * Handle theme toggle
 */
function handleThemeToggle() {
  state.isDarkMode = !state.isDarkMode;
  setTheme(state.isDarkMode);
  
  // Update all theme toggles
  document.querySelectorAll('[data-theme-toggle]').forEach(toggle => {
    toggle.checked = state.isDarkMode;
  });
  
  // Save preference
  localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
  
  // Dispatch custom event for other components
  document.dispatchEvent(new CustomEvent('themeChange', { 
    detail: { isDarkMode: state.isDarkMode }
  }));
}

/**
 * Apply theme to the page
 */
function setTheme(isDark) {
  const theme = isDark ? THEMES.dark : THEMES.light;
  const prevTheme = isDark ? THEMES.light : THEMES.dark;
  
  // Update HTML attribute for theme
  document.documentElement.setAttribute('data-theme', theme.name);
  
  // Update body classes
  elements.body.classList.remove(prevTheme.bgClass);
  elements.body.classList.add(theme.bgClass);
  
  // Update navigation active states
  updateNavActiveState(theme.navActiveClass, prevTheme.navActiveClass);
  
  // Update theme-specific elements
  updateThemeElements(theme, prevTheme);
}

/**
 * Update navigation active state
 */
function updateNavActiveState(activeClass, prevActiveClass) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    if (item.classList.contains(prevActiveClass)) {
      item.classList.remove(prevActiveClass);
      item.classList.add(activeClass);
    }
  });
}

/**
 * Update theme-specific elements
 */
function updateThemeElements(theme, prevTheme) {
  // Update ali-text background
  const aliText = document.getElementById('ali-text');
  if (aliText) {
    aliText.classList.remove(
      prevTheme.name === 'dark' ? 'bg-yellow-400' : 'bg-primary'
    );
    aliText.classList.add(
      theme.name === 'dark' ? 'bg-yellow-400' : 'bg-primary'
    );
  }
  
  // Add any other theme-specific element updates here
}

// Export for other modules
export { THEMES };
