// Import the CSS file to be included in the build
import "../css/style.css";

// Import modules
import { initNews, handleNewsControls } from "./api/newsService.js";
import {
  initConverter,
  handleConverterControls,
} from "./api/exchangeRateService.js";
import { initNavigation } from "./ui.js";

/**
 * Initializes the entire application.
 */
function initApp() {
  // Initialize single-page application navigation
  initNavigation();

  // Initialize the news section and its controls
  initNews();
  handleNewsControls();

  // Initialize the currency converter and its controls
  initConverter();
  handleConverterControls();
}

// Run the app initialization once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initApp);
