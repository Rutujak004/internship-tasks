const API_BASE = "http://localhost:8000/api";

function showAlert(message, type="success") {
  const alertBox = document.getElementById("alertBox");
  alertBox.className = `alert alert-${type} text-center position-fixed top-0 start-50 translate-middle-x mt-3`;
  alertBox.innerText = message;
  alertBox.style.display = "block";
  setTimeout(() => { alertBox.style.display = "none"; }, 3000);
}

// Registration
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("regUsername").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const response = await fetch(`${API_BASE}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }), // role forced in backend
  });

  if (response.ok) {
    showAlert("Registered successfully! Please login.", "success");
    const modal = bootstrap.Modal.getInstance(document.getElementById("registerModal"));
    modal.hide();
    new bootstrap.Modal(document.getElementById("loginModal")).show();
  } else {
    const error = await response.json();
    showAlert("Registration failed: " + (error.detail || JSON.stringify(error)), "danger");
  }
});

// Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch(`${API_BASE}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("token", data.access);

    const userRes = await fetch(`${API_BASE}/me/`, {
      headers: { Authorization: `Bearer ${data.access}` },
    });

    if (userRes.ok) {
      const currentUser = await userRes.json();
      showAlert("Login successful! Redirecting...", "success");
      setTimeout(() => {
        if (currentUser.role === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "user.html";
        }
      }, 1000); // quick redirect
    }
  } else {
    showAlert("Invalid credentials", "danger");
  }
});