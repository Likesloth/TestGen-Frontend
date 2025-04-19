// src/api/runs.js
const API = process.env.NEXT_PUBLIC_API_URL;

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function listRuns() {
  const res = await fetch(`${API}/api/runs`, {
    headers: authHeader()
  });
  return res.json();
}

export async function getRun(id) {
  const res = await fetch(`${API}/api/runs/${id}`, {
    headers: authHeader()
  });
  return res.json();
}
