/** FAQ accordion + scroll reveal for LINE reservation LP */

document.querySelectorAll(".line-faq-item").forEach((item) => {
  const btn = item.querySelector(".line-faq-q");
  btn?.addEventListener("click", () => {
    const wasOpen = item.classList.contains("is-open");
    document.querySelectorAll(".line-faq-item").forEach((el) => el.classList.remove("is-open"));
    if (!wasOpen) item.classList.add("is-open");
  });
});

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

document.querySelectorAll(".line-reveal").forEach((el) => revealObserver.observe(el));
