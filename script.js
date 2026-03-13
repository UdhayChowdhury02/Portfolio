/* =============================================
   script.js — Udhay Chowdhury Portfolio
   All fixes applied:
     • Unified carousel system (no duplicate home carousel logic)
     • URL routing via History API (browser back/forward works)
     • downloadCV() replaces downloadMockPdf()
     • Contact form handler moved here from inline script
   ============================================= */

/* =============================================
   UNIFIED CAROUSEL SYSTEM
   ============================================= */
const carouselsState = {};

function initializeCarousel(carouselElement, carouselId) {
  carouselsState[carouselId] = {
    currentSlide: 0,
    slides: carouselElement.querySelectorAll(".carousel-slide"),
  };
  showCarouselSlide(carouselId, 0);
}

function showCarouselSlide(carouselId, slideIndex) {
  const state = carouselsState[carouselId];
  if (!state) return;
  state.slides.forEach((slide, index) => {
    if (index === slideIndex) {
      slide.classList.remove("hidden", "opacity-0");
      slide.classList.add("opacity-100");
    } else {
      slide.classList.add("hidden", "opacity-0");
      slide.classList.remove("opacity-100");
    }
  });
  state.currentSlide = slideIndex;
}

function nextCarouselSlide(carouselId) {
  const state = carouselsState[carouselId];
  if (!state || state.slides.length === 0) return;
  const nextIndex = (state.currentSlide + 1) % state.slides.length;
  showCarouselSlide(carouselId, nextIndex);
}

function prevCarouselSlide(carouselId) {
  const state = carouselsState[carouselId];
  if (!state || state.slides.length === 0) return;
  const prevIndex =
    (state.currentSlide - 1 + state.slides.length) % state.slides.length;
  showCarouselSlide(carouselId, prevIndex);
}

/* =============================================
   NAVIGATION — with History API routing
   ============================================= */
