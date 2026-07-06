/** Scroll reveal for Solutions page */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
);

document.querySelectorAll(".solutions-reveal").forEach((el) => revealObserver.observe(el));
