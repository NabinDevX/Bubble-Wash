function normalizePathSegment(p) {
  if (!p) return "";
  const s = String(p).trim();
  if (!s) return "";
  const withLeading = s.startsWith("/") ? s : `/${s}`;
  return withLeading.replace(/\/+$/, "");
}

const API_PREFIX = normalizePathSegment(
  import.meta.env.VITE_API_PREFIX || "/api/v1",
);
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/+$/,
  "",
);

const API_ROOT = (
  API_BASE_URL ? `${API_BASE_URL}${API_PREFIX}` : API_PREFIX
).replace(/\/+$/, "");

const inflightGetRequests = new Map();

export function getToken() {
  return localStorage.getItem("accessToken");
}

export function setToken(token) {
  localStorage.setItem("accessToken", token);
}

export function clearToken() {
  localStorage.removeItem("accessToken");
}

async function request(method, path, body = null) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options = { method, headers, credentials: "include" };
  if (body) options.body = JSON.stringify(body);

  const normalizedPath = String(path || "").startsWith("/")
    ? String(path || "")
    : `/${String(path || "")}`;
  const url = `${API_ROOT}${normalizedPath}`;
  const isGet = method.toUpperCase() === "GET" && !body;
  const inflightKey = isGet ? `${url}::${token ?? ""}` : null;

  if (inflightKey && inflightGetRequests.has(inflightKey)) {
    return inflightGetRequests.get(inflightKey);
  }

  const doFetch = (async () => {
    const res = await fetch(url, options);

    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      const err = new Error(data?.message || `Request failed (${res.status})`);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    if (
      data &&
      typeof data === "object" &&
      Object.prototype.hasOwnProperty.call(data, "data")
    ) {
      const inner = data.data;
      if (inner && typeof inner === "object" && !Array.isArray(inner)) {
        const merged = { ...inner };
        for (const key of ["token", "accessToken", "user", "role"]) {
          if (
            Object.prototype.hasOwnProperty.call(data, key) &&
            !Object.prototype.hasOwnProperty.call(merged, key)
          ) {
            merged[key] = data[key];
          }
        }
        return merged;
      }

      return inner;
    }

    return data;
  })();

  if (inflightKey) {
    inflightGetRequests.set(inflightKey, doFetch);
    doFetch.finally(() => inflightGetRequests.delete(inflightKey));
  }

  return doFetch;
}

const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  patch: (path, body) => request("PATCH", path, body),
  delete: (path) => request("DELETE", path),
};

export default api;
