/**
 * UI Logic for ts-ascii-engine documentation
 * Handles Path Fixes, Theme Toggling, and Mobile Navigation
 */

(function () {
  // 1. Path Fix (Auto-redirect if trailing slash is missing)
  if (
    window.location.pathname.endsWith("/docs") &&
    !window.location.pathname.endsWith("/")
  ) {
    window.location.replace(window.location.pathname + "/");
    return;
  }

  // 2. Theme Initialization
  function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    updateThemeIcon();
  }

  // Update Theme Icon UI
  function updateThemeIcon() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const themeBtn =
      document.getElementById("themeToggle") ||
      document.getElementById("mobileThemeToggle");

    // Update all toggle buttons found
    const toggles = document.querySelectorAll(".theme-toggle");
    toggles.forEach((btn) => {
      const icon = btn.querySelector("i");
      if (currentTheme === "dark") {
        icon.classList.remove("ri-moon-line");
        icon.classList.add("ri-sun-line");
      } else {
        icon.classList.remove("ri-sun-line");
        icon.classList.add("ri-moon-line");
      }
    });
  }

  // Toggle Theme Function
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    if (newTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    localStorage.setItem("theme", newTheme);
    updateThemeIcon();
  }

  // 3. Mobile Navigation Logic
  function initMobileNav() {
    const menuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const closeBtn = document.getElementById("closeMobileMenu");
    const backdrop = document.getElementById("mobileMenuBackdrop");

    if (!menuBtn || !mobileMenu) return;

    function openMenu() {
      mobileMenu.classList.add("open");
      if (backdrop) backdrop.classList.add("visible");
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    function closeMenu() {
      mobileMenu.classList.remove("open");
      if (backdrop) backdrop.classList.remove("visible");
      document.body.style.overflow = "";
    }

    menuBtn.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (backdrop) backdrop.addEventListener("click", closeMenu);

    // Close on link click
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  // 4. Code Block Copy Logic
  function initCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(pre => {
        // Create Wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        
        // Insert wrapper before pre
        pre.parentNode.insertBefore(wrapper, pre);
        
        // Move pre into wrapper
        wrapper.appendChild(pre);

        // Create button
        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.ariaLabel = 'Copy code';
        button.innerHTML = '<i class="ri-file-copy-line"></i>';
        
        // Add to Wrapper (NOT inside pre)
        wrapper.appendChild(button);
        
        // Click handler
        button.addEventListener('click', async () => {
            const code = pre.querySelector('code');
            if (!code) return;
            
            try {
                await navigator.clipboard.writeText(code.innerText);
                
                // Success State
                button.innerHTML = '<i class="ri-check-line"></i>';
                button.classList.add('copied');
                
                // Reset after 2s
                setTimeout(() => {
                    button.innerHTML = '<i class="ri-file-copy-line"></i>';
                    button.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                button.innerHTML = '<i class="ri-error-warning-line"></i>';
            }
        });
    });
  }

  // Initialize immediately
  initTheme();

  // Event Listeners on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", () => {
    updateThemeIcon(); // Ensure icons are correct after DOM load
    initMobileNav();
    initCopyButtons();

    // Attach click handlers to all theme toggles
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.addEventListener("click", toggleTheme);
    });
  });
})();
