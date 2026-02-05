// Register
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    username: regUsername.value,
    email: regEmail.value,
    password: regPassword.value,
    password2: regPassword2.value,
    role: regRole.value
  };
  const res = await AuthAPI.register(data);
  if (res.username) {
    showAlert("Registered successfully!", "success");
    bootstrap.Modal.getInstance(document.getElementById("registerModal"))?.hide();
  } else {
    showAlert("Registration failed.", "danger");
  }
});

// Login
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = { username: loginUsername.value, password: loginPassword.value };
  const res = await AuthAPI.login(data);
  if (res.access) {
    localStorage.setItem("access", res.access);
    localStorage.setItem("refresh", res.refresh);
    const decoded = parseJwt(res.access);
    localStorage.setItem("role", decoded.role);
    showAlert("Login successful!", "success");
    bootstrap.Modal.getInstance(document.getElementById("loginModal"))?.hide();
    setTimeout(() => window.location.href = CONFIG.ROUTES.dashboard, 1000);
  } else {
    showAlert("Login failed.", "danger");
  }
});

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.clear();
  showAlert("Logged out successfully.", "info");
  window.location.href = CONFIG.ROUTES.home;
});

// Helper
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    return JSON.parse(atob(base64Url.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
}