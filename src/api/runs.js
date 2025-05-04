// src/api/runs.js
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function generateTestRun(formData) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE}/api/runs`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  })
  return res.json()
}

export async function listRuns() {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE}/api/runs`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const json = await res.json()
  if (json.success) return json.runs
  throw new Error(json.error || 'Failed to fetch runs')
}

// **NEW**: fetch a single run's metadata (partitions, testCases, csvUrl)
export async function getRun(runId) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE}/api/runs/${runId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const json = await res.json()
  if (json.success) return json
  throw new Error(json.error || 'Failed to fetch run')
}

export function downloadCsv(runId) {
  return `${BASE}/api/runs/${runId}/csv`
}
