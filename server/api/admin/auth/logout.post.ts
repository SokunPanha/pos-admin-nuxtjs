export default defineEventHandler(async (event) => {
  const { apiUrlBase } = useRuntimeConfig();

  try {
    const response = await $fetch.raw(`${apiUrlBase}/auth/logout`, {
      method: "POST",
      headers: {
        cookie: getHeader(event, "cookie") || "",
      },
    });

    // Forward Set-Cookie headers from backend (clears cookies)
    const setCookies = response.headers.getSetCookie();
    for (const cookie of setCookies) {
      appendResponseHeader(event, "Set-Cookie", cookie);
    }
  } catch {
    // Continue with clearing session even if backend call fails
  }

  await clearUserSession(event);

  return { success: true };
});