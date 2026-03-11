import Constants from 'expo-constants';

type ApiErrorOptions = {
  status: number;
  data?: unknown;
};

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, options: ApiErrorOptions) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.data = options.data;
  }
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

const apiUrlFromConfig =
  Constants.expoConfig?.extra?.apiUrl ??
  Constants.manifest?.extra?.apiUrl ??
  Constants.manifest2?.extra?.apiUrl;

const normalizedApiUrl = typeof apiUrlFromConfig === 'string'
  ? apiUrlFromConfig.replace(/\/$/, '')
  : '';

export function getApiUrl() {
  if (!normalizedApiUrl) {
    throw new Error('API URL is missing. Set expo.extra.apiUrl in app.json.');
  }

  return normalizedApiUrl;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${getApiUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers ?? {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === 'object' && data && 'error' in data
        ? String((data as { error: unknown }).error)
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, { status: response.status, data });
  }

  return data as T;
}
