const token = localStorage.getItem("token");

// Load tasks for the logged-in user
async function loadUserTasks() {
  const response = await fetch("http://127.0.0.1:8000/api/tasks/", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (response.ok) {
    const tasks = await response.json();
    const taskList = document.getElementById("userTaskList");
    taskList.innerHTML = "";

    tasks.forEach(task => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";

      li.innerHTML = `
        <div>
          <strong>${task.title}</strong><br>
          ${task.description}<br>
          Deadline: ${task.deadline || "N/A"}
        </div>
        <div>
          <span class="badge bg-${task.status === "COMPLETED" ? "success" : "warning"}">
            ${task.status}
          </span>
          <button class="btn btn-sm ${task.status === "COMPLETED" ? "btn-secondary" : "btn-success"}"
                  onclick="toggleCompleted(${task.id}, '${task.status}')">
            ${task.status === "COMPLETED" ? "Mark Incomplete" : "Mark Completed"}
          </button>
        </div>
      `;
      taskList.appendChild(li);
    });
  } else {
    console.error("Failed to load tasks:", response.status);
  }
}

// Toggle task completion
async function toggleCompleted(id, currentStatus) {
  const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";

  const response = await fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ status: newStatus })
  });

  if (response.ok) {
    loadUserTasks();
  } else {
    console.error("Failed to update task:", response.status);
  }
}

document.addEventListener("DOMContentLoaded", loadUserTasks);