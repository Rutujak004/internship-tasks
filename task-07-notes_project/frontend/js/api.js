async function apiRequest(endpoint, method = "GET", data = null) {
  let options = {
    method,
    headers: {
      "Authorization": localStorage.getItem("access") ? `Bearer ${localStorage.getItem("access")}` : "",
      "Content-Type": "application/json"
    }
  };
  if (data) options.body = JSON.stringify(data);

  let res = await fetch(CONFIG.API_BASE + endpoint, options);

  if (res.status === 401 && localStorage.getItem("refresh")) {
    const refreshRes = await AuthAPI.refresh({ refresh: localStorage.getItem("refresh") });
    if (refreshRes.access) {
      localStorage.setItem("access", refreshRes.access);
      options.headers["Authorization"] = `Bearer ${refreshRes.access}`;
      res = await fetch(CONFIG.API_BASE + endpoint, options);
    }
  }

  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

const AuthAPI = {
  register: (data) => apiRequest("auth/register/", "POST", data),
  login: (data) => apiRequest("auth/token/", "POST", data),
  refresh: (data) => apiRequest("auth/token/refresh/", "POST", data)
};

const NotesAPI = {
  list: () => apiRequest("notes/"),
  create: (data) => apiRequest("notes/", "POST", data),
  update: (id, data) => apiRequest(`notes/${id}/`, "PUT", data),
  delete: (id) => apiRequest(`notes/${id}/`, "DELETE"),
  view: (id) => apiRequest(`notes/${id}/`),
  share: (id, username) => apiRequest(`notes/${id}/share/`, "POST", { username }),
};