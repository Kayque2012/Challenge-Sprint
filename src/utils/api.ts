import { API_URL } from '../config';

/**
 * Wrapper de fetch que injeta automaticamente o header Authorization
 * quando um token JWT estiver presente em sessionStorage('authToken').
 * O backend ainda não exige token — o header só é enviado se existir.
 */
export function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const token = sessionStorage.getItem('authToken') ?? '';
  const headers = new Headers(options?.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(`${API_URL}${path}`, { ...options, headers });
}
