const role = localStorage.getItem("role");

if (role === "ADMIN") {
  window.location.href = CONFIG.ROUTES.adminDashboard;
} else if (role === "USER") {
  loadNotes();
} else {
  window.location.href = CONFIG.ROUTES.home;
}

async function loadNotes() {
  const notes = await NotesAPI.list();
  const list = document.getElementById("notesList");
  list.innerHTML = "";

  notes.forEach(note => {
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