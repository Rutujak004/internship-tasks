const token = localStorage.getItem("token");

async function loadAdminTasks() {
  const response = await fetch("http://127.0.0.1:8000/api/tasks/", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (response.ok) {
    const tasks = await response.json();
    const taskList = document.getElementById("adminTaskList");
    taskList.innerHTML = "";

    tasks.forEach(task => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";

      li.innerHTML = `
        <div>
          <strong>${task.title}</strong><br>
          ${task.description}<br>
          Deadline: ${task.deadline || "N/A"}<br>
          Assigned to: ${task.assigned_to_username} (${task.assigned_to_email})<br>
          Status: <span class="badge bg-${task.status === "COMPLETED" ? "success" : "warning"}">${task.status}</span>
        </div>
        <div>
          <button class="btn btn-sm btn-info" 
            onclick="viewTask('${task.title}', '${task.description}', '${task.deadline || ""}', '${task.assigned_to_username} (${task.assigned_to_email})', '${task.status}')">View</button>
          <button class="btn btn-sm btn-warning" 
            onclick="openEditModal(${task.id}, '${task.title}', '${task.description}', '${task.deadline || ""}', '${task.status}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">Delete</button>
        </div>
      `;
      taskList.appendChild(li);
    });
  }
}

// Show task details in modal
function viewTask(title, description, deadline, assigned, status) {
  document.getElementById("viewTaskTitle").value = title;
  document.getElementById("viewTaskDescription").value = description;
  document.getElementById("viewTaskDeadline").value = deadline || "N/A";
  document.getElementById("viewTaskAssigned").value = assigned;
  document.getElementById("viewTaskStatus").value = status;
  new bootstrap.Modal(document.getElementById("viewTaskModal")).show();
}

// ✅ Open Edit Modal
function openEditModal(id, title, description, deadline, status) {
  document.getElementById("editTaskId").value = id;
  document.getElementById("editTaskTitle").value = title;
  document.getElementById("editTaskDescription").value = description;
  document.getElementById("editTaskDeadline").value = deadline;
  document.getElementById("editTaskStatus").value = status;

  new bootstrap.Modal(document.getElementById("editTaskModal")).show();
}

// ✅ Handle Edit Form Submission
document.getElementById("editTaskForm").addEventListener("submit", async e => {
  e.preventDefault();
  const id = document.getElementById("editTaskId").value;
  const title = document.getElementById("editTaskTitle").value;
  const description = document.getElementById("editTaskDescription").value;
  const deadline = document.getElementById("editTaskDeadline").value;
  const status = document.getElementById("editTaskStatus").value;

  const response = await fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ title, description, deadline, status })
  });

  if (response.ok) {
    alert("Task updated!");
    bootstrap.Modal.getInstance(document.getElementById("editTaskModal")).hide();
    loadAdminTasks(); // refresh list
  } else {
    alert("Failed to update task");
  }
});

// ✅ Delete Task
async function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) return;
  const response = await fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (response.ok) {
    alert("Task deleted!");
    loadAdminTasks(); // refresh list
  } else {
    alert("Failed to delete task");
  }
}

document.addEventListener("DOMContentLoaded", loadAdminTasks);