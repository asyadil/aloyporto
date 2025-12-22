// ==================== Page Initialization ====================
window.onload = function () {
  const body = document.querySelector("body");
  body.classList.remove("opacity-0");
  body.classList.add("opacity-100");

  // Get saved theme
  const savedTheme = localStorage.getItem("theme");
  const bgClass = savedTheme === "dark" ? "bg2" : "bg1";

  // Apply bg class SEKARANG supaya body punya background-color yang benar saat loading
  body.classList.add(bgClass);

  // Tapi remove background-image supaya cuma solid color yang terlihat saat loading
  body.style.backgroundImage = "none";

  setTimeout(function () {
    document.querySelector(".loader").style.display = "none";
    document.querySelector("main").style.display = "block";

    // Restore background-image setelah loader hilang
    body.style.backgroundImage = "";

    // Animate navbar and home text fade in (700ms)
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
      navBg: "bg-[#21E6C1]",
      navShadow: "shadow-cyan-50/20",
      navActiveClass: "active",
      navHoverColor: "hover:text-[#071E3D]",
      aliH4Bg: "bg-[#21E6C1]",
    },
    dark: {
      bgClass: "bg2",
      navBg: "bg-[#ffc800]",
      navShadow: "shadow-black-50/20",
      navActiveClass: "active2",
      navHoverColor: "hover:text-[#1f0701]",
      aliH4Bg: "bg-[#ffc800]",
    },
  };

  // ==================== State Management ====================
  const state = {
    isScrolling: false,
    isDarkMode: localStorage.getItem("theme") === "dark" ? true : false,
  };

  // ==================== DOM Caching ====================
  const $navItems = $(".nav_item");
  const $themeToggle = $(".peer");
  const $body = $("body");
  const $nav = $("nav");
  const navElement = document.querySelector("nav");
  const homeTextElement = document.querySelector("#home-text");
  const aliTextElement = document.querySelector("#ali-text");

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

    swapClass($body, prevTheme.bgClass, theme.bgClass);
    swapClass($nav, prevTheme.navBg, theme.navBg);
    swapClass($nav, prevTheme.navShadow, theme.navShadow);

    const $currentActive = $navItems.filter("." + prevTheme.navActiveClass);
    if ($currentActive.length) {
      swapClass($currentActive, prevTheme.navActiveClass, theme.navActiveClass);
    }

    swapClass($navItems, prevTheme.navHoverColor, theme.navHoverColor);

    const $aliH4 = getAliH4();
    swapClass($aliH4, prevTheme.aliH4Bg, theme.aliH4Bg);
  }

  function handleThemeToggle() {
    state.isDarkMode = $themeToggle.is(":checked");

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

      // Exact match within section
      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        activeNav = this;
        return false; // Break loop
      }

      // Track closest section as fallback
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

    // Update active state
    const activeClass = state.isDarkMode
      ? THEMES.dark.navActiveClass
      : THEMES.light.navActiveClass;

    $navItems.removeClass(
      `${THEMES.light.navActiveClass} ${THEMES.dark.navActiveClass}`
    );
    $(this).addClass(activeClass);
  }

  // ==================== Event Listeners ====================
  $themeToggle.on("change", handleThemeToggle);
  $navItems.on("click", handleNavClick);

  $(window).on("scroll", function () {
    if (!state.isScrolling) {
      updateActiveNav();
    }
  });

  // ==================== Initialization ====================
  // Sync checkbox with saved theme state
  $themeToggle.prop("checked", state.isDarkMode);

  // Apply theme colors (nav, text) based on saved state
  if (state.isDarkMode) {
    applyTheme(true);
  }

  updateActiveNav();
});
