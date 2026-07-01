const form = document.getElementById("reservation-form");
const formView = document.getElementById("demo-form-view");
const successView = document.getElementById("demo-success-view");
const formError = document.getElementById("form-error");
const resetBtn = document.getElementById("demo-reset-btn");
const dateInput = document.getElementById("reserve-date");

function setMinDate() {
  if (!dateInput) return;
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

function formatDateJa(isoDate) {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  const date = new Date(y, m - 1, d);
  const weekday = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
  return `${y}年${m}月${d}日（${weekday}）`;
}

function showError(message) {
  if (!formError) return;
  formError.textContent = message;
  formError.hidden = false;
}

function clearError() {
  if (!formError) return;
  formError.textContent = "";
  formError.hidden = true;
}

function showSuccess({ name, guests, date, time }) {
  if (!successView || !formView) return;

  const guestLabel = guests === "8" ? "8 名以上" : `${guests} 名`;

  successView.querySelector('[data-field="name"]').textContent = name;
  successView.querySelector('[data-field="guests"]').textContent = guestLabel;
  successView.querySelector('[data-field="datetime"]').textContent =
    `${formatDateJa(date)} ${time}`;

  formView.hidden = true;
  successView.hidden = false;
  successView.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function resetDemo() {
  if (!form || !successView || !formView) return;
  form.reset();
  clearError();
  setMinDate();
  successView.hidden = true;
  formView.hidden = false;
  form.querySelector("#guest-name")?.focus();
}

if (dateInput) {
  setMinDate();
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearError();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const guests = String(data.get("guests") ?? "");
    const date = String(data.get("date") ?? "");
    const time = String(data.get("time") ?? "");

    if (!name || !guests || !date || !time) {
      showError("すべての項目を入力してください。");
      return;
    }

    showSuccess({ name, guests, date, time });
  });
}

if (resetBtn) {
  resetBtn.addEventListener("click", resetDemo);
}
