export default defineNuxtRouteMiddleware((to) => {
  const { hasPermission } = usePermission();

  const required = to.meta.requiredPermission as string | undefined;
  if (!required) return;

  if (!hasPermission(required)) {
    return navigateTo("/");
  }
});
