// src/api/runs.js
export const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

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

//Dowload ECP csv only
export function downloadEcpCsv(runId) {
  return `${BASE}/api/runs/${runId}/ecp-csv`
}

//Dowload Syntax csv only
export function downloadSyntaxCsv(runId) {
  return `${BASE}/api/runs/${runId}/syntax-csv`
}

export function downloadCombinedExcel(runId) {
  return `${BASE}/api/runs/${runId}/csv`
}
