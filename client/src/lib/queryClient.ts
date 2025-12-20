import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

function normalizeApiUrl(url: string) {
  // ✅ Regla: en frontend SIEMPRE usar rutas relativas /api/...
  // Si alguien pasa "api/..." lo convertimos a "/api/..."
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url; // permitimos absoluto si fuese intencional
  return url.startsWith("/") ? url : `/${url}`;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown,
): Promise<Response> {
  const normalizedUrl = normalizeApiUrl(url);

  const res = await fetch(normalizedUrl, {
    method,
    headers: {
      Accept: "application/json",
      ...(data ? { "Content-Type": "application/json" } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // react-query a veces recibe queryKey como array de strings,
    // tu patrón es ["/api/...."] así que tomamos el primero.
    const raw = Array.isArray(queryKey)
      ? String(queryKey[0])
      : String(queryKey);
    const url = normalizeApiUrl(raw);

    const res = await fetch(url, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null as any;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