function showPage(pageId) {
  const pages = document.querySelectorAll(".page");
  const cvIframe = document.getElementById("cvIframe");

  pages.forEach((page) => {
    if (
      page.id === "cv-page" &&
      cvIframe &&
      !page.classList.contains("hidden")
    ) {
      cvIframe.src = "about:blank";
    }
    page.classList.add("hidden");
  });

  const selectedPage = document.getElementById(`${pageId}-page`);
  if (selectedPage) {
    selectedPage.classList.remove("hidden");

    /* Lazy-load the CV iframe only when the CV page is shown */
    if (pageId === "cv" && cvIframe) {
      cvIframe.src = cvIframe.getAttribute("data-src");
    }

    /* Hero entry animations */
    if (pageId === "home") {
      setTimeout(() => {
        const heroH1 = document.querySelector("#home-page .hero-h1");
        const heroH2 = document.querySelector("#home-page .hero-h2");
        const heroP = document.querySelector("#home-page .hero-p");
        const heroButtons = document.querySelector("#home-page .hero-buttons");
        const heroImg = document.querySelector("#home-page .hero-img");

        if (heroH1) {
          heroH1.classList.remove("opacity-0");
          heroH1.classList.add("animate-slide-in-left");
        }
        if (heroH2) {
          heroH2.classList.remove("opacity-0");
          heroH2.classList.add("animate-slide-in-left", "animation-delay-200");
        }
        if (heroP) {
          heroP.classList.remove("opacity-0");
          heroP.classList.add("animate-slide-in-bottom", "animation-delay-400");
        }
        if (heroButtons) {
          heroButtons.classList.remove("opacity-0");
          heroButtons.classList.add(
            "animate-slide-in-bottom",
            "animation-delay-600",
          );
        }
        if (heroImg) {
          heroImg.classList.remove("opacity-0");
          heroImg.classList.add("animate-scale-up", "animation-delay-300");
        }
      }, 100);
    }
  }

  /* ---- Active desktop nav link ---- */
  const desktopNavLinks = document.querySelectorAll(
    "nav .hidden.md\\:flex .nav-link",
  );
  desktopNavLinks.forEach((link) => {
    link.classList.remove("text-white", "bg-primary", "font-semibold");
    link.classList.add(
      "text-gray-700",
      "hover:bg-blue-100",
      "hover:text-primary",
    );
  });

  let mainPageIdForNav = pageId;
  if (pageId === "humanitarian-work") mainPageIdForNav = "experience";

  const activeDesktopLink = document.getElementById(`nav-${mainPageIdForNav}`);
  if (activeDesktopLink) {
    activeDesktopLink.classList.remove(
      "text-gray-700",
      "hover:bg-blue-100",
      "hover:text-primary",
    );
    activeDesktopLink.classList.add(
      "text-white",
      "bg-primary",
      "font-semibold",
    );
  }
  if (pageId === "humanitarian-work") {
    const activeSubLink = document.getElementById("nav-humanitarian-work-sub");
    if (activeSubLink)
      activeSubLink.classList.add("text-primary", "font-semibold");
  }

  /* ---- Active mobile nav link ---- */
  const mobileNavLinks = document.querySelectorAll(
    "#mobile-menu a.nav-link-mobile",
  );
  mobileNavLinks.forEach((link) => {
    link.classList.remove("text-white", "bg-primary", "font-semibold");
    link.classList.add(
      "text-gray-700",
      "hover:bg-blue-100",
      "hover:text-primary",
    );
  });

  const activeMobileLink = document.getElementById(`nav-${pageId}-mobile`);
  if (activeMobileLink) {
    activeMobileLink.classList.remove(
      "text-gray-700",
      "hover:bg-blue-100",
      "hover:text-primary",
    );
    activeMobileLink.classList.add("text-white", "bg-primary", "font-semibold");
  } else if (pageId === "humanitarian-work") {
    const humanitarianMobileLink = document.getElementById(
      "nav-humanitarian-work-mobile",
    );
    if (humanitarianMobileLink) {
      humanitarianMobileLink.classList.remove(
        "text-gray-700",
        "hover:bg-blue-100",
        "hover:text-primary",
      );
      humanitarianMobileLink.classList.add(
        "text-white",
        "bg-primary",
        "font-semibold",
      );
    }
  }

  /* Close mobile menu if open */
  const mobileMenu = document.getElementById("mobile-menu");
  if (!mobileMenu.classList.contains("hidden")) {
    mobileMenu.classList.add("hidden");
  }

  /* Push state to browser history so back/forward buttons work */
  if (window.history.state?.page !== pageId) {
    window.history.pushState({ page: pageId }, "", `#${pageId}`);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =============================================
   BLOG ARTICLE VIEW
   ============================================= */
function showBlogArticle(articleId) {
  document.getElementById("blog-page-content").classList.add("hidden");
  const articlePage = document.getElementById("blog-article-view");
  const articleContent = document.getElementById(
    `article-${articleId}-content`,
  );

  if (articlePage && articleContent) {
    const articleDisplay = document.getElementById("blog-article-display");
    articleDisplay.innerHTML = "";
    const clonedContent = articleContent.cloneNode(true);
    clonedContent.classList.remove("hidden");
    articleDisplay.appendChild(clonedContent);

    articlePage.classList.remove("hidden");
    const blogPageContainer = document.getElementById("blog-page");
    if (blogPageContainer) blogPageContainer.classList.remove("hidden");

    document.getElementById("blog-index").classList.add("hidden");
    document.getElementById("blog-article-view").classList.remove("hidden");
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function backToBlogIndex() {
  document.getElementById("blog-article-view").classList.add("hidden");
  document.getElementById("blog-index").classList.remove("hidden");
  document.getElementById("blog-page-content").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =============================================
   CV DOWNLOAD
   Renamed from downloadMockPdf; link.download added
   ============================================= */
function downloadCV(type = "research") {
  const files = {
    research: {
      href: "resume_research.pdf",
      name: "Udhay_Chowdhury_Research_CV.pdf",
    },
    professional: {
      href: "resume_professional.pdf",
      name: "Udhay_Chowdhury_Professional_CV.pdf",
    },
  };
  const link = document.createElement("a");
  link.href = files[type].href;
  link.download = files[type].name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* =============================================
   DOM READY
   ============================================= */
document.addEventListener("DOMContentLoaded", function () {
  const pageIds = [
    "home",
    "education",
    "skills",
    "publications",
    "experience",
    "achievements",
    "cv",
    "contact",
    "blog",
  ];

  /* Read initial page from URL hash, default to home */
  const initialPage = window.location.hash.replace("#", "") || "home";
  const validPage = pageIds.includes(initialPage) ? initialPage : "home";
  window.history.replaceState(
    { page: validPage },
    "",
    validPage === "home" ? window.location.pathname : `#${validPage}`,
  );
  showPage(validPage);

  /* Desktop nav click handlers */
  pageIds.forEach((pageId) => {
    const link = document.getElementById(`nav-${pageId}`);
    if (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        showPage(pageId);
      });
    }
  });

  /* Blog article click delegation */
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("blog-article-link")) {
      e.preventDefault();
      const articleId = e.target.getAttribute("data-article-id");
      showBlogArticle(articleId);
    }
    if (
      e.target.id === "back-to-blog-index" ||
      (e.target.parentElement &&
        e.target.parentElement.id === "back-to-blog-index")
    ) {
      e.preventDefault();
      backToBlogIndex();
    }
  });

  /* Initialize achievement page carousels */
  document
    .querySelectorAll("#achievements-page .achievement-carousel")
    .forEach((carouselElement, index) => {
      initializeCarousel(carouselElement, `achievementPageCarousel${index}`);
    });

  /* Initialize home achievement carousel (uses unified system) */
  const homeCarouselEl = document.getElementById("home-achievement-carousel");
  if (homeCarouselEl) {
    initializeCarousel(homeCarouselEl, "homeMainCarousel");
    setInterval(() => nextCarouselSlide("homeMainCarousel"), 5000);
  }

  /* Scroll-triggered animations via IntersectionObserver */
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");

        if (entry.target.closest("#research-interests-grid")) {
          const items = Array.from(
            entry.target.closest("#research-interests-grid").children,
          );
          const index = items.indexOf(entry.target);
          entry.target.style.animationDelay = `${index * 0.15}s`;
          entry.target.classList.add("animate-slide-in-bottom");
        } else if (entry.target.classList.contains("update-item-animate")) {
          entry.target.classList.add("animate-fade-in");
        } else {
          entry.target.classList.add("animate-slide-in-bottom");
        }
        observer.unobserve(entry.target);
      }
    });
  };

  const scrollObserver = new IntersectionObserver(
    observerCallback,
    observerOptions,
  );
  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    scrollObserver.observe(el);
  });

  /* Contact form submission */
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const form = e.target;
      const data = new FormData(form);
      const feedbackDiv = document.getElementById("form-feedback");

      fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: "application/json" },
      })
        .then((response) => {
          if (response.ok) {
            feedbackDiv.textContent =
              "Thank you for your message! I will get back to you soon.";
            feedbackDiv.className =
              "mt-4 text-center text-green-600 font-medium";
            form.reset();
          } else {
            response.json().then((data) => {
              if (Object.hasOwn(data, "errors")) {
                feedbackDiv.textContent = data["errors"]
                  .map((error) => error["message"])
                  .join(", ");
              } else {
                feedbackDiv.textContent =
                  "Oops! There was a problem submitting your form. Please try again.";
              }
              feedbackDiv.className =
                "mt-4 text-center text-red-600 font-medium";
            });
          }
        })
        .catch(() => {
          feedbackDiv.textContent =
            "Oops! There was a problem submitting your form. Please check your internet connection and try again.";
          feedbackDiv.className = "mt-4 text-center text-red-600 font-medium";
        });

      setTimeout(() => {
        feedbackDiv.textContent = "";
      }, 7000);
    });
  }
});

