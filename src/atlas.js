/** Atlas landing page — screenshot lightbox */
export function initAtlasLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-image");
  const closeBtn = document.querySelector(".lightbox-close");
  if (!lightbox || !lightboxImg || !closeBtn) return;

  const triggers = document.querySelectorAll("[data-lightbox]");

  function open(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeBtn.focus();
  }

  function close() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.classList.remove("lightbox-open");
  }

  triggers.forEach((el) => {
    el.addEventListener("click", () => {
      const img = el.querySelector("img");
      if (!img) return;
      open(img.currentSrc || img.src, img.alt);
    });
  });

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) close();
  });
}

if (document.body.classList.contains("page-atlas")) {
  initAtlasLightbox();
}
