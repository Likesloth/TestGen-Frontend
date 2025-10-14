// src/api/generate.js
import { apiFetch } from '../lib/apiClient';

export async function generateTestRun(formData) {
  return apiFetch('/api/runs', {
    method: 'POST',
    body: formData,
    auth: true,
  });
}
