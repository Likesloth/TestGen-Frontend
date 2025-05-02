// src/api/runs.js
const API = process.env.NEXT_PUBLIC_API_URL;


export async function generateTestRun(formData) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE}/api/runs`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  })
  return res.json()
}

export async function listTestRuns() {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE}/api/runs`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const { success, runs, error } = await res.json()
  return success ? runs : Promise.reject(error)
}

export async function downloadCsv(runId) {
  // returns a URL you can navigate to
  return `${BASE}/api/runs/${runId}/csv`
}
