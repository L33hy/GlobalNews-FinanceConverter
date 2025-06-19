/**
 * Handles the single-page application (SPA) style navigation.
 * Shows/hides sections based on the URL hash.
 */
import { loadTeamMembers } from "./api/aboutService.js";
export function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");
  const menuToggle = document.querySelector(".menu-toggle");
  const navUl = document.querySelector("nav ul");

  const navigateTo = (hash) => {
    const targetHash = hash || "#home"; // Default to home
    const sectionId = `${targetHash.substring(1)}-section`; // Convert #home to home-section

    // Handle section visibility
    sections.forEach((section) => {
      if (section.id === sectionId) {
        section.classList.add("active");
        // *** IMPORTANT: Call loadTeamMembers if navigating to the About Us section ***
        if (targetHash === "#about") {
          loadTeamMembers();
        }
      } else {
        section.classList.remove("active");
      }
    });

    // Handle nav link styling
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === targetHash);
    });

    // Update hash without causing a page jump if it's the same
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }

    // Close mobile menu after navigation
    if (navUl.classList.contains("active")) {
      navUl.classList.remove("active");
    }
  };

  // Use event delegation for nav links
  document.body.addEventListener("click", (e) => {
    if (e.target.matches(".nav-link")) {
      e.preventDefault();
      navigateTo(e.target.getAttribute("href"));
    }
  });

  // Toggle mobile menu
  menuToggle.addEventListener("click", () => {
    navUl.classList.toggle("active");
  });

  // Initial load navigation
  navigateTo(window.location.hash);
}

/**
 * Handles the logic for the modal dialog.
 */
export function handleFirstVisitModal() {
  const modal = document.getElementById("visitor-modal");
  const overlay = document.getElementById("visitor-modal-overlay");
  const closeModalBtn = document.getElementById("close-visitor-modal");
  const visitorForm = document.getElementById("visitor-form");

  const openModal = () => {
    overlay.classList.add("active");
    modal.classList.add("active");
    document.body.classList.add("modal-active");
  };

  const closeModal = () => {
    overlay.classList.remove("active");
    modal.classList.remove("active");
    document.body.classList.remove("modal-active");
  };

  // Show the modal on every visit after a short delay.
  // The check for 'hasVisited' in localStorage has been removed.
  setTimeout(openModal, 1500);

  // Event listeners
  closeModalBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
  visitorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Here you would normally send the data to a server
    // eslint-disable-next-line no-console
    console.log("Form submitted. Data:", {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
    });
    closeModal();
  });
}

/**
 * Displays the last modified date of the document in the footer.
 */
export function displayLastModified() {
  const lastModifiedElem = document.getElementById("last-modified");
  if (lastModifiedElem) {
    const lastModifiedDate = new Date(document.lastModified);
    lastModifiedElem.textContent = `Last Updated: ${lastModifiedDate.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    )}`;
  }
}
