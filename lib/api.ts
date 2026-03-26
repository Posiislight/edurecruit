const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const headers = new Headers(options.headers);
  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!isFormData && options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    if (window.location.pathname !== '/officer-login') {
      window.location.href = '/officer-login';
    }
  }

  return response;
}

type PaginatedResponse<T> = {
  next?: string | null
  results?: T[]
}

function toRelativeEndpoint(endpoint: string) {
  try {
    const url = new URL(endpoint)
    return `${url.pathname}${url.search}`
  } catch {
    return endpoint
  }
}

export async function fetchAllPages<T>(endpoint: string, options: RequestInit = {}) {
  const rows: T[] = []
  let nextEndpoint = endpoint

  while (nextEndpoint) {
    const response = await fetchApi(nextEndpoint, options)
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const data: T[] | PaginatedResponse<T> = await response.json()
    if (Array.isArray(data)) {
      return data
    }

    rows.push(...(data.results || []))
    nextEndpoint = data.next ? toRelativeEndpoint(data.next) : ''
  }

  return rows
}
