
document.addEventListener("DOMContentLoaded", () => {

    // LOADING SCREEN
    const loader = document.getElementById("ntLoader");

    window.addEventListener("load", () => {
        setTimeout(() => loader?.classList.add("loaded"), 450);
    });

    // HEADER SCROLL EFFECT
    const header = document.getElementById("ntHeader");

    function updateHeader() {
        if (!header) return;
        header.classList.toggle("scrolled", window.scrollY > 40);
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    // HERO SLIDER
    const hero = document.getElementById("homeHero");

    if (hero) {
        const slides = [...hero.querySelectorAll(".nt-hero-slide")];
        const progress = document.getElementById("ntHeroProgress");
        const currentNumber = document.getElementById("ntCurrentSlide");
        const previous = document.getElementById("ntHeroPrev");
        const next = document.getElementById("ntHeroNext");

        let current = 0;
        let timer = null;
        const duration = 6500;
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        function stopTimer() {
            clearTimeout(timer);
            timer = null;
        }

        function startProgress() {
            if (!progress) return;

            progress.classList.remove("playing");
            void progress.offsetWidth;

            if (!reducedMotion && !document.hidden) {
                progress.classList.add("playing");
            }
        }

        function scheduleNext() {
            stopTimer();

            if (reducedMotion || document.hidden || slides.length < 2) {
                return;
            }

            timer = setTimeout(() => showSlide(current + 1), duration);
        }

        function showSlide(index) {
            current = (index + slides.length) % slides.length;

            slides.forEach((slide, i) => {
                const active = i === current;
                slide.classList.toggle("active", active);
                slide.setAttribute("aria-hidden", String(!active));
            });

            if (currentNumber) {
                currentNumber.textContent =
                    String(current + 1).padStart(2, "0");
            }

            startProgress();
            scheduleNext();
        }

        previous?.addEventListener("click", () => showSlide(current - 1));
        next?.addEventListener("click", () => showSlide(current + 1));

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopTimer();
                progress?.classList.remove("playing");
            } else {
                startProgress();
                scheduleNext();
            }
        });

        // MOBILE SWIPE
        let touchStart = 0;

        hero.addEventListener("touchstart", event => {
            touchStart = event.changedTouches[0].screenX;
        }, { passive: true });

        hero.addEventListener("touchend", event => {
            const distance = event.changedTouches[0].screenX - touchStart;

            if (Math.abs(distance) > 60) {
                showSlide(distance < 0 ? current + 1 : current - 1);
            }
        }, { passive: true });

        showSlide(0);
    }

    // MOBILE NAVIGATION
    const menuButton = document.getElementById("ntMenuToggle");
    const nav = document.getElementById("ntNav");

    function closeMenu() {
        menuButton?.classList.remove("open");
        nav?.classList.remove("open");
        menuButton?.setAttribute("aria-expanded", "false");
        menuButton?.setAttribute("aria-label", "Open navigation");
    }

    menuButton?.addEventListener("click", () => {
        const isOpen = nav?.classList.toggle("open");

        menuButton.classList.toggle("open", Boolean(isOpen));
        menuButton.setAttribute("aria-expanded", String(Boolean(isOpen)));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
    });

    nav?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1050) closeMenu();
    });

});

// SCROLL REVEAL ANIMATIONS
const revealElements = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("nt-revealed");
                observer.unobserve(entry.target);
            }

        });

    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

} else {

    revealElements.forEach(element => {
        element.classList.add("nt-revealed");
    });

}

// =========================================
// PRODUCT CATEGORY INTERACTIVE SHOWCASE
// =========================================

const categoryButtons = document.querySelectorAll(".product-category");

const showcaseImage = document.getElementById("productShowcaseImage");
const showcasePanel = document.getElementById("productFeatureImage");
const showcaseName = document.getElementById("productFeatureName");
const showcaseDescription = document.getElementById("productFeatureDescription");
const showcaseNumber = document.getElementById("productFeatureNumber");
const showcaseItems = document.getElementById("productFeatureItems");

let categoryChangeTimer;

function changeProductCategory(button) {

    if (!button || !showcaseImage) return;

    categoryButtons.forEach(item => {
        item.classList.toggle("active", item === button);
        item.setAttribute(
            "aria-pressed",
            String(item === button)
        );
    });

    const name = button.dataset.name;
    const number = button.dataset.number;
    const image = button.dataset.image;
    const description = button.dataset.description;
    const items = (button.dataset.items || "").split("|").filter(Boolean);

    showcasePanel.classList.add("changing");

    clearTimeout(categoryChangeTimer);

    categoryChangeTimer = setTimeout(() => {

        showcaseImage.src = image;
        showcaseImage.alt = name + " products and materials";

        showcaseName.textContent = name;
        showcaseDescription.textContent = description;
        showcaseNumber.textContent = number + " / 11";

        showcaseItems.replaceChildren();

        items.forEach(item => {
            const tag = document.createElement("span");
            tag.textContent = item;
            showcaseItems.appendChild(tag);
        });

        showcasePanel.classList.remove("changing");

    }, 220);
}

categoryButtons.forEach(button => {

    button.setAttribute(
        "aria-pressed",
        String(button.classList.contains("active"))
    );

    button.addEventListener("click", () => {
        changeProductCategory(button);
    });

});
// footerr

const copyrightYear = document.getElementById("ntCopyrightYear");

if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
}


