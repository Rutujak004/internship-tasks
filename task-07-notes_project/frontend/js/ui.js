function showAlert(message, type="info") {
  const alertContainer = document.getElementById("alertContainer");
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
  alertContainer.appendChild(wrapper);
  setTimeout(() => wrapper.remove(), 3000);
}