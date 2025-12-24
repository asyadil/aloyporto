// Import jQuery
import $ from 'jquery';

// Import modules
import { initializePage } from './modules/initialization';
import { setupTheme } from './modules/theme';
import { setupNavigation } from './modules/navigation';
import { setupContactForm } from './modules/contact';
import { setupOfflineSupport } from './modules/offline';

// Initialize when DOM is ready
$(document).ready(() => {
  initializePage();
  setupTheme();
  setupNavigation();
  setupContactForm();
  setupOfflineSupport();
});

// Export for other modules if needed
window.$ = $;
window.jQuery = $;
