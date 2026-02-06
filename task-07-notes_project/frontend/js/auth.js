document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    username: document.getElementById("loginUsername").value,
    password: document.getElementById("loginPassword").value
  };
  const res = await AuthAPI.login(data);
  if (res.access) {
    localStorage.setItem("access", res.access);
    localStorage.setItem("refresh", res.refresh);
    const decoded = parseJwt(res.access);
    localStorage.setItem("role", decoded.role);

    showAlert("Login successful!", "success");
    bootstrap.Modal.getInstance(document.getElementById("loginModal"))?.hide();

    setTimeout(() => {
      if (decoded.role === "ADMIN") {
        window.location.href = CONFIG.ROUTES.adminDashboard;
      } else {
        window.location.href = CONFIG.ROUTES.userDashboard;
      }
    }, 1000);
  } else {
    showAlert("Login failed.", "danger");
  }
});

document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    username: document.getElementById("regUsername").value,
    email: document.getElementById("regEmail").value,
    password: document.getElementById("regPassword").value,
    password2: document.getElementById("regPassword2").value,
    role: document.getElementById("regRole").value
  };
  const res = await AuthAPI.register(data);
  if (res.username) {
    showAlert("Registered successfully!", "success");
    bootstrap.Modal.getInstance(document.getElementById("registerModal"))?.hide();
  } else {
    showAlert("Registration failed.", "danger");
  }
});

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    return JSON.parse(atob(base64Url.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
}