export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, fetch: fetchSession } = useUserSession();
  console.log("🚀 ~ loggedIn:", loggedIn.value)

  // Skip auth check for public routes
  if (to.path.startsWith("/auth/")) {
    return;
  }

  if (!loggedIn.value) {
    await fetchSession();
  }
  console.log("🚀 ~ loggedIn:", loggedIn.value)

  if (!loggedIn.value) {
    return navigateTo("/auth/login");
  }
});
