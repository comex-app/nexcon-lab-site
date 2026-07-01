import { saveDemoReservation } from "./line-demo-store.js";

const form = document.getElementById("reservation-form");
const formView = document.getElementById("demo-form-view");
const confirmView = document.getElementById("demo-confirm-view");
const completeView = document.getElementById("demo-complete-view");
const lineView = document.getElementById("demo-line-view");
const formError = document.getElementById("form-error");
const resetBtn = document.getElementById("demo-reset-btn");
const confirmBackBtn = document.getElementById("confirm-back-btn");
const confirmSubmitBtn = document.getElementById("confirm-submit-btn");
const lineNextBtn = document.getElementById("line-admin-link-btn");
const dateInput = document.getElementById("reserve-date");

const views = [formView, confirmView, completeView, lineView].filter(Boolean);
let pendingReservation = null;

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

function guestLabel(guests) {
  return guests === "8" ? "8 名以上" : `${guests} 名`;
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

function showView(view) {
  views.forEach((v) => {
    v.hidden = v !== view;
  });
  updateStepIndicator(view);
  view?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function updateStepIndicator(activeView) {
  const stepMap = {
    [formView?.id]: 1,
    [confirmView?.id]: 2,
    [completeView?.id]: 3,
    [lineView?.id]: 4,
  };
  const activeStep = stepMap[activeView?.id] ?? 1;
  document.querySelectorAll(".line-demo-step").forEach((el) => {
    const step = Number(el.dataset.step);
    el.classList.toggle("is-active", step === activeStep);
    el.classList.toggle("is-done", step < activeStep);
  });
}

function fillSummary(container, { name, guests, date, time }) {
  if (!container) return;
  const dateLabel = formatDateJa(date);
  container.querySelector('[data-field="name"]').textContent = name;
  container.querySelector('[data-field="guests"]').textContent = guestLabel(guests);
  container.querySelector('[data-field="datetime"]').textContent = `${dateLabel} ${time}`;
}

function showConfirm(data) {
  pendingReservation = data;
  fillSummary(confirmView, data);
  showView(confirmView);
}

function showComplete(data) {
  fillSummary(completeView, data);
  saveDemoReservation({
    name: data.name,
    guests: data.guests,
    date: data.date,
    dateLabel: formatDateJa(data.date),
    time: data.time,
    phone: "090-0000-0000",
    line: "（デモ）LINE連携",
    note: "デモ予約から自動登録",
  });
  showView(completeView);
}

function showLineNotification(data) {
  if (lineView) {
    lineView.querySelector('[data-field="name"]').textContent = data.name;
    lineView.querySelector('[data-field="datetime"]').textContent =
      `${formatDateJa(data.date)} ${data.time}`;
    lineView.querySelector('[data-field="guests"]').textContent = guestLabel(data.guests);
  }
  showView(lineView);
}

function resetDemo() {
  if (!form) return;
  form.reset();
  clearError();
  setMinDate();
  pendingReservation = null;
  showView(formView);
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

    showConfirm({ name, guests, date, time });
  });
}

confirmBackBtn?.addEventListener("click", () => {
  showView(formView);
});

confirmSubmitBtn?.addEventListener("click", () => {
  if (!pendingReservation) return;
  showComplete(pendingReservation);
});

completeView?.querySelector("#complete-line-btn")?.addEventListener("click", () => {
  if (!pendingReservation) return;
  showLineNotification(pendingReservation);
});

if (resetBtn) {
  resetBtn.addEventListener("click", resetDemo);
}

lineNextBtn?.addEventListener("click", () => {
  window.location.href = "/line-reservation/demo/admin?id=demo-new";
});

showView(formView);
