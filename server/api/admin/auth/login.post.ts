export default defineEventHandler(async (event) => {
  const { apiUrlBase } = useRuntimeConfig();
  const body = await readBody(event);

  const response = await $fetch.raw(
    `${apiUrlBase}/auth/login`,
    {
      method: "POST",
      body,
    }
  );

  // Forward Set-Cookie headers from backend to client
  const setCookies = response.headers.getSetCookie();
  for (const cookie of setCookies) {
    appendResponseHeader(event, "Set-Cookie", cookie);
  }

  const userResponse = response._data as Record<string, any>;

  await setUserSession(event, {
    user: userResponse.data || userResponse.data || userResponse,
  });

  return userResponse;
});
