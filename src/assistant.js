const form = document.getElementById("assistant-prompt-form");
const input = document.getElementById("assistant-input");
const toast = document.getElementById("assistant-toast");

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.hidden = true;
  }, 2800);
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input?.value.trim();
  if (!text) {
    showToast("メッセージを入力してください（デモ）。");
    return;
  }
  showToast("NexAssistant は開発中です。ご期待ください。");
  if (input) input.value = "";
});

document.querySelectorAll(".assistant-action-card").forEach((card) => {
  card.addEventListener("click", () => {
    showToast("デモ：この機能は NexAssistant 正式版で提供予定です。");
  });
});
