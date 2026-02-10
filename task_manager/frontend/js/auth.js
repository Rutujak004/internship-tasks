// Handles login and registration
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async e => {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginPassword").value;

      try {
        const response = await fetch("http://127.0.0.1:8000/api/token/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });

        if (response.ok) {
          const data = await response.json();

          // Debug: show role in console
          console.log("Login response:", data);

          // Store token + role
          localStorage.setItem("token", data.access);
          localStorage.setItem("role", data.role);

          // Normalize role check
          const role = (data.role || "").trim().toUpperCase();
          if (role === "ADMIN") {
            window.location.href = "admin_dashboard.html";
          } else {
            window.location.href = "user_dashboard.html";
          }
        } else {
          alert("Invalid credentials");
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("Failed to connect to server");
      }
    });
  }

  if (registerForm) {
  registerForm.addEventListener("submit", async e => {
    e.preventDefault();
    const username = document.getElementById("regUsername").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const role = document.getElementById("regRole").value;  // NEW

    const response = await fetch("http://127.0.0.1:8000/api/accounts/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, role })  // include role
    });

    if (response.ok) {
      alert("Registration successful! Please login.");
      window.location.href = "login.html";
    } else {
      alert("Registration failed");
    }
  });
  }
});