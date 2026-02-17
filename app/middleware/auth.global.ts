export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, fetch: fetchSession } = useUserSession();

  // Skip auth check for public routes
  if (to.path.startsWith("/auth/")) {
    return;
  }

  if (!loggedIn.value) {
    await fetchSession();
  }

  if (!loggedIn.value) {
    return navigateTo("/auth/login");
  }
});
