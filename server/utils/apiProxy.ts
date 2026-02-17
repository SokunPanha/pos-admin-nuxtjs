import type { H3Event } from "h3";

interface ProxyOptions {
  method?: string;
  body?: any;
}

function forwardSetCookies(event: H3Event, response: Response) {
  const setCookies = response.headers.getSetCookie();
  for (const cookie of setCookies) {
    appendResponseHeader(event, "Set-Cookie", cookie);
  }
}

export async function proxyApiRequest<T = any>(
  event: H3Event,
  path: string,
  options?: ProxyOptions
): Promise<T> {
  const { apiUrlBase } = useRuntimeConfig();
  const cookie = getHeader(event, "cookie") || "";

  const fetchOptions: any = {
    method: options?.method || "POST",
    headers: { cookie },
    ...(options?.body !== undefined && { body: options.body }),
  };

  try {
    const response = await $fetch.raw(`${apiUrlBase}${path}`, fetchOptions);
    forwardSetCookies(event, response);
    return response._data as T;
  } catch (error: any) {
    // Auto-retry on 401: refresh token then retry once
    if (error?.response?.status === 401) {
      try {
        const refreshResponse = await $fetch.raw(`${apiUrlBase}/auth/refresh`, {
          method: "POST",
          headers: { cookie },
        });
        forwardSetCookies(event, refreshResponse);

        // Get updated cookies after refresh
        const refreshSetCookies = refreshResponse.headers.getSetCookie();
        const updatedCookie = refreshSetCookies.length > 0
          ? `${cookie}; ${refreshSetCookies.map((c) => c.split(";")[0]).join("; ")}`
          : cookie;

        // Retry original request with refreshed cookies
        const retryResponse = await $fetch.raw(`${apiUrlBase}${path}`, {
          ...fetchOptions,
          headers: { cookie: updatedCookie },
        });
        forwardSetCookies(event, retryResponse);
        return retryResponse._data as T;
      } catch {
        // Refresh failed — throw original 401
        throw error;
      }
    }
    throw error;
  }
}
