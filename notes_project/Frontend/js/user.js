const API_BASE = "http://localhost:8000/api";
const token = localStorage.getItem("token");

function showNoteForm() {
  document.getElementById("noteAlert").style.display = "block";
}
function hideNoteForm() {
  document.getElementById("noteAlert").style.display = "none";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// Load Notes
async function loadNotes() {
  const response = await fetch(`${API_BASE}/notes/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.ok) {
    const notes = await response.json();
    const tbody = document.getElementById("notesTableBody");
    tbody.innerHTML = "";
    notes.forEach(note => {
      tbody.innerHTML += `
        <tr>
          <td>${note.title}</td>
          <td>${note.content}</td>
          <td>${new Date(note.created_at).toLocaleString()}</td>
          <td>
            <button class="btn btn-sm btn-info" onclick="openEditNote(${note.id}, '${note.title}', '${note.content}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteNote(${note.id})">Delete</button>
          </td>
        </tr>`;
    });
  }
}

// Add Note
document.getElementById("noteForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;

  const response = await fetch(`${API_BASE}/notes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });

  if (response.ok) {
    hideNoteForm();
    loadNotes();
  } else {
    alert("Failed to add note");
  }
});

// Open Edit Modal
function openEditNote(id, title, content) {
  document.getElementById("editNoteId").value = id;
  document.getElementById("editNoteTitle").value = title;
  document.getElementById("editNoteContent").value = content;
  const modal = new bootstrap.Modal(document.getElementById("editNoteModal"));
  modal.show();
}

// Update Note
document.getElementById("editNoteForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("editNoteId").value;
  const title = document.getElementById("editNoteTitle").value;
  const content = document.getElementById("editNoteContent").value;

  const response = await fetch(`${API_BASE}/notes/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });

  if (response.ok) {
    loadNotes();
    const modal = bootstrap.Modal.getInstance(document.getElementById("editNoteModal"));
    modal.hide();
  } else {
    alert("Failed to update note");
  }
});

// Delete Note
async function deleteNote(id) {
  if (!confirm("Are you sure you want to delete this note?")) return;

  const response = await fetch(`${API_BASE}/notes/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    loadNotes();
  } else {
    alert("Failed to delete note");
  }
}

// Initial load
loadNotes();