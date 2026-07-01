import { loadDemoReservation } from "./line-demo-store.js";

const DEMO_RESERVATIONS = [
  {
    id: "r-001",
    time: "11:00",
    name: "佐藤 花子",
    guests: 2,
    status: "confirmed",
    phone: "090-1234-5678",
    line: "@hanako.s",
    note: "窓際席希望",
    isNew: false,
  },
  {
    id: "r-002",
    time: "12:30",
    name: "田中 一郎",
    guests: 4,
    status: "confirmed",
    phone: "080-9876-5432",
    line: "tanaka_ichiro",
    note: "アレルギー：エビ",
    isNew: false,
  },
  {
    id: "r-003",
    time: "14:00",
    name: "鈴木 美咲",
    guests: 3,
    status: "pending",
    phone: "070-5555-0101",
    line: "@misaki.s",
    note: "",
    isNew: false,
  },
  {
    id: "r-004",
    time: "17:00",
    name: "高橋 健",
    guests: 2,
    status: "confirmed",
    phone: "090-7777-8888",
    line: "takahashi_k",
    note: "記念日ディナー",
    isNew: false,
  },
  {
    id: "r-005",
    time: "18:30",
    name: "伊藤 真由",
    guests: 5,
    status: "cancelled",
    phone: "080-3333-4444",
    line: "@mayu.i",
    note: "キャンセル連絡あり",
    isNew: false,
  },
];

const STATUS_LABEL = {
  confirmed: "確定",
  pending: "来店待ち",
  cancelled: "キャンセル",
};

let reservations = [];
let activeView = "dashboard";
let selectedId = null;

const dashboardView = document.getElementById("admin-dashboard-view");
const listView = document.getElementById("admin-list-view");
const detailView = document.getElementById("admin-detail-view");
const kpiToday = document.getElementById("kpi-today-count");
const kpiGuests = document.getElementById("kpi-guest-count");
const kpiCancelled = document.getElementById("kpi-cancelled");
const kpiVacancy = document.getElementById("kpi-vacancy");
const reservationTableBody = document.getElementById("reservation-table-body");
const reservationListBody = document.getElementById("reservation-list-body");
const detailContainer = document.getElementById("reservation-detail");
const notifyCard = document.getElementById("new-reservation-card");
const toast = document.getElementById("admin-toast");

function mergeDemoReservation() {
  const demo = loadDemoReservation();
  reservations = DEMO_RESERVATIONS.map((r) => ({ ...r }));

  if (demo?.name) {
    const demoEntry = {
      id: "demo-new",
      time: demo.time || "—",
      name: demo.name,
      guests: Number(demo.guests) || 1,
      status: "confirmed",
      phone: demo.phone || "（デモ）未入力",
      line: demo.line || "（デモ）LINE連携",
      note: demo.note || "デモ予約から自動登録",
      isNew: true,
      dateLabel: demo.dateLabel || demo.date || "",
    };
    const idx = reservations.findIndex((r) => r.id === "demo-new");
    if (idx >= 0) reservations[idx] = demoEntry;
    else reservations.unshift(demoEntry);
  }

  reservations.sort((a, b) => a.time.localeCompare(b.time));
}

function computeKpis() {
  const active = reservations.filter((r) => r.status !== "cancelled");
  const cancelled = reservations.filter((r) => r.status === "cancelled");
  const guestTotal = active.reduce((sum, r) => sum + r.guests, 0);
  const capacity = 40;
  const vacancy = Math.max(0, Math.round((1 - guestTotal / capacity) * 100));

  if (kpiToday) kpiToday.textContent = String(active.length);
  if (kpiGuests) kpiGuests.textContent = String(guestTotal);
  if (kpiCancelled) kpiCancelled.textContent = String(cancelled.length);
  if (kpiVacancy) kpiVacancy.innerHTML = `${vacancy}<small>%</small>`;
}

function renderNotifyCard() {
  if (!notifyCard) return;
  const newest = reservations.find((r) => r.isNew) || reservations.find((r) => r.status === "pending");

  if (!newest) {
    notifyCard.classList.add("is-empty");
    notifyCard.innerHTML = `
      <h3>新しい予約</h3>
      <p>本日の新規予約はありません。</p>
      <p>デモ予約フローから予約すると、ここに通知が表示されます。</p>
    `;
    return;
  }

  notifyCard.classList.remove("is-empty");
  notifyCard.innerHTML = `
    <span class="admin-notify-badge">NEW</span>
    <h3>新しい予約</h3>
    <p><strong>${escapeHtml(newest.name)}</strong> 様 / ${newest.guests} 名</p>
    <p>時間: <strong>${escapeHtml(newest.time)}</strong></p>
    <p>ステータス: <strong>${STATUS_LABEL[newest.status]}</strong></p>
    <button type="button" class="admin-notify-open" data-open-id="${newest.id}">詳細を見る</button>
  `;

  notifyCard.querySelector("[data-open-id]")?.addEventListener("click", () => {
    showDetail(newest.id);
  });
}

