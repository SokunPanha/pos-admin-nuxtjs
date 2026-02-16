export default defineEventHandler(async (event) => {
  const { apiUrlBase } = useRuntimeConfig();
  const body = await readBody(event);

  const response = await $fetch<Record<string, any>>(
    `${apiUrlBase}/auth/login`,
    {
      method: "POST",
      body,
    }
  );

  console.log("Backend login response:", JSON.stringify(response, null, 2));

  await setUserSession(event, {
    user: response.user || response.data?.user || response,
  });

  return response;
});
