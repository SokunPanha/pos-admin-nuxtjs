export default defineEventHandler(async (event) => {
  const { apiUrlBase } = useRuntimeConfig();

  const response = await $fetch.raw(`${apiUrlBase}/auth/refresh`, {
    method: "POST",
    headers: {
      cookie: getHeader(event, "cookie") || "",
    },
  });

  // Forward Set-Cookie headers from backend to client
  const setCookies = response.headers.getSetCookie();
  for (const cookie of setCookies) {
    appendResponseHeader(event, "Set-Cookie", cookie);
  }

  return response._data;
});