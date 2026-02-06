const role = localStorage.getItem("role");
if (role !== "ADMIN") {
  alert("Access denied. Admins only.");
  window.location.href = CONFIG.ROUTES.home;
} else {
  loadUsers();
}

async function loadUsers() {
  const users = await apiRequest("users/");
  const list = document.getElementById("usersList");
  list.innerHTML = "";

  users.forEach(user => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <div><strong>${user.username}</strong> (${user.email}) - Role: ${user.role}</div>
      <div>
        <button class="btn btn-sm btn-info me-1" onclick="viewUser(${user.id})">View</button>
        <button class="btn btn-sm btn-warning me-1" onclick="editUser(${user.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}