// src/lib/apiClient.js

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function isFormData(body) {
  return typeof FormData !== 'undefined' && body instanceof FormData;
}

export async function apiFetch(path, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body,
    auth = true,
    baseUrl = BASE_URL,
    ...rest
  } = options;

  const finalHeaders = { ...headers };

  // Inject JSON header if body is a plain object
  let finalBody = body;
  if (body && !isFormData(body) && typeof body === 'object') {
    finalHeaders['Content-Type'] = finalHeaders['Content-Type'] || 'application/json';
    finalBody = JSON.stringify(body);
  }

  // Inject Authorization header when requested and token exists
  if (auth) {
    try {
      const token = localStorage.getItem('token');
      if (token) finalHeaders['Authorization'] = `Bearer ${token}`;
    } catch (_) {
      // ignore storage errors in non-browser contexts
    }
  }

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: finalHeaders,
    body: finalBody,
    ...rest,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const parse = async () => (isJson ? await res.json() : await res.text());
  const data = await parse();

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed: ${res.status}`;
    throw new Error(message);
  }

  return data;
}

