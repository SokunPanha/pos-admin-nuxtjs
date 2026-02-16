export default defineEventHandler(async (event) => {
  const { apiUrlBase } = useRuntimeConfig();

  try {
    await $fetch(`${apiUrlBase}/auth/logout`, {
      method: "POST",
      headers: {
        cookie: getHeader(event, "cookie") || "",
      },
    });
  } catch {
    // Continue with clearing session even if backend call fails
  }

  await clearUserSession(event);

  return { success: true };
});
