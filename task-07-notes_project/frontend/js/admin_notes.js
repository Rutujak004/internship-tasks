const NOTES_API = CONFIG.API_BASE + "notes/";
const USERS_API = CONFIG.API_BASE + "users/";
let currentMode = "MY"; 
let noteToShare = null;

// Decode JWT
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch {
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const decoded = parseJwt(localStorage.getItem("access"));
  const userId = decoded?.user_id;
  document.getElementById("usernameDisplay").textContent = decoded?.username || "Admin";

  // --- Notes Section ---
  async function loadNotes() {
    const res = await fetch(NOTES_API, {
      headers: { "Authorization": "Bearer " + localStorage.getItem("access") }
    });
    const notes = await res.json();

    const list = document.getElementById("notesList");
    list.innerHTML = "";

    let filteredNotes = notes;
    if (currentMode === "MY") {
      filteredNotes = notes.filter(note => note.user === userId || note.user?.id === userId);
    }

    filteredNotes.forEach(note => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <div><strong>${note.title}</strong>: ${note.content}</div>
        <div>
          <button class="btn btn-sm btn-info me-1" onclick="viewNote(${note.id})">View</button>
          <button class="btn btn-sm btn-warning me-1" onclick="editNote(${note.id})">Edit</button>
          <button class="btn btn-sm btn-danger me-1" onclick="deleteNote(${note.id})">Delete</button>
          <button class="btn btn-sm btn-secondary" onclick="openShare(${note.id})">Share</button>
        </div>
      `;
      list.appendChild(li);
    });
  }

  // Add note
  document.getElementById("noteForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      title: document.getElementById("noteTitle").value,
      content: document.getElementById("noteContent").value
    };
    await fetch(NOTES_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("access")
      },
      body: JSON.stringify(data)
    });
    e.target.reset();
    bootstrap.Modal.getInstance(document.getElementById("noteModal")).hide();
    loadNotes();
  });

  // CRUD + share
  window.deleteNote = async function(id) {
    await fetch(NOTES_API + id + "/", {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + localStorage.getItem("access") }
    });
    loadNotes();
  };

  window.editNote = async function(id) {
    const newTitle = prompt("Enter new title:");
    const newContent = prompt("Enter new content:");
    await fetch(NOTES_API + id + "/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("access")
      },
      body: JSON.stringify({ title: newTitle, content: newContent })
    });
    loadNotes();
  };

  window.viewNote = async function(id) {
    const res = await fetch(NOTES_API + id + "/", {
      headers: { "Authorization": "Bearer " + localStorage.getItem("access") }
    });
    const note = await res.json();
    showAlert(`Title: ${note.title}<br>Content: ${note.content}`, "info");
  };

  window.openShare = function(id) {
    noteToShare = id;
    new bootstrap.Modal(document.getElementById("shareModal")).show();
  };

  document.getElementById("shareConfirmBtn")?.addEventListener("click", async () => {
    const username = document.getElementById("shareUser").value;
    await fetch(NOTES_API + noteToShare + "/share/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("access")
      },
      body: JSON.stringify({ username })
    });
    showAlert("Note shared!", "success");
  });

  // --- User Management Section ---
  async function loadUsers() {
    const res = await fetch(USERS_API, {
      headers: { "Authorization": "Bearer " + localStorage.getItem("access") }
    });
    const users = await res.json();

    const list = document.getElementById("userList");
    list.innerHTML = "";

    users.forEach(user => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <div><strong>${user.username}</strong> (${user.email}) - Role: ${user.role} - Active: ${user.is_active}</div>
        <div>
          <button class="btn btn-sm btn-success" onclick="activateUser(${user.id})">Activate</button>
          <button class="btn btn-sm btn-warning" onclick="deactivateUser(${user.id})">Deactivate</button>
          <button class="btn btn-sm btn-danger" onclick="blockUser(${user.id})">Block</button>
          <button class="btn btn-sm btn-info" onclick="assignRole(${user.id}, 'ADMIN')">Make Admin</button>
        </div>
      `;
      list.appendChild(li);
    });
  }

  window.activateUser = async function(id) {
    await fetch(`${USERS_API}${id}/activate/`, { method: "POST", headers: authHeader() });
    loadUsers();
  };
  window.deactivateUser = async function(id) {
    await fetch(`${USERS_API}${id}/deactivate/`, { method: "POST", headers: authHeader() });
    loadUsers();
  };
  window.blockUser = async function(id) {
    await fetch(`${USERS_API}${id}/block/`, { method: "POST", headers: authHeader() });
    loadUsers();
  };
  window.assignRole = async function(id, role) {
    await fetch(`${USERS_API}${id}/assign_role/`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ role })
    });
    loadUsers();
  };

  function authHeader() {
    return { "Authorization": "Bearer " + localStorage.getItem("access") };
  }

  // --- Buttons ---
  document.getElementById("myNotesBtn")?.addEventListener("click", () => {
    currentMode = "MY";
    loadNotes();
  });

  document.getElementById("allNotesBtn")?.addEventListener("click", () => {
    currentMode = "ALL";
    loadNotes();
  });

  // Initial load
  loadNotes();
  loadUsers();
});