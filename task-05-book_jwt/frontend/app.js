const API = "http://127.0.0.1:8000/api";

// LOGIN
function login() {
  fetch(`${API}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: document.getElementById("username").value,
      password: document.getElementById("password").value
    })
  })
  .then(res => res.json())
  .then(data => {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    window.location.href = "books.html";
  });
}

// LOGOUT
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// LOAD BOOKS
function loadBooks() {
  const token = localStorage.getItem("access");
  if (!token) return window.location.href = "login.html";

  fetch(`${API}/books/`, {
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("bookList");
    list.innerHTML = "";
    data.forEach(book => {
      list.innerHTML += `
        <tr>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>₹${book.price}</td>
          <td>
            <button class="btn btn-info btn-sm" onclick="viewBook(${book.id})">View</button>
            <button class="btn btn-warning btn-sm" onclick="editBook(${book.id})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})">Delete</button>
          </td>
        </tr>
      `;
    });
  });
}

// ADD BOOK
function addBook() {
  const token = localStorage.getItem("access");
  fetch(`${API}/books/`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: document.getElementById("title").value,
      author: document.getElementById("author").value,
      price: parseFloat(document.getElementById("price").value)
    })
  })
  .then(res => res.json())
  .then(() => window.location.href = "books.html");
}

// DELETE BOOK
function deleteBook(id) {
  const token = localStorage.getItem("access");
  if (!confirm("Are you sure?")) return;
  fetch(`${API}/books/${id}/`, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + token }
  })
  .then(() => loadBooks());
}

// REDIRECT TO EDIT PAGE
function editBook(id) {
  localStorage.setItem("editBookId", id);
  window.location.href = "edit.html";
}

// REDIRECT TO VIEW PAGE
function viewBook(id) {
  localStorage.setItem("viewBookId", id);
  window.location.href = "view.html";
}

// AUTO LOAD BOOKS ON DASHBOARD
if (window.location.pathname.includes("books.html")) {
  window.onload = loadBooks;
}
