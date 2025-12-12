// Runss after the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  setupCurrentYear();
  setupBackToTop();
  setupOffcanvasNav();
  setupSkillBarAnimation();
});
/**
 * Dark mode toggle:
 * Switches button text between "Dark mode" and "Light mode"
 */
function setupThemeToggle() {
  const toggleBtn = document.getElementById("themeToggle");
  if (!toggleBtn) return;
  const body = document.body;
  const THEME_KEY = "fm-portfolio-theme";
  // Apply saved theme on load, defaulting to dark mode
  const savedTheme = localStorage.getItem(THEME_KEY);
  const isDark = savedTheme ? savedTheme === "dark" : true;
  body.classList.toggle("dark-mode", isDark);
  toggleBtn.textContent = isDark ? "Light mode" : "Dark mode";
  // Toggle on click
  toggleBtn.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark-mode");
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    toggleBtn.textContent = isDark ? "Light mode" : "Dark mode";
  });
}
/**
 * Sets the current year in the footer automatically.
 */
function setupCurrentYear() {
  const yearSpan = document.getElementById("currentYear");
  if (!yearSpan) return;
  const year = new Date().getFullYear();
  yearSpan.textContent = year;
}
/**
 * Shows a floating "back to top" button after scrolling down,
 * and scrolls smoothly to the top when clicked.
 */
function setupBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.remove("d-none");
    } else {
      btn.classList.add("d-none");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/**
 * Closes the mobile offcanvas menu after a nav link click,
 * without breaking in-page anchor navigation.
 */
function setupOffcanvasNav() {
  const offcanvasElement = document.getElementById("offcanvasNavbar");
  const Offcanvas = window.bootstrap?.Offcanvas;
  if (!offcanvasElement || !Offcanvas) return;

  const offcanvasInstance = Offcanvas.getOrCreateInstance(offcanvasElement);
  offcanvasElement.querySelectorAll("a.nav-link[href]").forEach((link) => {
    link.addEventListener("click", () => {
      if (offcanvasElement.classList.contains("show")) {
        offcanvasInstance.hide();
      }
    });
  });
}
/**
 * Animates skill bars when the Skills section comes into view.
 * Uses IntersectionObserver if available otherwise falls back
 * to filling them immediately.
 */
function setupSkillBarAnimation() {
  const bars = Array.from(document.querySelectorAll(".progress-bar[data-skill-target]"));
  if (!bars.length) return;

  const fillBars = () => {
    bars.forEach((bar) => {
      const target = Number(bar.getAttribute("data-skill-target"));
      if (Number.isNaN(target)) return;
      bar.style.width = `${target}%`;
      bar.setAttribute("aria-valuenow", String(target));
    });
  };

  const skillsSection = document.getElementById("skills");
  if (!("IntersectionObserver" in window) || !skillsSection) {
    fillBars();
    return;
  }

  let hasAnimated = false;
  const observer = new IntersectionObserver((entries) => {
    if (hasAnimated) return;
    if (entries.some((entry) => entry.isIntersecting)) {
      hasAnimated = true;
      fillBars();
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  observer.observe(skillsSection);
}
