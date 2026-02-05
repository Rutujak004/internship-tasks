async function apiRequest(endpoint, method="GET", data=null) {
  const options = {
    method,
    headers: {
      "Authorization": localStorage.getItem("access") ? `Bearer ${localStorage.getItem("access")}` : "",
      "Content-Type": "application/json"
    }
  };
  if (data) options.body = JSON.stringify(data);

  const res = await fetch(CONFIG.API_BASE + endpoint, options);
  return res.json();
}

const AuthAPI = {
  register: (data) => apiRequest("auth/register/", "POST", data),
  login: (data) => apiRequest("auth/token/", "POST", data),
};

const NotesAPI = {
  list: () => apiRequest("notes/"),
  create: (data) => apiRequest("notes/", "POST", data),
  update: (id, data) => apiRequest(`notes/${id}/`, "PUT", data),
  delete: (id) => apiRequest(`notes/${id}/`, "DELETE"),
  view: (id) => apiRequest(`notes/${id}/`),
  share: (id, username) => apiRequest(`notes/${id}/share/`, "POST", { username }),
};