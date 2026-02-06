const API_BASE = "http://localhost:8000/api";
const token = localStorage.getItem("token");

async function loadUsers() {
  const response = await fetch(`${API_BASE}/users/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    const users = await response.json();
    renderUsers(users);

    // Search functionality
    document.getElementById("searchUser").addEventListener("input", function () {
      const query = this.value.toLowerCase();
      const filtered = users.filter(u =>
        u.username.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query)
      );
      renderUsers(filtered);
    });
  } else {
    console.error("Failed to load users:", response.status, await response.text());
    alert("Unable to load users. Make sure you are logged in as admin.");
  }
}

function renderUsers(users) {
  const tbody = document.getElementById("usersTableBody");
  tbody.innerHTML = "";
  users.forEach(user => {
    tbody.innerHTML += `
      <tr>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <button class="btn btn-sm btn-info" onclick="viewUser(${user.id})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Delete</button>
        </td>
      </tr>`;
  });
}

// Add User
document.getElementById("addUserForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("newUsername").value;
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPassword").value;
  const role = document.getElementById("newRole").value;

  const response = await fetch(`${API_BASE}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, email, password, role }),
  });

  if (response.ok) {
    loadUsers();
    const modal = bootstrap.Modal.getInstance(document.getElementById("addUserModal"));
    modal.hide();
  } else {
    alert("Failed to add user: " + (await response.text()));
  }
});

// View/Edit User
async function viewUser(id) {
  const response = await fetch(`${API_BASE}/users/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.ok) {
    const user = await response.json();
    document.getElementById("editUserId").value = user.id;
    document.getElementById("editUsername").value = user.username;
    document.getElementById("editEmail").value = user.email;
    document.getElementById("editRole").value = user.role;
    const modal = new bootstrap.Modal(document.getElementById("userModal"));
    modal.show();
  } else {
    alert("Failed to fetch user details");
  }
}

// Save Edit
document.getElementById("editUserForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("editUserId").value;
  const username = document.getElementById("editUsername").value;
  const email = document.getElementById("editEmail").value;
  const role = document.getElementById("editRole").value;
  const password = document.getElementById("editPassword").value;

  const body = { username, email, role };
  if (password) body.password = password;

  const response = await fetch(`${API_BASE}/users/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    loadUsers();
    const modal = bootstrap.Modal.getInstance(document.getElementById("userModal"));
    modal.hide();
  } else {
    alert("Failed to update user: " + (await response.text()));
  }
});

// Delete User
async function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  const response = await fetch(`${API_BASE}/users/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    loadUsers();
  } else {
    alert("Failed to delete user: " + (await response.text()));
  }
}

// Initial load
loadUsers();