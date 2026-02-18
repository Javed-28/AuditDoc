(function () {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("theme");

  // Apply saved theme on load
  if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
  } else {
    root.setAttribute("data-theme", "light");
  }

  // Expose toggle function globally
  window.toggleTheme = function () {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };
})();
