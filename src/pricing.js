/** FAQ accordion for Pricing page */

document.querySelectorAll(".pricing-faq-item").forEach((item) => {
  const btn = item.querySelector(".pricing-faq-q");
  btn?.addEventListener("click", () => {
    const wasOpen = item.classList.contains("is-open");
    document.querySelectorAll(".pricing-faq-item").forEach((el) => {
      el.classList.remove("is-open");
      el.querySelector(".pricing-faq-q")?.setAttribute("aria-expanded", "false");
    });
    if (!wasOpen) {
      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});
