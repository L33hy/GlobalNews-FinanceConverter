/**
 * Handles the single-page application (SPA) style navigation.
 * Shows/hides sections based on the URL hash.
 */
export function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");
  const menuToggle = document.querySelector(".menu-toggle");
  const navUl = document.querySelector("nav ul");

  const navigateTo = (hash) => {
    const targetHash = hash || "#news"; // Default to news

    // Handle section visibility
    sections.forEach((section) => {
      section.classList.toggle(
        "active",
        `#${section.id.replace("-section", "")}` === targetHash,
      );
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

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(e.target.getAttribute("href"));
    });
  });

  // Toggle mobile menu
  menuToggle.addEventListener("click", () => {
    navUl.classList.toggle("active");
  });

  // Initial load navigation
  navigateTo(window.location.hash);
}
