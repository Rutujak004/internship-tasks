function showAlert(message, type = "info", duration = 3000, single = true) {
  const alertContainer = document.getElementById("alertContainer");
  if (!alertContainer) return;

  if (single) alertContainer.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert" aria-live="polite">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
  alertContainer.appendChild(wrapper);

  if (duration > 0) setTimeout(() => wrapper.remove(), duration);
}