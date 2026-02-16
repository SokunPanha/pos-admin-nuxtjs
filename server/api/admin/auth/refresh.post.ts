export default defineEventHandler(async (event) => {
  const { apiUrlBase } = useRuntimeConfig();
  const session = await requireUserSession(event);

  const response = await $fetch(`${apiUrlBase}/auth/refresh`, {
    method: "POST",
    headers: {
      cookie: getHeader(event, "cookie") || "",
    },
  });

  return response;
});
