const DEFAULT_API_BASE_URL = "http://127.0.0.1:4000/api";

export function getApiBaseUrl() {
  const publicApiUrl = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

  if (publicApiUrl) {
    return publicApiUrl;
  }

  if (typeof window === "undefined") {
    const serverApiUrl = normalizeApiBaseUrl(process.env.API_URL);

    if (serverApiUrl) {
      return serverApiUrl;
    }
  }

  return DEFAULT_API_BASE_URL;
}

export function getApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${getApiBaseUrl()}${normalizedPath}`;
}

function normalizeApiBaseUrl(value: string | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return null;
  }

  return trimmedValue.replace(/\/+$/, "");
}
