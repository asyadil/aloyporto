// ==================== Page Initialization ====================
window.onload = function () {
  const body = document.querySelector("body");
  body.classList.remove("opacity-0");
  body.classList.add("opacity-100");

  // Get saved theme
  const savedTheme = localStorage.getItem("theme");
  const bgClass = savedTheme === "dark" ? "bg2" : "bg1";

  // Apply bg class
  body.classList.add(bgClass);
  body.style.backgroundImage = "none";

  setTimeout(function () {
    document.querySelector(".loader").style.display = "none";
    document.querySelector("main").style.display = "block";

    // Restore background-image
    body.style.backgroundImage = "";

    // Animate navbar and home text fade in
    setTimeout(function () {
      const nav = document.querySelector("nav");
      const homeText = document.querySelector("#home-text");
      const aliText = document.querySelector("#ali-text");

      if (nav) nav.classList.add("opacity-100");
      if (homeText) homeText.classList.add("opacity-100");
      if (aliText) aliText.classList.add("opacity-100");
    }, 100);
  }, 900);
};

$(document).ready(function () {
  // ==================== Configuration ====================
  const CONFIG = {
    scrollOffset: 80,
    animationDuration: 600,
    scrollThreshold: 0,
  };

  const THEMES = {
    light: {
      bgClass: "bg1",
      navActiveClass: "active",
      navHoverColor: "hover:text-[#071E3D]",
      aliH4Bg: "bg-[#21E6C1]",
    },
    dark: {
      bgClass: "bg2",
      navActiveClass: "active2",
      navHoverColor: "hover:text-[#1f0701]",
      aliH4Bg: "bg-[#ffc800]",
    },
  };

  // ==================== State Management ====================
  const state = {
    isScrolling: false,
    isDarkMode: localStorage.getItem("theme") === "dark" ? true : false,
    isMobileMenuOpen: false,
  };

  // ==================== DOM Caching ====================
  const $navItems = $(".nav_item");
  const $themeToggleDesktop = $("#ini .peer");
  const $themeToggleMobile = $("#ini-mobile .peer");
  const $body = $("body");
  const $nav = $("nav");
  const navElement = document.querySelector("nav");
  const homeTextElement = document.querySelector("#home-text");
  const aliTextElement = document.querySelector("#ali-text");

  // ==================== Mobile Menu Management ====================
  const $mobileToggle = $(".mobile-nav-toggle");
  const $mobileMenu = $(".mobile-menu");

  function toggleMobileMenu() {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
    $mobileToggle.toggleClass("active");
    $mobileMenu.toggleClass("show");
  }

  function closeMobileMenu() {
    state.isMobileMenuOpen = false;
    $mobileToggle.removeClass("active");
    $mobileMenu.removeClass("show");
  }

  // Mobile toggle click
  $mobileToggle.on("click", function (e) {
    e.stopPropagation();
    toggleMobileMenu();
  });

  // Close menu when clicking nav items
  $mobileMenu.find(".nav_item").on("click", function () {
    closeMobileMenu();
  });

  // Close menu when clicking outside
  $(document).on("click", function (e) {
    if (state.isMobileMenuOpen && !$(e.target).closest("nav").length) {
      closeMobileMenu();
    }
  });

  // ==================== Helper Functions ====================
  function getAliH4() {
    return $("#ali-text");
  }

  function getTheme(isDark) {
    return isDark ? THEMES.dark : THEMES.light;
  }

  function getPrevTheme(isDark) {
    return isDark ? THEMES.light : THEMES.dark;
  }

  function swapClass($element, oldClass, newClass) {
    return $element.removeClass(oldClass).addClass(newClass);
  }

  // ==================== Theme Management ====================
  function applyTheme(isDark) {
    const theme = getTheme(isDark);
    const prevTheme = getPrevTheme(isDark);

    // Remove previous bg class and add new one - this triggers all CSS rules
    $body.removeClass(prevTheme.bgClass).addClass(theme.bgClass);

    // Update active nav item to use correct active class
    const prevActiveClass = prevTheme.navActiveClass;
    const newActiveClass = theme.navActiveClass;

    // Find all currently active nav items and swap class
    $navItems.filter("." + prevActiveClass).each(function () {
      $(this).removeClass(prevActiveClass).addClass(newActiveClass);
    });

    // Swap hover color classes on nav items
    $navItems
      .removeClass(prevTheme.navHoverColor)
      .addClass(theme.navHoverColor);

    // Swap Ali background color
    const $aliH4 = $("#ali-text");
    if ($aliH4.length) {
      $aliH4.removeClass(prevTheme.aliH4Bg).addClass(theme.aliH4Bg);
    }

    // CSS rules handle the rest via body.bg1 / body.bg2
  }

  function handleThemeToggle(e) {
    // Determine which checkbox was clicked
    const $clickedCheckbox = $(e.target);
    const isChecked = $clickedCheckbox.is(":checked");
    state.isDarkMode = isChecked;

    // Sync both checkboxes
    $themeToggleDesktop.prop("checked", isChecked);
    $themeToggleMobile.prop("checked", isChecked);

    // Save theme to localStorage
    localStorage.setItem("theme", state.isDarkMode ? "dark" : "light");

    // Fade out
    navElement?.classList.remove("opacity-100");
    homeTextElement?.classList.remove("opacity-100");
    aliTextElement?.classList.remove("opacity-100");

    // Apply theme and fade in
    setTimeout(function () {
      applyTheme(state.isDarkMode);
      navElement?.classList.add("opacity-100");
      homeTextElement?.classList.add("opacity-100");
      aliTextElement?.classList.add("opacity-100");
    }, 350);
  }

  // ==================== Navigation Management ====================
  function getCurrentScrollPosition() {
    return $(window).scrollTop() + CONFIG.scrollOffset;
  }

  function findActiveNav() {
    const scrollPos = getCurrentScrollPosition();
    let activeNav = null;
    let closestDistance = Infinity;

    $navItems.each(function () {
      const $section = $($(this).attr("href"));

      if (!$section.length) return;

      const sectionTop = $section.offset().top;
      const sectionBottom = sectionTop + $section.outerHeight();

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        activeNav = this;
        return false;
      }

      const distance = Math.abs(scrollPos - sectionTop);
      if (distance < closestDistance) {
        closestDistance = distance;
        activeNav = this;
      }
    });

    return activeNav;
  }

  function updateActiveNav() {
    const activeNav = findActiveNav();

    if (activeNav) {
      const activeClass = state.isDarkMode
        ? THEMES.dark.navActiveClass
        : THEMES.light.navActiveClass;

      $navItems.removeClass(
        `${THEMES.light.navActiveClass} ${THEMES.dark.navActiveClass}`
      );
      $(activeNav).addClass(activeClass);
    }
  }

  // ==================== Click Navigation ====================
  function handleNavClick(e) {
    e.preventDefault();

    const href = $(this).attr("href");
    const $section = $(href);

    if (!$section.length) return;

    state.isScrolling = true;

    $("html, body").animate(
      { scrollTop: $section.offset().top - CONFIG.scrollThreshold },
      CONFIG.animationDuration,
      function () {
        state.isScrolling = false;
      }
    );

    const activeClass = state.isDarkMode
      ? THEMES.dark.navActiveClass
      : THEMES.light.navActiveClass;

    $navItems.removeClass(
      `${THEMES.light.navActiveClass} ${THEMES.dark.navActiveClass}`
    );
    $(this).addClass(activeClass);
  }

  // ==================== Event Listeners ====================
  $themeToggleDesktop.on("change", handleThemeToggle);
  $themeToggleMobile.on("change", handleThemeToggle);
  $navItems.on("click", handleNavClick);

  $(window).on("scroll", function () {
    if (!state.isScrolling) {
      updateActiveNav();
    }
  });

  // ==================== Initialization ====================
  $themeToggleDesktop.prop("checked", state.isDarkMode);
  $themeToggleMobile.prop("checked", state.isDarkMode);

  // Ensure navbar is visible on page load
  if (navElement) {
    navElement.classList.add("opacity-100");
  }

  if (state.isDarkMode) {
    applyTheme(true);
  }

  updateActiveNav();
});
