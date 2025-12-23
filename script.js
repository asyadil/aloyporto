// ==================== Page Initialization ====================
function initializePage() {
  const body = document.querySelector("body");
  const mainElement = document.querySelector("main");
  const loaderElement = document.querySelector(".loader");
  const navElement = document.querySelector("nav");

  body.classList.remove("opacity-0");
  body.classList.add("opacity-100");

  const savedTheme = localStorage.getItem("theme");
  const bgClass = savedTheme === "dark" ? "bg2" : "bg1";

  if (!body.classList.contains(bgClass)) {
    const otherBgClass = bgClass === "bg1" ? "bg2" : "bg1";
    body.classList.remove(otherBgClass);
    body.classList.add(bgClass);
  }

  body.style.backgroundImage = "none";

  if (loaderElement) {
    loaderElement.style.display = "none";
  }
  if (mainElement) {
    mainElement.style.display = "block";
  }

  body.style.backgroundImage = "";

  setTimeout(function () {
    if (navElement) {
      navElement.classList.remove("opacity-0");
      navElement.classList.add("opacity-100");
    }

    const homeText = document.querySelector("#home-text");
    const aliText = document.querySelector("#ali-text");

    if (homeText) {
      homeText.classList.remove("opacity-0");
      homeText.classList.add("opacity-100");
    }
    if (aliText) {
      aliText.classList.remove("opacity-0");
      aliText.classList.add("opacity-100");
    }
  }, 100);
}

window.addEventListener("load", initializePage);
window.addEventListener("pageshow", initializePage);
document.addEventListener("DOMContentLoaded", initializePage);

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
      aliH4Bg: "bg-[#21E6C1]",
    },
    dark: {
      bgClass: "bg2",
      navActiveClass: "active2",
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

  // ==================== Immediate Visibility Fix ====================
  if (navElement) {
    navElement.classList.remove("opacity-0");
    navElement.classList.add("opacity-100");
  }
  if (homeTextElement) {
    homeTextElement.classList.remove("opacity-0");
    homeTextElement.classList.add("opacity-100");
  }
  if (aliTextElement) {
    aliTextElement.classList.remove("opacity-0");
    aliTextElement.classList.add("opacity-100");
  }

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

  $mobileToggle.on("click", function (e) {
    e.stopPropagation();
    toggleMobileMenu();
  });

  $mobileMenu.find(".nav_item").on("click", function () {
    closeMobileMenu();
  });

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

    $body.removeClass(prevTheme.bgClass).addClass(theme.bgClass);

    const currentlyActive = $navItems.filter("." + prevTheme.navActiveClass);
    if (currentlyActive.length > 0) {
      currentlyActive
        .removeClass(prevTheme.navActiveClass)
        .addClass(theme.navActiveClass);
    }

    const $aliH4 = $("#ali-text");
    if ($aliH4.length) {
      $aliH4.removeClass(prevTheme.aliH4Bg).addClass(theme.aliH4Bg);
    }
  }

  function handleThemeToggle(e) {
    const $clickedCheckbox = $(e.target);
    const isChecked = $clickedCheckbox.is(":checked");
    state.isDarkMode = isChecked;

    $themeToggleDesktop.prop("checked", isChecked);
    $themeToggleMobile.prop("checked", isChecked);

    localStorage.setItem("theme", state.isDarkMode ? "dark" : "light");

    navElement?.classList.remove("opacity-100");
    homeTextElement?.classList.remove("opacity-100");
    aliTextElement?.classList.remove("opacity-100");

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

  $navItems.on("click", function (e) {
    const href = $(this).attr("href");
    if (href && href.startsWith("#")) {
      handleNavClick.call(this, e);
    }
  });

  $(window).on("scroll", function () {
    if (!state.isScrolling) {
      updateActiveNav();
    }
  });

  // ==================== Initialization ====================
  $themeToggleDesktop.prop("checked", state.isDarkMode);
  $themeToggleMobile.prop("checked", state.isDarkMode);

  applyTheme(state.isDarkMode);
  updateActiveNav();

  // ==================== Formspree Form Handling ====================
  const contactForm = document.getElementById('myForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitButton = contactForm.querySelector('.contact-btn');
      const originalText = submitButton.textContent;
      
      // Disable button dan ubah text
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      submitButton.classList.add('submitting');
      
      const formData = new FormData(contactForm);
      
      fetch('https://formspree.io/f/xjgbjkkz', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          // Success
          submitButton.textContent = 'Message Sent! ✓';
          submitButton.classList.remove('submitting');
          submitButton.classList.add('success');
          contactForm.reset();
          
          setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.classList.remove('success');
            submitButton.disabled = false;
          }, 3000);
        } else {
          response.json().then(data => {
            submitButton.textContent = 'Error! Please try again';
            submitButton.classList.remove('submitting');
            submitButton.classList.add('error');
            
            setTimeout(() => {
              submitButton.textContent = originalText;
              submitButton.classList.remove('error');
              submitButton.disabled = false;
            }, 3000);
          });
        }
      })
      .catch(error => {
        submitButton.textContent = 'Network Error! Try again';
        submitButton.classList.remove('submitting');
        submitButton.classList.add('error');
        
        setTimeout(() => {
          submitButton.textContent = originalText;
          submitButton.classList.remove('error');
          submitButton.disabled = false;
        }, 3000);
      });
    });
  }
});
