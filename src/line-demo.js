import { saveDemoReservation } from "./line-demo-store.js";



const form = document.getElementById("reservation-form");

const formView = document.getElementById("demo-form-view");

const confirmView = document.getElementById("demo-confirm-view");

const completeView = document.getElementById("demo-complete-view");

const lineView = document.getElementById("demo-line-view");

const appShell = document.getElementById("line-app-shell");

const appHeader = document.getElementById("line-app-header");

const formError = document.getElementById("form-error");

const resetBtn = document.getElementById("demo-reset-btn");

const confirmBackBtn = document.getElementById("confirm-back-btn");

const confirmSubmitBtn = document.getElementById("confirm-submit-btn");

const lineNextBtn = document.getElementById("line-admin-link-btn");

const dateInput = document.getElementById("reserve-date");



const views = [formView, confirmView, completeView, lineView].filter(Boolean);

const storyItems = document.querySelectorAll(".line-demo-story-item");

let pendingReservation = null;



const STEP_VIEW = {

  1: formView,

  2: confirmView,

  3: completeView,

  4: lineView,

};



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



function getActiveStep(view) {

  for (const [step, v] of Object.entries(STEP_VIEW)) {

    if (v === view) return Number(step);

  }

  return 1;

}



function updateStoryNav(activeStep) {

  storyItems.forEach((el) => {

    const step = Number(el.dataset.step);

    el.classList.toggle("is-active", step === activeStep);

    el.classList.toggle("is-done", step < activeStep);



    const nextBtn = el.querySelector(".line-demo-story-next");

    if (nextBtn) {
      const showNext = step === activeStep || (activeStep === 4 && step === 5);
      nextBtn.hidden = !showNext;
    }

  });

}



function showView(view) {

  views.forEach((v) => {

    v.hidden = v !== view;

  });



  const activeStep = getActiveStep(view);

  updateStoryNav(activeStep);



  const isTalk = view === lineView;

  appShell?.classList.toggle("is-talk-mode", isTalk);

  if (appHeader) appHeader.hidden = isTalk;



  view?.scrollIntoView({ behavior: "smooth", block: "nearest" });

}



function fillSummary(container, { name, guests, date, time }) {

  if (!container) return;

  const dateLabel = formatDateJa(date);

  container.querySelector('[data-field="name"]').textContent = name;

  container.querySelector('[data-field="guests"]').textContent = guestLabel(guests);

  container.querySelector('[data-field="datetime"]').textContent = `${dateLabel} ${time}`;

}



function fillLineTalk(data) {

  if (!lineView || !data) return;

  lineView.querySelector('[data-field="name"]').textContent = data.name;

  lineView.querySelector('[data-field="datetime"]').textContent =

    `${formatDateJa(data.date)} ${data.time}`;

  lineView.querySelector('[data-field="guests"]').textContent = guestLabel(data.guests);

}



function getFormData() {

  if (!form) return null;

  const data = new FormData(form);

  const name = String(data.get("name") ?? "").trim();

  const guests = String(data.get("guests") ?? "");

  const date = String(data.get("date") ?? "");

  const time = String(data.get("time") ?? "");

  if (!name || !guests || !date || !time) return null;

  return { name, guests, date, time };

}



function submitForm() {

  clearError();

  if (!form.checkValidity()) {

    form.reportValidity();

    return false;

  }

  const data = getFormData();

  if (!data) {

    showError("すべての項目を入力してください。");

    return false;

  }

  showConfirm(data);

  return true;

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

    store: "デモ店舗（表参道）",

  });

  showView(completeView);

}



function showLineNotification(data) {

  fillLineTalk(data);

  showView(lineView);

}



function goToAdmin() {

  window.location.href = "/line-reservation/demo/admin?id=demo-new";

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

    submitForm();

  });

}



confirmBackBtn?.addEventListener("click", () => showView(formView));



confirmSubmitBtn?.addEventListener("click", () => {

  if (!pendingReservation) return;

  showComplete(pendingReservation);

});



completeView?.querySelector("#complete-line-btn")?.addEventListener("click", () => {

  if (!pendingReservation) return;

  showLineNotification(pendingReservation);

});



resetBtn?.addEventListener("click", resetDemo);

lineNextBtn?.addEventListener("click", goToAdmin);



lineView?.querySelector(".line-talk-action-btn")?.addEventListener("click", () => {

  showToastDemo("デモ：予約変更画面へ遷移します。");

});



lineView?.querySelector(".line-talk-back")?.addEventListener("click", () => {

  if (pendingReservation) showView(completeView);

});



document.querySelector('[data-action="next-step-1"]')?.addEventListener("click", submitForm);

document.querySelector('[data-action="next-step-2"]')?.addEventListener("click", () => {

  if (pendingReservation) showComplete(pendingReservation);

  else submitForm();

});

document.querySelector('[data-action="next-step-3"]')?.addEventListener("click", () => {

  if (pendingReservation) showLineNotification(pendingReservation);

});

document.querySelector('[data-action="next-step-4"]')?.addEventListener("click", goToAdmin);



function showToastDemo(message) {

  let el = document.getElementById("demo-toast");

  if (!el) {

    el = document.createElement("div");

    el.id = "demo-toast";

    el.className = "demo-toast";

    el.setAttribute("role", "status");

    document.body.appendChild(el);

  }

  el.textContent = message;

  el.hidden = false;

  clearTimeout(showToastDemo._timer);

  showToastDemo._timer = setTimeout(() => {

    el.hidden = true;

  }, 2400);

}



showView(formView);


