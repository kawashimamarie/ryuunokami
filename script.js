const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const loader = document.querySelector(".loader");

const hideLoader = () => loader?.classList.add("is-hidden");
window.addEventListener("load", hideLoader);
setTimeout(hideLoader, 1800);

const setHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};
setHeader();
window.addEventListener("scroll", setHeader, { passive: true });

navToggle?.addEventListener("click", () => {
  const open = nav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(Boolean(open)));
});

document.querySelectorAll("[data-nav] a").forEach((link) => {
  link.addEventListener("click", () => {
    nav?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealItems = document.querySelectorAll(".reveal");
if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const countUp = (element) => {
  const target = Number(element.dataset.count || 0);
  const duration = 1100;
  const startTime = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const counters = document.querySelectorAll("[data-count]");
if (reduceMotion) {
  counters.forEach((counter) => { counter.textContent = counter.dataset.count; });
} else {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach((counter) => counterObserver.observe(counter));
}

const heroVideo = document.querySelector(".hero__video");
if (heroVideo) {
  const heroSource = heroVideo.querySelector("source");
  const hideHeroVideo = () => {
    heroVideo.hidden = true;
  };
  if (!heroSource) hideHeroVideo();
  heroSource?.addEventListener("error", hideHeroVideo, { once: true });
  heroVideo.addEventListener("error", hideHeroVideo, { once: true });
}

