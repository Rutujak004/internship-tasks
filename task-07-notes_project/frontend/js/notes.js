const API_BASE = "http://127.0.0.1:8000/api/notes/";
let currentMode = "MY"; // MY or ALL
let noteToShare = null;

// Decode JWT to get user info
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (e) {
    return null;
  }
}

// Load notes (backend already filters by role)
async function loadNotes() {
  const res = await fetch(API_BASE, {
    headers: { "Authorization": "Bearer " + localStorage.getItem("access") }
  });
  const notes = await res.json();

  const list = document.getElementById("notesList");
  list.innerHTML = "";

  notes.forEach(note => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <div>
        <strong>${note.title}</strong>: ${note.content}
      </div>
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
document.getElementById("noteForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    title: document.getElementById("noteTitle").value,
    content: document.getElementById("noteContent").value
  };
  await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("access")
    },
    body: JSON.stringify(data)
  });
  document.getElementById("noteForm").style.display = "none";
  loadNotes();
});

// Delete note
async function deleteNote(id) {
  await fetch(API_BASE + id + "/", {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + localStorage.getItem("access") }
  });
  loadNotes();
}

// Edit note
async function editNote(id) {
  const newTitle = prompt("Enter new title:");
  const newContent = prompt("Enter new content:");
  await fetch(API_BASE + id + "/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("access")
    },
    body: JSON.stringify({ title: newTitle, content: newContent })
  });
  loadNotes();
}

// View note
async function viewNote(id) {
  const res = await fetch(API_BASE + id + "/", {
    headers: { "Authorization": "Bearer " + localStorage.getItem("access") }
  });
  const note = await res.json();
  alert(`Title: ${note.title}\nContent: ${note.content}`);
}

// Share note
function openShare(id) {
  noteToShare = id;
  new bootstrap.Modal(document.getElementById("shareModal")).show();
}

document.getElementById("shareConfirmBtn").addEventListener("click", async () => {
  const username = document.getElementById("shareUser").value;
  await fetch(API_BASE + noteToShare + "/share/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("access")
    },
    body: JSON.stringify({ username })
  });
  alert("Note shared!");
});

// Role-based buttons
document.getElementById("myNotesBtn").addEventListener("click", () => {
  currentMode = "MY";
  loadNotes();
});

document.getElementById("allNotesBtn").addEventListener("click", () => {
  currentMode = "ALL";
  loadNotes();
});

document.getElementById("addNoteBtn").addEventListener("click", () => {
  document.getElementById("noteForm").style.display = "block";
});

// Show admin button if role is ADMIN
const role = localStorage.getItem("role");
if (role === "ADMIN") {
  document.getElementById("allNotesBtn").style.display = "inline-block";
}

loadNotes();