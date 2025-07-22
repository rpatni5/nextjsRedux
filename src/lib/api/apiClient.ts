export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiOptions {
  method?: RequestMethod;
  body?: any;
  headers?: HeadersInit;
  token?: string | null;
}

export const apiClient = async <T = any>(url: string, options: ApiOptions = {}): Promise<T> => {
  const { method = 'GET', body, headers, token } = options;

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }

  return res.json();
};
