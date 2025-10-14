// src/api/runs.js
import { apiFetch, BASE_URL } from '../lib/apiClient'

export const BASE = BASE_URL

// Note: test run creation lives in `src/api/generate.js`

export async function listRuns() {
  const json = await apiFetch('/api/runs', { method: 'GET', auth: true })
  if (json?.success) return json.runs
  throw new Error(json?.error || 'Failed to fetch runs')
}

// Fetch a single run's metadata (partitions, testCases, csvUrl)
export async function getRun(runId) {
  const json = await apiFetch(`/api/runs/${runId}`, { method: 'GET', auth: true })
  if (json?.success) return json
  throw new Error(json?.error || 'Failed to fetch run')
}

// Download URLs
export function downloadEcpCsv(runId) {
  return `${BASE_URL}/api/runs/${runId}/ecp-csv`
}

export function downloadSyntaxCsv(runId) {
  return `${BASE_URL}/api/runs/${runId}/syntax-csv`
}

export function downloadStateCsv(runId) {
  return `${BASE_URL}/api/runs/${runId}/state-csv`
}

export function downloadCombinedExcel(runId) {
  return `${BASE_URL}/api/runs/${runId}/csv`
}
