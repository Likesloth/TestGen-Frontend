// src/api/generate.js
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function generateTestRun(formData) {
  const token = localStorage.getItem('token') || '';
  const res = await fetch(`${API}/api/runs`, {
    method: 'POST',
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    },
    body: formData
  });
  return res.json();
}
