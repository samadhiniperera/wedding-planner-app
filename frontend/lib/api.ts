// const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// async function request<T>(path: string, options?: RequestInit): Promise<T> {
//   const res = await fetch(`${API_BASE}${path}`, {
//     headers: { 'Content-Type': 'application/json' },
//     ...options,
//   });
//   if (!res.ok) {
//     const body = await res.json().catch(() => ({}));
//     throw new Error(body.error || `Request failed: ${res.status}`);
//   }
//   return res.json();
// }

// export const api = {
//   get: <T>(path: string) => request<T>(path),
//   post: <T>(path: string, data: unknown) =>
//     request<T>(path, { method: 'POST', body: JSON.stringify(data) }),
//   put: <T>(path: string, data: unknown) =>
//     request<T>(path, { method: 'PUT', body: JSON.stringify(data) }),
//   del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
// };


// In production (Vercel Services) frontend and backend share one domain,
// so we call same-origin "/api/..." and let vercel.json's rewrite route it
// to the backend service. Locally, .env.local sets this to
// http://localhost:5000 since the two run as separate dev servers.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(path: string, data: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(data) }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