function reservationRowHtml(r) {
  return `
    <tr data-id="${r.id}" class="${r.isNew ? "is-new" : ""}">
      <td>${escapeHtml(r.time)}</td>
      <td>${escapeHtml(r.name)}${r.isNew ? ' <span class="admin-notify-badge" style="margin-left:0.25rem">NEW</span>' : ""}</td>
      <td>${r.guests} 名</td>
      <td><span class="admin-status admin-status--${r.status}">${STATUS_LABEL[r.status]}</span></td>
    </tr>
  `;
}

function bindTableRows(tbody) {
  tbody?.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("click", () => showDetail(row.dataset.id));
  });
}

function renderTable() {
  const html = reservations.map(reservationRowHtml).join("");
  if (reservationTableBody) {
    reservationTableBody.innerHTML = html;
    bindTableRows(reservationTableBody);
  }
  if (reservationListBody) {
    reservationListBody.innerHTML = html;
    bindTableRows(reservationListBody);
  }
}

function renderDetail(reservation) {
  if (!detailContainer || !reservation) return;

  detailContainer.innerHTML = `
    <dl class="admin-detail-grid">
      <div class="admin-detail-item">
        <dt>氏名</dt>
        <dd>${escapeHtml(reservation.name)}</dd>
      </div>
      <div class="admin-detail-item">
        <dt>人数</dt>
        <dd>${reservation.guests} 名</dd>
      </div>
      <div class="admin-detail-item">
        <dt>日時</dt>
        <dd>${reservation.dateLabel ? `${escapeHtml(reservation.dateLabel)} ` : "本日 "}${escapeHtml(reservation.time)}</dd>
      </div>
      <div class="admin-detail-item">
        <dt>ステータス</dt>
        <dd><span class="admin-status admin-status--${reservation.status}">${STATUS_LABEL[reservation.status]}</span></dd>
      </div>
      <div class="admin-detail-item">
        <dt>電話番号</dt>
        <dd>${escapeHtml(reservation.phone)}</dd>
      </div>
      <div class="admin-detail-item">
        <dt>LINE</dt>
        <dd>${escapeHtml(reservation.line)}</dd>
      </div>
      <div class="admin-detail-item admin-detail-item--full">
        <dt>備考</dt>
        <dd>${reservation.note ? escapeHtml(reservation.note) : "—"}</dd>
      </div>
    </dl>
    <div class="admin-detail-actions">
      <button type="button" class="admin-action-btn admin-action-btn--primary" data-action="edit">変更</button>
      <button type="button" class="admin-action-btn admin-action-btn--danger" data-action="cancel">キャンセル</button>
    </div>
  `;

  detailContainer.querySelector('[data-action="edit"]')?.addEventListener("click", () => {
    showToast("デモ：予約変更画面は今後追加予定です。");
  });

  detailContainer.querySelector('[data-action="cancel"]')?.addEventListener("click", () => {
    reservation.status = "cancelled";
    reservation.isNew = false;
    computeKpis();
    renderTable();
    renderDetail(reservation);
    renderNotifyCard();
    showToast("デモ：予約をキャンセルしました。");
  });
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.hidden = true;
  }, 2800);
}

function setActiveNav(view) {
  document.querySelectorAll(".line-admin-nav-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.view === view);
  });
}

function showView(view) {
  activeView = view;
  dashboardView.hidden = view !== "dashboard";
  listView.hidden = view !== "list";
  detailView.hidden = view !== "detail";
  setActiveNav(view === "detail" ? "list" : view);
}

function showDashboard() {
  showView("dashboard");
  selectedId = null;
  renderTable();
}

function showList() {
  showView("list");
  selectedId = null;
  renderTable();
}

function showDetail(id) {
  const reservation = reservations.find((r) => r.id === id);
  if (!reservation) return;
  selectedId = id;
  showView("detail");
  renderDetail(reservation);
}

function initNav() {
  document.querySelectorAll(".line-admin-nav-btn[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.view === "dashboard") showDashboard();
      if (btn.dataset.view === "list") showList();
    });
  });

  document.getElementById("dashboard-show-all")?.addEventListener("click", showList);
  document.getElementById("detail-back-btn")?.addEventListener("click", showList);
}

function init() {
  mergeDemoReservation();
  computeKpis();
  renderNotifyCard();
  renderTable();
  initNav();
  showDashboard();

  const openId = new URLSearchParams(window.location.search).get("id");
  if (openId) showDetail(openId);
}

init();
