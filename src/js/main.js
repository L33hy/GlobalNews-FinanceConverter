// Import the CSS file to be included in the build
import "../css/style.css";

// Import modules
import { initNews, handleNewsControls } from "./api/newsService.js";
import {
  initConverter,
  handleConverterControls,
} from "./api/exchangeRateService.js";
import { initNavigation, handleFirstVisitModal, displayLastModified } from "./ui.js";
import { initAbout } from "./api/aboutService.js"; // Import new aboutService

/**
 * Initializes the entire application.
 */
function initApp() {
  // Initialize single-page application navigation
  initNavigation();

  // Initialize modal handler
  handleFirstVisitModal(); // This will show the welcome modal

  // Initialize the news section and its controls
  initNews();
  handleNewsControls();

  // Initialize the currency converter and its controls
  initConverter();
  handleConverterControls();

  // Initialize the About Us section (if any initial setup is needed)
  initAbout(); // This function itself doesn't load team members on init, only provides the hook.

  // Display the last modified date
  displayLastModified();
}

// Run the app initialization once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initApp);
