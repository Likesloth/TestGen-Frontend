// src/api/auth.js
import { apiFetch } from '../lib/apiClient';
import { BASE_URL } from '../lib/apiClient';

export async function register(username, email, password) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: { username, email, password },
    auth: false,
  });
}

export async function login(username, password) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: { username, password },
    auth: false,
  });
}

// NEW: request a reset link
export async function requestPasswordReset(email) {
  return apiFetch('/api/auth/sent-request-forget-password', {
    method: 'POST',
    body: { email },
    auth: false,
  });
}

// NEW: actually reset the password
export async function resetPassword(token, newPassword) {
  return apiFetch('/api/auth/reset-password', {
    method: 'POST',
    body: { token, newPassword },
    auth: false,
  });
}

// Compatibility: some parts of the app import BASE
export const BASE = BASE_URL;
