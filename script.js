/* =========================================================
   POWER PLUS GYM
   JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     MOBILE MENU
  ======================================================== */

  const menuToggle = document.querySelector(".menu-toggle");

  const mainMenu = document.querySelector(".navbar-content");

  const navLinks = document.querySelectorAll(".nav-link");

  function closeMenu() {
    if (!menuToggle || !mainMenu) {
      return;
    }

    menuToggle.classList.remove("active");

    mainMenu.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");

    document.body.classList.remove("menu-open");
  }

  if (menuToggle && mainMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainMenu.classList.toggle("open");

      menuToggle.classList.toggle("active", isOpen);

      menuToggle.setAttribute("aria-expanded", String(isOpen));

      document.body.classList.toggle("menu-open", isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });
  }

  /* =======================================================
     CLOSE MENU WITH ESC
  ======================================================== */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  /* =======================================================
     COUNTER ANIMATION
  ======================================================== */

  const counters = document.querySelectorAll(".counter");

  function animateCounter(counter) {
    const target = Number(counter.dataset.target);

    const suffix = counter.dataset.suffix || "";

    const duration = 1400;

    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;

      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(eased * target);

      counter.textContent = currentValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + suffix;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = "true";

            animateCounter(entry.target);

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5,
      },
    );

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  }

  /* =======================================================
     SCROLL REVEAL
  ======================================================== */

  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /* =======================================================
     GALLERY LIGHTBOX
  ======================================================== */

  const galleryCards = document.querySelectorAll(".gallery-card");

  const lightbox = document.querySelector("#lightbox");

  const lightboxImage = document.querySelector("#lightboxImage");

  const lightboxTitle = document.querySelector("#lightboxTitle");

  const lightboxClose = document.querySelector(".lightbox-close");

  const lightboxPrev = document.querySelector(".lightbox-prev");

  const lightboxNext = document.querySelector(".lightbox-next");

  let currentGalleryIndex = 0;

  function openLightbox(index) {
    if (!galleryCards.length || !lightbox) {
      return;
    }

    currentGalleryIndex = index;

    const card = galleryCards[currentGalleryIndex];

    const image = card.dataset.image;

    const title = card.dataset.title;

    lightboxImage.src = image;

    lightboxImage.alt = title;

    lightboxTitle.textContent = title;

    lightbox.classList.add("show");

    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    if (!lightbox) {
      return;
    }

    lightbox.classList.remove("show");

    lightbox.setAttribute("aria-hidden", "true");

    document.body.classList.remove("lightbox-open");
  }

  function showNextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryCards.length;

    openLightbox(currentGalleryIndex);
  }

  function showPreviousImage() {
    currentGalleryIndex =
      (currentGalleryIndex - 1 + galleryCards.length) % galleryCards.length;

    openLightbox(currentGalleryIndex);
  }

  galleryCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      openLightbox(index);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", showNextImage);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", showPreviousImage);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (!lightbox || !lightbox.classList.contains("show")) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowRight") {
      showPreviousImage();
    }

    if (event.key === "ArrowLeft") {
      showNextImage();
    }
  });

  /* =======================================================
     CONSULTATION FORM
  ======================================================== */

  const consultationForm = document.querySelector("#consultationForm");

  const formSuccess = document.querySelector("#formSuccess");

  if (consultationForm) {
    consultationForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.querySelector("#name");

      const phone = document.querySelector("#phone");

      const goal = document.querySelector("#goal");

      let isValid = true;

      /* NAME */

      if (!name.value.trim() || name.value.trim().length < 2) {
        setError(name, "لطفاً نام و نام خانوادگی را وارد کنید.");

        isValid = false;
      } else {
        clearError(name);
      }

      /* PHONE */

      const normalizedPhone = normalizePhone(phone.value);

      const phoneRegex = /^(?:98|0)?9\d{9}$/;

      if (!phoneRegex.test(normalizedPhone)) {
        setError(phone, "لطفاً یک شماره تماس معتبر وارد کنید.");

        isValid = false;
      } else {
        clearError(phone);
      }

      /* GOAL */

      if (!goal.value) {
        setError(goal, "لطفاً هدف تمرینی خود را انتخاب کنید.");

        isValid = false;
      } else {
        clearError(goal);
      }

      /* SUCCESS */

      if (isValid) {
        consultationForm.reset();

        formSuccess.classList.add("show");

        setTimeout(() => {
          formSuccess.classList.remove("show");
        }, 7000);
      }
    });
  }

  function setError(element, message) {
    const group = element.closest(".form-group");

    const error = group.querySelector(".form-error");

    group.classList.add("has-error");

    error.textContent = message;
  }

  function clearError(element) {
    const group = element.closest(".form-group");

    const error = group.querySelector(".form-error");

    group.classList.remove("has-error");

    error.textContent = "";
  }

  function normalizePhone(value) {
    return value
      .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
      .replace(/[\s\-()]/g, "")
      .replace(/^\+98/, "98");
  }

  /* =======================================================
     ACTIVE NAVIGATION
  ======================================================== */

  const sections = document.querySelectorAll("main section[id]");

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.id;

            navLinks.forEach((link) => {
              const href = link.getAttribute("href");

              link.classList.toggle("active", href === `#${currentId}`);
            });
          }
        });
      },
      {
        rootMargin: "-30% 0px -60% 0px",
      },
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* =======================================================
     CLOSE MOBILE MENU WHEN RESIZING
  ======================================================== */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 767) {
      closeMenu();
    }
  });
});