/* =============================================
   HISTORY API — browser back/forward support
   ============================================= */
window.addEventListener("popstate", function (e) {
  const pageId = e.state?.page || "home";
  showPage(pageId);
});

/* =============================================
   CV TAB SWITCHER
   ============================================= */
function switchCVTab(tab) {
  const researchPanel = document.getElementById("cv-panel-research");
  const professionalPanel = document.getElementById("cv-panel-professional");
  const researchTab = document.getElementById("tab-research");
  const professionalTab = document.getElementById("tab-professional");
  const researchIframe = document.getElementById("cvIframe");
  const professionalIframe = document.getElementById("cvIframeProfessional");

  if (tab === "research") {
    researchPanel.classList.remove("hidden");
    professionalPanel.classList.add("hidden");
    researchTab.classList.add("bg-primary", "text-white");
    researchTab.classList.remove(
      "bg-white",
      "text-primary",
      "hover:bg-blue-50",
    );
    professionalTab.classList.remove("bg-gray-700", "text-white");
    professionalTab.classList.add(
      "bg-white",
      "text-primary",
      "hover:bg-blue-50",
    );
    // Lazy-load research iframe
    if (researchIframe.src === "about:blank") {
      researchIframe.src = researchIframe.getAttribute("data-src");
    }
    // Unload professional iframe to save memory
    professionalIframe.src = "about:blank";
  } else {
    professionalPanel.classList.remove("hidden");
    researchPanel.classList.add("hidden");
    professionalTab.classList.add("bg-gray-700", "text-white");
    professionalTab.classList.remove(
      "bg-white",
      "text-primary",
      "hover:bg-blue-50",
    );
    researchTab.classList.remove("bg-primary", "text-white");
    researchTab.classList.add("bg-white", "text-primary", "hover:bg-blue-50");
    // Lazy-load professional iframe
    if (professionalIframe.src === "about:blank") {
      professionalIframe.src = professionalIframe.getAttribute("data-src");
    }
    // Unload research iframe to save memory
    researchIframe.src = "about:blank";
  }
}
