const token = localStorage.getItem("token");

// Load all users
async function loadUsers() {
  const response = await fetch("http://127.0.0.1:8000/api/accounts/users/", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (response.ok) {
    const users = await response.json();
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = "";

    users.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <button class="btn btn-sm btn-info" onclick="viewUser('${user.username}', '${user.email}', '${user.role}')">View</button>
          <button class="btn btn-sm btn-warning" onclick="openEditUserModal(${user.id}, '${user.username}', '${user.email}', '${user.role}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } else {
    console.error("Failed to load users:", response.status);
  }
}

// ✅ View user details
function viewUser(username, email, role) {
  document.getElementById("viewUserName").value = username;
  document.getElementById("viewUserEmail").value = email;
  document.getElementById("viewUserRole").value = role;
  new bootstrap.Modal(document.getElementById("viewUserModal")).show();
}

// ✅ Open edit modal
function openEditUserModal(id, username, email, role) {
  document.getElementById("editUserId").value = id;
  document.getElementById("editUserName").value = username;
  document.getElementById("editUserEmail").value = email;
  document.getElementById("editUserRole").value = role;
  new bootstrap.Modal(document.getElementById("editUserModal")).show();
}

// ✅ Handle edit form submission
document.getElementById("editUserForm").addEventListener("submit", async e => {
  e.preventDefault();
  const id = document.getElementById("editUserId").value;
  const username = document.getElementById("editUserName").value;
  const email = document.getElementById("editUserEmail").value;
  const role = document.getElementById("editUserRole").value;

  const response = await fetch(`http://127.0.0.1:8000/api/accounts/users/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ username, email, role })
  });

  if (response.ok) {
    alert("User updated!");
    bootstrap.Modal.getInstance(document.getElementById("editUserModal")).hide();
    loadUsers();
  } else {
    console.error("Failed to update user:", response.status);
  }
});

// ✅ Delete user
async function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;
  const response = await fetch(`http://127.0.0.1:8000/api/accounts/users/${id}/`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (response.ok) {
    alert("User deleted!");
    loadUsers();
  } else {
    console.error("Failed to delete user:", response.status);
  }
}

// ✅ Add new user
document.getElementById("addUserForm").addEventListener("submit", async e => {
  e.preventDefault();
  const username = document.getElementById("addUserName").value;
  const email = document.getElementById("addUserEmail").value;
  const password = document.getElementById("addUserPassword").value;
  const role = document.getElementById("addUserRole").value;

  const response = await fetch("http://127.0.0.1:8000/api/accounts/users/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ username, email, password, role })
  });

  if (response.ok) {
    alert("User created successfully!");
    bootstrap.Modal.getInstance(document.getElementById("addUserModal")).hide();
    loadUsers();
  } else {
    console.error("Failed to create user:", response.status);
  }
});

document.addEventListener("DOMContentLoaded", loadUsers);