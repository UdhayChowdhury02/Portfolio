    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: "#1e40af", // Deep Blue (Primary)
              secondary: "#3b82f6", // Bright Blue (Secondary)
              light: "#eff6ff", // Light Blue (Accent/Background)
              "text-primary": "#1f2937", // Dark Gray for text
              "text-secondary": "#4b5563", // Medium Gray for text
            },
            fontFamily: {
              sans: ["Inter", "sans-serif"],
            },
            animation: {
              "slide-in-left": "slideInFromLeft 0.7s ease-out forwards",
              "slide-in-right": "slideInFromRight 0.7s ease-out forwards",
              "slide-in-bottom": "slideInFromBottom 0.7s ease-out forwards",
              "fade-in": "fadeIn 0.7s ease-out forwards",
              "scale-up": "scaleUp 0.7s ease-out forwards",
            },
            keyframes: {
              slideInFromLeft: {
                "0%": { transform: "translateX(-100px)", opacity: "0" },
                "100%": { transform: "translateX(0)", opacity: "1" },
              },
              slideInFromRight: {
                "0%": { transform: "translateX(100px)", opacity: "0" },
                "100%": { transform: "translateX(0)", opacity: "1" },
              },
              slideInFromBottom: {
                "0%": { transform: "translateY(50px)", opacity: "0" },
                "100%": { transform: "translateY(0)", opacity: "1" },
              },
              fadeIn: {
                "0%": { opacity: "0" },
                "100%": { opacity: "1" },
              },
              scaleUp: {
                "0%": { transform: "scale(0.9)", opacity: "0" },
                "100%": { transform: "scale(1)", opacity: "1" },
              },
            },
          },
        },
      };

      // Navigation functionality
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

        showPage("home");

        pageIds.forEach((pageId) => {
          const link = document.getElementById(`nav-${pageId}`);
          if (link) {
            link.addEventListener("click", function (e) {
              e.preventDefault();
              showPage(pageId);
            });
          }
        });

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

        // Initialize all carousels on the achievements page
        document
          .querySelectorAll("#achievements-page .achievement-carousel")
          .forEach((carouselElement, index) => {
            initializeCarousel(
              carouselElement,
              `achievementPageCarousel${index}`
            );
          });

        // Main achievement showcase carousel on homepage
        if (
          document.querySelectorAll(
            "#home-achievement-carousel .carousel-slide"
          ).length > 0
        ) {
          setInterval(nextHomeAchievementSlide, 5000); // Auto-play for homepage carousel
        }

        // Scroll animations
        const observerOptions = {
          root: null,
          rootMargin: "0px",
          threshold: 0.1, // Trigger when 10% of the element is visible
        };

        const observerCallback = (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              // Apply staggered delays for research interest cards
              if (entry.target.closest("#research-interests-grid")) {
                const items = Array.from(
                  entry.target.closest("#research-interests-grid").children
                );
                const index = items.indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.15}s`;
                entry.target.classList.add("animate-slide-in-bottom");
              }
              // No staggered delay for updates list items, they appear together
              else if (entry.target.classList.contains("update-item-animate")) {
                entry.target.classList.add("animate-fade-in");
              } else {
                entry.target.classList.add("animate-slide-in-bottom");
              }
              observer.unobserve(entry.target); // Animate only once
            }
          });
        };

        const scrollObserver = new IntersectionObserver(
          observerCallback,
          observerOptions
        );
        const elementsToAnimate =
          document.querySelectorAll(".animate-on-scroll");
        elementsToAnimate.forEach((el) => {
          scrollObserver.observe(el);
        });
      });

      function showPage(pageId) {
        const pages = document.querySelectorAll(".page");
        pages.forEach((page) => {
          page.classList.add("hidden");
        });

        const selectedPage = document.getElementById(`${pageId}-page`);
        if (selectedPage) {
          selectedPage.classList.remove("hidden");
          if (pageId === "home") {
            setTimeout(() => {
              const heroH1 = document.querySelector("#home-page .hero-h1");
              const heroH2 = document.querySelector("#home-page .hero-h2");
              const heroP = document.querySelector("#home-page .hero-p");
              const heroButtons = document.querySelector(
                "#home-page .hero-buttons"
              );
              const heroImg = document.querySelector("#home-page .hero-img");

              if (heroH1) {
                heroH1.classList.remove("opacity-0");
                heroH1.classList.add("animate-slide-in-left");
              }
              if (heroH2) {
                heroH2.classList.remove("opacity-0");
                heroH2.classList.add(
                  "animate-slide-in-left",
                  "animation-delay-200"
                );
              }
              if (heroP) {
                heroP.classList.remove("opacity-0");
                heroP.classList.add(
                  "animate-slide-in-bottom",
                  "animation-delay-400"
                );
              }
              if (heroButtons) {
                heroButtons.classList.remove("opacity-0");
                heroButtons.classList.add(
                  "animate-slide-in-bottom",
                  "animation-delay-600"
                );
              }
              if (heroImg) {
                heroImg.classList.remove("opacity-0");
                heroImg.classList.add(
                  "animate-scale-up",
                  "animation-delay-300"
                );
              }
            }, 100);
          }
        }

        const desktopNavLinks = document.querySelectorAll(
          "nav .hidden.md\\:flex .nav-link"
        );
        desktopNavLinks.forEach((link) => {
          link.classList.remove("text-white", "bg-primary", "font-semibold");
          link.classList.add(
            "text-gray-700",
            "hover:bg-blue-100",
            "hover:text-primary"
          );
        });
        const activeDesktopLink = document.getElementById(`nav-${pageId}`);
        if (activeDesktopLink) {
          activeDesktopLink.classList.remove(
            "text-gray-700",
            "hover:bg-blue-100",
            "hover:text-primary"
          );
          activeDesktopLink.classList.add(
            "text-white",
            "bg-primary",
            "font-semibold"
          );
        }

        const mobileNavLinks = document.querySelectorAll(
          "#mobile-menu a.nav-link-mobile"
        );
        mobileNavLinks.forEach((link) => {
          link.classList.remove("text-white", "bg-primary", "font-semibold");
          link.classList.add(
            "text-gray-700",
            "hover:bg-blue-100",
            "hover:text-primary"
          );
        });
        const activeMobileLink = document.getElementById(
          `nav-${pageId}-mobile`
        );
        if (activeMobileLink) {
          activeMobileLink.classList.remove(
            "text-gray-700",
            "hover:bg-blue-100",
            "hover:text-primary"
          );
          activeMobileLink.classList.add(
            "text-white",
            "bg-primary",
            "font-semibold"
          );
        }

        const mobileMenu = document.getElementById("mobile-menu");
        if (!mobileMenu.classList.contains("hidden")) {
          mobileMenu.classList.add("hidden");
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      function showBlogArticle(articleId) {
        document.getElementById("blog-page-content").classList.add("hidden");
        const articlePage = document.getElementById("blog-article-view");
        const articleContent = document.getElementById(
          `article-${articleId}-content`
        );

        if (articlePage && articleContent) {
          const articleDisplay = document.getElementById(
            "blog-article-display"
          );
          articleDisplay.innerHTML = "";
          const clonedContent = articleContent.cloneNode(true);
          clonedContent.classList.remove("hidden");
          articleDisplay.appendChild(clonedContent);

          articlePage.classList.remove("hidden");
          const blogPageContainer = document.getElementById("blog-page");
          if (blogPageContainer) blogPageContainer.classList.remove("hidden");

          document.getElementById("blog-index").classList.add("hidden");
          document
            .getElementById("blog-article-view")
            .classList.remove("hidden");
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      function backToBlogIndex() {
        document.getElementById("blog-article-view").classList.add("hidden");
        document.getElementById("blog-index").classList.remove("hidden");
        document.getElementById("blog-page-content").classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      // --- Carousel Functionality ---
      const carouselsState = {};

      function initializeCarousel(carouselElement, carouselId) {
        carouselsState[carouselId] = {
          currentSlide: 0,
          slides: carouselElement.querySelectorAll(".carousel-slide"),
          // intervalId: null // intervalId is not used for achievement page carousels
        };
        showCarouselSlide(carouselId, 0); // Show first slide
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
        let nextIndex = (state.currentSlide + 1) % state.slides.length;
        showCarouselSlide(carouselId, nextIndex);
      }

      function prevCarouselSlide(carouselId) {
        const state = carouselsState[carouselId];
        if (!state || state.slides.length === 0) return;
        let prevIndex =
          (state.currentSlide - 1 + state.slides.length) % state.slides.length;
        showCarouselSlide(carouselId, prevIndex);
      }

      // Specific for home page achievement carousel (auto-play)
      let homeCurrentSlide = 0;
      function nextHomeAchievementSlide() {
        const slides = document.querySelectorAll(
          "#home-achievement-carousel .carousel-slide"
        );
        if (slides.length === 0) return;
        slides[homeCurrentSlide].classList.add("hidden", "opacity-0");
        slides[homeCurrentSlide].classList.remove("opacity-100");

        homeCurrentSlide = (homeCurrentSlide + 1) % slides.length;

        slides[homeCurrentSlide].classList.remove("hidden", "opacity-0");
        void slides[homeCurrentSlide].offsetWidth;
        slides[homeCurrentSlide].classList.add("opacity-100");
      }

      function prevHomeAchievementSlide() {
        const slides = document.querySelectorAll(
          "#home-achievement-carousel .carousel-slide"
        );
        if (slides.length === 0) return;
        slides[homeCurrentSlide].classList.add("hidden", "opacity-0");
        slides[homeCurrentSlide].classList.remove("opacity-100");

        homeCurrentSlide =
          (homeCurrentSlide - 1 + slides.length) % slides.length;

        slides[homeCurrentSlide].classList.remove("hidden", "opacity-0");
        void slides[homeCurrentSlide].offsetWidth;
        slides[homeCurrentSlide].classList.add("opacity-100");
      }

      // Mock PDF Download
      function downloadMockPdf() {
        const pdfBase64 =
          "JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKP7/VWRoYXkgQ2hvd2RodXJ5IC0gQ1YpCi9DcmVhdG9yICj+/lBhbmRvYyBQREYgV3JpdGVyKQovUHJvZHVjZXIgKP7/UGFuZG9jKQovQ3JlYXRpb25EYXRlIChEOjIwMjUwNTIxMDgyOTA4WikKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQovRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZwo+PgplbmRvYmoKNSAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EtQm9sZAovRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZwo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZXMKLS0gQ29udGludWVkIGJlbG93IC0tCgpDb3VudHMgMQovS2lkcyBbIDYgMCBSIF0KPj4KZW5kb2JqCjYgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAzIDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgovRjIgNSAwIFIKPj4KL1Byb2NTZXQgWyAvUERGIC9UZXh0IF0KPj4KL01lZGlhQm94IFsgMCAwIDU5NSA4NDIgXQovQ29udGVudHMgNyAwIFIKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL0xlbmd0aCAxNzUKPj4Kc3RyZWFtCkJUCjM2IDgwMCBUZAovRjIgMTggVGYKKFVkaGF5IENob3dkaHVyeSAtIENWKSBUagpFVApCVAovRjEgMTIgVGYKNjAgNzUwIFRkCihTaW1wbGUgTW9jayBQREYgZm9yIGRvd25sb2FkIHRlc3RpbmcuKSBUagowIC0xNSBUTApKVGhpcyBQREYgY29udGFpbnMgYmFzaWMgaW5mb3JtYXRpb24uKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA4CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDk4IDAwMDAwIG4gCjAwMDAwMDAzNzIgMDAwMDAgbiAKMDAwMDAwMDE1MiAwMDAwMCBuIAowMDAwMDAwMjYxIDAwMDAwIG4gCjAwMDAwMDA0NDAgMDAwMDAgbiAKMDAwMDAwMDU4MSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDgKL1Jvb3QgMiAwIFIKL0luZm8gMSAwIFIKL0lEIFsgPGU4YjQ5YjgzYjU5YzRkNzgzYTNlM2MzYjI0MzQ4NzMyPiA8ZThiNDliODNiNTljNGQ3ODNhM2UzYzNiMjQzNDg3MzIgPiBdCj4+CnN0YXJ0eHJlZgo3NTkKJSVFT0YK"; // Simple PDF base64
        const byteCharacters = atob(pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "CV-Udhay_Chowdhury.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }
    </script>