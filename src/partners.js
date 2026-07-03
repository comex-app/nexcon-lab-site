/** FAQ accordion for Partners page */

document.querySelectorAll(".partners-faq-item").forEach((item) => {
  const btn = item.querySelector(".partners-faq-q");
  btn?.addEventListener("click", () => {
    const wasOpen = item.classList.contains("is-open");
    document.querySelectorAll(".partners-faq-item").forEach((el) => {
      el.classList.remove("is-open");
      el.querySelector(".partners-faq-q")?.setAttribute("aria-expanded", "false");
    });
    if (!wasOpen) {
      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});
